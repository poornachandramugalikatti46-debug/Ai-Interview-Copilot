import mongoose from "mongoose";
import dotenv from "dotenv";

import Question from "./models/Question.js";

dotenv.config();

const technicalQuestions = [
  {
    title: "Backend Maximum Subarray",
    slug: "backend-maximum-subarray",
    role: "Backend",
    topic: "Arrays",
    difficulty: "Medium",
    language: ["JavaScript"],
    description:
      "Given an integer array, find the contiguous subarray with the largest sum and return that sum.",
    examples: [
      {
        input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 100000",
      "-10000 <= nums[i] <= 10000",
    ],
    hint: "Track the best sum ending at the current position.",
    starterCode: {
      javascript:
        "function maxSubArray(nums) {\n  // Write your code here\n}",
    },
    solution: {
      javascript:
        "function maxSubArray(nums) {\n  let current = nums[0];\n  let best = nums[0];\n\n  for (let index = 1; index < nums.length; index += 1) {\n    current = Math.max(nums[index], current + nums[index]);\n    best = Math.max(best, current);\n  }\n\n  return best;\n}",
    },
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "[-1]",
        expectedOutput: "-1",
        isHidden: true,
      },
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    marks: 100,
    estimatedTime: 20,
    companies: ["Microsoft", "Google", "Amazon"],
    tags: ["Arrays", "Dynamic Programming"],
    isActive: true,
  },
  {
    title: "Backend Reverse Linked List",
    slug: "backend-reverse-linked-list",
    role: "Backend",
    topic: "Linked List",
    difficulty: "Medium",
    language: ["JavaScript"],
    description:
      "Given the head of a singly linked list, reverse the list and return the new head.",
    examples: [
      {
        input: "1 -> 2 -> 3 -> null",
        output: "3 -> 2 -> 1 -> null",
        explanation: "Reverse each next pointer while traversing the list.",
      },
    ],
    constraints: [
      "0 <= number of nodes <= 5000",
      "-5000 <= node value <= 5000",
    ],
    hint: "Keep references to the previous, current, and next nodes.",
    starterCode: {
      javascript:
        "function reverseList(head) {\n  // Write your code here\n}",
    },
    solution: {
      javascript:
        "function reverseList(head) {\n  let previous = null;\n  let current = head;\n\n  while (current) {\n    const next = current.next;\n    current.next = previous;\n    previous = current;\n    current = next;\n  }\n\n  return previous;\n}",
    },
    testCases: [
      {
        input: "[1,2,3,4,5]",
        expectedOutput: "[5,4,3,2,1]",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "[]",
        isHidden: true,
      },
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    marks: 100,
    estimatedTime: 20,
    companies: ["Microsoft", "Amazon"],
    tags: ["Linked List", "Pointers"],
    isActive: true,
  },
  {
    title: "Backend Binary Search",
    slug: "backend-binary-search",
    role: "Backend",
    topic: "Searching",
    difficulty: "Medium",
    language: ["JavaScript"],
    description:
      "Given a sorted array of distinct integers and a target value, return the target index or -1 when it is absent.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "The target 9 is located at index 4.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 100000",
      "All values in nums are distinct and sorted in ascending order.",
    ],
    hint: "Discard half of the remaining search range after each comparison.",
    starterCode: {
      javascript:
        "function search(nums, target) {\n  // Write your code here\n}",
    },
    solution: {
      javascript:
        "function search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n\n  while (left <= right) {\n    const middle = Math.floor((left + right) / 2);\n    if (nums[middle] === target) return middle;\n    if (nums[middle] < target) left = middle + 1;\n    else right = middle - 1;\n  }\n\n  return -1;\n}",
    },
    testCases: [
      {
        input: "[-1,0,3,5,9,12]\n9",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[-1,0,3,5,9,12]\n2",
        expectedOutput: "-1",
        isHidden: true,
      },
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    marks: 100,
    estimatedTime: 20,
    companies: ["Microsoft", "Google", "Amazon"],
    tags: ["Searching", "Binary Search"],
    isActive: true,
  },
  {
    title: "Frontend Reverse String",
    slug: "frontend-reverse-string",
    role: "Frontend",
    topic: "Strings",
    difficulty: "Easy",
    language: ["JavaScript"],
    description:
      "Given a string, return a new string with its characters in reverse order.",
    examples: [
      {
        input: "hello",
        output: "olleh",
        explanation: "The characters are returned from last to first.",
      },
    ],
    constraints: ["1 <= input.length <= 10000"],
    hint: "Use the string's characters in reverse order.",
    starterCode: {
      javascript:
        "function reverseString(input) {\n  // Write your code here\n}",
    },
    solution: {
      javascript:
        "function reverseString(input) {\n  return input.split(\"\").reverse().join(\"\");\n}",
    },
    testCases: [
      { input: "hello", expectedOutput: "olleh", isHidden: false },
      { input: "frontend", expectedOutput: "dnetnorf", isHidden: true },
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    marks: 100,
    estimatedTime: 10,
    companies: ["Microsoft", "Google"],
    tags: ["Strings", "JavaScript"],
    isActive: true,
  },
  {
    title: "Frontend Find Largest Number",
    slug: "frontend-find-largest-number",
    role: "Frontend",
    topic: "Arrays",
    difficulty: "Easy",
    language: ["JavaScript"],
    description:
      "Given an array of numbers, return the largest number in the array.",
    examples: [
      {
        input: "[3, 8, 2, 9, 4]",
        output: "9",
        explanation: "9 is greater than every other value in the array.",
      },
    ],
    constraints: ["1 <= numbers.length <= 10000"],
    hint: "Keep the largest value seen while traversing the array.",
    starterCode: {
      javascript:
        "function findLargest(numbers) {\n  // Write your code here\n}",
    },
    solution: {
      javascript:
        "function findLargest(numbers) {\n  return Math.max(...numbers);\n}",
    },
    testCases: [
      { input: "[3,8,2,9,4]", expectedOutput: "9", isHidden: false },
      { input: "[-5,-2,-9]", expectedOutput: "-2", isHidden: true },
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    marks: 100,
    estimatedTime: 10,
    companies: ["Microsoft", "Amazon"],
    tags: ["Arrays", "JavaScript"],
    isActive: true,
  },
  {
    title: "Frontend Count Vowels",
    slug: "frontend-count-vowels",
    role: "Frontend",
    topic: "Strings",
    difficulty: "Easy",
    language: ["JavaScript"],
    description:
      "Given a string, count and return the number of vowels it contains.",
    examples: [
      {
        input: "Interview",
        output: "4",
        explanation: "The vowels are I, e, i, and e.",
      },
    ],
    constraints: ["1 <= input.length <= 10000"],
    hint: "Check each character against the vowels a, e, i, o, and u.",
    starterCode: {
      javascript:
        "function countVowels(input) {\n  // Write your code here\n}",
    },
    solution: {
      javascript:
        "function countVowels(input) {\n  return [...input.toLowerCase()].filter((character) => \"aeiou\".includes(character)).length;\n}",
    },
    testCases: [
      { input: "Interview", expectedOutput: "4", isHidden: false },
      { input: "rhythm", expectedOutput: "0", isHidden: true },
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    marks: 100,
    estimatedTime: 10,
    companies: ["Microsoft", "Google", "Amazon"],
    tags: ["Strings", "JavaScript"],
    isActive: true,
  },
];

const seedTechnicalQuestions = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error("MongoDB connection string is not configured.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    for (const question of technicalQuestions) {
      await Question.findOneAndUpdate(
        { slug: question.slug },
        { $set: question },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    const total = await Question.countDocuments();
    const frontendEasyJavaScript = await Question.countDocuments({
      role: "Frontend",
      difficulty: "Easy",
      language: "JavaScript",
      isActive: true,
    });

    console.log(`Seeded or updated ${technicalQuestions.length} questions.`);
    console.log(`Total questions in database: ${total}`);
    console.log(
      `Frontend + Easy + JavaScript: ${frontendEasyJavaScript}`
    );
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedTechnicalQuestions().catch((error) => {
  console.error("Technical question seed failed:", error);
  process.exitCode = 1;
});
