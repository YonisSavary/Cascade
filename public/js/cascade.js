/*****************************************************
	Apply the default css code
*****************************************************/

const DEFAULT_CSS = `:root
{
	font-size: 24px;
	font-family: "sans-serif";
}`
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
	<!-- NO NEED TO INCLUDE THE CSS - YOUR CSS WILL BE INCLUDED IN #cascadeCss -->
</body>
</html>`

$("#htmlEditor").val(DEFAULT_HTML);
$("#cssEditor").val(DEFAULT_CSS);

/*****************************************************
  User choice and UI
*****************************************************/
var buildIntervalObject = null;
$("#testIntervalSelect").on("change",(e)=>{
    let interval = $("#testIntervalSelect").val();
    if (interval == -1)
    {
        $("#manualBuildButton").show();
        clearInterval(buildIntervalObject);
    }
    else
    {
        $("#manualBuildButton").hide();
        clearInterval(buildIntervalObject);
        buildIntervalObject = setInterval(build, interval);
    }
})
$("#testIntervalSelect").val(-1);
$("#manualBuildButton").on('click', build);

/*****************************************************
  Iframe filling
*****************************************************/
var errorFound = false;
function build(verbose=true)
{
	errorFound = false;
	console.log('build...')
	// get html & css codes from mirrors objects
	let htmlCode = mirrors["htmlEditor"].getValue();
	let cssCode = mirrors["cssEditor"].getValue();

	// build the html code
	let parser = new DOMParser();
	// transform the html textarea value into a dom object
    let doc = parser.parseFromString(htmlCode, "text/html"); 
    if (doc.querySelector("#cascadeCss") !== null)
    {
		// insert the css textarea value into the new dom object
        doc.querySelector("#cascadeCss").innerHTML = cssCode;
    }
    else
    {
		// show warning if necessary
		errorFound = true;
        if (verbose) { $("#warningSpan").text(" - Balise style #cascadeCss non trouvée") }
    }
	let sourceHtml = `<html>${doc.documentElement.innerHTML}</html>`

	// writing html code into the iframe
	let iframeContainer = document.querySelector("#visualiserDiv");
	iframeContainer.contentWindow.document.open();
	iframeContainer.contentWindow.document.write(sourceHtml);
	iframeContainer.contentWindow.document.close();
	
    if((!errorFound) && verbose)
    {
        $("#warningSpan").text(" - Build Finis ! ")
    }
}

/*****************************************************
	Apply the codemirror to both textarea editor
*****************************************************/

// variable used to store the codemirror objects, only useful in 'build' function so far
var mirrors = {};  
var inputs = {
	/*
	idOfTextarea : codeMirror Mode 
	*/
	"htmlEditor": "htmlmixed",
	"cssEditor": "css"
}
let inputId = Object.keys(inputs);

for (keyId in inputId){
	mirrors[inputId[keyId]] = CodeMirror.fromTextArea(document.getElementById(inputId[keyId]), {
		extraKeys: {"Ctrl-Space": "autocomplete"},
		lineNumbers: true,
		theme: "cobalt",
		mode: inputs[inputId[keyId]],
		tabSize: 4
	});  
}

/*
	If we don't launch the build function, the iframe element its own parent code
	(index.html), didn't find the reason so we build the exemple code to show the 
	result
*/
build(false)