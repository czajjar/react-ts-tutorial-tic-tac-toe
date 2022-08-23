import React from "react";
import { Component } from "react";
import { Square } from "./square";
interface BoardProps {
  squares: string[];
  xIsNext?: boolean;
  onClick(i: number): void;
  winningSquares: [number, number, number];
}
export class Board extends Component<BoardProps> {
  renderSquare(i: number) {
    let highlightSquare = !!this.props.winningSquares?.includes(i)

    return (
      <Square key={i}
        onClick={() => this.props.onClick(i)}
        value={this.props.squares[i]}
        highlightSquare={highlightSquare}
      />
    );
  }

  renderRow(cnt: { i: number }) {
    let result: JSX.Element[] = [];

    for (let j = 0; j < 3; j++) {
      result.push(this.renderSquare(cnt.i));
      cnt.i++;
    }

    return result;
  }

  render() {
    let result: JSX.Element[] = [];
    let cnt = { i: 0 };
    for (let i = 0; i < 3; i++) {
      result.push(
        <div className="board-row" key={i}>
          {this.renderRow(cnt)}
        </div>
      );
    }
    return result;
  }
}
