export default function ProblemPanel({ problem }) {
  const normalizedProblem = {
    title: "Interview Question",
    difficulty: "Medium",
    category: "Technical",
    description: "No prompt available yet.",
    examples: [],
    constraints: ["Explain your approach clearly.", "Include at least one concrete example."],
    ...(typeof problem === "string"
      ? {
          title: problem,
          description: problem,
        }
      : problem || {}),
  };

  const description = normalizedProblem.description || normalizedProblem.question || "No prompt available yet.";

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 h-[82vh] overflow-y-auto">
      <h2 className="text-3xl font-bold">{normalizedProblem.title}</h2>

      <div className="flex gap-3 mt-4">
        <span className="px-3 py-1 rounded-full bg-green-600 text-sm">
          {normalizedProblem.difficulty}
        </span>

        <span className="px-3 py-1 rounded-full bg-blue-600 text-sm">
          {normalizedProblem.category}
        </span>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Description</h3>
        <p className="text-slate-300 whitespace-pre-line leading-7">{description}</p>
      </div>

      {normalizedProblem.examples?.length ? (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Examples</h3>

          {normalizedProblem.examples.map((example, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-4 mb-4">
              <p>
                <strong>Input:</strong>
              </p>

              <pre className="text-green-400 mt-2">{example.input}</pre>

              <p className="mt-3">
                <strong>Output:</strong>
              </p>

              <pre className="text-yellow-400 mt-2">{example.output}</pre>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Constraints</h3>
        <ul className="list-disc ml-6 space-y-2 text-slate-300">
          {normalizedProblem.constraints.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-slate-800 rounded-xl p-5">
        <h3 className="text-lg font-bold">Hint</h3>
        <p className="mt-3 text-slate-300">
          Structure your answer with a short summary, one implementation detail, and a concrete example.
        </p>
      </div>
    </div>
  );
}