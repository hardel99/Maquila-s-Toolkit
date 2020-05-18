document.getElementById('log').style.zIndex = 3;

function toLog() {
    document.getElementById('cover').className = 'signUp';
    setTimeout(function () {
        changeIndexOnDelay('log', 3);
    }, 500);
    changeIndexOnDelay('sign', 1);
}

function toSign() {
    document.getElementById('cover').className = 'logIn';
    changeIndexOnDelay('log', 1);
    setTimeout(function () {
        changeIndexOnDelay('sign', 3);
    }, 500);
}

function changeIndexOnDelay(id, index) {
    document.getElementById(id).style.zIndex = index;
}