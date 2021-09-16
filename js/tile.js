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
        let itemList = [];
        const numRandomItems = Math.floor(Math.random() * (10-1) + 1) + 1;
        for (let i = 0; i < numRandomItems; i++)
        {
            itemList.push(ItemUtil.getRandomItem());
        }

        return itemList;
    }

    findRandomObject()
    {
        const item = (this.items.length > 0) ? this.items.pop() : null;
        return item;
    }
}

export default Tile;