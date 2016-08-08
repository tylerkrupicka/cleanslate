/*

Summary of relevant Activity Log DOM Structure

.fbTimelineLogBody
  #year_2016 (Container for one year)
    ...
      .fbTimelineSection (Container for one month)
        .async_saving (This class name is only present when the section hasn't loaded yet)
          ...
            .fbTimelineLogStream
              div
                div
                  div (Container for one post)
                    ...
                      a (Edit Button)
                .uiMorePager (Present if not all posts for this month may have been loaded)

...
a (Action Button)

*/

// possible states
var Status = {
    CLEANING: 0, // scrub a lubba dub dubbing
    WAIT_FOR_MORE_POSTS: 1, // waiting for more posts to load for this month
    WAIT_FOR_NEXT_MONTH: 2, // waiting for the next month to load
    DONE: 3 // we've gone through the whole activity log
}

// variables to keep track of which post we are on and what we're currently doing
var currentYear, currentMonth, currentPost, currentStatus;

function run(){
    /*
        Initializes the state variables and kicks off the cleaning.
    */
    console.log("Clean Slate Running..");

    // initialize status variables
    resetState();

    doNextAction();
    console.log("I'M TINY RICK");
}

function resetState() {
    /*
        Set the currentYear to the first year of activity present, set the
        currentMonth to the first month of the currentYear, set the currentPost
        to the first post of the currentMonth, and set the currentStatus to
        Status.CLEANING.
    */
    currentYear = null;
    currentMonth = null;
    currentPost = null;
    currentStatus = Status.CLEANING;

    setNextYear();
    setNextMonth();
    setNextPost();
}

function setNextYear() {
    /*
        Sets the global `currentYear` variable to the DOM element representing
        the next year of activity.
        If `currentYear` is null, then the variable is set to the first year of activity.
        If `currentYear` is currently the final year, then set `currentStatus`
        to Status.DONE since we have scrubbed the entire Activity Log at this point.
    */
    if (currentStatus === Status.DONE) {
        return;
    }
    if (!currentYear) {
        // look for the first year of activity
        var yearDivs = $('.fbTimelineLogBody > div');
        if (yearDivs.length) {
            // set the first year of activity
            currentYear = $(yearDivs[0]);
            return;
        } else {
            // could not find any years of activity, so stop cleaning
            currentStatus = Status.DONE;
            return;
        }
    }
    var nextYear = currentYear.next();
    if (nextYear.length) {
        // set currentYear to the next year of activity
        currentYear = $(nextYear[0]);
    } else {
        // there is no next year so we're done cleaning
        currentStatus = Status.DONE;
    }
}

function setNextMonth() {
    /*
        Sets the global `currentMonth` variable to the DOM element representing
        the next month of activity.
        If `currentMonth` is null, then the variable is set to the first month
        of activity for the current year.
        If `currentMonth` is the final month for the current year, then
        `currentYear` will be set to the next year, and `currentMonth` will be
        set to the first month of that year.
    */
    if (currentStatus === Status.DONE) {
        return;
    }
    if (!currentMonth) {
        // look for first month of the current year
        var monthDivs = currentYear.find('.fbTimelineSection');
        if (monthDivs.length) {
            // set the first month for the current year
            currentMonth = $(monthDivs[0]);
        } else {
            // could not find any months this year so go to the next year
            setNextYear();
            setNextMonth();
        }
    } else {
        // look for the next month of the current year
        var nextMonth = currentMonth.next();
        if (nextMonth.length) {
            // set currentMonth to the next month of activity
            currentMonth = $(nextMonth[0]);
        } else {
            // if there is no next month, then go to the next year
            currentMonth = null;
            setNextYear();
            setNextMonth();
        }
    }
}

function setNextPost() {
    /*
        Sets the global `currentPost` variable to the DOM element representing
        the next Activity Log post.
        If `currentPost` is null, then the variable is set to the first post
        of the current month.
        If `currentPost` is the final post of the current section, see if
        there are more posts to load for this month. Otherwise go to the next month.
    */
    if (currentStatus === Status.DONE) {
        return;
    }
    if (!isCurrentMonthLoaded()) {
        // the current month hasn't loaded yet so we cannot set the post yet
        currentStatus = Status.WAIT_FOR_NEXT_MONTH;
        return;
    }
    if (!currentPost) {
        // there is no current post so look for the first post of this month
        var posts = currentMonth.find(".fbTimelineLogStream > div > div > div");
        if (posts.length) {
            currentPost = $(posts[0]);
        } else {
            // there are no posts this month so go to the next month
            setNextMonth();
            currentStatus = Status.WAIT_FOR_NEXT_MONTH;
        }
    } else {
        var nextPost = currentPost.next();
        if (nextPost.length) {
            // there is a next post for this month so set the next post
            currentPost = $(nextPost[0]);
        } else {
            // see if there are more posts to load for this month
            var pageLoader = currentPost.parent().next();
            if (pageLoader.length) {
                // there are potentially more posts this month, but we need to wait for them to load
                currentStatus = Status.WAIT_FOR_MORE_POSTS;
            } else {
                // there aren't more posts for this month so go to the next month
                currentPost = null;
                setNextMonth();
                currentStatus = Status.WAIT_FOR_NEXT_MONTH;
            }
        }
    }
}

