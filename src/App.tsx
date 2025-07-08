import React, { useState } from "react";

const initialBoard = Array(9).fill(null);
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: string[]) {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
}

function minimax(newBoard: string[], player: string): [number, number] {
  const huPlayer = "X";
  const aiPlayer = "O";
  const availSpots = newBoard.map((v, i) => (v === null ? i : null)).filter(v => v !== null) as number[];
  const winner = checkWinner(newBoard);

  if (winner === huPlayer) return [-10, -1];
  else if (winner === aiPlayer) return [10, -1];
  else if (winner === "Draw") return [0, -1];

  const moves: [number, number][] = [];
  for (let i of availSpots) {
    newBoard[i] = player;
    const [score] = minimax(newBoard, player === aiPlayer ? huPlayer : aiPlayer);
    moves.push([score, i]);
    newBoard[i] = null;
  }

  if (player === aiPlayer) {
    let max = -Infinity, bestMove = -1;
    for (let [score, move] of moves) {
      if (score > max) [max, bestMove] = [score, move];
    }
    return [max, bestMove];
  } else {
    let min = Infinity, bestMove = -1;
    for (let [score, move] of moves) {
      if (score < min) [min, bestMove] = [score, move];
    }
    return [min, bestMove];
  }
}

const App: React.FC = () => {
  const [board, setBoard] = useState<string[]>([...initialBoard]);
  const [status, setStatus] = useState<string | null>(null);

  const handleClick = (index: number) => {
    if (board[index] || status) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    let result = checkWinner(newBoard);
    if (!result) {
      const [, aiMove] = minimax(newBoard, "O");
      newBoard[aiMove] = "O";
      result = checkWinner(newBoard);
    }
    setBoard(newBoard);
    setStatus(result);
  };

  const restart = () => {
    setBoard([...initialBoard]);
    setStatus(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe - vs AI</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 text-2xl font-bold bg-white border border-gray-400 hover:bg-gray-200">
            {cell}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xl">
        {status ? (status === "Draw" ? "It's a Draw!" : `${status} Wins!`) : null}
      </div>
      <button onClick={restart} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Restart</button>
    </div>
  );
};

export default App;