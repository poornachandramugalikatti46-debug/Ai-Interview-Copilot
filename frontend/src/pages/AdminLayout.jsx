import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({ children, rightPanel }) {
  return (
    <div className="h-screen flex bg-[#0b0f19] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-col flex-1">

        <AdminNavbar />

        <div className="flex flex-1 overflow-hidden">

          {/* MAIN CHAT */}
          <div className="flex-1 p-4 overflow-auto">
            {children}
          </div>

          {/* RIGHT PANEL */}
          <div className="w-80 border-l border-white/10 p-4 hidden md:block">
            {rightPanel}
          </div>

        </div>

      </div>

    </div>
  );
}