'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ProblemCard from '@/components/ProblemCard';
import ConceptBox from '@/components/ConceptBox';
import FormulaBox from '@/components/FormulaBox';
import TipsBox from '@/components/TipsBox';
import { useTheme } from '@/components/ThemeProvider';
import { ExamCollection, ExamProblem } from '@/types';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mt2Data, setMt2Data] = useState<ExamCollection | null>(null);
  const [mt3Data, setMt3Data] = useState<ExamCollection | null>(null);
  const [hwData, setHwData] = useState<ExamCollection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/mt2_examples.json').then(res => res.json()),
      fetch('/data/mt3_examples.json').then(res => res.json()),
      fetch('/data/hw_problems.json').then(res => res.json())
    ])
      .then(([mt2, mt3, hw]) => {
        setMt2Data(mt2);
        setMt3Data(mt3);
        setHwData(hw);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load exam data:', err);
        setLoading(false);
      });
  }, []);

  // Trigger MathJax typesetting when content loads
  useEffect(() => {
    if (!loading) {
      const typeset = () => {
        const MathJax = (window as any).MathJax;
        if (MathJax && MathJax.typesetPromise) {
          MathJax.typesetPromise()
            .then(() => {
              console.log('Math typeset complete');
            })
            .catch((err: any) => console.error('MathJax error:', err));
        } else {
          // MathJax not loaded yet, try again
          setTimeout(typeset, 100);
        }
      };
      typeset();
    }
  }, [loading, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleNavigate = (sectionId: string) => {
    if (!sectionId) {
      setSidebarOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSidebarOpen(false);
    }
  };

  const getProblemsByTopic = (topic: string): ExamProblem[] => {
    const problems: ExamProblem[] = [];

    // Collect problems from MT2
    if (mt2Data) {
      Object.values(mt2Data).forEach((exam) => {
        exam.problems.forEach((problem) => {
          if (problem.topic === topic) {
            problems.push(problem);
          }
        });
      });
    }

    // Collect problems from MT3
    if (mt3Data) {
      Object.values(mt3Data).forEach((exam) => {
        exam.problems.forEach((problem) => {
          if (problem.topic === topic) {
            problems.push(problem);
          }
        });
      });
    }

    // Collect problems from HW
    if (hwData) {
      Object.values(hwData).forEach((exam) => {
        exam.problems.forEach((problem) => {
          if (problem.topic === topic) {
            problems.push(problem);
          }
        });
      });
    }

    // Filter by search query
    if (searchQuery) {
      return problems.filter(
        (p) =>
          p.snippet.toLowerCase().includes(searchQuery) ||
          p.title.toLowerCase().includes(searchQuery)
      );
    }

    return problems;
  };

  return (
    <div className="min-h-screen">
      <Header onSearch={handleSearch} onThemeToggle={toggleTheme} isDark={theme === 'dark'} />
      <Sidebar isOpen={sidebarOpen} onNavigate={handleNavigate} />

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed left-2.5 top-[70px] z-50 px-3.5 py-2 rounded-full bg-white/20 dark:bg-gray-700 shadow-md backdrop-blur-sm"
      >
        目录
      </button>

      <main className="lg:ml-sidebar mt-header p-6">
        {loading && <div className="text-center py-10"><p className="text-lg">加载中...</p></div>}

        {!loading && (
          <>
            {/* 1. Signal Processing */}
            <section className="mb-7" id="signal-processing">
              <h2 className="text-2xl font-bold mb-4">1. 信号处理</h2>

              <div className="mb-5" id="complex-exponentials">
                <h3 className="text-xl font-semibold mb-3">1.1 Complex Exponentials & Periodicity</h3>

                <ConceptBox html={`
                  <p>复指数信号是信号处理中的核心工具，它将时域信号与频域分析连接起来。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>复指数信号</strong>：形式为 \\(x[n] = Ae^{j\\omega n}\\)，其中 \\(A\\) 是幅度，\\(\\omega\\) 是频率</li>
                    <li><strong>周期性</strong>：信号满足 \\(x[n] = x[n+N]\\) 时称为周期信号，最小的 \\(N\\) 称为基本周期 \\(N_0\\)</li>
                    <li><strong>叠加原理</strong>：多个周期信号之和的周期是各自周期的最小公倍数（LCM）</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>欧拉公式（Euler's Formula）：</strong><br />
                    \\[e^{j\\theta} = \\cos\\theta + j\\sin\\theta\\]
                    <p class="text-sm mt-1">将复指数与三角函数联系起来</p>
                  </div>
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>余弦与正弦的复数表示：</strong><br />
                    \\[\\cos(\\omega n) = \\frac{e^{j\\omega n} + e^{-j\\omega n}}{2}\\]
                    \\[\\sin(\\omega n) = \\frac{e^{j\\omega n} - e^{-j\\omega n}}{2j}\\]
                  </div>
                `} />

                <TipsBox html={`
                  <ul class="list-disc list-inside space-y-1">
                    <li>判断周期性时，检查 \\(\\omega N / (2\\pi)\\) 是否为有理数</li>
                    <li>多个信号叠加时，先分别求各自周期，再求 LCM</li>
                    <li>记住 \\(e^{j\\pi} = -1\\) 这个特殊值（欧拉恒等式的一部分）</li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('complex-exponentials').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>

              <div className="mb-5" id="dtfs-dft">
                <h3 className="text-xl font-semibold mb-3">1.2 Discrete-Time Fourier Series (DTFS/DFT)</h3>

                <ConceptBox html={`
                  <p>离散时间傅里叶级数（DTFS）是周期信号的频域表示方法，允许我们将时域信号分解为不同频率的复指数信号之和。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>频域表示</strong>：将周期信号表示为频率分量的加权和</li>
                    <li><strong>双向性</strong>：可以在时域和频域之间自由转换</li>
                    <li><strong>能量守恒</strong>：Parseval 定理保证时域和频域的能量相等</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>分析方程（Analysis Equation）：</strong><br />
                    \\[X[k] = \\frac{1}{N}\\sum_{n=0}^{N-1} x[n]e^{-j2\\pi kn/N}\\]
                    <p class="text-sm mt-1">将时域信号转换为频域系数</p>
                  </div>
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>综合方程（Synthesis Equation）：</strong><br />
                    \\[x[n] = \\sum_{k=0}^{N-1} X[k]e^{j2\\pi kn/N}\\]
                    <p class="text-sm mt-1">从频域系数重构时域信号</p>
                  </div>
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>Parseval 恒等式：</strong><br />
                    \\[\\frac{1}{N}\\sum_{n=0}^{N-1}|x[n]|^2 = \\sum_{k=0}^{N-1}|X[k]|^2\\]
                    <p class="text-sm mt-1">时域能量 = 频域能量</p>
                  </div>
                `} />

                <TipsBox title="💡 关键性质与技巧" html={`
                  <ul class="list-disc list-inside space-y-1">
                    <li><strong>线性性</strong>：\\(\\alpha x_1[n] + \\beta x_2[n] \\leftrightarrow \\alpha X_1[k] + \\beta X_2[k]\\)</li>
                    <li><strong>时移</strong>：\\(x[n-n_0] \\leftrightarrow X[k]e^{-j2\\pi kn_0/N}\\)</li>
                    <li><strong>实信号的共轭对称性</strong>：若 \\(x[n]\\) 为实数，则 \\(X[k] = X^*[-k]\\)</li>
                    <li>应用：频谱分析、滤波器设计、信号压缩</li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('dtfs-dft').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Linear Algebra Advanced */}
            <section className="mb-7" id="linear-algebra-advanced">
              <h2 className="text-2xl font-bold mb-4">2. 线性代数进阶</h2>

              <div className="mb-5" id="gram-schmidt-qr">
                <h3 className="text-xl font-semibold mb-3">2.1 Gram-Schmidt & QR Decomposition</h3>

                <ConceptBox html={`
                  <p>Gram-Schmidt 过程是将一组线性无关向量正交化的算法，QR 分解则是其矩阵形式的应用。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>正交化</strong>：将线性无关向量转换为正交向量组</li>
                    <li><strong>标准正交基</strong>：正交化后再归一化，得到长度为 1 的正交向量</li>
                    <li><strong>QR 分解</strong>：将矩阵分解为正交矩阵 \\(Q\\) 和上三角矩阵 \\(R\\) 的乘积</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>Gram-Schmidt 算法：</strong><br />
                    \\[v_k = a_k - \\sum_{i=1}^{k-1}\\langle a_k, q_i\\rangle q_i\\]
                    \\[q_k = \\frac{v_k}{\\|v_k\\|}\\]
                    <p class="text-sm mt-1">从输入向量 \\(a_k\\) 中减去在已有正交向量上的投影，然后归一化</p>
                  </div>
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>QR 分解：</strong><br />
                    \\[A = QR\\]
                    <p class="text-sm mt-1">其中 \\(Q^TQ = I\\)（\\(Q\\) 为正交矩阵），\\(R\\) 为上三角矩阵</p>
                  </div>
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>计算 R 矩阵：</strong><br />
                    \\[r_{ij} = \\langle q_i, a_j\\rangle \\text{ for } i \\leq j\\]
                    或直接计算：\\(R = Q^TA\\)
                  </div>
                `} />

                <TipsBox title="💡 应用与优势" html={`
                  <ul class="list-disc list-inside space-y-1">
                    <li><strong>求解线性方程组</strong>：通过 \\(Rx=Q^Tb\\) 求解 \\(Ax=b\\)（避免计算 \\(A^{-1}\\)）</li>
                    <li><strong>最小二乘</strong>：QR 分解比正规方程数值更稳定</li>
                    <li><strong>特征值算法</strong>：QR 迭代法用于计算特征值</li>
                    <li><strong>数值稳定性</strong>：相比直接计算 \\(A^TA\\)，QR 分解保持正交性，减少误差累积</li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('gram-schmidt-qr').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>

              <div className="mb-5" id="fundamental-subspaces">
                <h3 className="text-xl font-semibold mb-3">2.2 Four Fundamental Subspaces（四个基本子空间）</h3>

                <ConceptBox html={`
                  <p>任何矩阵 \\(A\\) 都定义了四个关键的向量空间，它们揭示了线性方程组 \\(Ax=b\\) 的解的结构。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>列空间 \\(C(A)\\)</strong>：\\(A\\) 的列向量的所有线性组合构成的空间</li>
                    <li><strong>零空间 \\(N(A)\\)</strong>：满足 \\(Ax=0\\) 的所有解向量构成的空间</li>
                    <li><strong>行空间 \\(C(A^T)\\)</strong>：\\(A\\) 的行向量的所有线性组合（即 \\(A^T\\) 的列空间）</li>
                    <li><strong>左零空间 \\(N(A^T)\\)</strong>：满足 \\(A^Ty=0\\) 的所有解向量</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>列空间（Column Space）：</strong><br />
                    \\[C(A) = \\{Ax : x \\in \\mathbb{R}^n\\}\\]
                    \\[\\text{dim}(C(A)) = \\text{rank}(A)\\]
                    <p class="text-sm mt-1">\\(Ax=b\\) 有解 \\(\\iff b \\in C(A)\\)</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>零空间（Null Space）：</strong><br />
                    \\[N(A) = \\{x : Ax = 0\\}\\]
                    \\[\\text{dim}(N(A)) = n - \\text{rank}(A)\\]
                    <p class="text-sm mt-1">描述齐次方程的所有解</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>行空间（Row Space）：</strong><br />
                    \\[C(A^T) = \\{A^Ty : y \\in \\mathbb{R}^m\\}\\]
                    \\[\\text{dim}(C(A^T)) = \\text{rank}(A)\\]
                    <p class="text-sm mt-1">维度与列空间相同</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>左零空间（Left Null Space）：</strong><br />
                    \\[N(A^T) = \\{y : A^Ty = 0\\}\\]
                    \\[\\text{dim}(N(A^T)) = m - \\text{rank}(A)\\]
                  </div>
                `} />

                <TipsBox title="💡 正交性与秩-零化度定理" html={`
                  <ul class="list-disc list-inside space-y-2">
                    <li><strong>正交关系</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• \\(C(A) \\perp N(A^T)\\)：列空间与左零空间正交</li>
                        <li>• \\(C(A^T) \\perp N(A)\\)：行空间与零空间正交</li>
                        <li>• 这些空间对构成了整个空间的正交分解</li>
                      </ul>
                    </li>
                    <li><strong>秩-零化度定理</strong>：
                      \\[\\text{rank}(A) + \\text{nullity}(A) = n\\]
                      其中 \\(A\\) 是 \\(m \\times n\\) 矩阵
                    </li>
                    <li><strong>解的结构分析</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• \\(Ax=b\\) 无解 \\(\\iff b \\notin C(A)\\)</li>
                        <li>• 唯一解 \\(\\iff b \\in C(A)\\) 且 \\(N(A) = \\{0\\}\\)</li>
                        <li>• 无穷多解 \\(\\iff b \\in C(A)\\) 且 \\(\\text{dim}(N(A)) > 0\\)</li>
                        <li>• 通解形式：\\(x = x_p + x_h\\)（特解 + 齐次解）</li>
                      </ul>
                    </li>
                    <li><strong>几何直觉</strong>：列空间是矩阵能"到达"的所有向量，零空间是被矩阵"压扁"成零的方向</li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('fundamental-subspaces').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>

              <div className="mb-5" id="rank-nullspace">
                <h3 className="text-xl font-semibold mb-3">2.3 Rank & Nullspace（秩与零空间）</h3>

                <ConceptBox html={`
                  <p>秩（Rank）和零化度（Nullity）是描述矩阵"容量"的两个互补量，它们共同决定了线性方程组解的性质。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>秩</strong>：列空间的维数，代表矩阵列向量中线性无关向量的最大个数</li>
                    <li><strong>零化度</strong>：零空间的维数，代表齐次方程 \\(Ax=0\\) 的解空间维数</li>
                    <li><strong>满秩</strong>：秩达到最大值 \\(\\min(m,n)\\)，意味着列/行向量最大化线性无关</li>
                    <li><strong>核心关系</strong>：秩-零化度定理将这两个量联系起来</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>秩（Rank）：</strong><br />
                    \\[\\text{rank}(A) = \\text{dim}(C(A))\\]
                    <p class="text-sm mt-1">等于主元列的数量，或列空间的维数</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>零化度（Nullity）：</strong><br />
                    \\[\\text{nullity}(A) = \\text{dim}(N(A))\\]
                    <p class="text-sm mt-1">等于自由变量的数量，或零空间的维数</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>秩-零化度定理（Rank-Nullity Theorem）：</strong><br />
                    \\[\\text{rank}(A) + \\text{nullity}(A) = n\\]
                    <p class="text-sm mt-1">对于 \\(m \\times n\\) 矩阵 \\(A\\)，秩与零化度之和等于列数</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>满秩条件：</strong><br />
                    \\[\\text{rank}(A) = \\min(m,n)\\]
                    <p class="text-sm mt-1">达到理论上的最大秩值</p>
                  </div>
                `} />

                <TipsBox title="💡 可逆性与解的结构" html={`
                  <ul class="list-disc list-inside space-y-2">
                    <li><strong>可逆性判据</strong>（方阵 \\(A\\) 为 \\(n \\times n\\)）：
                      \\[A \\text{ 可逆} \\iff \\text{rank}(A) = n \\iff N(A) = \\{0\\}\\]
                    </li>
                    <li><strong>解的类型</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• <strong>唯一解</strong>：\\(N(A) = \\{0\\}\\)（零化度为 0）</li>
                        <li>• <strong>无穷多解</strong>：\\(\\text{nullity}(A) > 0\\)，解空间维数为 \\(\\text{nullity}(A)\\)</li>
                        <li>• <strong>无解</strong>：\\(b \\notin C(A)\\)（与秩无关，取决于 \\(b\\) 是否在列空间中）</li>
                      </ul>
                    </li>
                    <li><strong>通解结构</strong>：
                      \\[x = x_p + c_1v_1 + c_2v_2 + \\cdots + c_kv_k\\]
                      其中 \\(x_p\\) 是特解，\\(\\{v_1, v_2, \\ldots, v_k\\}\\) 是零空间的基（\\(k = \\text{nullity}(A)\\)）
                    </li>
                    <li><strong>秩的性质</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• \\(\\text{rank}(A) = \\text{rank}(A^T)\\)</li>
                        <li>• \\(\\text{rank}(AB) \\leq \\min(\\text{rank}(A), \\text{rank}(B))\\)</li>
                        <li>• 行化简不改变秩</li>
                      </ul>
                    </li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('rank-nullspace').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>

              <div className="mb-5" id="vectors-matrices">
                <h3 className="text-xl font-semibold mb-3">2.4 Vectors & Matrices Fundamentals（向量与矩阵基础）</h3>

                <ConceptBox html={`
                  <p>向量和矩阵是线性代数的基本对象，它们提供了描述多维空间中几何和代数结构的语言。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>向量</strong>：表示空间中的点或方向，可以进行加法和数乘运算</li>
                    <li><strong>内积</strong>：度量向量之间的"相似性"，诱导出长度和角度的概念</li>
                    <li><strong>矩阵</strong>：表示线性变换，将向量从一个空间映射到另一个空间</li>
                    <li><strong>正交性</strong>：向量垂直的代数表达，是几何直觉的形式化</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>矩阵-向量乘法：</strong><br />
                    \\[Ax = x_1a_1 + x_2a_2 + \\cdots + x_na_n\\]
                    <p class="text-sm mt-1">结果是 \\(A\\) 的列向量 \\(a_i\\) 的线性组合</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>内积（Inner Product）：</strong><br />
                    \\[\\langle x,y\\rangle = x^Ty = \\sum_{i=1}^n x_i y_i\\]
                    <p class="text-sm mt-1">欧几里得内积，满足对称性、线性性和正定性</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>范数（Norm）：</strong><br />
                    \\[\\|x\\| = \\sqrt{x^Tx} = \\sqrt{\\sum_{i=1}^n x_i^2}\\]
                    <p class="text-sm mt-1">欧几里得范数（\\(L^2\\) 范数），度量向量的"长度"</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>正交性（Orthogonality）：</strong><br />
                    \\[x \\perp y \\iff \\langle x,y\\rangle = 0\\]
                    <p class="text-sm mt-1">正交向量满足勾股定理：\\(\\|x+y\\|^2 = \\|x\\|^2 + \\|y\\|^2\\)</p>
                  </div>
                `} />

                <TipsBox title="💡 特殊矩阵与变换" html={`
                  <ul class="list-disc list-inside space-y-2">
                    <li><strong>特殊矩阵</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• <strong>单位矩阵</strong> \\(I\\)：\\(Ix = x\\)，恒等变换</li>
                        <li>• <strong>对角矩阵</strong>：仅对角线非零，\\(Dx\\) 是分量缩放</li>
                        <li>• <strong>对称矩阵</strong>：\\(A = A^T\\)，实特征值和正交特征向量</li>
                        <li>• <strong>置换矩阵</strong>：重新排列向量分量</li>
                      </ul>
                    </li>
                    <li><strong>加权内积</strong>：
                      \\[\\langle x,y\\rangle_W = x^TWy\\]
                      其中 \\(W\\) 是正定矩阵，用于定义非欧几里得度量
                    </li>
                    <li><strong>几何变换</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• <strong>旋转</strong>：正交矩阵 \\(R\\)，保持长度和角度</li>
                        <li>• <strong>反射</strong>：关于超平面的镜像对称</li>
                        <li>• <strong>投影</strong>：\\(P = A(A^TA)^{-1}A^T\\)，投影到子空间</li>
                      </ul>
                    </li>
                    <li><strong>应用领域</strong>：计算机图形学（3D 变换）、机器人学（运动学）、齐次坐标系统</li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('vectors-matrices').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>
            </section>

            {/* 3. Data Analysis */}
            <section className="mb-7" id="data-analysis">
              <h2 className="text-2xl font-bold mb-4">3. 数据分析</h2>

              <div className="mb-5" id="least-squares">
                <h3 className="text-xl font-semibold mb-3">3.1 Least Squares & Linear Regression（最小二乘与线性回归）</h3>

                <ConceptBox html={`
                  <p>最小二乘法是数据拟合的核心方法，当方程组无精确解时，寻找误差平方和最小的近似解。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>最小二乘问题</strong>：当 \\(Ax=b\\) 无解时（\\(b \\notin C(A)\\)），寻找使 \\(\\|Ax-b\\|^2\\) 最小的 \\(x\\)</li>
                    <li><strong>正规方程</strong>：通过令梯度为零导出，将无解的方程组转化为可解的方程</li>
                    <li><strong>几何解释</strong>：将 \\(b\\) 投影到列空间 \\(C(A)\\) 上，残差垂直于 \\(C(A)\\)</li>
                    <li><strong>线性回归</strong>：统计学中最常用的数据拟合方法，最小二乘法的经典应用</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>最小二乘问题（Least Squares Problem）：</strong><br />
                    \\[\\min_x \\|Ax-b\\|^2\\]
                    <p class="text-sm mt-1">寻找最佳近似解，最小化残差的平方和</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>正规方程（Normal Equations）：</strong><br />
                    \\[A^TAx = A^Tb\\]
                    <p class="text-sm mt-1">通过令 \\(\\nabla_x\\|Ax-b\\|^2 = 0\\) 导出，最小二乘解 \\(\\hat{x}\\) 满足此方程</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>投影矩阵（Projection Matrix）：</strong><br />
                    \\[P = A(A^TA)^{-1}A^T\\]
                    <p class="text-sm mt-1">投影到 \\(C(A)\\) 的矩阵，满足幂等性 \\(P^2=P\\) 和对称性 \\(P^T=P\\)</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>最小二乘解：</strong><br />
                    \\[\\hat{x} = (A^TA)^{-1}A^Tb\\]
                    <p class="text-sm mt-1">当 \\(A^TA\\) 可逆时（即 \\(A\\) 列满秩），唯一的最小二乘解</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>线性回归模型：</strong><br />
                    \\[y = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\cdots + \\beta_n x_n + \\epsilon\\]
                    <p class="text-sm mt-1">拟合数据到线性模型，最小化预测误差的平方和</p>
                  </div>
                `} />

                <TipsBox title="💡 几何直觉与数值方法" html={`
                  <ul class="list-disc list-inside space-y-2">
                    <li><strong>几何解释</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• 最优解 \\(A\\hat{x}\\) 是 \\(b\\) 在 \\(C(A)\\) 上的正交投影</li>
                        <li>• 残差 \\(r = b - A\\hat{x}\\) 垂直于列空间：\\(r \\perp C(A)\\)</li>
                        <li>• 这意味着 \\(A^Tr = 0\\)，即 \\(A^T(b - A\\hat{x}) = 0\\)，导出正规方程</li>
                      </ul>
                    </li>
                    <li><strong>QR 分解方法</strong>（推荐用于数值计算）：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• 将 \\(A = QR\\) 分解，求解 \\(Rx = Q^Tb\\)</li>
                        <li>• 避免计算 \\(A^TA\\)（可能数值不稳定）</li>
                        <li>• 更快更稳定，适合大规模问题</li>
                      </ul>
                    </li>
                    <li><strong>残差分析</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• 总误差：\\(\\|b\\|^2 = \\|A\\hat{x}\\|^2 + \\|r\\|^2\\)（勾股定理）</li>
                        <li>• R² 系数：\\(R^2 = 1 - \\frac{\\|r\\|^2}{\\|b - \\bar{b}\\|^2}\\) 衡量拟合优度</li>
                      </ul>
                    </li>
                    <li><strong>正则化</strong>：当 \\(A^TA\\) 接近奇异时，可添加正则项 \\(\\lambda I\\) 改善数值稳定性（岭回归）</li>
                    <li><strong>实际应用</strong>：数据拟合、机器学习（线性回归）、信号处理（滤波器设计）、统计学（参数估计）</li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('least-squares').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Systems Analysis */}
            <section className="mb-7" id="systems-analysis">
              <h2 className="text-2xl font-bold mb-4">4. 系统分析</h2>

              <div className="mb-5" id="eigenanalysis">
                <h3 className="text-xl font-semibold mb-3">4.1 Eigenvalue Analysis（特征值分析）</h3>

                <ConceptBox html={`
                  <p>特征值和特征向量是理解矩阵变换本质的核心概念，它们揭示了矩阵在特定方向上的"拉伸"效应。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>特征向量</strong>：满足 \\(Av = \\lambda v\\) 的非零向量 \\(v\\)，表示在矩阵变换下方向不变的向量</li>
                    <li><strong>特征值</strong>：对应的标量 \\(\\lambda\\)，表示特征向量被拉伸的倍数</li>
                    <li><strong>特征分解</strong>：将矩阵分解为 \\(A = V\\Lambda V^{-1}\\)，揭示矩阵的内在结构</li>
                    <li><strong>几何意义</strong>：特征向量构成了矩阵变换的"主轴"，特征值描述了沿这些主轴的缩放</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>特征方程（Eigenvalue Equation）：</strong><br />
                    \\[Av = \\lambda v, \\quad v \\neq 0\\]
                    <p class="text-sm mt-1">\\(\\lambda\\) 是特征值，\\(v\\) 是对应的特征向量</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>特征多项式（Characteristic Polynomial）：</strong><br />
                    \\[\\det(A - \\lambda I) = 0\\]
                    <p class="text-sm mt-1">求解此方程得到所有特征值</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>特征分解（Eigendecomposition）：</strong><br />
                    \\[A = V\\Lambda V^{-1}\\]
                    <p class="text-sm mt-1">其中 \\(V = [v_1 \\, v_2 \\, \\cdots \\, v_n]\\)（特征向量矩阵），\\(\\Lambda = \\text{diag}(\\lambda_1, \\lambda_2, \\ldots, \\lambda_n)\\)（特征值对角矩阵）</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>矩阵幂（Matrix Powers）：</strong><br />
                    \\[A^n = V\\Lambda^n V^{-1}\\]
                    <p class="text-sm mt-1">通过特征分解可以快速计算矩阵的高次幂</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>对称矩阵的特殊性质：</strong><br />
                    \\[A = Q\\Lambda Q^T \\quad (A = A^T)\\]
                    <p class="text-sm mt-1">对称矩阵具有实特征值、正交特征向量，且 \\(Q\\) 为正交矩阵</p>
                  </div>
                `} />

                <TipsBox title="💡 关键性质与应用" html={`
                  <ul class="list-disc list-inside space-y-2">
                    <li><strong>系统稳定性判据</strong>：离散时间系统稳定 \\(\\iff\\) 所有特征值满足 \\(|\\lambda_i| < 1\\)</li>
                    <li><strong>矩阵的迹（Trace）</strong>：\\(\\text{tr}(A) = \\sum_i \\lambda_i\\)，特征值之和等于对角线元素之和</li>
                    <li><strong>行列式</strong>：\\(\\det(A) = \\prod_i \\lambda_i\\)，特征值之积等于行列式</li>
                    <li><strong>SVD vs 特征分解</strong>：SVD \\(A = U\\Sigma V^T\\) 适用于任意矩阵（包括非方阵），是特征分解的推广</li>
                    <li><strong>实际应用</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• 主成分分析（PCA）：找到数据的主要变化方向</li>
                        <li>• 振动分析：结构的固有频率和振型</li>
                        <li>• 量子力学：能量本征态和本征值</li>
                        <li>• Google PageRank：网页重要性的特征向量</li>
                      </ul>
                    </li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('eigenanalysis').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>

              <div className="mb-5" id="state-space">
                <h3 className="text-xl font-semibold mb-3">4.2 State Space & PageRank（状态空间与网页排名）</h3>

                <ConceptBox html={`
                  <p>状态空间模型是描述动态系统演化的通用框架，从控制系统到网页排名算法都基于这一理论。</p>
                  <ul class="list-disc list-inside mt-2 space-y-1">
                    <li><strong>状态空间模型</strong>：用一阶差分方程描述系统状态随时间的演化</li>
                    <li><strong>马尔可夫链</strong>：状态转移只依赖当前状态的随机过程</li>
                    <li><strong>稳态分布</strong>：系统长期运行后达到的平衡状态</li>
                    <li><strong>PageRank</strong>：Google 搜索引擎的核心算法，将网页排名问题转化为马尔可夫链的稳态求解</li>
                  </ul>
                `} />

                <FormulaBox html={`
                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>状态空间模型（State-Space Model）：</strong><br />
                    \\[x[k+1] = Ax[k] + Bu[k]\\]
                    \\[y[k] = Cx[k] + Du[k]\\]
                    <p class="text-sm mt-1">状态演化方程（上）和输出方程（下），其中 \\(x[k]\\) 是状态，\\(u[k]\\) 是输入，\\(y[k]\\) 是输出</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>通解（General Solution）：</strong><br />
                    \\[x[n] = A^n x[0] + \\sum_{k=0}^{n-1}A^{n-1-k}Bu[k]\\]
                    <p class="text-sm mt-1">齐次解（\\(A^n x[0]\\)）+ 特解（求和项），可利用特征分解高效计算 \\(A^n\\)</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>稳定性条件（Stability Criterion）：</strong><br />
                    \\[\\text{System stable} \\iff |\\lambda_i| < 1, \\, \\forall i\\]
                    <p class="text-sm mt-1">离散时间系统稳定 \\(\\iff\\) 所有特征值的模小于 1</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>马尔可夫链（Markov Chain）：</strong><br />
                    \\[p[k+1] = Pp[k]\\]
                    \\[P\\pi = \\pi \\quad (\\text{稳态条件})\\]
                    <p class="text-sm mt-1">转移矩阵 \\(P\\)，稳态分布 \\(\\pi\\) 是特征值 1 对应的特征向量</p>
                  </div>

                  <div class="p-4 my-2.5 bg-white/50 dark:bg-white/5 rounded-md">
                    <strong>PageRank 算法：</strong><br />
                    \\[\\pi = (1-d)v + dP^T\\pi\\]
                    <p class="text-sm mt-1">\\(d\\) 是阻尼因子（通常 0.85），\\(v\\) 是"传送"分布，\\(P^T\\) 是转置后的链接矩阵</p>
                  </div>
                `} />

                <TipsBox title="💡 关键概念与应用" html={`
                  <ul class="list-disc list-inside space-y-2">
                    <li><strong>收敛性分析</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• 主特征值 \\(\\lambda_1 = 1\\) 保证存在稳态</li>
                        <li>• 其他特征值 \\(|\\lambda_i| < 1\\) 保证收敛到稳态</li>
                        <li>• 收敛速度取决于第二大特征值的模 \\(|\\lambda_2|\\)</li>
                      </ul>
                    </li>
                    <li><strong>PageRank 直觉</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• 重要的网页被很多其他重要网页链接</li>
                        <li>• 阻尼因子模拟用户随机跳转行为</li>
                        <li>• 求解 \\((I - dP^T)\\pi = (1-d)v\\) 即可得到排名</li>
                      </ul>
                    </li>
                    <li><strong>数值方法</strong>：
                      <ul class="ml-5 mt-1 space-y-1">
                        <li>• 幂迭代法（Power Iteration）：\\(p[k+1] = Pp[k]\\) 反复迭代</li>
                        <li>• 通常 50-100 次迭代即可收敛</li>
                        <li>• 适用于稀疏矩阵（大规模网络）</li>
                      </ul>
                    </li>
                    <li><strong>实际应用</strong>：控制系统设计、网络分析、推荐系统、社交网络影响力分析</li>
                  </ul>
                `} />

                <div className="mt-4">
                  {getProblemsByTopic('state-space').map((problem, idx) => (
                    <ProblemCard key={idx} problem={problem} />
                  ))}
                </div>
              </div>
            </section>

            {/* MT2 Sources */}
            <section className="mb-7" id="mt2-sources">
              <h2 className="text-2xl font-bold mb-4">Midterm 2 来源</h2>
              <div className="topic-notes">
                <p className="mb-2">本复习站整理了以下学期的 MT2 考试题目：</p>
                <ul className="list-disc list-inside space-y-1">
                  {mt2Data && Object.keys(mt2Data).map((examId) => <li key={examId}>{examId}</li>)}
                </ul>
              </div>
            </section>

            {/* MT3/Final Sources */}
            <section className="mb-7" id="mt3-sources">
              <h2 className="text-2xl font-bold mb-4">Midterm 3 / Final 来源</h2>
              <div className="topic-notes">
                <p className="mb-2">本复习站整理了以下学期的 MT3/Final 考试题目：</p>
                <ul className="list-disc list-inside space-y-1">
                  {mt3Data && Object.keys(mt3Data).map((examId) => <li key={examId}>{examId}</li>)}
                </ul>
              </div>
            </section>

            {/* Homework Sources */}
            <section className="mb-7" id="hw-sources">
              <h2 className="text-2xl font-bold mb-4">作业题目 (Homework) 来源</h2>
              <div className="topic-notes">
                <p className="mb-2">本复习站整理了以下作业题目：</p>
                <ul className="list-disc list-inside space-y-1">
                  {hwData && Object.keys(hwData).map((hwId) => <li key={hwId}>{hwId.toUpperCase()}</li>)}
                </ul>
              </div>
            </section>

            {searchQuery && (
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  搜索关键词：&quot;{searchQuery}&quot;
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
