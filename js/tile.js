import {Item, ItemUtil} from "./object.js";
import {Util} from "./util.js";
import Trap from "./trap.js";

const MIN_RANDOM_ITEMS = 10;
const MAX_RANDOM_ITEMS = 20;
const MAX_RANDOM_TRAPS = 5;

class Tile {
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.items = this.populateWithRandomItems();
        this.traps = this.populateWithRandomTraps();
        this.tributes = [];
    }

    populateWithRandomItems()
    {
        const max = (this.x == 2 && this.y == 2) ? MAX_RANDOM_ITEMS * 3 : MAX_RANDOM_ITEMS;
        let itemList = [];
        const numRandomItems = Math.floor(Math.random() * (max-MIN_RANDOM_ITEMS) + 1) + MIN_RANDOM_ITEMS;
        for (let i = 0; i < numRandomItems; i++)
        {
            itemList.push(ItemUtil.getRandomItem());
        }

        return itemList;
    }

    populateWithRandomTraps()
    {
        const numTraps = Util.randInt(0, MAX_RANDOM_TRAPS);
        let trapsList = [];
        for (let i = 0; i < numTraps; i++)
        {
            trapsList.push(Trap.getRandomTrap());
        }
        return trapsList;
    }

    findRandomObject()
    {
        const item = (this.items.length > 0) ? this.items.pop() : null;
        return item;
    }

}

export default Tile;