'use client';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (sectionId: string) => void;
}

const navigationItems = [
  {
    title: '1. 信号处理',
    id: 'signal-processing',
    subitems: [
      { title: '1.1 复指数与周期性', id: 'complex-exponentials' },
      { title: '1.2 离散傅里叶变换', id: 'dtfs-dft' },
    ],
  },
  {
    title: '2. 线性代数进阶',
    id: 'linear-algebra-advanced',
    subitems: [
      { title: '2.1 Gram-Schmidt & QR分解', id: 'gram-schmidt-qr' },
      { title: '2.2 基本子空间', id: 'fundamental-subspaces' },
      { title: '2.3 秩与零空间', id: 'rank-nullspace' },
    ],
  },
  {
    title: '3. 数据分析',
    id: 'data-analysis',
    subitems: [
      { title: '3.1 最小二乘与线性回归', id: 'least-squares' },
    ],
  },
  {
    title: '4. 系统分析',
    id: 'systems-analysis',
    subitems: [
      { title: '4.1 特征值分析', id: 'eigenanalysis' },
      { title: '4.2 状态空间 & PageRank', id: 'state-space' },
    ],
  },
  {
    title: 'Midterm 2 来源',
    id: 'mt2-sources',
    subitems: [],
  },
  {
    title: 'Midterm 3/Final 来源',
    id: 'mt3-sources',
    subitems: [],
  },
];

export default function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  return (
    <>
      <nav
        className={`
          fixed top-header left-0 w-sidebar h-[calc(100vh-theme(spacing.header))]
          border-r border-[var(--border-color)] bg-[var(--bg-color)]
          overflow-y-auto p-4 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {navigationItems.map((item) => (
          <div key={item.id} className="mb-2">
            <div
              onClick={() => onNavigate(item.id)}
              className="px-3 py-2.5 rounded-lg cursor-pointer
                       hover:bg-[var(--hover-bg)] transition-colors"
            >
              {item.title}
            </div>
            {item.subitems.map((subitem) => (
              <div
                key={subitem.id}
                onClick={() => onNavigate(subitem.id)}
                className="ml-3 px-3 py-2 rounded-lg cursor-pointer text-sm
                         hover:bg-[var(--hover-bg)] transition-colors"
              >
                {subitem.title}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => onNavigate('')}
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
        />
      )}
    </>
  );
}
