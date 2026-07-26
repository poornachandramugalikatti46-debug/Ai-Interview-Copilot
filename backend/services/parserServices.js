/*
==========================================
PARSER SERVICE
Minimal parser helpers for the backend.
==========================================
*/

export const parseNumber = (value) => Number(value.trim());
export const parseString = (value) => value.trim();
export const parseBoolean = (value) => value.trim().toLowerCase() === "true";
export const parseNumberArray = (value) => JSON.parse(value);
export const parseStringArray = (value) => JSON.parse(value);
export const parseBooleanArray = (value) => JSON.parse(value);
export const parseNumberMatrix = (value) => JSON.parse(value);
export const parseStringMatrix = (value) => JSON.parse(value);
export const parseObject = (value) => JSON.parse(value);

export class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

export const buildLinkedList = (values) => {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }

  const dummy = new ListNode();
  let current = dummy;

  for (const value of values) {
    current.next = new ListNode(value);
    current = current.next;
  }

  return dummy.next;
};

export const linkedListToArray = (head) => {
  const result = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
};

export const parseLinkedList = (value) => buildLinkedList(JSON.parse(value));
export const serializeLinkedList = (head) => JSON.stringify(linkedListToArray(head));

export class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export const buildBinaryTree = (values) => {
  if (!values || values.length === 0) return null;
  const nodes = values.map((v) => (v === null ? null : new TreeNode(v)));
  let i = 0;

  for (let j = 1; j < nodes.length; j += 2) {
    if (nodes[i]) {
      nodes[i].left = nodes[j] || null;
      if (j + 1 < nodes.length) {
        nodes[i].right = nodes[j + 1] || null;
      }
    }
    i++;
    while (i < nodes.length && nodes[i] === null) {
      i++;
    }
  }

  return nodes[0];
};

export const binaryTreeToArray = (root) => {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    if (node === null) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }

  while (result.length && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
};

export const parseBinaryTree = (value) => buildBinaryTree(JSON.parse(value));
export const serializeBinaryTree = (root) => JSON.stringify(binaryTreeToArray(root));

export class Graph {
  constructor(directed = false) {
    this.directed = directed;
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(source, destination, weight = 1) {
    this.addVertex(source);
    this.addVertex(destination);
    this.adjacencyList.get(source).push({ node: destination, weight });
    if (!this.directed) {
      this.adjacencyList.get(destination).push({ node: source, weight });
    }
  }
}

export const buildGraph = (edges, directed = false, weighted = false) => {
  const graph = new Graph(directed);
  for (const edge of edges) {
    if (weighted) {
      graph.addEdge(edge[0], edge[1], edge[2]);
    } else {
      graph.addEdge(edge[0], edge[1]);
    }
  }
  return graph;
};

export const parseGraph = (value, directed = false) => buildGraph(JSON.parse(value), directed, false);
export const parseWeightedGraph = (value, directed = false) => buildGraph(JSON.parse(value), directed, true);
export const serializeGraph = (graph) => JSON.stringify(Object.fromEntries(graph.adjacencyList));

export class Grid {
  constructor(matrix = []) {
    this.grid = matrix;
    this.rows = matrix.length;
    this.cols = matrix.length > 0 ? matrix[0].length : 0;
  }

  isValid(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  get(row, col) {
    if (!this.isValid(row, col)) return null;
    return this.grid[row][col];
  }
}

export const parseGrid = (value) => new Grid(JSON.parse(value));
export const parseCharacterGrid = (value) => new Grid(JSON.parse(value));
export const serializeGrid = (grid) => JSON.stringify(grid instanceof Grid ? grid.grid : grid);

const parserMap = {
  number: parseNumber,
  string: parseString,
  boolean: parseBoolean,
  "number[]": parseNumberArray,
  "string[]": parseStringArray,
  "boolean[]": parseBooleanArray,
  "number[][]": parseNumberMatrix,
  "string[][]": parseStringMatrix,
  object: parseObject,
  linkedlist: parseLinkedList,
  tree: parseBinaryTree,
  graph: parseGraph,
  directedgraph: (value) => parseGraph(value, true),
  weightedgraph: parseWeightedGraph,
  directedweightedgraph: (value) => parseWeightedGraph(value, true),
  grid: parseGrid,
  chargrid: parseCharacterGrid,
};

export const parseParameter = (type, value) => {
  const parser = parserMap[type];
  if (!parser) {
    throw new Error(`Parser not found for type: ${type}`);
  }
  return parser(value);
};

export const parseArguments = (metadata, stdin) => {
  const lines = stdin.trim().split("\n").filter((line) => line !== "");
  if (lines.length !== metadata.length) {
    throw new Error(`Expected ${metadata.length} parameters but received ${lines.length}`);
  }
  return metadata.map((param, index) => parseParameter(param.type, lines[index]));
};

export const buildArgumentsObject = (metadata, parsedArguments) => {
  const obj = {};
  metadata.forEach((param, index) => {
    obj[param.name] = parsedArguments[index];
  });
  return obj;
};

export const parseInput = (metadata, stdin) => {
  const args = parseArguments(metadata, stdin);
  const params = buildArgumentsObject(metadata, args);
  return { args, params };
};