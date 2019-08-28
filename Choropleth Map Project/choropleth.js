// gather data

// create svg element
var h = 500;
var w = 1200;
var svg = d3.select("#visualization")
            .append("svg")
            .attr("width", w)
            .attr("height", h);


// legend

// tooltip
var tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .attr("data-education", " ")
            .style("opacity", 0);