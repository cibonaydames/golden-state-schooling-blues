function enrollmentsmall(data) {

var colorbrewer = {YlGnBu: {
    3: ["#41b6c4","#1d91c0","#225ea8"],
    4: ["#7fcdbb","#41b6c4","#1d91c0","#225ea8"],
    5: ["#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8"],
    6: ["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8"],
    7: ["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494"],
    8: ["#FFD700","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494"],
    9: ["#FFD700","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
    }};

var countries = [];

var margin = {top: 30, right: 15, bottom: 20, left: 45},
    width = 250 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;
var outputDate = d3.time.format("%Y");

var colorScale = d3.scale.ordinal()
    .range(colorbrewer.YlGnBu[5]);

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(3)
  .outerTickSize(0)
  .innerTickSize(0)
  .tickFormat(d3.format("s"));

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .outerTickSize(3)
    .innerTickSize(2)
    .ticks(5);

var current = "Total";

var stack = d3.layout.stack()
    .offset("zero") // try "silhouette" next, that's a streamgraph!
    //.order("inside-out")  // try this and see what you think
    .values(function(d) { return d.values; })
    .x(function(d) { return parseDate(d.Year);})
    .y(function(d) { return +d.Enrollment; });

  // exactly the same except for offset:

// what's another way we can DRY this out? how about just updating the "offset" when we do the redraw below...

var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(parseDate(d.Year)); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });


  //typeFix is a function that parses the dates and sets the strings to numeric. See below!
  console.log("data after load", data);

  // Nest data by symbol.
  counties = d3.nest()
      .key(function(d) { return d.County; })
      .sortKeys(d3.ascending)
     // .key(function(d) { return d.Group;})
      .sortValues(function(a,b) {return parseDate(a.Year) - parseDate(b.Year);})
      .entries(data);

  // Compute the minimum and maximum date across symbols.
  // We assume values are sorted by date.
  x.domain(d3.extent(data, function(s) { return parseDate(s.Year); }));

  var etooltip = d3.select("body")
          .append("div")
          .attr("class", "areatooltip");

  // Add an SVG element for each country, with the desired dimensions and margin.
  var svg = d3.select("#enrollment").selectAll("svg")
      .data(counties)
    .enter().append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .each(multiple); // uses each to call the multiple code for each country

  function multiple(county) {

    var localsvg = d3.select(this);

    var groups = d3.nest()
      .key(function(d) {return d.Group;})
      .entries(county.values);

    var layerdata = stack(groups);

	 y.domain([0, d3.max(layerdata, function(d) {
	      return d3.max(d.values, function(j) {
	            return j.y0 + j.y;
	          });
	    })
	  ]);

  var layers = localsvg.selectAll(".layer")
      .data(layerdata, function(d) {return d.key;});

  layers
    .enter()
    .append("path")
    .attr("class", "layer");

  layers.transition().duration(1000)
    .attr("d", function(d) { return area(d.values); })
    .style("fill", function(d, i) { return colorScale(i); });

   layers
    .on("mouseover", mouseoverFunc)
    .on("mousemove", mousemoveFunc)
    .on("mouseout", mouseoutFunc);

  layers.exit().remove();


    // Add a small label for the symbol name.

    localsvg.append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", -8)
      .style("text-anchor", "middle")
      .text(function(d) { return d.key; });


    localsvg.append("g")
      .attr("class", "y axis")
      .style("font-size", "9px")
      .style("fill", "#FFFFFF")
      .call(yAxis);
    localsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size", "9px")
      .style("fill", "#FFFFFF")
      .call(xAxis);

  } // end multiple

// this function is applied to all the data values on load!

function mouseoverFunc(d) {

  d3.selectAll("path.line").classed("unfocused", true);
    // now undo the unfocus on the current line and set to focused.
  d3.select(this).select("path.line").classed("unfocused", false).classed("focused", true);

  d3.select(this)
    .transition()
    .style("opacity", 1)
    .attr("r", 4);
  etooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p>Group: " + d.key + " </p>");
  }

/*.html("<p>Group: " + d.key +
      "<br>NAEP Score: " +d.Enrollment + " </p>")
*/

function mouseoutFunc(d) {
  d3.selectAll("path.line").classed("unfocused", false).classed("focused", false);
    etooltip.style("display", "none");

  d3.select(this)
    .transition()
    .style("opacity", .75)
    .attr("r", 3);
  etooltip.style("display", "none");  // this sets it to invisible!
}


function mousemoveFunc(d) {
  etooltip
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
  }

}