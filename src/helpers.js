// Setup Game
function setupGame(player, ai, turn) {
    // Setup Main
    let main = document.getElementById('main');
    let detailsContainer = document.createElement('div');
    let boardsContainer = document.createElement('div');
    let rotated = false;
    let gameReady = false;

    const size = player.gameboard.size;
    const borderSize = 1;
    const borderColor = 'rgb(64, 64, 64)';
    const squares = 11;
    const boardSize = 480;
    const squareSize = boardSize / squares;
    const units = 'px';

    const ships = {
        carrier : 5,
        battleship : 4,
        cruiser : 3,
        submarine : 3,
        destroyer : 2
    }

    detailsContainer.id = 'details';
    boardsContainer.id = 'boards-container';

    main.innerHTML = '';
    main.append(detailsContainer, boardsContainer);

    details.innerHTML = 'Setup board';

    setupInventory();
    setupBoard(player);
    assignBoard(player);
    createBtns();
    createDragDrop();

    // Setup Inventory
    function setupInventory() {
        let shipsContainer = document.createElement('div');
        let shipsHeader = document.createElement('div');
        let shipsInventory = document.createElement('div');

        shipsContainer.id = 'ships-container';
        shipsHeader.id = 'ships-header';
        shipsInventory.id = 'ships-inventory';
        shipsHeader.innerHTML = 'Ships';

        for (const ship in ships) {
            let shipRow = document.createElement('div');
            let shipElement = document.createElement('div');

            shipRow.classList.add('inventory-ship-container');
            shipElement.classList.add('inventory-ship');
            shipElement.id = ship;
            shipElement.style.display = 'flex';
            shipElement.style.cursor = 'pointer';
            shipElement.draggable = 'true';

            for (let i = 0; i < ships[ship]; i++) {
                let shipPart = document.createElement('div');
                shipPart.classList.add('ship-part', ship);
                shipPart.style.width = squareSize - borderSize + units;
                shipPart.style.height = squareSize - borderSize + units;
                shipPart.style.border = borderSize + units + ' solid ' + borderColor;
                if (i != ships[ship] - 1) shipPart.style.removeProperty('border-right');
                shipElement.append(shipPart);
            }

            shipElement.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', event.target.id);
            });

            shipRow.append(shipElement);
            shipsInventory.append(shipRow);
        }

        shipsContainer.append(shipsHeader, shipsInventory);
        boardsContainer.append(shipsContainer);
    }

    // Create Buttons
    function createBtns() {
        let buttonsContainer = document.createElement('div');
        let rotateBtn = document.createElement('div');
        let autoplaceBtn = document.createElement('div');
        let resetBtn = document.createElement('div');
        let startGameBtn = document.createElement('div');

        buttonsContainer.id = 'buttons-container';

        rotateBtn.classList.add('button');
        rotateBtn.innerHTML = 'Rotate';

        autoplaceBtn.classList.add('button');
        autoplaceBtn.innerHTML = 'Autoplace';

        resetBtn.classList.add('button');
        resetBtn.innerHTML = 'Reset';

        startGameBtn.id = 'start-game-button';
        startGameBtn.classList.add('button');
        startGameBtn.innerHTML = 'Start Game';

        rotateBtn.addEventListener('click', () => {
            rotated = rotated ? false : true;
            let shipsInventory = document.getElementById('ships-inventory');
            let inventoryShips = document.querySelectorAll('.inventory-ship');
            let inventoryStyle = window.getComputedStyle(shipsInventory);

            if (inventoryStyle.flexDirection == 'column') {
                shipsInventory.style.flexDirection = 'row';
            } else {
                shipsInventory.style.flexDirection = 'column';
            }

            inventoryShips.forEach(ship => {
                rotateShip(ship);
            });
        });

        autoplaceBtn.addEventListener('click', () => {
            autoplace();
        });

        resetBtn.addEventListener('click', () => {
            setupGame(player, ai, turn);
        });

        buttonsContainer.append(rotateBtn, autoplaceBtn, resetBtn, startGameBtn);
        main.append(buttonsContainer);
    }

    // Create Drag & Drop Events
    function createDragDrop() {
        let spaces = document.querySelectorAll('.board-space');

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let space = player.gameboardElement[y][x];
                space.classList.add('board-space-setup');

                space.addEventListener('dragenter', (event) => { event.preventDefault(); });
                space.addEventListener('dragover', (event) => {
                    event.preventDefault();
                    space.classList.add('board-space-hover');
                });
                space.addEventListener('dragleave', () => { space.classList.remove('board-space-hover'); });
                space.addEventListener('drop', (event) => {
                    let data = event.dataTransfer.getData('text');
                    let shipElement = document.getElementById(data);
                    let shipStyle = window.getComputedStyle(shipElement);
                    let shipWidth = parseFloat(shipStyle.width);
                    let shipHeight = parseFloat(shipStyle.height);
                    let droppable = false;
    
                    event.preventDefault();
                    space.classList.remove('board-space-hover');

                    // Horizontal
                    if (shipWidth > shipHeight) {
                        // Check boundaries
                        if (x <= size - ships[shipElement.id]) {
                            droppable = true;
    
                            // Check collision
                            for (let z = x; z < x + ships[shipElement.id]; z++) {
                                if (player.gameboardElement[y][z].classList.length == 4) {
                                    droppable = false;
                                }
                            }
    
                            // Add / Remove class to board spaces
                            if (droppable) {
                                // Remove all previous ship id class from board spaces
                                spaces.forEach(s => {
                                    s.classList.remove(shipElement.id);
                                });
    
                                // Add ship classes to board spaces
                                for (let z = x; z < x + ships[shipElement.id]; z++) {
                                    player.gameboardElement[y][z].classList.add(shipElement.id);
                                }
                            }
                        }
                    }
                    // Vertical
                    else {
                        // Check boundaries
                        if (y <= size - ships[shipElement.id]) {
                            droppable = true;
    
                            // Check collision
                            for (let z = y; z < y + ships[shipElement.id]; z++) {
                                if (player.gameboardElement[z][x].classList.length == 4) {
                                    droppable = false;
                                }
                            }

                            // Add / Remove class to board spaces
                            if (droppable) {
                                // Remove all previous ship id class from board spaces
                                spaces.forEach(s => {
                                    s.classList.remove(shipElement.id);
                                });
    
                                // Add ship classes to board spaces
                                for (let z = y; z < y + ships[shipElement.id]; z++) {
                                    player.gameboardElement[z][x].classList.add(shipElement.id);
                                }
                            }
                        }
                    }

                    // Add Ship
                    if (droppable) {
                        shipElement.classList.remove('inventory-ship');
                        shipElement.classList.add('board-ship-select');
                        event.target.append(shipElement);

                        // Check if all ships placed
                        let inventoryShips = document.querySelectorAll('.inventory-ship');
                        if (inventoryShips.length == 0 && gameReady == false) {
                            let startGameBtn = document.getElementById('start-game-button');
                            startGameBtn.id = 'start-game-ready-button';

                            startGameBtn.addEventListener('click', () => {
                                startGame();
                            });

                            gameReady = true;
                        }
                    }
                });
            }
        }
    }

    // Rotate Ship
    function rotateShip(ship) {
        let shipStyle = window.getComputedStyle(ship);
        let origWidth = shipStyle.width;
        let origHeight = shipStyle.height;

        ship.style.width = origHeight;
        ship.style.height = origWidth;

        let shipWidth = parseFloat(shipStyle.width);
        let shipHeight = parseFloat(shipStyle.height);
        let shipParts = ship.querySelectorAll('.ship-part');

        if (shipWidth < shipHeight) {
            ship.style.removeProperty('display');

            for (let i = 0; i < shipParts.length; i++) {
                shipParts[i].style.removeProperty('border');
                shipParts[i].style.border = borderSize + units + ' solid ' + borderColor;

                if (i != shipParts.length - 1) {
                    shipParts[i].style.removeProperty('border-bottom');
                }
            }
        } else {
            ship.style.display = 'flex';

            for (let i = 0; i < shipParts.length; i++) {
                shipParts[i].style.removeProperty('border');
                shipParts[i].style.border = borderSize + units + ' solid ' + borderColor;

                if (i != shipParts.length - 1) {
                    shipParts[i].style.removeProperty('border-right');
                }
            }
        }
    }

    // Autoplace
    function autoplace() {
        let inventoryShips = document.querySelectorAll('.inventory-ship');

        inventoryShips.forEach(shipElement => {
            let droppable = false;
            let rotate = Math.floor(Math.random() * 2); // Randomly choose rotation

            if (rotate) rotateShip(shipElement);

            let shipStyle = window.getComputedStyle(shipElement);
            let shipWidth = parseFloat(shipStyle.width);
            let shipHeight = parseFloat(shipStyle.height);

            while (!droppable) {
                let x = Math.floor(Math.random() * size); // Randomly pick x coordinate (between 0 and size)
                let y = Math.floor(Math.random() * size); // Randomly pick y coordinate (between 0 and size)

                // Horizontal
                if (shipWidth > shipHeight) {
                    // Check boundaries
                    if (x <= size - ships[shipElement.id]) {
                        droppable = true;

                        // Check collision
                        for (let z = x; z < x + ships[shipElement.id]; z++) {
                            if (player.gameboardElement[y][z].classList.length == 4) {
                                droppable = false;
                            }
                        }

                        if (droppable) {
                            // Add ship classes to board spaces
                            for (let z = x; z < x + ships[shipElement.id]; z++) {
                                player.gameboardElement[y][z].classList.add(shipElement.id);
                            }
                        }
                    }
                }
                // Vertical
                else {
                    // Check boundaries
                    if (y <= size - ships[shipElement.id]) {
                        droppable = true;
    
                        // Check collision
                        for (let z = y; z < y + ships[shipElement.id]; z++) {
                            if (player.gameboardElement[z][x].classList.length == 4) {
                                droppable = false;
                            }
                        }

                        if (droppable) {
                            // Add ship classes to board spaces
                            for (let z = y; z < y + ships[shipElement.id]; z++) {
                                player.gameboardElement[z][x].classList.add(shipElement.id);
                            }
                        }
                    }
                }

                // Add Ship
                if (droppable) {
                    shipElement.classList.remove('inventory-ship');
                    shipElement.classList.add('board-ship-select');
                    player.gameboardElement[y][x].append(shipElement);
                }
            }
        });

        // Game Ready
        if (gameReady == false) {
            let startGameBtn = document.getElementById('start-game-button');
            startGameBtn.id = 'start-game-ready-button';

            startGameBtn.addEventListener('click', () => {
                startGame();
            });

            gameReady = true;
        }
    }

    // Start Game
    function startGame() {
        // Clone board and child elements to remove EventListeners
        let boardContainer = document.querySelector('.board-container');
        let playerBoard = document.getElementById('player-board');
        let cloneBoard = playerBoard.cloneNode(true);
        playerBoard.remove();
        boardContainer.append(cloneBoard);
        assignBoard(player);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let space = player.gameboardElement[y][x];
                space.classList.remove('board-space-setup');

                if (space.firstElementChild) {
                    let shipElement = space.firstElementChild;
                    let shipStyle = window.getComputedStyle(shipElement);
                    let shipWidth = parseFloat(shipStyle.width);
                    let shipHeight = parseFloat(shipStyle.height);
                    let direction = (shipWidth > shipHeight) ? 'right' : 'down';

                    // Remove draggable
                    shipElement.removeAttribute('draggable');
                    shipElement.style.removeProperty('cursor');

                    player.gameboard.addShip(ships[shipElement.id], x, y, direction);

                    shipElement.remove();
                }
            }
        }

        let shipsContainer = document.getElementById('ships-container');
        let buttonsContainer = document.getElementById('buttons-container');

        shipsContainer.remove();
        buttonsContainer.remove();

        setupBoard(ai);
        addAiShips();
        assignBoard(ai);

        turn();
    }

    // Add AI Ships
    function addAiShips() {
        for (const ship in ships) {
            let droppable = false;
            let rotate = Math.floor(Math.random() * 2); // Randomly choose rotation
            let direction = rotate ? 'down' : 'right';

            while (!droppable) {
                let x = Math.floor(Math.random() * size); // Randomly pick x coordinate (between 0 and size)
                let y = Math.floor(Math.random() * size); // Randomly pick y coordinate (between 0 and size)

                if (ai.gameboard.addShip(ships[ship], x, y, direction) != false) {
                    droppable = true;
                };
            }
        }
    }
}

