"use client";

import Image from "next/image";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, cardHoverSmall } from "@/utils/animations";
// import { projects } from "@/contents/projects";
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
import Link from "next/link";

const Projects = ({ language }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProjects = async () => {
    const dbInstance = collection(db, "Projects");
    let q = query(
      dbInstance,
      // where("module_poster_id", "==", userData.user_id),
      where("project_visibility", "==", true),
      orderBy("project_submitted_time", "desc")
    );

    setLoading(true);
    try {
      const data = await getDocs(q);

      const newData = data.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      setProjects(newData);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    } finally {
      setLoading(false); // Set loading state after the query completes (whether success or error)
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, "Projects", projectId));
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
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
          {language === "sw" ? "Kazi Tulizo Fanya" : "Featured Projects"}
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 px-6 text-center"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          {language === "sw"
            ? "Tumegusa maisha ya watu sehemu mbalimbali."
            : "We’ve made a meaningful impact in the community."}
          <br />
          {language === "sw"
            ? "Hizi ni miongoni mwa kazi tulizofanya"
            : "Here are some of our most notable projects."}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {projects.map((project) => (
            <motion.article
              key={project.project_id}
              className="bg-white dark:bg-dark/50 rounded-3xl border-2 border-gray-100 dark:border-dark p-6"
              variants={fadeInUp}
              {...cardHoverSmall}
            >
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteProject(project.project_id)}
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>

                <Image
                  src={project.project_image}
                  alt={project.project_title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <Link href={project.project_destination} target="_blank">
                <motion.h3
                  className="text-xl font-semibold mb-2 hover:text-primary transition-colors  line-clamp-1"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {project.project_title}
                </motion.h3>
              </Link>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {project.project_description}
              </motion.p>
              {/* <motion.div
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {project.technologies.map((tech) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div> */}
              {/* <motion.div
                className="flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub className="h-5 w-5" />
                  <span>Code</span>
                </motion.a>
                <motion.a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaExternalLinkAlt className="h-5 w-5" />
                  <span>Live Demo</span>
                </motion.a>
              </motion.div> */}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
