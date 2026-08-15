import axios from "axios";

const JUDGE0_URL =
  process.env.JUDGE0_URL ||
  "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY =
  process.env.JUDGE0_KEY ||
  process.env.RAPIDAPI_KEY ||
  process.env.JUDGE0_API_KEY ||
  "";
const JUDGE0_HOST =
  process.env.JUDGE0_HOST ||
  process.env.JUDGE0_API_HOST ||
  "judge0-ce.p.rapidapi.com";

const INVALID_KEY_VALUES = new Set([
  "",
  "YOUR_API_KEY_HERE",
  "YOUR_RAPIDAPI_KEY",
  "null",
  "undefined",
]);

const IS_MOCK_MODE = !JUDGE0_KEY || INVALID_KEY_VALUES.has(JUDGE0_KEY.trim());

if (IS_MOCK_MODE) {
  console.log("⚠️  MOCK MODE: Judge0 API key not configured.");
  console.log("📝 Using mock code execution responses.");
  console.log("🔧 To use real Judge0 API:");
  console.log("   1. Get key from https://rapidapi.com/judge0-official/api/judge0-ce");
  console.log("   2. Update backend/.env: JUDGE0_KEY=your_actual_key");
  console.log("   3. Restart server");
} else {
  console.log("✅ Judge0 key loaded (REAL MODE)", {
    keySource: process.env.JUDGE0_KEY
      ? "JUDGE0_KEY"
      : process.env.RAPIDAPI_KEY
      ? "RAPIDAPI_KEY"
      : process.env.JUDGE0_API_KEY
      ? "JUDGE0_API_KEY"
      : "none",
  });
}

const LANGUAGE_MAP = {
  JavaScript: 63,
  Python: 71,
  Java: 62,
  "C++": 54,
  C: 50,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Create API only if we have a real key
const API = !IS_MOCK_MODE
  ? axios.create({
      baseURL: JUDGE0_URL,
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_KEY,
        "X-RapidAPI-Host": JUDGE0_HOST,
      },
    })
  : null;

// Mock execution for development
async function mockExecuteSubmission(sourceCode, language, stdin = "") {
  // Simulate execution time
  await sleep(500);

  // Mock successful output
  const mockOutputs = {
    JavaScript: `Hello World\n42`,
    Python: `Hello World\n42`,
    Java: `Hello World\n42`,
    "C++": `Hello World\n42`,
    C: `Hello World\n42`,
  };

  return {
    stdout: mockOutputs[language] || "Mock Output",
    stderr: "",
    compile_output: null,
    time: "0.5",
    memory: "1024",
    status: {
      id: 3,
      description: "Accepted",
    },
  };
}

// Real execution using Judge0 API
async function realExecuteSubmission(sourceCode, language, stdin = "") {
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

// Export appropriate version
export async function executeSubmission(sourceCode, language, stdin = "") {
  if (IS_MOCK_MODE) {
    return mockExecuteSubmission(sourceCode, language, stdin);
  }
  return realExecuteSubmission(sourceCode, language, stdin);
}

// Mock test cases execution
async function mockRunAgainstTestCases(sourceCode, language, testCases) {
  let passed = 0;
  let totalScore = 0;
  const results = [];

  for (const tc of testCases) {
    const success = Math.random() > 0.3; // Mock: 70% pass rate
    if (success) {
      passed++;
      totalScore += tc.points || 10;
    }

    results.push({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: success ? tc.expectedOutput : "Wrong output",
      passed: success,
      runtime: "0.5ms",
      memory: "1024KB",
      stdout: success ? tc.expectedOutput : "",
      stderr: success ? "" : "Output mismatch",
      compile_output: null,
      status: success ? "Accepted" : "Wrong Answer",
    });
  }

  return {
    passed,
    total: testCases.length,
    score: totalScore,
    runtime: 0.5,
    memory: 1024,
    results,
  };
}

// Real test cases execution
async function realRunAgainstTestCases(sourceCode, language, testCases) {
  let passed = 0;
  let runtime = 0;
  let memory = 0;
  let totalScore = 0;
  const results = [];

  for (const tc of testCases) {
    const execution = await realExecuteSubmission(sourceCode, language, tc.input);
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

// Export appropriate version
export async function runAgainstTestCases(sourceCode, language, testCases) {
  if (IS_MOCK_MODE) {
    return mockRunAgainstTestCases(sourceCode, language, testCases);
  }
  return realRunAgainstTestCases(sourceCode, language, testCases);
}
