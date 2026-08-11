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
  return {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  }[String(level).toLowerCase()] || "Medium";
}

/**
 * Generate Interview Questions
 */
export function generateQuestions({ role, difficulty, experience, totalQuestions = 10 }) {
  const count = Math.max(1, Number(totalQuestions) || 10);
  const normalizedDifficulty = normalizeDifficulty(difficulty);

  const primaryPool = hrQuestions.filter((q) => q.difficulty === normalizedDifficulty);
  const fallbackPool = hrQuestions.filter((q) => q.difficulty !== normalizedDifficulty);

  return shuffle([...primaryPool, ...fallbackPool]).slice(0, Math.min(count, hrQuestions.length));
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
  return hrQuestions.filter((q) => q.category.toLowerCase() === category.toLowerCase());
}

/**
 * By Difficulty
 */
export function getQuestionsByDifficulty(level) {
  level = normalizeDifficulty(level);
  return hrQuestions.filter((q) => q.difficulty === level);
}

/**
 * Single Question
 */
export function getQuestionById(id) {
  return hrQuestions.find((q) => q.id === Number(id));
}

/**
 * Categories List
 */
export function getAllCategories() {
  return [...new Set(hrQuestions.map((q) => q.category))].sort();
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
    stats.categories[q.category] = (stats.categories[q.category] || 0) + 1;
  });

  return stats;
}
