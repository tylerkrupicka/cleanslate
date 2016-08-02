// popup.js is executed when the user clicks on the enabled
// Clean Slate icon in the browser toolbar. This script is sandboxed
// such that it only runs within the popup HTML and NOT within the
// current Facebook tab. When the user clicks on the `clean` button
// in the popup, execute the script.js that will do the actual cleaning.
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("clean-button").addEventListener("click", function() {
        chrome.tabs.query({
            "active": true,
            "currentWindow": true
        }, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "jquery.js"});
            chrome.tabs.executeScript(tabs[0].id, {file: "script.js"});
        });
    });
});
