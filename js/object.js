import {Util} from "./util.js";

class Item {
    constructor(type, name, strength)
    {
        this.type = type;
        this.name = name;
        this.strength = strength;
    }
}

class ItemUtil {

    static getRandomItem()
    {
        const foodweight = 1.7;
        const waterweight = 1.3;
        const medicineweight = 0.1;
        const stabweight = 0.3;
        const slashweight = 0.85;
        const shootweight = 0.2;
        const shortWeight = 0.5;

        const itemType = Util.randomFromWeight([
            ["food", foodweight],
            ["water", waterweight],
            ["medicine", medicineweight],
            ["stab-weapon", stabweight],
            ["slash-weapon", slashweight],
            ["shoot-weapon", shootweight],
            ["short-weapon", shortWeight]
        ]);

        const itemSpec = this.getRandomWithinType(itemType);
        return new Item(itemType, itemSpec.name, itemSpec.strength)
    }

    static getRandomWithinType(type)
    {
        const itemList = ItemUtil.ITEM_MASTERLIST[type];
        const index = Math.floor(Math.random() * itemList.length);
        return itemList[index];
    }

    static ITEM_MASTERLIST = {
        'food': [
            {name: 'berries', strength: 0.2},
            {name: 'avocado', strength: 1,},
            {name: 'sandwich', strength: 1}
        ],
        'water': [
            {name: 'water', strength: 2},
            {name: 'Caprisun', strength: 0.8},
            {name: 'Gatorade', strength: 1.3}
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
        ],
        'short-weapon': [
            {name: 'shiv', strength: 0.5},
        ]
    };
}

export {Item, ItemUtil};