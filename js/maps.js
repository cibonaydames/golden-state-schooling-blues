function makeMaps(json, states) {


    var width = 750;
    var height = 400;

    // D3 Projection
    var projection = d3.geo.albersUsa()
                       .translate([width/2, height/2])    // translate to center of screen
                       .scale([750]);          // scale things down so see entire US

    // Define path generator
    var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
                 .projection(projection);  // tell path generator to use albersUsa projection


    //Create SVG element and append map to the SVG



    var map1 = d3.select("#map2013")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Append Div for tooltip to SVG
    var tooltip1 = d3.select("body")
                .append("div")
                .attr("class", "m-tool-tip")
                .style("display", "none");


    
   makeMap1(json, states);
  

function makeMap1(json, states) {

    var statesWithData = states.filter(function(d) { 
        if (d.y2000 !== "") {
            return d;
        }
    });

    // Define linear scale for output
    var map1Color = d3.scale.linear()
              .range(["#41b6c4", "#253494"]);


  /*  var color = d3.scale.linear()
    .domain([-1, 0, 1])
    .range(["red", "white", "green"]);*/


    map1Color.domain(d3.extent(statesWithData,function(s) { return +s.y2013;})); // setting the range of the input data

    // Loop through each state data value in the .csv file
    states.forEach(function(state) {
        // Grab State Name
        var dataState = state.statename; // name
        // Grab data value
        if (state.y2013 !== "") {
            var dataValue = +state.y2013; // number
        } else {
            var dataValue = "missing";
        }

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
    map1.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
            // Get data value for visited
            var value = d.properties.y2013;
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
            tooltip1.html("" + d.properties.name + "'s child poverty rate is" + " " + d.properties.y2013 + "%")
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
    .attr("transform", "translate(610, 175)"); // where we put it on the page!

    var legendColors = d3.legend.color()
    .shapeWidth(20)
    .title("Child Poverty Rate")
    .labelFormat(d3.format("1f" + "%"))
    .scale(map1Color); // our existing color scale

    map1.select(".legendColors")
    .call(legendColors);
   
}  // end map1

}