import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { Post } from "@/lib/posts";

import Head from "next/head";

import { getSortedPostsData } from "@/lib/posts";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import PostList from "@/components/post-list";

// 使用 GetStaticProps 类型来定义 getStaticProps 函数
export const getStaticProps: GetStaticProps<{ allPostsData: Post[] }> = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

// 使用 InferGetStaticPropsType 从 getStaticProps 推断出 Home 组件的 props 类型
type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({ allPostsData }: Props) {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          {/* <h1 className={title({ color: "violet" })}>我的静态博客</h1>
          <Spacer y={4} />
          <h2 className={subtitle({ class: "mt-4" })}>
            欢迎来到我的技术分享空间，在这里记录学习和思考的点点滴滴。
          </h2> */}
        </div>
      </section>

      <main className="max-w-4xl mx-auto">
        <PostList allPostsData={allPostsData.filter(post => post.fields.published)} />
      </main>
    </DefaultLayout>
  );
}
