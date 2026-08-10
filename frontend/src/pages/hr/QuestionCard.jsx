import React from "react";

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  question,
  category,
  difficulty,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-700">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-white">
            HR Interview Question
          </h2>

          <p className="text-gray-400">
            Question {questionNumber} of {totalQuestions}
          </p>
        </div>

        <div className="flex gap-2">

          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            {category}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-sm text-white
            ${
              difficulty === "Easy"
                ? "bg-green-600"
                : difficulty === "Medium"
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
          >
            {difficulty}
          </span>

        </div>

      </div>

      {/* Question */}

      <div className="bg-slate-800 rounded-xl p-6">

        <p className="text-2xl leading-10 text-white font-medium">
          {question}
        </p>

      </div>

    </div>
  );
};

export default QuestionCard;