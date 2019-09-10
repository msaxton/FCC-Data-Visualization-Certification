// data sources
var education_url = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json"

var map_url = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"

// other variables
var path = d3.geoPath();

// load data
Promise.all([
    d3.json(education_url),
    d3.json(map_url)])
   .then(
    d => ready(null, d[0], d[1])
    );

function ready(error, education, map) {

    // process data
    var eduRates = [];
    education.forEach(function(d){
        var eduRate = d.bachelorsOrHigher;
        eduRates.push(eduRate);
    });
    var eduRatesMin = d3.min(eduRates);
    var eduRatesMax = d3.max(eduRates);

    // create svg element
    var h = 750;
    var w = 1200;
    var svg = d3.select("#visualization")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // color scheme
    var color = d3.scaleThreshold()
                  .domain(d3.range(eduRatesMin, eduRatesMax, (eduRatesMax - eduRatesMin) / 8))
                  .range(d3.schemeBlues[9]);

    // legend
    var legendWidth = 250;
    var legendHeight = 50;
    var legendScale = d3.scaleLinear()
                        .domain([eduRatesMin, eduRatesMax])
                        .range([0, legendWidth]);

    var legendAxis = d3.axisBottom(legendScale);

    var g = svg.append("g")
               .attr("id", "legend")
               .attr("transform", "translate(" + (w / 2) + ", 40)");

    g.selectAll("rect")
        .data(color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = legendScale.domain()[0];
            if (d[1] == null) d[1] = legendScale.domain()[1];
            return d;
            }))
        .enter()
        .append("rect")
        .attr("height", 10)
        .attr("x", (d) => legendScale(d[0]))
        .attr("width", (d) => (legendScale(d[1]) - legendScale(d[0])))
        .attr("fill", (d) => color(d[0]));

    g.append("text")
        .attr("class", "caption")
        .attr("x", legendScale.range()[0])
        .attr("y", -5)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Education rate");

    g.call(d3.axisBottom(legendScale)
        .tickSize(15)
        .tickFormat((x) => Math.round(x) + "%")
        .tickValues(color.domain()))
      .select(".domain")
        .remove();

    // tooltip div
    var tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")
                .attr("data-education", " ")
                .style("opacity", 0);

    // draw map            
    svg.append("g")
       .attr("class", "counties")
       .selectAll("path")
       .data(topojson.feature(map, map.objects.counties).features)
       .enter()
       .append("path")
       .attr("class", "county")
       .attr("data-fips", (d) => d.id)
       .attr("data-education", function(d){
        var result = education.filter(function(obj){
            return obj.fips == d.id;
        });
        if(result[0]){
            return result[0].bachelorsOrHigher;
        }
        // no matching fips:
        console.log("Could not find data for: ", d.id);
        return 0;
       })
       .attr("fill", function(d){
        var result = education.filter(function(obj){
            return obj.fips == d.id;
        });
        if(result[0]){
            return color(result[0].bachelorsOrHigher);
        }
        // no matching fips:
        return color(0)
       })
       .attr("d", path)
       //mouseover
       .on("mouseover", function(d){
        tooltip.style("opacity", 0.9);
        tooltip.html(function(){
            var result = education.filter(function(obj){
                return obj.fips == d.id;
            });
            if(result[0]){
                return result[0].area_name + ', ' + result[0].state + ': ' + result[0].bachelorsOrHigher + '%'
            }
            // no matching fips
            return 0
        })
        .attr("data-education", function() {
            var result = education.filter(function(obj){
                return obj.fips == d.id;
            });
            if(result[0]){
                return result[0].bachelorsOrHigher
            }
            // no matching fips
            return 0
        })
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY) + "px")
        })
            .on("mouseout", function(d) {
                tooltip.style("opacity", 0);
       });

    svg.append("path")
       .datum(topojson.mesh(map, map.objects.states, function(a, b){
            return a !== b;
        }))
       .attr("class", "states")
       .attr("d", path);
};
