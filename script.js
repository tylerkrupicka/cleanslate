function run(){
    console.log("Clean Slate Running..");
    for(var i = 0; i < 15; i++){
        clickEditButton(); //click first edit button
        clickActionButton(); //click first action button
        scrollDown(); //start scroll before removing
        removeElement(); //remove from dom (don't reselect)
    }
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

function clickEditButton(){
    /*
        Click the first edit button so that the menuItems get loaded.
        Label the table we found so that we can edit it later.
    */
    var currentEntry = $($("table")[0]);
    var editButton = currentEntry.find("a[data-hover='tooltip'][data-tooltip-content='Edit'][rel='toggle']");
    if (editButton.length != 0) {
        var year = getYearFromEntry(currentEntry);
        editButton[0].click();
        currentEntry.attr("cleanslate", "true"); //apply label attribute
    }
    console.log("Found edit button from " + year);
}

function clickActionButton(){
    /*
        Click the menu buttons that will actually delete content.
    */
    var button = $("a[role='menuitem']")[0];
    var ajax = $(button).attr("ajaxify");
    if (ajax && ajax.indexOf("comment") != -1) {
        console.log("Uncomment.. ");
    } else if (ajax && ajax.indexOf("unlike") != -1) {
        console.log("Unlike.. ");
        //buttons[i].click();
    } else {
        console.log("Found something else.. ");
    }
}

function scrollDown(){
    /*
        Scroll down to the table about to be deleted to kick off loading more.
    */
    var currentEntry = $("table[cleanslate='true']");
    $('html,body').scrollTop($(currentEntry).offset().top);
}

function removeElement(){
    /*
        Remove the already parsed table from the DOM;
    */
    console.log("remove called");
    var currentEntry = $("table[cleanslate='true']");
    $(currentEntry).remove();
}

run();
