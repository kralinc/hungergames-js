String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\$\{p(\d)\}/g, function(match, id) {
        return args[id];
    });
};

const flavorTextSleep = [
    "${p0} rests for the night.",
    "${p0} make a bed from some leaves.",
    "${p0} cries themself to sleep.",
    "${p0} sleeps under the stars.",
    "${p0} dreams about home.",
    "${p0} curls up next to a bush.",
    "${p0} tries to keep watch, but drifts off.",
    "${p0} sleeps in a tree."
];

const flavorTexts = new Map();
flavorTexts.set("sleep", flavorTextSleep);

function Pos(x, y)
{
    this.x = x;
    this.y = y;
}

class Util {

    constructor(){}

    /**
     * @param: weights - 2D Array [value, weight]
    */
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
        for (let i = 0; i < weights.length; i++)
        {
            if (i > 0) {
                weights[i][1] = (weights[i][1] / sum) + weights[i - 1][1];
            }
            else {
                weights[i][1] = (weights[i][1] / sum);
            }
        }

        const rand = Math.random();

        for (let item of weights)
        {
            if (item[1] >= rand)
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
        return "#" + char1 + char1 + char2 + char2 + char3 + char3;
    }

    static getRandomName()
    {

        const firstNames = ["Lucas", "Liam", "William", "Elias", "Noah", "Hugo", "Oliver", 
        "Oscar", "Adam", "Matteo", "Walter", "Alexander", "Leo", "Nils", "Alfred", "Ludvig", 
        "Adrian", "Theo", "Leon", "Elliot", "Arvid", "Vincent", "Theodor", "Filip", "Axel", 
        "Harry", "Frans", "Charlie", "Mohamed", "Gabriel", "Isak", "August", "Loui", "Benjamin", 
        "Sam", "Josef", "Ebbe", "Melvin", "Love", "Olle", "Albin", "Henry", "Edvin", "Elton", "Emil", 
        "Malte", "Vidar", "Gustav", "Jack", "Frank", "Viggo", "Noelle", "Sixten", "Viktor", "Melker", 
        "Jacob", "Casper", "Erik", "Tage", "Aron", "Loke", "Otto", "Wilmer", "Colin", "Milo", "Sigge", 
        "Alvin", "Carl", "Milton", "Wilhelm", "Anton", "Ivar", "Kian", "Julian", "Max", "Elis", "Levi", 
        "Nicholas", "Elvin", "Felix", "Vilgot", "Ali", "Omar", "Hjalmar", "Ture", "Samuel", "David", 
        "Kevin", "Joel", "Vide", "Amir", "Ville", "Dante", "John", "Daniel", "Algot", "Folke", "Alve", 
        "Ibrahim", "Thor", "Elsa", "Alice", "Maja", "Agnes", "Lilly", "Olivia", "Julia", "Ebba",
        "Linnea", "Molly", "Ella", "Wilma", "Klara", "Stella", "Freja", "Alicia", "Alva", "Alma", 
        "Isabelle", "Ellen", "Saga", "Ellie", "Astrid", "Emma", "Nellie", "Emilia", "Vera", "Signe",
        "Elvira", "Nova", "Selma", "Ester", "Leah", "Felicia", "Sara", "Sofia", "Elise", "Ines",
        "Tyra", "Amanda", "Elin", "Ida", "Moa", "Meja", "Isabella", "Tuva", "Nora", "Siri", "Matilda", 
        "Sigrid", "Edith", "Lovisa", "Juni", "Liv", "Lova", "Hanna", "Tilde", "Iris", "Thea", "Emelie",
        "Melissa", "Cornelia", "Leia", "Ingrid", "Livia", "Jasmine", "Nathalie", "Greta", "Stina",
        "Joline", "Filippa", "Emmy", "Svea", "Märta", "Tilda", "Hilda", "Majken", "Celine",
        "Ellinor", "Lykke", "Novalie", "Linn", "Tindra", "My", "Mira", "Rut", "Ronja", "Hilma",
        "Lisa", "Maria", "Elina", "Lovis", "Minna", "Hedda", "Amelia", "Sally", "Nicole",
        "Victoria", "Luna", "Anna", "Elisa", "Kris", "Susie"];

        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 
        'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 
        'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 
        'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 
        'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson',
        'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 
        'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart',
        'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
        'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
        'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz',
        'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Wu', 'Yang', 
        'Kim', 'Nguyen', 'Lee', 'Park', 'Choi', 'Jung', 'Mohammed', 'Ahmed', 'Alfarsi'];

        return firstNames[Util.randInt(0, firstNames.length - 1)] + " " + lastNames[Util.randInt(0, lastNames.length - 1)];
    }

    static getFlavorText(type, p1, p2)
    {
        const texts = flavorTexts.get(type);
        return texts[Util.randInt(0,texts.length - 1)].format(p1, p2);
    }
}

export {Pos, Util};