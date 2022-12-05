import Board from "./board.js";
import React from "react";
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: [[0]],
      pathTaken: [],
      numMoves: 0,
      runningSum: 0,
      gameStarted: false,
      objective: null,
    };
  }

  render() {
    return (
      <div>
        <h2>Add-Venture</h2>
        {this.state.objective && <h4>Target: {this.state.objective.sum}</h4>}
        <h4>
          Moves Taken: {this.state.numMoves.toString()}, Running Sum:{" "}
          {this.state.runningSum.toString()}
        </h4>
        <Board data={this.state.boardData} />
        <h4>Rules</h4>
        <ul>
          <li>
            Navigate around the board by clicking on the selectable tiles. Your
            goal is to reach a sum that equals the target sum.{" "}
          </li>
          <li>
            Navigating to new tiles will add their value to the running sum.
            Backtracking will subtract the value from the sum.
          </li>
          <li>Every action costs one move.</li>
          <li>
            Your goal is to navigate around the board to the target sum in the
            least number of moves possible, as fast as possible.
          </li>
        </ul>
      </div>
    );
  }

  componentDidMount() {
    const newGameBoard = generateNewGame(5);
    const objective = generateTarget(newGameBoard, 5, 12);
    this.setState({
      ...this.state,
      boardData: newGameBoard,
      objective: objective,
    });
  }
}

const generateNewGame = (sideSize) => {
  var result = [];
  for (var i = 0; i < sideSize; i++) {
    var row = [];
    var zeroPosition = Math.floor(Math.random() * sideSize);
    for (var j = 0; j < sideSize; j++) {
      if (j === zeroPosition) {
        row.push(0);
      } else {
        row.push(Math.floor(Math.random() * 9 + 1));
      }
    }
    result.push(row);
  }
  return result;
};

const generateLogicalTileBoard = (boardData) => {
  var logicalBoard = [];
  for (let i = 0; i < boardData.length; i++) {
    let row = [];
    for (let j = 0; j < boardData.length; j++) {
      row.push(new LogicalTile(i, j, boardData[i][j]));
    }
    logicalBoard.push(row);
  }
  for (let i = 0; i < boardData.length; i++) {
    for (let j = 0; j < boardData.length; j++) {
      if (i + 1 < logicalBoard.length)
        logicalBoard[i][j].right = logicalBoard[i + 1][j];
      if (j - 1 >= 0) logicalBoard[i][j].up = logicalBoard[i][j - 1];
      if (i - 1 >= 0) logicalBoard[i][j].left = logicalBoard[i - 1][j];
      if (j - 1 < logicalBoard.length)
        logicalBoard[i][j].down = logicalBoard[i][j + 1];
    }
  }
  return logicalBoard;
};

const identifyStartingPoints = (boardData) => {
  var startingPoints = [];
  for (var i = 0; i < boardData.length; i++) {
    for (var j = 0; j < boardData.length; j++) {
      if (boardData[i][j].value === 0) {
        startingPoints.push(boardData[i][j]);
      }
    }
  }
  return startingPoints;
};

const generateTarget = (gameBoard, minMoves, maxMoves) => {
  var targets = [];
  const tileBoard = generateLogicalTileBoard(gameBoard);
  const startingPoints = identifyStartingPoints(tileBoard);
  for (const startingPoint of startingPoints) {
    //console.log(`Starting Point: (${startingPoint.x},${startingPoint.y})`);
    let options = hypotheticalMove(
      0,
      0,
      startingPoint,
      null,
      minMoves,
      maxMoves
    );
    //console.log("Number of Targets: " + options.length);
    targets = targets.concat(options);
  }
  //console.log(targets.length);

  targets.sort((a, b) => {
    return a.sum - b.sum;
  });

  const targetMap = new Map();
  for (var target of targets) {
    var existingEntry = targetMap.get(target.sum);
    if (existingEntry) {
      targetMap.set(target.sum, {
        sum: existingEntry.sum,
        minMoves:
          target.moves < existingEntry.minMoves
            ? target.moves
            : existingEntry.minMoves,
        maxMoves:
          target.moves > existingEntry.maxMoves
            ? target.moves
            : existingEntry.maxMoves,
        numSolutions: existingEntry.numSolutions + 1,
      });
    } else {
      targetMap.set(target.sum, {
        sum: target.sum,
        minMoves: target.moves,
        maxMoves: target.moves,
        numSolutions: 1,
      });
    }
  }

  var organizedArray = Array.from(targetMap.values());
  organizedArray = organizedArray.filter((entry) => {
    return entry.minMoves >= minMoves && entry.maxMoves <= maxMoves;
  });
  organizedArray.sort((a, b) => {
    return a.maxMoves - a.minMoves - (b.maxMoves - b.minMoves);
  });
  var objective =
    organizedArray[Math.floor(Math.random() * organizedArray.length)];
  console.log("Objective found to be " + JSON.stringify(objective));
  return objective;
};

const hypotheticalMove = (
  runningSum,
  numMoves,
  tile,
  prevTile,
  minMoves,
  maxMoves
) => {
  var moveOptions = [];
  var potentialTargets = [];
  numMoves += 1;

  runningSum += tile.value;

  if (tile.right && tile.right != prevTile) {
    moveOptions.push(tile.right);
  }
  if (tile.up && tile.up != prevTile) {
    moveOptions.push(tile.up);
  }
  if (tile.left && tile.left != prevTile) {
    moveOptions.push(tile.left);
  }
  if (tile.down && tile.down != prevTile) {
    moveOptions.push(tile.down);
  }
  if (numMoves >= minMoves && numMoves <= maxMoves) {
    potentialTargets.push({ sum: runningSum, moves: numMoves });
  }
  if (numMoves < maxMoves) {
    for (var move of moveOptions) {
      potentialTargets = potentialTargets.concat(
        hypotheticalMove(runningSum, numMoves, move, tile, minMoves, maxMoves)
      );
    }
  }
  return potentialTargets;
};

class LogicalTile {
  constructor(x, y, value) {
    this.right = null;
    this.up = null;
    this.left = null;
    this.down = null;
    this.value = value;
    this.x = x;
    this.y = y;
  }
}

export default Game;
