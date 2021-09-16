import Singleton from "./singleton.js";
import Tribute from "./tribute.js";

let SINGLETON;
let NUMDISTRICTS = 0;

$(() => {
    createDistricts(12);
});

function createDistricts(num)
{
    if (num === NUMDISTRICTS)
    {
        return;
    }else if (num < NUMDISTRICTS)
    {
        for (let i = num; i < NUMDISTRICTS; i++)
        {
            $("#dset-"+i).addClass("hidden");
        }
    }else {
        const currentDistricts = $(".district").length;
        if (num <= currentDistricts)
        {
            for (let i = NUMDISTRICTS; i < num; i++)
            {
                $("#dset-"+i).removeClass("hidden");
            }
        }else {
            for (let i = NUMDISTRICTS; i < currentDistricts; i++)
            {
                $("#dset-"+i).removeClass("hidden");
            }

            const setupContainer = $("#game-setup");

            for (let i = currentDistricts; i < num; i++)
            {
                const newDistrict = "<div id='dset-"+i+"' class='district col-12 col-lg-4'><input class='form-control' type='text' value='District " 
                                    + (i + 1)
                                    + "'/><div class='container'><div class='row'><div class='col-12'><input type='text' value='" 
                                    + Tribute.getRandomName() + "'></div><div class='col-12'><input type='text' value='" 
                                    + Tribute.getRandomName() + "'></div>   </div></div></div>";

                setupContainer.append(newDistrict);
            }
        }
    }

    NUMDISTRICTS = num;
}

function startGame()
{
    SINGLETON = new SINGLETON();
    const allTributes = compileTributes();
    $("game-setup").addClass("hidden");
}

function compileTributes()
{
    
}

$("#start-game").on('click', () => {
    startGame();
});

$("#num-districts").on('change', (e) => {
    console.log(e.target.value);
    createDistricts(parseInt(e.target.value));
});