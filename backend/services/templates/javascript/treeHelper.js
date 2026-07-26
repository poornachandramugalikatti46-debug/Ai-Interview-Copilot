const treeHelper = `
class TreeNode{
    constructor(val,left=null,right=null){
        this.val=val;
        this.left=left;
        this.right=right;
    }
}

function buildBinaryTree(values){

    if(!values || values.length===0)
        return null;

    const nodes = values.map(v =>
        v===null ? null : new TreeNode(v)
    );

    let i=0;

    for(let j=1;j<nodes.length;j+=2){

        if(nodes[i]){

            nodes[i].left = nodes[j] || null;

            if(j+1<nodes.length){

                nodes[i].right =
                    nodes[j+1] || null;

            }

        }

        i++;

        while(i<nodes.length && nodes[i]===null){

            i++;

        }

    }

    return nodes[0];

}

function binaryTreeToArray(root){

    if(!root) return [];

    const result=[];

    const queue=[root];

    while(queue.length){

        const node=queue.shift();

        if(node===null){

            result.push(null);

            continue;

        }

        result.push(node.val);

        queue.push(node.left);

        queue.push(node.right);

    }

    while(
        result.length &&
        result[result.length-1]===null
    ){
        result.pop();
    }

    return result;

}
`;

export default treeHelper;