var raggio = 3;
var width = 690;
var height = 650;

var normal = 0;
var tumoral = 0;


var xRange = crossValidation[0][2];
var yRange = crossValidation[0][3]; /*Esterno*/
	var ruleXAxis = crossValidation[0][0] , ruleYAxis = crossValidation[0][1];
	
  var xAxis = 'RNFT2|84900_calculated', yAxis = 'ESM1|11082_calculated';
  var showRuleAxis = true;
  
var switchXAxis, switchYAxis, showHideRangeAxis;


var colors = ["#0000ff" , "#ff0000"];

// HELPERS
function parseData(d) {
  var keys = _.keys(d[0]);
  return _.map(d, function(d) {
    var o = {}; 
    _.each(keys, function(k) {
      if( k == 'PARTICIPANT' )
        o[k] = d[k];
	if( k == 'CLASS' )
        o[k] = d[k];
      else
        o[k] = parseFloat(d[k]);
    });
    return o;
  });
}

function getBounds(d, paddingFactor) {
  // Find min and maxes (for the scales)
  paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1;

  var keys = _.keys(d[0]), b = {};
  _.each(keys, function(k) {
    b[k] = {};
    _.each(d, function(d) {
      if(isNaN(d[k]))
        return;
      if(b[k].min === undefined || d[k] < b[k].min)
        b[k].min = d[k];
      if(b[k].max === undefined || d[k] > b[k].max)
        b[k].max = d[k];
    });
    b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor;
    b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
  });
  return b;
}

function getCorrelation(xArray, yArray) {
  function sum(m, v) {return m + v;}
  function sumSquares(m, v) {return m + v * v;}
  function filterNaN(m, v, i) {isNaN(v) ? null : m.push(i); return m;}

  // clean the data (because we know that some values are missing)
  var xNaN = _.reduce(xArray, filterNaN , []);
  var yNaN = _.reduce(yArray, filterNaN , []);
  var include = _.intersection(xNaN, yNaN);
  var fX = _.map(include, function(d) {return xArray[d];});
  var fY = _.map(include, function(d) {return yArray[d];});

  var sumX = _.reduce(fX, sum, 0);
  var sumY = _.reduce(fY, sum, 0);
  var sumX2 = _.reduce(fX, sumSquares, 0);
  var sumY2 = _.reduce(fY, sumSquares, 0);
  var sumXY = _.reduce(fX, function(m, v, i) {return m + v * fY[i];}, 0);

  var n = fX.length;
  var ntor = ( ( sumXY ) - ( sumX * sumY / n) );
  var dtorX = sumX2 - ( sumX * sumX / n);
  var dtorY = sumY2 - ( sumY * sumY / n);
 
  var r = ntor / (Math.sqrt( dtorX * dtorY )); // Pearson ( http://www.stat.wmich.edu/s216/book/node122.html )
  var m = ntor / dtorX; // y = mx + b
  var b = ( sumY - m * sumX ) / n;

  // console.log(r, m, b);
  return {r: r, m: m, b: b};
}


d3.csv('csv/matrix/output_stomach_completo_filtered.csv', function(data) {


  var keys = _.keys(data[0]);
  var data = parseData(data);
  var bounds = getBounds(data, 1);
  
 

  // SVG AND D3 STUFF
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
	;
	
  var xScale, yScale;

var chart = svg.append('g')
    .classed('chart', true)
    .attr('transform', 'translate(80, -60)')
	;
	

  // Build menus
  d3.select('#x-axis-menu')
    .selectAll('li')
    .data(xAxisOptions)
    .enter()
    .append('li')
    .text(function(d) {return d;})
    .classed('selected', function(d) {
      return d === xAxis;
    })
    .on('click', function(d) {
      xAxis = d;
      updateChart();
      updateMenus();
	  updateZoom();
    });

   d3.select('#y-axis-menu')
     .selectAll('li')
     .data(yAxisOptions)
     .enter()
     .append('li')
     .text(function(d) {return d;})
     .classed('selected', function(d) {
       return d === yAxis;
     })
     .on('click', function(d) {
       yAxis = d;
       updateChart();
       updateMenus();
  	updateZoom();
     });
	 
	 d3.select('#slider')
     .on('slide', function(d) {
       yAxis = d;
       updateChart();
       updateMenus();
  	updateZoom();
     });
  
  // Build reset button
  d3.select('#reset')
    .on('click', resetView())
	;
/*
  // Gene name
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'geneLabel', 'x': 0, 'y': 170})
    .style({'font-size': '25px', 'font-weight': 'bold', 'fill': '#205567',  'text-shadow': '1px 1px #ffffff'});


  // Best fit line (to appear behind points)
  d3.select('svg g.chart')
    .append('line')
    .attr('id', 'bestfit');
	*/

  // Axis labels
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'xLabel', 'x': 300, 'y': 650, 'text-anchor': 'middle'})
    .text(descriptions[xAxis]);

  d3.select('svg g.chart')
    .append('text')
    .attr('transform', 'translate(-60, 330)rotate(-90)')
    .attr({'id': 'yLabel', 'text-anchor': 'middle'})
    .text(descriptions[yAxis]);
	
	// Render range axes
  d3.select('svg g.chart')
    .append('line')
    .attr('id', 'xRangeAxe');

  d3.select('svg g.chart')
    .append('line')
    .attr('id', 'yRangeAxe');

  // Render points //////////////////////////////////////////////////////
  updateScales();
  
  
  //BRUSH
	 var brush = d3.svg.brush()
   		.x(xScale)
    	.y(yScale)
    //.extent(defaultExtent)
    .on("brush", brushed)
    .on("brushend", brushended)
	;
	
	function brushed() {
  		var extent = brush.extent();
		point.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
                (extent[0][0] <= d.x && d.x < extent[1][0]
                && extent[0][1] <= d.y && d.y < extent[1][1]);
          });
		  //console.log(extent[0][0] + " " + extent[1][0] + " " + extent[0][1] + " " + extent[1][1]);
		
	}
	
	function brushended() {
  		var extent = brush.extent();	 
 		zoom(extent[0][0], extent[1][0], extent[0][1], extent[1][1]);
		
		updateZoom();
		d3.select(this).call(d3.event.target);	
}
	
	// Find the nodes within the specified rectangle.
