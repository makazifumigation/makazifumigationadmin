"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import { getProjectById, updateProject } from "@/lib/firestore-admin";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    destination: "",
    visibility: true,
  });

  useEffect(() => {
    const loadProject = async () => {
      try {
        const project = await getProjectById(params.id);
        if (project) {
          setFormData({
            title: project.title,
            description: project.description,
            image: project.image,
            destination: project.destination,
            visibility: project.visibility,
          });
        } else {
          alert("Project not found");
          router.push("/dashboard/projects");
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        alert("Failed to load project");
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProject();
    }
  }, [params.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProject(params.id, formData);
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="section-compact">
        <Container>
          <div className="text-center py-12 text-[#6d6d6d]">Loading...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="section-compact">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-semibold text-[#1a1a1a]">Edit Project</h1>
            <p className="text-[#6d6d6d] mt-2">Update project details</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-[#e7e7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5bad6a] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-[#e7e7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5bad6a] focus:border-transparent"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="projects"
                label="Project Image"
              />

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#e7e7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5bad6a] focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visibility"
                  checked={formData.visibility}
                  onChange={(e) =>
                    setFormData({ ...formData, visibility: e.target.checked })
                  }
                  className="w-4 h-4 text-[#5bad6a] border-[#e7e7e7] rounded focus:ring-[#5bad6a]"
                />
                <label htmlFor="visibility" className="text-sm text-[#1a1a1a]">
                  Make visible on public website
                </label>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
}

