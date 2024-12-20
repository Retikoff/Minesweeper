const N = 20
let mines = 70
let flags = 0
const BOMB = -1
const BOMB_SYMBOL = '&#128163;'
const FLAG_SYMBOL = '&#128681;'
const EMPTY = ''
let field = [['']]
let userField = [['']]
let flagsField = [['']]
flagsField = Array.from({ length: N }, (el, i) =>
  Array.from({ length: N }, () => EMPTY)
)
let isGameEnded = false
document.querySelector('#start').addEventListener('click', startGame)

function startGame() {
  flags = mines
  isGameEnded = false
  setFlags()
  createField()
  createUserField()
  createStructure(setCellNum)
}

function createStructure(func) {
  const userFieldDiv = document.querySelector('#field')
  userFieldDiv.innerHTML = ''
  userField.forEach((row, i) => {
    const rowDiv = document.createElement('div')
    rowDiv.className = 'row'
    row.forEach((cell, j) => {
      const cellDiv = document.createElement('div')
      cellDiv.className = 'cell'
      cellDiv.dataset.i = i
      cellDiv.dataset.j = j
      rowDiv.appendChild(cellDiv)
      cellDiv.addEventListener('click', () => {
        if (isGameEnded) {
          return
        }
        func(i, j)
        if (!userField[i][j]) {
          cellDiv.innerHTML = ``
          cellDiv.setAttribute('style', 'background: white')
        } else if (userField[i][j] === BOMB_SYMBOL) {
          userField.forEach((row, i) => {
            row.forEach((cell, j) => {
              if (cell === BOMB_SYMBOL) {
                document.querySelector(
                  '[data-i="' + i + '"][data-j="' + j + '"]'
                ).innerHTML = `${userField[i][j]}`
              }
            })
          })
          document.querySelector('#flags').innerHTML = `Вы взорвались(`
          isGameEnded = true
        } else {
          cellDiv.innerHTML = `${userField[i][j]}`
        }
      })
      cellDiv.addEventListener('contextmenu', (event) => {
        event.preventDefault()
        if (!cellDiv.innerHTML) {
          cellDiv.innerHTML = FLAG_SYMBOL
          flagsField[i][j] = BOMB_SYMBOL
          flags--
          if (isWin()) {
            document.querySelector('#flags').innerHTML = `Вы победили`
            isGameEnded = true
          }
        } else {
          cellDiv.innerHTML = ''
          flagsField[i][j] = EMPTY
          flags++
        }
        if (!isGameEnded) {
          setFlags()
        }
      })
    })
    userFieldDiv.appendChild(rowDiv)
  })
}

function setFlags() {
  document.querySelector('#flags').innerHTML = `${flags} ${FLAG_SYMBOL}`
}

function createField() {
  field = Array.from({ length: N }, (el, i) =>
    Array.from({ length: N }, () => EMPTY)
  )
  let currentMines = mines

  while (currentMines) {
    let i = Math.floor(Math.random() * N)
    let j = Math.floor(Math.random() * N)

    const fieldCell = field[i][j]
    if (!fieldCell) {
      field[i][j] = BOMB

      currentMines--
    }
  }
}

function createUserField() {
  userField = field.slice(0)
  userField.forEach((row, i) => {
    row.forEach((el, j) => {
      if (el == BOMB) {
        userField[i][j] = BOMB_SYMBOL
      }
    })
  })
}

function setCellNum(i, j) {
  if (userField[i][j] !== BOMB_SYMBOL) {
    userField[i][j] = getBombsAround(i, j)
  }
}

function getBombsAround(row, column) {
  let count = 0
  let width = userField[0].length
  let height = userField.length

  ;[-1, 0, 1].forEach((rowOffset) => {
    ;[-1, 0, 1].forEach((columnOffset) => {
      const i = rowOffset + row
      const j = columnOffset + column

      if (i < 0 || i >= width) return
      if (j < 0 || j >= height) return

      const cell = userField[i][j]

      if (cell !== BOMB_SYMBOL) return

      count++
    })
  })

  return count
}

function isWin() {
  let result = true

  flagsField.forEach((rowFlags, i) => {
    const rowField = field[i]
    rowFlags.forEach((el, j) => {
      if (el !== rowField[j]) {
        result = false
      }
    })
  })

  return result
}
