export default function RightPanel() {
  return (
    <div className="space-y-4">

      {/* STATUS CARD */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="font-bold">System Status</h3>
        <p className="text-green-400 text-sm mt-1">● AI Online</p>
      </div>

      {/* ACTIVITY */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="font-bold mb-2">Live Activity</h3>

        <div className="text-xs text-gray-300 space-y-2">
          <p>✔ User asked React interview</p>
          <p>✔ AI responded in 1.2s</p>
          <p>✔ Mock test completed</p>
        </div>
      </div>

      {/* STATS */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="font-bold mb-2">Quick Stats</h3>

        <p className="text-sm">Users: 1,245</p>
        <p className="text-sm">Chats: 8,932</p>
        <p className="text-sm">Accuracy: 92%</p>
      </div>

    </div>
  );
}