/*
====================================================
TRIE HELPER TEMPLATE

This code will be injected into Judge0 wrapper.

Supports:
- Insert
- Search
- StartsWith
- Build Trie
- Serialize Trie
====================================================
*/


const trieHelper = `

class TrieNode {

    constructor(){

        this.children = {};

        this.isEnd = false;

    }

}



class Trie {


    constructor(){

        this.root = new TrieNode();

    }



    insert(word){

        let current = this.root;


        for(const ch of word){

            if(!current.children[ch]){

                current.children[ch] =
                    new TrieNode();

            }


            current =
                current.children[ch];

        }


        current.isEnd = true;

    }



    search(word){

        let current =
            this.root;


        for(const ch of word){


            if(!current.children[ch]){

                return false;

            }


            current =
                current.children[ch];

        }


        return current.isEnd;

    }



    startsWith(prefix){

        let current =
            this.root;


        for(const ch of prefix){


            if(!current.children[ch]){

                return false;

            }


            current =
                current.children[ch];

        }


        return true;

    }

}




function buildTrie(words){


    const trie =
        new Trie();



    for(const word of words){


        trie.insert(word);

    }


    return trie;

}





function serializeTrie(trie){


    function dfs(node){


        const obj = {

            end: node.isEnd,

            children:{}

        };



        for(const key in node.children){


            obj.children[key] =
                dfs(node.children[key]);


        }


        return obj;

    }



    return JSON.stringify(
        dfs(trie.root)
    );

}




function buildTrieFromObject(data){


    function dfs(obj){


        const node =
            new TrieNode();



        node.isEnd =
            obj.end;



        for(const key in obj.children){


            node.children[key] =
                dfs(obj.children[key]);


        }


        return node;

    }



    const trie =
        new Trie();



    trie.root =
        dfs(data);



    return trie;

}



`;

export default trieHelper;