'use strict';
export const Game = (function() {
    let fast = false;
    let start = 0;
    return class {
        constructor(controlPiece) {
            this.cp = controlPiece;
            this.init();
        }

        fallingShape() {
            if (!this.cp.piece.ub.dm.gameOver) {
                const time = fast ? this.cp.piece.ub.dm.fhz : this.cp.piece.ub.dm.shz;
                if (start > time) {
                    this.cp.fall();
                    start = 0;
                } else {
                    start++;
                }
                requestAnimationFrame(() => { this.fallingShape(); });
            }
        }

        init() {
            const self = this;
            document.addEventListener('keydown', (e) => {
                switch (e.keyCode) {
                    case 38:
                        self.cp.rotate();
                        break;
                    case 37:
                        self.cp.moveLeft();
                        break;
                    case 39:
                        self.cp.moveRight();
                        break;
                    case 40:
                        fast = true;
                        break;
                }
            });

            document.addEventListener('keyup', (e) => {
                switch (e.keyCode) {
                    case 40:
                        fast = false;
                        break;
                }
            });

            this.cp.piece.bs.addEventListener('click', () => {
                if (self.cp.piece.ub.dm.activeButton) {
                    self.cp.piece.ub.dm.points = 0;
                    self.cp.piece.bs.style.display = 'none';
                    self.cp.piece.ub.dm.gameOver = false;
                    self.cp.piece.ub.initBoard();
                    self.cp.piece.initPiece();
                    self.fallingShape(); 
                }
            });
        }
    }
})();
