function analyzeAnswer(answer, question) {
  let score = 5;

  const strengths = [];

  const improvements = [];

  const lower =
    answer.toLowerCase();

  /* =========================
     LENGTH CHECK
  ========================= */

  if (answer.length > 80) {
    score += 2;

    strengths.push(
      "Good detailed answer"
    );
  } else {
    improvements.push(
      "Try explaining in more detail"
    );
  }

  /* =========================
     KEYWORD MATCH
  ========================= */

  let matched = 0;

  question.keywords.forEach(
    (word) => {
      if (
        lower.includes(word)
      ) {
        matched++;
      }
    }
  );

  score += matched;

  /* =========================
     OWNERSHIP WORDS
  ========================= */

  if (
    lower.includes("i built") ||
    lower.includes("i developed")
  ) {
    score += 1;

    strengths.push(
      "Strong ownership language"
    );
  }

  /* =========================
     MAX SCORE
  ========================= */

  if (score > 10) score = 10;

  /* =========================
     HR VERDICT
  ========================= */

  let verdict = "";

  if (score >= 8) {
    verdict =
      "Strong fresher candidate";
  } else if (score >= 6) {
    verdict =
      "Average candidate";
  } else {
    verdict =
      "Needs communication improvement";
  }

  return {
    score,

    strengths,

    improvements,

    betterAnswer:
      question.goodAnswer,

    verdict,
  };
}

module.exports =
  analyzeAnswer;