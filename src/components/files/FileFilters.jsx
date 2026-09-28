import { Dropdown } from 'react-bootstrap';
import { ArrowUpDown, LayoutGrid, List, Search } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All files' },
  { key: 'pictures', label: 'Pictures' },
  { key: 'pdf', label: 'PDFs' },
  { key: 'docs', label: 'Documents' },
  { key: 'excel', label: 'Excel' },
];

export const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'a-z', label: 'Name A–Z' },
  { key: 'z-a', label: 'Name Z–A' },
  { key: 'size-desc', label: 'Size: largest' },
  { key: 'size-asc', label: 'Size: smallest' },
];

export default function FileFilters({
  category,
  onCategoryChange,
  counts = {},
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  view,
  onViewChange,
}) {
  const activeSort =
    SORT_OPTIONS.find((o) => o.key === sortBy) || SORT_OPTIONS[0];

  return (
    <div className="file-filters">
      <div className="file-tabs" role="tablist" aria-label="File categories">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={category === key}
            className={`file-tab ${category === key ? 'is-active' : ''}`}
            onClick={() => onCategoryChange(key)}
          >
            {label}
            {counts[key] != null && (
              <span className="file-tab__count">{counts[key]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="file-filters__tools">
        <div className="file-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            className="ui-input"
            placeholder="Search files..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search files in this list"
          />
        </div>

        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            type="button"
            bsPrefix="ui-btn ui-btn-secondary"
            className="ui-btn ui-btn-secondary"
          >
            <ArrowUpDown size={16} aria-hidden="true" />
            {activeSort.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {SORT_OPTIONS.map(({ key, label }) => (
              <Dropdown.Item
                key={key}
                as="button"
                type="button"
                active={sortBy === key}
                onClick={() => onSortChange(key)}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={`view-toggle__btn ${view === 'list' ? 'is-active' : ''}`}
            onClick={() => onViewChange('list')}
            aria-pressed={view === 'list'}
            aria-label="List view"
            title="List view"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            className={`view-toggle__btn ${view === 'grid' ? 'is-active' : ''}`}
            onClick={() => onViewChange('grid')}
            aria-pressed={view === 'grid'}
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
