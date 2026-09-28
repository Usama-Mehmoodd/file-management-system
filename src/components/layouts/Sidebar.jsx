import {
    Cloud,
    FileSpreadsheet,
    FileText,
    Folder,
    HardDrive,
    Image,
    LayoutDashboard,
    LogOut,
    Settings,
    X,
} from 'lucide-react';

/*
  Nav keys deliberately match the `filterType` values already used in Home.jsx
  ('all' | 'pictures' | 'pdf' | 'docs' | 'excel') so clicking a category in the
  sidebar drives the existing filter logic — no new state, no API change.
*/
const MAIN_NAV = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'all', label: 'My Files', icon: Folder },
    { key: 'pictures', label: 'Pictures', icon: Image },
    { key: 'pdf', label: 'PDFs', icon: FileText },
    { key: 'docs', label: 'Documents', icon: FileText },
    { key: 'excel', label: 'Excel', icon: FileSpreadsheet },
];

function initialsOf(name) {
    if (!name) return 'U';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function formatGB(bytes) {
    if (!bytes || bytes < 0) return '0 GB';
    return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

export default function Sidebar({
    activeKey = 'dashboard',
    onSelect = () => { },
    open = false,
    onClose = () => { },
    onLogout = () => { },
    user = {},
    counts = {},
    storage = { used: 0, total: 10 * 1024 ** 3 },
}) {
    const usedPercent = storage.total
        ? Math.min(100, Math.round((storage.used / storage.total) * 100))
        : 0;

    function handleSelect(key) {
        onSelect(key);
        onClose(); // close the drawer on mobile after navigating
    }

    return (
        <>
            <div
                className={`sidebar__overlay ${open ? 'is-open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={`sidebar ${open ? 'is-open' : ''}`}
                aria-label="Main navigation"
            >
                <div className="sidebar__brand">
                    <span className="sidebar__brand-mark">
                        <Cloud size={22} aria-hidden="true" />
                        File<span className="sidebar__brand-accent">Manager</span>
                    </span>
                    <button
                        type="button"
                        className="sidebar__close"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar__scroll">
                    <nav className="sidebar__section">
                        {MAIN_NAV.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                type="button"
                                className={`sidebar__link ${activeKey === key ? 'is-active' : ''
                                    }`}
                                onClick={() => handleSelect(key)}
                                aria-current={activeKey === key ? 'page' : undefined}
                            >
                                <Icon size={18} aria-hidden="true" />
                                {label}
                                {counts[key] != null && (
                                    <span className="sidebar__link-count">{counts[key]}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <nav className="sidebar__section">
                        <button
                            type="button"
                            className={`sidebar__link ${activeKey === 'settings' ? 'is-active' : ''
                                }`}
                            onClick={() => handleSelect('settings')}
                        >
                            <Settings size={18} aria-hidden="true" />
                            Settings
                        </button>
                    </nav>

                    <div className="sidebar__storage">
                        <div className="sidebar__storage-head">
                            <HardDrive size={16} aria-hidden="true" />
                            Storage
                        </div>
                        <div
                            className="sidebar__storage-bar"
                            role="progressbar"
                            aria-valuenow={usedPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Storage used"
                        >
                            <div
                                className="sidebar__storage-fill"
                                style={{ width: `${usedPercent}%` }}
                            />
                        </div>
                        <div className="sidebar__storage-meta">
                            {formatGB(storage.used)} of {formatGB(storage.total)} used
                        </div>
                    </div>
                </div>

                <div className="sidebar__user">
                    <span className="avatar">{initialsOf(user.name)}</span>
                    <div className="sidebar__user-info">
                        <div className="sidebar__user-name">{user.name || 'Account'}</div>
                        <div className="sidebar__user-mail">{user.email || ''}</div>
                    </div>
                    <button
                        type="button"
                        className="sidebar__logout"
                        onClick={onLogout}
                        aria-label="Log out"
                        title="Log out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}
