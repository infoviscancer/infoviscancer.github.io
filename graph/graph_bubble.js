

var diameter = 600,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);
	
var fill_class = d3.scale.ordinal()
	.domain(d3.range(5))
	.range(["#CCFF99", "#FF9966"]);
	
var svg;

function createSVG() {
 svg = d3.select(document.getElementById('diagram')).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble")
	.style("display", "block")
	.style("float", "left")
	.style("position", "relative")
	;
}
	
function clear() {
	if(svg != null)
		svg.remove();
	}

function draw(json, num_classe) {
	
	var loading = document.getElementById('loading');
	loading.style.display="block";
	
	createSVG();
	d3.json(json, function(error, root) {
 	 var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  //node.append("title").text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      	.attr("r", function(d) { return d.r; })
      	.style("fill", function(d) {return fill_class(num_classe); })
		.style('cursor', 'pointer')
		.style("stroke", function(d) { return d3.rgb(fill_class(num_classe)).darker(); })
	  	.on("mouseover", function (d) {
				  d3.select("#tooltip")
					.style("visibility", "visible") 
					.html('Gene name: '+ d.className +'<br/>Avg value: ' + d.value + '<br/><br/>Click for full json information')
					.style("top", function () { return (d3.event.pageY - 100)+"px"})
					.style("left", function () { return (d3.event.pageX - 100)+"px";})
				})
		.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") })
		.on('click', function(d) {gene_search_click(d.className, d3.event.pageX, d3.event.pageY);})
	  ;

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
	  .style("font-size", "10px") 
	  .style("text-shadow", "1px 1px #ffffff")
      .text(function(d) { return d.className.substring(0, d.r / 3); })
	  ;
	   
	  loading.style.display="none";
});


}

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}