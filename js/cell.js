'use strict'

function cellClicked(elCell) {

    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if(!gFirstClickedCell){
        gFirstClickedCell = {i:elCellI , j:elCellJ}
        if(gBoard[gFirstClickedCell.i][gFirstClickedCell.j].isMine){
            replaceMineLocation(gFirstClickedCell , gBoard)
        }
    }
    if (gIsGameOver) return

    if (!gTimeId) {
        gTimeId = setInterval(() => {
            gTime++
            elTime.innerText = gTime
        }, 1000)
    }

    if (gBoard[elCellI][elCellJ].isShown === true || gBoard[elCellI][elCellJ].isMarked === true) return

    if (gBoard[elCellI][elCellJ].isMine === true) {
        gBoard[elCellI][elCellJ].isShown = true
        elCell.innerText = BOMB
        checkGameOver(gBoard[elCellI][elCellJ].isMine)
        return
    }

    if (gBoard[elCellI][elCellJ].minesAroundCount !== 0) {
        // model
        gBoard[elCellI][elCellJ].isShown = true
        // DOM
        elCell.classList.add(`checked`)
        elCell.classList.add(`color-${gBoard[elCellI][elCellJ].minesAroundCount}`)
        elCell.innerText = gBoard[elCellI][elCellJ].minesAroundCount
        return
    }
    if (gBoard[elCellI][elCellJ].minesAroundCount === 0) {
        gBoard[elCellI][elCellJ].isShown = true
        elCell.classList.add('checked')
        elCell.innerText = ' '
        expandShown(gBoard, elCell)
    }
    return
}

function cellMarked(elCell) {
    // this will update the model
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if (gBoard[elCellI][elCellJ].isShown) return
    //model
    gBoard[elCellI][elCellJ].isMarked = !gBoard[elCellI][elCellJ].isMarked
    gBoard[elCellI][elCellJ].isMarked ? gFlagsOnBoardCount++ : gFlagsOnBoardCount--
    // DOM
    elCell.innerText = gBoard[elCellI][elCellJ].isMarked ? FLAG : ""
    elCell.classList.toggle('marked')

    var minesOnBoardCount = +elMinesOnBoard.textContent
    elMinesOnBoard.innerText = gBoard[elCellI][elCellJ].isMarked ? minesOnBoardCount - 1 : minesOnBoardCount + 1

    checkGameOver()
}
