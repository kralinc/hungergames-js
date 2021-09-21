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
        const slashweight = 0.1;
        const shootweight = 0.2;
        const shortWeight = 0.7;

        const itemType = Util.randomFromWeight([
            ["food", foodweight],
            ["water", waterweight],
            ["medicine", medicineweight],
            ["weapon-stab", stabweight],
            ["weapon-slash", slashweight],
            ["weapon-shoot", shootweight],
            ["weapon-short", shortWeight]
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
            {name: 'an avocado', strength: 1,},
            {name: 'a sandwich', strength: 1},
            {name: 'a hot pocket', strength: 0.7},
            {name: 'a tv dinner', strength: 2},
            {name: 'an apple', strength: 0.5},
            {name: 'yogurt', strength: 1},
            {name: 'trail mix', strength: 2},
        ],
        'water': [
            {name: 'water', strength: 2},
            {name: 'caprisun', strength: 0.8},
            {name: 'gatorade', strength: 1},
            {name: 'lemonade', strength: 1},
            {name: 'iced tea', strength: 2},
            {name: 'pond water', strength: 0.75},
            {name: 'pop', strength: 1},
            {name: 'monster energy', strength: 1.8},
        ],
        'medicine': [
            {name: 'morphine', strength: 1},
            {name: 'fentanyl', strength: 1},
            {name: 'bacitracin', strength: 1},
            {name: 'ibuprofen', strength: 1},
            {name: 'penecillin', strength: 1},
        ],
        'weapon-stab': [
            {name: 'flint spear', strength: 1},
            {name: 'gold spear', strength: 1},
            {name: 'shiv on a stick', strength: 1},
            {name: 'trident', strength: 2},
            {name: 'pike', strength: 1.4},
        ],
        'weapon-slash': [
            {name: 'gladius', strength: 1},
            {name: 'broadsword', strength: 1},
            {name: 'katana', strength: 1},
            {name: 'longsword', strength: 1},
            {name: 'sabre', strength: 1},
        ],
        'weapon-shoot': [
            {name: 'crossbow', strength: 1.1},
            {name: 'bow', strength: 1.1},
            {name: 'compound bow', strength: 1.1},
        ],
        'weapon-short': [
            {name: 'shiv', strength: 0.8},
            {name: 'hunting knife', strength: 1.5},
            {name: 'steak knife', strength: 0.5},
            {name: 'dagger', strength: 0.5},
        ]
    };
}

export {Item, ItemUtil};