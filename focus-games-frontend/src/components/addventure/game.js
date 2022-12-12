import Board from "./board.js";
import React from "react";
import "./game.css";
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
      gameOver: false,
      userWon: false,
      potentialMoves: [],
    };
  }

  render() {
    return (
      <div className={"game"}>
        <h2>Add-Venture</h2>
        {this.state.objective && (
          <h4>
            Reach {this.state.objective.sum} within{" "}
            {this.state.objective.maxMoves} moves. This is possible in{" "}
            {this.state.objective.minMoves} moves.
          </h4>
        )}
        <h4>
          Moves Taken: {this.state.numMoves.toString()}, Running Sum:{" "}
          {this.state.runningSum.toString()}
        </h4>
        {this.state.gameOver && !this.state.userWon && <h3>You Lost</h3>}
        {this.state.gameOver && this.state.userWon && <h3>You Won</h3>}
        <Board
          runningSum={this.state.runningSum}
          data={this.state.boardData}
          makeMove={
            this.state.gameOver
              ? () => console.log("No more moves allowed")
              : (x, y) => this.makeMove(x, y)
          }
          potentialMoves={this.state.potentialMoves}
          pathTaken={this.state.pathTaken}
        />
        <span
          className={"myButton"}
          onClick={() => {
            this.resetGame();
          }}
        >
          Reset
        </span>
        <span className={"myButton"} onClick={() => this.newGame()}>
          New Game
        </span>
        <br />
        <a href="/rules">View the Rules</a>
      </div>
    );
  }

  componentDidMount() {
    this.newGame();
  }

  checkVictory() {
    console.log("Check Victory:");
    console.log(`${this.state.objective.sum} == ${this.state.runningSum}`);
    if (
      this.state.objective.sum &&
      this.state.runningSum === this.state.objective.sum &&
      this.state.gameStarted
    ) {
      console.log("The game is over, the user won");
      let updatedState = { ...this.state, userWon: true, gameOver: true };
      this.setState(updatedState);
    }
  }

  checkGameOver() {
    console.log("Check Game Over:");
    console.log(`${this.state.objective.maxMoves} >= ${this.state.numMoves}`);
    if (
      (this.state.objective.maxMoves &&
        this.state.numMoves >= this.state.objective.maxMoves) ||
      (this.state.runningSum > this.state.objective.sum &&
        this.state.gameStarted)
    ) {
      console.log("The game is over, the user lost");
      console.log("The game is over, the user won");
      let updatedState = { ...this.state, userWon: false, gameOver: true };
      this.setState(updatedState);
    }
  }

  generatePotentialMoves() {
    let moveOptions = [];
    if (this.state.pathTaken.length > 0) {
      // Return everything next to current, except previous
      let currMove = this.state.pathTaken[this.state.pathTaken.length - 1];
      let currX = currMove[0];
      let currY = currMove[1];
      let lastX = null;
      let lastY = null;
      if (this.state.pathTaken.length > 1) {
        let lastMove = this.state.pathTaken[this.state.pathTaken.length - 2];
        lastX = lastMove[0];
        lastY = lastMove[1];
      }

      if (currX + 1 < this.state.boardData.length) {
        moveOptions.push([currX + 1, currY]);
      }
      if (currX - 1 >= 0) {
        moveOptions.push([currX - 1, currY]);
      }
      if (currY + 1 < this.state.boardData.length) {
        moveOptions.push([currX, currY + 1]);
      }
      if (currY - 1 >= 0) {
        moveOptions.push([currX, currY - 1]);
      }

      moveOptions = moveOptions.filter((val) => {
        return !(val[0] === lastX && val[1] === lastY);
      });
    } else {
      // Return all locations with value of 0
      for (let i = 0; i < this.state.boardData.length; i++) {
        for (let j = 0; j < this.state.boardData.length; j++) {
          if (this.state.boardData[i][j] === 0) {
            moveOptions.push([i, j]);
          }
        }
      }
    }
    let newState = { ...this.state, potentialMoves: moveOptions };
    this.setState(newState);
  }

  makeMove(x, y) {
    let newState = this.state;
    newState.gameStarted = true;
    newState.pathTaken.push([x, y]);
    newState.runningSum += newState.boardData[x][y];
    newState.numMoves += 1;
    this.setState(newState, () => {
      this.generatePotentialMoves();
      this.checkGameOver();
      this.checkVictory();
    });
  }

  resetGame() {
    // Use the same board, but reset all moves and related state
    //const newGameBoard = this.state.boardData;
    //const objective = generateTarget(newGameBoard, 6, 12);
    let newState = {
      boardData: this.state.boardData,
      pathTaken: [],
      numMoves: 0,
      runningSum: 0,
      gameStarted: false,
      objective: this.state.objective,
      gameOver: false,
      userWon: false,
      potentialMoves: [],
    };
    this.setState(newState, () => this.generatePotentialMoves());
  }

  newGame() {
    // Reset all state and generate a new game
    console.log("New game was indeed called!");
    const newGameBoard = generateNewGame(5);
    const objective = generateTarget(newGameBoard, 4, 12);
    let newState = {
      boardData: newGameBoard,
      pathTaken: [],
      numMoves: 0,
      runningSum: 0,
      gameStarted: false,
      objective: objective,
      gameOver: false,
      userWon: false,
      potentialMoves: [],
    };

    this.setState(newState, () => this.generatePotentialMoves());
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
  console.log(organizedArray);
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

  if (tile.value !== 0) {
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
