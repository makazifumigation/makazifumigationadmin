import Link from "next/link";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div className="section-compact">
      <Container>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold text-[#1a1a1a]">
              Admin Dashboard
            </h1>
            <p className="text-[#6d6d6d]">
              Manage blogs and projects for Makazi Fumigation website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
                  Blogs
                </h2>
                <p className="text-[#6d6d6d]">
                  Create, edit, delete, and manage blog posts. Control visibility to show or hide articles on the public website.
                </p>
              </div>
              <Button href="/dashboard/blogs" className="w-full">
                Manage Blogs
              </Button>
            </Card>

            <Card className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
                  Projects
                </h2>
                <p className="text-[#6d6d6d]">
                  Create, edit, delete, and manage project listings. Control visibility to show or hide projects on the public website.
                </p>
              </div>
              <Button href="/dashboard/projects" className="w-full">
                Manage Projects
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

