import { useCallback, useState } from "react";
import type { Project } from "../data/projects";
import { GlassSurface } from "./GlassSurface";
import { GlassButton } from "./GlassButton";
import { ProjectNotesModal } from "./ProjectNotesModal";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const closeNotes = useCallback(() => setNotesOpen(false), []);
  return (
    <GlassSurface as="article" variant="card" interactive className={`project-card ${featured ? "is-featured" : ""}`}>
      <div className="project-media">
        <img src={project.image} alt={project.imageAlt} width="640" height="400" loading="lazy" />
        <span className="project-category">{project.category}</span>
      </div>
      <div className="project-content">
        <div className="project-heading-row">
          <p className="project-index">0{project.id === "frc-robot" ? 4 : project.id === "shiba-arcade" ? 3 : project.id === "sinnerpad" ? 2 : 1}</p>
          <h2>{project.name}</h2>
        </div>
        <p className="project-summary">{project.summary}</p>
        <div className="tech-list" aria-label="Technologies">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
        <div className="project-actions">
          <button className="text-button peek-button" type="button" data-tilt-ignore="true" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
            {expanded ? "Hide details" : "Peek inside"} <span aria-hidden="true">↗</span>
          </button>
          {project.notes && <button className="text-button notes-button" type="button" aria-haspopup="dialog" onClick={() => setNotesOpen(true)}>Read build notes <span aria-hidden="true">↗</span></button>}
          {project.links.source && <GlassButton href={project.links.source} target="_blank" rel="noreferrer">Source ↗</GlassButton>}
          {project.links.demo && <GlassButton href={project.links.demo} target="_blank" rel="noreferrer">Demo ↗</GlassButton>}
        </div>
        <p className={`project-details${expanded ? " is-expanded" : ""}`} aria-hidden={!expanded}>{project.details}</p>
      </div>
      {project.notes && notesOpen && <ProjectNotesModal notes={project.notes} onClose={closeNotes} />}
    </GlassSurface>
  );
}
