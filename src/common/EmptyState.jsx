export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-state__icon">
          <Icon size={28} aria-hidden="true" />
        </span>
      )}
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {actionLabel && onAction && (
        <button type="button" className="ui-btn ui-btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
