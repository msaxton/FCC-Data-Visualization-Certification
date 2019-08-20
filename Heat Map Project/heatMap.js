// url for data
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

d3.json(url).then(function(data){
	// process data
	var baseTemp = data.baseTemperature;
	var dataset = data.monthlyVariance;

	var temps = [];
	dataset.forEach(function(d){
		var temp = baseTemp + d.variance
		temps.push(temp)
	});

	var maxTemp = d3.max(temps)
	var minTemp = d3.min(temps)
	var tempColors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090",
	                  "#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"];

	var years = [];
	dataset.forEach(function(d){
		years.push(d.year);
	});

	dataset.forEach(function(d) {
		d.month -= 1;
		});

	// create svg element
	var h = 500;
	var w = 1200;
	var m = {top: 45, right: 0, bottom: 125, left: 75};

	var svg = d3.select("#chart")
	            .append("svg")
	            .attr("width", w + m.right + m.left)
	            .attr("height", h + m.top + m.bottom);

	// create div for tooltip
	var div = d3.select("body")
	            .append("div")
	            .attr("id", "tooltip")
	            .attr("data-year", " ")
	            .style("opacity", 0);

	// scales
	var xScale = d3.scaleBand()
	               .range([0, w])
	               .domain(years);

	var yScale = d3.scaleBand()  // changed for Jan to be first
	               .range([0, h]) 
	               .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

  var values = yScale.domain()  // test
	values.forEach(function(val){  // test
		console.log(val, yScale(val));  // test
	});  // test

	var tempScale = d3.scaleThreshold()
	                  .domain((function(min, max, count){
	                  	var array= [];
	                  	var step = (max - min) / count;
	                  	for(var i = 1; i < count; i++){
	                  		array.push(min + i * step);
	                  	}
	                  	return array;
	                  })(minTemp, maxTemp, tempColors.length)) // values to split on
	                  .range(tempColors.reverse());
	                  
	// axes
  var xAxis = d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function(year){
            	  return year%10 === 0;
               }));

	svg.append("g")
	   .attr("id", "x-axis")
	   .attr("transform", "translate("+ m.left + "," + (h + m.top) + ")")
	   .call(xAxis);
  
   var yAxis = d3.axisLeft(yScale)
                 .tickValues(yScale.domain())
                 .tickFormat(function(month){
                 	var date = new Date(0);
                 	date.setUTCMonth(month);
                 	return d3.utcFormat("%B")(date);
                 });

	svg.append("g")
	   .attr("id", "y-axis")
	   .attr("transform", "translate(" + m.left + "," + m.top + ")")
	   .call(yAxis);

	// title
	svg.append("text")
	   .attr("id", "title")
	   .attr("x", ((m.left + m.right + w) / 2))
	   .attr("y", (m.top / 2))
	   .text("Global Temperatures");

	// description
	svg.append("text")
	   .attr("id", "description")
	   .attr("x", (m.left + w))
	   .attr("y", (m.top + h + m.bottom - 80))
	   .style("text-anchor", "end")
	   .text("Heat Map of Global Temperatures from 1753 to 2015");

  // legend
  var legendWidth = 400;
  var legendHeight = 30;

  var legendScale = d3.scaleLinear()
                      .domain([minTemp, maxTemp])
                      .range([0, legendWidth]);

  var legendAxis = d3.axisBottom(legendScale)
                     .tickSize(10, 0)
                     .tickValues(tempScale.domain())
                     .tickFormat(d3.format(".1f"));

  var legend = svg.append("g")
                  .attr("id", "legend")
                  .attr("transform", "translate(" + m.left + "," + (m.top + h + m.bottom - 80) + ")");

  legend.append("g")
        .selectAll("rect")
        .data(tempScale.range().map(function(color) {
        	var d = tempScale.invertExtent(color);
        	if (d[0] == undefined) d[0] = legendScale.domain()[0];
        	if (d[1] == undefined) d[1] = legendScale.domain()[1];
        	return d;
        }))
        .enter()
        .append("rect")
        .style("fill", (d) => tempScale(d[0]))
        .attr("x", (d) => legendScale(d[0]))
        .attr("y", 0)
        .attr("width", (d) => (legendScale(d[1]) - legendScale(d[0])))
        .attr("height", legendHeight);

  legend.append("g")
        .attr("transform", "translate(0, " + legendHeight + ")")
        .call(legendAxis);

  legend.append("text")
        .attr("id", "legend-description")
        .attr("x", 0)
        .attr("y", (legendHeight + 40))
        .text("Temperature in Celsius")

	// draw graph
	svg.append("g")
	   .attr("id", "graph")
	   .attr("transform", "translate(" + m.left + "," + m.top + ")")
	   .selectAll("rect")
	   .data(dataset)
	   .enter()
	   .append("rect")
	   .attr("class", "cell")
	   .attr("data-month", (d) => d.month)
	   .attr("data-year", (d) => d.year)
	   .attr("data-temp", (d) => baseTemp + d.variance)
	   .attr("x", (d) => xScale(d.year))
	   .attr("y", (d) => yScale(d.month))
	   .attr("width", xScale.bandwidth())  
	   .attr("height", yScale.bandwidth())
	   .style("fill", (d) => tempScale(baseTemp + d.variance))
	   // tooltip display
	   .on("mouseover", function(d){
	   	div.transition()
	   	   .duration(200)
	   	   .style("opacity", 0.9)
	   	div.html("Year: " + d.year + "<br>" +
	   	        "Temperature: " + (d.variance + baseTemp) + "<br>" +
	   	        "Variance: " + d.variance + "<br>")
	   	    .attr("data-year", d.year)
	   	    .style("left", (d3.event.pageX) + "px")
	   	    .style("top", (d3.event.pageY) + "px"); 
	   	})
	   .on("mouseout", function(d){
	   	div.transition()
	   	   .duration(200)
	   	   .style("opacity", 0);
	   });



});