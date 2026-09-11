import { profileImage } from "../data/projects";
import { interests } from "../data/site";
import type { PageId } from "../data/site";
import { GlassButton } from "../components/GlassButton";
import { GlassSurface } from "../components/GlassSurface";
import { ProjectGrid } from "../components/ProjectGrid";

export function HomePage({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <div className="page-content home-page">
      <section className="hero-layout" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Computer Engineering · Cal Poly SLO · FIRST Alumni</p>
          <h1 id="home-title">Hello,<br /><span>world!</span></h1>
          <p className="hero-lede">I’m Andy Sin: a first-year Computer Engineering student who enjoys software, hardware, and believes that the <strong>STEM</strong> field is nothing more than <strong>pure</strong> <strong>wizardry</strong>.</p>
          <div className="hero-actions">
            <GlassButton href="#work" onClick={() => onNavigate("work")}>See what I'm building <span aria-hidden="true">↗</span></GlassButton>
            <a className="quiet-link" href="#about" onClick={() => onNavigate("about")}>A little more about me</a>
          </div>
        </div>
        <GlassSurface variant="panel" interactive className="profile-card">
          <div className="profile-image-wrap"><img src={profileImage} alt="Illustrated avatar with the initials AS" width="360" height="360" /></div>
          <div className="profile-note"><span className="status-dot" /> currently learning by doing (wink wink Cal Poly SLO)</div>
        </GlassSurface>
      </section>

      <section className="featured-section" aria-labelledby="featured-title">
        <div className="section-intro-row">
          <div><p className="eyebrow">A few experiments</p><h2 id="featured-title">Things I've Built</h2></div>
          <button className="text-button" type="button" onClick={() => onNavigate("work")}>View all work <span aria-hidden="true">→</span></button>
        </div>
        <ProjectGrid />
      </section>

      <section className="interest-strip" aria-labelledby="interest-title">
        <GlassSurface variant="panel" className="interest-panel">
          <div><p className="eyebrow">The ponderings of today</p><h2 id="interest-title">Engineering is studying the limits of the universe to manifest creations from your mind.</h2></div>
          <div className="interest-list">{interests.map((interest) => <span key={interest}>{interest}</span>)}</div>
        </GlassSurface>
      </section>
    </div>
  );
}
