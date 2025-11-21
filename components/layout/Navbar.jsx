"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-[#e7e7e7] sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="text-xl font-semibold text-[#1a1a1a]">
            Makazi Admin
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <Link
                  href="/dashboard/blogs"
                  className="text-[#6d6d6d] hover:text-[#5bad6a] transition-colors"
                >
                  Blogs
                </Link>
                <Link
                  href="/dashboard/projects"
                  className="text-[#6d6d6d] hover:text-[#5bad6a] transition-colors"
                >
                  Projects
                </Link>
                <span className="text-sm text-[#6d6d6d]">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}

