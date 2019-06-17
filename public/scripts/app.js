/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//var totalCount;

var tweets = [
  {
    "user": {
      "name": "McLovin",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@mclovin69"
    },
    "content": {
      "text": "I am McLovin"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Brian Fantana",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@channel4brian" },
    "content": {
      "text": "60% of the time, it works all the time"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Prestige Worldwide",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@prestigeworldwide"
    },
    "content": {
      "text": "Boats N Hoes!"
    },
    "created_at": 1461113796368
  }
]
//createTweetElement

const request = (options, cb) => {
  $.ajax(options)
    .done(response => cb(response))
    .fail(err => console.log(`Error: ${err}`))
    .always(() => console.log('Request completed.'));
};

const createTweet = tweetObj => {
  console.log(tweetObj);
  return `<div class = "tweet">
            <div class="header">
              <img class = "avatar" src = ${tweetObj.user.avatars.small}>

                <span class = "user-name">${tweetObj.user.name}</span>
                <span class = "handle">${tweetObj.user.handle}</span>

            </div>
            <div class="tweet-body">${tweetObj.content.text}</div>
            <div class="footer">
              10 days ago
            </div>
          </div>`;
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
    console.log(response);
    renderTweets(response);
  });
};

$(document).ready(function() {
  // --- our code goes here ---
  document.getElementById('add-tweet').children[0].addEventListener("input", (event) => {
    var totalCount = 140 - event.target.value.length;
    $(".counter").text(totalCount);
  });

  $('#add-tweet').on('submit', function(event) {
    event.preventDefault();
    const tweetContent = $(this).find('textarea[name=text]').val();
    console.log(tweetContent);
    const reqOptions = {
      url: '/tweets',
      method: 'POST',
      data: { tweetContent },
    };

    request(reqOptions, tweet => {
      renderTweets([tweet]);
    });
  });

  loadTweets();

});





