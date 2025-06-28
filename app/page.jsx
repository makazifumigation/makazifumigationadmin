"use client";
import AddBlog from "@/components/AddBlog";
import AddProject from "@/components/AddProject";
import Blogs from "@/components/Blogs";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import Sponsors from "@/components/Sponsors";
import { UserAuth } from "@/lib/AuthContext";
import Image from "next/image";

export default function Home() {
  const { contentData, fetchContentData } = UserAuth();
  const language = "en";

  if (!contentData) {
    return (
      <div className="flex items-center justify-center h-80">
        <Image
          className="animate-spin h-6 w-6"
          src="loading.svg"
          height={48}
          width={48}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <main>
      <Hero contentData={contentData} fetchContentData={fetchContentData} />

      <AddBlog contentData={contentData} fetchContentData={fetchContentData} />
      <Projects language={language} />
      <Blogs language={language} />
    </main>
  );
}
