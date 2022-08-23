import React from "react";
import { Component } from "react";
interface SquareProps {
  value: string;
  onClick(): void;
  highlightSquare?: boolean
}

export function Square(props: SquareProps) {
  let classNames = 'square'
  props.highlightSquare && (classNames = classNames.concat(' highlight'))
  return (
    <button className={classNames} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
