import {
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Star,
} from "lucide-react";

export default function AIReview() {
  const review = {
    score: 92,
    codeQuality: "Excellent",
    logic: "Correct",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",

    strengths: [
      "Correct solution",
      "Good variable naming",
      "Readable code",
      "Efficient HashMap approach",
    ],

    improvements: [
      "Add comments for better readability.",
      "Handle edge cases explicitly.",
      "Improve function documentation.",
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            AI Code Review
          </h1>

          <p className="text-slate-400 mt-2">
            AI analyzed your submitted solution.
          </p>
        </div>

        {/* Overall Score */}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

          <h2 className="text-xl font-semibold mb-4">
            Overall Score
          </h2>

          <div className="flex items-center gap-6">

            <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">
              {review.score}
            </div>

            <div>

              <h3 className="text-2xl font-bold">
                {review.codeQuality}
              </h3>

              <p className="text-slate-400 mt-2">
                Your solution is efficient and follows good coding practices.
              </p>

            </div>

          </div>

        </div>

        {/* Metrics */}

        <div className="grid md:grid-cols-4 gap-5 mt-8">

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

            <Brain className="text-blue-400 mb-3" />

            <p className="text-slate-400">Logic</p>

            <h3 className="text-xl font-bold">
              {review.logic}
            </h3>

          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

            <Zap className="text-yellow-400 mb-3" />

            <p className="text-slate-400">
              Time Complexity
            </p>

            <h3 className="text-xl font-bold">
              {review.timeComplexity}
            </h3>

          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

            <Star className="text-purple-400 mb-3" />

            <p className="text-slate-400">
              Space Complexity
            </p>

            <h3 className="text-xl font-bold">
              {review.spaceComplexity}
            </h3>

          </div>

          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

            <CheckCircle className="text-green-400 mb-3" />

            <p className="text-slate-400">
              Code Quality
            </p>

            <h3 className="text-xl font-bold">
              {review.codeQuality}
            </h3>

          </div>

        </div>

        {/* Strengths */}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mt-8">

          <h2 className="text-2xl font-bold text-green-400 mb-5">
            Strengths
          </h2>

          <ul className="space-y-3">

            {review.strengths.map((item, index) => (

              <li key={index} className="flex gap-3">

                <CheckCircle
                  className="text-green-400 mt-1"
                  size={18}
                />

                <span>{item}</span>

              </li>

            ))}

          </ul>

        </div>

        {/* Improvements */}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mt-8">

          <h2 className="text-2xl font-bold text-yellow-400 mb-5">
            Improvements
          </h2>

          <ul className="space-y-3">

            {review.improvements.map((item, index) => (

              <li key={index} className="flex gap-3">

                <AlertTriangle
                  className="text-yellow-400 mt-1"
                  size={18}
                />

                <span>{item}</span>

              </li>

            ))}

          </ul>

        </div>

      </div>

    </div>
  );
}