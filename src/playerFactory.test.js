import { Player } from './playerFactory.js';

test('Player Factory Function', () => {
    expect(Player('P1', 'Player')).toEqual(
        {
            name: 'P1',
            type: 'Player',
            gameboard: expect.any(Object),
            checkAttack: expect.any(Function),
            sendAttack: expect.any(Function)
        }
    );
});

test('Player checkAttack() Function', () => {
    const player = Player('Player', 'human');
    const ai = Player('AI', 'ai');
    ai.gameboard.hit.push({
        x: 1,
        y: 1
    });
    expect(player.checkAttack(ai, 0, 0)).toBe(true);
    expect(player.checkAttack(ai, -1, 0)).toBe(false); // Check boundaries
    expect(player.checkAttack(ai, 1, 1)).toBe(false); // Check hit or missed
});