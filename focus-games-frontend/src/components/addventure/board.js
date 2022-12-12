import React from "react";
import Tile from "./tile.js";

const Board = (props) => {
  return (
    <div className={"board"}>
      {props.data &&
        props.data.map((row, i) => {
          return (
            <div key={`tile row ${i}`}>
              {row.map((val, j) => {
                return (
                  <Tile
                    i={i}
                    j={j}
                    isPotentialMove={
                      props.potentialMoves &&
                      arrayContainsPair(props.potentialMoves, [i, j])
                    }
                    previous={
                      props.pathTaken &&
                      props.pathTaken.length > 1 &&
                      props.pathTaken[props.pathTaken.length - 2][0] === i &&
                      props.pathTaken[props.pathTaken.length - 2][1] === j
                    }
                    active={
                      props.pathTaken &&
                      props.pathTaken.length > 0 &&
                      props.pathTaken[props.pathTaken.length - 1][0] === i &&
                      props.pathTaken[props.pathTaken.length - 1][1] === j
                    }
                    runningSum={props.runningSum}
                    key={`${i},${j},${props.data[i][j]}`}
                    number={props.data[i][j]}
                    makeMove={
                      props.potentialMoves &&
                      arrayContainsPair(props.potentialMoves, [i, j])
                        ? props.makeMove
                        : () => {
                            console.log("You cant click this");
                          }
                    }
                  />
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

const arrayContainsPair = (arr, p) => {
  for (let move of arr) {
    if (move[0] === p[0] && move[1] === p[1]) {
      return true;
    }
  }
  return false;
};

export default Board;
