import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import type { Post } from '@/lib/posts'; // 导入我们定义的类型

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
    <div style={{ maxWidth: '768px', margin: '0 auto', padding: '2rem' }}>
      <Head>
        <title>我的静态博客</title>
        <meta name="description" content="一个使用 Next.js 构建的静态博客" />
      </Head>

      <header>
        <h1 style={{ fontSize: '2.5rem' }}>我的静态博客</h1>
        <p style={{ color: '#666' }}>欢迎来到我的技术分享空间。</p>
      </header>

      <main>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>最新文章</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allPostsData.map(({ id, title, author, fields }) => (
            <li key={id} style={{ marginBottom: '1.5rem' }}>
              <Link href={fields.path} style={{ textDecoration: 'none', color: '#0070f3' }}>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{title}</h3>
              </Link>
              <small style={{ color: '#888' }}>
                {fields.createTime} by {author}
                <span style={{ marginLeft: '10px' }}>· {fields.readingTime} min read</span>
              </small>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}