import { useMemo } from 'react';
import { AlertTriangle, FolderOpen, SearchX } from 'lucide-react';
import EmptyState from '../../common/EmptyState';
import FileFilters from './FileFilters';
import FileGrid from './FileGrid';
import FileTable from './FileTable';
import {
  getUploadDate,
  matchesCategory,
  parseSize,
} from '../../utilities/fileHelpers';

function sortFiles(files, sortBy) {
  const sorted = [...files];

  switch (sortBy) {
    case 'a-z':
      return sorted.sort((a, b) => a.fileName.localeCompare(b.fileName));
    case 'z-a':
      return sorted.sort((a, b) => b.fileName.localeCompare(a.fileName));
    case 'size-asc':
      return sorted.sort((a, b) => (parseSize(a.size) ?? 0) - (parseSize(b.size) ?? 0));
    case 'size-desc':
      return sorted.sort((a, b) => (parseSize(b.size) ?? 0) - (parseSize(a.size) ?? 0));
    case 'oldest':
      return sorted.sort(
        (a, b) => (getUploadDate(a)?.getTime() ?? 0) - (getUploadDate(b)?.getTime() ?? 0)
      );
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => (getUploadDate(b)?.getTime() ?? 0) - (getUploadDate(a)?.getTime() ?? 0)
      );
  }
}

function LoadingRows() {
  return (
    <div className="file-skeletons" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="file-skeleton-row" key={i}>
          <div className="skeleton skeleton--icon" />
          <div className="skeleton skeleton--line" style={{ width: '32%' }} />
          <div className="skeleton skeleton--line" style={{ width: '12%' }} />
          <div className="skeleton skeleton--line" style={{ width: '14%' }} />
        </div>
      ))}
    </div>
  );
}

export default function FileManager({
  files = [],
  loading = false,
  error = '',
  onRetry,
  category,
  onCategoryChange,
  counts,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  view,
  onViewChange,
  actions,
  onUploadClick,
}) {
  const visibleFiles = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = files.filter((file) => {
      if (!matchesCategory(file, category)) return false;
      if (!term) return true;
      return (file.fileName || '').toLowerCase().includes(term);
    });

    return sortFiles(filtered, sortBy);
  }, [files, category, search, sortBy]);

  const hasFilters = search.trim() !== '' || category !== 'all';

  function renderBody() {
    if (loading) return <LoadingRows />;

    if (error) {
      return (
        <EmptyState
          icon={AlertTriangle}
          title="Something went wrong"
          message="We couldn't load your files. Please try again."
          actionLabel="Try again"
          onAction={onRetry}
        />
      );
    }

    if (visibleFiles.length === 0) {
      return hasFilters ? (
        <EmptyState
          icon={SearchX}
          title="No matching files"
          message="Try another search term or clear your filters."
          actionLabel="Clear filters"
          onAction={() => {
            onSearchChange('');
            onCategoryChange('all');
          }}
        />
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="No files yet"
          message="Upload your first file to get started."
          actionLabel="Upload a file"
          onAction={onUploadClick}
        />
      );
    }

    return view === 'grid' ? (
      <FileGrid files={visibleFiles} actions={actions} />
    ) : (
      <FileTable files={visibleFiles} actions={actions} />
    );
  }

  return (
    <section className="ui-card file-manager" aria-label="File manager">
      <FileFilters
        category={category}
        onCategoryChange={onCategoryChange}
        counts={counts}
        search={search}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        view={view}
        onViewChange={onViewChange}
      />

      {renderBody()}

      {!loading && !error && visibleFiles.length > 0 && (
        <p className="file-manager__footer text-meta">
          Showing {visibleFiles.length} of {files.length} files
        </p>
      )}
    </section>
  );
}
