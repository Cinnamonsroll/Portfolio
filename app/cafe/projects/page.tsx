"use client";

import { useState } from "react";
import "../cafe.css";
import "./projects.css";
import { projects } from "./projects";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const handleProjectClick = (projectId: number) => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };

  const getShelfProjects = (shelfNumber: number) => {
    return projects.filter((project) => project.shelf === shelfNumber);
  };

  return (
    <div className="dessert-page cupcake-theme">
      <header className="dessert-header">
        <button onClick={() => router.push("/cafe")} className="back-btn">
          <svg
            className="back-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Café
        </button>
        <h1 className="dessert-title">My Projects</h1>
        <p className="dessert-subtitle">Fresh from the development oven</p>
      </header>

      <main className="display-case-container">
        <div className="display-case">
          <div className="case-frame">
            <div className="case-top"></div>
            <div className="case-glass">
              <div className="glass-reflection"></div>
              <div className="glass-shine"></div>
            </div>

            <div className="shelves">
              <div className="shelf shelf-1">
                <div className="shelf-surface"></div>
                <div className="shelf-items">
                  {getShelfProjects(1).map((project) => (
                    <div
                      key={project.id}
                      className={`bakery-item ${project.position} ${
                        selectedProject === project.id ? "selected" : ""
                      }`}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <div className="item-display">
                        <div className="item-emoji">{project.emoji}</div>
                        <div className="item-steam">
                          <div className="steam-line"></div>
                          <div className="steam-line"></div>
                          <div className="steam-line"></div>
                        </div>
                      </div>
                      <div className="item-label">
                        <div className="label-stick"></div>
                        <div className="label-card">
                          <div className="item-name">{project.name}</div>
                          <div className="item-type">{project.type}</div>
                          <div
                            className={`item-status ${project.status.toLowerCase()}`}
                          >
                            {project.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="shelf shelf-2">
                <div className="shelf-surface"></div>
                <div className="shelf-items">
                  {getShelfProjects(2).map((project) => (
                    <div
                      key={project.id}
                      className={`bakery-item ${project.position} ${
                        selectedProject === project.id ? "selected" : ""
                      }`}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <div className="item-display">
                        <div className="item-emoji">{project.emoji}</div>
                        <div className="item-steam">
                          <div className="steam-line"></div>
                          <div className="steam-line"></div>
                          <div className="steam-line"></div>
                        </div>
                      </div>
                      <div className="item-label">
                        <div className="label-stick"></div>
                        <div className="label-card">
                          <div className="item-name">{project.name}</div>
                          <div className="item-type">{project.type}</div>
                          <div
                            className={`item-status ${project.status.toLowerCase()}`}
                          >
                            {project.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="case-lighting">
              <div className="light-strip light-top"></div>
              <div className="light-strip light-middle"></div>
            </div>
          </div>
        </div>

        {selectedProject && (
          <div className="project-details">
            {(() => {
              const project = projects.find((p) => p.id === selectedProject);
              return project ? (
                <div className="details-card">
                  <div className="details-header">
                    <div className="project-emoji">{project.emoji}</div>
                    <div className="project-info">
                      <h3 className="project-name">{project.name}</h3>
                      <p className="project-type">{project.type}</p>
                    </div>
                    <button
                      className="close-btn"
                      onClick={() => setSelectedProject(null)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="details-content">
                    <p className="project-description">{project.description}</p>

                    <div className="tech-stack">
                      <h4>Technologies Used</h4>
                      <div className="tech-tags">
                        {project.tech.map((tech, index) => (
                          <span key={index} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="project-actions">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn primary"
                        >
                          View Live
                        </a>
                      )}
                      {project.code && (
                        <a
                          href={project.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn secondary"
                        >
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </main>
    </div>
  );
}
