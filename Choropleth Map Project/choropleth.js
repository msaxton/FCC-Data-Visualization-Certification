// gather data

// create svg element
var h = 500;
var w = 1200;
var svg = d3.select("#visualization")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// color scheme
var color = d3.scaleThreshold()
              .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))  // figure out a way so this isn't hard coded
              .range(d3.schemeBlues[9]);

// legend
var legendWidth = 300;
var legendHeight = 30;
var legendScale = d3.scaleLinear()
                    .domain([2.6, 75.1])  // figure out a way so that this doesn't have to be hard coded
                    .range([0, legendWidth]);



// tooltip
var tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .attr("data-education", " ")
            .style("opacity", 0);