import hrQuestions from "../data/hrQuestions.json" with { type: "json" };

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/**
 * Normalize difficulty
 */
function normalizeDifficulty(level) {
  if (!level) return "Medium";

  const map = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  return map[level.toLowerCase()] || "Medium";
}

/**
 * Role Categories Mapping
 */
const ROLE_CATEGORIES = {
  "Frontend Developer": [
    "Introduction",
    "Projects",
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Behavioral",
  ],

  "Backend Developer": [
    "Projects",
    "Problem Solving",
    "Leadership",
    "Behavioral",
    "Communication",
  ],

  "Full Stack Developer": [
    "Projects",
    "Behavioral",
    "Leadership",
    "Problem Solving",
    "Teamwork",
    "Communication",
  ],

  "Data Analyst": [
    "Problem Solving",
    "Behavioral",
    "Projects",
    "Communication",
  ],

  "UI/UX Designer": [
    "Projects",
    "Communication",
    "Innovation",
    "Behavioral",
  ],

  "Software Engineer": [
    "Projects",
    "Leadership",
    "Behavioral",
    "Problem Solving",
    "Communication",
  ],
};

/**
 * Experience Categories
 */
function getExperienceCategories(experience) {
  switch (experience) {
    case "Fresher":
      return [
        "Freshers",
        "Campus Placement",
        "Internship",
        "Learning Mindset",
      ];

    case "1-3 Years":
      return [
        "Projects",
        "Behavioral",
        "Problem Solving",
        "Career Growth",
      ];

    case "3-5 Years":
      return [
        "Leadership",
        "Managerial",
        "Case Study",
        "Decision Making",
      ];

    default:
      return [
        "Leadership",
        "Executive HR",
        "Case Study",
      ];
  }
}

/**
 * Generate Interview Questions
 */
export function generateQuestions({
  role,
  difficulty,
  experience,
  totalQuestions = 10,
}) {
  difficulty = normalizeDifficulty(difficulty);

  let pool = [...hrQuestions];

  // Difficulty Filter
  pool = pool.filter((q) => q.difficulty === difficulty);

  // Role Filter
  const roleCategories =
    ROLE_CATEGORIES[role] || [];

  if (roleCategories.length) {
    pool = pool.filter((q) =>
      roleCategories.includes(q.category)
    );
  }

  // Experience Filter
  const expCategories =
    getExperienceCategories(experience);

  pool = [
    ...pool,
    ...hrQuestions.filter((q) =>
      expCategories.includes(q.category)
    ),
  ];

  // Remove duplicate IDs
  const unique = [];

  const ids = new Set();

  for (const q of pool) {
    if (!ids.has(q.id)) {
      ids.add(q.id);

      unique.push(q);
    }
  }

  // Shuffle
  const shuffled = shuffle(unique);

  return shuffled.slice(0, totalQuestions);
}

/**
 * Random Questions
 */
export function getRandomQuestions(count = 10) {
  return shuffle(hrQuestions).slice(0, count);
}

/**
 * By Category
 */
export function getQuestionsByCategory(category) {
  return hrQuestions.filter(
    (q) =>
      q.category.toLowerCase() ===
      category.toLowerCase()
  );
}

/**
 * By Difficulty
 */
export function getQuestionsByDifficulty(level) {
  level = normalizeDifficulty(level);

  return hrQuestions.filter(
    (q) => q.difficulty === level
  );
}

/**
 * Single Question
 */
export function getQuestionById(id) {
  return hrQuestions.find(
    (q) => q.id === Number(id)
  );
}

/**
 * Categories List
 */
export function getAllCategories() {
  return [
    ...new Set(hrQuestions.map((q) => q.category)),
  ].sort();
}

/**
 * Statistics
 */
export function getQuestionStats() {
  const stats = {
    total: hrQuestions.length,
    easy: 0,
    medium: 0,
    hard: 0,
    categories: {},
  };

  hrQuestions.forEach((q) => {
    if (q.difficulty === "Easy") stats.easy++;
    if (q.difficulty === "Medium") stats.medium++;
    if (q.difficulty === "Hard") stats.hard++;

    stats.categories[q.category] =
      (stats.categories[q.category] || 0) + 1;
  });

  return stats;
}