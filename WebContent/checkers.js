var width = 500;
var height = 500;
var squareHeight = height / 8;
var squareWidth = width / 8;
var selectedRow;
var selectedCol;
var teal = "rgb(100,200,200)";
var grey = "rgb(200,200,200)";
var red = "rgb(200, 0, 0)";
var black = "rgb(0, 0, 0)";
var select = "rgb(100, 100, 100)";

var validMoves = [];

var canvas;
var ctx;
var board = new Board();

function getRow(event, canvas) {
	var y = event.y + window.pageYOffset;
	y -= canvas.offsetTop;
	var row = 0;
	while (y > squareHeight) { //count off rows
		y -= squareHeight;
		row++;
	}
	return row;
}

function getCol(event, canvas) {
	var x = event.x + window.pageXOffset;
	x -= canvas.offsetLeft;
	var col = 0;
	while (x > squareWidth) {
		x -= squareWidth;
		col++;
	}
	return col;
}

function determineSquareColor(row, col) {
	if ((row % 2 == 0 && col % 2 == 0) || (row % 2 != 0 && col % 2 != 0))
		return teal;
	else
		return grey;
}

function selectSquare(row, col) {
	//cannot select blank square
	if (board.getPiece(row, col) == null)
		return;
	ctx.strokeStyle = black;
	ctx.strokeRect(col * squareHeight + 1, row * squareWidth + 1, squareWidth - 2, squareHeight - 2);
	selectedRow = row;
	selectedCol = col;
	drawValidMoves(row, col);
}

function drawValidMoves(row, col) {
	validMoves = [];
	var piece = board.getPiece(row, col);
	//TODO create piece accessor that does not rely on string
	if (piece.color == "red") {
		//TODO handle kings
		var leftMove = new Square(row + 1, col - 1);
		if (board.getPiece(leftMove.row, leftMove.col) == null)
			validMoves.push(leftMove);
		var rightMove = new Square(row + 1, col + 1);
		if (board.getPiece(rightMove.row, rightMove.col) == null)
			validMoves.push(rightMove);
	}
	if (piece.color == "black") {
		//TODO handle kings
		var leftMove = new Square(row - 1, col - 1);
		if (board.getPiece(leftMove.row, leftMove.col) == null)
			validMoves.push(leftMove);
		var rightMove = new Square(row - 1, col + 1);
		if (board.getPiece(rightMove.row, rightMove.col) == null)
			validMoves.push(rightMove);
	}
	//paint valid squares
	ctx.fillStyle = select;
	for (var i = 0; i < validMoves.length; i++) {
		var move = validMoves[i];
		col = move.col;
		row = move.row;
		if (board.getPiece(row, col) == null)
			ctx.fillRect(col * squareHeight, row * squareWidth, squareWidth, squareHeight);
	}
}

function Square(row, col) {
	this.row = row;
	this.col = col;
}

// TODO should be able to use strokeRect, but seeing a shadow
function deselectSquare(row, col) {
	if (row === undefined || col === undefined) // selected will be undefined for first selection
		return;
	ctx.fillStyle = determineSquareColor(row, col);
	ctx.fillRect(col * squareHeight, row * squareWidth, squareWidth, squareHeight);
	selectedRow = null;
	selectedCol = null;
	ctx.fillStyle = determineSquareColor(row, col);
	for (var i = 0; i < validMoves.length; i++) {
		var move = validMoves[i];
		col = move.col;
		row = move.row;
		ctx.fillRect(col * squareHeight + 1, row * squareWidth + 1, squareWidth - 2, squareHeight - 2);
		drawLocation(row, col);
	}
}

function clickListener(event) {
	var row = getRow(event, canvas);
	var col = getCol(event, canvas);

	if (selectedRow == null && selectedCol == null) {
		selectSquare(row, col);
	} else {
		if (selectedRow == row && selectedCol == col) //clicked selected square
			deselectSquare(selectedRow, selectedCol);
		else {
			movePiece(selectedRow, selectedCol, row, col);
		}
	}
	//draw piece if there
	drawPiece(row, col);
}

function movePiece(oldRow, oldCol, newRow, newCol) {
	if (validMoves.length == 0)
		return;
	// if valid moves contains move, go ahead, else do nothing
	for (var i = 0; i < validMoves.length; i++) {
		var loc = validMoves[i];
		if (loc.row == newRow && loc.col == newCol) {
			board.movePiece(selectedRow, selectedCol, newRow, newCol);
			drawLocation(selectedRow, selectedCol);
			drawLocation(newRow, newCol);
			deselectSquare(selectedRow, selectedCol);
		}
	}
}

function drawLocation(row, col) {
	drawBoardBackground(row, col);
	drawPiece(row, col);
}

function drawPiece(row, col) {
	var piece = board.getPiece(row, col);
	if (piece == null)
		return
	var color = piece.color;
	if (color == "red")
		ctx.fillStyle = red;
	if (color == "black")
		ctx.fillStyle = black;
	
	var currHeight = col * squareHeight;
	var currWidth = row * squareHeight;
	
	ctx.beginPath();
	ctx.arc(currHeight + squareHeight/2, //starting height 
			currWidth + squareWidth/2,   //starting width
			(squareWidth - 10)/2,		 //radius
			0,							 //starting angle 
			360, 						 //ending angle
			false);
	ctx.fill();
}

function drawBoardBackground(row, col) {
	ctx.fillStyle = determineSquareColor(row, col);
	var currWidth = row * squareWidth;
	var currHeight = col * squareHeight;
	ctx.beginPath();
	ctx.moveTo(currHeight, currWidth);
	ctx.lineTo(currHeight, currWidth + squareWidth);
	ctx.lineTo(currHeight + squareHeight, currWidth + squareWidth);
	ctx.lineTo(currHeight + squareHeight, currWidth);
	ctx.fill();
}

//Draw initial board state
function drawBoard() {
	canvas = document.getElementById("canvas");
	canvas.addEventListener("click", clickListener, false);
	ctx = canvas.getContext("2d");

	ctx.fillStyle = grey;
	ctx.strokeRect(0, 0, width, height);

	for ( var row = 0; row < 8; row++) {
		for ( var col = 0; col < 8; col++) {
			drawBoardBackground(row, col, ctx);
			drawPiece(row, col, board, ctx);
		}
	}
	
}