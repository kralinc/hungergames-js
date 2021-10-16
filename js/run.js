import Singleton from "./singleton.js";
import Tribute from "./tribute.js";
import {Util} from "./util.js";

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
                                                    <input id='t-name-1-${i}' type='text' value='${Util.getRandomName()}'>
                                                    <input id='t-color-1-${i}' type='color' value='${Util.randomWebSafeColor()}'>
                                                </div>
                                                <div class='col-12'>
                                                    <input id='t-name-2-${i}' type='text' value='${Util.getRandomName()}'>
                                                    <input id='t-color-2-${i}' type='color' value='${Util.randomWebSafeColor()}'>
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
    createMap();
    const allTributes = compileTributes();
    SINGLETON.tributes = allTributes;
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
        const trib1Color = $("#t-color-1-" + i).val();
        const trib2Name = $("#t-name-2-" + i).val();
        const trib2Color = $("#t-color-2-" + i).val();

        $("#stats").append(`
                            <div class='col-12 col-lg-6'>
                                <div id='stats-row-${i}'class='row'>
                                    <div class='col-12 h3'>${districtName}</div>
                                </div>
                            </div>
        `);

        tributes.push(new Tribute(i * 2, trib1Name, districtName, trib1Color, "warm", SINGLETON.map, SINGLETON));
        let lastTribute = tributes[tributes.length - 1];
        //create tribute 1 piece on board
        $(`#tile-${lastTribute.position.x}-${lastTribute.position.y}`)
        .append(`<div 
                    id='trib-${lastTribute.id}'
                    class='tribute' 
                    style='background-color: ${lastTribute.color}'
                    data-bs-toggle='tooltip' data-bs-placement='top' 
                    title='${lastTribute.name}, ${lastTribute.district}'>`);
        
        $(`#stats-row-${i}`).append(`
            <div class='col-6'>
                <div id='trib-avatar-${lastTribute.id}' class='avatar'>
                    <div class='layer' style='background-color: ${lastTribute.color}'></div>
                </div>
                <p>${lastTribute.name}</p>
            </div>
        `);


        tributes.push(new Tribute(i * 2 + 1, trib2Name, districtName, trib2Color, "warm", SINGLETON.map, SINGLETON));
        lastTribute = tributes[tributes.length - 1];
        //Create tribute 2 piece on board
        $(`#tile-${lastTribute.position.x}-${lastTribute.position.y}`)
        .append(`<div 
                    id='trib-${lastTribute.id}'
                    class='tribute' 
                    style='background-color: ${lastTribute.color}'
                    data-bs-toggle='tooltip' data-bs-placement='top' 
                    title='${lastTribute.name}, ${lastTribute.district}'>`);

        $(`#stats-row-${i}`).append(`
        <div class='col-6'>
            <div id='trib-avatar-${lastTribute.id}' class='avatar'>
                <div class='layer' style='background-color: ${lastTribute.color}'></div>
            </div>
            <p>${lastTribute.name}</p>
        </div>
        `);
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
            $(`#map-row-${i}`).append(`<div id='tile-${j}-${i}' class='tile'></div>`)
        }
    }
    // for (let i = 0; i < SINGLETON.map.size * SINGLETON.map.size; i++)
    // {
    //     const newRow = `<div class='tile'></div>`
    //     $("#map-container").append(newRow);
    // }
}

function putStatsInModal(t) {
    const tributeId = parseInt(t.id.split("-")[2]);
    const allTributes = [...SINGLETON.tributes].concat(SINGLETON.deadTributes);
    const tribute = SINGLETON.findTributeById(tributeId, allTributes);
    $("#statsModalTitle").html(`${tribute.name} (${tribute.district})`);
    $("#statsModalDaysSurvived").html(`Days survived: ${tribute.daysSurvived}`);
    $("#statsModalImg").html(t.outerHTML);
    $("#statsModalLocation").html("Location: " + tribute.position.x + ", " + tribute.position.y);
    $("#statsModalKills").html(`Kills: ${tribute.kills.length} - ${tribute.kills}`);
    $("#statsModalCauseOfDeath").html(`Cause of death: ${tribute.causeOfDeath}`);
    $("#statsModalInventory").html(`Inventory: ${JSON.stringify(tribute.inventory)}`);
}

function step()
{
    SINGLETON.stepDay();
}

function skip()
{
    SINGLETON.runDay();
}

$(document).ready(() => {
    $("[data-bs-toggle='tooltip']").tooltip();
})

$("#start-game").on('click', () => {
    startGame();
});

$("#step").on('click', () => {
    step();
});

$("#skip").on('click', () => {
    skip();
})

$("#num-districts").on('change', (e) => {
    console.log(e.target.value);
    createDistricts(parseInt(e.target.value));
});

$("#boring-check").on('change', (e) => {
    if (e.target.checked)
    {
        $(".boring").addClass("hidden");
    }else {
        $(".boring").removeClass("hidden");
    }
});

$("#stats").on('click', (e) => {
    const t = e.target;
    if (t.classList.contains("layer"))
    {
        putStatsInModal(t.parentNode);
        $("#statsModal").modal('show');
    }
});

$("button[data-dismiss='modal']").on('click', () => {
    $("#statsModal").modal('hide');
});