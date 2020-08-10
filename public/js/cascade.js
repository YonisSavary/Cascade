// ! CASCADE JS NEED JQUERY TO WORK !

/* GLOBAL VARIABLES */
var COMPONENTS = {};
/* CASCADE PLUGINS ROUTINE */
if (typeof(CASCADE_PLUGINS) === "undefined") var CASCADE_PLUGINS = {};

const DEFAULT_CSS = `:root
{
	font-size: 24px;
	font-family: "sans-serif";
}`;

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>New Document</title>
</head>
<body>
	<style id="cascadeCss"></style>
	<h1>Yay ! A new document !</h1>
	<!-- Some content here -->
</body>
</html>`;


/* GLOBAL VARIABLES FUNCTIONS */
/* 'COMPONENTS' GLOBAL VARIABLE CONTAIN ALL OF THE BUTTONS AND INTERFACES
 * ELEMENTS, SO WE EXECUTE ONLY ONE TIME ALL OF THE JQUERY SELECTION AND
 * STORE THEM IN 'COMPONENTS'
*/

function addComponentBySelector(name, selector)
{
    let obj = $(selector)
    if (obj != null) COMPONENTS[name] = $(selector);
    return COMPONENTS[name];
}

function addComponent(name, object)
{
    COMPONENTS[name] = object;
}

/* 
    IF ANOTHER SCRIPT REGISTER ITSELF AS A PLUGIN, THIS FUNCTION
    CALL ITS "perform" FUNCTION AND CONCAT ALL OF THE RESULTS
*/

function getPluginsContent(cssCode)
{
	let returnCss = ""
	for (pluginName in CASCADE_PLUGINS)
	{
		let plugins = CASCADE_PLUGINS[pluginName];
		if (plugins.enabled && plugins.active)
		{
			let newCss = (plugins.perform)(cssCode);
			returnCss += newCss;
		}
	}
	return returnCss;
}

/*****************************************************
  User choice and UI
*****************************************************/
var buildIntervalObject = null;
function initIntervalUI()
{
    COMPONENTS["intervalSelectInput"].on("change",(e)=>{
        let interval = COMPONENTS["intervalSelectInput"].val();
        if (interval == -1)
        {
            COMPONENTS["manualRefreshBtn"].show();
            clearInterval(buildIntervalObject);
        }
        else
        {
            COMPONENTS["manualRefreshBtn"].hide();
            clearInterval(buildIntervalObject);
            buildIntervalObject = setInterval(refresh, interval);
        }
    })
}


/*****************************************************
	Apply the codemirror to both textarea editor
*****************************************************/
// variable used to store the codemirror objects, only useful in build functions so far
var textAreas = [
	{
        componentName:"htmlMirror",
        textAreaId:"htmlEditor",
        mode:"htmlmixed",
    },
    {
        componentName:"cssMirror",
        textAreaId:"cssEditor",
        mode:"css",
    }
]

function createMirrors()
{
    for (index in textAreas)
    {
        let input = textAreas[index]
        let mirrorObj = CodeMirror.fromTextArea(document.getElementById(input.textAreaId), {
            lineNumbers: true,
            theme: "cobalt",
            mode: input.mode,
            tabSize: 2
        });
        addComponent(input.componentName, mirrorObj);
    }
}
/*********************** BUILD FUNCTIONS *************************/
var needBuild = true;
function forceNextRebuild() { needBuild = true; }

function buildHTML() 
{
    console.log("build...")
    needBuild = false;
    let htmlCode = COMPONENTS["htmlMirror"].getValue();

	let parser = new DOMParser();
    newDoc = parser.parseFromString(htmlCode, "text/html"); 

    let sourceHtml = `<html>${newDoc.documentElement.innerHTML}</html>`
	let iframeContainer = COMPONENTS["iframe"][0];
	iframeContainer.contentWindow.document.open();
	iframeContainer.contentWindow.document.write(sourceHtml);
	iframeContainer.contentWindow.document.close();
}

function refresh() 
{
    let forceChecked = COMPONENTS["forceInjectionCheckbox"].prop("checked");
    let rebuild = needBuild;
    if (rebuild) buildHTML();

    let cssCode = COMPONENTS["cssMirror"].getValue();
    cssCode += getPluginsContent();

    let iframeDoc = COMPONENTS["iframe"][0].contentWindow.document;
    if ( (iframeDoc.querySelector("#cascadeCSS") == null) && forceChecked)
    {
		let cssDiv = iframeDoc.createElement("style");
        cssDiv.setAttribute("id", "cascadeCss");
        cssDiv.innerHTML = cssCode;
		iframeDoc.querySelector("body").appendChild(cssDiv);
    }
    else if ( iframeDoc.querySelector("#cascadeCSS") != null )
    {
        iframeDoc.querySelector("#cascadeCss").innerHTML = cssCode;
    }
}

/* INIT */
addComponentBySelector("htmlTextArea", "#htmlEditor").val(DEFAULT_HTML);
addComponentBySelector("cssTextArea", "#cssEditor").val(DEFAULT_CSS);
addComponentBySelector("intervalSelectInput","#testIntervalSelect").val(-1);
addComponentBySelector("manualRefreshBtn","#manualBuildButton").on('click', refresh);
addComponentBySelector("forceInjectionCheckbox","#forceCssCheckBox").on("change", forceNextRebuild);
addComponentBySelector("iframe","#visualiserDiv");
createMirrors();
initIntervalUI();
// we change anything in the html, then we need to rebuild the page
// else, we just refresh the css
CodeMirror.on(COMPONENTS["htmlMirror"], "change", forceNextRebuild)
refresh()