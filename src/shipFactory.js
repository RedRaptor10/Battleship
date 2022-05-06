// Ship Factory Function
const Ship = length => {
    const id = null;
    const coords = [];
    const hit = (x, y) => {
        for (let i = 0; i < length; i++) {
            if (coords[i].x == x && coords[i].y == y) {
                coords[i].hit = true;
                break;
            }
        }
    };
    const isSunk = () => {
        let sunk = true;
        for (let i = 0; i < length; i++) {
            if (!coords[i].hit) {
                sunk = false;
                break;
            }
        }
        return sunk;
    };
    return { length, id, coords, hit, isSunk }
};

export { Ship };