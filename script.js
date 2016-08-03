console.log("Clean Slate Ready..");
var editButtons = $("a[data-hover='tooltip'][data-tooltip-content='Edit'][rel='toggle']");
for (var i = 0; i < editButtons.length; i++) {
    editButtons[i].click();
}
var buttons = $("a[role='menuitem']");
for (i = 0; i < buttons.length; i++) {
    var ajax = $(buttons[i]).attr("ajaxify");
    if (ajax && ajax.indexOf("comment") != -1) {
        console.log("comment");
        console.log(buttons[i]);
    } else if (ajax && ajax.indexOf("unlike") != -1) {
        console.log("like");
        console.log(buttons[i]);
        //buttons[i].click();
    } else {
        console.log("something else");
        console.log(buttons[i]);
    }
}
