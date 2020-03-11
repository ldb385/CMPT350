
/**
 * called on load of page
 */
$(() => {

    // page was loaded, will set an onclick listener and load the stored reviews and likes
    $("#submitRev").click(() => {
        sendReview( getElementsOfReview() );
    } );

    $("#siButton").click(() => {
        var info = getSignIn();
        if( info.usr != "" && info.psw != "" ){
            if( validateUser( info ) ){
                unlockButtons();
            } else {
                lockButtons();
            }
        }
    } );

    getReviews();
    getLikes();

    setTimeout( function(){
        checkIfLoggedIn();
    }, 250 );

} );

function checkIfLoggedIn(){
    var url = window.location.search.substr(1).toString();
    if( url != "" ){
        var user = url.split("&")[0].toString().split("=")[1].toString();
        var pass = url.split("&")[1].toString().split("=")[1].toString();
    
        var boUser = validateUser({
            usr: user,
            psw: pass} );

        console.log( boUser );
    
        setTimeout( function() {
            if( boUser ){
                unlockButtons();
            } else {
                lockButtons();
            }
    
        }, 500 );
    } else {
        lockButtons();
    }

}

function unlockButtons(){
    var buttonsToUnlock = document.getElementsByName("unlockable");

    if( buttonsToUnlock.length > 1 ){
        for (let index = 0; index < buttonsToUnlock.length; index++) {
            buttonsToUnlock[index].disabled=false;
        }
    } else {
        setTimeout(function() {
            unlockButtons();
        }, 500);
    }
}

function lockButtons(){
    var buttonsToLock = document.getElementsByName("unlockable");
    if( buttonsToLock.length > 1 ){
        for (let index = 0; index < buttonsToLock.length; index++) {
            buttonsToLock[index].disabled=true;
        }
    } else {
        setTimeout(function() {
            lockButtons();
        }, 500);
    }
}
