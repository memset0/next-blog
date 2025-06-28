/*
  lib/posts.ts

  本文件用于处理单个 Markdown 文件的相关数据，特别是 FrontMatter 中的数据，并将其转化为 fields 的形式。
*/

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// 1. 定义数据结构类型

// Front Matter 的数据结构
export type PostFrontmatter = {
  title?: string;
  [key: string]: any;
};

// 中间件生成的 fields 字段结构
export type PostFields = {
  slug: string;
  path: string;
  filePath: string;

  published: boolean; // 是否会在主页显示
  indexed: boolean; // 是否会被索引

  title: string;
  publishedTitle: string;

  description: string;

  tags: string[];

  createTime: number;
  updateTime: number;
  publishTime: number;

  cover: string | null;

  readingTime: number;
};

// 博文列表项的数据结构 (不含正文)
export type Post = {
  id: string;
  frontmatter: PostFrontmatter;
  fields: PostFields;
};

// 单篇博文的完整数据结构 (包含正文 HTML)
export type PostWithContent = Post & {
  contentHtml: string;
};

const postsDirectory = path.join(process.cwd(), "content");

/**
 * 递归获取目录中所有的 .md 文件路径
 * @param dir - 要搜索的目录路径
 * @param baseDir - 基础目录路径，用于计算相对路径
 * @returns 返回所有 .md 文件的相对路径数组
 */
function getAllMarkdownFiles(dir: string, baseDir: string = dir): string[] {
  const items = fs.readdirSync(dir);
  let mdFiles: string[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归处理子目录
      mdFiles = mdFiles.concat(getAllMarkdownFiles(fullPath, baseDir));
    } else if (stat.isFile() && item.endsWith(".md")) {
      // 计算相对于基础目录的路径
      const relativePath = path.relative(baseDir, fullPath);
      mdFiles.push(relativePath);
    }
  }

  return mdFiles;
}

/**
 * 根据文件路径生成唯一的 slug
 * @param filePath - 文件的相对路径
 * @returns 生成的 slug
 */
function generateSlugFromPath(filePath: string): string {
  filePath = filePath.replace(/\\/g, "/");
  if (filePath.endsWith("/index.md")) {
    return filePath.replace(/\/index\.md$/, "");
  } else {
    return filePath.replace(/\.md$/, "");
  }
}

/**
 * 中间件函数：处理和增强从 front-matter 解析出的数据
 * @param filePath - 博文的相对路径
 * @param matterResult - gray-matter 解析后的对象
 */
