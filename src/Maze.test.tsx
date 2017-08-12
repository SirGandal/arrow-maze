import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Maze from './Maze';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Maze tiles={[]} rows={0} columns={0} startingTile={[]}/>, div);
});
