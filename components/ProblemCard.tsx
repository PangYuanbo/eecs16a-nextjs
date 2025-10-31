'use client';

import { ExamProblem } from '@/types';
import { useState, useEffect } from 'react';

interface ProblemCardProps {
  problem: ExamProblem;
  examName?: string;
}

export default function ProblemCard({ problem, examName }: ProblemCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showAnswer && !answer && !loading) {
      loadAnswer();
    }
  }, [showAnswer]);

  useEffect(() => {
    // Trigger MathJax typesetting when answer is shown
    if (showAnswer && answer) {
      const typeset = () => {
        const MathJax = (window as any).MathJax;
        if (MathJax && MathJax.typesetPromise) {
          MathJax.typesetPromise()
            .catch((err: any) => console.error('MathJax error in answer:', err));
        } else {
          setTimeout(typeset, 100);
        }
      };
      setTimeout(typeset, 50);
    }
  }, [showAnswer, answer]);

  const loadAnswer = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/problem_answers.json');
      const data = await response.json();

      // Find the answer by matching title
      const answerKey = Object.keys(data).find(key => {
        const ans = data[key];
        return ans.title === problem.title;
      });

      if (answerKey && data[answerKey].answer) {
        setAnswer(data[answerKey].answer);
      } else {
        setAnswer('暂无详细解答');
      }
    } catch (error) {
      console.error('Failed to load answer:', error);
      setAnswer('加载失败');
    }
    setLoading(false);
  };

  const formatAnswer = (text: string) => {
    // Convert markdown-style bold to HTML
    let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Convert bullet points
    formatted = formatted.replace(/^• /gm, '&nbsp;&nbsp;• ');

    // Preserve line breaks
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  };

  return (
    <div className="problem-card">
      <div className="flex justify-between items-center mb-2">
        <strong className="text-base">
          {problem.title}
        </strong>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          来自 {examName || problem.exam}
        </span>
      </div>

      <div
        className="text-sm whitespace-pre-wrap leading-relaxed"
        dangerouslySetInnerHTML={{ __html: problem.snippet }}
      />

      {loading && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          ⏳ 加载答案中...
        </div>
      )}

      {showAnswer && answer && (
        <div className="answer-box mt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📝</span>
            <strong className="text-base">核心解答</strong>
          </div>
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatAnswer(answer) }}
          />
        </div>
      )}

      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
      >
        {showAnswer ? '🔼 隐藏解答' : '🔽 显示解答'}
      </button>
    </div>
  );
}
