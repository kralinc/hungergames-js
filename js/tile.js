import {Item, ItemUtil} from "./object.js";

class Tile {
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.items = this.populateWithRandomItems();
        this.tributes = [];
    }

    populateWithRandomItems()
    {

    }

    findRandomObject()
    {
        const item = (this.items.length > 0) ? this.items.pop() : null;
        return item;
    }
}

export default Tile;