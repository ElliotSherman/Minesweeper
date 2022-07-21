function buildBoard(gLevel) {

    const genArr = []
    const board = []
    // create an array of various cells 
    for (var i = 0; i < gLevel.size ** 2; i++) {
        var cellData = {
            isShown: false,
            isMine: i < gLevel.mines ? true : false,
            isMarked: false,
            minesAroundCount: null 
        }

        genArr.push(cellData)
    }
    //shuffle genArr
    let currentIndex = genArr.length;
    let temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = genArr[currentIndex];
        genArr[currentIndex] = genArr[randomIndex];
        genArr[randomIndex] = temporaryValue;
    };
    // create a matrix using splice 
    while (genArr.length) board.push(genArr.splice(0, gLevel.size))
    return board;
}

function renderBoard(board, selector) {
    // console.table(board)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) {
            // define cell content if not Mine set the count
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = setMinesNeighborsCount(i, j, board)
            }
            var strClass //= board[i][j] ? 'cyan' : ''
            strHTML += `
                \t<td 
                    class="cell"
                    data-i="${i}" 
                    data-j="${j}" 
                    onclick="cellClicked(this,${i}, ${j})"
                    >
                </td>\n
            `
        }
        strHTML += '</tr>\n'
    }
    var elTable = document.querySelector(selector)
    elTable.innerHTML = strHTML
}


function resetTimer() {
    clearInterval(gTimeId)
    gTimeId = 0
}

function setDifficulty(elLevel){
    var size = elLevel.dataset.size
    var mines = elLevel.dataset.mines
    gLevel.size = size
    gLevel.mines = mines
    initGame()
}