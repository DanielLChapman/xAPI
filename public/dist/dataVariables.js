var courseHoverSVG = [],
		courseSelectionSVG = [],
		courseVideoWatchSVG = [],
		avgVideoWatchSVG = [],
		avgNumOfTriesAtQuestions = [],
		coursesWrongQuestions = [];

(function() {
	var http = new XMLHttpRequest();
	var urlMain = "/api/getAllData";
		
	http.open("GET", urlMain, true);
	
	http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
			var JSONResponse = JSON.parse(http.responseText);
			console.log(JSONResponse);
			
			courseHoverSVG = JSONResponse.courseHoverCount;
			courseHoverSVG = courseHoverSVG.map(function(d) {
				return ['Course #' + d.course, d.amount];
			});
			
			courseSelectionSVG = JSONResponse.courseSelectionCount;
			courseSelectionSVG = courseSelectionSVG.map(function(d) {
				return ['Course #' + d.course, d.amount];
			});
			
			courseVideoWatchSVG = JSONResponse.courseVideoWatchCount;
			courseVideoWatchSVG = courseVideoWatchSVG.map(function(d) {
				return ['Video #' + d.course, d.amount];
			});
			
			avgVideoWatchSVG = JSONResponse.courseAverageWatchDuration;
			avgVideoWatchSVG = avgVideoWatchSVG.map(function(d) {
				return ['Video #' + d.course, d.amount];
			});
			
			avgNumOfTriesAtQuestions = JSONResponse.courseQuestions;
			avgNumOfTriesAtQuestions = avgNumOfTriesAtQuestions.map(function(d) {
				return ['Course #' + d.course, d.amount];
			});
			
			coursesWrongQuestions = JSONResponse.courseNumOfWrongQuestions;
			coursesWrongQuestions = coursesWrongQuestions.map(function(d, x) {
				var tempToPush = [];
				if (d.amount == '0,0,0') {
					tempToPush.push(['None', 0]);
				}
				else {
					for (var i = 0; i < d.amount.length; i++) {
						tempToPush.push(['Question ' + i, d.amount[i]]);	
					}
				}
				return tempToPush;
			});
			console.log(coursesWrongQuestions);
																			
			courseHover();
    }
	}
	
	http.send();

})();