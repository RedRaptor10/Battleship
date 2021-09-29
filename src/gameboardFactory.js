import { Ship } from './shipFactory.js';

// Gameboard Factory Function
const Gameboard = () => {
    const size = 10;
    const board = new Array(size);
    for (let i = 0; i < size; i++) {
        board[i] = new Array(size);
    }
    const ships = [];
    const hit = [];
    const missed = [];

    const checkAdd = (length, x, y, direction) => {
        let d = 1;
        if (direction == 'left' || direction == 'up') { d = -1; }

        // Check boundaries (0 <= x < size) || (0 <= y < size) and if position is taken
        // Horizontal
        if (direction == 'left' || direction == 'right') {
            for (let i = 0; i < length; i++) {
                if (x + i * d < 0 || x + i + d >= size || typeof board[y][x + i * d] != 'undefined') {
                    return false;
                }
            }
        }
        // Vertical
        else if (direction == 'up' || direction == 'down') {
            for (let i = 0; i < length; i++) {
                if (y + i * d < 0 || y + i * d >= size || typeof board[y + i * d][x] != 'undefined') {
                    return false;
                }
            }
        }

        return true;
    };

    const addShip = (length, x, y, direction) => {
        // If cannot add ship, return
        if (!checkAdd(length, x, y, direction)) { return false; }

        let d = 1;
        if (direction == 'left' || direction == 'up') { d = -1; }

        // Create new Ship object
        const newShip = Ship(length);
        ships.push(newShip);
        const shipId = ships.indexOf(newShip);
        newShip.id = shipId;

        // Add Ship
        // Horizontal
        if (direction == 'left' || direction == 'right') {
            for (let i = 0; i < length; i++) {
                board[y][x + i * d] = shipId;
                newShip.coords.push({
                    x: x + i * d,
                    y: y,
                    hit: false
                });
            }
        }
        // Vertical
        else if (direction == 'up' || direction == 'down') {
            for (let i = 0; i < length; i++) {
                board[y + i * d][x] = shipId;
                newShip.coords.push({
                    x: x,
                    y: y + i * d,
                    hit: false
                });
            }
        }
    };

    const receiveAttack = (x, y) => {
        if (typeof board[y][x] != 'undefined') {
            let shipId = board[y][x];
            ships[shipId].hit(x, y);
            hit.push({
                x: x,
                y: y
            });
        } else {
            missed.push({
                x: x,
                y: y
            });
        }
    };

    const checkShips = () => {
        let allSunk = true;
        for (let i = 0; i < ships.length; i++) {
            if (!ships[i].isSunk()) {
                allSunk = false;
                break;
            }
        }
        return allSunk;
    };

    return { size, board, ships, hit, missed, checkAdd, addShip, receiveAttack, checkShips }
};

export { Gameboard };