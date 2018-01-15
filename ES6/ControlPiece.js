'use strict';
export class ControlPiece {
    constructor(piece) {
        this.piece = piece;
    }

    fall() {
        if (!this.piece.collisionBlock()) {
            this.piece.y++;
            this.piece.ub.drawCanvas();
            this.piece.drawPiece();
        }
    }

    rotate() {
        if (!this.piece.collisionBlock() && this.piece.canRotate()) {
            this.piece.rotation = this.piece.rotation < this.piece.currentPiece.shape.length-1 ? ++this.piece.rotation : 0;
            this.piece.shape = this.piece.currentPiece.shape[this.piece.rotation];
            for (let y = 0; y < this.piece.shape.length; y++) {
                for (let x = 0; x < this.piece.shape[y].length; x++) {
                    if ((this.piece.x < 0) ||
                        (this.piece.ub.board[this.piece.y+y] &&
                         this.piece.shape[y][x] &&
                         this.piece.ub.board[this.piece.y+y][this.piece.x+x] !== this.piece.color &&
                         this.piece.ub.board[this.piece.y+y][this.piece.x+x] !== this.piece.ub.dm.defBg)) {
                        this.piece.x++;
                    } else if ((this.piece.x+this.piece.shape[y].length > this.piece.ub.dm.canvasColumns) ||
                        (this.piece.ub.board[this.piece.y+y] &&
                         this.piece.shape[y][x] &&
                         this.piece.ub.board[this.piece.y+y][this.piece.x+this.piece.shape[y].length-1] !== this.piece.color &&
                         this.piece.ub.board[this.piece.y+y][this.piece.x+this.piece.shape[y].length-1] !== this.piece.ub.dm.defBg)) {
                        this.piece.x--;
                    }
                }
            }
            this.piece.ub.drawCanvas();
            this.piece.drawPiece();
        }
    }

    moveLeft() {
        if (!this.piece.collisionWallLeft()) {
            this.piece.x--;
            this.piece.ub.drawCanvas();
            this.piece.drawPiece();
        }
    }

    moveRight() {
        if (!this.piece.collisionWallRight()) {
            this.piece.x++;
            this.piece.ub.drawCanvas();
            this.piece.drawPiece();
        }
    }
}
