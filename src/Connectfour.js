import React, { useState } from "react";
import './Connectfour.css';

const ConnectFour = () => {
  const rows = 6; // Number of rows
  const columns = 7; // Number of columns
  const initialBoard = Array.from({ length: rows }, () => Array(columns).fill(null));

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("Red");
  const [winner, setWinner] = useState(null);
  const [redScore, setRedScore] = useState(0);
  const [yellowScore, setYellowScore] = useState(0);

  const handleColumnClick = (colIndex) => {
    if (winner) return; // Ignore clicks if there's already a winner

    for (let rowIndex = rows - 1; rowIndex >= 0; rowIndex--) {
      if (!board[rowIndex][colIndex]) { // Find the first empty row in the selected column
        const newBoard = board.map((row) => row.slice());
        newBoard[rowIndex][colIndex] = currentPlayer; // Place the current player's disc
        setBoard(newBoard);
        checkForWinner(newBoard, rowIndex, colIndex);
        
        // Check for a draw after placing the disc
        if (!winner && isBoardFull(newBoard)) {
          setWinner("Draw");
        } else {
          setCurrentPlayer(currentPlayer === "Red" ? "Yellow" : "Red");
        }
        return;
      }
    }
  };

  const checkForWinner = (board, row, col) => {
    const directions = [
      { row: 0, col: 1 },   // Horizontal
      { row: 1, col: 0 },   // Vertical
      { row: 1, col: 1 },   // Diagonal /
      { row: 1, col: -1 }    // Diagonal \
    ];

    for (const { row: dRow, col: dCol } of directions) {
      let count = 1; // Count the current piece

      // Check in one direction
      count += countDiscs(board, row, col, dRow, dCol);

      // Check in the opposite direction
      count += countDiscs(board, row, col, -dRow, -dCol);

      if (count >= 4) {
        setWinner(currentPlayer);
        updateScore(currentPlayer);
        return;
      }
    }
  };

  const countDiscs = (board, row, col, dRow, dCol) => {
    let count = 0;

    let r = row + dRow;
    let c = col + dCol;

    while (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currentPlayer) {
      count++;
      r += dRow;
      c += dCol;
    }

    return count;
  };

  const updateScore = (player) => {
    if (player === "Red") {
      setRedScore(redScore + 1);
    } else {
      setYellowScore(yellowScore + 1);
    }
  };

  const isBoardFull = (board) => {
    return board.every(row => row.every(cell => cell !== null));
  };

  const handleRestart = () => {
    setBoard(initialBoard);
    setCurrentPlayer("Red");
    setWinner(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Connect Four</h1>
      <div>
        <h2>Scoreboard</h2>
        <p>Red: {redScore}</p>
        <p>Yellow: {yellowScore}</p>
      </div>
      <h2>Current Player: {currentPlayer}</h2>
      {winner && <h2>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>}
      <div className="game-board" style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 50px)`, gap: "5px" }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleColumnClick(colIndex)}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: cell ? (cell === "Red" ? "red" : "yellow") : "lightgray",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* Removed text rendering for the cell */}
            </div>
          ))
        )}
      </div>
      <button onClick={handleRestart} style={{ marginTop: "20px" }}>Restart Game</button>
    </div>
  );
};

export default ConnectFour;
