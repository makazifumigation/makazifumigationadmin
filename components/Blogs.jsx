"use client";

// import { blogs } from '@/contents/blogs';
import Link from "next/link";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, cardHoverSmall } from "@/utils/animations";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { calculateReadTime } from "@/lib/functions";
// import { blogs } from "@/contents/blogs";

const Blogs = ({ language }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteBlog = async (blogId) => {
    try {
      await deleteDoc(doc(db, "Blogs", blogId));
      setBlogs((prev) => prev.filter((project) => project.id !== blogId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getProjects = async () => {
    const dbInstance = collection(db, "Blogs");
    let q = query(
      dbInstance,
      // where("module_poster_id", "==", userData.user_id),
      where("blog_visibility", "==", true),
      orderBy("blog_submitted_time", "desc")
    );

    setLoading(true);
    try {
      const data = await getDocs(q);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setBlogs(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-4 text-center"
          {...fadeInUp}
        >
          {language === "sw" ? "Makala Zetu" : "Our Blog Posts"}
        </motion.h2>

        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 px-6 text-center"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          {language === "sw"
            ? "Mbali na juhudi zetu kudhibiti wadudu,"
            : "Besides our efforts in pest control, "}
          <br />
          {language === "sw"
            ? "tunaelimisha umma kuhusu umuhimu wake."
            : "we educate the public on its importance."}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {blogs.map((blog) => (
            <motion.article
              key={blog.blog_title}
              className="bg-white dark:bg-dark/50 rounded-lg shadow-md p-6"
              variants={fadeInUp}
              {...cardHoverSmall}
            >
              <Link
                href={`https://www.makazifumigation.co.tz/blogs/${blog.blog_id}`}
                target="_blank"
              >
                <motion.h3
                  className="text-xl font-semibold mb-2 hover:text-primary transition-colors  line-clamp-1"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {blog.blog_title}
                </motion.h3>
              </Link>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {blog.blog_summary}
              </motion.p>
              <motion.div
                className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaCalendarAlt className="mr-2" />
                  {blog.blog_submitted_time
                    ?.toDate()
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </motion.span>
                <motion.span
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaClock className="mr-2" />
                  <span>{calculateReadTime(blog.blog_body)}</span>
                </motion.span>
                <button
                  onClick={() => handleDeleteBlog(blog.blog_id)}
                  className=" bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/blogs"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {language === "sw" ? "Makala Zaidi" : "More Posts"}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blogs;
