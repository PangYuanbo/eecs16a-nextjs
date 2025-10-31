interface TipsBoxProps {
  title?: string;
  children?: React.ReactNode;
  html?: string;
}

export default function TipsBox({ title = "💡 解题技巧", children, html }: TipsBoxProps) {
  return (
    <div className="p-5 mb-5 rounded-lg border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
      <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        {title}
      </h4>
      <div className="text-gray-700 dark:text-gray-300 space-y-2">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
