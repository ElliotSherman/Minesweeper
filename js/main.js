'use strict'
// constants
const BOMB = '💣'
const FLAG = '🚩'
const SMILE = '😀'
const LOSE = '🤯'
const WIN = '😎'
const HEART = '💜'
// glabal variables
var gIsGameOver
var gBoard
const gLevel = {
    size: 4, mines: 2
}
var gFirstClickedCell
var gMinesOnBoard
var gFlagsOnBoardCount
var gGame
var gTimeId
var gTime
var gLivesLeft
//elements
var elBoard
var resetBtn = document.querySelector('.reset-btn')
var elTime = document.querySelector('.timer')
var elMinesOnBoard = document.querySelector('.mines-on-board')
var elLivesLeft = document.querySelector('.lives')

initGame()

function initGame() {
    gIsGameOver = false
    gLivesLeft = 3
    updateLivesLeft(gLivesLeft)
    gBoard = buildBoard(gLevel)
    gFirstClickedCell = null
    elBoard = document.querySelector('.board')
    renderBoard(gBoard, '.board')
    gFlagsOnBoardCount = 0
    gMinesOnBoard = +gLevel.mines
    resetBtn.innerText = SMILE
    elMinesOnBoard.innerText = gLevel.mines
    gTime = 0
    elTime.innerText = gTime
    resetTimer()
}

function updateLivesLeft(gLivesLeft) {
    var strLives = 'Lives: '
    for (var i = 0; i < gLivesLeft; i++) {
        strLives += HEART
    }
    elLivesLeft.innerText = strLives
}

elBoard.addEventListener("contextmenu", (event) => {

    event.preventDefault()
    if (gIsGameOver) return
    var elCell = event.target

    cellMarked(elCell)
})

function setMinesNeighborsCount(cellI, cellJ, board) {
    var neighborsCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function expandShown(board, elCell) {
    // get coords
    var cellI = elCell.dataset.i
    var cellJ = elCell.dataset.j
    // go through all neigbors and run cellClicked recursivley if the neigbor is not a mine
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            var elCell = document.querySelector(`[data-i = '${i}'][data-j = '${j}']`)
            if (!board[i][j].isMine && board[i][j].minesAroundCount <= 3) cellClicked(elCell)
        }
    }
}

function replaceMineLocation(location, board) {
    var coordI = location.i
    var coordJ = location.j
    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (i === coordI && j === coordJ) continue
            if (j < 0 || j >= board[i].length) continue
            var tempCell = gBoard[coordI][coordJ]
            if (!board[i][j].isMine) {
                gBoard[coordI][coordJ] = board[i][j]
                board[i][j] = tempCell
            }
        }
    }
}

function checkGameOver(isOnMine) {
    if (!isOnMine) {

        var flaggedMinesCount = 0
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
                    flaggedMinesCount++
                }
            }
        }
        if (flaggedMinesCount === gMinesOnBoard && gMinesOnBoard === gFlagsOnBoardCount) {
            gIsGameOver = true
            resetBtn.innerText = WIN
        }
    } else {
        gLivesLeft--
        updateLivesLeft(gLivesLeft)
        var elLivesLeft = document.querySelector('.lives')
        var strLives = ''
        for (var i = 0; i < gLivesLeft; i++) {
            strLives += HEART
        }
        elLivesLeft.innerText = strLives
        // var mines = []
        if (gLivesLeft === 0) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    if (gBoard[i][j].isMine) {
                        gBoard[i][j].isShown = true
                        var elCell = document.querySelector(`[data-i = '${i}'][data-j = '${j}']`)
                        elCell.classList.add('mine')
                        elCell.innerText = BOMB
                    }
                }
            }
            gIsGameOver = true
            resetBtn.innerText = LOSE
        }
    }
    if (gIsGameOver) {
        resetTimer()
    }
}
