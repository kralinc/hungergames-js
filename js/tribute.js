import {Pos, Util} from "./util.js";

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
        if (this.hunger <= 0)
        {
            return `${this.name} died of hunger.`;
        }

        let moveWeight = 1;
        let foodWeight = 1 * (1+(this.hunger / 100));
        let fightWeight = 1 * (this.health / 100) * ((this.getTile().tributes.length > 1) ? 1 : 0);
        let actionToTake = Util.randomFromWeight(
            [["move", moveWeight],
            ["getfood", foodWeight],
            ["fight", fightWeight]]
        );


        let actionTaken;
        if (actionToTake == "getfood")
        {
            actionTaken = this.#getFood();
        }
        else if (actionToTake == "fight")
        {
            actionTaken = this.#fight();
        }
        else {
            actionTaken = this.#move();
        }

        this.hunger -= 5;
        this.thirst -= 5;

        return actionTaken;
    }

    #move()
    {
        const moveX = Util.randInt((this.position.x == 0) ? 1 : -1, (this.position.x == this.map.size - 1) ? -1 : 1);
        const moveY = Util.randInt((this.position.y == 0) ? 1 : -1, (this.position.y == this.map.size - 1) ? -1 : 1);
        this.position.x += moveX;
        this.position.y += moveY;
        return `${this.name} moved from ${this.position.x - moveX},${this.position.y-moveY} to ${this.position.x},${this.position.y}`;
    }

    #getFood()
    {
        if (this.hasItemOfType("food"))
        {
            let eaten = this.inventory.food.pop();
            this.hunger += 5 * eaten.strength;
            return `${this.name} ate ${eaten.name} from their inventory.`;
        }else {
            return this.#forage();
        }
    }

    hasItemOfType(type)
    {
        if(type in this.inventory){
            if (this.inventory[type].length > 0)
            {
                return true;
            }
        }
        return false;
    }

    #forage()
    {
        const itemForaged = this.getTile().findRandomObject();
        if (itemForaged == null)
        {
            return `${this.name} foraged for food, but found nothing.`;
        }
        else {
            let andbut = (itemForaged.type == "food") ? "and" : "but";
            this.addToInventory(itemForaged);
            return `${this.name} foraged for food, ${andbut} found ${itemForaged.name}`;
        }
    }

    addToInventory(item)
    {
        if (!this.inventory[item.type])
        {
            this.inventory[item.type] = [];
        }

        this.inventory[item.type].push(item);
    }

    #fight()
    {

    }

    static getRandomName()
    {
        const FIRST = ["Ardis", "Java", "Jeff", "Mango", "Pango", "Ximing", "Vijiyalakshmi", "Zordon"];
        const LAST = ["Poder", "Hodunk", "Wu", "Obama", "Wendy's", "Pango", "Mango", "Uwubert", "Telegram", "Xena", "Wobo", "Kork", "Metlhead", "Gaysex"];
        const randFirst = FIRST[Math.floor(Math.random() * FIRST.length)];
        const randLast = LAST[Math.floor(Math.random() * LAST.length)];
        return randFirst + " " + randLast;
    }
}

export default Tribute;