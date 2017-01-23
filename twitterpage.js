const twitter = require("twitter");
const fs = require("fs");

var client;

var tweets;

var exports = module.exports = {};

try {
    client = new twitter(JSON.parse(fs.readFileSync("secret.json", "utf8")));
}
catch (err) {
    console.log("ERROR: " + err);
    client = false;
};

var refreshTweets = function() {
    if (client) {
        var params = {
            screen_name: "qotd_bot",
            count: 30
        };
        client.get("statuses/user_timeline", params, (error, tweetsInResponse, response) => {
            if (error) {
                console.log("error: " + error);
            }
            else {
                tweets = tweetsInResponse;
            }
        })
    }
}

var getTweets = function(callback, id) {
    if (client) {
        var params = {
            screen_name: "qotd_bot",
            count: 30
        };
        if (typeof id === 'string') {
            params.since_id = id;
        };
        client.get("statuses/user_timeline", params, (error, tweetsInResponse, response) => {
            if (error) {
                console.log("error: " + error);
            } else {
                callback(tweetsInResponse);
            }
        })
    }
}

exports.tweets = tweets;
exports.refreshTweets = refreshTweets;
exports.getTweets = getTweets;
