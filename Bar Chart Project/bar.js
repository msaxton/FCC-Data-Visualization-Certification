// set up svg
var margin = 50;
var w = 1200;
var h = 400;



var svg = d3.select("body")
            .append("svg")
            .attr("width", w + 2 * margin)
            .attr("height", h + 2 * margin);
						

// get data
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// reflects d3 v.5 using "promises" instead of callbacks

d3.json(url).then(function(data) {

  var dataset = data.data;

  var dates = dataset.map(function(d) { return new Date(d[0]); });  // this is return early dates
console.log(dates);
  var xScale = d3.scaleTime()
                 .domain(d3.extent(dates))
                 .range([0, w]);

  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(dataset, (d) => d[1])])
                 .range([h, 0]);  // height

  svg.append("g")
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
      .attr("height", (d) => h - yScale(d[1]));  // height

  var yAxis = d3.axisLeft(yScale);

  var xAxis = d3.axisBottom(xScale);

                

  svg.append("text")
    .attr("id", "title")
    .attr("x", w /2)
    .attr("y", margin)
    .attr("text-anchor", "middle")
    .text("Some Graph");

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(yAxis);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(" + margin + "," + (h + margin) + ")")
    .call(xAxis);


});
