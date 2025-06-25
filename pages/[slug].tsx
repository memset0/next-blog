import type {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticPropsContext,
} from "next";
import type { PostWithContent } from "@/lib/posts";

import Head from "next/head";

import { getAllPostIds, getPostData } from "@/lib/posts";

// 定义 getStaticPaths 的返回类型
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

// 定义 getStaticProps 的返回类型，并为 context 添加类型
export const getStaticProps: GetStaticProps<{ postData: PostWithContent }> = async (
  context: GetStaticPropsContext
) => {
  const { slug } = context.params as { slug: string };
  const postData = await getPostData(slug);
  return {
    props: {
      postData,
    },
  };
};

// 再次使用 InferGetStaticPropsType 推断 props 类型
type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Post({ postData }: Props) {
  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "2rem" }}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 style={{ fontSize: "2.5rem" }}>{postData.title}</h1>
        <div style={{ color: "#666", marginBottom: "2rem" }}>
          {postData.date} by {postData.author}
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </div>
  );
}
