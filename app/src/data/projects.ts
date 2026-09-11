import avatarImage from "../../../images/andy-avatar.svg";
import websitePreview from "../../../images/project-preview.svg";
import sinnerpadImage from "../../../images/sinnerpad.png";
import shibaImage from "../../../images/lockednloaded.png";
import robotImage from "../../../images/robot.jpg";

export type Project = {
  id: string;
  name: string;
  summary: string;
  details: string;
  image: string;
  imageAlt: string;
  technologies: string[];
  category: "software" | "hardware" | "robotics";
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
    links: {},
    featured: true,
  },
  {
    id: "sinnerpad",
    name: "SinnerPad",
    summary: "A four-key digital-art macropad designed and built in one day.",
    details: "I made the PCB in KiCad, designed a two-piece enclosure in Onshape, then soldered and tested every part. The RP2040 runs KMK firmware and drives SK6812MINI-E lighting.",
    image: sinnerpadImage,
    imageAlt: "Preview of the SinnerPad macropad",
    technologies: ["KiCad", "RP2040", "KMK", "SK6812MINI-E", "Onshape"],
    category: "hardware",
    links: {},
    featured: true,
  },
  {
    id: "shiba-arcade",
    name: "Shiba Arcade Game & Custom Cabinet",
    summary: "A Godot wave shooter with a Raspberry Pi arcade cabinet.",
    details: "I built the game with randomized gameplay, upgrades, original art/audio, and a fixed turret. I also built, painted, wired, and soldered the cabinet for public play. It placed in the top 30 of 8,000+ Hack Club Shiba challenge participants.",
    image: shibaImage,
    imageAlt: "Preview of the Game Title Screen for the Shiba Arcade Game",
    technologies: ["Godot", "GDScript", "Raspberry Pi 4", "Electronics"],
    category: "software",
    links: {},
    featured: true,
  },
  {
    id: "frc-robot",
    name: "FRC Team 3598 Robot Software",
    summary: "Robot software for swerve drive, vision fusion, and autonomous planning.",
    details: "As lead programmer, I helped migrate the SEStematic Eliminators from LabVIEW to command-based Java. The system included AprilTag vision fusion, autonomous path planning, and auto-aiming.",
    image: robotImage,
    imageAlt: "Preview of the FRC robot",
    technologies: ["Java", "WPILib", "Limelight", "AprilTags", "PathPlanner"],
    category: "robotics",
    links: {},
    featured: false,
  },
];
