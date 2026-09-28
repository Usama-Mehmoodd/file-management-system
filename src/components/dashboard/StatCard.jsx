export default function StatCard({
  icon: Icon,
  tone = 'doc',
  label,
  value,
  children,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="ui-card stat-card">
        <div className="skeleton skeleton--icon" />
        <div className="skeleton skeleton--line" style={{ width: '45%' }} />
        <div className="skeleton skeleton--line skeleton--lg" style={{ width: '60%' }} />
      </div>
    );
  }

  return (
    <div className="ui-card stat-card">
      <span className={`stat-card__icon stat-card__icon--${tone}`}>
        <Icon size={20} aria-hidden="true" />
      </span>
      <div className="stat-card__label">{label}</div>
      {value != null && <div className="stat-card__value">{value}</div>}
      {children && <div className="stat-card__extra">{children}</div>}
    </div>
  );
}
