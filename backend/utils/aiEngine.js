exports.analyzeAnswer = (
  answer
) => {
  let communication = 5;

  let confidence = 5;

  let clarity = 5;

  let professionalism = 5;

  const strengths = [];

  const improvements = [];

  /* =========================
     COMMUNICATION
  ========================= */

  if (answer.length > 80) {
    communication += 2;

    strengths.push(
      "Good detailed answer"
    );
  } else {
    improvements.push(
      "Explain in more detail"
    );
  }

  /* =========================
     CONFIDENCE
  ========================= */

  if (
    answer.includes("I built") ||
    answer.includes("I developed") ||
    answer.includes("I created")
  ) {
    confidence += 2;

    strengths.push(
      "Strong ownership"
    );
  } else {
    improvements.push(
      "Use ownership words"
    );
  }

  /* =========================
     PROFESSIONALISM
  ========================= */

  if (
    answer.includes("team") ||
    answer.includes("project")
  ) {
    professionalism += 2;

    strengths.push(
      "Used practical examples"
    );
  }

  /* =========================
     CLARITY
  ========================= */

  if (
    answer.includes("challenge")
  ) {
    clarity += 1;

    strengths.push(
      "Good problem explanation"
    );
  }

  if (communication > 10)
    communication = 10;

  const betterAnswer =
    "Use structured answers with confidence, practical examples, and clear communication.";

  const hrThinking =
    "HR checks communication, confidence, ownership, and practical understanding.";

  return {
    communication,

    confidence,

    clarity,

    professionalism,

    strengths,

    improvements,

    betterAnswer,

    hrThinking,
  };
};

/* =========================
   NEXT QUESTION ENGINE
========================= */

exports.generateQuestion = (
  answer
) => {
  const text =
    answer.toLowerCase();

  if (
    text.includes("project")
  ) {
    return "What challenge did you face in your project?";
  }

  if (
    text.includes("team")
  ) {
    return "How did you work with your team members?";
  }

  if (
    text.includes("react")
  ) {
    return "Why did you choose React.js?";
  }

  if (
    text.includes("ai")
  ) {
    return "How does your AI system work?";
  }

  const questions = [
    "Why should we hire you?",

    "Tell me about your strengths.",

    "How do you handle pressure?",

    "Describe a difficult situation you handled.",

    "Where do you see yourself in 3 years?",

    "What motivates you?",

    "Tell me about a failure and what you learned.",

    "How do you improve your skills?",

    "What are your career goals?",
  ];

  return questions[
    Math.floor(
      Math.random() *
        questions.length
    )
  ];
};