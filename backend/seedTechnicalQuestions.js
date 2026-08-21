import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const problemNames = [
  "Reverse String", "Palindrome String", "Find Largest Element", "Second Largest Element",
  "Two Sum", "Remove Duplicates", "Move Zeroes", "Rotate Array", "Merge Sorted Arrays",
  "Find Missing Number", "Find Duplicate Number", "Maximum Subarray", "Best Time to Buy Stock",
  "Valid Anagram", "First Non-Repeating Character", "Valid Parentheses", "Longest Common Prefix",
  "Reverse Words", "Count Vowels", "Character Frequency", "Binary Search", "First Occurrence",
  "Search Insert Position", "Merge Intervals", "Sort Colors", "Intersection of Arrays",
  "Union of Arrays", "Product Except Self", "Subarray Sum", "Maximum Consecutive Ones",
  "Reverse Linked List", "Middle of Linked List", "Detect Linked List Cycle", "Merge Two Lists",
  "Remove Nth Node", "Min Stack", "Queue Using Stacks", "Next Greater Element",
  "Binary Tree Inorder", "Binary Tree Level Order", "Maximum Tree Depth", "Validate BST",
  "Number of Islands", "Flood Fill", "Climbing Stairs", "House Robber", "Coin Change",
  "Longest Increasing Subsequence", "Word Break", "LRU Cache",
];

const algorithms = [
  ["Strings", "string", '"hello"', '"olleh"', "function solve(input) { return input.split('').reverse().join(''); }"],
  ["Strings", "string", '"level"', "true", "function solve(input) { return input === input.split('').reverse().join(''); }"],
  ["Arrays", "number[]", "[3,8,2,9]", "9", "function solve(input) { return Math.max(...input); }"],
  ["Arrays", "number[]", "[4,1,7,3]", "4", "function solve(input) { return [...new Set(input)].sort((a,b)=>b-a)[1]; }"],
  ["Hash Map", "object", '{"numbers":[2,7,11,15],"target":9}', "[0,1]", "function solve(input) { const seen=new Map(); for(let i=0;i<input.numbers.length;i++){const need=input.target-input.numbers[i];if(seen.has(need))return [seen.get(need),i];seen.set(input.numbers[i],i);}return []; }"],
  ["Arrays", "number[]", "[1,2,2,3,1]", "[1,2,3]", "function solve(input) { return [...new Set(input)]; }"],
  ["Arrays", "number[]", "[0,1,0,3,12]", "[1,3,12,0,0]", "function solve(input) { const values=input.filter(Boolean); return values.concat(Array(input.length-values.length).fill(0)); }"],
  ["Arrays", "object", '{"numbers":[1,2,3,4,5],"steps":2}', "[4,5,1,2,3]", "function solve(input) { const k=input.steps%input.numbers.length; return input.numbers.slice(-k).concat(input.numbers.slice(0,-k)); }"],
  ["Arrays", "object", '{"left":[1,3,5],"right":[2,4,6]}', "[1,2,3,4,5,6]", "function solve(input) { return [...input.left,...input.right].sort((a,b)=>a-b); }"],
  ["Math", "number[]", "[3,0,1]", "2", "function solve(input) { const n=input.length; return n*(n+1)/2-input.reduce((sum,value)=>sum+value,0); }"],
  ["Dynamic Programming", "number[]", "[-2,1,-3,4,-1,2,1,-5,4]", "6", "function solve(input) { let current=input[0],best=input[0]; for(const value of input.slice(1)){current=Math.max(value,current+value);best=Math.max(best,current);} return best; }"],
  ["Strings", "string", '"interview"', "4", "function solve(input) { return [...input.toLowerCase()].filter(char=>'aeiou'.includes(char)).length; }"],
  ["Searching", "object", '{"numbers":[1,3,5,7,9],"target":7}', "3", "function solve(input) { let left=0,right=input.numbers.length-1; while(left<=right){const middle=Math.floor((left+right)/2);if(input.numbers[middle]===input.target)return middle;if(input.numbers[middle]<input.target)left=middle+1;else right=middle-1;}return -1; }"],
  ["Arrays", "number[]", "[1,2,3,4]", "[24,12,8,6]", "function solve(input) { const result=Array(input.length).fill(1);let prefix=1;for(let i=0;i<input.length;i++){result[i]=prefix;prefix*=input[i];}let suffix=1;for(let i=input.length-1;i>=0;i--){result[i]*=suffix;suffix*=input[i];}return result; }"],
];

const roles = ["Frontend", "Backend", "Full Stack", "Python", "Java", "C++"];
const difficulties = ["Easy", "Medium", "Hard"];

const buildQuestion = (role, title, index) => {
  const [topic, parameter, input, output, solution] = algorithms[index % algorithms.length];
  const difficulty = difficulties[index % difficulties.length];
  return {
    title: `${role} ${title}`,
    slug: `${role}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    role, topic, difficulty, language: ["JavaScript"],
    description: `Implement ${title}. The function receives ${parameter} input and must return the required result without printing it.`,
    examples: [{ input, output, explanation: `Solve the ${title} problem for the provided input.` }],
    constraints: ["Return a deterministic result.", "Handle valid edge-case input."],
    hint: `Consider a ${topic.toLowerCase()} approach.`,
    starterCode: { javascript: "function solve(input) {\n  // Write your code here\n}" },
    solution: { javascript: solution },
    testCases: [
      { input, expectedOutput: output, output, isHidden: false, points: 50 },
      { input, expectedOutput: output, output, isHidden: true, points: 50 },
    ],
    execution: { functionName: "solve", parameters: [{ name: "input", type: "object" }], returnType: "default" },
    timeComplexity: "O(n)", spaceComplexity: "O(n)", marks: 100, estimatedTime: 20,
    companies: ["Google", "Amazon", "Microsoft"], tags: [topic, "Coding Problem"], isActive: true,
  };
};

const technicalQuestions = roles.flatMap((role) =>
  problemNames.map((title, index) => buildQuestion(role, title, index))
);

const seed = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MongoDB connection string is not configured.");
  await mongoose.connect(mongoUri);
  try {
    for (const question of technicalQuestions) {
      await Question.findOneAndUpdate(
        { $or: [{ slug: question.slug }, { title: question.title }] },
        { $set: question },
        { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`Generated and seeded ${technicalQuestions.length} coding questions.`);
    console.log(`Total questions in database: ${await Question.countDocuments()}`);
  } finally {
    await mongoose.disconnect();
  }
};

seed().catch((error) => {
  console.error("Technical question seed failed:", error);
  process.exitCode = 1;
});
