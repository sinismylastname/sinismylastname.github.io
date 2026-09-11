import { interests } from "../data/site";
import { GlassSurface } from "../components/GlassSurface";
import { SectionHeading } from "../components/SectionHeading";
import type { PageId } from "../data/site";

export function AboutPage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <div className="page-content about-page">
      <SectionHeading eyebrow="The person behind the projects" title="About me" text="I’m a first-year Computer Engineering student learning how thoughtful software and hands-on hardware can fit together." />
      <div className="about-grid">
        <GlassSurface variant="panel" className="reading-panel"><p>I built this site while completing the Hack4Impact Starter Pack. It was my first step toward making useful, thoughtful technology for real people, and it keeps changing as I learn more.</p><p>I enjoy the moment when an abstract idea becomes something physical: a robot that moves, a circuit that lights up, a game that invites someone to play, or a website that feels good to explore.</p><button className="text-button" type="button" onClick={() => onNavigate("contact")}>Want to say hello? <span aria-hidden="true">→</span></button></GlassSurface>
        <GlassSurface variant="card" className="interest-card"><p className="eyebrow">Right now</p><h2>Learning in public.</h2><div className="interest-list">{interests.map((interest) => <span key={interest}>{interest}</span>)}</div></GlassSurface>
      </div>
    </div>
  );
}
