export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <p className="muted">This screen is next on the build list. ERPNext already handles the data behind it.</p>
    </div>
  );
}
