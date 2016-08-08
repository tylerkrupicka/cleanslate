// popup.js is executed when the user clicks on the enabled
// Clean Slate icon in the browser toolbar. This script is sandboxed
// such that it only runs within the popup HTML and NOT within the
// current Facebook tab. When the user clicks on the `clean` button
// in the popup, execute the script.js that will do the actual cleaning.
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("clean-button").addEventListener("click", function() {
        var string = getCheckedString(); //make a string to pass to script
        console.log(string);
        chrome.tabs.query({
            "active": true,
            "currentWindow": true
        }, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "jquery.js"});
            chrome.tabs.executeScript(tabs[0].id, {
                code: string
            }, function() {
                chrome.tabs.executeScript(tabs[0].id, {
                    file: 'script.js'
                });
            });
        });
    });
});

function getCheckedString(){
    var like = document.getElementById("like").checked;
    var comment = document.getElementById("comment").checked;
    var post = document.getElementById("post").checked;
    var friends = document.getElementById("friends").checked;
    return "var like = " + like + "; var comment = " + comment + "; var post = " + post + "; var friends = " + friends + ";";
};
