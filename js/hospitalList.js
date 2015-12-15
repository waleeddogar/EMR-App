var ref = new Firebase("https://emrwaitingapp.firebaseio.com/");
var authData = ref.getAuth();
console.log(authData);

function initMap() {

    var bounds = new google.maps.LatLngBounds;
    var markersArray = [];

    //    var origin = {
    //        lat: 55.93,
    //        lng: -3.118
    //    };

    var hosp1 = 'Rouge Valley Hospital, Scarborough, Canada';
    var hosp2 = 'Scarborough General Hospital, Toronto';
    var hosp3 = 'Mount Sinai Hospital, Toronto';

    var originIcon = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=|FFFF00|000000';

    var closeIconLow = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=1|FF0000|000000';
    var closeIconMed = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=2|FF0000|000000';
    var closeIconHigh = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=3|FF0000|000000';

    var destinationIcon = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=1|FF0000|000000';



    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 43.784159,
            lng: -79.228757
        },
        zoom: 10,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false
    });
    var infoWindow = new google.maps.InfoWindow({
        map: map
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var geocoder = new google.maps.Geocoder;

            var service = new google.maps.DistanceMatrixService;
            service.getDistanceMatrix({
                origins: [pos],
                destinations: [hosp1, hosp2, hosp3],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    alert('Error was: ' + status);
                } else {
                    var originList = response.originAddresses;
                    var destinationList = response.destinationAddresses;
                    deleteMarkers(markersArray);

                    var showGeocodedAddressOnMap = function (asDestination) {
                        switch (asDestination) {
                        case 0:
                            var icon = originIcon;
                            break;
                        case 1:
                            var icon = closeIconLow;
                            break;
                        case 2:
                            var icon = closeIconMed;
                            break;
                        case 3:
                            var icon = closeIconHigh;
                            break;
                        }

                        return function (results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                                map.fitBounds(bounds.extend(results[0].geometry.location));
                                markersArray.push(new google.maps.Marker({
                                    map: map,
                                    position: results[0].geometry.location,
                                    icon: icon
                                }));
                            } else {
                                alert('Geocode was not successful due to: ' + status);
                            }
                        };
                    };

                    for (var i = 0; i < originList.length; i++) {
                        var results = response.rows[i].elements;
                        geocoder.geocode({
                                'address': originList[i]
                            },
                            showGeocodedAddressOnMap(i));
                        for (var j = 0; j < results.length; j++) {
                            geocoder.geocode({
                                    'address': destinationList[j]
                                },
                                showGeocodedAddressOnMap(j + 1));
                        }
                    }
                }
            });


            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


function deleteMarkers(markersArray) {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}




function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

$("#updateLocBtn").click(function () {
    initMap();
});


$("#hospBtn1").click(function () {
    console.log("button1");
    window.location.href = 'hospitalDetail.html?id=1';

});

$("#hospBtn2").click(function () {
    console.log("button2");
    window.location.href = 'hospitalDetail.html?id=2';

});

$("#hospBtn3").click(function () {
    console.log("button3");
    window.location.href = 'hospitalDetail.html?id=3';

});



var queueStatus;
console.log(authData);

getData();

//get latest trends
function getData() {
    console.log("entered queue check function");
    ref.child("users").child(authData.uid).on("value", function (snapshot) {
        latestSnapshot = snapshot;
        isInQueue(latestSnapshot);
    })
};

function isInQueue(snapData) {
    queueStatus = snapData.val();
    queueStatus = queueStatus;
    console.log(queueStatus);

    if (queueStatus["queueStatus"] === false) {
        console.log("false");
        console.log("Not in Line! Get in line.");

    } else {
        alert("You In Line Dawg");        
        window.location.href = 'home.html';
    }
}
