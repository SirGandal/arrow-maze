import State from './State';
import Utils from './Utils';

class Solver {
    tiles: string[];
    startingTile: number[];
    rows: number;
    columns: number;

    constructor(tiles: string[], startingTile: number[], rows: number, columns: number) {
        this.tiles = tiles;
        this.startingTile = startingTile;
        this.rows = rows;
        this.columns = columns;
    }

    /**
     * This method applies a classic BFS.
     * It starts from the bottom of the maze and tries to apply BFS from each starting
     * tile that corresponds to the first element in the provided sequence.
     * @param maze The maze to escape from.
     * @returns The final state. Null otherwise.
     */
    escapeMaze(): number[] {
        let queue: State[] = [];
        let visitedStates: State[] = [];

        // tslint:disable-next-line:max-line-length
        const initialStateIndex = Utils.getIndex(this.startingTile[1], this.startingTile[0], this.columns);
        const initialState = new State(this.tiles[initialStateIndex], this.startingTile[1],this.startingTile[0], this.rows, this.columns);
        queue.push(initialState);

        while (!(queue.length === 0)) {
            let currentState: State = queue.shift() as State;
            let connectedStates: State[] = currentState.findNext(this.tiles);
            for (let connectedState of connectedStates) {
                connectedState.setParent(currentState);
                if (this.isFinalState(connectedState)) {
                    let path = this.findPath(connectedState);
                    return path;
                }

                // Avoid loops by checking the visited states
                let wasVisited = visitedStates.filter((state: State) => {
                    return state.row === connectedState.row &&
                            state.column === connectedState.column &&
                        state.parent.row === connectedState.parent.row &&
                        state.parent.column === connectedState.parent.column;
                }).length > 0;

                if (!wasVisited) {
                    visitedStates.push(connectedState);
                    queue.push(connectedState);
                }
            }
        }

        return [];
    }

    /**
     * Whether or not the state is final. (i.e. tile on first row)
     * @param state The state to check.
     * @returns True if the state is on the first row.
     */
    isFinalState(state: State) {
        return state.tile === 'h';
    }

    /**
     * Traverses the states from the final to the initial one to return the path.
     * @param finalState The state from which to gather path.
     * @returns A sequence of steps to escape the this.maze. The return sequence
     * of steps only contains the indexes of the tiles where we decided to change direction.
     */
    findPath(finalState: State) {
        let movesSequence : number[] = [];

        let previousGoingDirection: number[] = [];
        while (finalState !== undefined) {
            let index = Utils.getIndex(finalState.row, finalState.column, this.columns);
            
            // When the going direction is different from the one at the previous
            // state it means that we opted for choosing the direction on the tile.
            if(previousGoingDirection[0] != finalState.goingDirection[0] 
                || previousGoingDirection[1] != finalState.goingDirection[1]){
                movesSequence.push(index);
            }

            previousGoingDirection = finalState.goingDirection;
            finalState = finalState.parent;
        }

        // remove the first element as it is going to be the home
        movesSequence.splice(0, 1);
        return movesSequence.reverse();
    }
}

export default Solver;