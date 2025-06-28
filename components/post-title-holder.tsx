export const PostTitleHolder = ({ title }: { title: string }) => {
  return title.startsWith("「") ? (
    <span className="inline-block -indent-2">{title}</span>
  ) : (
    <span className="inline-block">{title}</span>
  );
};
