interface FormulaBoxProps {
  title?: string;
  children?: React.ReactNode;
  html?: string;
}

export default function FormulaBox({ title = "📐 重要公式", children, html }: FormulaBoxProps) {
  return (
    <div className="p-5 mb-5 rounded-lg border-l-4 border-purple-600 bg-purple-50 dark:bg-purple-950/30">
      <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        {title}
      </h4>
      <div className="text-gray-700 dark:text-gray-300 space-y-3">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
