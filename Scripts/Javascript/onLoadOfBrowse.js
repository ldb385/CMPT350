
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
    }, 350 );

} );

function checkIfLoggedIn(){

    var user = getUser().toString();
    var pass = getPass().toString();

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

    }, 250 );

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
        }, 250);
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
        }, 250);
    }
}
