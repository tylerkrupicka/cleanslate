function run(){
    console.log("Clean Slate Running..");
    clickEditButtons();
    clickActionButtons();
    scrollToBottom();
    console.log("I'M TINY RICK");
}

function clickEditButtons(){
    /*
        Click the edit buttons so that the menuItems get loaded.
    */
    var editButtons = $("a[data-hover='tooltip'][data-tooltip-content='Edit'][rel='toggle']");
    console.log("Clicking " + editButtons.length + " edit buttons.");
    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].click();
    }
}

function clickActionButtons(){
    /*
        Click the menu buttons that will actually delete content.
    */
    var buttons = $("a[role='menuitem']");
    for (i = 0; i < buttons.length; i++) {
        var ajax = $(buttons[i]).attr("ajaxify");
        if (ajax && ajax.indexOf("comment") != -1) {
            console.log("Found comment.. ");
        } else if (ajax && ajax.indexOf("unlike") != -1) {
            console.log("Found like.. ");
            //buttons[i].click();
        } else {
            console.log("Found something else.. ");
        }
    }
}

function scrollToBottom(){
    /* Scroll to the bottom of the page */
    $('html, body').scrollTop($(document).height());
}

run();
