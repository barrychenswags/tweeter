/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function convertDateFormat (comparedTime) {
  var seconds_diff = Math.floor((Date.now() - comparedTime) / 1000); //compare the difference between current time and input time in seconds

  var time_unit = Math.floor(seconds_diff / 31536000);
  if (time_unit >= 1) {
    if (time_unit === 1){
      return 'a year ago';
    }
    return time_unit + ' years ago';
  }

  time_unit = Math.floor(seconds_diff / 2592000);
  if (time_unit >= 1) {
    if (time_unit === 1){
      return 'a month ago';
    }
    return time_unit + ' months ago';
  }

  time_unit = Math.floor(seconds_diff / 86400);
  if (time_unit >= 1) {
    if (time_unit === 1){
      return 'a day ago';
    }
    return time_unit + ' days ago';
  }

  time_unit = Math.floor(seconds_diff / 3600);
  if (time_unit >= 1) {
    if (time_unit === 1){
      return 'an hour ago';
    }
    return time_unit + ' hours ago';
  }

  time_unit = Math.floor(seconds_diff / 60);
  if (time_unit >= 1) {
    if (time_unit === 1){
      return 'a minute ago';
    }
    return time_unit + ' minutes ago';
  }

  return 'less than a minute ago';
}

const request = (options, cb) => {
  $.ajax(options)
    .done(response => cb(response))
    .fail(err => console.log(`Error: ${err}`))
    .always(() => console.log('Request completed.'));
};

const createTweet = tweetObj => {
  //console.log(tweetObj);
  console.log('tweet length is: ',tweetObj.content.text.length);
  //if(tweetObj.content.text.length<1 || tweetObj.content.text.length>10){
    //alert("I am an alert box!");
  //}
  //else{
    return `<div class = "tweet">
            <div class="header">
              <img class = "avatar" src = ${tweetObj.user.avatars.small}>

                <span class = "user-name">${tweetObj.user.name}</span>
                <span class = "handle">${tweetObj.user.handle}</span>

            </div>
            <div class="tweet-body">
              ${tweetObj.content.text}
            </div>
            <div class="footer">
              <span id = "date">${convertDateFormat(tweetObj.created_at)}<span/>
              <img class="flag" src="/images/flag.png" width="20px" height="20px" align = "right" >
              <img class="retweet" src="/images/retweet.png" width="20px" height="20px" align = "right" >
              <img class="like" src="/images/heart.png" width="20px" height="20px" align = "right" >
            </div>
          </div>`;
  //}

};

const renderTweets = tweets => {
  $.each(tweets, (index, tweet) => {
    $('#tweet-list').prepend(createTweet(tweet));
  });
};

const loadTweets = () => {
  const reqOptions = {
    url: '/tweets',
    method: 'get',
    dataType: 'json',
  };

  request(reqOptions, function(response) {
    //console.log(response);
    renderTweets(response);
  });
};

$(document).ready(function() {
  // --- our code goes here ---

  $('#compose').on('click', function () {
    console.log('Button clicked');

    if($("section.new-tweet").length){
      $("section.new-tweet").replaceWith(`<div id = 'replace'></div>`)
    }

    else{
    $('#replace').replaceWith(`
      <section class="new-tweet">
        <h2>Compose Tweet</h2>
        <form id='add-tweet'>
          <textarea name="text" placeholder="What are you humming about?"></textarea>
          <br>
          <input type="submit" value="Tweet">
          <span class="counter">140</span>

        </form>
      </section>`);

    $('#add-tweet').on('input', function(event){
      var totalCount = 140 - event.target.value.length;
      $(".counter").text(totalCount);

    })

    $('#add-tweet').on('submit', function(event) {
      event.preventDefault();
      const tweetContent = $(this).find('textarea[name=text]').val();

      if(tweetContent.length <= 0){
        //console.log($('textarea'))
        alert("Tweet cannot be empty");
      }
      else if (tweetContent.length > 140){
        alert("Tweet cannot be over 140 characters");
      }
      else{
        const reqOptions = {
          url: '/tweets',
          method: 'POST',
          data: { tweetContent },
        };

        request(reqOptions, tweet => {
          renderTweets([tweet]);
        });
      }
    });
    }
  });

  loadTweets();

});





