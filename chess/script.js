document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('chess-board');
    const statusDisplay = document.getElementById('status-display');
    const resetButton = document.getElementById('reset-button');
    const boardSize = 8;

    let boardState = [];
    let currentPlayer = 'w'; // 'w' for white, 'b' for black
    let selectedPiece = null;
    let validMoves = [];

    function initializeBoard() {
        boardState = [
            ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
            ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
            ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
        ];
        currentPlayer = 'w';
        selectedPiece = null;
        validMoves = [];
        renderBoard();
        updateStatus();
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = boardState[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    // Yahaan .png se .svg mein badlaav kiya gaya hai
                    pieceElement.style.backgroundImage = `url(images/${piece}.svg)`; 
                    square.appendChild(pieceElement);
                }
                
                boardElement.appendChild(square);
            }
        }
        addEventListeners();
        highlightValidMoves();
    }
    
    function addEventListeners() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('click', handleSquareClick);
        });
    }

    function handleSquareClick(event) {
        const square = event.currentTarget;
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = boardState[row][col];

        if (selectedPiece) {
            const isValidMove = validMoves.some(move => move[0] === row && move[1] === col);
            if (isValidMove) {
                movePiece(selectedPiece.row, selectedPiece.col, row, col);
            } else {
                deselectPiece();
                if (piece && piece.charAt(0) === currentPlayer) {
                    selectPiece(row, col);
                }
            }
        } else {
            if (piece && piece.charAt(0) === currentPlayer) {
                selectPiece(row, col);
            }
        }
    }

    function selectPiece(row, col) {
        deselectPiece(); // Clear previous selection
        selectedPiece = { piece: boardState[row][col], row, col };
        validMoves = getValidMoves(selectedPiece.piece, row, col);
        
        const square = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        square.classList.add('selected');
        highlightValidMoves();
    }

    function deselectPiece() {
        if (selectedPiece) {
            const prevSquare = document.querySelector(`[data-row='${selectedPiece.row}'][data-col='${selectedPiece.col}']`);
            if (prevSquare) prevSquare.classList.remove('selected');
        }
        selectedPiece = null;
        validMoves = [];
        removeValidMoveHighlights();
    }

    function movePiece(fromRow, fromCol, toRow, toCol) {
        // Check for game over condition (King capture)
        const targetPiece = boardState[toRow][toCol];
        if (targetPiece && targetPiece.substring(1) === 'K') {
            boardState[toRow][toCol] = boardState[fromRow][fromCol];
            boardState[fromRow][fromCol] = null;
            renderBoard();
            statusDisplay.textContent = `${currentPlayer === 'w' ? 'White' : 'Black'} wins! Game Over.`;
            // Disable further clicks
            document.querySelectorAll('.square').forEach(s => s.replaceWith(s.cloneNode(true)));
            return;
        }

        boardState[toRow][toCol] = boardState[fromRow][fromCol];
        boardState[fromRow][fromCol] = null;
        
        // Simple Pawn Promotion
        if (boardState[toRow][toCol] === 'wP' && toRow === 0) {
            boardState[toRow][toCol] = 'wQ';
        }
        if (boardState[toRow][toCol] === 'bP' && toRow === 7) {
            boardState[toRow][toCol] = 'bQ';
        }

        deselectPiece();
        switchPlayer();
        renderBoard();
        updateStatus();
    }

    function switchPlayer() {
        currentPlayer = (currentPlayer === 'w') ? 'b' : 'w';
    }

    function updateStatus() {
        statusDisplay.textContent = `${currentPlayer === 'w' ? 'White' : 'Black'}'s Turn`;
    }

    function highlightValidMoves() {
        removeValidMoveHighlights();
        validMoves.forEach(move => {
            const square = document.querySelector(`[data-row='${move[0]}'][data-col='${move[1]}']`);
            if (square) square.classList.add('valid-move');
        });
    }

    function removeValidMoveHighlights() {
        document.querySelectorAll('.valid-move').forEach(s => s.classList.remove('valid-move'));
    }

    function getValidMoves(piece, row, col) {
        const moves = [];
        const type = piece.substring(1);
        const color = piece.charAt(0);

        switch(type) {
            case 'P': // Pawn
                const direction = color === 'w' ? -1 : 1;
                const startRow = color === 'w' ? 6 : 1;

                // Move forward 1
                if (row + direction >= 0 && row + direction < 8 && !boardState[row + direction][col]) {
                    moves.push([row + direction, col]);
                }
                // Move forward 2 from start
                if (row === startRow && !boardState[row + direction][col] && !boardState[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
                // Capture
                [-1, 1].forEach(d => {
                    if (col + d >= 0 && col + d < 8) {
                        const target = boardState[row + direction]?.[col + d];
                        if (target && target.charAt(0) !== color) {
                            moves.push([row + direction, col + d]);
                        }
                    }
                });
                break;
            
            case 'R': // Rook
            case 'B': // Bishop
            case 'Q': // Queen
                const directions = {
                    'R': [[-1, 0], [1, 0], [0, -1], [0, 1]],
                    'B': [[-1, -1], [-1, 1], [1, -1], [1, 1]],
                    'Q': [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
                }[type];

                directions.forEach(([dr, dc]) => {
                    for (let i = 1; i < 8; i++) {
                        const newRow = row + i * dr;
                        const newCol = col + i * dc;
                        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
                        const target = boardState[newRow][newCol];
                        if (target) {
                            if (target.charAt(0) !== color) moves.push([newRow, newCol]);
                            break;
                        }
                        moves.push([newRow, newCol]);
                    }
                });
                break;
            
            case 'N': // Knight
                const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
                knightMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        const target = boardState[newRow][newCol];
                        if (!target || target.charAt(0) !== color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                });
                break;

            case 'K': // King
                const kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
                kingMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        const target = boardState[newRow][newCol];
                        if (!target || target.charAt(0) !== color) {
                            moves.push([newRow, newCol]);
                        }
                    }
                });
                break;
        }
        return moves;
    }

    resetButton.addEventListener('click', initializeBoard);

    // Start the game
    initializeBoard();
});