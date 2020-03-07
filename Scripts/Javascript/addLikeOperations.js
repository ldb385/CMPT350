

/**
 * This will take in DOM tree button element and get the attached
 * review in order to increase the like amount by one
 * @param {*} idRev 
 */
function likeReview( idRev ){
  var btnId = idRev.id;
  var idNum = btnId.toString().split("_")[1];

  incrementLike( idNum );

  // update the to new values
  updateLike( idNum );

}

/**
 * this wil get the current likes allocated to a specific
 * single review
 * @param {String/Int} id 
 */
function updateLike( id ){
  $.get('http://localhost:3012/likeReviewUpdate?review='+id+'', (data) => {
    console.log( data );
    var ID = "likeHeader_" + id.toString();
    var amnt = data[0].revLike;
    document.getElementById(ID).textContent = amnt.toString();
  });
}

/**
 * simple query which will get every like value stored in the database and
 * update the cooresponding values on the webpage
 */
function getLikes() {
  //update all the likes to their states
  $.get('http://localhost:3012/likeReview', (data) => {
    for (let index = 0; index < data.length; index++) {
      var ID = "likeHeader_" + data[index].review;
      var amnt = data[index].revLike;

      document.getElementById(ID).textContent = amnt.toString();
    }
  });
}

/**
 * this will send a post request with the id of the review that was liked
 * the request will process the addition of 1 to like amount in db
 * @param {String/Int} id 
 */
function incrementLike( id ){
  var toSend = {
    review: id.toString()
  }
  $.post('http://localhost:3012/likeReview', toSend );
}
