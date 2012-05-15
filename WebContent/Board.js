function Board() {
	//create double array to store pieces
	this.board = new Array(8);
	for (var i = 0; i < 8; i++)
		this.board[i] = new Array(8);
	
	//Only 4 possible piece states
	this.redPiece = new Piece("red", false);
	this.blackPiece = new Piece("black", false);
	this.redKing = new Piece("red", true);
	this.blackKing = new Piece("black", true);
	
	this.getPiece = function(row, col) {
		return this.board[row][col];
	};
	
	this.movePiece = function(oldRow, oldCol, newRow, newCol) {
		var temp = this.board[oldRow][oldCol];
		this.board[oldRow][oldCol] = undefined;
		this.board[newRow][newCol] = temp;
	};
	
	init(this.board, this.redPiece, this.blackPiece);
}

function init(board, redPiece, blackPiece) {
	initRedPieces(board, redPiece);
	initBlackPieces(board, blackPiece);
}

/* initRed and initBlack are inelegant, 
 * but work for now.
 */
function initRedPieces(board, redPiece) {
	var row1 = 0; // 7, 6, 5 black rows
	var row3 = 2;
	for (var col = 0; col < 8; col += 2) {
		board[row1][col] = redPiece;
		board[row3][col] = redPiece;
	}
	var row2 = 1;
	for (var col = 1; col < 8; col += 2) {
		board[row2][col] = redPiece;
	}
}

/* initRed and initBlack are inelegant, 
 * but work for now.
 */
function initBlackPieces(board, blackPiece) {
	var row1 = 7; // 7, 6, 5 black rows
	var row3 = 5;
	for (var col = 1; col < 8; col += 2) {
		board[row1][col] = blackPiece;
		board[row3][col] = blackPiece;
	}
	var row2 = 6;
	for (var col = 0; col < 8; col += 2) {
		board[row2][col] = blackPiece;
	}
}

function Piece(color, king) {
	this.color = color;
	this.king = king;
};
