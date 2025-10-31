interface ConceptBoxProps {
  title?: string;
  children?: React.ReactNode;
  html?: string;
}

export default function ConceptBox({ title = "📚 核心概念", children, html }: ConceptBoxProps) {
  return (
    <div className="p-5 mb-5 rounded-lg border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-950/30">
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
