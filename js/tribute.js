import {Pos, Util} from "./util.js";

const DEFAULT_FOOD_STRENGTH = 20;
const HUNGER_DEPLETION = 2;
const THIRST_DEPLETION = 3;
const FORAGE_FIND_NOTHING_CHANCE = 0.33;
const SLEEP_HEALTH_REGEN = 5;

class Tribute {
    constructor(id, name, district, color, personality, map, singleton)
    {
        this.id = id;
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
        this.getTile().tributes.push(this);

        this.singleton = singleton;
    }

    getTile()
    {
        return this.map.getTile(this.position.x, this.position.y);
    }

    act(phase)
    {
        if (this.hunger <= 0)
        {
            this.singleton.putInDeathQueue(this);
            return `${this.name} died of hunger.`;
        }

        if (this.thirst <= 0)
        {
            this.singleton.putInDeathQueue(this);
            return `${this.name} died of thirst.`;
        }

        let moveWeight = 1;
        let foodWeight = 1 * (10/(this.hunger - 5));
        let waterWeight = 1 * (10/(this.thirst - 5));
        let fightWeight = 1 * (this.health / 100) * ((this.getTile().tributes.length > 1) ? 1 : 0);
        let sleepWeight = ((phase == "night") ? 1 : 0) * 1.5;

        let actionToTake = Util.randomFromWeight(
            [["move", moveWeight],
            ["getfood", foodWeight],
            ["getWater", waterWeight],
            ["fight", fightWeight],
            ["sleep", sleepWeight]]
        );

        // let actionToTake = Util.randomFromWeight(
        //     [[this.#move, moveWeight],
        //     [this.#getFood, foodWeight],
        //     [this.#getWater, waterWeight],
        //     [this.#fight, fightWeight],
        //     [this.#sleep, sleepWeight]]
        // );


        let actionTaken;

        // actionTaken = actionToTake(this);

        if (actionToTake == "getfood")
        {
            actionTaken = this.#getFood();
        }
        else if (actionToTake == "getWater")
        {
            actionTaken = this.#getWater();
        }
        else if (actionToTake == "fight")
        {
            actionTaken = this.#fight();
        }
        else if (actionToTake == "sleep")
        {
            actionTaken = this.#sleep();
        }
        else {
            actionTaken = this.#move();
        }

        this.hunger -= HUNGER_DEPLETION;
        this.thirst -= THIRST_DEPLETION;

        return actionTaken;
    }

    #move()
    {
        this.getTile().tributes.splice(this.getTile().tributes.indexOf(this), 1);
        const moveX = Util.randInt((this.position.x == 0) ? 1 : -1, (this.position.x == this.map.size - 1) ? -1 : 1);
        const moveY = Util.randInt((this.position.y == 0) ? 1 : -1, (this.position.y == this.map.size - 1) ? -1 : 1);
        this.position.x += moveX;
        this.position.y += moveY;
        this.getTile().tributes.push(this);

        const mapItem = $(`#trib-${this.id}`);
        $(`#trib-${this.id}`).remove();
        $(`#tile-${this.position.x}-${this.position.y}`).append(mapItem);

        return `${this.name} moved from ${this.position.x - moveX},${this.position.y-moveY} to ${this.position.x},${this.position.y}`;
    }

    #getFood()
    {
        if (this.hasItemOfType("food"))
        {
            let eaten = this.inventory.food.pop();
            this.hunger += DEFAULT_FOOD_STRENGTH * eaten.strength;
            return `${this.name} ate ${eaten.name} from their inventory.`;
        }else {
            return this.#forage("food");
        }
    }

    #getWater()
    {
        if (this.hasItemOfType("water"))
        {
            let eaten = this.inventory.water.pop();
            this.thirst += DEFAULT_FOOD_STRENGTH * eaten.strength;
            return `${this.name} drank ${eaten.name} from their inventory.`;
        }else {
            return this.#forage("water");
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

    #forage(target)
    {
        const itemForaged = this.getTile().findRandomObject();
        if (itemForaged == null || Math.random() < FORAGE_FIND_NOTHING_CHANCE)
        {
            return `${this.name} foraged for ${target}, but found nothing.`;
        }
        else {
            let andbut = (itemForaged.type == target) ? "and" : "but";
            this.addToInventory(itemForaged);
            return `${this.name} foraged for ${target}, ${andbut} found ${itemForaged.name}`;
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
        const opponent = this.targetRandomTributeInTile();
        let thisWinWeight = 1;
        let opponentWinWeight = 1;
        if (this.hasItemOfType("weapon-slash"))
        {
            thisWinWeight += 5;
            if (opponent.hasItemOfType("weapon-slash"))
            {
                opponentWinWeight += 5;
            }
        }

        const fightResult = Util.randomFromWeight([["this", thisWinWeight], ["opponent", opponentWinWeight]]);
        const winner = (fightResult == "this") ? this : opponent;
        const loser = (winner == "this") ? opponent : this;

        loser.health -= Util.randInt(50, 100);
        winner.health -= Util.randInt(0, 50);

        let output = `${this.name} fought ${opponent.name}, ${winner.name} bested ${loser.name}. `;
        if (opponent.health <= 0)
        {
            this.singleton.putInDeathQueue(opponent);
            output += `${opponent.name} died in battle. `;
        }

        if (this.health <= 0)
        {
            this.singleton.putInDeathQueue(opponent);
            output += `${this.name} died fighting.`;
        }

        return output;
    }

    #sleep()
    {
        this.health += (this.health == 100) ? 0 : SLEEP_HEALTH_REGEN;
        return `${this.name} rests for the night.`;
    }

    targetRandomTributeInTile()
    {
        const thisIndex = this.getTile().tributes.indexOf(this);
        let tributesExcludingSelf = [...this.getTile().tributes];
        tributesExcludingSelf.splice(thisIndex, 1);
        return tributesExcludingSelf[Util.randInt(0, tributesExcludingSelf.length - 1)];
    }

    static getRandomName()
    {
        // const FIRST = ["Ardis", "Java", "Jeff", "Mango", "Pango", "Ximing", "Vijiyalakshmi", "Zordon"];
        // const LAST = ["Poder", "Hodunk", "Wu", "Obama", "Wendy's", "Pango", "Mango", "Uwubert", "Telegram", "Xena", "Wobo", "Kork", "Metalhead", "Gaysex"];
        // const randFirst = FIRST[Math.floor(Math.random() * FIRST.length)];
        // const randLast = LAST[Math.floor(Math.random() * LAST.length)];
        // return randFirst + " " + randLast;

        const names = ["Charizard", "Liam", "Isaac", "Mr. Clean", "Grovyle", "Kass", "Sherb", 
                        "Mudkip", "Godzilla", "Amicus", "Teba", "Jeffery Brannon", "Hugo",
                        "Peanut", "Obama", "Raymond", "Fox", "Wolf", "Leroy", "Luke", "Elias",
                        "Caleb", "Mat", "Bushfries", "Xi Xiping", "Alphys", "Ralsei", "Asriel",
                        "Toby Fox", "Sans"];

        return names[Util.randInt(0, names.length - 1)];
    }
}

export default Tribute;