import React from "react";

const AnswerBox = ({
  answer,
  setAnswer,
  placeholder = "Type your answer here..."
}) => {

  const wordCount =
    answer.trim() === ""
      ? 0
      : answer.trim().split(/\s+/).length;

  const characterCount = answer.length;

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mt-6">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold text-white">
          Your Answer
        </h2>

        <button
          onClick={() => setAnswer("")}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm"
        >
          Clear
        </button>

      </div>

      <textarea
        rows={10}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 text-white rounded-xl p-4 outline-none resize-none border border-slate-700 focus:border-indigo-500"
      />

      <div className="flex justify-between mt-4 text-sm text-gray-400">

        <span>
          Words : {wordCount}
        </span>

        <span>
          Characters : {characterCount}
        </span>

      </div>

      <div className="mt-4">

        {wordCount < 40 ? (
          <p className="text-yellow-400 text-sm">
            Recommended: Write at least 40 words for a detailed answer.
          </p>
        ) : (
          <p className="text-green-400 text-sm">
            ✔ Good answer length.
          </p>
        )}

      </div>

    </div>
  );
};

export default AnswerBox;