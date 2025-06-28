export const PostTitleHolder = ({ title }: { title: string }) => {
  return title.startsWith("「") ? (
    <span className="inline-block" style={{ textIndent: "-0.5em" }}>
      {title}
    </span>
  ) : (
    <span className="inline-block">{title}</span>
  );
};
