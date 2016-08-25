(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src",
        "jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main(); 
}

/******** Our main function ********/
function main() { 
    //TODO: get rid of this document.ready stuff
    jQuery(document).ready(function($) { 
        /******* Load CSS *******/
        // var css_link = $("<link>", { 
        //     rel: "stylesheet", 
        //     type: "text/css", 
        //     href: "fb-style.css" 
        // });
        // css_link.appendTo('head'); 

        var css1 = $("<link>", { rel: "stylesheet", type: "text/css", href: "fb-style.css" }).appendTo('head');
        var css2 = $("<link>", { rel: "stylesheet", type: "text/css", href: "bootstrap.css" }).appendTo('head');          

        /******* Load HTML *******/
        var url = "feedback-form.html";
        $.get(url,function(data) {
          $('#fb-container').html(data);
        });
    });
}

// Hides the fb form when a user clicks outside the form
$(document).mouseup(function (e)
{
    var container = $("#widget");
    var submittedContainer = $("#submittedWidget");

    if ( (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) && (!submittedContainer.is(e.target) // if the target of the click isn't the container...
        && submittedContainer.has(e.target).length === 0))// ... nor a descendant of the container
    {
        container.hide();
        submittedContainer.hide();
        $("#fb-btn").show();

    }
});

function initializeFeedback(ele) {
    //TODO: make ajax request for form.html, and inject to ele
    //instruct users to add my fb script to their page and call initializeFeedback ot initialize the widget
}

})(); 

// We call our anonymous function immediately

// var feedback = {
//     initialize: function(ele) {
//         //initializationstuff
//     }
// }

// feedback.initialize(ele)