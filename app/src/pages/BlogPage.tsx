import { GlassSurface } from "../components/GlassSurface";
import { SectionHeading } from "../components/SectionHeading";

export function BlogPage() {
  return <div className="page-content blog-page"><SectionHeading eyebrow="Learning in public" title="Notes" text="Small reflections from building, breaking, and learning." /><GlassSurface as="article" variant="panel" className="blog-post"><p className="eyebrow">September 2026 · First launch</p><h2>Building my first personal website</h2><p>The Hack4Impact Starter Pack gave me a practical introduction to Git, semantic HTML, CSS, and publishing with GitHub Pages. The biggest lesson was that a website is easier to improve when its structure and styling have separate jobs.</p><p>I also practiced making small commits, writing accessible image text, and building navigation that stays consistent across several pages. There is a lot more I want to add, but getting a complete first version online is a good place to begin.</p></GlassSurface></div>;
}
