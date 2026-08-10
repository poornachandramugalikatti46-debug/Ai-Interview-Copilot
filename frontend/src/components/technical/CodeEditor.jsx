import Editor from "@monaco-editor/react";
import { Play, Send, RotateCcw } from "lucide-react";

export default function CodeEditor({
  language = "JavaScript",
  value = "",
  defaultCode,
  onChange,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
}) {
  const starterCode = {
    JavaScript: `function twoSum(nums, target) {

    // Write your code here

}`,
    Python: `def two_sum(nums, target):

    # Write your code here

    pass`,
    Java: `class Solution {

    public int[] twoSum(int[] nums, int target) {

    }

}`,
    "C++": `class Solution {
public:

    vector<int> twoSum(vector<int>& nums, int target) {

    }

};`,
    C: `#include<stdio.h>

int main(){

    return 0;

}`,
  };

  const resetCode = () => {
    onReset?.(
      defaultCode || starterCode[language] || starterCode.JavaScript
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between bg-slate-800 px-5 py-3">
        <div>
          <h2 className="font-semibold">Monaco Code Editor</h2>
          <p className="text-xs text-slate-400">
            Language : {language}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetCode}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
          >
            <RotateCcw size={18} />
            Reset
          </button>

          <button
            onClick={() => onRun?.(value)}
            disabled={isRunning}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-60"
          >
            <Play size={18} />
            {isRunning ? "Running..." : "Run"}
          </button>

          <button
            onClick={() => onSubmit?.(value)}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-60"
          >
            <Send size={18} />
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <Editor
        height="500px"
        language={
          (function () {
            const languageMap = {
              JavaScript: "javascript",
              Python: "python",
              Java: "java",
              "C++": "cpp",
              C: "c",
            };
            return languageMap[language] || (language || "").toLowerCase() || "javascript";
          })()
        }
        theme="vs-dark"
        value={value}
            onChange={(newValue) => onChange?.(newValue || "")}
            beforeMount={(monaco) => {
              try {
                const m = monaco && monaco.default ? monaco.default : monaco;
                console.log("MONACO beforeMount:", m);
              } catch (e) {
                console.error("Error logging monaco beforeMount", e);
              }
            }}
            onMount={(editor, monaco) => {
              try {
                const m = monaco && monaco.default ? monaco.default : monaco;
                console.log("MONACO onMount - editor:", editor);
                console.log("MONACO onMount - monaco:", m);
              } catch (e) {
                console.error("Error logging onMount", e);
              }
            }}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
    </div>
  );
}