var matrix_class = [
[1,0],
[1,0],
];

var class_name = ["Normal", "Tumoral"];

var width = 600,
	height = 600,
	midwidth = width/2,
	midheight = height/2,
	innerRadius = Math.min(width, height) * 0.3,
	outerRadius = innerRadius * 1.1,
	extraRadius = outerRadius * 1.03;

var fill = d3.scale.ordinal()
	.domain(d3.range(5))
	.range(["#f00000", "#FF2000", "#FF4000", "#FF6000", "#FF8000", "#FFA000",  "#FFB000",  "#FFD000",  "#FFF000",  "#FFFF70",
			"#FFFF70", "#FFF000", "#FFD000", "#FFB000", "#FFA000", "#FF8000", "#FF6000", "#FF4000", "#FF2000", "#f00000"
	]); //COLORI LABEL
	
var fill_class = d3.scale.ordinal()
	.domain(d3.range(5))
	.range(["#ffffff", "#000000"]); //COLORI LABEL
	
var svg;

function createSVG() {
svg = d3.select(document.getElementById('diagram')).append("svg:svg")
	.attr("width", width)
	.attr("height", height)
	.attr("id", "chord_diagram")
	.attr("transform", "translate(" + midwidth  + "," + midheight + ")")
	//.style("background-color", "#000000")
	.append("svg:g")
	.attr("id", "circle")
	.attr("transform", "translate(" + midwidth  + "," + midheight + ")")
	;
}

function clear() {
	if(svg != null) {
		document.getElementById('chord_diagram').remove();
	}
}

function draw(csv) {
	
	var loading = document.getElementById('loading');
	loading.style.display="block";
	
	createSVG();
	d3.csv(csv, function (error, data) {
	   var mpr = chordMpr(data);

		mpr
		  .addValuesToMap('has')
		  .setFilter(function (row, a, b) {
			return (row.has === a.name && row.prefers === b.name)
		  })
		  .setAccessor(function (recs, a, b) {
			if (!recs[0]) return 0;
			return +recs[0].count;
		  });
		  
	   	drawDiagram(mpr.getMatrix(), mpr.getMap());
	   // mpr.printMatrix();
		
		//cancello la scritta loading	
		loading.style.display="none";
	  });
}


	
function drawDiagram (matrix_value, mmap) {
//console.log(mmap);

var chord = d3.layout.chord()
	.padding(.01)
	//.sortSubgroups(d3.descending)
	.matrix(matrix_value);
	
var chord_esterno = d3.layout.chord()
	.padding(.01)
	.sortSubgroups(d3.descending)
	.matrix(matrix_class);

var rdr = chordRdr(matrix_value, mmap);
	
//svg.append("circle").attr("r", innerRadius + 20);
	
var g = svg.selectAll("g.group")
			.data(chord.groups())
			.enter().append("svg:g")
			.attr("class", "group")
			.style('cursor', 'pointer')
			.on("mouseover", mouseover) 
			.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") })
			.on('click', function(d) {gene_search_click(rdr(d).gname, d3.event.pageX, d3.event.pageY);})
			;
			
			
var classi = svg.selectAll("g.classi")
			.data(chord_esterno.groups())
			.enter().append("svg:path")
			.attr("class", "classi")
			.style("fill", function(d) { return fill_class(d.index); })
			.style("stroke", "#000000")
			.attr("d", d3.svg.arc().innerRadius(outerRadius*1.01).outerRadius(extraRadius)) //DEFINIZIONE DI "d"
			.on("mouseover", function (d) {
				  d3.select("#tooltip")
					.style("visibility", "visible")
					.html(class_name[d.index]) 
					.style("top", function () { return (d3.event.pageY - 100)+"px"})
					.style("left", function () { return (d3.event.pageX - 100)+"px";})
				})
			.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
			

			
g.append("svg:path")
			.style("stroke", "black")
			.style("fill", function(d) { return fill(d.index); })
			.attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

g.append("svg:text")
			.each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
			.attr("dy", ".35em")
			.style("font-family", "helvetica, arial, sans-serif")
			.style("font-size", "10px")
			.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
			.attr("transform", function(d) {
			  return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				  + "translate(" + (outerRadius + 10) + ")"
				  + (d.angle > Math.PI ? "rotate(180)" : "");
			})
			.text(function(d) { return rdr(d).gname.split("|")[0]; }); //splitto per evitare il nome lunghissimo
	
var ticks = svg.append("g").selectAll("g")
	.data(chord.groups)
	.enter().append("g").selectAll("g")
	.data(groupTicks)
	.enter().append("g")
	.attr("transform", function(d) {
	  return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		  + "translate(" + outerRadius*1.04 + ",0)";
	});
	
var chordPaths = svg.selectAll("path.chord")
				.data(chord.chords())
				.enter().append("svg:path")
				.attr("class", "chord")
				//.style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
				.style("fill", function(d) { return fill(d.target.index); })
				.style("opacity", 1)
				.attr("d", d3.svg.chord().radius(innerRadius))
				.on("mouseover", function (d) {
				  d3.select("#tooltip")
					.style("visibility", "visible")
					.html(chordTip(rdr(d)))
					.style("top", function () { return (d3.event.pageY - 100)+"px"})
					.style("left", function () { return (d3.event.pageX - 100)+"px";})
				})
				.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
	
	
// Returns an array of tick angles and labels, given a group.
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, 1000).map(function(v, i) {
	return {
	  angle: v * k + d.startAngle,
	  label: i % 5 ? null : v / 1000 + "k"
	};
  }); 
}
	
	
function chordTip (d) {
			var p = d3.format(".2%"), q = d3.format(",.3r")
			return "Chord Info:<br/>"
			  + 'connecting ' + d.sname.split("|")[0] + " with " + d.tname.split("|")[0]
}

function groupTip (d) {
			var p = d3.format(".1%"), q = d3.format(",.3r")
			return "Group Info:<br/>"
				+ d.gname.split("|")[0] + " : " + q(d.gvalue) + "<br/>"
				+ p(d.gvalue/d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")" 
				+ '<br/><br/>Click for full json information.'
}




// Returns an event handler for fading a given chord group.
function fade(opacity) {
	
  return function(g, i) {
	svg.selectAll(".chord path")
		.filter(function(d) { return d.source.index != i && d.target.index != i; })
		.transition()
		.style("opacity", opacity);
		
		if(opacity == .1) {
			mouseover(g,i);
		} else { d3.select("#tooltip_gene").style("visibility", "hidden") }
  };
}

 function mouseover(d, i) {
			d3.select("#tooltip")
			  .style("visibility", "visible")
			  .html(groupTip(rdr(d)))
			  .style("top", function () { return (d3.event.pageY - 100)+"px"})
			  .style("left", function () { return (d3.event.pageX - 100)+"px";})

			chordPaths.classed("fade", function(p) {
			  return p.source.index != i
				  && p.target.index != i;
			});
}


}

