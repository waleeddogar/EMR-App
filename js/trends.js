var firebaseRef = new Firebase("https://emrwaitingapp.firebaseio.com//");

var adder = "";
var dataObjJson;
var latestSnapshot = null;

var currentdate = new Date();

var nowDate = currentdate.getFullYear() + "-" + currentdate.getMonth() + "-" + currentdate.getDate();
var nowTime = currentdate.getUTCHours() + ":" + currentdate.getUTCMinutes();
var datetimeUTC = currentdate.getTime();

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

console.log("The current month is " + monthNames[currentdate.getMonth()] + " The current day is: " + currentdate.getDate());

//get latest trends
function getTrends() {
    firebaseRef.child("trend").on("value", function (snapshot) {
        latestSnapshot = snapshot;
        updateView(latestSnapshot);
    })
};

function updateView(snap) {
    console.log(snap);

    dataObjJson = snap.val();

    //iterate through each object
    $.each(dataObjJson, function (index, resObject) {
        var trend = {
            title: '',
            content: '',
            snippet: '',
            url: ''
        }
        var x = index;
        console.log(x);
        trend.title = resObject.title;
        trend.content = resObject.content;
        trend.snippet = resObject.snippet;
        trend.url = resObject.url;

        $("#trendholder").append('<div class="demo-card-wide mdl-card mdl-shadow--2 dp"><div class = "mdl-trends"><h2 class="mdl-card__title-text"> ' + trend.title + ' </h2></div><div class="mdl-card__supporting-text mdl-color-text--grey-700">' + trend.snippet + '</div><div class="mdl-card__actions mdl-card--border center"><a id=trend' + x + ' class="mdl-button mdl-button--colored mdl-color-text--black mdl-js-button mdl-js-ripple-effect mdl-fullwidth" href="trend-content.html?id=' + x + '">Read More</a></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon mdl-js-button  mdl-js-ripple-effect"><i class="material-icons">send</i></button></div></div>');


        console.log(trend);
        console.log(x + " is this");

    });

};

window.onload = function () {
    getTrends();

};

//                $('#trend').load('/trend-content.html #trendholder', function () {
//                    $("#trendholder").append('<div class="demo-card-wide mdl-card mdl-shadow--2 dp"><div class = "mdl-trends"><h2 class="mdl-card__title-text"> ' + trend.title + ' </h2></div><div class="mdl-card__supporting-text mdl-color-text--grey-700">' + trend.snippet + '</div><div class="mdl-card__actions mdl-card--border center"><a id=trend' + x + ' class="mdl-button mdl-button--colored mdl-color-text--black mdl-js-button mdl-js-ripple-effect mdl-fullwidth">Read More</a></div><div class="mdl-card__menu"><button class="mdl-button mdl-button--icon mdl-js-button  mdl-js-ripple-effect"><i class="material-icons">send</i></button></div></div>')
//                });