function zoom(x0, x1, y0, y1) {
	
	//console.log(x0 + " " + x1 + " " + y0 + " " + y1);
	updateChart(false,x0,x1,y0,y1);
}

function updateZoom() {
		brush.clear();
		brush.x(xScale);
		brush.y(yScale);
	}

chart.append("g")
    .attr("class", "brush")
   	.call(brush);
//FINE BRUSH
  
//POINT
 // var pointColour = d3.scale.category20b();
  var point = d3.select('svg g.chart')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
	.attr('class', 'point')
    .attr('cx', function(d) {
      return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
    })
    .attr('cy', function(d) {
      return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
    })
    .attr('fill', function(d) {
		if(d.CLASS.indexOf('Tumoral') > -1) {
			tumoral++;
			return colors[1];
		} else {
			normal++;
			 return colors[0];
		}
		})
    .style('cursor', 'pointer')
    /*.on('mouseover', function(d) {
      d3.select('svg g.chart #geneLabel')
        .html("Id: " + d.PARTICIPANT + "<br/>Class: " + d.CLASS + "")
        .transition()
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      d3.select('svg g.chart #geneLabel')
        .transition()
        .duration(1500)
        .style('opacity', 0);
    })*/
	.on('mouseover', function(d) {
		d3.select("#tooltip")
					.style("visibility", "visible")
					.html("Id: " + d.PARTICIPANT + "<br/>Class: " + d.CLASS + "<br/>X-axis RPKM: " + d[xAxis] + "<br/>Y-axis RPKM: " + d[yAxis])
					.style("top", function () { return (d3.event.pageY - 100)+"px"})
					.style("left", function () { return (d3.event.pageX - 100)+"px";})
	})
	.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") })
	;
	
	//FINE POINT
	
	console.log("N° of normal:" + normal + " N° of tumoral:" + tumoral);

  updateChart(true);
  updateMenus();
  
  // Render axes
  d3.select('svg g.chart')
    .append("g")
    .attr('transform', 'translate(0, 610)')
    .attr('id', 'xAxis')
    .call(makeXAxis);

  d3.select('svg g.chart')
    .append("g")
    .attr('id', 'yAxis')
    .attr('transform', 'translate(-10, 0)')
    .call(makeYAxis);
 

  //// RENDERING FUNCTIONS
	function updateChart(init,x0,x1,y0,y1) {
		
	  if(x0 == null)
	  	updateScales();
	  else
   		updateScales(x0,x1,y0,y1);

    d3.select('svg g.chart')
      .selectAll('circle')
      .transition()
      .duration(500)
      .ease('quad-out')
      .attr('cx', function(d) {
        return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
      })
      .attr('cy', function(d) {
        return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
      })
      .attr('r', function(d) {
        return isNaN(d[xAxis]) || isNaN(d[yAxis]) ? 0 : raggio; //raggio dei pallini
      });

    // Also update the axes
    d3.select('#xAxis')
      .transition()
      .call(makeXAxis);

    d3.select('#yAxis')
      .transition()
      .call(makeYAxis);

    // Update axis labels
    d3.select('#xLabel')
      .text(descriptions[xAxis]);
	  
	 d3.select('#yLabel')
      .text(descriptions[yAxis]);
	  


    // Update correlation
    var xArray = _.map(data, function(d) {return d[xAxis];});
    var yArray = _.map(data, function(d) {return d[yAxis];});
    var c = getCorrelation(xArray, yArray);
    var x1 = xScale.domain()[0], y1 = c.m * x1 + c.b;
    var x2 = xScale.domain()[1], y2 = c.m * x2 + c.b;
	
/*
    // Fade in (BESTFIT LINE)
    d3.select('#bestfit')
      .style('opacity', 0)
      .attr({'x1': xScale(x1), 'y1': yScale(y1), 'x2': xScale(x2), 'y2': yScale(y2)})
      .transition()
      .duration(1500)
      .style('opacity', 1);
	  */
	  
	 // Fade in (xRangeAxe)
	 if(showRuleAxis == true) {
    d3.select('#xRangeAxe')
      .style('opacity', 1)
	  .transition()
      .duration(500)
      .ease('quad-out')
      .attr({'x1': xScale(xRange), 'y1': yScale(yScale.domain()[0]), 'x2': xScale(xRange), 'y2': yScale(yScale.domain()[1])})
      //.transition()
      //.duration(1500)
     // .style('opacity', 1)
	 // .attr('fill', '#ff0000')
	  ;
	  
	 // Fade in (yRangeAxe)
    d3.select('#yRangeAxe')
      .style('opacity', 1)
	  .transition()
      .duration(500)
      .ease('quad-out')
      .attr({'x1': xScale(xScale.domain()[0]), 'y1': yScale(yRange), 'x2':  xScale(xScale.domain()[1]), 'y2': yScale(yRange)})
      //.transition()
      //.duration(1500)
     // .style('opacity', 1)
	 //.attr('fill', '#ff0000')
	  ;
	 }
	  var disabled = $( "#sliderX" ).slider( "option", "disabled" );
	  if(disabled == false) {
	  document.getElementById('slider_text_x').innerHTML = xAxis;
	  document.getElementById('slider_text_y').innerHTML = yAxis;
	  document.getElementById('slider_text_x').onclick = function() {gene_search_click(xAxis);}
	  document.getElementById('slider_text_y').onclick = function() {gene_search_click(yAxis); }
	  
	  document.getElementById('pearsonX').innerHTML = 'Pearson correlation with <font style="font-weight:bold;">'  + ruleXAxis +
	   '</font>: <font style="font-weight:bold;  color:#A52A2A;">' + pearsonCorrelationX[xAxis] + '</font>';
	   document.getElementById('pearsonX').onclick = function() {gene_search_click(ruleXAxis);}
	  document.getElementById('pearsonY').innerHTML = 'Pearson correlation with <font style="font-weight:bold;">'  + ruleYAxis +
	   '</font>: <font style="font-weight:bold;  color:#A52A2A;">' + pearsonCorrelationY[yAxis] + '</font>';
	   document.getElementById('pearsonY').onclick = function() {gene_search_click(ruleYAxis);}
	  }
  } //FINE FUNZIONE

  function updateScales(xmin, xmax, ymin, ymax) {
	  if(xmin == null) {
    xScale = d3.scale.linear()
                    .domain([bounds[xAxis].min, bounds[xAxis].max])
                    .range([0, 600]);

    yScale = d3.scale.linear()
                    .domain([bounds[yAxis].min, bounds[yAxis].max])
                    .range([600, 100]);  
	  } else {
		  xScale = d3.scale.linear()
                    .domain([xmin, xmax])
                    .range([0, 600]);

    	yScale = d3.scale.linear()
                    .domain([ymin, ymax])
                    .range([600, 100]); 
		
		  }
  }
  

  function makeXAxis(s) {
    s.call(d3.svg.axis()
      .scale(xScale)
      .orient("bottom"));
  }

  function makeYAxis(s) {
    s.call(d3.svg.axis()
      .scale(yScale)
      .orient("left"));
  }
  
  function resetView() {
	  updateScales(true);
	  }

  function updateMenus() {
    d3.select('#x-axis-menu')
      .selectAll('li')
      .classed('selected', function(d) {
        return d === xAxis;
      });
    d3.select('#y-axis-menu')
      .selectAll('li')
      .classed('selected', function(d) {
        return d === yAxis;
    });
  }
  
switchXAxis = function switchXAxis(param) {
	xAxis = xAxisOptions[param];
      updateChart();
      updateMenus();
	  updateZoom();
	}
	
switchYAxis = function switchYAxis(param) {
	yAxis = yAxisOptions[param];
      updateChart();
      updateMenus();
	  updateZoom();
	}
 
showHideRangeAxis = function showHideRangeAxis(param) {

	 d3.select('#xRangeAxe')
      .style('opacity', param);
	 d3.select('#yRangeAxe')
      .style('opacity', param);
	
	
	var txt;
	if(param == 0) {
		txt = 'OFF';
		showRuleAxis = false;
	} else {
		txt = 'ON';
		showRuleAxis = true;
		}
	
document.getElementById('slider_text_onoff').innerHTML = txt;
}

})

