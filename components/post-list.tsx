import Link from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Chip } from "@heroui/chip";
import type { Post } from "@/lib/posts";

interface PostListProps {
  allPostsData: Post[];
}

export default function PostList({ allPostsData }: PostListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {allPostsData.map(({ id, fields }) => (
        <Link key={id} href={fields.path} className="block w-full">
          <Card
            isPressable
            className="transition-all duration-200 hover:scale-[1.02] w-full"
            classNames={{
              base: "data-[pressed=true]:scale-[0.98] bg-content1 hover:bg-content2",
            }}
          >
            <CardHeader className="pb-0 pt-4 px-6">
              <div className="flex flex-col w-full">
                <span className="text-xl font-semibold text-foreground">{fields.title}</span>
                <Spacer y={2} />
                <div className="flex items-center gap-4 text-small text-default-500">
                  <span>{fields.createTime}</span>
                  <Chip variant="flat" size="sm" color="primary">
                    {fields.readingTime} min read
                  </Chip>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-2">123</CardBody>
          </Card>
        </Link>
      ))}

      {allPostsData.length === 0 && (
        <Card className="mt-8">
          <CardBody className="text-center py-12">
            <h3 className="text-xl font-semibold text-default-600 mb-2">暂无文章</h3>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
