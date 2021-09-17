import Map from './map.js';

class Singleton {
    constructor(mapSize)
    {
        this.day = 1;
        this.numDistricts = 12;
        this.numTributes = this.numDistricts * 2;
        this.tributes = [];
        this.currentTribute = 0;
        this.map = new Map(mapSize);
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
            this.tributes[(this.currentTribute === this.tributes.length) ? 0 : this.currentTribute++].act();
        }
    }
}

export default Singleton;