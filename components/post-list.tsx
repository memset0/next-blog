import Link from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import type { Post } from "@/lib/posts";
import { displayDate } from "@/utils/metadata";

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
            className="transition-all duration-300 hover:scale-[1.02] w-full"
            classNames={{
              base: "data-[pressed=true]:scale-[0.98] bg-content1 hover:bg-content2",
            }}
          >
            {fields.cover ? (
              // 有封面的布局
              <div className="flex flex-col md:flex-row h-full">
                {/* 桌面端左侧，手机端下方：内容区域 */}
                <div className="flex-1 flex flex-col order-2 md:order-1 md:w-3/5">
                  <CardHeader className="pb-0 pt-4">
                    <div className="flex flex-col w-full">
                      <span className="text-xl font-semibold text-foreground text-left">
                        {fields.title}
                      </span>
                      <Spacer y={2} />
                      <div className="flex items-center gap-4 text-small text-default-500">
                        <span>创建于 {displayDate(fields.createTime)}</span>
                        {fields.createTime !== fields.updateTime && (
                          <span>更新于 {displayDate(fields.updateTime)}</span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-2 flex-1">
                    <div
                      dangerouslySetInnerHTML={{ __html: fields.description.replace(/> /g, "") }}
                    />
                  </CardBody>
                </div>

                {/* 桌面端右侧，手机端上方：封面图片 */}
                <div className="w-full md:w-2/5 order-1 md:order-2 flex">
                  <Image
                    src={fields.cover}
                    alt={fields.title}
                    className="w-full h-full min-h-80 object-cover object-center"
                    classNames={{
                      img: "w-full h-full min-h-80 object-cover object-center",
                      wrapper: "w-full h-full min-h-80 flex",
                    }}
                    radius="none"
                  />
                </div>
              </div>
            ) : (
              // 没有封面的原始布局
              <>
                <CardHeader className="pb-0 pt-4">
                  <div className="flex flex-col w-full">
                    <span className="text-xl font-semibold text-foreground text-left">
                      {fields.title}
                    </span>
                    <Spacer y={2} />
                    <div className="flex items-center gap-4 text-small text-default-500">
                      <span>创建于 {displayDate(fields.createTime)}</span>
                      {fields.createTime !== fields.updateTime && (
                        <span>更新于 {displayDate(fields.updateTime)}</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: fields.description.replace(/> /g, "") }}
                  />
                </CardBody>
              </>
            )}
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
