//<script type="text/javascript" src="stupidtable.js"></script>

function caltable(data) {

			//Load in contents of CSV file, and do things to the data.

				// We'll be using simpler data as values, not objects.
				var myArray = [];

				// this is a new variable, to make it easier to do a color scale.
				// alternately, you could extract these values with a map function.
				var allTotal = [];

				data.forEach(function(d, i){

					d.year2000 = +d.year2000; // converts item to a number
					d.year2003 = +d.year2003; // converts item to a number
					d.year2005 = +d.year2005; // converts item to a number
					d.year2007 = +d.year2007; // converts item to a number
					d.year2009 = +d.year2009; // converts item to a number
					d.year2011 = +d.year2011; // converts item to a number
					d.year2013 = +d.year2013; // converts item to a number

					// now we add another data object value, a calculated value.
					//d.Total = d.year2000 + d.year2003 + d.year2005 + d.year2007 + d.year2009 + d.year2011 + d.year2013;

				 // Add an array to the empty array with the values of each:
			 	 myArray.push([d.Group, d.year2000, d.year2003, d.year2005, d.year2007, d.year2009, d.year2011, d.year2013]);

         // this is just a convenience, another way would be to use a function to get the values in the d3 scale.
			 	 allTotal.push(d.Total);

					d["2000"] = d.year2000; // you can't use dot notation with a number
					d["2003"] = d.year2003;
					d["2005"] = d.year2005;
					d["2007"] = d.year2007;
					d["2009"] = d.year2009;
					d["2011"] = d.year2011;
					d["2013"] = d.year2013;

				});

				console.log(allTotal);

				var table = d3.select("#table").append("table");

				var header = table.append("thead").append("tr");

				// Made some objects to construct the header in code:
				// The sort_type is for the Jquery sorting function.
				var headerObjs = [
					{ label: "Group", sort_type: "string" },
					{ label: "2000", sort_type: "int" },
					{ label: "2003", sort_type: "int" },
					{ label: "2005", sort_type: "int" },
					{ label: "2007", sort_type: "int" },
					{ label: "2009", sort_type: "int" },
					{ label: "2011", sort_type: "int" },
					{ label: "2013", sort_type: "int" },
				];

				header
					.selectAll("th")
					.data(headerObjs)
					.enter()
					.append("th")
					.attr("data-sort", function (d) { return d.sort_type; })
          .text(function(d) { return d.label; });

        var tablebody = table.append("tbody");

        rows = tablebody
        	.selectAll("tr")
        	.data(myArray)
        	.enter()
        	.append("tr");

        // We built the rows using the nested array - now each row has its own array.

        // let's talk about the scale - start at 0 or at lowest number?
        console.log('Extent is ', d3.extent(allTotal));

      	var colorScale = d3.scale.linear()
      		.domain(d3.extent(allTotal))
      		.range(["#E6F5FF", "#0099FF"]);

        cells = rows.selectAll("td")
        	// each row has data associated; we get it and enter it for the cells.
        	.data(function(d) {
        		return d;
        	})
        	.enter()
        	.append("td")
        	.style("background-color", function(d,i) {
        		// for the last element in the row, we color the background:
        		if (i === 7) {
        			return colorScale(d);
        		}
        	})
        	.text(function(d) {
        		return d;
        	});

      // jquery sorting applied to it - could be done with d3 and events.
      $("table").stupidtable();

}