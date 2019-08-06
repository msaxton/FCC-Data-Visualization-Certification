 var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).then(function(data){

	// data pre-process

  var formatMinSec = d3.timeFormat("%M:%S");  // to be used later

  data.forEach(function(d){
    var parsedTime = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
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
  
  var xScale = d3.scaleLinear()
                 .range([0, w])
                 .domain([d3.min(data, function(d){
                          return d.Year - 1;
                        }),
                        d3.max(data, function(d){
                          return d.Year +1;
                        })]);

	var yScale = d3.scaleTime()
	               .range([0, h])  // keep smallest time on top
	               .domain(d3.extent(data, function(d){
	               	return d.Time;
	               }))
                 .nice();

	// create axes
	var xAxis = d3.axisBottom(xScale)
                 .tickFormat(d3.format("d"));

	var yAxis = d3.axisLeft(yScale)
	              .tickFormat(d3.timeFormat("%M:%S"));

	// create tool tip
  var div = d3.select("body")
              .append("div")
              .attr("id", "tooltip")
              .attr("data-year", " ")
              .style("opacity", 0);

	// draw graph
	svg.append("g")
	   .attr("id", "graph")
	   .attr("transform", "translate(" + m + "," + m + ")")
	   .selectAll("circle")
	   .data(data)
	   .enter()
	   .append("circle")
	   .attr("cx", (d) => xScale(d.Year))
	   .attr("cy", (d) => yScale(d.Time))
	   .attr("r", 5)
	   .style("fill", function(d){
	   	return color(d.Doping != "");
	   })
	   .attr("class", "dot")
	   .attr("data-xvalue", (d) => d.Year)
	   .attr("data-yvalue", (d) => d.Time.toISOString())
     // tooltip display
     .on("mouseover", function(d){
      div.transition()
         .duration(200)
         .style("opacity", 0.9);
      div.html(d.Name + ", " + d.Nationality + "<br>" + 
               "Year: " + d.Year + "<br>" +
               "Time: " + formatMinSec(d.Time) + "<br>" +
               d.Doping)
         .attr("data-year", d.Year)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY) + "px");
     })
     .on("mouseout", function(d){
      div.transition()
         .duration(200)
         .style("opacity", 0);
     });
  
  // append axes
  svg.append("g")
     .attr("id", "x-axis")
     .attr("class", "axis")
     .attr("transform", "translate(" + m + "," + (h + m) + ")")
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
     .attr("transform", "translate(" + m + "," + m + ")")
     .call(yAxis);

  svg.append("text")
     .attr("id", "y-axis-label")
     .attr("class", "axis-label")
     .attr("x", 0)
     .attr("y", (h + m * 2) / 2)
     .attr("transform", "rotate(-90, 0, " + ((h + m * 2) / 2 - 18.5) +")")  // the 18.5 aligns rotate point
     .text("Time");
  
  // title
  svg.append("text")
     .attr("id", "title")
     .attr("x", (w + m * 2) / 2)
     .attr("y", m)
     .text("Doping in Professional Cycling");

  // url for data
  svg.append("text")
     .attr("id", "data-url")
     .attr("x", w)
     .attr("y", (h + m * 2))
     .html("<a href='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'>Data Source</a>");

  // legend
  var legendRectSize = 18;
  var legendSpacing = 4;

  var legend = svg.selectAll(".legend")
                  .data(color.domain())
                  .enter()
                  .append("g")
                  .attr("class", "legend")
                  .attr("id", "legend")
                  .attr("transform", function(d, i) {
                    var spacing = 20
                    var x = w - m - 18;
                    var y = (h / 2) + spacing * i;
                    return "translate(" + x + "," + y + ")";  
                  });

  legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", color)
        .style("stroke", color);

  legend.append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .text(function(d){
          console.log((d));
          if (d) {
            return "Doping Allegations";
          } else {
            return "No Doping Allegations";
          }
        });
});