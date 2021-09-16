function Pos(x, y)
{
    this.x = x;
    this.y = y;
}

//param: weights - 2D Array
function RandomFromWeight(weights)
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
                minItemIndex = weights[j];
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
    for (let item in weights)
    {
        sum += item[1];
    }
    //redo weights
    for (let item in weights)
    {
        item[1] = item[1] / sum;
    }

    const rand = Math.random();

    for (let item in weights)
    {
        if (item[1] > rand)
        {
            return item[0];
        }
    }
}

export default {Pos, RandomFromWeight};