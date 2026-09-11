import { useMemo, useState } from "react";
import { projects, type Project } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";
import { SectionHeading } from "../components/SectionHeading";

const filters: Array<"all" | Project["category"]> = ["all", "software", "hardware", "robotics"];

export function PortfolioPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const visibleProjects = useMemo(() => filter === "all" ? projects : projects.filter((project) => project.category === filter), [filter]);
  return (
    <div className="page-content portfolio-page">
      <SectionHeading eyebrow="Selected work" title="Portfolio" text="I like building at the intersection of code and hardware, along with building the people who use it. Peek inside a few projects below." />
      <div className="filter-row" aria-label="Filter projects">
        {filters.map((item) => <button key={item} type="button" className={`filter-button ${filter === item ? "is-selected" : ""}`} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <div className="project-grid full-project-grid">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      <p className="github-line">More work and code: <a href="https://github.com/sinismylastname" target="_blank" rel="noreferrer">github.com/sinismylastname ↗</a></p>
    </div>
  );
}
