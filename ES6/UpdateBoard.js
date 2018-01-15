'use strict';
export const UpdateBoard = (function() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const txtLines = document.querySelector('#lines');
    return class {
        constructor(dataModel) {
            this.dm = dataModel;
            this.board = [];
            this.initBoard();
        }

        initBoard() {
            canvas.width = this.dm.blocksz*this.dm.canvasColumns;
            canvas.height = this.dm.blocksz*this.dm.canvasLines;
            for (let y = 0; y < this.dm.canvasLines; y++) {
                this.board[y] = [];
                for (let x = 0; x < this.dm.canvasColumns; x++) {
                    this.board[y][x] = this.dm.defBg;
                }
            }
            //this.nl = 0;
            txtLines.textContent = 'Lines: 0';
            this.drawCanvas();
        }

        drawSquare(x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * this.dm.blocksz, y * this.dm.blocksz, this.dm.blocksz, this.dm.blocksz);
            ctx.strokeStyle = 'cadetblue';
            ctx.lineWidth = 0.4;
            ctx.strokeRect(x * this.dm.blocksz, y * this.dm.blocksz, this.dm.blocksz, this.dm.blocksz);
        }

        drawCanvas() {
            for (let y = 0; y < this.dm.canvasLines; y++) {
                for (let x =0; x < this.dm.canvasColumns; x++) {
                    this.drawSquare(x,y,this.board[y][x]);
                }
            }
        }

        drawBoard(dx, dy, color, shape) {
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x] && this.board[dy+y] && this.board[dy+y][dx+x]) {
                       this.board[dy+y][dx+x] = color; 
                    }
                }
            }
        }

        countLines() {
            for (let y = this.board.length-1; y >= 0 ; y--) {
                if (!this.board[y].includes(this.dm.defBg)) {
                    txtLines.textContent = `Lines: ${++this.dm.points}`;
                    for (let l = y; l >= 0; l--) {
                        for (let x = 0; x < this.board[l].length; x++) {
                            this.board[l][x] = l === 0 ? this.dm.defBg : this.board[l-1][x];
                        }
                    }

                    this.drawCanvas();

                    if (y > 0) {
                        this.countLines();
                    } 
                }
            }
        }
    } 
})();
