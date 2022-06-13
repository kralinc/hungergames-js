import {Item, ItemUtil} from "./object.js";
import {Util} from "./util.js";
import Trap from "./trap.js";
import {Terrain, TerrainType, TerrainFeature} from "./terrain.js";

const MIN_RANDOM_ITEMS = 5;
const MIN_RANDOM_ITEMS_DESERT = 0;

const MAX_RANDOM_ITEMS = 20;
const MAX_RANDOM_ITEMS_CORNUCOPIA = 40;
const MAX_RANDOM_ITEMS_DESERT = 5;

const MAX_RANDOM_TRAPS = 5;

class Tile {
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.terrain = new Terrain();
        if (this.x == 2 && this.y == 2)
        {
            this.terrain.feature = TerrainFeature.CORNUCOPIA;
            this.terrain.type = TerrainType.PLAINS;
        }
        this.items = this.populateWithRandomItems();
        this.traps = (this.terrain.type == TerrainType.DESERT) ? [] : this.populateWithRandomTraps();
        this.tributes = [];
    }

    populateWithRandomItems()
    {
        let max = MAX_RANDOM_ITEMS;
        let min = MIN_RANDOM_ITEMS;
        if (this.terrain.feature == TerrainFeature.CORNUCOPIA) {
            max = MAX_RANDOM_ITEMS_CORNUCOPIA;
        }
        else if (this.terrain.type == TerrainType.DESERT)
        {
            min = MIN_RANDOM_ITEMS_DESERT;
            max = MAX_RANDOM_ITEMS_DESERT;
        }

        let itemList = [];
        const numRandomItems = Math.floor(Math.random() * (max-min) + 1) + min;
        for (let i = 0; i < numRandomItems; i++)
        {
            const item = ItemUtil.getRandomItem();
            if (!(this.terrain.type == TerrainType.DESERT && item.type == "water"))
            {
                itemList.push(item);
            }
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

    putItem(type, item)
    {
        if (!this.items[type]) {
            this.items[type] = [];
        }
        this.items[type].push(item);
    }

}

export default Tile;