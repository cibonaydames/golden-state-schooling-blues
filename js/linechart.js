
function linechart(data) {


 	var fullwidth = 700;
            var fullheight = 600;
            var margin = { top: 20, right: 100, bottom: 50, left: 100};


            var width = fullwidth - margin.left - margin.right;
            var height = fullheight - margin.top - margin.bottom;

        //Set up date formatting and years
            var dateFormat = d3.time.format("%Y");


            var xScale = d3.time.scale()
                                .range([ 0, width]);

            var yScale = d3.scale.linear()
                                .range([ height, 0]);


        //Configure axis generators
            var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom")
                            .ticks(15)
                            .tickFormat(function(d) {
                                return dateFormat(d);
                            })
                            .innerTickSize([5]);

            var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .innerTickSize([0]);

        // add a tooltip to the page - not to the svg itself!
            var linetooltip = d3.select("body")
                .append("div")
                .attr("class", "linetooltip");


        //Create the empty SVG image
            var svg = d3.select("#country-line")
                        .append("svg")
                        .attr("width", fullwidth)
                        .attr("height", fullheight)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var fullwidth = 700;
            var fullheight = 600;
            var margin = { top: 20, right: 100, bottom: 50, left: 100};


            var width = fullwidth - margin.left - margin.right;
            var height = fullheight - margin.top - margin.bottom;

        //Set up date formatting and years
            var dateFormat = d3.time.format("%Y");


            var xScale = d3.time.scale()
                                .range([0, width]);

            var yScale = d3.scale.linear()
                                .range([0, height]);


        //Configure axis generators
            var xAxis = d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom")
                            .ticks(15)
                            .tickFormat(function(d) {
                                return dateFormat(d);
                            })
                            .innerTickSize([5]);

            var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .innerTickSize([0]);



        //Configure line generator
        // each line dataset must have a d.year and a d.amount for this to work.
            var line = d3.svg.line()
                .x(function(d) {
                    return xScale(dateFormat.parse(d.year));
                })

                .y(function(d) {
                    return yScale(+d.amount);
                });

                console.log(data[0]);


                // or you could get this by doing:
                var years = d3.keys(data[0]).slice(1, 7); //

                console.log(years);

                //Create a new, empty array to hold our restructured dataset
                var dataset = [];

                //Loop once for each row in data
                data.forEach(function (d, i) {

                    var stateScore = [];

                    //Loop through all the years - and get the enrollment for this data element
                    years.forEach(function (y) {

                        // If value is not empty
                        if (d[y]) {
                            stateScore.push({
                                state: d.StateName,
                                year: y,
                                amount: d[y]  // this is the value for, for example, d["2004"]
                            });
                        } else {
                        	console.log("empty", d);
                        }

                    });

                    // d is the current data row... from data.forEach above.
                    dataset.push( {
                        state: d.StateName,
                        score: stateScore  // we just built this!
                        } );

                }); // end of the data.forEach loop


                //Uncomment to log the newly restructured dataset to the console
                console.log("dataset", dataset);

                xScale.domain(d3.extent(years, function(d){
                        return dateFormat.parse(d);
                        })
                );

                // the domain is from the max of the emissions to 0 - remember it's reversed.
                yScale.domain([ d3.max(dataset, function(d) {
                        return d3.max(d.score, function(c) {
                            return +c.amount;
                        });
                    }),
 					d3.min(dataset, function(d) {
                        return d3.min(d.score, function(c) {
                            return +c.amount; 
                        }) - 5;
                    })
                ]);
            var color = "gray";
            var groups = svg.selectAll("g.lines")
                    .data(dataset)
                    .enter()
                    .append("g")
                    .attr("class", "lines");

             groups.selectAll("path")
                    .data(function(d) { 
                        return [ d.score ]; // it has to be an array for the line function
                    })
                    .enter()
                    .append("path")
                    .attr("class", "line")
                    .attr("d", line);
                    

            groups.append("text")
                    .text(function(d) { if (d.state==="California") { 
                        return d.state; 
                        }
                    })
                    .attr("y", function(d) {
                        //console.log(d);
                        return yScale(+d.score[d.score.length-1].amount);
                    })
                    .attr("x", xScale(dateFormat.parse("2013")))
                    .attr("class", "line-text")
                    .attr("dy", "-5");


            var circles = groups.selectAll("circle")
                                .data(function(d) { return d.score;})
                                .enter()
                                .append("circle");

                circles.attr("cx", function(d) {
                        return xScale(dateFormat.parse(d.year));
                    })
                    .attr("cy", function(d) {
                        return yScale(+d.amount);
                    })
                    .attr("r", 3)
                    .style("opacity", .1); // this is optional - if you want visible dots or not!

                circles
                    .on("mouseover", mouseoverFunc)
                    .on("mousemove", mousemoveFunc)
                    .on("mouseout", mouseoutFunc);

                //Axes
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);
                
                svg.append("text")
                    .attr("class", "xlabel")
                    .attr("transform", "translate(" + width/2 + " ," +
                        height + ")")
                    .style("text-anchor", "middle")
                    .attr("dy", "35")
                    .text("Year");

                svg.append("text")
                   .attr("class", 'ylabel')
                   .attr("text-anchor", "middle")
                   .attr("transform", "rotate(-90)")
                   .attr("x", -width/2)
                   .attr("y", "0")
                   .attr("dy", "-50")  // change this amount till it works for you
                   .text("NAEP Score"); // label string here        
               

                function mouseoverFunc(d) {
                    d3.selectAll("path.line").classed("unfocused", true);
                        // now undo the unfocus on the current line and set to focused.
                    d3.select(this).select("path.line").classed("unfocused", false).classed("focused", true);

                    d3.select(this)
                        .transition()
                        .style("opacity", 1)
                        .attr("r", 4);
                    linetooltip
                        .style("display", null) // this removes the display none setting from it
                        .html("<p>State: " + d.state +
                                    "<br>Year: " + d.year +
                                  "<br>NAEP Score: " +d.amount + " </p>");
                    }


                function mouseoutFunc(d) {
                    d3.selectAll("path.line").classed("unfocused", false).classed("focused", false);
                        linetooltip.style("display", "none");

                    d3.select(this)
                        .transition()
                        .style("opacity", .1)
                        .attr("r", 3);
                linetooltip.style("display", "none");  // this sets it to invisible!
              }


              function mousemoveFunc(d) {
                    linetooltip
                        .style("top", (d3.event.pageY - 10) + "px" )
                        .style("left", (d3.event.pageX + 10) + "px");
                    }

} // end linechart