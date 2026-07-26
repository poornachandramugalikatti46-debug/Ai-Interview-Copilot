import axios from "axios";

const API = axios.create({
  baseURL: process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com",
  headers: {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
    "X-RapidAPI-Host": process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com",
  },
});

const LANGUAGE_MAP = {
  JavaScript: 63,
  Python: 71,
  Java: 62,
  "C++": 54,
  C: 50,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function executeSubmission(sourceCode, language, stdin = "") {
  const language_id = LANGUAGE_MAP[language];

  if (!language_id) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const create = await API.post(
    "/submissions?base64_encoded=false&wait=false",
    {
      language_id,
      source_code: sourceCode,
      stdin,
    }
  );

  const token = create.data.token;
  let result = null;

  for (let i = 0; i < 20; i++) {
    await sleep(1000);
    const res = await API.get(`/submissions/${token}?base64_encoded=false`);
    const statusId = res.data.status.id;

    if (statusId <= 2) {
      continue;
    }

    result = res.data;
    break;
  }

  if (!result) {
    throw new Error("Judge0 timeout");
  }

  return result;
}

export async function runAgainstTestCases(sourceCode, language, testCases) {
  let passed = 0;
  let runtime = 0;
  let memory = 0;
  let totalScore = 0;
  const results = [];

  for (const tc of testCases) {
    const execution = await executeSubmission(sourceCode, language, tc.input);
    const actual = (execution.stdout || "").trim();
    const expected = (tc.expectedOutput || "").trim();
    const success = actual === expected;

    if (success) {
      passed++;
      totalScore += tc.points;
    }

    runtime += Number(execution.time || 0);
    memory += Number(execution.memory || 0);

    results.push({
      input: tc.input,
      expectedOutput: expected,
      actualOutput: actual,
      passed: success,
      runtime: execution.time,
      memory: execution.memory,
      stdout: execution.stdout,
      stderr: execution.stderr,
      compile_output: execution.compile_output,
      status: execution.status.description,
    });
  }

  return {
    passed,
    total: testCases.length,
    score: totalScore,
    runtime: runtime / testCases.length,
    memory: Math.round(memory / testCases.length),
    results,
  };
}
