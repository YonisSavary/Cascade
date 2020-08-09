/*
    With this html model : 

    Menu
        LinkToTheTarget (with href = <id of target>)
        LinkToAnotherDiv
        LinkToAnotherDiv
        LinkToAnotherDiv

    Parent
        Sibling (with id)
        Target  (with id)
        Sibling (with id)
        Sibling (with id)

    this function show the target element and hide all
    of the siblings elements, so be careful while building
    the html structure
*/

$(".tabLink").on('click', (event)=>{
    event.preventDefault();
    let targetLink = event.target.getAttribute("href");
    let $target = $(targetLink);
    $target.siblings().hide();
    $target.show();
})
$("#htmlEditorLink").click()

$("#enableFullScreenMode").on('click', ()=>
{
    $(".fullscreen-only").show();
    $(".windowed-only").hide();

    $("#editorsDiv").show();
    $("#visualiserDiv").hide();
    $("#editorsDiv").removeClass('limited-50')
})

$("#disableFullScreenMode").on('click', ()=>
{
    $(".fullscreen-only").hide();
    $(".windowed-only").show();
    
    $("#editorsDiv").addClass('limited-50')
    $("#editorsDiv").show();
    $("#visualiserDiv").show();
});
$("#enableFullScreenMode").click();
