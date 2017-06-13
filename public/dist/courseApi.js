function apiUpdate(type, oid, oid2) {
	var http = new XMLHttpRequest();
	var urlMain = '';
	var url = '';
	switch(type) {
		case 'hover': 
			url="apiUpdateHover";
			break;
			
		case 'videoWatched':
			url="apiUpdateVideo";
			break;
	}
	if (oid2) {
		urlMain = "/api/"+url+"/" + type + "/" + oid + "/" + oid2;
	}
	else {
		urlMain = "/api/"+url+"/" + type + "/" + oid;
	}
	http.open("POST", urlMain, true);
	 
	http.setRequestHeader("Content-type", "application/json");
	
	http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        return 'Updated'
    }
	}
	
	http.send();
}


var videoWatched = 0;
var isPlaying = 0;
var timeStartedPlaying = Date.now();

if ( location.href.match(/course/) && !location.href.match(/courses/) && !location.href.match(/questions/) ) {
    var t = setInterval(function () {
    if(video.readyState > 0) {
				try {
					var watched = video.played.end(0);
					if (watched > 0) {
						videoWatched = watched;
						if (isPlaying == 0) {
							isPlaying = 1; 
							timeStartedPlaying = Date.now();
							console.log(timeStartedPlaying);
						}
					}
				} catch(err) {
				}
    }
}, 500);
	
	function moveToQuestions() {
		var moveOn = '/';
		moveOn = apiUpdate('videoWatched', videoWatched, timeStartedPlaying);
		var at = setInterval(function() {
			if (moveOn = 'Updated') {
				clearInterval(t);
				clearInterval(at);
				location.href = location.href + "/questions/";
			}
		}, 500);
	}
}
