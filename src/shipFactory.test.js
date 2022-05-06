import { Ship } from './shipFactory.js';

test('Ship Factory Function', () => {
    expect(Ship(4)).toEqual(
        {
            length: 4,
            coords: [],
            hit: expect.any(Function),
            isSunk: expect.any(Function)
        }
    );
});

test('Ship hit() Function', () => {
    const s = Ship(4);
    s.coords.push({ x: 0, y: 1, hit: false });
    expect(s.coords[0].hit).toBe(false);
    s.hit(0, 1);
    expect(s.coords[0].hit).toBe(true);
});

test('Ship isSunk() Function', () => {
    const s = Ship(4);
    for (let i = 0; i < 4; i++) {
        s.coords.push({ x: i, y: 0, hit: false });
    }
    expect(s.isSunk()).toBe(false);
    s.hit(0, 0);
    s.hit(1, 0);
    s.hit(2, 0);
    expect(s.isSunk()).toBe(false);
    s.hit(3, 0);
    expect(s.isSunk()).toBe(true);
});