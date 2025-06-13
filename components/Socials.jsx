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

const Socials = ({ contentData, fetchContentData }) => {
  const [loading, setLoading] = useState(false);
  const [instagramLink, setInstagramLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [error, setError] = useState("");
  const [whatsAppNo, setWhatsApp] = useState("");

  const handleInstagramLinkChange = (e) => {
    setInstagramLink(e.target.value);
  };

  const handleYoutubeLinkChange = (e) => {
    setYoutubeLink(e.target.value);
  };

  const handleWhatsAppChange = (e) => {
    setWhatsApp(e.target.value);
  };
  const isValidInstagramProfileUrl = (url) => {
    const regex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/;
    return regex.test(url);
  };

  const isValidYouTubeProfileUrl = (url) => {
    const regex =
      /^https:\/\/(www\.)?youtube\.com\/(user|channel|c)\/[a-zA-Z0-9_-]+\/?$/;
    return regex.test(url);
  };

  const isValidWhatsAppNumber = (number) => {
    const regex = /^255[67][0-9]{8}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Then in your validation logic:
    if (!isValidInstagramProfileUrl(instagramLink)) {
      setError("Invalid instagram url!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (!isValidYouTubeProfileUrl(youtubeLink)) {
      setError("Invalid youtube url!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (!isValidWhatsAppNumber(whatsAppNo)) {
      setError("Invalid WhatsApp number");
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
            instagram_profile: instagramLink.trim(),
            youtube_profile: youtubeLink.trim(),
            whatsapp_number: whatsAppNo.trim(),
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
          <Image
            className="mx-auto rounded-2xl w-full aspect-video p-2 bg-gray-300 dark:bg-white object-cover"
            src="/images/fumisocial.jpg"
            height={1080}
            width={1920}
            alt="socials"
          />
        </motion.div>
        <div className="w-full mx-auto">
          <motion.h1
            className="text-4xl font-bold mb-4"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            Social{" "}
            <motion.span
              className="text-primary"
              {...fadeIn}
              transition={{ delay: 0.8 }}
            >
              Links
            </motion.span>
          </motion.h1>
          <form
            className="space-y-4 text-base-regular text-slate-800"
            onSubmit={handleSubmit} // Add onSubmit handler
          >
            <input
              type="text"
              className="w-full text-sm tracking-wider bg-transparent border rounded-md border-gray-300 px-4 py-2 text-black outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
              placeholder="Instagram link"
              disabled={loading}
              value={instagramLink}
              onChange={handleInstagramLinkChange}
            />

            <input
              type="text"
              className="w-full text-sm tracking-wider bg-transparent border rounded-md border-gray-300 px-4 py-2 text-black outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
              placeholder="Youtube link"
              disabled={loading}
              value={youtubeLink}
              onChange={handleYoutubeLinkChange}
            />

            <input
              type="text"
              className="w-full text-sm tracking-wider bg-transparent border rounded-md border-gray-300 px-4 py-2 text-black outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
              placeholder="WhatsApp number"
              value={whatsAppNo}
              disabled={loading}
              onChange={handleWhatsAppChange}
            />

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

export default Socials;
