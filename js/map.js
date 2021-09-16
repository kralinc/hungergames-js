import Tile from "./tile.js";

class Map {
    constructor(size)
    {
        this.size = size;
        this.map = [];

        for (let i = 0; i < size; i++)
        {
            this.map.push(new Tile(i % size, i / size));
        }
    }

    getSize()
    {
        return this.size;
    }

    getTile(x, y)
    {
        const index = y * this.size + x;
        return map[index];
    }
}

export default Map;