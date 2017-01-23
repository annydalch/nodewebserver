var refresh = function(id_str) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        switch (this.readyState) {
            case 4:
                console.log("received response");
                if (this.status == 200) {
                    var ul = document.getElementById('twitterTimeline');
                    var tweets = JSON.parse(this.responseText);
                    var tweet;
                    for (tweet of tweets) {
                        var li = document.createElement('LI');
                        var titlep = document.createElement('P');
                        var contentp = document.createElement('P');
                        titlep.class = "username";
                        contentp.class = "text";
                        titlep.appendChild(document.createTextNode(tweet.user.name));
                        contentp.appendChild(document.createTextNode(tweet.text));
                        li.appendChild(titlep);
                        li.appendChild(contentp);
                        ul.insertBefore(li, ul.childNodes[0]);
                    }
                    if (tweets[0]) {
                        document.getElementById("refresh").onclick = "refresh(" + tweets[0].id_str + ")";
                    }
                }
        }
    };
    xhttp.open('GET', '/twitter/' + id_str, true);
    xhttp.send();
    console.log("sending request");
}