// Setup Board
function setupBoard(player) {
    let main = document.getElementById('main');
    let boardsContainer = document.getElementById('boards-container');

    const letters = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z'];
    const borderSize = 1;
    const borderColor = 'rgb(64, 64, 64)';
    const size = player.gameboard.size + 1;
    const boardSize = 480;
    const squareSize = boardSize / size;
    const units = 'px';

    let boardContainer = document.createElement('div');
    let boardHeader = document.createElement('div');
    let board = document.createElement('div');

    boardContainer.classList.add('board-container');
    boardHeader.classList.add('board-header');

    if (player.getType() == 'human') {
        boardHeader.innerHTML = 'Player 1';
        board.id = 'player-board';
    } else if (player.getType() == 'ai') {
        boardHeader.innerHTML = 'Player 2';
        board.id = 'ai-board';
    }
    board.classList.add('board');
    board.style.width = boardSize + units;
    board.style.height = boardSize + units;
    board.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';
    board.style.gridTemplateRows = 'repeat(' + size + ', 1fr)';

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let square = document.createElement('div');
            square.classList.add('square');
            square.style.width = squareSize - borderSize + units;
            square.style.height = squareSize - borderSize + units;
            square.style.borderTop = borderSize + units + ' solid ' + borderColor;
            square.style.borderLeft = borderSize + units + ' solid ' + borderColor;

            // If square in last column, set border right
            if (x == size - 1) {
                square.style.borderRight = borderSize + units + ' solid ' + borderColor;
            }
            // If square in last row, set border bottom
            if (y == size - 1) {
                square.style.borderBottom = borderSize + units + ' solid ' + borderColor;
            }

            // Column/Row Headers
            if (x == 0 || y == 0) { square.classList.add('column-row-header'); }
            else { square.classList.add('board-space'); }
            if (x != 0 && y == 0) { square.innerHTML = letters[x - 1]; }
            if (y != 0 && x == 0) { square.innerHTML = y; }

            board.append(square);
        }
    }

    boardContainer.append(boardHeader, board);
    boardsContainer.append(boardContainer);

    main.append(boardsContainer);
}

