var chromosome_color = {
"1" : "#006600",
"2" : "#0000FF",
"3" : "#FF00FF",
"4" : "#FF6600",
"5" : "#336633",
"6" : "#3300CC",
"7" : "#CC00CC",
"8" : "#CC6633",
"9" : "#666666",
"10" : "#660099",
"11" : "#990099",
"12" : "#996666",
"13" : "#00FF00",
"14" : "#0099FF",
"15" : "#FF99FF",
"16" : "#FFFF00",
"17" : "#33FF33",
"18" : "#3399CC",
"19" : "#CC99CC",
"20" : "#CCFF33",
"21" : "#66FF66",
"22" : "#669999",
"X" : "#999999",
"Y" : "#99FF66"
};

var margin_chr = {top: 30, right: 10, bottom: 10, left: 50},
    width_chr = 20000 - margin_chr.left - margin_chr.right,
    height_chr = 700 - margin_chr.top - margin_chr.bottom;
	
var file_csv = "csv/chromosome/genes_rpkm_location_normal_1000.csv";

var y = d3.scale.linear()
    .range([0, height_chr])

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width_chr], .2);

var yAxis = d3.svg.axis()
    .scale(y)
	.tickFormat(function(d) { return Math.abs(d)})
    .orient("left");
	
	var svg;
	var domain_value = 26000;

function drawChr() {
	
svg = d3.select(document.getElementById('wrapper')).append("svg")
    .attr("width", width_chr + margin_chr.left + margin_chr.right)
    .attr("height", height_chr + margin_chr.top + margin_chr.bottom)
	.attr("id", "chromosome_diagram")
  .append("g")
    .attr("transform", "translate(" + margin_chr.left + "," + margin_chr.top + ")");
	
var i = -1;

d3.csv(file_csv, type, function(error, data) {
	y.domain([domain_value,-domain_value]);
 // x.domain(d3.extent(data, function(d) { return -d.rpkm_tumoral && d.rpkm_normal; })).nice();
 	x.domain(data.map(function(d) { return d.gene; }));
  
 //console.log(data);
 //svg per il bkg rigato dei senza cromosomi
 svg
  .append('defs')
  .append('pattern')
    .attr('id', 'diagonalHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4)
  .append('path')
    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
    .attr('stroke', '#000000')
    .attr('stroke-width', 1);

  svg.selectAll(".bar_pos")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar positive")
     // .attr("y", function(d) { return y(Math.min(0, d.rpkm_normal)); })
	 .attr("y", function(d) { return y(d.rpkm_normal); })
      .attr("x", function(d) { i++; return ((i*(width_chr/data.length))); })
      .attr("width", width_chr/data.length)
      .attr("height", function(d) { return Math.abs(y(d.rpkm_normal) - y(0)); })
	  .style("fill", function (d) {
		  if(d.chromosome != null && d.chromosome != '')
		 	 return chromosome_color[d.chromosome];
		else
		return 'url(#diagonalHatch)';
		  })
	  .style("opacity", .7)
	  .on("mouseover", function (d) {
				  d3.select("#tooltip") 
					.style("visibility", "visible")
					.html('Gene name: '+ d.gene +'<br/>Avg RPKM value: ' + d.rpkm_normal + '<br/>Chromosome: ' + d.chromosome + '<br/>Locus: ' + d.p_or_q + d.locus + '<br/><br/>Click for full json information.')
					.style("top", function () { return (d3.event.pageY - 100)+"px"})
					.style("left", function () { return (d3.event.pageX - 100)+"px";})
				})
		.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") })
		.on('click', function(d) {
		gene_search_click(d.gene, d3.event.pageX, d3.event.pageY);})
	  ;
	 
	  
	  i=-1;
svg.selectAll(".bar_neg")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar negative")
      .attr("y", y(0))
      .attr("x", function(d) { i++; return ((i*(width_chr/data.length))); })
      .attr("width", width_chr/data.length)
      .attr("height", function(d) { return Math.abs(y(-d.rpkm_tumoral) - y(0)); })
	  .style("fill", function (d) {
		  if(d.chromosome != null && d.chromosome != '')
		 	 return chromosome_color[d.chromosome];
		else
		return 'url(#diagonalHatch)';
		  })
	  .style("opacity", .7)
	  .on("mouseover", function (d) {
				  d3.select("#tooltip")
					.style("visibility", "visible")
					.html('Gene name: '+ d.gene +'<br/>Avg RPKM value: ' + d.rpkm_tumoral + '<br/>Chromosome: ' + d.chromosome + '<br/>Locus: ' + d.p_or_q + d.locus + '<br/><br/>Click for full json information.')
					.style("top", function () { return (d3.event.pageY - 100)+"px"})
					.style("left", function () { return (d3.event.pageX - 100)+"px";})
				})
		.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") })
		.on('click', function(d) {
		gene_search_click(d.gene, d3.event.pageX, d3.event.pageY);
	})
	  ;

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("g")
      .attr("class", "x axis")
    .append("line")
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("x2", width_chr);

});
}

function type(d) {
  d.rpkm_normal = +d.rpkm_normal;
  return d;
}

function clearChr() {
	if(svg != null)
		document.getElementById('chromosome_diagram').remove();
	}
