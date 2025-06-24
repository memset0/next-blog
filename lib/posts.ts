/*
  lib/posts.ts

  本文件用于处理单个 Markdown 文件的相关数据，特别是 FrontMatter 中的数据，并将其转化为 fields 的形式。
*/

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// 1. 定义数据结构类型

// Front Matter 的数据结构
export type PostFrontmatter = {
  title: string;
  date: string;
  author: string;
};

// 中间件生成的 fields 字段结构
export type PostFields = {
  slug: string;
  path: string;
  createTime: string;
  readingTime: number;
};

// 博文列表项的数据结构 (不含正文)
export type Post = PostFrontmatter & {
  id: string;
  fields: PostFields;
};

// 单篇博文的完整数据结构 (包含正文 HTML)
export type PostWithContent = Post & {
  contentHtml: string;
};


const postsDirectory = path.join(process.cwd(), 'content');

/**
 * 中间件函数：处理和增强从 front-matter 解析出的数据
 * @param id - 博文的 slug (即文件名)
 * @param matterResult - gray-matter 解析后的对象
 */
function enrichPostData(id: string, matterResult: matter.GrayMatterFile<string>): Post {
  const frontmatter = matterResult.data as PostFrontmatter;

  const wordsPerMinute = 200;
  const numberOfWords = matterResult.content.split(/\s/g).length;
  const readingTime = Math.ceil(numberOfWords / wordsPerMinute);

  return {
    id,
    // 将原始的 front-matter 数据展开，确保 date 是字符串
    ...frontmatter,
    date: frontmatter.date.toString(),
    // 创建我们自定义的 fields 对象
    fields: {
      slug: id,
      path: `/${id}/`,
      createTime: frontmatter.date.toString(),
      readingTime: readingTime,
    },
  };
}

export function getSortedPostsData(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    // --- 使用中间件处理数据 ---
    return enrichPostData(id, matterResult);
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 这个类型是给 getStaticPaths 使用的
type PathParams = {
  params: {
    slug: string;
  };
};

export function getAllPostIds(): PathParams[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<PostWithContent> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  
  const enrichedData = enrichPostData(slug, matterResult);

  return {
    ...enrichedData,
    contentHtml,
  };
}