const gridHelper = `

class Grid {

    constructor(matrix){

        this.grid = matrix;

        this.rows = matrix.length;

        this.cols =
            matrix.length
            ? matrix[0].length
            : 0;
    }


    isValid(row,col){

        return (
            row >= 0 &&
            row < this.rows &&
            col >= 0 &&
            col < this.cols
        );

    }


    get(row,col){

        if(this.isValid(row,col)){
            return this.grid[row][col];
        }

        return null;

    }


    set(row,col,value){

        if(this.isValid(row,col)){
            this.grid[row][col] = value;
        }

    }

}



function buildGrid(input){

    return new Grid(input);

}



function serializeGrid(grid){

    if(grid instanceof Grid){

        return JSON.stringify(
            grid.grid
        );

    }


    return JSON.stringify(grid);

}



const directions = [

    [-1,0],

    [1,0],

    [0,-1],

    [0,1]

];

`;

export default gridHelper;