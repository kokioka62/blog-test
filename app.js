document.addEventListener('DOMContentLoaded', function() {
    const newPostForm = document.getElementById('new-post-form');
    const blogSection = document.getElementById('blog');

    newPostForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        const newArticle = document.createElement('article');
        newArticle.innerHTML = `
            <h3>${title}</h3>
            <p>${content.substring(0, 100)}...</p>
            <a href="#">続きを読む</a>
        `;

        blogSection.insertBefore(newArticle, blogSection.firstChild);

        newPostForm.reset();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const size = 8;
    const boardState = Array(size).fill(null).map(() => Array(size).fill(null));
    let currentPlayer = 'B'; // 'B' for Black, 'W' for White

    // 初期配置
    boardState[3][3] = 'W';
    boardState[3][4] = 'B';
    boardState[4][3] = 'B';
    boardState[4][4] = 'W';

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    const statusDisplay = document.createElement('div');
    statusDisplay.id = 'status';
    document.body.insertBefore(statusDisplay, board);

    function updateStatus() {
        const flatBoard = boardState.flat();
        const blackCount = flatBoard.filter(stone => stone === 'B').length;
        const whiteCount = flatBoard.filter(stone => stone === 'W').length;
        statusDisplay.textContent = `現在のターン: ${currentPlayer === 'B' ? '黒' : '白'} | 黒: ${blackCount} | 白: ${whiteCount}`;
    }

    function isValidMove(row, col, player) {
        if (boardState[row][col] !== null) return false;

        const opponent = player === 'B' ? 'W' : 'B';
        for (const [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            let hasOpponentBetween = false;

            while (x >= 0 && x < size && y >= 0 && y < size && boardState[x][y] === opponent) {
                x += dx;
                y += dy;
                hasOpponentBetween = true;
            }

            if (hasOpponentBetween && x >= 0 && x < size && y >= 0 && y < size && boardState[x][y] === player) {
                return true;
            }
        }
        return false;
    }

    function flipStones(row, col, player) {
        const opponent = player === 'B' ? 'W' : 'B';
        for (const [dx, dy] of directions) {
            let x = row + dx, y = col + dy;
            const stonesToFlip = [];

            while (x >= 0 && x < size && y >= 0 && y < size && boardState[x][y] === opponent) {
                stonesToFlip.push([x, y]);
                x += dx;
                y += dy;
            }

            if (x >= 0 && x < size && y >= 0 && y < size && boardState[x][y] === player) {
                for (const [fx, fy] of stonesToFlip) {
                    boardState[fx][fy] = player;
                }
            }
        }
    }

    function handleClick(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row, 10);
        const col = parseInt(cell.dataset.col, 10);

        if (isValidMove(row, col, currentPlayer)) {
            boardState[row][col] = currentPlayer;
            flipStones(row, col, currentPlayer);
            currentPlayer = currentPlayer === 'B' ? 'W' : 'B'; // プレイヤーを交代
            renderBoard();
            updateStatus();
            checkGameOver();
        }
    }

    function renderBoard() {
        board.innerHTML = '';
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement('div');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.className = 'cell';
                cell.addEventListener('click', handleClick);
                if (boardState[row][col]) {
                    cell.classList.add(boardState[row][col] === 'B' ? 'black' : 'white');
                } else if (isValidMove(row, col, currentPlayer)) {
                    cell.classList.add('highlight'); // 打てる場所をハイライト
                }
                board.appendChild(cell);
            }
        }
    }

    function checkGameOver() {
        const flatBoard = boardState.flat();
        if (!flatBoard.includes(null) || !flatBoard.includes('B') || !flatBoard.includes('W')) {
            alert('ゲーム終了');
        }
    }

    renderBoard();
    updateStatus();
});
