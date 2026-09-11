import avatarImage from "../../../images/andy-avatar.svg";
import websitePreview from "../../../images/project-preview.svg";
import sinnerpadImage from "../../../images/sinnerpad.png";
import shibaImage from "../../../images/lockednloaded.png";
import robotImage from "../../../images/robot.jpg";

export type ProjectNotes = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  details: string;
  notes?: ProjectNotes;
  image: string;
  imageAlt: string;
  technologies: string[];
  category: "software" | "hardware" | "robotics";
  accentColor: string;
  glowColor: string;
  reflectionColor: string;
  tagBackground: string;
  links: { source?: string; demo?: string; writeup?: string };
  featured?: boolean;
};

export const profileImage = avatarImage;

export const projects: Project[] = [
  {
    id: "starterpack",
    name: "hack4impact StarterPack",
    summary: "A responsive five-page portfolio made with semantic HTML and CSS.",
    details: "Built through the Hack4Impact Starter Pack and designed to grow with my experience. This refactor is the next iteration: a component-based interactive portfolio with a physical glass material system.",
    image: websitePreview,
    imageAlt: "Frutiger styled preview of Andy's personal website",
    technologies: ["HTML", "CSS", "React", "TypeScript", "GitHub Pages"],
    category: "software",
    accentColor: "#008fac",
    glowColor: "rgba(0,143,172,.24)",
    reflectionColor: "rgba(86,224,255,.3)",
    tagBackground: "rgba(86,224,255,.18)",
    links: {},
    featured: true,
    notes: {
      eyebrow: "September 2026 · First launch",
      title: "Building my first personal website",
      paragraphs: [
        "The Hack4Impact Starter Pack gave me a practical introduction to Git, semantic HTML, CSS, and publishing with GitHub Pages. The biggest lesson was that a website is easier to improve when its structure and styling have separate jobs.",
        "I also practiced making small commits, writing accessible image text, and building navigation that stays consistent across several pages. There is a lot more I want to add, but getting a complete first version online is a good place to begin.",
      ],
    },
  },
  {
    id: "sinnerpad",
    name: "SinnerPad",
    summary: "A four-key digital-art macropad designed and built in one day.",
    details: "Designed and built a four-key digital-art macropad as a self-imposed one-day first hardware build. I designed the custom PCB in KiCad around a Seeed XIAO RP2040, Cherry MX-compatible switches, and four SK6812MINI-E RGB LEDs; modeled a two-piece 3D-printed enclosure in Onshape; soldered and assembled every component; and configured KMK firmware for undo, redo, copy, and paste shortcuts. I verified each key input and the RGB lighting after assembly.",
    image: sinnerpadImage,
    imageAlt: "Preview of the SinnerPad macropad",
    technologies: ["KiCad", "Seeed XIAO RP2040", "KMK", "Cherry MX switches", "SK6812MINI-E", "Onshape", "3D printing"],
    category: "hardware",
    accentColor: "#4b9d46",
    glowColor: "rgba(75,157,70,.24)",
    reflectionColor: "rgba(173,244,102,.28)",
    tagBackground: "rgba(173,244,102,.2)",
    links: {},
    featured: true,
  },
  {
    id: "shiba-arcade",
    name: "Shiba Arcade Game & Custom Cabinet",
    summary: "A Godot wave shooter with a Raspberry Pi arcade cabinet.",
    details: "Placed among the top 30 of more than 8,000 participants in Hack Club’s international Shiba challenge, earning an all-expenses-paid trip to Japan. I developed a Godot/GDScript fixed-turret wave shooter with procedurally randomized gameplay, upgrades, and original art and audio. I also built, painted, wired, and soldered a Raspberry Pi 4 8 GB arcade cabinet with joystick and button controls for public play.",
    image: shibaImage,
    imageAlt: "Preview of the Game Title Screen for the Shiba Arcade Game",
    technologies: ["Godot", "GDScript", "Raspberry Pi 4 8 GB", "Procedural gameplay", "Original art/audio", "Electronics"],
    category: "software",
    accentColor: "#c76c33",
    glowColor: "rgba(199,108,51,.24)",
    reflectionColor: "rgba(255,185,112,.28)",
    tagBackground: "rgba(255,185,112,.2)",
    links: {},
    featured: true,
  },
  {
    id: "frc-robot",
    name: "FRC Team 3598 Robot Software",
    summary: "FRC robot software for swerve drive, vision-fused pose estimation, auto-aim, and autonomous path planning.",
    details: "As lead programmer and competition strategist, I led Team 3598’s first migration from LabVIEW to WPILib command-based Java. I programmed the swerve drivetrain, turret/shooter, intake, indexer, climber, autonomous routines, and NetworkTables while coordinating with mechanical and electrical subteams. I developed teleop and autonomous turret auto-aim with dynamic shot calculations based on robot velocity and target distance, and fused drivetrain odometry with Limelight AprilTag data through SwerveDrivePoseEstimator while scaling vision measurement standard deviations by distance. I created and adapted autonomous paths with Phoenix Tuner X, PathPlanner, and Choreo, served as lead strategist at the team’s first event, and was alliance captain during the Half Moon Bay playoffs.",
    image: robotImage,
    imageAlt: "Preview of the FRC robot",
    technologies: ["Java", "WPILib Command-Based", "NetworkTables", "Limelight", "AprilTags", "SwerveDrivePoseEstimator", "Phoenix Tuner X", "PathPlanner", "Choreo"],
    category: "robotics",
    accentColor: "#456ed0",
    glowColor: "rgba(69,110,208,.24)",
    reflectionColor: "rgba(125,174,255,.3)",
    tagBackground: "rgba(125,174,255,.18)",
    links: {},
    featured: false,
  },
];