function doNextAction() {
    /*
        Perform an action based on the current state.
        If cleaning, then try to clean the current post and move on.
        If waiting for most posts to load for the currentMonth, then
            check if the posts have loaded yet. Otherwise continue waiting.
        If waiting for the currentMonth to load, then check if the month
            has loaded yet. Otherwise continue waiting.
        If done cleaning, then stop performing actions.
    */
    switch (currentStatus) {
        case Status.CLEANING:
            cleanCurrentPost();
            break;
        case Status.WAIT_FOR_MORE_POSTS:
            waitForMorePosts();
            break;
        case Status.WAIT_FOR_NEXT_MONTH:
            break; //TODO remove this
            waitForMonthToLoad();
            break;
        case Status.DONE:
            resetState();
            break;
        default:
            console.log("Invalid Status:" + currentStatus);
    }
}

function cleanCurrentPost() {
    // click the edit button for the current post
    var postId = clickEditButton();
    // click the action button for the current post
    clickActionButton(postId);
    // scroll to the current post
    scrollDown();
    // delete the current post (this shouldn't be necessary once we ACTUALLY click the action button)
    removeElement();
    // set the next post
    setNextPost();
    // keep chugging
    doNextAction();
}

function waitForMorePosts() {
    /*
        There are no more visible posts for the currentMonth, but there are
        potentially more posts to be loaded for the month. Check if the additional
        posts have been loaded yet. If it turns out that there are no more posts,
        then move on to the next month. If there are new posts, then set the
        currentPost to the next new post and continue cleaning. If the posts haven't
        loaded yet, then continue waiting.
    */
    var nextSection = currentPost.parent().next();
    if (!nextSection.length) {
        // there is no next section so go to the next month
        currentPost = null;
        currentStatus = Status.WAIT_FOR_NEXT_MONTH;
        setNextMonth();
        doNextAction();
    } else if (!$(nextSection[0]).hasClass("uiMorePager")) {
        // the next section has loaded so find the next post
        currentStatus = Status.CLEANING;
        var newPosts = $(nextSection[0]).find("div > div");
        if (newPosts.length) {
            // set the currentPost to the first of the newly loaded posts.
            currentPost = $(newPosts[0]);
        } else {
            // couldn't find any new posts so go to the next month
            currentPost = null;
            setNextMonth();
            setNextPost();
        }
        doNextAction();
    } else {
        // still waiting
        setTimeout(function() {
            doNextAction();
        }, 500);
    }
}

function waitForMonthToLoad() {
    /*
        We are currently waiting for the current month's posts to load for
        the first time. Check if the month has loaded yet. If so, set the
        currentPost to the first post of the month and continue cleaning.
        Otherwise, continue waiting.
    */
    if (isCurrentMonthLoaded()) {
        currentStatus = Status.CLEANING;
        setNextPost();
        doNextAction();
    } else {
        // still waiting
        setTimeout(function() {
            doNextAction();
        }, 500);
    }
}

function clickEditButton(){
    /*
        Click the edit button of the currentPost so that the menuItem action
        button gets loaded.
        Return the id of the currentPost's edit button if found.
        Return null if the edit button is not found.
    */
    var editButton = currentPost.find("a[data-hover='tooltip'][data-tooltip-content='Edit'][rel='toggle']");
    if(!editButton.length){
        editButton = currentPost.find("a[data-hover='tooltip'][data-tooltip-content='Allowed on Timeline'][rel='toggle']");
    }
    if (editButton.length) {
        var year = parseYearFromEntry(currentPost);
        editButton[0].click();
        return $(editButton[0]).attr("id");
    } else {
        return null;
    }
}

function clickActionButton(postId){
    /*
        Click the menu buttons that will actually delete content. The postId
        is the id of the edit button of the post. The corresponding action
        button can be found by looking for the element with the data-ownerid
        attribute equal to the postId.
    */
    if (!postId) {
        return;
    }
    var buttonContainer = $("[data-ownerid='" + postId + "']");
    if (!buttonContainer.length) {
        return;
    }
    var button = $(buttonContainer[0]).find("a[role='menuitem']");
    if (!button.length) {
        return;
    }
    var ajax = $(button[0]).attr("ajaxify");
    // determine which type of action button this is
    if (ajax && ajax.indexOf("comment") != -1) {
        if(comment){
            console.log("Uncomment.. ");
            //buttons[0].click();
        }
    } else if (ajax && ajax.indexOf("unlike") != -1) {
        if(like){
            console.log("Unlike.. ");
            //buttons[0].click();
        }
    } else if (ajax && ajax.indexOf("allow") != -1){
        ajax = $(button[1]).attr("ajaxify");
        if(ajax.indexOf("hide") != -1){
            if(post){
                console.log("Hide.. ");
                //buttons[1].click();
            }
        }
    } else if (ajax && ajax.indexOf("timeline/delete/confirm")){
        if(friends){
            console.log("Delete post on friends timeline.. ");
            //buttons[0].click();
        }
    }
    else {
        console.log("Found something else.. ");
        console.log(ajax);
    }
}

function scrollDown(){
    /*
        Scroll down to the current post about to be deleted to kick off loading more.
    */
    $('html,body').scrollTop((currentPost).offset().top);
}

function removeElement(){
    /*
        Remove the already parsed post from the DOM;
    */
    var currentEntry = currentPost.find("table");
    $(currentEntry).remove();
}

function isCurrentMonthLoaded() {
    /*
        Return true if the posts for the current month have been loaded,
        otherwise return false.
    */
    // if the currentMonth div has a child div with class `async_saving`, then
    // the current month hasn't finished loading yet.
    return !currentMonth.find(".async_saving").length;
}

function parseYearFromEntry(entry) {
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

// do the thing
run();
