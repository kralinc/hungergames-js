import Map from './map.js';

class Singleton {
    constructor(mapSize)
    {
        this.day = 1;
        this.numDistricts = 12;
        this.numTributes = this.numDistricts * 2;
        this.tributes = [];
        this.deadTributes = [];
        this.currentTribute = 0;
        this.map = new Map(mapSize);
    }

    runDay()
    {
        for (let i = this.currentTribute; i < this.tributes.length; i++)
        {
            this.stepDay();
        }
    }

    stepDay()
    {
        if (this.tributes.length === 0)
        {
            console.error("No tributes");
        }
        else if (this.tributes.length === 1)
        {
            alert (`${this.tributes[0].name} has won the hunger games!`);
        }
        else
        {
            const action = this.tributes[this.currentTribute].act();
            $("#printout").prepend(`<p color='${this.tributes[this.currentTribute].color}'>${action}</p>`);

            if (action.includes(this.tributes[this.currentTribute].name + " died")) {
                this.processDeath(this.currentTribute);
            }
            this.currentTribute = (this.currentTribute === this.tributes.length - 1) ? 0 : this.currentTribute + 1;
        }
    }

    processDeath(tributeIndex)
    {
        this.deadTributes.push(this.tributes.splice(tributeIndex, 1));
        this.currentTribute--;
    }
}

export default Singleton;