export const Typography = ({ html }: { html: string }) => {
  console.log("typography", html);
  return (
    <div className="typography">
      <div dangerouslySetInnerHTML={{ __html: html }} suppressHydrationWarning={true} />
    </div>
  );
};
