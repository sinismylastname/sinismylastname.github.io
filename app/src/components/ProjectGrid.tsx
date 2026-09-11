import { projects } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const visibleProjects = featuredOnly ? projects.filter((project) => project.featured) : projects;
  return <div className={`project-grid ${featuredOnly ? "is-featured-grid" : ""}`}>{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} featured={featuredOnly} />)}</div>;
}
