import React, { useState } from 'react'
import Board from './components/Board'
import Footer from './components/Footer'
import './Game.css'

/**
 * Función auxiliar que verifica si hay un ganador en el tablero
 * @param {Array} squares - Array con los valores de las 9 celdas
 * @returns {Object} - Objeto con el ganador (null, 'X', 'O') y la línea ganadora
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // Fila superior
    [3, 4, 5], // Fila media
    [6, 7, 8], // Fila inferior
    [0, 3, 6], // Columna izquierda
    [1, 4, 7], // Columna central
    [2, 5, 8], // Columna derecha
    [0, 4, 8], // Diagonal principal
    [2, 4, 6], // Diagonal inversa
  ]

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }

  return { winner: null, line: null }
}

/**
 * Componente Game: componente principal que maneja la lógica del juego
 * Incluye historial de jugadas y modo contra computadora
 */
function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [gameMode, setGameMode] = useState('pvp') // 'pvp' o 'computer'
  const [stepNumber, setStepNumber] = useState(0)

  const { winner, line } = calculateWinner(squares)
  const isDraw = !winner && squares.every(square => square !== null)

  /**
   * Maneja el clic en una celda
   * @param {number} i - Índice de la celda
   */
  function handleClick(i) {
    if (squares[i] || winner || isDraw) return
    // En modo computadora, no se puede jugar mientras es el turno de la computadora
    if (gameMode === 'computer' && !xIsNext) return

    const newSquares = squares.slice()
    newSquares[i] = xIsNext ? 'X' : 'O'
    const newHistory = [...history.slice(0, stepNumber + 1), newSquares]

    setSquares(newSquares)
    setXIsNext(!xIsNext)
    setHistory(newHistory)
    setStepNumber(stepNumber + 1)

    // Modo contra computadora
    if (gameMode === 'computer' && !calculateWinner(newSquares).winner && newSquares.every(s => s !== null) === false) {
      setTimeout(() => makeComputerMove(newSquares, newHistory), 500)
    }
  }

/**
 * Realiza el movimiento de la computadora
 * @param {Array} currentSquares - Estado actual del tablero
 * @param {Array} currentHistory - Historial actualizado (incluye la jugada del jugador)
 */
function makeComputerMove(currentSquares, currentHistory) {
  const emptySquares = currentSquares
    .map((sq, idx) => sq === null ? idx : null)
    .filter(idx => idx !== null)

  if (emptySquares.length === 0) return

  const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]
  const newSquares = currentSquares.slice()
  newSquares[randomIndex] = 'O'

    setSquares(newSquares)
    setXIsNext(true)
    setHistory([...currentHistory, newSquares])
    setStepNumber(currentHistory.length)
  }

/**
 * Reinicia el juego
 */
function resetGame() {
  setSquares(Array(9).fill(null))
  setXIsNext(true)
  setHistory([Array(9).fill(null)])
  setStepNumber(0)
}

/**
 * Navega a una jugada específica del historial
 * @param {number} step - Número de movimiento
 */
function jumpTo(step) {
  setSquares(history[step])
  setStepNumber(step)
  setXIsNext(step % 2 === 0)

  // Si en modo computadora se vuelve a un turno de 'O', juega la computadora
  const stepSquares = history[step]
  if (gameMode === 'computer' && step % 2 === 1 && !calculateWinner(stepSquares).winner) {
    setTimeout(() => makeComputerMove(stepSquares, history.slice(0, step + 1)), 500)
  }
}

/**
 * Devuelve el texto de estado del juego
 */
function getStatus() {
  if (winner) return `¡Ganador: ${winner}!`
  if (isDraw) return '¡Empate!'
  return `Turno de: ${xIsNext ? 'X' : 'O'}`
}

  return (
    <div className="game">
      <h1 className="game-title">Triki</h1>
      <div className="game-mode">
        <button
          className={`mode-btn ${gameMode === 'pvp' ? 'active' : ''}`}
          onClick={() => { setGameMode('pvp'); resetGame() }}
        >
          2 Jugadores
        </button>
        <button
          className={`mode-btn ${gameMode === 'computer' ? 'active' : ''}`}
          onClick={() => { setGameMode('computer'); resetGame() }}
        >
          vs Computadora
        </button>
      </div>

      <div className="game-info">
        <div className={`status ${winner ? 'winner' : ''} ${isDraw ? 'draw' : ''}`}>
          {getStatus()}
        </div>
      </div>

      <Board
        squares={squares}
        winningLine={line}
        onSquareClick={handleClick}
      />

      <button className="reset-btn" onClick={resetGame}>
        Reiniciar Juego
      </button>

      {history.length > 1 && (
        <div className="history">
          <h3>Historial de Jugadas</h3>
          <div className="history-list">
            {history.map((_, step) => (
              <button
                key={step}
                className={`history-btn ${step === stepNumber ? 'current' : ''}`}
                onClick={() => jumpTo(step)}
              >
                {step === 0 ? 'Inicio' : `Movimiento ${step}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Game
