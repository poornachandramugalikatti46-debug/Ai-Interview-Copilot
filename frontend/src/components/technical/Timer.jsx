import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function Timer({ duration = 30, onTimeUp }) {
  // duration is in minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  let color = "text-green-400";

  if (timeLeft <= 600) {
    color = "text-yellow-400";
  }

  if (timeLeft <= 300) {
    color = "text-red-500";
  }

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3">

      <Clock className={color} size={24} />

      <div>
        <p className="text-xs text-slate-400">
          Interview Timer
        </p>

        <h2 className={`text-2xl font-bold ${color}`}>
          {formattedTime}
        </h2>
      </div>

    </div>
  );
}