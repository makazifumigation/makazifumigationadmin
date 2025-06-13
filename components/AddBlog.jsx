"use client";
import { fadeInUp, fadeIn, scaleIn } from "@/utils/animations";
import Image from "next/image";
import {
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
  FaCircleNotch,
} from "react-icons/fa";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ErrorBody from "./ErrorBody";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useTheme } from "@/lib/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const AddBlog = ({ contentData, fetchContentData }) => {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [error, setError] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogBody, setBlogBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/images/horizontal-placeholder.jpg"
  );

  const handleTitleChange = (e) => {
    setBlogTitle(e.target.value);
  };

  const handleBlogSummaryChange = (e) => {
    setBlogSummary(e.target.value);
  };

  const handleBlogBodyChange = (e) => {
    setBlogBody(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isValidYouTubeEmbedUrl = (url) => {
    const regex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("Please select an image.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    // Then in your validation logic:
    if (blogTitle.length < 3) {
      setError("Title too short!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (blogSummary.length < 6) {
      setError("Description too short!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (blogBody.length < 6) {
      setError("Invalid destination link!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setLoading(true);
      setError(null);

      try {
        const projectRef = collection(db, "Blogs");
        const docRef = await addDoc(projectRef, {
          blog_title: blogTitle.trim(),
          blog_summary: blogSummary.trim(),
          blog_body: blogBody.trim(),
          blog_image: "",
          blog_submitted_time: serverTimestamp(),
          blog_visibility: true,
          blog_id: "-",
        });

        const newDocId = docRef.id;

        // Upload image
        const imageRef = ref(storage, `Blogs/${newDocId}`);
        await uploadBytes(imageRef, selectedImage);
        const imageUrl = await getDownloadURL(imageRef);

        await setDoc(
          doc(projectRef, newDocId),
          {
            blog_id: newDocId,
            blog_image: imageUrl,
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error during form submission:", error);
        setLoading(true);
        setError("Failed! Try again.");
        setTimeout(() => {
          setError("");
        }, 2000);
      } finally {
        setLoading(false);
        setSelectedImage(null);
        setImagePreview("/images/horizontal-placeholder.jpg");
        setBlogTitle("");
        setBlogSummary("");
        setBlogBody("");
        fetchContentData("website");
        //   router.push("/");
      }
    }
  };

  if (!contentData) {
    return <div>Loading</div>;
  }

  return (
    <section className="pb-16">
      <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <motion.div
          className="flex justify-center items-center"
          {...scaleIn}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-full cursor-pointer">
            <Image
              className="mx-auto rounded-2xl w-full aspect-square p-2 bg-gray-300 dark:bg-white object-cover"
              src={imagePreview}
              height={1080}
              width={1920}
              alt="Module image"
              onClick={() => document.getElementById("blogImageInput").click()}
            />
            <input
              type="file"
              id="blogImageInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {/* <Image
            className="mx-auto rounded-2xl w-full aspect-video p-2 bg-gray-300 dark:bg-white object-cover"
            src="/images/vertical_placeholder.png"
            height={1080}
            width={1920}
            alt="socials"
          /> */}
        </motion.div>
        <div className="w-full mx-auto">
          <motion.h1
            className="text-4xl font-bold mb-4"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            Add Blog
          </motion.h1>
          <form
            className="space-y-4 text-base-regular text-slate-800"
            onSubmit={handleSubmit} // Add onSubmit handler
          >
            <input
              type="text"
              className="w-full text-sm tracking-wider bg-transparent border rounded-md border-gray-300 px-4 py-2 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
              placeholder="Blog title"
              disabled={loading}
              value={blogTitle}
              onChange={handleTitleChange}
            />

            <textarea
              type="text"
              className="w-full text-sm tracking-wider py-2 bg-transparent border rounded-md border-gray-300 px-4 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400 resize-none"
              placeholder="Blog summary"
              rows="5"
              value={blogSummary}
              disabled={loading}
              onChange={handleBlogSummaryChange}
            ></textarea>

            <textarea
              type="text"
              className="w-full text-sm tracking-wider py-2 bg-transparent border rounded-md border-gray-300 px-4 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400 resize-none"
              placeholder="Blog body"
              rows="12"
              value={blogBody}
              disabled={loading}
              onChange={handleBlogBodyChange}
            ></textarea>

            <div>
              <button
                type="submit"
                // onClick={loading ? null : handleSubmit}
                className="bg-primary w-full py-2 rounded-lg text-white flex flex-row justify-center items-center gap-3 tracking-wider"
                disabled={loading}
              >
                <FaCircleNotch
                  className={` animate-spin ${loading ? "block" : "hidden"}`}
                />

                <p>Submit Blog</p>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6">
              <ErrorBody error={error} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddBlog;
