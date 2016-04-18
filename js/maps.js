
//Width and height of map

function makeMaps(json, states) {


    var width = 960;
    var height = 500;

    // D3 Projection
    var projection = d3.geo.albersUsa()
                       .translate([width/2, height/2])    // translate to center of screen
                       .scale([1000]);          // scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                 .projection(projection);  // tell path generator to use albersUsa projection


    //Create SVG element and append map to the SVG



    var map1 = d3.select("#map2000")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Append Div for tooltip to SVG
    var tooltip1 = d3.select("body")
                .append("div")
                .attr("class", "tool-tip")
                .style("display", "none");


    var map2 = d3.select("#Map2013")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Append Div for tooltip to SVG
    var tooltip2 = d3.select("body")
                .append("div")
                .attr("class", "tool-tip")
                .style("display", "none");

   makeMap1(json, states);
   makeMap2(json, states);

function makeMap1(json, states) {

    var statesWithData = states.filter(function(d) { 
        if (d.y2000 !== "") {
            return d;
        }
    });

    // Define linear scale for output
    var map1Color = d3.scale.linear()
              .range(["lightgreen", "green"]);

    map1Color.domain(d3.extent(statesWithData,function(s) { return +s.y2000;})); // setting the range of the input data

    // Loop through each state data value in the .csv file
    states.forEach(function(state) {
        // Grab State Name
        var dataState = state.statename; // name
        // Grab data value
        if (state.y2000 !== "") {
            var dataValue = +state.y2000; // number
        } else {
            var dataValue = "missing";
        }

        // Find the corresponding state inside the GeoJSON
        json.features.forEach(function(j) {
            var jsonState = j.properties.name;
            if (dataState == jsonState) { // assumes the names will match...
                // Copy the data value into the JSON
                j.properties.y2000 = dataValue;
            // Stop looking through the JSON
            }
        });
    }); // ends data merge


    // Bind the data to the SVG and create one path per GeoJSON feature
    map1.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
            // Get data value for visited
            var value = d.properties.y2000;
            if (value !== "missing") {
                return map1Color(value);
            } else {
                return "lightgray";
            }
        })
        .on("mouseover", function(d) {
            tooltip1.transition()
               .duration(200)
               .style("display", null);
            tooltip1.html("" + d.properties.name + "'s students average score is" + " " + d.properties.y2000 + ".")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        // fade out tooltip on mouse out
        .on("mouseout", function(d) {
            tooltip1.transition()
               .duration(500)
               .style("display", "none");
        });

    map1.append("g")
    .attr("class", "legendColors")
        .attr("transform", "translate(800, 300)"); // where we put it on the page!

    var legendColors = d3.legend.color()
    .shapeWidth(20)
    .title("Average NAEP Results")
    .labelFormat(d3.format("1f"))
    .scale(map1Color); // our existing color scale

    map1.select(".legendColors")
    .call(legendColors);
   
}  // end map1

function makeMap2(json, states) {


        // Define linear scale for output
    var map2Color = d3.scale.linear()
              .range(["lightgreen", "green"]);
    
    map2Color.domain(d3.extent(states,function(s) { return +s.y2013;})); // setting the range of the input data

    // Loop through each state data value in the .csv file
    states.forEach(function(state) {
        // Grab State Name
        var dataState = state.statename; // name
        // Grab data value
        var dataValue = +state.y2013; // number

        // Find the corresponding state inside the GeoJSON
        json.features.forEach(function(j) {
            var jsonState = j.properties.name;
            if (dataState == jsonState) { // assumes the names will match...
                // Copy the data value into the JSON
                j.properties.y2013 = dataValue;
            // Stop looking through the JSON
            }
        });
    }); // ends data merge


    // Bind the data to the SVG and create one path per GeoJSON feature
    map2.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
            // Get data value for visited
            var value = d.properties.y2013;
            return map2Color(value);
        })
        .on("mouseover", function(d) {
            tooltip2.transition()
               .duration(200)
               .style("display", null);
            tooltip2.html("" + d.properties.name + "'s students average score is" + " " + d.properties.y2013 + ".")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
        })
        // fade out tooltip on mouse out
        .on("mouseout", function(d) {
            tooltip2.transition()
               .duration(500)
               .style("display", "none");
        });

    map2.append("g")
    .attr("class", "legendColors")
        .attr("transform", "translate(800, 300)"); // where we put it on the page!

    var legendColors = d3.legend.color()
    .shapeWidth(20)
    .title("Average NAEP Results")
    .labelFormat(d3.format("1f"))
    .scale(map2Color); // our existing color scale

    map2.select(".legendColors")
    .call(legendColors);


    } // end map 2

}