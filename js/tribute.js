import {Pos, Util} from "./util.js";

const DEFAULT_FOOD_STRENGTH = 35;
const HUNGER_DEPLETION = 2;
const THIRST_DEPLETION = 3;
const FORAGE_FIND_NOTHING_CHANCE = 0.1;
const MOVE_TRAP_CHANCE = 0.1;
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
        this.kills = [];
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
        let r = new Object();
        this.sleeping = false;
        r.boring = false;

        if (this.hunger <= 0)
        {
            this.singleton.putInDeathQueue(this);
            r.action = `${this.name} died of hunger.`;
            r.causeOfDeath = "Died of hunger.";
            return r;
        }

        if (this.thirst <= 0)
        {
            this.singleton.putInDeathQueue(this);
            r.action = `${this.name} died of thirst.`;
            r.causeOfDeath = "Died of thirst.";
            return r;
        }

        //Moving is the default action
        //It is more likely to happen if they foraged and found nothing
        //    (not including at night, to not conflict with sleep)
        let moveWeight = 1 * ((this.previouslyFoundNothing && phase != "night") ? 3 : 1);

        //Recovering stats gets exponentially more likely the less of that stat they have
        let foodWeight = 1 * (10/(this.hunger - 5));
        let waterWeight = 1 * (10/(this.thirst - 5));
        let medicineWeight = 1 * (10 / this.health);

        //Try desparately to get a weapon if unarmed
        let weaponWeight = 1.5 * (this.hasWeapon() ? 0.1 : 1);


        let fightWeight = 1 * (this.health / 100) //less likely to fight if injured
                            * ((this.getTile().tributes.length > 1) ? 1 : 0) //won't fight if there isn't anyone to fight
                            * ((this.hasWeapon()) ? 1 : 0.4) //much less likely to fight if unarmed
                            * ((this.singleton.tributes.length <= 5) ? 3 : 1); //more likely to fight if one of the last 5
        let sleepWeight = ((phase == "night") ? 1.5 : 0);

        let actionToTake = Util.randomFromWeight(
            [["move", moveWeight],
            ["getfood", foodWeight],
            ["getWater", waterWeight],
            ["getWeapon", weaponWeight],
            ["getMedicine", medicineWeight],
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
        else if (actionToTake == "getWeapon")
        {
            actionTaken = this.#forage("weapon");
        }
        else if (actionToTake == "getMedicine")
        {
            actionTaken = this.#getMedicine();
        }
        else if (actionToTake == "fight")
        {
            actionTaken = this.#fight(phase);
        }
        else if (actionToTake == "sleep")
        {
            actionTaken = this.#sleep();
            r.boring = true;
        }
        else {
            actionTaken = this.#move(r);
        }

        this.hunger -= HUNGER_DEPLETION;
        this.thirst -= THIRST_DEPLETION;

        r.action = actionTaken;
        return r;
    }

    #move(r)
    {
        this.previouslyFoundNothing = false;
        this.getTile().tributes.splice(this.getTile().tributes.indexOf(this), 1);
        const moveX = Util.randInt((this.position.x == 0) ? 1 : -1, (this.position.x == this.map.size - 1) ? -1 : 1);
        const moveY = Util.randInt((this.position.y == 0) ? 1 : -1, (this.position.y == this.map.size - 1) ? -1 : 1);
        this.position.x += moveX;
        this.position.y += moveY;
        this.getTile().tributes.push(this);

        const mapItem = $(`#trib-${this.id}`);
        $(`#trib-${this.id}`).remove();
        $(`#tile-${this.position.x}-${this.position.y}`).append(mapItem);

        if (Math.random() < MOVE_TRAP_CHANCE)
        {
            return this.#trap();
        }else {
            r.boring = true;
            return `${this.name} moved from ${this.position.x - moveX},${this.position.y-moveY} to ${this.position.x},${this.position.y}`;
        }
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

    #getMedicine()
    {
        if (this.hasItemOfType("medicine"))
        {
            let taken = this.inventory.medicine.pop();
            this.health += taken.strength;
            return `${this.name} took ${taken.name} from their inventory.`;
        }else {
            return this.#forage("medicine");
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
            this.previouslyFoundNothing = true;
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

    #fight(phase)
    {
        const opponent = this.targetRandomTributeInTile();
        let thisWinWeight = this.#drawWeapon(this);
        let opponentWinWeight = this.#drawWeapon(opponent);

        if (phase == "night" && opponent.sleeping)
        {
            
        }
        else
        {

        const fightResult = Util.randomFromWeight([["this", thisWinWeight], ["opponent", opponentWinWeight]]);
        const winner = (fightResult == "this") ? this : opponent;
        const loser = (winner == this) ? opponent : this;

        let winnerMaxHealthLost = 10;
        if (loser.weapon != null)
        {
            winnerMaxHealthLost += 20;
        }

        let loserMinHealthLost = 50;
        if (winner.weapon != null)
        {
            loserMinHealthLost += 25;
        }

        loser.health -= Util.randInt(50, 100);
        winner.health -= Util.randInt(0, winnerMaxHealthLost);
        let thisWeaponText = (this.weapon == null) ? " unarmed," : ` armed with ${this.weapon.name},`;
        let opponentWeaponText = (opponent.weapon == null) ? " unarmed." : ` armed with ${opponent.weapon.name}. `;

        let output = `${this.name},${thisWeaponText} fought ${opponent.name},${opponentWeaponText} `;
        if (opponent.health <= 0)
        {
            this.singleton.putInDeathQueue(opponent);
            output += `${opponent.name} died in battle. `;
        }else if (opponent.health <= 15)
        {
            output += `${this.name} gravely wounded ${opponent.name}. `;
        }

        if (this.health <= 0)
        {
            this.singleton.putInDeathQueue(this);
            output += `${this.name} died fighting.`;
        }
        else if (this.health <= 15)
        {
            output += `${opponent.name} gravely wounded ${this.name}.`;
        }

        return output;
        }
    }

    #drawWeapon(tribute)
    {
        tribute.weapon = null;
        let weaponWeight = 1;

        if (tribute.hasItemOfType("weapon"))
        {
            tribute.weapon = tribute.inventory["weapon"][0];
            weaponWeight += 1 * tribute.weapon.strength;
        }

        return weaponWeight;
    }

    #sleep()
    {
        this.sleeping = true;
        this.health += (this.health == 100) ? 0 : SLEEP_HEALTH_REGEN;
        return `${this.name} rests for the night.`;
    }

    #trap()
    {
        const TRAPS = [
            {name: "a bear trap", strength: 20},
            {name: "a poison dart trap", strength: 100},
            {name: "a landmine", strength: 200},
            {name: "floor spikes", strength: 100},
        ];

        const trap = TRAPS[Util.randInt(0, TRAPS.length - 1)];
        const damage = Util.randInt(0, trap.strength);

        if (damage == 0)
        {
            return `${this.name} dodged ${trap.name} at ${this.position.x},${this.position.y}.`;
        }

        this.health -= damage;

        if (this.health <= 0)
        {
            this.singleton.putInDeathQueue(this);
            return `${this.name} was killed by ${trap.name} at ${this.position.x},${this.position.y}!`;
        }else if (this.health < 33)
        {
            return `${this.name} was seriously injured by ${trap.name} at ${this.position.x},${this.position.y}.`;
        }
        else {
            return `${this.name} got caught in ${trap.name} at ${this.position.x},${this.position.y}.`;
        }
    }

    targetRandomTributeInTile()
    {
        const thisIndex = this.getTile().tributes.indexOf(this);
        let tributesExcludingSelf = [...this.getTile().tributes];
        tributesExcludingSelf.splice(thisIndex, 1);
        return tributesExcludingSelf[Util.randInt(0, tributesExcludingSelf.length - 1)];
    }

    hasWeapon()
    {
        return this.hasItemOfType("weapon");
    }
}

export default Tribute;