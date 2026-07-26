import { useState } from "react";

export default function TestCases({ evaluation, improvedAnswer, statusMessage }) {
  const [customInput, setCustomInput] = useState("");

  const score = evaluation?.score ?? 0;
  const status = score >= 7 ? "Accepted" : score >= 4 ? "Needs Work" : "Needs Improvement";
  const executionTime = `${(Math.max(0.01, score / 10) + 0.01).toFixed(3)} sec`;
  const memory = `${(15 + score * 0.5).toFixed(1)} MB`;
  const consoleOutput = evaluation?.feedback || improvedAnswer || statusMessage || "Run your solution to receive feedback.";

  const testCases = [
    {
      input: "Example 1",
      output: evaluation?.feedback ? "Feedback generated" : "Awaiting evaluation",
    },
    {
      input: "Example 2",
      output: improvedAnswer ? "Improved answer ready" : "Awaiting improvement",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <h2 className="text-xl font-bold text-white mb-5">Feedback & Results</h2>

      <div className="space-y-4">
        {testCases.map((test, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-4">
            <h3 className="font-semibold text-blue-400">Result {index + 1}</h3>
            <p className="text-slate-300 mt-2">
              <strong>Input:</strong>
            </p>
            <pre className="text-green-400 whitespace-pre-wrap">{test.input}</pre>
            <p className="text-slate-300 mt-3">
              <strong>Output:</strong>
            </p>
            <pre className="text-yellow-400">{test.output}</pre>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block font-semibold mb-2">Custom Input</label>
        <textarea
          rows={4}
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Enter custom input..."
          className="w-full bg-slate-800 rounded-xl p-4 outline-none resize-none"
        />
      </div>

      <div className="mt-6 bg-slate-800 rounded-xl p-5">
        <h3 className="text-lg font-bold mb-4">Output</h3>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-sm text-slate-400">Status</p>
            <p className="text-green-400 font-bold">{status}</p>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-sm text-slate-400">Time</p>
            <p className="font-bold">{executionTime}</p>
          </div>

          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-sm text-slate-400">Memory</p>
            <p className="font-bold">{memory}</p>
          </div>
        </div>

        <div className="bg-black rounded-lg p-4">
          <p className="text-slate-400 mb-2">Console Output</p>
          <pre className="text-green-400 whitespace-pre-wrap">{consoleOutput}</pre>
        </div>
      </div>
    </div>
  );
}