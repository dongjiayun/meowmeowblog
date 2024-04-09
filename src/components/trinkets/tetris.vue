<template>
    <div class="tetris">
        <canvas ref="bgCanvas" class="tetris-bg" />
        <canvas ref="fgCanvas" class="tetris-fg" />
    </div>
</template>

<script>
const tetrominos = [{
    // box
    colors: ['rgb(59,84,165)', 'rgb(118,137,196)', 'rgb(79,111,182)'],
    data: [[0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]]
},
{
    // stick
    colors: ['rgb(214,30,60)', 'rgb(241,108,107)', 'rgb(236,42,75)'],
    data: [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]]
},
{
    // z
    colors: ['rgb(88,178,71)', 'rgb(150,204,110)', 'rgb(115,191,68)'],
    data: [[0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 1],
        [0, 0, 0, 0]]
},
{
    // T
    colors: ['rgb(62,170,212)', 'rgb(120,205,244)', 'rgb(54,192,240)'],
    data: [[0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 0, 1, 0],
        [0, 0, 0, 0]]
},
{
    // s
    colors: ['rgb(236,94,36)', 'rgb(234,154,84)', 'rgb(228,126,37)'],
    data: [[0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]]
},
{
    // backwards L
    colors: ['rgb(220,159,39)', 'rgb(246,197,100)', 'rgb(242,181,42)'],
    data: [[0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]]
},
{
    // L
    colors: ['rgb(158,35,126)', 'rgb(193,111,173)', 'rgb(179,63,151)'],
    data: [[0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]]
}]

