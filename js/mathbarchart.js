var colorbrewer = {YlGnBu: {
    3: ["#41b6c4","#1d91c0","#225ea8"],
    4: ["#7fcdbb","#41b6c4","#1d91c0","#225ea8"],
    5: ["#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8"],
    6: ["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8"],
    7: ["#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494"],
    8: ["#FFD700","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494"],
    9: ["#FFD700","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
    }};

function mathbarchart(data) {

var margin = {top: 10, right: 20, bottom: 20, left: 200},
    width = 780 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .2);

var y1 = d3.scale.linear();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .outerTickSize(0)
    .innerTickSize(0);

var nest = d3.nest()
    .key(function(d) { return d.group; });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .x(function(d) { return d.Field; })
    .y(function(d) { return +d.Value; })
    .out(function(d, y0) { d.valueOffset = y0; });

var color = d3.scale.ordinal()
    .range(colorbrewer.YlGnBu[7]);

var btooltip = d3.select("body")
            .append("div")
            .attr("class", "b-tool-tip");

var svg = d3.select("#caasppchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dataByGroup = nest.entries(data);

  stack(dataByGroup);
  x.domain(dataByGroup[0].values.map(function(d) { return d.Field; }));
  y0.domain(dataByGroup.map(function(d) { return d.key; }));
  y1.domain([0, d3.max(data, function(d) { return +d.Value; })]).range([y0.rangeBand(), 0]);

  var group = svg.selectAll(".group")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

  group.append("text")
      .attr("class", "group-label")
      .attr("x", -15)
      .attr("y", function(d) { return y1(+d.values[0].Value / 2); })
      .attr("dy", "3px")
      .style("font-size", "12px")
      .style("fill", "#081D58")
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });

  group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return color(d.group); })
      .attr("x", function(d) { return x(d.Field); })
      .attr("y", function(d) { return y1(+d.Value); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return y0.rangeBand() - y1(+d.Value); });

// tooltip

  var rect = group.selectAll("rect");
      
      rect
        .on("mouseover", mouseoverFunc)
        .on("mousemove", mousemoveFunc)
        .on("mouseout", mouseoutFunc);

  group.filter(function(d, i) { return !i; }).append("g")
      .attr("class", "x axis")
      .attr("y", "35")
      .attr("transform", "translate(0," + y0.rangeBand() + ")")
      .attr("dy", "10")
      .style("font-size", "18px")
      .style("fill", "#081D58")
      .style("padding-top", "18px")
      .call(xAxis);

  d3.selectAll("input#math").on("change", change);

  function change() {
    if (this.value === "multiples") transitionMultiples();
    else transitionStacked();
  }

  function transitionMultiples() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
    g.selectAll("rect").attr("y", function(d) { return y1(+d.Value); });
    g.select(".group-label").attr("y", function(d) { return y1(+d.values[0].Value / 2); })
  }

  function transitionStacked() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    g.selectAll("rect").attr("y", function(d) { return y1(+d.Value + d.valueOffset); });
    g.select(".group-label").attr("y", function(d) { return y1(+d.values[0].Value / 2 + d.values[0].valueOffset); })
  }

  //btooltip

  function mouseoverFunc(d) {

  btooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p>CAASPP Math Result for " + d.group + "'s is <b>" + d.Value + "</b></p>");
  }


function mouseoutFunc(d) {
  btooltip
  .style("display", "none");  // this sets it to invisible!
}


function mousemoveFunc(d) {
  btooltip
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
  }

} // end barchart

function readingbarchart(data) {


var margin = {top: 10, right: 20, bottom: 20, left: 200},
    width = 780 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .2);

var y1 = d3.scale.linear();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .outerTickSize(0)
    .innerTickSize(0);

var nest = d3.nest()
    .key(function(d) { return d.group; });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .x(function(d) { return d.Field; })
    .y(function(d) { return +d.Value; })
    .out(function(d, y0) { d.valueOffset = y0; });

var color = d3.scale.ordinal()
    .range(colorbrewer.YlGnBu[7]);

var btooltip = d3.select("body")
            .append("div")
            .attr("class", "b-tool-tip");

var svg = d3.select("#readingchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dataByGroup = nest.entries(data);

  stack(dataByGroup);
  x.domain(dataByGroup[0].values.map(function(d) { return d.Field; }));
  y0.domain(dataByGroup.map(function(d) { return d.key; }));
  y1.domain([0, d3.max(data, function(d) { return +d.Value; })]).range([y0.rangeBand(), 0]);

  var group = svg.selectAll(".group")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

  group.append("text")
      .attr("class", "group-label")
      .attr("x", -15)
      .attr("y", function(d) { return y1(+d.values[0].Value / 2); })
      .attr("dy", "3px")
      .style("font-size", "12px")
      .style("fill", "#081D58")
      .style("text-anchor", "end")
      .text(function(d) { return d.key; });

  group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      .style("fill", function(d) { return color(d.group); })
      .attr("x", function(d) { return x(d.Field); })
      .attr("y", function(d) { return y1(+d.Value); })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return y0.rangeBand() - y1(+d.Value); });

  // tooltip

  var rect = group.selectAll("rect");
      
      rect
        .on("mouseover", mouseoverFunc)
        .on("mousemove", mousemoveFunc)
        .on("mouseout", mouseoutFunc);

   group.filter(function(d, i) { return !i; }).append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y0.rangeBand() + ")")
      .style("font-size", "18px")
      .style("fill", "#081D58")
      .style("padding-top", "18px")
      .call(xAxis);

  d3.selectAll("input#reading").on("change", change);

  function change() {
    if (this.value === "multiples") transitionMultiples();
    else transitionStacked();
  }

  function transitionMultiples() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
    g.selectAll("rect").attr("y", function(d) { return y1(+d.Value); });
    g.select(".group-label")
    .attr("y", function(d) { return y1(+d.values[0].Value / 2); })
  }

  function transitionStacked() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    g.selectAll("rect").attr("y", function(d) { return y1(+d.Value + d.valueOffset); });
    g.select(".group-label").attr("y", function(d) { return y1(+d.values[0].Value / 2 + d.values[0].valueOffset); })
  }

  //btooltip

  function mouseoverFunc(d) {

  btooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p>CAASPP Reading Result for " + d.group + "'s is <b>" + d.Value + "</b></p>");
  }

function mouseoutFunc(d) {
  btooltip
  .style("display", "none");  // this sets it to invisible!
}


function mousemoveFunc(d) {
  btooltip
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
  }

} // end barchart

d3.select("div#readingchart").style("display", "none");
d3.select("div#caasppchart").style("display", "inline");

d3.select("button#readingbutton").on("click", function() {
  d3.select("div#caasppchart").style("display", "none");
	d3.select("div#readingchart").style("display", "inline");

	// style button so it looks selected! d3.select(this)

});

d3.select("button#mathbutton").on("click", function() {
	d3.select("div#readingchart").style("display", "none");
	d3.select("div#caasppchart").style("display", "inline");
});
	// same as above

    

          

           




