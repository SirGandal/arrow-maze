import Utils from './Utils';

class State {
    tile: string;
    row: number;
    column: number;
    rows: number;
    columns: number;
    parent: State;
    goingDirection: number[];

    constructor(tile: string,
                row: number,
                column: number,
                rows: number,
                columns: number,
                goingDirection: number[] = []) {
        this.tile = tile;
        this.row = row;
        this.column = column;
        this.rows = rows;
        this.columns = columns;
        
        // The direction we are going is the one specified by the tile
        // unless otherwise specified.
        this.goingDirection = goingDirection.length === 0 ? this.getDirectionFromValue(this.tile) : goingDirection;
    }

    /**
     * Sets the parent of this node. (i.e. how we arrived to the current state).
     * @param parent The parent of the current state.
     */
    setParent(parent: State) {
        this.parent = parent;
    }

    /**
     * Checks if we can move to the next state. Specifically if the the next index
     *is on the board and of a color that is the next on the sequence.
     * Using row and columns indexes here as it is easier to deal with.
     * @param row The current row.
     * @param column The current column.
     * @returns Whether or not the supplied position (row, col) is valid or not.
     */
    checkNext(row: number, column: number) {
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
    }

    /**
     * Finds the next possible tiles to move onto based on the current direction
     * or the new direction identified by the tile.
     * @param maze The tiles contained in the maze.
     * @returns All the possible next states.
     */
    findNext(maze: string[]): State[] {
        let currentDirection = this.goingDirection;
        let newDirection = this.getDirectionFromValue(this.tile);
        
        let directions = [newDirection];

        // For the starting tile the currentDirection will be empty
        // as we haven't started traversing the maze yet. Also if the
        // new direction is in line with the one we were already using
        // there is no point in exploring that way twice.
        if(currentDirection.length > 0 
            && (currentDirection[0] !== newDirection[0]
            || currentDirection[1] !== newDirection[1])) {
            directions.push(currentDirection);
        }

        let nextStates: State[] = [];

        // The 'directions' object will always contain up to two directions.
        // If it contains two directions, the second one will always be the
        // original direction we were using. The following flag is used to
        // to keep track of this fact and correctly store the direction in the state.
        let isCurrentDirection = false;

        for (let direction of directions) {
            let tmpRow = this.row + direction[0];
            let tmpCol = this.column + direction[1];

            if (this.checkNext(tmpRow, tmpCol)) {
                let nextStateIndex = Utils.getIndex(tmpRow, tmpCol, this.columns);
                let nextState: State = new State(maze[nextStateIndex], tmpRow, tmpCol, this.rows, this.columns);
                
                // We want to explore a new direction only when we have both the possibility
                // of continuing in a given direction or choosing a new one.
                if(!isCurrentDirection && directions.length > 1) {
                    // This is where we explore the direction identified by the tile.
                    nextState.goingDirection = this.getDirectionFromValue(this.tile);
                } else {
                    // This is where we keep exploring the previous direction.
                    nextState.goingDirection = direction;
                }

                nextStates.push(nextState);

                // console.log(`(${this.row},${this.column})-${Utils.getIndex(this.row, this.column, this.columns)} -> (${tmpRow},${tmpCol})-${nextStateIndex}`);
            }

            isCurrentDirection = true;
        }

        return nextStates;
    }

    /**
     * Gets the direction from the value of the tile.
     * @param value The value stored in the tile (e.g. nw, se, ...)
     * @returns the direction in the form of a two dimensional array.
     * The first elements identifies the addition for the row, the 
     * second one the addition to the column in order to get the next state.
     */
    getDirectionFromValue(value: string){
        switch(value) {
            case 'e': return [0, 1];
            case 'se': return [1, 1];
            case 's': return [1, 0];
            case 'sw': return [1, -1];
            case 'w': return [0, -1];
            case 'nw': return [-1, -1];
            case 'n': return [-1, 0];
            case 'ne': return [-1, 1];
            default: return [];
        }
    }
}

export default State;