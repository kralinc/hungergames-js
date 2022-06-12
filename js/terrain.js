import {Util} from "./util.js";

class Terrain {
    constructor(type, feature)
    {
        this.type = (type) ? type : Terrain.getRandomType();
        this.feature = (feature) ? feature : Terrain.getRandomFeature();
        if (this.type == TerrainType.DESERT)
        {
            this.feature = "";
        }
    }

    static getRandomType()
    {
        const types = [
            [TerrainType.PLAINS, 1],
            [TerrainType.DESERT, 0.5],
            [TerrainType.HILLS, 1]
        ];
        return Util.randomFromWeight(types);
    }

    static getRandomFeature()
    {
        const features = [
            ["", 1],
            [TerrainFeature.LAKE, 0.66],
            [TerrainFeature.SPARSE_TREES, 1],
            [TerrainFeature.DENSE_TREES, 0.75]
        ];
        return Util.randomFromWeight(features);
    }
}

class TerrainType {
    static PLAINS = "plains";
    static DESERT = "desert";
    static HILLS = "hills";
}

class TerrainFeature {
    static LAKE = "Lake in";
    static SPARSE_TREES = "Sparsely wooded";
    static DENSE_TREES = "Densely wooded";
    static CORNUCOPIA = "Cornucopia";
}

export {Terrain, TerrainType, TerrainFeature};