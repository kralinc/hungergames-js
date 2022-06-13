import {Pos, Util} from "./util.js";
import {Terrain, TerrainType, TerrainFeature} from "./terrain.js";

const DEFAULT_FOOD_STRENGTH = 35;
const DEFAULT_WATER_STRENGTH = 24;
const HUNGER_DEPLETION = 3;
const HUNGER_HEALTH_DEPLETION = 10;
const THIRST_DEPLETION = 6;
const THIRST_HEALTH_DEPLETION = 15;
const SLEEP_HEALTH_REGEN = 5;

const FORAGE_FIND_NOTHING_CHANCE = 0.1;
const MOVE_TRAP_CHANCE = 0.1;
const LAKE_POISON_CHANCE = 0.33;
const LAKE_MAX_POISON_DAMAGE = 20;
const LAKE_THIRST_REGEN = 30;

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
        this.daysSurvived = 0;
        this.kills = [];
        this.debuffs = [];
        this.inventory = {}
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
            this.health -= HUNGER_HEALTH_DEPLETION;
            if (this.health <= 0) {
                r.action = `${this.getNameHTML()} died of hunger.`;
                this.causeOfDeath = "Died of hunger.";
                this.singleton.putInDeathQueue(this);
                return r;
            }
        }

        if (this.thirst <= 0)
        {
            this.health -= THIRST_HEALTH_DEPLETION;
            if (this.health <= 0) {
                r.action = `${this.getNameHTML()} died of thirst.`;
                this.causeOfDeath = "Died of thirst.";
                this.singleton.putInDeathQueue(this);
                return r;
            }
        }

        //Moving is the default action
        //It is more likely to happen if they foraged and found nothing
        //    (not including at night, to not conflict with sleep)
        let moveWeight = 1 * ((this.previouslyFoundNothing && phase != "night") ? 10 : 1);

        //Recovering stats gets exponentially more likely the less of that stat they have
        let foodWeight = 1 * (10/(this.hunger - 5)) * (this.hunger <= 0 && this.hasItemOfType("food")) ? 25 : 1;
        let waterWeight = 1 * (10/(this.thirst - 5)) 
                            * (this.thirst <= 0 
                                && (this.hasItemOfType("water") || this.getTile().feature == TerrainFeature.LAKE))
                                ? 25 : 1;
        let medicineWeight = 1 * (10 / this.health);

        //Try desparately to get a weapon if unarmed
        let weaponWeight = 1.5 * (this.hasWeapon() ? 0.1 : 1);


        let fightWeight = 1 * (this.health / 100) //less likely to fight if injured
                            * ((this.getTile().tributes.length > 1) ? 1 : 0) //won't fight if there isn't anyone to fight
                            * ((this.hasWeapon()) ? 1 : 0.4) //much less likely to fight if unarmed
                            * ((this.singleton.tributes.length * 10 >= this.singleton.deadTributes.length) ? 5 : 1); //more likely to fight if one of the last 10%
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

        let actionTaken;

        if (actionToTake == "getfood")
        {
            actionTaken = this.#getFood();
        }
        else if (actionToTake == "getWater")
        {
            if (this.getTile().terrain.type == TerrainType.DESERT)
            {
                actionTaken = this.#move(r);
            }else {
                actionTaken = this.#getWater();
            }
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

        this.hunger = (this.hunger <= 0) ? 0 : this.hunger - HUNGER_DEPLETION;
        this.thirst = (this.thirst <= 0) ? 0 : this.thirst -THIRST_DEPLETION;

        r.action = actionTaken;
        this.daysSurvived = this.singleton.day;
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

        const mapItem = $(`#trib-tile-${this.id}`);
        $(`#trib-tile-${this.id}`).remove();
        $(`#tile-${this.position.x}-${this.position.y}-content`).append(mapItem);

        if (this.getTile().traps.length > 0 && Math.random() < MOVE_TRAP_CHANCE)
        {
            return this.#trap();
        }else {
            r.boring = true;
            return `${this.getNameHTML()} moved from ${this.position.x - moveX},${this.position.y-moveY} to ${this.position.x},${this.position.y}`;
        }
    }

    #getFood()
    {
        if (this.hasItemOfType("food"))
        {
            let eaten = this.inventory.food.pop();
            this.hunger += DEFAULT_FOOD_STRENGTH * eaten.strength;
            return `${this.getNameHTML()} ate ${eaten.name} from their inventory.`;
        }else {
            return this.#forage("food");
        }
    }

    #getWater()
    {
        if (this.hasItemOfType("water"))
        {
            let eaten = this.inventory.water.pop();
            this.thirst += DEFAULT_WATER_STRENGTH * eaten.strength;
            return `${this.getNameHTML()} drank ${eaten.name} from their inventory.`;
        }
        else if (this.getTile().terrain.feature == TerrainFeature.LAKE)
        {
            this.thirst += LAKE_THIRST_REGEN;
            let output = `${this.getNameHTML()} drank from a lake.`;
            let poisonRand = Math.random();
            if (poisonRand < LAKE_POISON_CHANCE) {
                output += ` The lake was poisoned!`;
                this.health -= LAKE_MAX_POISON_DAMAGE * Math.random();
                if (this.health <= 0) {
                    output += ` ${this.getNameHTML()} died!`;
                    this.causeOfDeath = "Drank from a poisoned lake.";
                    this.singleton.putInDeathQueue(this);
                }
            }

            return output;
        }
        else {
            return this.#forage("water");
        }
    }

    #getMedicine()
    {
        if (this.hasItemOfType("medicine"))
        {
            let taken = this.inventory.medicine.pop();
            this.health += taken.strength;
            return `${this.getNameHTML()} took ${taken.name} from their inventory.`;
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
            return `${this.getNameHTML()} foraged for ${target}, but found nothing.`;
        }
        else {
            let andbut = (itemForaged.type == target) ? "and" : "but";
            this.addToInventory(itemForaged);
            return `${this.getNameHTML()} foraged for ${target}, ${andbut} found ${itemForaged.name}`;
        }
    }

    addToInventory(item)
    {
        if (!this.inventory[item.type])
        {
            this.inventory[item.type] = [];
        }

        this.inventory[item.type].push(item);
        if (item.type == "weapon" && this.inventory[item.type].length > 1)
        {
            if (this.inventory[item.type][0].strength < this.inventory[item.type][1].strength)
            {
                this.inventory[item.type].shift();
                return true;
            }else {
                this.inventory[item.type].pop();
                return false;
            }
        }

        return true;
    }

    #fight(phase)
    {
        const opponent = this.targetRandomTributeInTile();
        let thisWinWeight = this.#drawWeapon(this);
        let opponentWinWeight = this.#drawWeapon(opponent);

        if (phase == "night" && opponent.sleeping && !this.getTile().terrain.feature == TerrainFeature.DENSE_TREES)
        {
            if (Math.random() < 0.5) {
                opponent.health -= 1000;
                opponent.causeOfDeath = `Snuck up on by ${this.name} (${this.district}) in their sleep`;
                this.kills.push(`${opponent.name} (${opponent.district})`);
                this.#lootOpponent(this, opponent);
                return `${this.getNameHTML()} murdered ${opponent.getNameHTML()} in their sleep!`;
            }else {
                return `${this.getNameHTML()} watches ${opponent.getNameHTML()} while they sleep`;
            }
        }
        //Sneak attack
        else if (this.getTile().terrain.feature == TerrainFeature.DENSE_TREES && opponent.weapon.name == "nothing" && this.weapon.name != "nothing") {
            let sneakAttackString = `${this.getNameHTML()} sneak-attacked ${opponent.getNameHTML()} with ${this.weapon.name}! ${opponent.getNameHTML()} was `;
            opponent.health -= Util.randInt(20 * this.weapon.strength, 100);
            if (opponent.health <= 0)
            {
                opponent.causeOfDeath = `Snuck up on by ${this.name} (${this.district})`;
                this.kills.push(`${opponent.name} (${opponent.district})`);
                sneakAttackString += "killed!";
                this.#lootOpponent(this, opponent);
                this.singleton.putInDeathQueue(opponent);
            }else if (opponent.health <= 10)
            {
                sneakAttackString += "gravely wounded.";
            }else
            {
                sneakAttackString += "injured";
            }
            return sneakAttackString;
        }
        else
        {

            const fightResult = Util.randomFromWeight([["this", thisWinWeight], ["opponent", opponentWinWeight]]);
            const winner = (fightResult == "this") ? this : opponent;
            const loser = (winner == this) ? opponent : this;

            let winnerMaxHealthLost = 10;
            if (loser.weapon.name != "nothing")
            {
                winnerMaxHealthLost += 8 * loser.weapon.strength;
            }

            let loserMinHealthLost = 50;
            if (winner.weapon.name != "nothing")
            {
                loserMinHealthLost += 20 * winner.weapon.strength;
            }

            loser.health -= Util.randInt(loserMinHealthLost, 100);
            winner.health -= Util.randInt(0, winnerMaxHealthLost);
            let thisWeaponText = (this.weapon == null) ? " unarmed," : ` armed with ${this.weapon.name},`;
            let opponentWeaponText = (opponent.weapon == null) ? " unarmed." : ` armed with ${opponent.weapon.name}. `;

            let output = `${this.getNameHTML()},${thisWeaponText} fought ${opponent.getNameHTML()},${opponentWeaponText}`;
            if (opponent.health <= 0)
            {
                opponent.causeOfDeath = `Killed by ${this.name} (${this.district}) with ${this.weapon.name}`;
                this.singleton.putInDeathQueue(opponent);
                output += `${opponent.getNameHTML()} ${Util.getFlavorText("diedInBattle")} `;
                this.kills.push(`${opponent.name} (${opponent.district})`);
                this.#lootOpponent(winner, loser);
            }else if (opponent.health <= 15)
            {
                output += `${this.name} gravely wounded ${opponent.name}. `;
            }

            if (this.health <= 0)
            {
                this.causeOfDeath = `Killed by ${opponent.getNameHTML()} (${opponent.district}) with ${opponent.weapon.name}`;
                this.singleton.putInDeathQueue(this);
                opponent.kills.push(`${this.getNameHTML()} (${this.district})`);
                output += `${this.getNameHTML()} ${Util.getFlavorText("diedInBattle")}`;
                this.#lootOpponent(winner, loser);
            }
            else if (this.health <= 15)
            {
                output += `${opponent.getNameHTML()} gravely wounded ${this.getNameHTML()}.`;
            }

            return output;
        }
    }

    #lootOpponent(looter, lootee) {
        for (let type in lootee.inventory) {
            for (let item of lootee.inventory[type]) {
                if (!looter.addToInventory(item)) {
                    looter.getTile().putItem(type, item);
                }
                //Remove from inventory
                lootee.inventory[type].splice(lootee.inventory[type].indexOf(item), 1);
            }
        }
    }

    #drawWeapon(tribute)
    {
        tribute.weapon = null;
        let weaponWeight = 1;

        if (tribute.hasItemOfType("weapon"))
        {
            tribute.weapon = tribute.inventory["weapon"][0];
        }else {
            tribute.weapon = {name: "nothing", strength: 0.1};
        }

        weaponWeight += 1 * tribute.weapon.strength;

        return weaponWeight;
    }

    #sleep()
    {
        this.sleeping = true;
        this.health += (this.health == 100) ? 0 : SLEEP_HEALTH_REGEN;
        return Util.getFlavorText("sleep", this.name);
    }

    #trap()
    {
        const trap = this.getTile().traps.pop();
        return trap.trigger(this);
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

    getNameHTML()
    {
        return `<span class='opens-stats id-a-${this.id}' style='color: ${this.color}'>${this.name}</span>`
    }
}

export default Tribute;