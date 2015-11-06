(function () {
    //Listeners

    //Getting artists 
    var artist = document.getElementById("find-artist");
    artist.addEventListener("keyup", function () {
        closeLightbox();
        document.getElementById("message").innerHTML = "";
        document.getElementById("artists-container").innerHTML = "";
        var q = artist.value.trim();
        if (q.length > 1) {
            var url = "https://api.spotify.com/v1/search?q=" + escape(q) + "&type=artist";
            var response = handleResponse(httpGet(url));
            if (response) {
                displayArtists(response);
            }
        }
    });

    //Cassette buttons 
    document.getElementById("rewind").addEventListener("click", function () {
        if (this.getAttribute("move") != "") {
            displaySongs(document.getElementById(this.getAttribute("move")));
        }
    });

    document.getElementById("forward").addEventListener("click", function () {
        if (this.getAttribute("move") != "") {
            displaySongs(document.getElementById(this.getAttribute("move")));
        }
    });

    //Close lightbox
    var close = document.getElementById("cassette-close");
    close.addEventListener("click", function () {
        closeLightbox();
    });

    document.addEventListener("click", function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var close = true;
        while (target) {
            if (target.className == "artist-thumb" || target.className == "cassette-wrap fade-in") {
                close = false;
                return false;
            }
            target = target.parentNode;
        }
        if (true) {
            closeLightbox();
        }
    });

})();

function displaySongs(el) {
    //Setting cassette's rewind & forward controls
    var move = "";
    if (el.parentNode.previousSibling) {
        move = el.parentNode.previousSibling.firstChild.getAttribute("id");
    }
    document.getElementById("rewind").setAttribute("move", move);
    move = "";
    if (el.parentNode.nextSibling) {
        move = el.parentNode.nextSibling.firstChild.getAttribute("id");
    }
    document.getElementById("forward").setAttribute("move", move);
    
    openLightbox();
    var preview = document.getElementById("preview-artist");
    preview.setAttribute("src", el.getAttribute("src"));
    document.getElementById("artist-name").innerHTML = el.nextSibling.innerHTML;

    //Loading artist's top tracks
    var url = "https://api.spotify.com/v1/artists/" + el.getAttribute("id") + "/top-tracks?country=US";
    var list = handleResponse(httpGet(url));
    if (list) {
        var items = list.tracks;
        var topList = document.getElementById("top5-artist-list");
        if (items.length > 0) {
            topList.innerHTML = "";
            var ol = document.createElement('ol');
            for (var key in items) {//Loading tracks in a list
                if (items.hasOwnProperty(key)) {
                    var li = document.createElement('li');
                    li.appendChild(document.createTextNode(items[key].name));
                    ol.appendChild(li);
                }
                if (key == 4) {//No more than 5 tracks
                    break;
                }
            }
            topList.appendChild(ol);
        }
        else {
            topList.innerHTML = "No tracks found";
        }
    }
}

function displayArtists(list) {
    var items = list.artists.items;
    if (items) {
        var container = document.getElementById("artists-container");
        container.setAttribute("class", "hide");
        for (var key in items) {
            if (items.hasOwnProperty(key) && typeof items[key].images[0] !== "undefined") {
                //Artists thumbs and titles
                var image = document.createElement("IMG");
                image.setAttribute("src", items[key].images[0].url);
                image.setAttribute("alt", items[key].images[0].url);
                image.setAttribute("key", key);
                image.setAttribute("class", "artist-thumb");
                image.setAttribute("id", items[key].id);

                var span = document.createElement("span");
                span.appendChild(image);
                var label = document.createElement("label");
                label.innerHTML = items[key].name;
                span.appendChild(label);

                container.appendChild(span);

                //On click, display artist's top tracks
                image.addEventListener("click", function () {
                    displaySongs(this);
                });
            }
        }
        container.setAttribute("class", "show");
    }
}

//Requests
function handleResponse(response) {
    response = JSON.parse(response);
    if (typeof response.error !== "undefined") {
        document.getElementById("message").innerHTML = response.error.message;
        return false;
    }
    return response;
}
function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}


//Opens & Closes lightbox
function openLightbox() {
    document.getElementById("cassette-wrap").style.display = "block";
    document.getElementById("lightbox").style.display = "block";
}
function closeLightbox() {
    document.getElementById("cassette-wrap").style.display = "none";
    document.getElementById("lightbox").style.display = "none";
    document.getElementById("top5-artist-list").innerHTML = "";
}