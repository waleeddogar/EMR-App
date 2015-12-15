var firebaseRef = new Firebase("https://emrwaitingapp.firebaseio.com//");
var firebasechatRef = firebaseRef.child("chat/sent");
var adder = "";
var dataObjJson;
var latestSnapshot = null;

//Send Chat Message
$(document).ready(function () {
    var utcTime = new Date().getTime();
    $('#sendBtn').click(function () {
        var text = $('#messageInput').val();
        firebaseRef.child("chat").child("sent").push({
            message: text,
            sentBy: "Advisor",
            sentTo: "Client",
            time: utcTime
        });
        $('#messageInput').val('');
    });
});

//Receive Chat Message
firebasechatRef.on('child_added', function (snapshot, prevChildKey) {
    var snap = snapshot.val();
    console.log(snap);
    console.log(snapshot);
    console.log(prevChildKey);

    displayChatMessage(snap.sentBy, snap.message);
});

//Update Chat body
function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};