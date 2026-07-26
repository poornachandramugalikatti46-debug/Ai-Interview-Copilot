/*
==========================================
TRIE SERVICE
Production Ready - Part 4.3.1
==========================================
*/

/*
==========================================
Trie Node
==========================================
*/

export class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

/*
==========================================
Trie
==========================================
*/

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /*
  ==========================
  Insert Word
  ==========================
  */

  insert(word) {
    let current = this.root;

    for (const ch of word) {
      if (!current.children.has(ch)) {
        current.children.set(ch, new TrieNode());
      }

      current = current.children.get(ch);
    }

    current.isEndOfWord = true;
  }

  /*
  ==========================
  Search Word
  ==========================
  */

  search(word) {
    let current = this.root;

    for (const ch of word) {
      if (!current.children.has(ch)) {
        return false;
      }

      current = current.children.get(ch);
    }

    return current.isEndOfWord;
  }

  /*
  ==========================
  Starts With Prefix
  ==========================
  */

  startsWith(prefix) {
    let current = this.root;

    for (const ch of prefix) {
      if (!current.children.has(ch)) {
        return false;
      }

      current = current.children.get(ch);
    }

    return true;
  }

  /*
  ==========================
  Delete Word
  ==========================
  */

  delete(word) {
    const remove = (node, depth) => {
      if (!node) return false;

      if (depth === word.length) {
        if (!node.isEndOfWord) return false;

        node.isEndOfWord = false;

        return node.children.size === 0;
      }

      const ch = word[depth];

      if (!node.children.has(ch)) {
        return false;
      }

      const shouldDeleteChild = remove(
        node.children.get(ch),
        depth + 1
      );

      if (shouldDeleteChild) {
        node.children.delete(ch);
      }

      return (
        node.children.size === 0 &&
        !node.isEndOfWord
      );
    };

    remove(this.root, 0);
  }

  /*
  ==========================
  Get All Words
  ==========================
  */

  getWords() {
    const result = [];

    const dfs = (node, word) => {
      if (node.isEndOfWord) {
        result.push(word);
      }

      for (const [ch, child] of node.children) {
        dfs(child, word + ch);
      }
    };

    dfs(this.root, "");

    return result;
  }

  /*
  ==========================
  Count Words
  ==========================
  */

  size() {
    return this.getWords().length;
  }

  /*
  ==========================
  Clear Trie
  ==========================
  */

  clear() {
    this.root = new TrieNode();
  }
}

/*
==========================================
Build Trie
==========================================
*/

export const buildTrie = (words = []) => {
  const trie = new Trie();

  for (const word of words) {
    trie.insert(word);
  }

  return trie;
};

/*
==========================================
Parse Trie

Input:

["cat","car","dog"]
==========================================
*/

export const parseTrie = (value) => {
  const words = JSON.parse(value);

  return buildTrie(words);
};