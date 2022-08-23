import React, { Component } from "react";
import { render } from "react-dom";
import { Board } from "./board";
import "./style.css";

interface AppState {
  value?: number,
  history?: {
    squares: string[],
    position?: { colNumber: number; rowNumber: Number },
  }[];
  xIsNext: boolean,
  stepNumber: number,
  movesReversed?: boolean,
}

class Game extends Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      movesReversed: false
    };
  }
  calculateWinner(squares: string[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        let winningSquares: [number, number, number] = [a, b, c]
        return {winner: squares[a], winningSquares };
      }
    }
    return null;
  }
  calculatePosistion(squareIndex: number) {
    const cols = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    let colNumber: number;
    cols.forEach((col, i) => {
      const [a, b, c] = col;
      if (squareIndex === a || squareIndex === b || squareIndex === c) {
        colNumber = i + 1;
      }
    });
    let rowNumber: number;
    rows.forEach((row, i) => {
      const [a, b, c] = row;
      if (squareIndex === a || squareIndex === b || squareIndex === c) {
        rowNumber = i + 1;
      }
    });
    return { colNumber, rowNumber };
  }

  handleClick = (i: number) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const position = this.calculatePosistion(i);
    this.setState({
      history: history.concat([
        { squares, position }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  };

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  renderMoves(moves: JSX.Element[], reversed: boolean){ 
    return reversed ?  moves.reverse() : moves
  }



  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = () => this.calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to start";
      const colNumber = step.position?.colNumber
      const rowNumber = step.position?.rowNumber
      return (
        <li key={move}>
          <button className={this.state.stepNumber === move ? 'bold': ''} onClick={() => this.jumpTo(move)}>{desc}</button>
          { (colNumber ? colNumber + ', ': '')  +( rowNumber ? rowNumber : '') }
        </li>
      );
    });

    let status: {};
    let result = winner()
    let lastMove = this.state.stepNumber === 9
    if (result) {
      status = "Winner is: " + result.winner;
    } else if (lastMove && !result?.winner) {
      status = "It's a draw"
    }else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
    
      <div className="game">
        <div className="game-board">
          <Board onClick={this.handleClick} squares={current.squares} winningSquares={result?.winningSquares} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ movesReversed: !this.state.movesReversed})}>Reverse moves</button>
          <ol>{this.renderMoves(moves, this.state.movesReversed)}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

render(<Game />, document.getElementById("root"));
