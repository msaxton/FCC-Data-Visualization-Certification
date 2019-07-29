// d3 bar chart

// get data
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// reflects d3 v.5 using "promises" instead of callbacks

d3.json(url).then(function(data) {
  // set up svg element
	var margin = 75;
  var w = 1000;
  var h = 400;

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w + 2 * margin)
              .attr("height", h + 2 * margin);

  // dataset
  var dataset = data.data;


  // get date object from data
  var dates = dataset.map(function(d) { return new Date(d[0]); });
  
  // set up scales
  var xScale = d3.scaleTime()
                 .domain(d3.extent(dates))
                 .range([0, w]);

  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, (d) => d[1])])
                 .range([h, 0]);

  //set up tool tip
  var div = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")
                  .attr("data-date", " ")
                  .style("opacity", 0);

  var tipDates = dataset.map(function(d) {

  	            var month;

  	            var mm = d[0].substring(5,7);

  	            if(mm === "01"){
  	            	month = "January";
  	            }
  	            else if(mm === "04"){
  	            	month = "April";
  	            }
  	            else if(mm === "07"){
  	            	month = "July";
  	            }
  	            else if(mm === "10"){
  	            	month = "October";
  	            };

  	            var year = d[0].substring(0,4);

  	            return month + " " + year;
  });

  // build graph
  svg.append("g")
        .attr("id", "graph")
        .attr("transform", "translate(" + margin + ", " + margin + ")")
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d, i) => i * (w / dataset.length))
      .attr("y", (d) => yScale(d[1]))  // height
      .attr("width", (w / dataset.length))
      .attr("height", (d) => h - yScale(d[1]))
      // tool tip display
      .on("mouseover", function(d, i){
      	div.transition()
      	    .duration(200)
      	    .style("opacity", .9);
        div.html("Date: " + tipDates[i] + "<br> GDP: $" + d[1] + " billion")
           .attr("data-date", dataset[i][0])
           .style("left", (d3.event.pageX) + 15 + "px")
           .style("top", (d3.event.pageY - 50) + "px");
      })
      .on("mouseout",function(d){
      	div.transition()
      	     .duration(500)
      	     .style("opacity", 0);
      });

  // graph metadata
  var title = data.name;

  svg.append("text")
    .attr("id", "title")
    .attr("x", ((w + 2 * margin) / 2))
    .attr("y", margin)
    .attr("text-anchor", "middle")
    .text(title);

  // set up axes
  

  var xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin + "," + (h + margin) + ")")
    .call(xAxis);

   svg.append("text")
      .attr("id", "x-axis-label")
      .attr("class", "axis-label")
      .attr("x", ((w + 2 * margin) / 2))
      .attr("y", (h + 2 * margin) - 20)
      .text("Year");

  var yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(yAxis);

  svg.append("text")
    .attr("id", "y-axis-label")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("x", (0 - (h + margin * 2) / 2))
    .attr("dy", "1em")
    .text("USD in Billions");
});
