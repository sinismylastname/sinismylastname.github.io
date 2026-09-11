import type { ReactNode } from "react";
import resumePdf from "../../../resume.pdf";
import { GlassButton } from "../components/GlassButton";
import { GlassSurface } from "../components/GlassSurface";
import { SectionHeading } from "../components/SectionHeading";

export function ResumePage() {
  return (
    <div className="page-content resume-page">
      <SectionHeading eyebrow="Experience and direction" title="Resume" text="Computer Engineering student interested in robotics, embedded systems, controls, and hardware-software integration." />
      <div className="page-actions"><GlassButton href={resumePdf} target="_blank" rel="noreferrer">Open PDF resume ↗</GlassButton><a className="quiet-link" href="https://github.com/sinismylastname" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      <GlassSurface variant="panel" className="resume-sheet">
        <ResumeSection title="Education"><h3>California Polytechnic State University, San Luis Obispo</h3><p className="entry-info">B.S. Computer Engineering · Expected June 2030</p></ResumeSection>
        <ResumeSection title="Engineering Experience"><ResumeEntry title="Lead Programmer & Competition Strategist" info="FIRST Robotics Competition Team 3598, SEStematic Eliminators · Aug 2025 - Jun 2026">Led the team’s migration from LabVIEW to WPILib command-based Java, programming its swerve drivetrain, mechanisms, autonomous routines, and NetworkTables while coordinating across mechanical and electrical subteams. Built vision-assisted pose estimation and dynamic auto-aim using Limelight AprilTags, robot velocity, and target distance.</ResumeEntry><ResumeEntry title="Programming & Outreach Member" info="FIRST Robotics Competition Team 3598, SEStematic Eliminators · Aug 2024 - Jun 2025">Facilitated 15+ hands-on STEM workshops for students ages 3-14 as part of team outreach reaching 9,000+ youth over three years.</ResumeEntry></ResumeSection>
        <ResumeSection title="Technical Skills"><ul className="resume-list"><li><strong>Languages:</strong> Java, Python, GDScript, C++</li><li><strong>Robotics:</strong> WPILib, Phoenix Tuner X, PathPlanner, Choreo, Limelight, AprilTags</li><li><strong>Software:</strong> Git/GitHub, Godot, KMK</li><li><strong>Hardware:</strong> KiCad, Onshape, Raspberry Pi 4, Seeed XIAO RP2040, PCB design, soldering, 3D printing</li></ul></ResumeSection>
        <ResumeSection title="Projects"><ResumeEntry title="SinnerPad" info="Independent hardware project">Designed, assembled, and programmed a four-key macropad with an RP2040, RGB LEDs, Cherry MX-compatible switches, custom PCB, and 3D-printed enclosure.</ResumeEntry><ResumeEntry title="Shiba Arcade Game & Custom Cabinet" info="Hack Club · 2025">Developed a Godot arcade game and custom Raspberry Pi cabinet; placed in the top 30 of 8,000+ participants in the Shiba challenge.</ResumeEntry></ResumeSection>
        <ResumeSection title="Honors"><ul className="resume-list"><li>Hack Club Shiba Award</li><li>AP Scholar with Distinction</li><li>College Board First-Generation Recognition Award</li><li>FIRST Impact Award, Team Spirit Award, and Judges’ Award</li></ul></ResumeSection>
      </GlassSurface>
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) { return <section className="resume-section"><h2 className="section-title">{title}</h2>{children}</section>; }
function ResumeEntry({ title, info, children }: { title: string; info: string; children: ReactNode }) { return <div className="resume-entry"><h3>{title}</h3><p className="entry-info">{info}</p><p>{children}</p></div>; }
