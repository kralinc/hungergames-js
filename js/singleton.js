import Map from './map.js';

const EVENT_CHANCE = 0.06;

/*
    TODO: Land features that change what actions are possible in the area, as well as changing the graphics of the tile
*/

class Singleton {
    constructor(mapSize)
    {
        this.day = 1;
        this.numDistricts = 12;
        this.numTributes = this.numDistricts * 2;
        this.tributes = [];
        this.deadTributes = [];
        this.deadQueue = [];
        this.currentTribute = 0;
        this.map = new Map(mapSize);
        this.phase = "cornucopia"; //day, night, events
    }

    runDay()
    {
        do
        {
            this.stepDay();
        }while (this.currentTribute > 0);
    }

    stepDay()
    {
        if (this.tributes.length === 0)
        {
            console.error("No tributes");
        }
        else if (this.tributes.length === 1)
        {
            const lastTribute = this.tributes[0];
            $("#printout").prepend(`<p style='color:${lastTribute.color}'>
            ${lastTribute.name} of ${lastTribute.district} has won the hunger games!
            </p>`);
        }
        else
        {

            const response = this.tributes[this.currentTribute].act(this.phase);
            let boring = (response.boring) ? "boring" : "";
            const boringChecked = $("#boring-check").prop("checked");
            let hidden = (boringChecked && response.boring) ? "hidden" : "";
            $("#printout").prepend(`<p class='${boring} ${hidden}' style='color:${this.tributes[this.currentTribute].color}'>${response.action}</p>`);
            this.#processDeaths(this.deadQueue);
            this.currentTribute = (this.currentTribute >= this.tributes.length - 1) ? 0 : this.currentTribute + 1;

            if (this.currentTribute == 0)
            {
                $("#printout").prepend(`</br><p>==== ${this.phase} ${this.day} ====</p></br>`);
                if (this.phase == "night")
                {
                    this.day++;
                    this.phase = "day";
                }
                else
                {
                    this.phase = "night";
                }
            }
        }
    }

    putInDeathQueue(tribute)
    {
        this.deadQueue.push(tribute);
    }

    #processDeaths(deadTributes)
    {
        if (this.deadQueue.length <= 0)
        {
            return;
        }

        for (let tribute of deadTributes) {
            const deadIndex = this.tributes.indexOf(tribute);
            const dead = this.tributes.splice(deadIndex, 1)[0];

            $(`#trib-${dead.id}`).css("background-color", "white");
            $(`#trib-${dead.id}`).css("background-image", "url(http://cdn.onlinewebfonts.com/svg/img_493013.png)");
            $(`#trib-${dead.id}`).css("background-size", "cover");
            dead.getTile().tributes.splice(dead.getTile().tributes.indexOf(dead), 1);

            this.deadTributes.push(dead);
            $(`#trib-avatar-${dead.id}`).css("background-image", "url(http://cdn.onlinewebfonts.com/svg/img_493013.png)");

            if (this.currentTribute <= deadIndex && this.currentTribute != 0)
            {
                this.currentTribute--;
            }
        }
        this.deadQueue = [];
    }

    findTributeById(id, array)
    {
        for (let tribute of array)
        {
            if (tribute.id == id)
            {
                return tribute;
            }
        }

        return null;
    }
}

export default Singleton;