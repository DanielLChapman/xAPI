var svg = d3.select(".courseHoverSVG");
var width = svg.attr('width'),
    height = svg.attr('height'),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(["#ff8c00", "#8a89a6", "#123", "#FFF", "#0FE", "#d0743c", "#ff8c00"]);

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

function courseHover() {
	svg = d3.select(".courseHoverSVG");
	g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	arcData(courseHoverSVG);
	
	//Selection Data
	barData(".courseSelectionSVG", courseSelectionSVG);
	
	//Video Data
	svg = d3.select(".courseVideosWatchSVG");
	g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	arcData(courseVideoWatchSVG);

	//Avg watch time
	barData(".avgVideosWatchSVG", avgVideoWatchSVG);


	//Avg Num of Tries At Questions
	svg = d3.select(".avgNumOfTriesAtQuestionsSVG");
	g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	arcData(avgNumOfTriesAtQuestions);
	
	console.log(coursesWrongQuestions);

	for (var i = 0; i < coursesWrongQuestions.length; i++) {
		
		var classTemp = "wrongAnswersFor_" + i;
		
		if (coursesWrongQuestions[i][0][0] == 'None') {
			var tempClassName = 'noWrongAnswersFor_' + i;
			document.getElementsByClassName(classTemp)[0].style.display = 'none';
			document.getElementsByClassName(tempClassName)[0].style.display = 'block';
		}
		else {
			classTemp = "."+classTemp;
			svg = d3.select(classTemp);
			g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
			arcData(coursesWrongQuestions[i]);
		}
	}

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


function barData(svgLocation, dataToInclude) {
	var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
	
	svg = d3.select(svgLocation).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleBand().range([0, width], .05);
	var y = d3.scaleLinear().range([height, 0]);

	var xAxis = d3.axisBottom(x)

	var yAxis = d3.axisLeft(y)
			.ticks(10);


	dataToInclude.forEach(function(d) {
		d.name = d[0];
		d.value = d[1];
	});
	
	x.domain(dataToInclude.map(function(d) { return d.name; }));
	y.domain([0, d3.max(dataToInclude, function(d) { return d.value; })]);
	
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(dataToInclude)
    	.enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.name)+10; })
      .attr("width", x.bandwidth()-20)
      .attr("y", function(d) { return  y(d.value); })
      .attr("height", function(d) { return height - y( d.value); });


}
