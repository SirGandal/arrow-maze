import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Maze from './Maze';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

let mazeInputString =
'(2,0)\n' +
'e se se sw  s\n' +
's nw nw  n  w\n' +
'ne  s  h  e sw\n' +
'se  n  w ne sw\n' +
'ne nw nw  n  n\n';

const mazeStartingTile = mazeInputString
                  .split('\n')[0]
                  .replace('(','')
                  .replace(')','')
                  .split(',')
                  .map((stringStartingTileIndex) => parseInt(stringStartingTileIndex));

// remove first line containing the possible colors
let mazeRows = mazeInputString.split('\n');
mazeRows.splice(0, 1);

// remove last line if the input file contained a new line on the last line
if (mazeRows[mazeRows.length - 1] === '') {
  mazeRows.splice(mazeRows.length - 1, 1);
}

let maze: string[] = [];
for (let mazeRow of mazeRows) {
  while(mazeRow.indexOf('  ') !== -1) {
    // if the maze row contains double space let's reduce it to one
    mazeRow = mazeRow.replace('  ', ' ');
  }
  maze = maze.concat(mazeRow.split(' '));
}

const numberOfRows: number = mazeRows.length;
const numberOfColumns: number = maze.length / numberOfRows;
console.log(mazeStartingTile);
console.log(maze);
console.log(numberOfRows);
console.log(numberOfColumns);

ReactDOM.render(
  <Maze tiles={maze} rows={numberOfRows} columns={numberOfColumns} startingTile={mazeStartingTile}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
