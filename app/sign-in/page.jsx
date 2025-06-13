"use client";
import { fadeInUp, fadeIn, scaleIn } from "@/utils/animations";
import Image from "next/image";
import {
  FaInstagram,
  FaYoutube,
  FaRegEnvelope,
  FaWhatsapp,
  FaUserLock,
  FaRegEye,
  FaRegEyeSlash,
  FaCircleNotch,
} from "react-icons/fa";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ErrorBody from "@/components/ErrorBody";
import { useTheme } from "@/lib/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const page = () => {
  const [loading, setLoading] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const [emailAddress, setEmailAddress] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const allowedCharsRegex = /^[a-zA-Z0-9@._+-]*$/;

    if (allowedCharsRegex.test(value)) {
      setEmailAddress(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length <= 24) {
      setPassword(value);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => {
    // Basic email format regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Then in your validation logic:
    if (!isValidEmail(emailAddress)) {
      setError("Please enter a valid email!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (password.length < 6) {
      setError("Wrong credentials!");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      setLoading(true);
      setError(null);
      signInWithEmailAndPassword(auth, emailAddress, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setLoading(false);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError("Incorrect credentials!");
          setTimeout(() => {
            setError("");
          }, 2000);
          console.log("Error: ", errorMessage);
          setLoading(false);
        });
    }
  };

  return (
    <section className="py-16">
      <div className="container md:flex md:items-center max-w-7xl mx-auto px-4">
        <div className="w-full md:w-1/2">
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
        </div>
        <div className="w-full md:w-1/2 mx-auto text-center mt-16 md:mt-0">
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
              Login
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-6 px-6"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            Makazi Fumigation Admin Console.
          </motion.p>

          {/* Form */}
          <div className="mt-6 max-w-sm mx-auto px-6">
            <form
              className="space-y-4 text-base-regular text-slate-800"
              onSubmit={handleSignIn} // Add onSubmit handler
            >
              <div className="relative">
                <span className="absolute inset-y-0 start-0 grid place-content-center px-4 text-xl text-gray-600 dark:text-gray-300">
                  <FaRegEnvelope />
                </span>
                <input
                  type="text"
                  className="w-full bg-transparent border rounded-md border-gray-300 px-4 py-2 ps-14 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                  placeholder="Email address"
                  disabled={loading}
                  value={emailAddress}
                  onChange={handleEmailChange}
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 start-0 grid place-content-center px-4 text-xl text-gray-600 dark:text-gray-300">
                  <FaUserLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full py-2 ps-14 pe-12 !bg-transparent border rounded-md border-gray-300 px-4 text-black dark:text-gray-300 outline-slate-300 focus:border-primary-light focus:outline-none placeholder:text-slate-400"
                  placeholder="Password"
                  value={password}
                  disabled={loading}
                  onChange={handlePasswordChange}
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4 text-xl text-gray-600 dark:text-gray-300">
                  {showPassword ? (
                    <FaRegEye onClick={togglePasswordVisibility} />
                  ) : (
                    <FaRegEyeSlash onClick={togglePasswordVisibility} />
                  )}
                </span>
              </div>

              <div>
                <button
                  type="submit"
                  // onClick={loading ? null : handleSignIn}
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
      </div>
    </section>
  );
};

export default page;
