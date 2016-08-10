// popup.js is executed when the user clicks on the enabled
// Clean Slate icon in the browser toolbar. This script is sandboxed
// such that it only runs within the popup HTML and NOT within the
// current Facebook tab. When the user clicks on the `clean` button
// in the popup, execute the script.js that will do the actual cleaning.
document.addEventListener("DOMContentLoaded", function() {
    populateDropdowns();
    document.getElementById("clean-button").addEventListener("click", function() {
        var scriptOptions = getScriptOptions(); //get parameters to pass to script
        console.log(scriptOptions);
        if (!isAnyBoxChecked(scriptOptions)) {
            // Don't try to clean if there is nothing that the user wants to hide/remove
            showErrorMessage("You must check at least one option");
            return;
        }
        if (!isValidDateRange(scriptOptions)) {
            // DON'T try to clean since the date range is invalid/meaningless
            showErrorMessage("Invalid Date Range");
            return;
        }
        chrome.tabs.query({
            "active": true,
            "currentWindow": true
        }, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "jquery.js"});
            chrome.tabs.executeScript(tabs[0].id, {
                code: "var scriptOptions = " + JSON.stringify(scriptOptions)
            }, function() {
                chrome.tabs.executeScript(tabs[0].id, {
                    file: 'script.js'
                });
            });
        });
    });
});

function populateDropdowns() {
    /*
        Adds the month and year options to the dropdowns in the popup.
        Defaults the `from` options to the first year Facebook existed and
        defaults the `to` options to the current month and year.
    */
    // list of possible month values
    var monthOptions = [
        { display: "January", value: 0 },
        { display: "February", value: 1 },
        { display: "March", value: 2 },
        { display: "April", value: 3 },
        { display: "May", value: 4 },
        { display: "June", value: 5 },
        { display: "July", value: 6 },
        { display: "August", value: 7 },
        { display: "September", value: 8 },
        { display: "October", value: 9 },
        { display: "November", value: 10 },
        { display: "December", value: 11 }
    ];
    // get the month select elements
    var cleanFromMonthNode = document.getElementById("clean-from-month");
    var cleanToMonthNode = document.getElementById("clean-to-month");
    // add the month options to the dropdowns
    var currentMonth = new Date().getMonth();
    for (var i in monthOptions) {
        var fromOption = document.createElement("option");
        fromOption.setAttribute("value", monthOptions[i].value);
        fromOption.innerHTML = monthOptions[i].display;
        cleanFromMonthNode.appendChild(fromOption);
        var toOption = fromOption.cloneNode(true);
        if (monthOptions[i].value === currentMonth) {
            toOption.setAttribute("selected", "");
        }
        cleanToMonthNode.appendChild(toOption);
    }
    // get the year select elements
    var cleanFromYearNode = document.getElementById("clean-from-year");
    var cleanToYearNode = document.getElementById("clean-to-year");
    // add the year options to the dropdowns
    var currentYear = new Date().getFullYear();
    for (var year = 2004; year <= currentYear; year++) {
        var fromOption = document.createElement("option");
        fromOption.setAttribute("value", year);
        fromOption.innerHTML = year;
        cleanFromYearNode.appendChild(fromOption);
        var toOption = fromOption.cloneNode(true);
        if (year === currentYear) {
            toOption.setAttribute("selected", "");
        }
        cleanToYearNode.appendChild(toOption);
    }
}

function getScriptOptions() {
    /*
        Returns an object describing the options that the user provided in the popup form.
    */
    var cleanFromMonth = document.getElementById("clean-from-month").value;
    var cleanFromYear = document.getElementById("clean-from-year").value;
    var cleanToMonth = document.getElementById("clean-to-month").value;
    var cleanToYear = document.getElementById("clean-to-year").value;
    return {
        cleanFromDate : new Date(cleanFromYear, cleanFromMonth),
        cleanToDate   : new Date(cleanToYear, cleanToMonth),
        like: document.getElementById("like").checked,
        comment: document.getElementById("comment").checked,
        post: document.getElementById("post").checked,
        friends: document.getElementById("friends").checked
    }
}

function isValidDateRange(scriptOptions) {
    /*
        Returns true if the user provided a valid date range for cleaning.
        Currently only checks to see if the start is before the end date,
        but could be extended to check more rules in the future.
    */
    return scriptOptions.cleanFromDate <= scriptOptions.cleanToDate;
}

function isAnyBoxChecked(scriptOptions) {
    return scriptOptions.like || scriptOptions.comment || scriptOptions.post || scriptOptions.friends;
}

function showErrorMessage(msg) {
    /*
        Briefly show an invalid date range error message to the user if
        the error message isn't already being displayed.
    */
    if (!document.getElementById("error-message")) {
        var errorMessage = document.createElement("p");
        errorMessage.setAttribute("id", "error-message");
        errorMessage.innerHTML = msg;
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(errorMessage);
        setTimeout(function() {
            body.removeChild(errorMessage);
        }, 2000);
    }
}
