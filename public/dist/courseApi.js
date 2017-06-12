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
        console.log('updated');
    }
	}
	
	http.send();
}


var videoWatched = 0;
var isPlaying = 0;
var timeStartedPlaying = Date.now();

if ( location.href.match(/course/) && !location.href.match(/courses/) ) {
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
		apiUpdate('videoWatched', videoWatched, timeStartedPlaying);
		
		if (isPlaying == 1) {
			console.log(timeStartedPlaying);
		}
	}
}
//enter page, loop until duration has changed, and then record the time it started playing into the database
//When they go to leave the page, first, record the duration played and the time they left. 
//When you leave the video page, we should push the records of the current video to the records incase we need to watch the video more then once. Or, we make videos an array and wait to push all the information until we leave the page, will have to figure out which one will be better. 

//Date leave can be set when we transfer pages. 