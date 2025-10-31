'use client';

import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (sectionId: string) => void;
}

const getNavigationItems = (t: any) => [
  {
    title: t('navigation.signalProcessing'),
    id: 'signal-processing',
    subitems: [
      { title: t('navigation.complexExponentials'), id: 'complex-exponentials' },
      { title: t('navigation.dtfsDft'), id: 'dtfs-dft' },
    ],
  },
  {
    title: t('navigation.linearAlgebraAdvanced'),
    id: 'linear-algebra-advanced',
    subitems: [
      { title: t('navigation.gramSchmidtQr'), id: 'gram-schmidt-qr' },
      { title: t('navigation.fundamentalSubspaces'), id: 'fundamental-subspaces' },
      { title: t('navigation.rankNullspace'), id: 'rank-nullspace' },
    ],
  },
  {
    title: t('navigation.dataAnalysis'),
    id: 'data-analysis',
    subitems: [
      { title: t('navigation.leastSquares'), id: 'least-squares' },
    ],
  },
  {
    title: t('navigation.systemsAnalysis'),
    id: 'systems-analysis',
    subitems: [
      { title: t('navigation.eigenanalysis'), id: 'eigenanalysis' },
      { title: t('navigation.stateSpace'), id: 'state-space' },
    ],
  },
  {
    title: t('navigation.mt2Sources'),
    id: 'mt2-sources',
    subitems: [],
  },
  {
    title: t('navigation.mt3Sources'),
    id: 'mt3-sources',
    subitems: [],
  },
];

export default function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const navigationItems = getNavigationItems(t);

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
