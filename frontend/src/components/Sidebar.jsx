export default function Sidebar() {
  return (
    <div className="w-64 bg-[#0f172a] border-r border-white/10 flex flex-col">

      {/* LOGO */}
      <div className="p-4 text-lg font-bold border-b border-white/10">
        AI Admin
      </div>

      {/* MENU */}
      <div className="flex-1 p-3 space-y-2">

        {[
          "Dashboard",
          "Chat Logs",
          "AI Interviews",
          "Users",
          "Analytics",
          "Settings"
        ].map((item) => (
          <div
            key={item}
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer transition"
          >
            {item}
          </div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-white/10 text-sm text-gray-400">
        v1.0 Admin Panel
      </div>

    </div>
  );
}