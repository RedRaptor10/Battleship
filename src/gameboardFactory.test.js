import { Gameboard } from './gameboardFactory.js';
import { Ship } from './shipFactory.js';

/* Gameboard */
test('Gameboard Factory Function', () => {
    expect(Gameboard()).toEqual(
        {
            size: expect.any(Number),
            board: expect.any(Array),
            ships: expect.any(Array),
            hit: expect.any(Array),
            missed: expect.any(Array),
            checkAdd: expect.any(Function),
            addShip: expect.any(Function),
            receiveAttack: expect.any(Function),
            checkShips: expect.any(Function)
        }
    );
});

test('Gameboard checkAdd() Function', () => {
    expect(Gameboard().checkAdd(4, 3, 2, 'right')).toBe(true);
    expect(Gameboard().checkAdd(4, 0, 9, 'down')).toBe(false);
    expect(Gameboard().checkAdd(4, 0, 0, 'left')).toBe(false);
    expect(Gameboard().checkAdd(4, 0, 0, 'up')).toBe(false);
});

test('Gameboard addShip() Function', () => {
    const b = Gameboard();
    b.addShip(4, 0, 0, 'right');
    b.addShip(4, 9, 0, 'right');
    b.addShip(2, 1, 0, 'down');
    expect(b.board[0][0]).toBe(0); // Check if ship added
    expect(b.board[0][9]).toBe(undefined); // Check boundaries
    expect(b.board[1][1]).toBe(undefined); // Check if position is taken
    expect(b.ships.length).toBe(1); // Check number of ships
    expect(b.ships[0].coords[1].x).toBe(1); // Check ship positions
});

test('Gameboard receiveAttack() Function', () => {
    const b = Gameboard();
    const s = Ship(4);
    b.ships.push(s);
    for (let i = 0; i < 4; i++) {
        b.board[0][i] = 0;
        s.coords.push({ x: i, y: 0, hit: false });
    }
    b.receiveAttack(1, 0);
    expect(b.ships[0].coords[1].hit).toBe(true);
});

test('Gameboard checkShips() Function', () => {
    const b = Gameboard();
    const s1 = Ship(4);
    const s2 = Ship(2);
    b.ships.push(s1);
    b.ships.push(s2);
    for (let i = 0; i < 4; i++) {
        s1.coords.push({ x: i, y: 0, hit: false });
    }
    for (let i = 1; i < 3; i++) {
        s2.coords.push({ x: 1, y: i, hit: false });
    }
    expect(b.checkShips()).toBe(false);
    for (let i = 0; i < 4; i++) {
        b.ships[0].coords[i].hit = true;
    }
    expect(b.checkShips()).toBe(false);
    for (let i = 0; i < 2; i++) {
        b.ships[1].coords[i].hit = true;
    }
    expect(b.checkShips()).toBe(true);
});