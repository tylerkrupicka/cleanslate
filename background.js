// background.js determines whether the Clean Slate
// icon should be enabled or disabled in the browser toolbar.
// The icon is currently enabled when viewing your Activity Log
// on Facebook.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // If the tabs url matches "http://www.facebook.com/*/allactivity*" or "https://www.facebook.com/*/allactivity*"
    var url = tab.url;
    var patt = new RegExp("^https?\:\/\/www\.facebook\.com\/.*\/allactivity");
    if (patt.test(url)) {
        // show the page action.
        chrome.pageAction.show(tab.id);
    } else {
        // otherwise hide the page action
        chrome.pageAction.hide(tab.id);
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
