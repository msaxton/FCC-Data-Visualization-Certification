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
	var tempColors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8",                "#abd9e9","#74add1","#4575b4","#313695"];

	var years = [];
	dataset.forEach(function(d){
		years.push(d.year);
	});
	

	// create svg element
	var h = 500;
	var w = 1200;
	var m = {top: 30, right: 0, bottom: 50, left: 60};

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

	var yScale = d3.scaleBand()
	               .range([0, h]) 
	               .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

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
                 	return d3.timeFormat("%B")(date);
                 });

	svg.append("g")
	   .attr("id", "y-axis")
	   .attr("transform", "translate(" + m.left + "," + m.top + ")")
	   .call(yAxis);

	// title

	// description

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
	   // })
	   });



});