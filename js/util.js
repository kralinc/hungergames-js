function Pos(x, y)
{
    this.x = x;
    this.y = y;
}

class Util {

    constructor(){}

    //param: weights - 2D Array
    static randomFromWeight(weights)
    {
        let sum = 0;
        //sort list
        for (let i = 0; i < weights.length - 1; i++)
        {
            let min = weights[i][1];
            let minItemIndex = i;
            for (let j = i+1; j < weights.length; j++)
            {
                if (weights[j][1] < min)
                {
                    min = weights[j][1];
                    minItemIndex = j;
                }
            }
            if (min != weights[i][1])
            {
                const temp = weights[i];
                weights[i] = weights[minItemIndex];
                weights[minItemIndex] = temp;

            }

        }

        //sum their weights
        for (let item of weights)
        {
            sum += item[1];
        }
        //redo weights
        for (let item of weights)
        {
            item[1] = 1 - (item[1] / sum);
        }

        const rand = Math.random();

        for (let item of weights)
        {
            if (item[1] < rand)
            {
                return item[0];
            }
        }

        return weights[weights.length - 1][0];
    }

    static randInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomWebSafeColor()
    {
        const colors = ["3", "6", "9", "C"];

        const char1 = colors[Util.randInt(0, colors.length - 1)];
        const char2 = colors[Util.randInt(0, colors.length - 1)];
        const char3 = colors[Util.randInt(0, colors.length - 1)];
        return "#" + char1 + char2 + char3;
    }
}

export {Pos, Util};