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

function minimax(newBoard: string[], player: string, depth: number, maxDepth: number): [number, number] {
  const huPlayer = "X";
  const aiPlayer = "O";
  const availSpots = newBoard.map((v, i) => (v === null ? i : null)).filter(v => v !== null) as number[];
  const winner = checkWinner(newBoard);

  if (winner === huPlayer) return [-10 + depth, -1];
  else if (winner === aiPlayer) return [10 - depth, -1];
  else if (winner === "Draw" || depth === maxDepth) return [0, -1];

  const moves: [number, number][] = [];
  for (let i of availSpots) {
    newBoard[i] = player;
    const [score] = minimax(newBoard, player === aiPlayer ? huPlayer : aiPlayer, depth + 1, maxDepth);
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
  const [darkMode, setDarkMode] = useState(false);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [score, setScore] = useState({ X: 0, O: 0, Draw: 0 });

  const maxDepthMap = { Easy: 1, Medium: 3, Hard: 6 };

  const handleClick = (index: number) => {
    if (board[index] || status) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    let result = checkWinner(newBoard);
    if (!result) {
      const [, aiMove] = minimax(newBoard, "O", 0, maxDepthMap[difficulty]);
      newBoard[aiMove] = "O";
      result = checkWinner(newBoard);
    }
    setBoard(newBoard);
    setStatus(result);
    if (result && result !== null) {
      setScore(prev => ({ ...prev, [result]: prev[result as keyof typeof prev] + 1 }));
    }
  };

  const restart = () => {
    setBoard([...initialBoard]);
    setStatus(null);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex flex-col items-center justify-center min-h-screen p-4`}>
      <h1 className="text-3xl font-bold mb-2">Tic Tac Toe - vs AI</h1>
      <div className="mb-2">
        <label className="mr-2 font-semibold">Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
          className="px-2 py-1 rounded border"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 text-2xl font-bold bg-white text-black border border-gray-400 hover:bg-gray-200">
            {cell}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xl font-semibold">
        {status ? (status === "Draw" ? "It's a Draw!" : `${status} Wins!`) : null}
      </div>
      <div className="mt-2">
        <button onClick={restart} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Restart</button>
        <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <div className="mt-4 text-sm">
        <strong>Score:</strong> X - {score.X} | O - {score.O} | Draws - {score.Draw}
      </div>
    </div>
  );
};

export default App;