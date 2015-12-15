var ref = new Firebase("https://emrwaitingapp.firebaseio.com/");
var authData = ref.getAuth();

function login() {

    var useremail = $("#useremail").val();
    var userpass = $("#userpass").val();
    ref.authWithPassword({
        email: useremail,
        password: userpass
    }, function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            alert("Login Failed! Please try again!");
        } else {
            console.log("Authenticated successfully with payload:", authData);
            window.location.href = 'home.html';
        }
    });
}

$("#showLogin").click(function () {
    $("#registerDiv").hide("fast", function () {});
    $("#loginDiv").show("fast", function () {});
});

$("#showRegister").click(function () {
    $("#loginDiv").hide("fast", function () {});
    $("#registerDiv").show("fast", function () {});
});

function register() {

    var registerName = $("#registerName").val();
    var registerEmail = $("#registerEmail").val();
    var registerPass = $("#registerPassword").val();

    console.log(registerName);
    console.log(registerEmail);
    console.log(registerPass);

    ref.createUser({
        name: registerName,
        email: registerEmail,
        password: registerPass

    }, function (error, authData) {
        if (error) {
            console.log("Error creating user:");
        } else {
            console.log("Successfully created user account with uid:", authData.uid);
            alert("Thank you for Registering! Please login.");
            $("#registerDiv").hide("fast", function () {});
            $("#loginDiv").show("fast", function () {});
        }
    });
}



if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    console.log("Logged in Already!");
    window.location.href = 'home.html';

} else {
    // Create a callback to handle the result of the authentication

}


// we would probably save a profile when we register new users on our site
// we could also read the profile to see if it's null
// here we will just simulate this with an isNewUser boolean


var isNewUser = true;

ref.onAuth(function (authData) {
    if (authData && isNewUser) {
        // save the user's profile into the database so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        ref.child("users").child(authData.uid).set({
            name: getName(authData),
            queueStatus: false
        });
    }
});

// find a suitable name based on the meta info given by each provider
function getName(authData) {
    switch (authData.provider) {
    case 'password':
        return authData.password.email.replace(/@.*/, '');
    }
}