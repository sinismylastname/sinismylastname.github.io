export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {text && <p className="section-lede">{text}</p>}
    </div>
  );
}
