import Map from './map.js';

class Singleton {
    constructor()
    {
        this.day = 0;
        this.numDistricts = 12;
        this.numTributes = this.numDistricts * 2;
        this.tributes = [];
    }
}

export default Singleton;