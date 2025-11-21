"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import QuillEditor from "@/components/ui/QuillEditor";
import { createBlog } from "@/lib/firestore-admin";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    image: "",
    visibility: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate body content (strip HTML tags to check if there's actual content)
    const bodyText = formData.body.replace(/<[^>]*>/g, "").trim();
    if (!bodyText) {
      alert("Please enter blog content");
      return;
    }
    
    setLoading(true);

    try {
      await createBlog(formData);
      router.push("/dashboard/blogs");
    } catch (error) {
      console.error("Failed to create blog:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-compact">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-semibold text-[#1a1a1a]">New Blog</h1>
            <p className="text-[#6d6d6d] mt-2">Create a new blog post</p>
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
                  placeholder="Blog title"
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
                  placeholder="Brief summary of the blog"
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Blog"}
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

