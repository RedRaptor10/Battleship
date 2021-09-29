import { Game } from './game.js';

function initialize() {
    let container = document.getElementById('container');
    let header = document.createElement('div');
    let main = document.createElement('div');

    header.id = 'header';
    main.id = 'main';
    header.innerHTML = 'Battleship';

    container.innerHTML = '';
    container.append(header, main);

    const game = Game();
    game.newGame();
}

export { initialize };