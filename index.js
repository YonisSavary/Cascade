/*
    Apply the default css code
*/

const DEFAULT_CSS = `:root
{
    font-size: 24px;
    font-family: "sans-serif";
}`
document.querySelector("#cssTextArea").value = DEFAULT_CSS;

/*
    Apply the default html code
*/

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
document.querySelector("#htmlTextArea").value = DEFAULT_HTML;

/*
 *   Iframe filling
*/


function build()
{
    console.log('build')
    // get html & css codes from mirrors objects
    let htmlCode = mirrors["htmlTextArea"].getValue();
    let cssCode = mirrors["cssTextArea"].getValue();

    // build the html code
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlCode, "text/html");
    doc.querySelector("#cascadeCss").innerHTML = cssCode;
    let sourceHtml = `<html>${doc.documentElement.innerHTML}</html>`

    // writing html code into the frame
    let iframeContainer = document.querySelector("#htmlIframeContainer");
    iframeContainer.contentWindow.document.open();
    iframeContainer.contentWindow.document.write(sourceHtml);
    iframeContainer.contentWindow.document.close();
}

$("#testOnceBtn").on('click', build);

var autoRunning = false;
let autoInterval = null;
$("#testAutoBtn").on('click', ()=>{
    console.log(!autoRunning)
    if (autoRunning)
    {

        $("#testAutoBtn").text("Tester Automatiquement");
        $("#testOnceBtn").show();
        clearInterval(autoInterval)
    }
    else
    {
        $("#testAutoBtn").text("Arrêter");
        $("#testOnceBtn").hide();
        autoInterval = setInterval(build, 2000)
    }
    autoRunning = !autoRunning
})

/*
    Apply the codemirror to both textarea editor
*/
var mirrors = {};
var inputs = {
    "htmlTextArea": "htmlmixed",
    "cssTextArea": "css"
}
let inputId = Object.keys(inputs);

for (keyId in inputId){
    mirrors[inputId[keyId]] = CodeMirror.fromTextArea(document.getElementById(inputId[keyId]), {
        extraKeys: {"Ctrl-Space": "autocomplete"},
        lineNumbers: true,
        theme: "rubyblue",
        mode: inputs[inputId[keyId]]
    });  
}


let iframeContainer = document.querySelector("#htmlIframeContainer");
iframeContainer.contentWindow.document.open();
iframeContainer.contentWindow.document.write("");
iframeContainer.contentWindow.document.close();