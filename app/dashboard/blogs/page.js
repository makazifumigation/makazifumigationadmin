"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  getAllBlogs,
  deleteBlog,
  toggleBlogVisibility,
} from "@/lib/firestore-admin";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(blogId);
      await loadBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const handleToggleVisibility = async (blogId, currentVisibility) => {
    try {
      await toggleBlogVisibility(blogId, !currentVisibility);
      await loadBlogs();
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
              <h1 className="text-4xl font-semibold text-[#1a1a1a]">Blogs</h1>
              <p className="text-[#6d6d6d] mt-2">
                Manage all blog posts
              </p>
            </div>
            <Button href="/dashboard/blogs/new">+ New Blog</Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#6d6d6d]">Loading...</div>
          ) : blogs.length === 0 ? (
            <Card variant="muted" className="text-center py-12">
              <p className="text-[#6d6d6d] mb-4">No blogs yet.</p>
              <Button href="/dashboard/blogs/new">Create Your First Blog</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog) => (
                <Card key={blog.id} className="grid gap-4 group hover:shadow-md transition-shadow">
                  {blog.image && (
                    <div className="relative overflow-hidden rounded-lg aspect-video">
                      <Image
                        src={blog.image}
                        alt={blog.title || "Blog image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded shadow-sm ${
                            blog.visibility
                              ? "bg-green-500 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {blog.visibility ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  )}
                  {!blog.image && (
                    <div className="relative overflow-hidden rounded-lg aspect-video bg-[#f6f6f6] flex items-center justify-center">
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded shadow-sm ${
                            blog.visibility
                              ? "bg-green-500 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {blog.visibility ? "Visible" : "Hidden"}
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[#1a1a1a] line-clamp-2">
                      {blog.title || "Untitled"}
                    </h3>
                    <p className="text-[#6d6d6d] line-clamp-3 text-sm">
                      {blog.summary || "No summary"}
                    </p>
                    <p className="text-xs text-[#6d6d6d]">
                      {formatDate(blog.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#e7e7e7]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(blog.id, blog.visibility)}
                      className="flex-1"
                    >
                      {blog.visibility ? "Hide" : "Show"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      href={`/dashboard/blogs/${blog.id}/edit`}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
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

