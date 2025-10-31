interface FormulaItemProps {
  children: React.ReactNode;
}

export default function FormulaItem({ children }: FormulaItemProps) {
  return (
    <div className="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md text-base">
      {children}
    </div>
  );
}
