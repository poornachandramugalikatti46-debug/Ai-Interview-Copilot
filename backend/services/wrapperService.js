/*
==================================================
WRAPPER SERVICE
Supports JavaScript wrapper generation for interview code execution.
==================================================
*/
import {
  buildLinkedList,
  linkedListToArray,
} from "./parserServices.js";

import treeHelper from "./templates/javascript/treeHelper.js";
import graphHelper from "./templates/javascript/graphHelper.js";
import gridHelper from "./templates/javascript/gridHelper.js";
import trieHelper from "./templates/javascript/trieHelper.js";

const buildArgumentCode = (parameters = []) => {
  return parameters
    .map((param, index) => {
      switch (param.type) {
        case "number":
          return `const ${param.name} = Number(input[${index}]);`;
        case "string":
          return `const ${param.name} = input[${index}];`;
        case "boolean":
          return `const ${param.name} = input[${index}] === "true";`;
        case "number[]":
        case "string[]":
        case "boolean[]":
        case "number[][]":
        case "string[][]":
        case "object":
          return `const ${param.name} = JSON.parse(input[${index}]);`;
        case "linkedlist":
          return `const ${param.name} = buildLinkedList(JSON.parse(input[${index}]));`;
        case "tree":
          return `const ${param.name} = buildBinaryTree(JSON.parse(input[${index}]));`;
        case "graph":
          return `const ${param.name} = buildGraph(JSON.parse(input[${index}]), false, false);`;
        case "directedgraph":
          return `const ${param.name} = buildGraph(JSON.parse(input[${index}]), true, false);`;
        case "weightedgraph":
          return `const ${param.name} = buildGraph(JSON.parse(input[${index}]), false, true);`;
        case "directedweightedgraph":
          return `const ${param.name} = buildGraph(JSON.parse(input[${index}]), true, true);`;
        case "grid":
          return `const ${param.name} = buildGrid(JSON.parse(input[${index}]));`;
        case "trie":
          return `const ${param.name} = buildTrie(JSON.parse(input[${index}]));`;
        default:
          throw new Error(`Unsupported parameter type: ${param.type}`);
      }
    })
    .join("\n");
};

const buildReturnCode = (returnType) => {
  switch (returnType) {
    case "linkedlist":
      return `
console.log(JSON.stringify(linkedListToArray(answer)));
`;
    case "graph":
      return `
console.log(serializeGraph(answer));
`;
    case "grid":
      return `
console.log(serializeGrid(answer));
`;
    case "trie":
      return `
console.log(serializeTrie(answer));
`;
    default:
      return `
if (Array.isArray(answer)) {
  console.log(JSON.stringify(answer));
} else if (typeof answer === "object" && answer !== null) {
  console.log(JSON.stringify(answer));
} else {
  console.log(answer);
}
`;
  }
};

export const buildJavaScriptWrapper = ({
  userCode,
  functionName,
  parameters = [],
  returnType,
}) => {
  const parserCode = buildArgumentCode(parameters);
  const argumentList = parameters.map((p) => p.name).join(", ");

  return `
const fs = require("fs");

${treeHelper}
${graphHelper}
${gridHelper}
${trieHelper}

const rawInput = fs.readFileSync(0, "utf8").trim();
const input = rawInput.length ? rawInput.split("\\n") : [];

${parserCode}

${userCode}

const answer = ${functionName}(${argumentList});

${buildReturnCode(returnType)}
`;
};

export const buildWrapper = ({
  language,
  userCode,
  functionName,
  parameters,
  returnType,
}) => {
  switch (language) {
    case "JavaScript":
      return buildJavaScriptWrapper({
        userCode,
        functionName,
        parameters,
        returnType,
      });
    default:
      throw new Error(`Language ${language} not supported yet`);
  }
};