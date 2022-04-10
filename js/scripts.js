const Player = (playerName, mark, initialTurn) => {
  let isPlayerTurn = initialTurn;
  const getName = () => playerName;
  const getMark = () => mark;
  const getPlayerTurn = () => isPlayerTurn;
  const initializePlayerTurn = (initialTurn) => {
    isPlayerTurn = initialTurn;
  }
  const updatePlayerTurn = () => {
    if (isPlayerTurn === true) {
      isPlayerTurn = false;
    } else {
      isPlayerTurn = true;
    }
  }

  return {getName, getMark, getPlayerTurn, updatePlayerTurn, initializePlayerTurn};
};

const GameBoard = (() => {
  let boardArray = [...Array(9).fill("")];
  const clearGameBoard = (gameBoard) => {
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild);
    }
  }
  const updateGameBoard = () => {
    const gameBoard = document.querySelector(".game-board");
    clearGameBoard(gameBoard);
    for (let i = 0; i < boardArray.length; i++) {
      const gameSquare = document.createElement("div");
      gameSquare.setAttribute("class", "game-square");
      gameSquare.dataset.square = `${i}`;
      gameSquare.textContent = boardArray[i];
      gameSquare.addEventListener("click", (e) => {
        squareIndex = e.target.dataset['square'];
        selectSquare(squareIndex);
      })
      gameBoard.append(gameSquare);
    }
  }
  const selectSquare = (squareIndex) => {
    if (boardArray[squareIndex] != "") return;
    boardArray[squareIndex] = GameState.getPlayerMark();
    updateGameBoard();
    if (GameState.checkForWin(Player1, boardArray)) {
      GameState.updateGameFinished(true);
      console.log(`${Player1.getName()} Wins!`);
      return;
    }
    if (GameState.checkForWin(Player2, boardArray)) {
      GameState.updateGameFinished(true);
      console.log(`${Player2.getName()} Wins!`);
      return;
    }
    if (GameState.checkForTie()) {
      GameState.updateGameFinished(true);
      console.log(`It is a Tie!`);
      return;
    }
    GameState.changePlayerTurn();
    GameState.updateTurnCount();
  }
  const clearBoardArray = () => {
    boardArray = [...Array(9).fill("")];
  }

  return {updateGameBoard, clearBoardArray};
})();

const GameState = (() => {
  let gameFinished = false;
  let turnCount = 1;
  const initializeGameBoard = () => {
    GameBoard.updateGameBoard();
  }
  const getPlayerMark = () => {
    if (Player1.getPlayerTurn()) {
      return Player1.getMark();
    } else {
      return Player2.getMark();
    }
  }
  const changePlayerTurn = () => {
    Player1.updatePlayerTurn();
    Player2.updatePlayerTurn();
  }
  const updateGameFinished = (isFinished) => {
    gameFinished = isFinished;
  }
  const updateTurnCount = () => {
    if (gameFinished === true) {
      turnCount = 1;
    } else {
      turnCount++;
    }
    console.log(turnCount);
  }
  const checkForWin = (player, boardArray) => {
    // Check Rows
    if (boardArray[0] === player.getMark() && boardArray[1] === player.getMark() && boardArray[2] === player.getMark()) return true;
    if (boardArray[3] === player.getMark() && boardArray[4] === player.getMark() && boardArray[5] === player.getMark()) return true;
    if (boardArray[6] === player.getMark() && boardArray[7] === player.getMark() && boardArray[8] === player.getMark()) return true;
    // Check Columns
    if (boardArray[0] === player.getMark() && boardArray[3] === player.getMark() && boardArray[6] === player.getMark()) return true;
    if (boardArray[1] === player.getMark() && boardArray[4] === player.getMark() && boardArray[7] === player.getMark()) return true;
    if (boardArray[2] === player.getMark() && boardArray[5] === player.getMark() && boardArray[8] === player.getMark()) return true;
    // Check Diagonals
    if (boardArray[0] === player.getMark() && boardArray[4] === player.getMark() && boardArray[8] === player.getMark()) return true;
    if (boardArray[6] === player.getMark() && boardArray[4] === player.getMark() && boardArray[2] === player.getMark()) return true;

    return false;
  }
  const checkForTie = () => {
    if (turnCount >= 9) {
      return true
    }
    return false;
  }

  return {initializeGameBoard, getPlayerMark, changePlayerTurn, updateGameFinished, updateTurnCount, checkForWin, checkForTie};
})();

const Player1 = Player("Player 1", "X", true);
const Player2 = Player("Player 2", "O", false);
GameState.initializeGameBoard();

const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", () => {
  GameState.updateGameFinished(true);
  GameState.updateTurnCount();
  Player1.initializePlayerTurn(true);
  Player2.initializePlayerTurn(false);
  GameBoard.clearBoardArray();
  GameState.initializeGameBoard();
  GameState.updateGameFinished(false);
})