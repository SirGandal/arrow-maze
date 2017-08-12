import * as React from 'react';
import Solver from './Solver';
import Utils from './Utils';

interface MazeProps {
  tiles: string[];
  rows: number;
  columns: number;
  startingTile: number[];
}

interface MazeState {
  escapePath: number[];
  message: string;
}

interface TileProps {
  value: string;
  index: number;
  path: number[];
  isStartingTile: boolean;
}

interface TileState {
  isParthOfPath: boolean;
  solved: boolean;
}

class Maze extends React.Component<MazeProps, MazeState> {

  constructor(props: MazeProps) {
    super(props);
    this.state = { escapePath: [], message: '' };
  }

  renderRow(from: number, to: number, initialTileColumn: number = -1) {
    let tiles: JSX.Element[] = [];
    for (let i = from; i < to; i++) {
      let tile: JSX.Element = this.renderTile(i, Utils.getCol(i, this.props.columns) === initialTileColumn);
      tiles.push(tile);
    }
    return tiles;
  }

  renderTile(i: number, isInitial: boolean = false) {
    return (
      <Tile
        key={i}
        value={this.props.tiles[i]}
        index={i}
        path={this.state.escapePath}
        isStartingTile={isInitial}
        />
    );
  }

  handleClickSolve() {
    let solve = new Solver(this.props.tiles, this.props.startingTile, this.props.rows, this.props.columns);
    let path = solve.escapeMaze();

    if (path.length > 0) {
      this.setState({
        escapePath: path,
        message: 'Yay, you can go home!'
      });
    } else {
      this.setState({
        escapePath: [],
        message: 'Nooooo! You can\'t go home :(.'
      });
    }
  }

  render() {
    let rows: JSX.Element[] = [];
    for (let i = 0; i < this.props.tiles.length; i = i + this.props.columns) {
      if (this.props.startingTile[1] === Utils.getRow(i, this.props.columns)) {
        
        // This row contains the initial tile at column startingTile[0]
        rows.push(<div className="maze-row" key={i}>{this.renderRow(i, i + this.props.columns, this.props.startingTile[0])}</div>);
      } else {
        rows.push(<div className="maze-row" key={i}>{this.renderRow(i, i + this.props.columns)}</div>);
      }
    }

    return (
      <div>
        <div className="maze">
          <div>
            {rows}
          </div>
        </div>
        <br />
        <button className="solve" onClick={() => this.handleClickSolve()}>
          SOLVE
        </button>
        <br />
        <p>{this.state.message}</p>
      </div>
    );
  }
}

class Tile extends React.Component<TileProps, TileState> {

  // When the tile props are changed is because the solved method has finished.
  // As a consequence we can access the path that was found to update the state.
  componentWillReceiveProps(nextProps: TileProps) {
    this.setState({
      isParthOfPath: nextProps.path.indexOf(this.props.index) !== -1,
      solved: true
    });
  }

  render() {
    let outerClassName = 'tile';
    let currentClassName = this.props.value !== 'h' ? `arrow arrow-${this.props.value}` : 'home';
    
    if(this.props.isStartingTile) {
      outerClassName = `${outerClassName} starting-tile`;
    } else if (this.state && this.state.solved) {
      if (this.state.isParthOfPath) {
        outerClassName = `${outerClassName} escape-tile`;
      }
    }

    return (
      <div className={outerClassName}>
        <div className={currentClassName}>
          {/* {this.props.index}  */}
        </div>
      </div>
    );
  }
}

export default Maze;