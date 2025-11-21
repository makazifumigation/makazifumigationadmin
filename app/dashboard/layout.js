import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Navbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}

