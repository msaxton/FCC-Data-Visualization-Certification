 var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).then(function(data){
	// data pre-process
  
  // get array of years for x-axis, better way to do this?
  var years = data.map(function(d){
  	year = d.Year
  	return year
  });

  var parseMinSec = d3.timeParse("%M:%S");
  var formatMinSec = d3.timeFormat("%M:%S");

  data.forEach(function(d){
  	d.Time = parseMinSec(d.Time);
  });

  var parseYear = d3.timeParse("%Y");
  var formatYear = d3.timeFormat("%Y")

  data.forEach(function(d){
  	d.Year = parseYear(d.Year);
  });

  var color = d3.scaleOrdinal(d3.schemeCategory10);

	// create svg element
	var w = 900;
	var h = 400;
	var m = 80;

	var svg = d3.select("body")
	            .append("svg")
	            .attr("width", (w + m * 2))
	            .attr("height", (h + m * 2));

	// create scales
	var xScale = d3.scaleTime()
	               .range([0, w])
	               .domain(d3.extent(data, function(d){
	               	return d.Year;
	               }))
	               .nice();

	var yScale = d3.scaleTime()
	               .range([0, h])  // keep smallest time on top
	               .domain(d3.extent(data, function(d){
	               	return d.Time;
	               }))
	               .nice();

	// create axes
	var xAxis = d3.axisBottom(xScale);

	var yAxis = d3.axisLeft(yScale)
	              .tickFormat(d3.timeFormat("%M:%S"));


	// create tool tip
  var div = d3.select("body")
              .append("div")
              .attr("id", "tooltip")
              .attr("data-year", " ")
              .style("opacity", 0);

	// fill in data
	svg.append("g")
	   .attr("id", "graph")
	   .attr("transform", "translate(" + m + "," + m + ")")
	   .selectAll("circle")
	   .data(data)
	   .enter()
	   .append("circle")
	   .attr("cx", (d) => xScale(d.Year))
	   .attr("cy", (d) => yScale(d.Time))
	   .attr("r", 3)
	   .style("fill", function(d){
	   	return color(d.Doping != "");
	   })
	   .attr("class", "dot")
	   .attr("data-xvalue", (d) => formatYear(d.Year))
	   .attr("data-yvalue", (d) => formatMinSec(d.Time))
     // tooltip display
     .on("mouseover", function(d){
      div.transition()
         .duration(200)
         .style("opacity", 0.9);
      div.html(d.Name + ", " + d.Nationality + "<br>" + 
               "Year: " + formatYear(d.Year) + "<br>" +
               "Time: " + formatMinSec(d.Time) + "<br>" +
               d.Doping)
         .attr("data-year", formatYear(d.Year))
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY) + "px");
     })
     .on("mouseout", function(d){
      div.transition()
         .duration(200)
         .style("opacity", 0);
     });
  
  svg.append("g")
     .attr("id", "x-axis")
     .attr("class", "axis")
     .attr("transform", "translate(" + m + "," + (h + m + 5) + ")")
     .call(xAxis);

  svg.append("text")
     .attr("id", "x-axis-label")
     .attr("class", "axis-label")
     .attr("x", (w + m * 2) / 2)
     .attr("y", h + m + 40)
     .text("Year");

  svg.append("g")
     .attr("id", "y-axis")
     .attr("class", "axis")
     .attr("transform", "translate(" + (m - 10) + "," + m + ")")
     .call(yAxis);

  svg.append("text")
     .attr("id", "y-axis-label")
     .attr("class", "axis-label")
     .attr("x", 0)
     .attr("y", (h + m * 2) / 2)
     .attr("transform", "rotate(-90, 0, " + ((h + m * 2) / 2 - 18.5) +")")  // the 18.5 aligns rotate point
     .text("Time");

  svg.append("text")
     .attr("id", "title")
     .attr("x", (w + m * 2) / 2)
     .attr("y", m)
     .text("Some Title");

  // legend
  var legendRectSize = 18;
  var legendSpacing = 4;

  var legend = svg.selectAll('.legend')
                  .data(color.domain())
                  .enter()
                  .append('g')
                  .attr('class', 'legend')
                  .attr('transform', function(d, i) {
                    var spacing = 20
                    var x = w - 18;
                    var y = (h / 2) + spacing * i;
                    return 'translate(' + x + ',' + y + ')';  
                  });

  legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

  legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d){
          console.log((d));
          if (d) {
            return "Doping Allegations";
          } else {
            return "No Doping Allegations";
          }
        });
});