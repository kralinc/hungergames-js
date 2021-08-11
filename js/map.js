import Tile from "./tile";

class Map {
    constructor(size)
    {
        this.size = size;
        this.map = [];

        for (let i = 0; i < size; i++)
        {
            map.push(new Tile(i % size, i / size));
        }
    }

    get(x, y)
    {
        const index = y * this.size + x;
        return map[index];
    }
}

export default Map;