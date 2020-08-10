function displayToolTip(event)
{
    let eventTarget = event.target;
    let toolTipTarget = $($(eventTarget).attr("href"));
    toolTipTarget.show();
}

function hideToolTip(event)
{
    let eventTarget = event.target;
    let toolTipTarget = $($(eventTarget).attr("href"));
    toolTipTarget.hide();
}

function moveToolTip(event)
{
    let eventTarget = event.target;
    let toolTipTarget = $($(eventTarget).attr("href"));
    toolTipTarget.css("top", event.pageY + 10);
    toolTipTarget.css("left", event.pageX + 10);
}


$(".toolTipsBtn").each( function(element) 
{
    element = $(this)
    let fs = element.css("font-size");
    let prop = {
        "padding":      `calc(0.5*${fs})`,
        "margin":       `calc(0.5*${fs})`,
        "border-radius":`calc(2.0*${fs})`,
        "width":        `calc(0.5*${fs})`,
        "height":       `calc(0.5*${fs})`,
    }
    for (key in prop)
    {
        element.css(key, prop[key])
    }
})

const COMMON_PROP_BTN = {
    "display":"flex",
    "align-items":"center",
    "justify-content": "center",
    "background-color":"transparent",
    "color": "#rgb(238, 238, 238)",
    "cursor": "pointer",
    "border": "rgb(238, 238, 238) 2px solid"
}
for (prop in COMMON_PROP_BTN)
{
    $(".toolTipsBtn").css(prop, COMMON_PROP_BTN[prop])
}
$(".toolTipsBtn").text("?");
$(".toolTipsBtn").hover(displayToolTip, hideToolTip);
$(".toolTipsBtn").on("mousemove", moveToolTip)


const COMMON_PROP_TOOLTIP = {
    "padding": "1rem",
    "color": "#222",
    "background-color": "rgb(238, 238, 238)",
    "position":"fixed",
    "display":"none",
    "z-index": "1"
}
for (prop in COMMON_PROP_TOOLTIP)
{
    $(".toolTipsContent").css(prop, COMMON_PROP_TOOLTIP[prop])
}