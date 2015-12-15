var ref = new Firebase("https://emrwaitingapp.firebaseio.com/");
var authData = ref.getAuth();
var hospId;
var queueStatus;
var count;
console.log(authData);
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

$("#reminderDiv").hide("fast", function () {});


$("#openReminderBtn").click(function () {
    console.log("Setting Reminder");
    $("#reminderDiv").show("fast", function () {});
    console.log("Reminder Div Open");
});

$("#setReminderBtn").click(function () {
    console.log("Setting Reminder");
    var phoneNumber = $('#patPhone').val();
    console.log(phoneNumber);
    //add twilio texting code here
    //    sendText(phoneNumber);

    //    alert("Your Reminder has been set!");
    console.log("Reminder Set");
    $("#reminderDiv").hide("fast", function () {});
});

//function sendText(num) {
//    $.ajax({
//        type: "POST",
//        username: "AC5f559ccfd94af6c82e6dc24f886853b0",
//        password: "5140147787e0cfa2576196524eec9108",
//        url: "https://api.twilio.com/2010-04-01/Accounts/AC5f559ccfd94af6c82e6dc24f886853b0/Messages.json",
//        data: {
//            "To": num,
//            "From": "+14158141829",
//            "Body": "Hey! Your appointment is in 10 Minutes! Get going."
//        },
//        success: function (data) {
//            console.log(data);
//        },
//        error: function (data) {
//            console.log(data);
//        }
//    });
//}


getData();

//get latest trends
function getData() {
    console.log("entered queue check function");
    ref.child("users").child(authData.uid).on("value", function (snapshot) {
        latestSnapshot = snapshot;
        var tempData = latestSnapshot.val();
        hospId = tempData["hospital"];
        console.log(hospId);
        isInQueue(latestSnapshot);
    })
};

function isInQueue(snapData) {
    queueStatus = snapData.val();
    queueStatus = queueStatus;
    console.log(queueStatus);
    //    hospId = queueStatus["hospital"];
    if (queueStatus["queueStatus"] === false) {
        console.log("false");
        console.log("Not in Line! Get in line.");
        window.location.href = 'hospitalList.html';

    } else {
        console.log("You In Line Dawg");
        console.log(hospId);
        getCountData();
    }
}


$("#leaveLineBtn").click(function () {
    console.log("Leaving Line");
    ref.child("users").child(authData.uid).update({
        queueStatus: false
    });
    leaveLine();
});

function leaveLine() {
    ref.child("hospitals").child(hospId).child("patients").child(authData.uid).remove();
}

function getCountData() {
    console.log("count function");
    ref.child("hospitals").child(hospId).child("patients").on("value", function (snapshot) {
        var tData = snapshot.val();
        console.log(tData);
        getCount(tData);
    })
}

function getCount(data) {
    console.log(data);
    count = Object.keys(data).length;
    console.log(count);
    $('#linenum').text(count);

    var estTime = count * 10;
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
    var countdownTimer = setInterval(function () {
        timer()
    }, 1000);


    initMap();
}



function initMap() {

    var bounds = new google.maps.LatLngBounds;
    console.log(hospId);

    if (hospId < 3) {
        var hosLat = hos[hospId].lat;
        var hosLong = hos[hospId].long;
        var hosName = hos[hospId].name;
    } else {
        var hosLat = hos[1].lat;
        var hosLong = hos[1].long;
        var hosName = hos[1].name;
    }

    console.log(hosName);
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