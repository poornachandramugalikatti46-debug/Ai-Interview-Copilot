const questions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    company: "Amazon",
    topic: "Array",

    description:
      "Given an array nums and target return indices.",

    example:
      "Input: [2,7,11,15], target = 9",

    constraints: [
      "2 <= nums.length <= 10^4",
    ],

    hints: [
      "Try brute force",
      "Use hashmap",
    ],

    starterCode: {
      javascript:
        "function twoSum(nums,target){\n\n}",

      python:
        "def twoSum(nums,target):\n    pass",
    },

    testcases: [
      {
        input: "[2,7,11,15],9",
        output: "[0,1]",
      },
    ],
  },
];

export default questions;