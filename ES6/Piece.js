'use strict';
export const Piece = (function() {
    let nextPiece = false;
    const nextShape = document.querySelector('#next-piece');
    let pieces = [];
    class Shape {
        static I() {
            return [
                [
                    [0,1],
                    [0,1],
                    [0,1],
                    [0,1]
                ],
                [
                    [0,0,0,0],
                    [1,1,1,1]
                ]
            ];
        }

        static J() {
            return[
                [
                    [0,1],
                    [0,1],
                    [1,1]
                ],
                [
                    [1,0,0],
                    [1,1,1]
                ],
                [
                    [0,1,1],
                    [0,1,0],
                    [0,1,0]
                ],
                [
                    [1,1,1],
                    [0,0,1]
                ]
            ];
        }

        static L() {
            return[
                [
                    [1,0],
                    [1,0],
                    [1,1]
                ],
                [
                    [1,1,1],
                    [1,0,0]
                ],
                [
                    [0,1,1],
                    [0,0,1],
                    [0,0,1]
                ],
                [
                    [0,0,1],
                    [1,1,1]
                ]
            ];
        }

        static O() {
            return[
                [
                    [1,1],
                    [1,1]
                ]
            ];
        }

        static S() {
            return[
                [
                    [0,1,1],
                    [1,1,0]
                ],
                [
                    [0,1,0],
                    [0,1,1],
                    [0,0,1]
                ],
                [
                    [0,0,0],
                    [0,1,1],
                    [1,1,0]
                ],
                [
                    [1,0],
                    [1,1],
                    [0,1]
                ],
            ];
        }

        static T() {
            return[
                [
                    [1,1,1],
                    [0,1,0]
                ],
                [
                    [0,0,1],
                    [0,1,1],
                    [0,0,1]
                ],
                [
                    [0,0,0],
                    [0,1,0],
                    [1,1,1]
                ],
                [
                    [1,0],
                    [1,1],
                    [1,0]
                ]
            ];
        }

        static Z() {
            return[
                [
                    [1,1,0],
                    [0,1,1]
                ],
                [
                    [0,0,1],
                    [0,1,1],
                    [0,1,0]
                ],
                [
                    [0,0,0],
                    [1,1,0],
                    [0,1,1]
                ],
                [
                    [0,1],
                    [1,1],
                    [1,0]
                ]
            ];
        }
    }

    return class Piece {
        constructor(updateBoard) {
            this.ub = updateBoard;
            this.bs = document.querySelector('#start-game');
            pieces = [
                {simb: 'I', shape: Shape.I(), color: this.ub.dm.colorI},
                {simb: 'J', shape: Shape.J(), color: this.ub.dm.colorJ},
                {simb: 'L', shape: Shape.L(), color: this.ub.dm.colorL},
                {simb: 'O', shape: Shape.O(), color: this.ub.dm.colorO},
                {simb: 'S', shape: Shape.S(), color: this.ub.dm.colorS},
                {simb: 'T', shape: Shape.T(), color: this.ub.dm.colorT},
                {simb: 'Z', shape: Shape.Z(), color: this.ub.dm.colorZ}
            ];
        }

        initPiece() {
            this.currentPiece = nextPiece ? nextPiece : pieces[Math.round(Math.random() * (pieces.length-1))];
            nextPiece = pieces[Math.round(Math.random() * (pieces.length-1))];
            this.shape = this.currentPiece.shape[0];
            this.x = Math.ceil((this.ub.dm.canvasColumns-this.shape[0].length)/2);
            this.y = -this.shape.length;
            this.color = this.currentPiece.color;
            this.rotation = 0;
            nextShape.src = 'img/' + nextPiece.simb + '.png';
        }

        drawPiece() {
            for (let dy = 0; dy < this.shape.length; dy++) {
                for (let dx = 0; dx < this.shape[dy].length; dx++) {
                    if (this.shape[dy][dx]) {
                        this.ub.drawSquare(this.x+dx,this.y+dy,this.color);
                    }
                }
            }
        }

        collisionWallRight() {
            for (let y = 0; y < this.shape.length; y++) {
                for (let x = 0; x < this.shape[y].length; x++) {
                    if (this.shape[y][x] && (this.x+x >= this.ub.dm.canvasColumns-1 || (this.ub.board[this.y+y] && this.ub.board[this.y+y][this.x+x+1] !== this.ub.dm.defBg))) {
                        return true;
                    }
                }
            }
            return false;
        }

        collisionWallLeft() {
            for (let y = 0; y < this.shape.length; y++) {
                for (let x = 0; x < this.shape[y].length; x++) {
                    if (this.shape[y][x] && (this.x+x <= 0 || (this.ub.board[this.y+y] && this.ub.board[this.y+y][this.x+x-1] !== this.ub.dm.defBg))) {
                        return true;
                    }
                }
            }
            return false;
        }

        collisionBlock() {
            for (let y = 0; y < this.shape.length; y++) {
                for (let x = 0; x < this.shape[y].length; x++) {

                    if (!this.shape[y][x]) continue;

                    if ((this.ub.board[this.y+y+1] && this.ub.board[this.y+y+1][this.x+x] !== this.ub.dm.defBg) || this.y+y+1 >= this.ub.dm.canvasLines ) {
                        if (this.y < 0) {
                            this.ub.dm.gameOver = true;
                            const self = this;
                            const button = this.bs;
                            const socket = io.connect('http://localhost:1818');
                            socket.on('lower-point', function(data) {
                                if (self.ub.dm.points >= data) {
                                    const xhr = new XMLHttpRequest();
                                    const formData = `nl=${self.ub.dm.points}`;
                                    xhr.open('post', '/allow-sign');
                                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                                    xhr.onreadystatechange = function() {
                                        if (xhr.status === 200) {
                                            setTimeout(() => {
                                                window.location.href = '/submit-name';
                                            }, 2000);
                                        } else {
                                            console.log('error allow sign');
                                        }
                                    };

                                    xhr.send(formData);
                                    self.ub.dm.activeButton = false;
                                    button.innerHTML = `YOU ARE IN THE TOP TEN!<br>wait a sec to insert your name`;
                                    socket.disconnect();
                                } else {
                                    self.ub.dm.activeButton = true;
                                    button.innerHTML = `you have done ${self.ub.dm.points} lines <br> Click to play again`;
                                }
                                button.style.fontSize = '15px';
                                button.style.paddingTop = '48px';
                                button.style.height = '82px';
                                button.style.display = 'block';
                            });
                            socket.emit('ask-lower-point');
                        }

                        this.ub.drawBoard(this.x, this.y, this.color, this.shape);
                        this.ub.countLines();
                        this.initPiece();
                        return true;
                    }
                }
            }
            return false;
        }

        canRotate() {
            const r = this.rotation < this.currentPiece.shape.length-1 ? this.rotation + 1: 0;
            const np = this.currentPiece.shape[r];
            for (let y = 0; y < this.shape.length; y++) {
                for (let x = 0; x < this.shape[y].length; x++) {
                    const line = this.ub.board[this.y+y];
                    const holes = [];
                    let hole = [];
                    for (let z in line) {
                        if (line[z].toString() === this.ub.dm.defBg) {
                            hole.push(Number(++z));
                            if (z === line.length) {
                                holes.push(hole);
                                hole = [];
                            }
                        } else {
                            if (hole.length > 0) {
                                holes.push(hole);
                            }
                            hole = [];
                        }
                    }
                    for (let hole in holes) {
                        if (this.x >= Number(holes[hole][0]) && this.x <= Number(holes[hole][holes[hole].length-1])) {
                            if (np[0].length >= holes[hole].length) {
                                return false;
                            }
                        }
                    }  
                }
            }
            return true;
        }
    }
})();
