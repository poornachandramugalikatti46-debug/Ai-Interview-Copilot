/*
=====================================================
Graph Helper Template
This code is embedded into the generated Judge0 source.
=====================================================
*/

const graphHelper = `
class Graph {

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

        this.adjacencyList.get(source).push({
            node: destination,
            weight
        });

        if (!this.directed) {

            this.adjacencyList.get(destination).push({
                node: source,
                weight
            });

        }

    }

    getNeighbors(vertex) {

        return this.adjacencyList.get(vertex) || [];

    }

}

/*
==================================
Build Graph
==================================
*/

function buildGraph(edges, directed = false, weighted = false){

    const graph = new Graph(directed);

    for(const edge of edges){

        if(weighted){

            graph.addEdge(
                edge[0],
                edge[1],
                edge[2]
            );

        }
        else{

            graph.addEdge(
                edge[0],
                edge[1]
            );

        }

    }

    return graph;

}

/*
==================================
Serialize Graph
==================================
*/

function serializeGraph(graph){

    const result = {};

    for(const [vertex, neighbors] of graph.adjacencyList){

        result[vertex] = neighbors;

    }

    return JSON.stringify(result);

}
`;

export default graphHelper;