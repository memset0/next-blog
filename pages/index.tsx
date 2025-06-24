import Head from 'next/head';
import Link from 'next/link';

import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Spacer } from '@heroui/spacer';
import { Chip } from '@heroui/chip';

import { getSortedPostsData } from '@/lib/posts';
import type { Post } from '@/lib/posts';

import { title, subtitle } from '@/components/primitives';

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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Head>
        <title>我的静态博客</title>
        <meta name="description" content="一个使用 Next.js 构建的静态博客" />
      </Head>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title({ color: 'violet' })}>我的静态博客</h1>
          <Spacer y={4} />
          <h2 className={subtitle({ class: 'mt-4' })}>欢迎来到我的技术分享空间，在这里记录学习和思考的点点滴滴。</h2>
        </div>
      </section>

      <Divider className="my-8" />

      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">最新文章</h2>
          <p className="text-lg text-default-600">探索最新的技术文章和见解</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {allPostsData.map(({ id, title: postTitle, author, fields }) => (
            <Card key={id} className="hover:shadow-lg transition-shadow duration-300" isPressable>
              <CardHeader className="pb-0 pt-4 px-6">
                <div className="flex flex-col w-full">
                  <Link href={fields.path} className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                    {postTitle}
                  </Link>
                  <Spacer y={2} />
                  <div className="flex items-center gap-4 text-small text-default-500">
                    <span>{fields.createTime}</span>
                    <span>by {author}</span>
                    <Chip variant="flat" size="sm" color="primary">
                      {fields.readingTime} min read
                    </Chip>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-2">
                <p className="text-default-600 text-small">点击阅读这篇文章...</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {allPostsData.length === 0 && (
          <Card className="mt-8">
            <CardBody className="text-center py-12">
              <h3 className="text-xl font-semibold text-default-600 mb-2">暂无文章</h3>
              <p className="text-default-500">正在准备精彩的内容，敬请期待！</p>
            </CardBody>
          </Card>
        )}
      </main>
    </div>
  );
}
