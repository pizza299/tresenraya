import React from 'react'

/**
 * Componente Board: dibuja el tablero de 3x3
 * @param {Array} squares - Valores de las 9 celdas
 * @param {Array|null} winningLine - Índices de la línea ganadora
 * @param {Function} onSquareClick - Función a ejecutar al hacer clic en una celda
 */
function Board({ squares, winningLine, onSquareClick }) {
  return (
    <div className="board">
      {squares.map((value, i) => (
        <button
          key={i}
          className={`cell ${value ? value.toLowerCase() : ''} ${winningLine && winningLine.includes(i) ? 'winning' : ''}`}
          onClick={() => onSquareClick(i)}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

export default Board
