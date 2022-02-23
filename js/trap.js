import {Util} from "./util.js";

class Trap {

    constructor(name, strength) {
        this.name = name;
        this.strength = strength;
    }

    trigger(tribute) {
        const damage = Util.randInt(0, this.strength);

        if (damage == 0)
        {
            return `${tribute.name} dodged ${this.name} at ${tribute.position.x},${tribute.position.y}.`;
        }

        tribute.health -= damage;

        if (tribute.health <= 0)
        {
            tribute.causeOfDeath = "Killed by " + this.name;
            tribute.singleton.putInDeathQueue(tribute);
            return `${tribute.name} was killed by ${this.name} at ${tribute.position.x},${tribute.position.y}!`;
        }else if (tribute.health < 33)
        {
            return `${tribute.name} was seriously injured by ${this.name} at ${tribute.position.x},${tribute.position.y}.`;
        }
        else {
            return `${tribute.name} got caught in ${this.name} at ${tribute.position.x},${tribute.position.y}.`;
        }
    }

    static getRandomTrap() {
        const TRAPS = [
            [{name: "a bear trap", strength: 20}, 1],
            [{name: "a poison dart trap", strength: 100}, 0.5],
            [{name: "a landmine", strength: 200}, 0.33],
            [{name: "floor spikes", strength: 100}, 1],
            [{name: "a flamethrower", strength: 80}, 0.25],
            [{name: "a pitfall", strength: 50}, 0.75],
            [{name: "a sawblade", strength: 75}, 0.4],
        ];
        const trapSchematic = Util.randomFromWeight(TRAPS);
        return new Trap(trapSchematic.name, trapSchematic.strength);
    }
}

export default Trap;