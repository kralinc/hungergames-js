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
                const newDistrict = `<div id='dset-${i}' class='district col-12 col-lg-4'>
                                        <input id='d-name-${i}'class='form-control' type='text' value='District ${(i+1)}'/>
                                        <div class='container'>
                                            <div class='row'>
                                                <div class='col-12'>
                                                    <input id='t-name-1-${i}' type='text' value='${Tribute.getRandomName()}'>
                                                </div>
                                                <div class='col-12'>
                                                    <input id='t-name-2-${i}' type='text' value='${Tribute.getRandomName()}'>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;

                setupContainer.append(newDistrict);
            }
        }
    }

    NUMDISTRICTS = num;
}

function startGame()
{
    SINGLETON = new Singleton(4);
    const allTributes = compileTributes();
    SINGLETON.tributes = allTributes;
    createMap();
    $("#game-setup").addClass("hidden");
    $("#game-container").removeClass("hidden");
}

function compileTributes()
{
    $(".district.hidden").remove();
    const districtList = $(".district");
    let tributes = [];
    for (let i = 0; i < districtList.length; i++)
    {
        const districtName = $("#d-name-" + i).val();
        const trib1Name = $("#t-name-1-" + i).val();
        const trib2Name = $("#t-name-2-" + i).val();
        tributes.push(new Tribute(trib1Name, districtName, 0xF00, "warm", SINGLETON.map));
        tributes.push(new Tribute(trib2Name, districtName, 0xF00, "warm", SINGLETON.map));
    }

    return tributes;
}

function createMap()
{
    for (let i = 0; i < SINGLETON.map.size; i++)
    {
        $("#map-container").append(`<div id='map-row-${i}' class='row'></div>`);
        for (let j = 0; j < SINGLETON.map.size; j++)
        {
            $(`#map-row-${i}`).append(`<div class='tile'></div>`)
        }
    }
    // for (let i = 0; i < SINGLETON.map.size * SINGLETON.map.size; i++)
    // {
    //     const newRow = `<div class='tile'></div>`
    //     $("#map-container").append(newRow);
    // }
}

function step()
{
    SINGLETON.stepDay();
}

$("#start-game").on('click', () => {
    startGame();
});

$("#step").on('click', () => {
    step();
});

$("#num-districts").on('change', (e) => {
    console.log(e.target.value);
    createDistricts(parseInt(e.target.value));
});