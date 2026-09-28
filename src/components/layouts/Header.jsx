import { Dropdown } from 'react-bootstrap';
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Settings, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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

export default function Header({
  search = '',
  onSearchChange = () => {},
  onMenuClick = () => {},
  onLogout = () => {},
  user = {},
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="app-header">
      <button
        type="button"
        className="ui-icon-btn app-header__menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="app-header__search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          className="ui-input"
          placeholder="Search files, folders..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search files"
        />
      </div>

      <div className="app-header__actions">
        <button
          type="button"
          className="ui-icon-btn"
          onClick={toggleTheme}
          // aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          type="button"
          className="ui-icon-btn app-header__bell"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="app-header__dot" aria-hidden="true" />
        </button>

        <span className="app-header__divider" aria-hidden="true" />

        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            className="app-header__user"
            bsPrefix="app-header__user"
            aria-label="Account menu"
          >
            <span className="avatar">{initialsOf(user.name)}</span>
            <span className="app-header__user-name">
              {user.name || 'Account'}
            </span>
            <ChevronDown size={16} aria-hidden="true" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as="button" type="button">
              <Settings size={16} className="me-2" aria-hidden="true" />
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as="button" type="button" onClick={onLogout}>
              <LogOut size={16} className="me-2" aria-hidden="true" />
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}
