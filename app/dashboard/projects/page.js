"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  getAllProjects,
  deleteProject,
  toggleProjectVisibility,
} from "@/lib/firestore-admin";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleToggleVisibility = async (projectId, currentVisibility) => {
    try {
      await toggleProjectVisibility(projectId, !currentVisibility);
      await loadProjects();
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      alert("Failed to update visibility. Please try again.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="section-compact">
      <Container>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-[#1a1a1a]">Projects</h1>
              <p className="text-[#6d6d6d] mt-2">
                Manage all project listings
              </p>
            </div>
            <Button href="/dashboard/projects/new">+ New Project</Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#6d6d6d]">Loading...</div>
          ) : projects.length === 0 ? (
            <Card variant="muted" className="text-center py-12">
              <p className="text-[#6d6d6d] mb-4">No projects yet.</p>
              <Button href="/dashboard/projects/new">Create Your First Project</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="grid gap-4 group hover:shadow-md transition-shadow">
                  {project.image && (
                    <div className="relative overflow-hidden rounded-lg aspect-video">
                      <Image
                        src={project.image}
                        alt={project.title || "Project image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded shadow-sm ${
                            project.visibility
                              ? "bg-green-500 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {project.visibility ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  )}
                  {!project.image && (
                    <div className="relative overflow-hidden rounded-lg aspect-video bg-[#f6f6f6] flex items-center justify-center">
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded shadow-sm ${
                            project.visibility
                              ? "bg-green-500 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {project.visibility ? "Visible" : "Hidden"}
                        </span>
                      </div>
                      <svg
                        className="w-16 h-16 text-[#6d6d6d]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[#1a1a1a] line-clamp-2">
                      {project.title || "Untitled"}
                    </h3>
                    <p className="text-[#6d6d6d] line-clamp-3 text-sm">
                      {project.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-[#6d6d6d]">
                        {formatDate(project.submittedAt)}
                      </p>
                      {project.destination && (
                        <a
                          href={project.destination}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5bad6a] hover:underline truncate max-w-[120px]"
                          title={project.destination}
                        >
                          🔗 Link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#e7e7e7]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(project.id, project.visibility)}
                      className="flex-1"
                    >
                      {project.visibility ? "Hide" : "Show"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      href={`/dashboard/projects/${project.id}/edit`}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