// Assign Board Elements
function assignBoard(target) {
    const board = new Array(target.gameboard.size);
    for (let i = 0; i < target.gameboard.size; i++) {
        board[i] = new Array(target.gameboard.size);
    }

    let boardElement;
    if (target.getType() == 'human') { boardElement = document.getElementById('player-board'); }
    else if (target.getType() == 'ai') { boardElement = document.getElementById('ai-board'); }
    let spaces = boardElement.querySelectorAll('.board-space');
    let i = 0;

    for (let y = 0; y < target.gameboard.size; y++) {
        for (let x = 0; x < target.gameboard.size; x++) {
            board[y][x] = spaces[i];
            i++;
        }
    }

    target.gameboardElement = board;
}

/* // Add ships to board elements
function addShips(target) {
    let ships = target.gameboard.ships;

    ships.forEach(ship => {
        // Add ship coordinates to board
        for (let i = 0; i < ship.length; i++) {
            let targetX = ship.coords[i].x;
            let targetY = ship.coords[i].y;

            target.gameboardElement[targetY][targetX].innerHTML = ship.id;
        }
    });
} */

// Enable Board Events
function enableBoardEvents(player, ai, endTurn) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            let space = ai.gameboardElement[y][x];

            if (!ai.gameboardElement[y][x].innerHTML) {
                space.addEventListener('mouseenter', () => {
                    space.classList.add('board-space-hover');
                    space.style.cursor = 'pointer';
                });
                space.addEventListener('mouseleave', () => {
                    space.classList.remove('board-space-hover');
                    space.style.cursor = 'default';
                });
                space.addEventListener('click', () => {
                    space.classList.remove('board-space-hover');
                    space.style.cursor = 'default';

                    // Clone board and remove event listeners
                    let aiBoard = document.getElementById('ai-board');
                    let clone = aiBoard.cloneNode(true);
                    aiBoard.parentNode.replaceChild(clone, aiBoard);
                    assignBoard(ai); // Re-assign board element

                    player.sendAttack(ai, x, y);
                    endTurn();
                });
            }
        }
    }
}

export { setupGame, enableBoardEvents };