import React from "react";

const ProgressBar = ({ currentQuestion, totalQuestions }) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2 text-sm text-gray-300">
        <span>
          Question {currentQuestion} / {totalQuestions}
        </span>

        <span>{Math.round(progress)}%</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;