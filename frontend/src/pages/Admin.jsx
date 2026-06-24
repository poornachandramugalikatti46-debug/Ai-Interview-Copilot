import AdminLayout from "./AdminLayout";
import AdminChat from "../components/AdminChat";

export default function Admin() {
  return (
    <AdminLayout
      rightPanel={
        <div className="space-y-4 text-white">

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-bold mb-2">Stats</h3>
            <p className="text-sm text-gray-300">Users: 1,245</p>
            <p className="text-sm text-gray-300">AI Chats: 8,932</p>
            <p className="text-sm text-gray-300">Success: 92%</p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-bold mb-2">AI Activity</h3>
            <p className="text-xs text-gray-300">• Java interview asked</p>
            <p className="text-xs text-gray-300">• HR answers generated</p>
            <p className="text-xs text-gray-300">• Mock interview done</p>
          </div>

        </div>
      }
    >
      <AdminChat />
    </AdminLayout>
  );
}