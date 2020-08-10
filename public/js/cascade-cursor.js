/* CASCADE PLUGINS ROUTINE */
if (typeof(CASCADE_PLUGINS) === "undefined") var CASCADE_PLUGINS = {};

/*****************************************************/
const PLUGIN_NAME = "cascade-cursor"
CASCADE_PLUGINS[PLUGIN_NAME] = {}
// "is plugin enabled ?" : you can edit this without breaking everything
CASCADE_PLUGINS[PLUGIN_NAME].enabled = true;

/*
    --- CASCADE PLUGINS ---

    cascade_cursor is a plugin for cascade.js
    it present itself as a component to perform test
    with css properties

    the most important function is 'perform', acting 
    like a 'middleware', when cascade.js build the new
    page, it calls every plugins it there are enabled 
    (cascade_cursor = true) and call their perform function

    every perform function return a string with css 
    properties within
*/
var CC_WINDOW;
var CC_VALUES = {
    CC_SELECTOR : undefined,
    CC_PROPERTIE : undefined,
    CC_VALUE : undefined,
    CC_UNIT : undefined
}
CASCADE_PLUGINS[PLUGIN_NAME].active = false;
var FREQ_LIMITED = false;

CASCADE_PLUGINS[PLUGIN_NAME].perform = function()
{
    if (CASCADE_PLUGINS[PLUGIN_NAME].active == false)
    {
        return "";
    }
    else
    {
        if(CC_VALUES["CC_SELECTOR"]!=undefined && CC_VALUES["CC_PROPERTIE"]!=undefined && CC_VALUES["CC_VALUE"]!=undefined && CC_VALUES["CC_UNIT"]!=undefined )
        {
            let css = `${CC_VALUES["CC_SELECTOR"]} { ${CC_VALUES["CC_PROPERTIE"]} : ${CC_VALUES["CC_VALUE"]}${CC_VALUES["CC_UNIT"]}; }`;
            return css;
        }
    }
}

let lastValue = new Date();
function windowValueChange (event)
{
    if ( (((new Date()) - lastValue) > 500) || !FREQ_LIMITED )
    {
        if ($(event.target).attr("name") !== null)
        {
            CC_VALUES[$(event.target).attr("name")] = $(event.target).val() ;
        }
        if ($(event.target).attr("name") == "CC_VALUE")
        {
            $("#CC_VALUE_DISPLAY").text(CC_VALUES["CC_VALUE"])
        }
        if(CC_VALUES["CC_SELECTOR"]!=undefined && CC_VALUES["CC_PROPERTIE"]!=undefined && CC_VALUES["CC_VALUE"]!=undefined && CC_VALUES["CC_UNIT"]!=undefined )
        {
            let css = `${CC_VALUES["CC_SELECTOR"]} { ${CC_VALUES["CC_PROPERTIE"]} : ${CC_VALUES["CC_VALUE"]}${CC_VALUES["CC_UNIT"]}; }`;
            $("#CC_CSS_DISPLAY").text(css)
        }
    }
}


function toggleUI()
{
    CC_WINDOW.toggle();
    CASCADE_PLUGINS[PLUGIN_NAME].active = !CASCADE_PLUGINS[PLUGIN_NAME].active;
}

/******************** ACTIVATION BUTTON ********************/

let CC_MAIN_BUTTON = {
    "text-decoration": "underline",
    "text-decoration-style": "dashed",
    "cursor": "pointer"
}
for (properties in CC_MAIN_BUTTON)
{
    $(".cascade-cursor-btn").css(properties, CC_MAIN_BUTTON[properties])
}
$(".cascade-cursor-btn").text("Cascade Cursor");
$(".cascade-cursor-btn").on('click', toggleUI)

/******************** MAIN WINDOW(UI) ********************/

$("body").append(`
    <div id="CC_DIV">
        <h3>Cascade Cursor Plugin</h3>
        <div style="display: flex; flex-direction: column;">
            <div style="margin-bottom: 1rem;">
                <input type="text" name="CC_SELECTOR" class="CC_INPUT" placeholder="Selecteur">
                <input type="text" name="CC_PROPERTIE" class="CC_INPUT" placeholder="Propriété">
                <select type="text" name="CC_UNIT" class="CC_INPUT">
                    <option value="px">Pixels</option>
                    <option value="%">%</option>
                    <option value="rem">REM</option>
                    <option value="em">EM</option>
                    <option value=" ">Aucune</option>
                </select>
            </div>
            <input type="range" name="CC_VALUE" class="CC_INPUT_NUMBER" min="0" max="1" value="0" step="0.01"/>0-1
            <input type="range" name="CC_VALUE" class="CC_INPUT_NUMBER" min="1" max="10" value="0" step="0.1"/>1-10
            <input type="range" name="CC_VALUE" class="CC_INPUT_NUMBER" min="10" max="100" value="0"/>10-100
            <div>Valeur : <span id="CC_VALUE_DISPLAY">0.00</span></div>
            <div>CSS : <span id="CC_CSS_DISPLAY">0.00</span></div>
        </div>
    </div>
`);

CC_WINDOW = $("#CC_DIV")

CC_WINDOW_PROPS = {
    "border-top": "solid 1rem dodgerblue",
    "padding": "1rem",
    "color": "#222",
    "background-color": "rgb(238, 238, 238)",
    "position":"fixed",
    "display":"none",
    "z-index": "1"
}

for (properties in CC_WINDOW_PROPS)
{
    CC_WINDOW.css(properties, CC_WINDOW_PROPS[properties]);
}

/********************* DRAG **************************/
let CC_WINDOW_DRAGGABLE = false;
var relativeX = 0;
var relativeY = 0;
function enableDrag(event)
{
    CC_WINDOW_DRAGGABLE = true;
    relativeX = event.pageX - $(event.target).position().left;
    relativeY = event.pageY - $(event.target).position().top;
}

function disableDrag()
{
    CC_WINDOW_DRAGGABLE = false;
}

function performDrag(event)
{
    if (CC_WINDOW_DRAGGABLE)
    {
        $(event.target).css("left", (event.pageX - relativeX))
        $(event.target).css("top",  (event.pageY - relativeY))
    }
}

CC_WINDOW.on('mousedown', enableDrag);
CC_WINDOW.on('mouseup', disableDrag);
CC_WINDOW.on('mousemove', performDrag)
$(".CC_INPUT").change(windowValueChange)
$(".CC_INPUT_NUMBER").on("mousemove", windowValueChange)