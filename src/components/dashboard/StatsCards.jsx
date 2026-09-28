import { CloudUpload, FileStack, FolderOpen, HardDrive } from 'lucide-react';
import StatCard from './StatCard';
import { formatBytes } from '../../utilities/fileHelpers';

export default function StatsCards({ stats, storageTotal, loading = false }) {
  const { totalFiles, totalBytes, uploadsThisMonth, topKinds } = stats;

  const usedPercent = storageTotal
    ? Math.min(100, Math.round((totalBytes / storageTotal) * 100))
    : 0;

  return (
    <section className="stats-grid" aria-label="Storage overview">
      <StatCard
        icon={FolderOpen}
        tone="doc"
        label="Total files"
        value={totalFiles}
        loading={loading}
      >
        <span className="text-meta">
          {totalFiles === 1 ? 'file stored' : 'files stored'}
        </span>
      </StatCard>

      <StatCard
        icon={HardDrive}
        tone="xls"
        label="Storage used"
        value={formatBytes(totalBytes, '0 B')}
        loading={loading}
      >
        <div
          className="stat-card__bar"
          role="progressbar"
          aria-valuenow={usedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Storage used"
        >
          <div
            className="stat-card__bar-fill"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <span className="text-meta">of {formatBytes(storageTotal)}</span>
      </StatCard>

      <StatCard
        icon={CloudUpload}
        tone="img"
        label="Uploads"
        value={uploadsThisMonth}
        loading={loading}
      >
        <span className="text-meta">this month</span>
      </StatCard>

      <StatCard icon={FileStack} tone="zip" label="File types" loading={loading}>
        {topKinds.length === 0 ? (
          <span className="text-meta">No files yet</span>
        ) : (
          <ul className="stat-card__types">
            {topKinds.map(({ kind, badge, count }) => (
              <li key={kind}>
                <span className={`badge-type badge-type--${kind}`}>{badge}</span>
                <span className="stat-card__types-count">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </StatCard>
    </section>
  );
}
