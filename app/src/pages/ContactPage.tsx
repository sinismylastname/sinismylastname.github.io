import { GlassButton } from "../components/GlassButton";
import { GlassSurface } from "../components/GlassSurface";
import { SectionHeading } from "../components/SectionHeading";

export function ContactPage() {
  return (
    <div className="page-content contact-page">
      <SectionHeading eyebrow="Say hello" title="Let’s connect." text="Have a question, project idea, or resource you think I should see? Leave a message here." />
      <GlassSurface as="section" variant="panel" className="contact-layout" aria-label="Contact details and message form">
        <div className="contact-copy"><h2>Make an interesting connection.</h2><p>I’m always glad to yap your ear off about robotics, hardware, web development, games, or anything really. </p><p className="form-note">This static form keeps native validation. Message delivery can be connected to a provider later without changing the visual experience.</p><a className="quiet-link" href="mailto:andygbsin@gmail.com">andygbsin@gmail.com ↗</a></div>
        <form id="contact-form" className="contact-form" action="#contact" method="get">
          <label htmlFor="name">Name</label><input id="name" name="name" type="text" placeholder="Your name" required />
          <label htmlFor="email">Email</label><input id="email" name="email" type="email" placeholder="you@example.com" required />
          <label htmlFor="message">Message</label><textarea id="message" name="message" rows={7} placeholder="What would you like to talk about?" required />
          <GlassButton type="submit">Send a hello ↗</GlassButton>
        </form>
      </GlassSurface>
    </div>
  );
}
