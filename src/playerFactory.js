import { Gameboard } from './gameboardFactory.js';

const Player = (name, type) => {
    const getName = () => { return name };
    const getType = () => { return type };
    const gameboard = Gameboard();
    const gameboardElement = [];
    const prev = {};

    const sendAttack = (target, targetX, targetY) => {
        let details = document.getElementById('details');
        const letters = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z'];

        // AI Attack
        if (type == 'ai') {
            let valid = false;
            let prevHit = false;
            let triedAll = false;
            let directions = {
                up : false,
                right : false,
                down : false,
                left : false
            };

            // Determine coordinates and check if valid (not hit or missed)
            while (!valid) {
                valid = true;

                // Check Previous Position
                if (!triedAll) {
                    for (let i = 0; i < target.gameboard.hit.length; i++) {
                        if (target.gameboard.hit[i].x == prev.x &&
                            target.gameboard.hit[i].y == prev.y) {
                                prevHit = true;
                        }
                    }
                }

                if (!prevHit) {
                    targetX = Math.floor(Math.random() * (target.gameboard.size - 1));
                    targetY = Math.floor(Math.random() * (target.gameboard.size - 1));
                }
                else {
                    // Pick Adjacent Position
                    let axis = Math.floor(Math.random() * 2);
                    let sign = Math.floor(Math.random() * 2);

                    // Change sign to positive or negative
                    sign = sign ? 1 : -1;

                    if (axis) {
                        targetX = prev.x + 1 * sign;
                        targetY = prev.y;
                    } else {
                        targetX = prev.x;
                        targetY = prev.y + 1 * sign;
                    }

                    // Check Boundaries
                    if (targetX < 0 || targetX > target.gameboard.size - 1 ||
                        targetY < 0 || targetY > target.gameboard.size - 1) {
                            valid = false;
                    }

                    // Add tried direction to avoid infinite loop
                    if (!axis && sign == -1) { directions['up'] == true; }
                    else if (axis && sign == 1) { directions['right'] = true; }
                    else if (!axis && sign == 1) { directions['down'] = true; }
                    else if (axis && sign == -1) { directions['left'] = true; }

                    // Check if all directions tried
                    triedAll = true;
                    for (const direction in directions) {
                        if (!directions[direction]) triedAll = false;
                    }
                    if (triedAll) prevHit = false;
                }

                // Check Hit Positions
                for (let i = 0; i < target.gameboard.hit.length; i++) {
                    if (target.gameboard.hit[i].x == targetX &&
                        target.gameboard.hit[i].y == targetY) {
                            valid = false;
                    }
                }

                // Check Missed Positions
                for (let i = 0; i < target.gameboard.missed.length; i++) {
                    if (target.gameboard.missed[i].x == targetX &&
                        target.gameboard.missed[i].y == targetY) {
                            valid = false;
                    }
                }
            }
        }

        // Send Attack
        target.gameboard.receiveAttack(targetX, targetY);

        // Update Details
        details.innerHTML = 'Attacking Target: ' + letters[targetX] + (targetY + 1) + '<br>';

        // Mark Board (O = Hit, X = Missed)
        if (typeof target.gameboard.board[targetY][targetX] != 'undefined') {
            target.gameboardElement[targetY][targetX].innerHTML = 'O';
            target.gameboardElement[targetY][targetX].classList.add('hit');
            details.innerHTML += 'Target Hit!';
        } else {
            target.gameboardElement[targetY][targetX].innerHTML = 'X';
            details.innerHTML += 'Target Missed';
        }

        // Set Previous Coordinate
        prev.x = targetX;
        prev.y = targetY;
    };

    return { getName, getType, gameboard, gameboardElement, sendAttack }
};

export { Player };