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
        const foodweight = 1;
        const waterweight = 1;
        const medicineweight = 0.5;
        const weaponWeight = 1.5;

        const itemType = Util.randomFromWeight([
            ["food", foodweight],
            ["water", waterweight],
            ["medicine", medicineweight],
            ["weapon", weaponWeight],
        ]);

        const itemSpec = this.getRandomWithinType(itemType);
        return new Item(itemType, itemSpec.name, itemSpec.strength)
    }

    static getRandomWithinType(type)
    {
        const itemList = ItemUtil.ITEM_MASTERLIST[type];
        return Util.getRandom(itemList);
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
            {name: 'a poison potato', strength: 0.05},
            {name: 'gogurt', strength: 1.1},
            {name: 'soup', strength: 1},
            {name: 'a regular potato', strength: 0.5},
            {name: 'a potato with butter', strength: 2},
            {name: 'potato salad', strength: 1.7},
        ],
        'water': [
            {name: 'bottled water', strength: 3},
            {name: 'caprisun', strength: 0.8},
            {name: 'gatorade', strength: 1},
            {name: 'lemonade', strength: 1},
            {name: 'iced tea', strength: 2},
            {name: 'pond water', strength: 0.75},
            {name: 'pop', strength: 1},
            {name: 'monster energy', strength: 1.8},
            {name: 'vitamin water', strength: 1},
            {name: 'koolaid', strength: 1.2},
            {name: 'apple juice', strength: 1.5},
        ],
        'medicine': [
            {name: 'morphine', strength: 20}, 
            {name: 'fentanyl', strength: 35}, 
            {name: 'bacitracin', strength: 15},
            {name: 'ibuprofen', strength: 10},
            {name: 'penecillin', strength: 20},
        ],
        'weapon': [
            {name: 'flint spear', strength: 4},
            {name: 'gold spear', strength: 4.2},
            {name: 'shiv on a stick', strength: 1.9},
            {name: 'trident', strength: 5},
            {name: 'pike', strength: 4},
            {name: 'gladius', strength: 2.7},
            {name: 'a broadsword', strength: 3},
            {name: 'a katana', strength: 3.25},
            {name: 'a longsword', strength: 3},
            {name: 'a sabre', strength: 2.66}, 
            {name: 'a crossbow', strength: 6}, 
            {name: 'a bow', strength: 5.5}, 
            {name: 'a compound bow', strength: 6.25}, 
            {name: 'a shiv', strength: 0.5}, 
            {name: 'a hunting knife', strength: 1.25}, 
            {name: 'a steak knife', strength: 0.8}, 
            {name: 'a dagger', strength: 1}, 
            {name: 'a sharp stick', strength: 0.75}, 
            {name: 'a sharp rock', strength: 0.5},
            {name: 'a shotgun', strength: 10},
        ]
    };
}

export {Item, ItemUtil};