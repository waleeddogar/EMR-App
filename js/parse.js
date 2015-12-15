//PARSE STUFF
function sendRequest(destination, title, link, message, rangeLow, rangeHigh) {
    sendPush("Client1", title, Message, link);
}

function sendReponse(destination, title, link, message, type) {
    sendPush(destination, title, Message, link);
}

function sendPush(destination, title, Message, link) {

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