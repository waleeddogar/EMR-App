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

var hos = [{
    'name': 'Rouge Valley',
    'lat': 43.776426,
    'long': -79.231752
    }, {
    'name': 'Scarborough General',
    'lat': 43.802102,
    'long': -79.308328
    }, {
    'name': 'Mount Sinai',
    'lat': 43.653226,
    'long': -79.383184
    }];
var count;
var hospId = 1;
var tempData;
console.log(hospId);
hospId = getUrlVars()["id"];


var ref = new Firebase("https://emrwaitingapp.firebaseio.com/");
var authData = ref.getAuth();
var queueStatus;
console.log(authData);

getData();

var userName;

//get latest trends
function getData() {
    console.log("entered queue check function");
    ref.child("users").child(authData.uid).on("value", function (snapshot) {
        latestSnapshot = snapshot;
        userName = latestSnapshot.val();
        console.log(userName);
        userName = userName.name;
        console.log(userName);
        getCountData();
    })
};

function getCountData() {
    console.log("count function");
    ref.child("hospitals").child(hospId - 1).child("patients").on("value", function (snapshot) {
        latestSnapshot = snapshot;
        tempData = latestSnapshot.val();
        console.log(tempData);
        getCount(tempData);
    })
}

function getCount(data) {
    console.log(data);

    if (data != null) {
        count = Object.keys(data).length;
        console.log(count);
        var estTime = count * 10;

    } else {
        count = 0;
        console.log(count);
        var estTime = 0;
    }


    $('#queuecount').text(count);
    console.log(estTime);

    var seconds = estTime * 60;

    function timer() {
        var days = Math.floor(seconds / 24 / 60 / 60);
        var hoursLeft = Math.floor((seconds) - (days * 86400));
        var hours = Math.floor(hoursLeft / 3600);
        var minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
        var minutes = Math.floor(minutesLeft / 60);
        var remainingSeconds = seconds % 60;
        if (remainingSeconds < 10) {
            remainingSeconds = "0" + remainingSeconds;
        }
        $('#waittime').text(minutes + ":" + remainingSeconds);

        if (seconds == 0) {
            clearInterval(countdownTimer);
            $('#waittime').text("No Wait Time :)");
            document.getElementById('countdown').innerHTML = "Completed";
        } else {
            seconds--;
        }
    }
    var countdownTimer = setInterval('timer()', 1000);


    initMap();

}


if (hospId == 1) {
    console.log("case1");
    $('#hospitalName').text(hos[0].name);
} else if (hospId == 2) {
    console.log("case2");
    $('#hospitalName').text(hos[1].name);
} else if (hospId == 3) {
    console.log("case3");
    $('#hospitalName').text(hos[2].name);
} else {
    console.log("no ID");
    $('#hospitalName').text(hos[1].name);
}



$("#joinLineBtn").click(function () {
    console.log("Join Line Clicked");

    ref.child("users").child(authData.uid).update({
        queueStatus: true,
        hospital: hospId - 1
    });
    addtoLine();
});

var map;

function addtoLine() {

    ref.child("hospitals").child(hospId - 1).child("patients").child(authData.uid).update({
        inLine: true
    });

    window.location.href = 'home.html';

}


function initMap() {
    hospId = getUrlVars()["id"];
    var bounds = new google.maps.LatLngBounds;

    if (hospId < 4) {
        var hosLat = hos[hospId - 1].lat;
        var hosLong = hos[hospId - 1].long;
        var hosName = hos[hospId - 1].name;
    } else {
        var hosLat = hos[1].lat;
        var hosLong = hos[1].long;
        var hosName = hos[1].name;
    }

    var pos = {
        lat: hosLat,
        lng: hosLong
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: hosLat,
            lng: hosLong
        },
        zoom: 10,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false
    });
    var infowindow = new google.maps.InfoWindow({
        content: hosName
    });
    var companyMarker = new google.maps.Marker({
        position: pos,
        map: map,
        title: hosName,
        visible: true
    });


    infowindow.open(map, companyMarker);

}