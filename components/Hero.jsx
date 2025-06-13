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

const Hero = ({ contentData, fetchContentData }) => {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [error, setError] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [destinationLink, setDestinationLink] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/images/horizontal-placeholder.jpg"
  );

  const handleTitleChange = (e) => {
    setProjectTitle(e.target.value);
  };

  const handleProjectDescChange = (e) => {
    setProjectDesc(e.target.value);
  };

  const handleDestinationLinkChange = (e) => {
    setDestinationLink(e.target.value);
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
    if (projectTitle.length < 3) {
      setError("Title too short!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (projectDesc.length < 6) {
      setError("Description too short!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (destinationLink.length < 6) {
      setError("Invalid destination link!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setLoading(true);
      setError(null);

      try {
        const projectRef = collection(db, "Projects");
        const docRef = await addDoc(projectRef, {
          project_title: projectTitle.trim(),
          project_description: projectDesc.trim(),
          project_image: "",
          project_submitted_time: serverTimestamp(),
          project_visibility: true,
          project_id: "-",
        });

        const newDocId = docRef.id;

        // Upload image
        const imageRef = ref(storage, `Projects/${newDocId}`);
        await uploadBytes(imageRef, selectedImage);
        const imageUrl = await getDownloadURL(imageRef);

        await setDoc(
          doc(projectRef, newDocId),
          {
            project_id: newDocId,
            project_image: imageUrl,
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
        setProjectTitle("");
        setProjectDesc("");
        setDestinationLink("");
        setSelectedImage(null);
        setImagePreview("/images/horizontal-placeholder.jpg");
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
      <div className="container max-w-7xl mx-auto px-4 text-center  pb-10">
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </motion.button>
        <motion.h1
          className="text-4xl font-bold mb-2"
          {...fadeInUp}
          transition={{ delay: 0.3 }}
        >
          Admin{" "}
          <motion.span
            className="text-primary"
            {...fadeIn}
            transition={{ delay: 0.8 }}
          >
            Console
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 mb-6 px-6"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          Manage Content On Makazi Fumigation.
        </motion.p>
      </div>
      <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <motion.div
          className="flex justify-center items-center"
          {...scaleIn}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-full cursor-pointer">
            <Image
              className="mx-auto rounded-2xl w-full aspect-video p-2 bg-gray-300 dark:bg-white object-cover"
              src={imagePreview}
              height={1080}
              width={1920}
              alt="Module image"
              onClick={() => document.getElementById("imageInput").click()}
            />
            <input
              type="file"
              id="imageInput"
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
            Add Project
          </motion.h1>
          <form
            className="space-y-4 text-base-regular text-slate-800"
            onSubmit={handleSubmit} // Add onSubmit handler
          >
            <input
              type="text"
              className="w-full text-sm tracking-wider bg-transparent border rounded-md border-gray-300 px-4 py-2 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
              placeholder="Project title"
              disabled={loading}
              value={projectTitle}
              onChange={handleTitleChange}
            />

            <textarea
              type="text"
              className="w-full text-sm tracking-wider py-2 bg-transparent border rounded-md border-gray-300 px-4 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400 resize-none"
              placeholder="Project description"
              rows="3"
              value={projectDesc}
              disabled={loading}
              onChange={handleProjectDescChange}
            ></textarea>

            <input
              type="text"
              className="w-full text-sm tracking-wider bg-transparent border rounded-md border-gray-300 px-4 py-2 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
              placeholder="Destination link"
              disabled={loading}
              value={destinationLink}
              onChange={handleDestinationLinkChange}
            />

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

                <p>Submit Project</p>
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

export default Hero;
