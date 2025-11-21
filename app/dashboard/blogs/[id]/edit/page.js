"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import QuillEditor from "@/components/ui/QuillEditor";
import { getBlogById, updateBlog } from "@/lib/firestore-admin";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    image: "",
    visibility: true,
  });

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blog = await getBlogById(params.id);
        if (blog) {
          setFormData({
            title: blog.title,
            summary: blog.summary,
            body: blog.body,
            image: blog.image,
            visibility: blog.visibility,
          });
        } else {
          alert("Blog not found");
          router.push("/dashboard/blogs");
        }
      } catch (error) {
        console.error("Failed to load blog:", error);
        alert("Failed to load blog");
        router.push("/dashboard/blogs");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadBlog();
    }
  }, [params.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate body content (strip HTML tags to check if there's actual content)
    const bodyText = formData.body.replace(/<[^>]*>/g, "").trim();
    if (!bodyText) {
      alert("Please enter blog content");
      return;
    }
    
    setSaving(true);

    try {
      await updateBlog(params.id, formData);
      router.push("/dashboard/blogs");
    } catch (error) {
      console.error("Failed to update blog:", error);
      alert("Failed to update blog. Please try again.");
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
            <h1 className="text-4xl font-semibold text-[#1a1a1a]">Edit Blog</h1>
            <p className="text-[#6d6d6d] mt-2">Update blog post details</p>
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
                  Summary *
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-[#e7e7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5bad6a] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Body *
                </label>
                <QuillEditor
                  value={formData.body}
                  onChange={(value) =>
                    setFormData({ ...formData, body: value })
                  }
                  placeholder="Write your blog content here..."
                />
                {!formData.body && (
                  <p className="text-xs text-red-500 mt-1">
                    Body is required
                  </p>
                )}
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="blogs"
                label="Blog Image"
              />

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

