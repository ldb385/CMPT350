


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
    $.get('http://localhost:3012/validate', (data) => {
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

    jQuery.ajaxSetup({async:false});
    var usr = "";

    $.get('http://localhost:3012/currentUser', (data) => {
        usr = data[0].user;
    })

    jQuery.ajaxSetup({async:true});
    return usr;
}


function getPass(){

    jQuery.ajaxSetup({async:false});
    var psw = "";

    $.get('http://localhost:3012/currentUser', (data) => {
        psw = data[0].pass;
    })

    jQuery.ajaxSetup({async:true});
    return psw;
}

