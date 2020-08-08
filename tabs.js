function handleTabLinkClick(e)
{
    e.preventDefault();
    let $targetId = e.target.getAttribute("href");
    let $target = $($targetId);
    $target.siblings().hide();
    $target.show();
}

$(".tab-link").on('click', handleTabLinkClick);
$("#htmlEditorLink").click();