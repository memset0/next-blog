import type {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticPropsContext,
} from "next";
import type { PostWithContent } from "@/lib/posts";

import Head from "next/head";

import { getAllPostIds, getPostData } from "@/lib/posts";
import DefaultLayout from "@/layouts/default";

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

export default function BlogPost({ postData }: Props) {
  if (!postData) {
    return (
      <DefaultLayout>
        <div>Post not found</div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <div className="text-gray-600 mb-8">{postData.date}</div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </DefaultLayout>
  );
}
