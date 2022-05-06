import { initialize } from './initialize.js';
import { setupGame, enableBoardEvents } from './helpers.js';
import { Player } from './playerFactory.js';

const Game = () => {
    const player = Player('Player 1', 'human');
    const ai = Player('Player 2', 'ai');
    const delay = 500;
    let t = Math.floor(Math.random() * 2); // Randomly set current player (between 0 and 1)
    let gameOver = false;

    const newGame = () => {
        setupGame(player, ai, turn);
    };

    const turn = () => {
        let details = document.getElementById('details');
        let turn = t ? player : ai;

        details.innerHTML = 'Turn: ' + turn.getName();

        if (turn == player) {
            enableBoardEvents(player, ai, endTurn);
        } else if (turn == ai) {
            setTimeout(() => {
                ai.sendAttack(player);
                endTurn();
            }, delay);
        }
    };

    const endTurn = () => {
        setTimeout(() => {
            checkWin();

            if (!gameOver) {
                t = 1 - t; // Alternate player (between 0 and 1)
                turn();
            }
        }, delay);
    };

    const checkWin = () => {
        let details = document.getElementById('details');
        let players = [player, ai];
        let playerWin = true;
        let aiWin = true;

        players.forEach(p => {
            p.gameboard.ships.forEach(ship => {
                if (!ship.isSunk() && p == player) {
                    aiWin = false;
                } else if (!ship.isSunk() && p == ai) {
                    playerWin = false;
                }
            });
        });

        if (playerWin) {
            details.innerHTML = 'You Win!';
            gameOver = true;
        } else if (aiWin) {
            details.innerHTML = 'You Lose!';
            gameOver = true;
        }

        if (playerWin || aiWin) {
            let buttonsContainer = document.createElement('div');
            let playAgainBtn = document.createElement('div');

            buttonsContainer.id = 'buttons-container';
            playAgainBtn.classList.add('button');
            playAgainBtn.innerHTML = 'Play Again';

            playAgainBtn.addEventListener('click', () => {
                initialize();
            });

            buttonsContainer.append(playAgainBtn);
            main.append(buttonsContainer);
        }
    };

    return { player, ai, newGame, turn, endTurn, checkWin }
}

export { Game };