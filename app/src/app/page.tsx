import { FeatureCard } from "../components/FeatureCard";

const features = [
  {
    title: "Auth",
    description: "Register, login, and protect routes as you learn authentication flow.",
    hint: "Coming soon",
  },
  {
    title: "Snippet Library",
    description: "Create a structure for storing, editing, and organizing snippets.",
    hint: "Your next milestone",
  },
  {
    title: "Search & Filters",
    description: "Add search, tag filters, and language-based browsing later.",
    hint: "Planned",
  },
  {
    title: "Profiles",
    description: "Prepare a public profile experience for showcasing a user library.",
    hint: "Planned",
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Starter foundation</p>
        <h1>CodeVault</h1>
        <p className="intro">
          This starter shell gives you a clean place to build your own snippet manager step by step.
        </p>
      </section>

      <section className="grid" aria-label="Project roadmap">
        {features.map((feature) => (
          <FeatureCard key={feature.title} title={feature.title} description={feature.description} hint={feature.hint} />
        ))}
      </section>
    </main>
  );
}
