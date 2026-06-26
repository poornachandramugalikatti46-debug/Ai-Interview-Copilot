const personas = {
  google: {
    interviewer: "Sarah Chen",
    role: "Senior Google Recruiter",

    style: "calm",

    rounds: [
      {
        type: "intro",
        questions: [
          "Tell me about yourself.",
        ],
      },

      {
        type: "behavioral",
        questions: [
          "Tell me about a difficult challenge you solved.",
          "Describe a failure and what you learned.",
        ],
      },

      {
        type: "leadership",
        questions: [
          "Tell me about a time you led a team.",
        ],
      },

      {
        type: "pressure",
        questions: [
          "Why should Google hire you over others?",
        ],
      },
    ],
  },

  amazon: {
    interviewer: "David Miller",
    role: "Amazon Leadership Recruiter",

    style: "leadership",

    rounds: [
      {
        type: "ownership",
        questions: [
          "Tell me about a time you took ownership.",
        ],
      },

      {
        type: "customer",
        questions: [
          "Describe a customer-focused decision.",
        ],
      },

      {
        type: "conflict",
        questions: [
          "Tell me about a disagreement with a teammate.",
        ],
      },
    ],
  },

  meta: {
    interviewer: "Alex Carter",
    role: "Meta Hiring Manager",

    style: "pressure",

    rounds: [
      {
        type: "pressure",
        questions: [
          "Why should Meta hire you?",
          "What makes you different?",
        ],
      },

      {
        type: "execution",
        questions: [
          "Tell me about a fast-moving project.",
        ],
      },
    ],
  },
};

module.exports = personas;