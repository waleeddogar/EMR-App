var firebaseRef = new Firebase("https://emrwaitingapp.firebaseio.com//");

var adder = "";
var dataObjJson;
var latestSnapshot = null;

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;

}


function wtf(){
    sendPush("Client1", "Good Morning", "WAKE UP MAN", "www.webbytes.ca/ngi/trends.html");
}


//opens form
function sendForm() {

    console.log("working");

    var trendid = getUrlVars()["id"];
    console.log(trendid);

    var title = document.getElementById("trendTitle").value;
    var trendId = 2;
    var link = "http://webbytes.ca/ngi/decision.html?id=2";
    var message = document.getElementById("advisorMessage").value;
    var rangeLow = document.getElementById("lowRange").value;
    var rangeHigh = document.getElementById("highRange").value;


    console.log(title + " " + trendid + " " + trendId);

    console.log("push happening");

    firebaseRef.child("pushnotifications").push({
        id: 2,
        title: "",
        link: link,
        message: message,
        rangelow: rangeLow,
        rangehigh: rangeHigh
    });
    setTimeout(sendPush("Clients", "Action Needed: New Investment Potention", message, "www.webbytes.ca/ngi/decision.html?id=2"), 3000);
   console.log("sent success");
   setTimeout(function(){
       window.location.href = "home.html";
   }, 3500);

}

window.onload = function () {
    getTrendDetails();
};


//get latest trends
function getTrendDetails() {
    firebaseRef.child("trend").on("value", function (snapshot) {
        latestSnapshot = snapshot;
        updateView(latestSnapshot);
    })
};

function updateView(snap) {
    console.log(snap);
    var trendid = getUrlVars()["id"];
    console.log(trendid);
    dataObjJson = snap.val();

    //iterate through each object

    var x = trendid;
    var trend = {
        title: '',
        content: '',
        snippet: '',
        url: ''
    }
    trend.title = dataObjJson[x].title;
    trend.content = dataObjJson[x].content;
    trend.snippet = dataObjJson[x].snippet;
    trend.url = dataObjJson[x].url;

    $("#trenddetailview").append('<h4 id="trendId" class="hidden">' + x + '</h4><div class="demo-card-wide mdl-card mdl-shadow--2dp"><div class="mdl-card__title center"><h2 id="trendTitle" class="mdl-card__title-text widthfull">' + trend.title + '</h2></div><div id="trendContent" class="mdl-card__supporting-text">' + trend.content + '</div><div class = "mdl-card__supporting-text center"><form action="#"><h2 class="mdl-card__title-text widthfull">Investment Range:</h2><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input mdl-color-text--gray-400" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="lowRange" placeholder="LOW"><span class="mdl-textfield__error mdl-color-text--gray-400">Input is not a number!</span></div><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><input class="mdl-textfield__input mdl-color-text--gray-400" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="highRange" placeholder="HIGH"><span class="mdl-textfield__error mdl-color-text--gray-400">Input is not a number!</span></div><h2 class="mdl-card__title-text widthfull">Message:</h2><div class="mdl-textfield mdl-js-textfield"><textarea class="mdl-textfield__input" rows="2" type="text" id="advisorMessage"></textarea></div> </form></div><div class="mdl-grid mdl-card__actions mdl-card--border center"><div class="mdl-cell mdl-cell--2-col"><a class="mdl-button mdl-button--colored mdl-color-text--black mdl-js-button mdl-js-ripple-effect" href="trends.html">Back</a></div><div class="mdl-cell mdl-cell--2-col"><a id=trend' + x + ' class="mdl-button mdl-button--colored mdl-color-text--black mdl-js-button mdl-js-ripple-effect" onclick="sendForm()">Send to Client</a></div></div></div>');
    
};


//PARSE STUFF
function sendRequest(destination, title, link, message, rangeLow, rangeHigh) {
    sendPush("Client1", title, Message, link);
}

function sendReponse(destination, title, link, message, type) {
    sendPush(destination, title, Message, link);
}

function sendPush(destination, title, Message, link) {
    console.log(destination + title + Message + link);
    uri = "wealthConnect://something/?url=" + link;

    var dataSet = makeDataSet(destination, title, Message, link);
    console.log(dataSet);


    $.ajax({
        type: 'POST',
        headers: {
            'X-Parse-Application-Id': "8YyEOA437mXhMXkQp5NAWWjXrfaG4A004NILY3f9 ",
            'X-Parse-REST-API-Key': "5S1sYr7wumvLTM0vp041Sk13M4vUMKDJz06q84nc "
        },
        url: "https://api.parse.com/1/push",
        data: dataSet,
        //data: "'{\"channels\":[\"" + destination + "\"], \"data\":{\"alert\":\"" + Message + "\",\"uri\":\"" + 
        //uri + "\",\"title\":\"" + title + "\"}}'",
        contentType: "application/json"
    });

    console.log("push sent");
}


function makeDataSet(destination, title, Message, link) {

    uri = "wealthConnect://something/?url=" + link;

    var dataSet = "{\"channels\":[\"" + destination + "\"], \"data\":{\"alert\":\"" + Message + "\",\"uri\":\"" +
        uri + "\",\"title\":\"" + title + "\"}}";

    return dataSet;

}