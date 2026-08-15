import React, { useEffect, useMemo, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

// Use the same Monaco instance everywhere
loader.config({ monaco });

const LANGUAGE_MAP = {
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
  C: "c",
  SQL: "sql",
};

const DEFAULT_CODE = {
  javascript: `// Write your JavaScript solution here

function solution() {
  // Your code
}
`,
  python: `# Write your Python solution here

def solution():
    # Your code
    pass
`,
  java: `// Write your Java solution here

class Solution {
    public static void main(String[] args) {
        // Your code
    }
}
`,
  cpp: `// Write your C++ solution here

#include <bits/stdc++.h>
using namespace std;

int main() {
    // Your code
    return 0;
}
`,
  c: `// Write your C solution here

#include <stdio.h>

int main() {
    // Your code
    return 0;
}
`,
  sql: `-- Write your SQL query here

SELECT *
FROM table_name;
`,
};

export default function CodeEditor({
  language = "JavaScript",
  value,
  onChange,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
  height = "500px",
  theme = "vs-dark",
  readOnly = false,
}) {
  const editorLanguage = useMemo(() => {
    return LANGUAGE_MAP[language] || "javascript";
  }, [language]);

  const initialValue = useMemo(() => {
    if (typeof value === "string") {
      return value;
    }

    return DEFAULT_CODE[editorLanguage] || "";
  }, [value, editorLanguage]);

  const [code, setCode] = useState(initialValue);

  useEffect(() => {
    setCode(initialValue);
  }, [initialValue]);

  const handleChange = (newValue) => {
    const nextValue = newValue ?? "";

    setCode(nextValue);

    if (onChange) {
      onChange(nextValue);
    }
  };

  const handleBeforeMount = (monacoInstance) => {
    console.log(
      "✅ Monaco beforeMount:",
      monacoInstance?.version || "loaded"
    );
  };

  const handleMount = (editor, monacoInstance) => {
    console.log("✅ Monaco Editor mounted");

    editor.focus();

    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd |
        monacoInstance.KeyCode.KeyS,
      () => {
        if (onChange) {
          onChange(editor.getValue());
        }
      }
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height,
        minHeight: "300px",
        overflow: "hidden",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          width="100%"
          language={editorLanguage}
          theme={theme}
          value={code}
          onChange={handleChange}
          beforeMount={handleBeforeMount}
          onMount={handleMount}
          options={{
            readOnly,
            automaticLayout: true,

            minimap: {
              enabled: false,
            },

            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            scrollBeyondLastLine: false,

            padding: {
              top: 12,
              bottom: 12,
            },

            tabSize: 2,
            insertSpaces: true,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
          }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRun}
          disabled={!onRun || isRunning}
          className="rounded-xl bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRunning ? "Running..." : "Run"}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!onSubmit || isSubmitting}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!onReset}
          className="rounded-xl bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
