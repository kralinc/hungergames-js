import Object from "./object";

class Tile {
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.objects = [];
        this.tributes = [];
    }



    findRandomObject()
    {
        const object = (this.objects.length > 0) ? this.objects.pop() : null;
        return object;
    }
}

export default Tile;