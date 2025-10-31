'use client';

import { useEffect, useRef } from 'react';

interface MathTextProps {
  children: string;
  display?: boolean;
}

export default function MathText({ children, display = false }: MathTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise([ref.current]).catch((err: any) =>
        console.error('MathJax typesetting failed:', err)
      );
    }
  }, [children]);

  return (
    <span
      ref={ref}
      className={display ? 'block text-center my-2' : 'inline'}
      dangerouslySetInnerHTML={{
        __html: display ? `\\[${children}\\]` : `\\(${children}\\)`,
      }}
    />
  );
}