export default {
    data() {
        return {
            posX: 0,
            posY: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            bgCanvas: null,
            fgCanvas: null,
            bgCtx: null,
            fgCtx: null,
            curPiece: {
                data: null,
                colors: [0, 0, 0],
                x: 0,
                y: 0,
            },
            lastMove: Date.now(),
            curSpeed: 50 + Math.random() * 50,
            unitSize: 20,
            linesCleared: 0,
            level: 0,
            loseBlock: 0,
            board: [],
            boardWidth: 0,
            boardHeight: 0,
        }
    },
    mounted() {
        this.bgCanvas = this.$refs.bgCanvas
        this.fgCanvas = this.$refs.fgCanvas
        this.bgCtx = this.bgCanvas.getContext('2d')
        this.fgCtx = this.fgCanvas.getContext('2d')
        this.bgCanvas.width = this.fgCanvas.width = this.width
        this.bgCanvas.height = this.fgCanvas.height = this.height
        this.bgCanvas.style.left = this.posX + 'px'
        this.bgCanvas.style.top = this.posY + 'px'
        this.fgCanvas.style.left = this.posX + 'px'
        this.fgCanvas.style.top = this.posY + 'px'

        this.init()
    },
    methods: {
        init() {
            this.curPiece = {
                data: null,
                colors: [0, 0, 0],
                x: 0,
                y: 0,
            }
            this.lastMove = Date.now()
            this.curSpeed = 50 + Math.random() * 50
            this.unitSize = 20
            this.linesCleared = 0
            this.level = 0
            this.loseBlock = 0
            this.board = []
            this.boardWidth = Math.floor(this.width / this.unitSize)
            this.boardHeight = Math.floor(this.height / this.unitSize)

            const halfHeight = this.boardHeight / 2
            for (let x = 0; x <= this.boardWidth; x++) {
                this.board[x] = []
                for (let y = 0; y <= this.boardHeight; y++) {
                    this.board[x][y] = {
                        data: 0,
                        colors: ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)'],
                    }

                    if (Math.random() > 0.15 && y > halfHeight) {
                        const randomIndex = Math.floor(Math.random() * tetrominos.length)
                        this.board[x][y] = {
                            data: 1,
                            colors: tetrominos[randomIndex].colors,
                        }
                    }
                }
            }

            for (let x = 0; x <= this.boardWidth; x++) {
                for (let y = this.boardHeight - 1; y > -1; y--) {
                    if (this.board[x][y].data === 0 && y > 0) {
                        for (let yy = y; yy > 0; yy--) {
                            if (this.board[x][yy - 1].data) {
                                this.board[x][yy].data = 1
                                this.board[x][yy].colors = this.board[x][yy - 1].colors
                                this.board[x][yy - 1].data = 0
                                this.board[x][yy - 1].colors = ['rgb(0,0,0)', 'rgb(0,0,0)', 'rgb(0,0,0)']
                            }
                        }
                    }
                }
            }

            window.addEventListener('keydown', this.handleKeyDown)
            this.checkLines()
            this.renderBoard()
            this.newTetromino()
            this.update()
        },
        update() {
            if (!this.checkMovement(this.curPiece, 0, 1)) {
                if (this.curPiece.y < -1) {
                    this.loseScreen()
                    return true
                } else {
                    this.fillBoard(this.curPiece)
                    this.newTetromino()
                }
            } else {
                if (Date.now() > this.lastMove) {
                    this.lastMove = Date.now() + this.curSpeed
                    if (this.checkMovement(this.curPiece, 0, 1)) {
                        this.curPiece.y++
                    } else {
                        this.fillBoard(this.curPiece)
                        this.newTetromino()
                    }
                }
            }

            this.render()
            requestAnimationFrame(this.update)
        },
        renderBoard() {
            const ctx = this.bgCtx
            const unitSize = this.unitSize

            ctx.clearRect(0, 0, this.width, this.height)
            for (let x = 0; x <= this.boardWidth; x++) {
                for (let y = 0; y <= this.boardHeight; y++) {
                    if (this.board[x][y].data !== 0) {
                        const bX = (x * unitSize)
                        const bY = (y * unitSize)

                        ctx.fillStyle = this.board[x][y].colors[0]
                        ctx.fillRect(bX, bY, unitSize, unitSize)

                        ctx.fillStyle = this.board[x][y].colors[1]
                        ctx.fillRect(bX + 2, bY + 2, unitSize - 4, unitSize - 4)

                        ctx.fillStyle = this.board[x][y].colors[2]
                        ctx.fillRect(bX + 4, bY + 4, unitSize - 8, unitSize - 8)
                    }
                }
            }
        },
        render() {
            const ctx = this.fgCtx
            const unitSize = this.unitSize

            ctx.clearRect(0, 0, this.width, this.height)

            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    if (this.curPiece.data[x][y] === 1) {
                        const xPos = ((this.curPiece.x + x) * unitSize)
                        const yPos = ((this.curPiece.y + y) * unitSize)

                        if (yPos > -1) {
                            ctx.fillStyle = this.curPiece.colors[0]
                            ctx.fillRect(xPos, yPos, unitSize, unitSize)

                            ctx.fillStyle = this.curPiece.colors[1]
                            ctx.fillRect(xPos + 2, yPos + 2, unitSize - 4, unitSize - 4)

                            ctx.fillStyle = this.curPiece.colors[2]
                            ctx.fillRect(xPos + 4, yPos + 4, unitSize - 8, unitSize - 8)
                        }
                    }
                }
            }
        },
        handleKeyDown(event) {
            switch (event.keyCode) {
                case 37:
                    if (this.checkMovement(this.curPiece, -1, 0)) {
                        this.curPiece.x--
                    }
                    break
                case 39:
                    if (this.checkMovement(this.curPiece, 1, 0)) {
                        this.curPiece.x++
                    }
                    break
                case 40:
                    if (this.checkMovement(this.curPiece, 0, 1)) {
                        this.curPiece.y++
                    }
                    break
                case 32:
                case 38:
                    this.curPiece.data = this.rotateTetrimono(this.curPiece)
                    break
            }
        },
        checkMovement(curPiece, newX, newY) {
            const piece = curPiece.data
            const posX = curPiece.x
            const posY = curPiece.y

            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    if (piece[x][y] === 1) {
                        if (!this.board[posX + x + newX]) {
                            this.board[posX + x + newX] = []
                        }

                        if (!this.board[posX + x + newX][y + posY + newY]) {
                            this.board[posX + x + newX][y + posY + newY] = {
                                data: 0
                            }
                        }

                        if (posX + x + newX >= this.boardWidth || posX + x + newX < 0 || this.board[posX + x + newX][y + posY + newY].data == 1) {
                            return false
                        }

                        if (posY + y + newY > this.boardHeight) {
                            return false
                        }
                    }
                }
            }
            return true
        },
        checkLines() {
            let y = this.boardHeight + 1
            while (y--) {
                let x = this.boardWidth
                let lines = 0

                while (x--) {
                    if (this.board[x][y].data === 1) {
                        lines++
                    }
                }

                if (lines === this.boardWidth) {
                    this.linesCleared++
                    this.level = Math.round(this.linesCleared / 20) * 20

                    let lineY = y
                    while (lineY) {
                        for (x = 0; x <= this.boardWidth; x++) {
                            if (lineY - 1 > 0) {
                                this.board[x][lineY].data = this.board[x][lineY - 1].data
                                this.board[x][lineY].colors = this.board[x][lineY - 1].colors
                            }
                        }
                        lineY--
                    }
                    y++
                }
            }
        },
        loseScreen() {
            const ctx = this.bgCtx
            const unitSize = this.unitSize
            const boardWidth = this.boardWidth
            const boardHeight = this.boardHeight
            const y = boardHeight - this.loseBlock

            for (let x = 0; x < boardWidth; x++) {
                const bX = (x * unitSize)
                const bY = (y * unitSize)

                ctx.fillStyle = 'rgb(80,80,80)'
                ctx.fillRect(bX, bY, unitSize, unitSize)

                ctx.fillStyle = 'rgb(150,150,150)'
                ctx.fillRect(bX + 2, bY + 2, unitSize - 4, unitSize - 4)

                ctx.fillStyle = 'rgb(100,100,100)'
                ctx.fillRect(bX + 4, bY + 4, unitSize - 8, unitSize - 8)
            }

            if (this.loseBlock <= (boardHeight + 1)) {
                this.loseBlock++
                requestAnimationFrame(this.loseScreen)
            } else {
                this.init()
            }
        },
        fillBoard(curPiece) {
            const piece = curPiece.data
            const posX = curPiece.x
            const posY = curPiece.y

            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    if (piece[x][y] === 1) {
                        this.board[x + posX][y + posY].data = 1
                        this.board[x + posX][y + posY].colors = curPiece.colors
                    }
                }
            }

            this.checkLines()
            this.renderBoard()
        },
        rotateTetrimono(curPiece) {
            let rotated = []

            for (let x = 0; x < 4; x++) {
                rotated[x] = []
                for (let y = 0; y < 4; y++) {
                    rotated[x][y] = curPiece.data[3 - y][x]
                }
            }

            if (!this.checkMovement({
                data: rotated,
                x: curPiece.x,
                y: curPiece.y
            }, 0, 0)) {
                rotated = curPiece.data
            }

            return rotated
        },
        newTetromino() {
            const pieceNum = Math.floor(Math.random() * tetrominos.length)

            this.curPiece.data = tetrominos[pieceNum].data
            this.curPiece.colors = tetrominos[pieceNum].colors
            this.curPiece.x = Math.floor(Math.random() * (this.boardWidth - this.curPiece.data.length + 1))
            this.curPiece.y = -4
        },
    },
}
</script>

<style lang="scss" scoped>
.tetris{
    position: relative;
    &-bg{
        position: absolute;
        top: 0;
    }
    &-fg{
        position: absolute;
        top:0;
    }
}
</style>