function enrichPostData(filePath: string, matterResult: matter.GrayMatterFile<string>): Post {
  const frontmatter = matterResult.data as PostFrontmatter;
  const slug = generateSlugFromPath(filePath);

  const wordsPerMinute = 200;
  const numberOfWords = matterResult.content.split(/\s/g).length;
  const readingTime = Math.ceil(numberOfWords / wordsPerMinute);

  function appendToList(list: string[], item: string | string[] | undefined) {
    if (!item) {
      return;
    } else if (typeof item === "string") {
      list.push(item);
    } else if (Array.isArray(item)) {
      for (const tag of item) {
        list.push(tag);
      }
    }
  }

  // 过滤 frontmatter 中的所有元素，确保全部可序列化（如果是 Date 需要转换成字符串）
  const filteredFrontmatter = Object.fromEntries(
    Object.entries(frontmatter).map(([key, value]) => {
      if (value instanceof Date) {
        return [key, value.toISOString()];
      }
      return [key, value];
    })
  );

  // 关于 title 的处理
  let title = frontmatter.title || "Untitled Post";

  // 关于 description 的处理
  let description: string;
  const splitedContent = matterResult.content.split("<!-- more -->");
  if (splitedContent.length >= 2) {
    description = splitedContent[0];
  } else {
    description = matterResult.content.slice(0, 200);
  }

  // 关于 publish / index 以及 publishedTitle 的处理
  let publishedTitle: string | null =
    frontmatter.publishedTitle ||
    frontmatter.publishTitle ||
    frontmatter["published-title"] ||
    frontmatter["publish-title"] ||
    null;
  let published = !!frontmatter.publish || !!frontmatter.published || false;
  let indexed = !!frontmatter.index || !!frontmatter.indexed || false;
  if (publishedTitle !== null) {
    published = true; // 如果有设置 publishedTitle 则自动发布
  } else {
    publishedTitle = title;
  }
  if (!indexed && published) {
    indexed = published;
  }

  // 关于 tags 的提取和处理
  let tags: string[] = [];
  appendToList(tags, frontmatter.tag);
  appendToList(tags, frontmatter.tags);

  // 关于 createTime / updateTime / publishTime 的处理
  let createTime: string | Date | null =
    frontmatter.date ||
    frontmatter.createTime ||
    frontmatter["create-time"] ||
    frontmatter.createdTime ||
    frontmatter["created-time"] ||
    frontmatter.createDate ||
    frontmatter["create-date"] ||
    frontmatter.createdDate ||
    frontmatter["created-date"] ||
    null;
  let updateTime: string | Date | null =
    frontmatter.updateTime ||
    frontmatter["update-time"] ||
    frontmatter.updateDate ||
    frontmatter["update-date"] ||
    frontmatter.updatedTime ||
    frontmatter["updated-time"] ||
    frontmatter.updatedDate ||
    frontmatter["updated-date"] ||
    null;
  let publishTime: string | Date | null =
    frontmatter.publishTime ||
    frontmatter["publish-time"] ||
    frontmatter.publishDate ||
    frontmatter["publish-date"] ||
    frontmatter.publishedTime ||
    frontmatter["published-time"] ||
    frontmatter.publishedDate ||
    frontmatter["published-date"] ||
    null;

  if (createTime === null) {
    createTime = new Date();
  }
  if (updateTime === null) {
    updateTime = createTime;
  }
  if (publishTime === null) {
    publishTime = createTime;
  }
  function convertToTimestamp(date: string | Date | null): number {
    if (date === null) {
      return 0;
    } else if (typeof date === "string") {
      return new Date(date).getTime();
    } else {
      return date.getTime();
    }
  }

  // 关于 cover 的处理
  // 这里采取临时方案，所有图片仍然是从网络加载的
  let cover: string | null = null;
  if (frontmatter.cover && frontmatter.cover.startsWith("https://")) {
    cover = frontmatter.cover;
  }

  return {
    // 将原始的 front-matter 数据展开，确保 date 是字符串
    id: slug,
    frontmatter: filteredFrontmatter,
    // 创建我们自定义的 fields 对象
    fields: {
      slug,
      path: `/${slug}/`,
      filePath: filePath,
      published,
      indexed,
      title,
      publishedTitle,
      description,
      tags,
      createTime: convertToTimestamp(createTime),
      updateTime: convertToTimestamp(updateTime),
      publishTime: convertToTimestamp(publishTime),
      cover,
      readingTime: readingTime,
    },
  };
}

export function getSortedPostsData(): Post[] {
  const markdownFiles = getAllMarkdownFiles(postsDirectory);

  const allPostsData = markdownFiles.map(filePath => {
    const fullPath = path.join(postsDirectory, filePath);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    // --- 使用中间件处理数据 ---
    return enrichPostData(filePath, matterResult);
  });

  return allPostsData.sort((a, b) => {
    return b.fields.createTime - a.fields.createTime;
  });
}

// 这个类型是给 getStaticPaths 使用的
type PathParams = {
  params: {
    slug: string[];
  };
};

export function getAllPostIds(): PathParams[] {
  const markdownFiles = getAllMarkdownFiles(postsDirectory);

  return markdownFiles.map(filePath => {
    const slug = generateSlugFromPath(filePath);
    return {
      params: {
        slug: slug.split("/"),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<PostWithContent> {
  // 从 slug 找到对应的文件路径
  const markdownFiles = getAllMarkdownFiles(postsDirectory);
  const filePath = markdownFiles.find(fp => generateSlugFromPath(fp) === slug);

  if (!filePath) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const fullPath = path.join(postsDirectory, filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  const enrichedData = enrichPostData(filePath, matterResult);

  return {
    ...enrichedData,
    contentHtml,
  };
}
