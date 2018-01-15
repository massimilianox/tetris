'use strict';
import { DataModel } from './DataModel.js';
import { UpdateBoard } from './UpdateBoard.js';
import { Piece } from './Piece.js';
import { ControlPiece } from './ControlPiece.js';
import { Game } from './Game.js';

(function() {
    const dataModel = new DataModel();
    const updateBoard = new UpdateBoard(dataModel);
    const piece = new Piece(updateBoard);
    const controlPiece = new ControlPiece(piece);
    const game = new Game(controlPiece);
})();