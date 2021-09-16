import RandomFromWeight from "./util.js";

class Item {
    Item(type, name, strength)
    {
        this.type = type;
        this.name = name;
        this.strength = strength;
    }
}

class ItemUtil {

    static getRandomItem()
    {
        const foodweight = 1.1;
        const waterweight = 1;
        const medicineweight = 0.1;
        const stabweight = 0.5;
        const slashweight = 0.85;
        const shootweight = 0.3;

        const itemType = RandomFromWeight([
            ["food", foodweight],
            ["water", waterweight],
            ["medicine", medicineweight],
            ["stab-weapon", stabweight],
            ["slash-weapon", slashweight],
            ["shoot-weapon", shootweight]
        ]);

        const itemSpec = this.getRandomWithinType(itemType);
        return new Item(itemType, itemSpec.name, itemSpec.strength)
    }

    static getRandomWithinType(type)
    {
        const itemList = this.ITEM_MASTERLIST[type];
        const index = Math.floor(Math.random() * itemList.length);
        return itemList[index];
    }

    static ITEM_MASTERLIST = {
        'food': [
            {name: 'berries', strength: 0.2},
            {name: 'avocado', strength: 1,}
        ],
        'water': [
            {name: 'water', strength: 1},
        ],
        'medicine': [
            {name: 'morphine', strength: 1},
        ],
        'stab-weapon': [
            {name: 'flint spear', strength: 1},
        ],
        'slash-weapon': [
            {name: 'gladius', strength: 1},
        ],
        'shoot-weapon': [
            {name: 'crossbow', strength: 1.1},
        ]
    };
}

export default {Item, ItemUtil};