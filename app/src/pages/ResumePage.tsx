import type { ReactNode } from "react";
import resumePdf from "../../../resume.pdf";
import { GlassButton } from "../components/GlassButton";
import { GlassSurface } from "../components/GlassSurface";
import { SectionHeading } from "../components/SectionHeading";

export function ResumePage() {
  return (
    <div className="page-content resume-page">
      <SectionHeading eyebrow="Experience and direction" title="Resume" text="Computer Engineering freshman at Cal Poly San Luis Obispo with applied experience in robotics software, autonomous control systems, embedded hardware, and PCB design. Interested in robotics, embedded systems, controls, and hardware-software integration." />
      <div className="page-actions"><GlassButton href={resumePdf} target="_blank" rel="noreferrer">Open PDF resume ↗</GlassButton><a className="quiet-link" href="https://github.com/sinismylastname" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      <GlassSurface variant="panel" className="resume-sheet">
        <ResumeSection title="Education"><h3>California Polytechnic State University, San Luis Obispo</h3><p className="entry-info">B.S. Computer Engineering · Expected June 2030</p></ResumeSection>
        <ResumeSection title="Engineering Experience"><ResumeEntry title="Lead Programmer & Competition Strategist" info="FIRST Robotics Competition Team 3598, SEStematic Eliminators · Aug 2025 - Jun 2026">Led the team’s first migration from LabVIEW to WPILib command-based Java, programming the swerve drivetrain, turret/shooter, intake, indexer, climber, autonomous routines, and NetworkTables while coordinating with mechanical and electrical subteams. Developed teleop and autonomous turret auto-aim with dynamic shot calculations using robot velocity and target distance. Fused drivetrain odometry with Limelight AprilTag data through SwerveDrivePoseEstimator and scaled vision measurement standard deviations by distance. Created and adapted autonomous paths with Phoenix Tuner X, PathPlanner, and Choreo; served as lead strategist at the team’s first event and alliance captain during the Half Moon Bay playoffs.</ResumeEntry><ResumeEntry title="Programming & Outreach Member" info="FIRST Robotics Competition Team 3598, SEStematic Eliminators · Aug 2024 - Jun 2025">Facilitated 15+ hands-on STEM workshops for students ages 3-14 and supported teamwide outreach that reached more than 9,000 youth over three years.</ResumeEntry></ResumeSection>
        <ResumeSection title="Technical Skills"><ul className="resume-list"><li><strong>Languages:</strong> Java, Python, GDScript, C++</li><li><strong>Robotics & software:</strong> WPILib Command-Based, Git/GitHub, Phoenix Tuner X, PathPlanner, Choreo, Limelight, AprilTags, Godot, KMK</li><li><strong>Hardware & design:</strong> KiCad, Onshape, Raspberry Pi 4, Seeed XIAO RP2040, PCB design, soldering, 3D printing, multimeter</li></ul></ResumeSection>
        <ResumeSection title="Projects"><ResumeEntry title="SinnerPad · 4-Key Digital Art Macropad" info="Independent project">Designed and built a four-key macropad as a self-imposed one-day first hardware build using KiCad, a Seeed XIAO RP2040, Cherry MX-compatible switches, four SK6812MINI-E RGB LEDs, and a two-piece 3D-printed Onshape enclosure. Soldered and assembled all components, configured KMK firmware for undo, redo, copy, and paste shortcuts, and verified every key input and RGB light.</ResumeEntry><ResumeEntry title="Shiba Arcade Game & Custom Cabinet" info="Hack Club · 2025">Placed among the top 30 of 8,000+ participants in an international teen game-development challenge, earning an all-expenses-paid trip to Japan. Developed a Godot/GDScript fixed-turret wave shooter with procedurally randomized gameplay, upgrades, and original art/audio; built, painted, wired, and soldered a Raspberry Pi 4 8 GB arcade cabinet with joystick and button controls for public play.</ResumeEntry></ResumeSection>
        <ResumeSection title="Honors & Certifications"><ul className="resume-list"><li>Hack Club Shiba Award · 2025</li><li>AP Scholar with Distinction · 2025</li><li>College Board First-Generation Recognition Award · 2025</li><li>FIRST Impact Award · 2025, 2026</li><li>FIRST Team Spirit Award · 2025, 2026</li><li>FIRST Judges’ Award · 2025</li></ul></ResumeSection>
      </GlassSurface>
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) { return <section className="resume-section"><h2 className="section-title">{title}</h2>{children}</section>; }
function ResumeEntry({ title, info, children }: { title: string; info: string; children: ReactNode }) { return <div className="resume-entry"><h3>{title}</h3><p className="entry-info">{info}</p><p>{children}</p></div>; }
