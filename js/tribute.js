import Pos from "./util.js";

class Tribute {
    constructor(name, color, personality, map)
    {
        this.name = name;
        this.color = color;
        this.personality = personality;
        this.map = map;
        this.health = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.debuffs = [];
        this.inventory = {
            weapon: null,
            storage: null,
        }
        this.position = new Pos(this.map.getSize() / 2, this.map.getSize() / 2);

    }

    static getRandomName()
    {
        return "bram tam";
    }
}

export default Tribute;