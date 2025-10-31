// 考题主题类型
export type Topic =
  // Signal Processing
  | 'complex-exponentials'
  | 'dtfs-dft'
  // Linear Algebra Advanced
  | 'gram-schmidt-qr'
  | 'fundamental-subspaces'
  | 'rank-nullspace'
  // Data Analysis
  | 'least-squares'
  // Systems Analysis
  | 'eigenanalysis'
  | 'state-space'
  // Basic Linear Algebra
  | 'vectors-matrices'
  | 'other';

// 单个考题类型
export interface ExamProblem {
  title: string;
  topic: Topic;
  snippet: string;
  exam: string;
}

// 考试数据类型
export interface ExamData {
  sourceExam: string;
  problems: ExamProblem[];
}

// 完整数据结构类型
export interface ExamCollection {
  [examId: string]: ExamData;
}

// 主题信息类型
export interface TopicInfo {
  id: Topic;
  name: string;
  color: string;
}

// 搜索结果类型
export interface SearchResult extends ExamProblem {
  examName: string;
  matchScore?: number;
}
