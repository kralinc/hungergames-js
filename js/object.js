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
        return Util.randomFromWeight(itemList);
    }

    static ITEM_MASTERLIST = {
        'food': [
            [{name: 'berries', strength: 0.2}, 1],
            [{name: 'an avocado', strength: 1,}, 1],
            [{name: 'a sandwich', strength: 1}, 1],
            [{name: 'a hot pocket', strength: 0.7}, 1],
            [{name: 'a tv dinner', strength: 2}, 1],
            [{name: 'an apple', strength: 0.5}, 1],
            [{name: 'yogurt', strength: 1}, 1],
            [{name: 'trail mix', strength: 2}, 1],
            [{name: 'a poison potato', strength: 0.05}, 1],
            [{name: 'gogurt', strength: 1.1}, 1],
            [{name: 'soup', strength: 1}, 1],
            [{name: 'a regular potato', strength: 0.5}, 1],
            [{name: 'a potato with butter', strength: 2}, 1],
            [{name: 'potato salad', strength: 1.7}, 1],
        ],
        'water': [
            [{name: 'bottled water', strength: 3}, 0.1],
            [{name: 'caprisun', strength: 0.8}, 0.4],
            [{name: 'gatorade', strength: 1}, 0.3],
            [{name: 'lemonade', strength: 1}, 0.2],
            [{name: 'iced tea', strength: 2}, 0.12],
            [{name: 'pond water', strength: 0.75}, 0.25],
            [{name: 'pop', strength: 1}, 0.23],
            [{name: 'monster energy', strength: 1.8}, 0.89],
            [{name: 'vitamin water', strength: 1}, 0.77],
            [{name: 'koolaid', strength: 1.2}, 0.55],
            [{name: 'apple juice', strength: 1.5}, 0.66],
        ],
        'medicine': [
            [{name: 'morphine', strength: 20}, 0.75],
            [{name: 'fentanyl', strength: 35}, 0.5],
            [{name: 'bacitracin', strength: 15}, 1],
            [{name: 'ibuprofen', strength: 10}, 1],
            [{name: 'penecillin', strength: 20}, 0.75],
        ],
        'weapon': [
            [{name: 'flint spear', strength: 4}, 1],
            [{name: 'gold spear', strength: 4.2}, 1],
            [{name: 'shiv on a stick', strength: 1.9}, 1],
            [{name: 'trident', strength: 5}, 0.5],
            [{name: 'pike', strength: 4}, 0.75],
            [{name: 'gladius', strength: 2.7}, 0.75],
            [{name: 'a broadsword', strength: 3}, 0.75],
            [{name: 'a katana', strength: 3.25}, 0.15],
            [{name: 'a longsword', strength: 3}, 0.75],
            [{name: 'a sabre', strength: 2.66}, 1],
            [{name: 'a crossbow', strength: 6}, 0.5],
            [{name: 'a bow', strength: 5.5}, 0.66],
            [{name: 'a compound bow', strength: 6.25}, 0.1],
            [{name: 'a shiv', strength: 0.5}, 1.2],
            [{name: 'a hunting knife', strength: 1.25}, 1.2],
            [{name: 'a steak knife', strength: 0.8}, 1.2],
            [{name: 'a dagger', strength: 1}, 1.2],
            [{name: 'a sharp stick', strength: 0.75}, 1.2],
            [{name: 'a sharp rock', strength: 0.5}, 1],
            [{name: 'a Browning Citori 725 Trap Max Black/Silver/Walnut 12 Gauge 2-3/4in Over Under Shotgun - 32in', strength: 10}, 0.05],
        ]
    };
}

export {Item, ItemUtil};