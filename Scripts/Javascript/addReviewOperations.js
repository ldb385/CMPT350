

/**
 * called on load of page
 */
$(() => {
    // page was loaded, will set an onclick listener and load the stored reviews and likes
    $("#submitRev").click(() => {
        sendReview( getElementsOfReview() );
    } )
    getReviews();
    getLikes();
} )

/**
 * this will retrieve the values stored in the form when a send request
 * is processed and format data into a dictionary
 */
function getElementsOfReview(){

    var descrip = $("#description").val();
    var image = $("#image").val();
    var radio;

    if( document.getElementById("inlineRadio1").checked ){
        radio = 1;
    } else if( document.getElementById("inlineRadio2").checked ){
        radio = 2;
    } else if( document.getElementById("inlineRadio3").checked ){
        radio = 3;
    } else if( document.getElementById("inlineRadio4").checked ){
        radio = 4;
    } else if( document.getElementById("inlineRadio5").checked ){
        radio = 5;
    } else {
        radio = 1;
    }

    return {
        img: image,
        des: descrip,
        rad: radio
    }
}

/**
 * retrieve all reviews stored and add them to the web page
 */
function getReviews(){
    $.get('http://localhost:3012/reviews', (data) => {

        for (let index = 0; index < data.length; index++) {
            addReview( data[index] );
        }
    })
}

/**
 * This takes in a dictionary dataType with parameters retrieved from a form
 * it will then format the data with the use of a template and add formatted
 * review to webpage
 * @param {*} review 
 */
function addReview( review ){
    var rTemplate, rClone, i, d, r, b, h;

    rTemplate = document.getElementById("ReviewsTemplate");
    // create a clone of template so can add items to it
    rClone = rTemplate.content.cloneNode(true);

    // get the elements of cloned templates
    i = rClone.querySelector('#pic');
    d = rClone.querySelector('#des');
    r = rClone.querySelector('#rating');
    b = rClone.querySelector('#likebutton');
    h = rClone.querySelector('#likeheader');

    // Set the elements of the cloned template
    i.src = review.image;
    d.textContent = review.description;
    r.textContent = review.rate;
    b.id = "likeButton_" + review.time;
    h.id = "likeHeader_" + review.time;
    
    document.getElementById("ReviewsAdded").appendChild( rClone );
}

/**
 * Takes in dictionary representation of form input and send to 
 * server in order to store in mysql db
 * @param {*} rev 
 */
function sendReview( rev ){
    $.post('http://localhost:3012/reviews', rev );
}

