function run(){
    console.log("Clean Slate Running..");
    clickEditButtons();
    clickActionButtons();
    scrollToBottom();
    console.log("I'M TINY RICK");
}

function getYearFromEntry(entry) {
/*
    Return the year that the given activity log entry is from as a String.
    If the date cannot be found, then return an empty string.
    TODO: Find a more robust way to find the date of the log entry
*/
    // find the span in the log entry that should contain the date of the entry
    var dateSpan = entry.find("td > div > div > span");
    if (dateSpan.length == 0) {
        return "";
    }
    // see if the date is hyperlinked
    var dateLink = $(dateSpan[0]).find("a");
    if (dateLink.length == 0) {
        // some entry types, such as pokes, do not have a hyperlinked date
        return $(dateSpan[0]).text().split(" ")[2];
    } else {
        // other entry types do have hyperlinked dates, so get the date from the link text
        return $(dateLink[0]).text().split(" ")[2];
    }
}

function clickEditButtons(){
    /*
        Click the edit buttons so that the menuItems get loaded.
    */
    var clickCount = 0;
    var logEntries = $("table");
    for (var i = 0; i < logEntries.length; i++) {
        var currentEntry = $(logEntries[i]);
        var editButton = currentEntry.find("a[data-hover='tooltip'][data-tooltip-content='Edit'][rel='toggle']");
        if (editButton.length == 0) {
            continue;
        } else {
            var year = getYearFromEntry(currentEntry);
            editButton.click();
            clickCount++;
        }
    }
    console.log("Clicked " + clickCount + " edit buttons.");
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
