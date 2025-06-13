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
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AddProject = ({ contentData, fetchContentData }) => {
  const [loading, setLoading] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [error, setError] = useState("");
  const [heroDesc, setHeroDesc] = useState("");

  const handleLinkChange = (e) => {
    setYoutubeLink(e.target.value);
  };

  const handleHeroDescChange = (e) => {
    setHeroDesc(e.target.value);
  };

  const isValidYouTubeEmbedUrl = (url) => {
    const regex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Then in your validation logic:
    if (!isValidYouTubeEmbedUrl(youtubeLink)) {
      setError("Invalid youtube url!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (heroDesc.length < 6) {
      setError("Description too short!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setLoading(true);
      setError(null);

      try {
        const heroRef = collection(db, "Content");

        await setDoc(
          doc(heroRef, "website"),
          {
            hero_url: youtubeLink.trim(),
            hero_desc: heroDesc.trim(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error during form submission:", error);
        setLoading(true);
        setError("Failed! Try again.");
      } finally {
        setLoading(false);
        fetchContentData("website");
        //   router.push("/");
      }
    }
  };

  if (!contentData) {
    return <div>Loading</div>;
  }

  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <motion.div
          className="flex justify-center items-center"
          {...scaleIn}
          transition={{ delay: 0.2 }}
        >
          <iframe
            className="mx-auto rounded-2xl w-full aspect-video p-2 bg-gray-300 dark:bg-white"
            src={contentData.hero_url}
            allowFullScreen
          />
        </motion.div>
        <div className="w-full mx-auto">
          <motion.h1
            className="text-4xl font-bold mb-4"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            Add{" "}
            <motion.span
              className="text-primary"
              {...fadeIn}
              transition={{ delay: 0.8 }}
            >
              Project
            </motion.span>
          </motion.h1>
          <form
            className="space-y-4 text-base-regular text-slate-800"
            onSubmit={handleSubmit} // Add onSubmit handler
          >
            <input
              type="text"
              className="w-full text-sm tracking-wider bg-transparent border rounded-md border-gray-300 px-4 py-2 text-black outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
              placeholder="Youtube link"
              disabled={loading}
              value={youtubeLink}
              onChange={handleLinkChange}
            />

            <textarea
              type="text"
              className="w-full text-sm tracking-wider py-2 bg-transparent border rounded-md border-gray-300 px-4 text-black outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400 resize-none"
              placeholder="Hero description"
              rows="4"
              value={heroDesc}
              disabled={loading}
              onChange={handleHeroDescChange}
            ></textarea>

            <div>
              <button
                type="submit"
                // onClick={loading ? null : handleSubmit}
                className="bg-primary w-full py-2 rounded-lg text-white flex flex-row justify-center items-center gap-3"
                disabled={loading}
              >
                <FaCircleNotch
                  className={` animate-spin ${loading ? "block" : "hidden"}`}
                />

                <p>Sign In</p>
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

export default AddProject;
