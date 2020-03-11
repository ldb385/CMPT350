


/**
 * this will get signIn form values to verify
 */
function getSignIn(){

    var username = $("#siUsername").val();
    var password = $("#siPassword").val();

    return {
        usr: username,
        psw: password
    }
}

function validateUser( userInfo ){
    jQuery.ajaxSetup({async:false});
    var s = false;
    $.get('http://localhost:3012/signIn?usr='+userInfo.usr+'&psw='+userInfo.psw+'', (data) => {
        if( data.validUser ){
            console.log( "valid" );
            s = true;
        } else {
            s = false;
        }
    });
    jQuery.ajaxSetup({async:true});
    return s;
}

function getUser(){
    var url = window.location.search.substr(1).toString();
    if( url != "" ){
        var user = url.split("&")[0].toString().split("=")[1].toString();
        return user;
    } else { 
        return "";
    }
}
