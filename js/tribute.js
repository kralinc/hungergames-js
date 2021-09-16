import {Pos} from "./util.js";

class Tribute {
    constructor(name, district, color, personality, map)
    {
        this.name = name;
        this.district = district;
        this.color = color;
        this.personality = personality;
        this.map = map;
        this.health = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.debuffs = [];
        this.inventory = {
        }
        this.position = new Pos(this.map.getSize() / 2, this.map.getSize() / 2);

    }

    getTile()
    {
        return this.map.getTile(this.position.x, this.position.y);
    }

    act()
    {
        alert (`${this.name} from ${this.district} found a ${this.getTile().findRandomObject().name}`);
    }

    static getRandomName()
    {
        return "bram tam";
    }
}

export default Tribute;