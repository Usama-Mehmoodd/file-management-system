function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Takes the first word of the user's name — "Usama Mehmood" → "Usama". */
function firstName(user) {
  const full = user?.name || user?.username || user?.fullName || '';
  return full.trim().split(/\s+/)[0] || '';
}

export default function WelcomeSection({ user }) {
  const name = firstName(user);

  return (
    <section className="welcome">
      <h1 className="welcome__title">
        {greetingFor()}
        {name ? `, ${name}` : ''} <span aria-hidden="true">👋</span>
      </h1>
      <p className="welcome__subtitle">
        Manage, organize and access your files from one place.
      </p>
    </section>
  );
}
