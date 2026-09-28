import { useState } from 'react';
import Header from './Header';
import Sidebar from './SideBar';


export default function DashboardLayout({
  children,
  category = 'dashboard',
  onCategoryChange = () => {},
  search = '',
  onSearchChange = () => {},
  onLogout = () => {},
  user = {},
  counts = {},
  storage,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        activeKey={category}
        onSelect={onCategoryChange}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLogout={onLogout}
        user={user}
        counts={counts}
        storage={storage}
      />

      <div className="app-main">
        <Header
          search={search}
          onSearchChange={onSearchChange}
          onMenuClick={() => setDrawerOpen(true)}
          onLogout={onLogout}
          user={user}
        />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
