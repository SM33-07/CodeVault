type FeatureCardProps = {
  title: string;
  description: string;
  hint: string;
};

export function FeatureCard({ title, description, hint }: FeatureCardProps) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="hint">{hint}</span>
    </article>
  );
}
