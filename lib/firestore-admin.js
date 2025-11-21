import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Blog operations
export async function createBlog(blogData) {
  const blogsRef = collection(db, "Blogs");
  const newBlog = {
    blog_title: blogData.title,
    blog_summary: blogData.summary,
    blog_body: blogData.body,
    blog_image: blogData.image || "",
    blog_visibility: blogData.visibility ?? true,
    blog_submitted_time: serverTimestamp(),
  };
  const docRef = await addDoc(blogsRef, newBlog);
  return docRef.id;
}

export async function updateBlog(blogId, blogData) {
  const blogRef = doc(db, "Blogs", blogId);
  const updateData = {};

  if (blogData.title !== undefined) updateData.blog_title = blogData.title;
  if (blogData.summary !== undefined)
    updateData.blog_summary = blogData.summary;
  if (blogData.body !== undefined) updateData.blog_body = blogData.body;
  if (blogData.image !== undefined) updateData.blog_image = blogData.image;
  if (blogData.visibility !== undefined)
    updateData.blog_visibility = blogData.visibility;

  await updateDoc(blogRef, updateData);
}

export async function deleteBlog(blogId) {
  const blogRef = doc(db, "Blogs", blogId);
  await deleteDoc(blogRef);
}

export async function toggleBlogVisibility(blogId, visibility) {
  const blogRef = doc(db, "Blogs", blogId);
  await updateDoc(blogRef, { blog_visibility: visibility });
}

export async function getAllBlogs() {
  const blogsRef = collection(db, "Blogs");
  const q = query(blogsRef, orderBy("blog_submitted_time", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    blog_id: doc.id,
    title: doc.data().blog_title ?? "",
    summary: doc.data().blog_summary ?? "",
    body: doc.data().blog_body ?? "",
    image: doc.data().blog_image ?? "",
    visibility: doc.data().blog_visibility ?? false,
    submittedAt: doc.data().blog_submitted_time?.toDate() || null,
  }));
}

export async function getBlogById(blogId) {
  const blogRef = doc(db, "Blogs", blogId);
  const snapshot = await getDoc(blogRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    blog_id: snapshot.id,
    title: data.blog_title ?? "",
    summary: data.blog_summary ?? "",
    body: data.blog_body ?? "",
    image: data.blog_image ?? "",
    visibility: data.blog_visibility ?? false,
    submittedAt: data.blog_submitted_time?.toDate() || null,
  };
}

// Project operations
export async function createProject(projectData) {
  const projectsRef = collection(db, "Projects");
  const newProject = {
    project_title: projectData.title,
    project_description: projectData.description,
    project_image: projectData.image || "",
    project_destination: projectData.destination || "",
    project_visibility: projectData.visibility ?? true,
    project_submitted_time: serverTimestamp(),
  };
  const docRef = await addDoc(projectsRef, newProject);
  return docRef.id;
}

export async function updateProject(projectId, projectData) {
  const projectRef = doc(db, "Projects", projectId);
  const updateData = {};

  if (projectData.title !== undefined)
    updateData.project_title = projectData.title;
  if (projectData.description !== undefined)
    updateData.project_description = projectData.description;
  if (projectData.image !== undefined)
    updateData.project_image = projectData.image;
  if (projectData.destination !== undefined)
    updateData.project_destination = projectData.destination;
  if (projectData.visibility !== undefined)
    updateData.project_visibility = projectData.visibility;

  await updateDoc(projectRef, updateData);
}

export async function deleteProject(projectId) {
  const projectRef = doc(db, "Projects", projectId);
  await deleteDoc(projectRef);
}

export async function toggleProjectVisibility(projectId, visibility) {
  const projectRef = doc(db, "Projects", projectId);
  await updateDoc(projectRef, { project_visibility: visibility });
}

export async function getAllProjects() {
  const projectsRef = collection(db, "Projects");
  const q = query(projectsRef, orderBy("project_submitted_time", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    project_id: doc.id,
    title: doc.data().project_title ?? "",
    description: doc.data().project_description ?? "",
    image: doc.data().project_image ?? "",
    destination: doc.data().project_destination ?? "",
    visibility: doc.data().project_visibility ?? false,
    submittedAt: doc.data().project_submitted_time?.toDate() || null,
  }));
}

export async function getProjectById(projectId) {
  const projectRef = doc(db, "Projects", projectId);
  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    project_id: snapshot.id,
    title: data.project_title ?? "",
    description: data.project_description ?? "",
    image: data.project_image ?? "",
    destination: data.project_destination ?? "",
    visibility: data.project_visibility ?? false,
    submittedAt: data.project_submitted_time?.toDate() || null,
  };
}
