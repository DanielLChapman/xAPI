var svg = d3.select(".courseHoverSVG");
var width = svg.attr('width'),
    height = svg.attr('height'),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(["#ff8c00", "#8a89a6", "#123", "#FFF", "#0FE", "#d0743c", "#ff8c00"]);

var courseHoverData = courseHoverSVG,
		courseSelectionData = courseSelectionSVG,
		courseVideoWatchData = courseVideoWatchSVG,
		avgVideoWatchData = avgVideoWatchSVG,
		avgNumOfTriesAtQuestionsData = avgNumOfTriesAtQuestions,
		coursesWrongQuestionsData = coursesWrongQuestions;

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d[1]; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var arc;
arcData(courseHoverData);

//Selection Data
svg = d3.select(".courseSelectionSVG");
g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
arcData(courseSelectionData);

//Video Data
svg = d3.select(".courseVideosWatchSVG");
g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
arcData(courseVideoWatchData);

//Video Watch Data
svg = d3.select(".courseVideosWatchSVG");
g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
arcData(courseVideoWatchData);

//Avg Video Watch Data
svg = d3.select(".avgVideosWatchSVG");
g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
arcData(avgVideoWatchData);

//Avg Num of Tries At Questions
svg = d3.select(".avgNumOfTriesAtQuestionsSVG");
g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
arcData(avgNumOfTriesAtQuestionsData);

for (var i = 0; i < coursesWrongQuestionsData.length; i++) {
	var classTemp = ".wrongAnswersFor_" + i;
	svg = d3.select(classTemp);
	g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	arcData(coursesWrongQuestionsData[i]);
}


function arcData(dataToInclude) {
	arc = g.selectAll(".arc")
	.data(pie(dataToInclude))
	.enter().append("g")
		.attr("class", "arc");

  arc.append("path")
		.attr("d", path)
		.attr("fill", function(d) { return color(d.index); });

  arc.append("text")
		.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		.attr("dy", "0.35em")
		.style("text-anchor", "middle")
		.style("fill", "white")
		.text(function(d) {
			var tempReturnString = d.data[0] + " : " + d.value; 
			return tempReturnString
		});
}