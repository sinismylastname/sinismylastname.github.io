export const navigation = [
  { id: "home", label: "Home" },
  { id: "notes", label: "Notes" },
  { id: "work", label: "Portfolio" },
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
] as const;

export type PageId = (typeof navigation)[number]["id"];

export const interests = ["Robotics", "Embedded systems", "Web development", "Game design"];
