import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-14 flex items-center justify-between px-6 
      border-b border-white/10 
      bg-white/5 backdrop-blur-xl text-white">

      {/* LEFT */}
      <div className="text-white/70 font-medium">
        Dashboard Overview
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* SETTINGS */}
        <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 transition">
          ⚙️
        </button>

        {/* PROFILE */}
        <div
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 
          flex items-center justify-center font-bold cursor-pointer"
        >
          A
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-12 w-44 
            bg-[#111827] border border-white/10 
            rounded-xl shadow-xl overflow-hidden">

            <button className="w-full px-4 py-2 text-left hover:bg-white/10">
              Profile
            </button>

            <button className="w-full px-4 py-2 text-left hover:bg-white/10">
              Settings
            </button>

            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10"
            >
              Logout
            </button>

          </div>
        )}

      </div>
    </div>
  );
}