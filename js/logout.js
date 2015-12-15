var ref = new Firebase("https://emrwaitingapp.firebaseio.com/");

function logout() {
    ref.unauth();
    window.location.href = 'index.html';

}

function authDataCallback(authData) {
    if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
    } else {
        console.log("User is logged out");
        window.location.href = 'index.html';
    }
}

ref.onAuth(authDataCallback);