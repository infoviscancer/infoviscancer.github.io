// ************** Generate the tree diagram	 *****************
var margin = {top: 60, right: 20, bottom: 20, left: 20},
	width_tree = 690 - margin.right - margin.left,
	height_tree = 450 - margin.top - margin.bottom;
	
var i = 0;
var switchRule;
 
var tree = d3.layout.tree()
	.size([height_tree, width_tree]);
  
var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.x, d.y]; });
 
var svgTree;
function createTreeSVG() { 
	svgTree = d3.select(document.getElementById('wrapper_tree')).append("svg")
	.attr("width", width_tree + margin.right + margin.left)
	.attr("height", height_tree + margin.top + margin.bottom)
	.attr("id", "tree_diagram")
	.style("display", "block")
	.style("float", "left")
	.style("position", "relative")
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}
	
function clearTree() {
	if(svgTree != null) {
		document.getElementById('tree_diagram').remove();
	}
	}
 
 
function drawTree(source) {
 
 createTreeSVG();
 var root = treeData[source];
 
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
	  links = tree.links(nodes);
 
  // Normalize for fixed-depth.
  nodes.forEach(function(d) {  d.x = d.x*1.8; d.y = d.depth * 100; }); //dimensioni dell'albero, distanza fra i pallini
 
  // Declare the nodes…
  var node = svgTree.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });
 
  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) {
		  //console.log(d.x);
		  //console.log(d.y);
		  return "translate(" + d.x + "," + d.y + ")"; })
	  ;
 
  nodeEnter.append("circle")
	  .attr("r", 10)
	  .style("fill", "#fff")
	 .style("stroke", function(d) {
		 if(d.value != null && d.name.indexOf('Tumoral') > -1) return "#ff0000";
		 else if(d.value != null && d.name.indexOf('Normal') > -1)  return "#0000ff";
		 else return "#999";
		 })  
	.on('mouseover', function(d) {
		gene_search_tooltip(d.name, d3.event.pageX, d3.event.pageY);
	})
	.on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });
	  ;
 
  nodeEnter.append("text")
	  .attr("y", function(d) { 
		  return d.children || d._children ? -18 : 18; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", "middle")
	  .text(function(d) {return d.name; })
	  .style("fill-opacity", 1)
	  .style("font-weight", "bold")
	  .on('click', function(d) {
		gene_search_click(d.name, d3.event.pageX, d3.event.pageY);
	})
	  ;
	  
	nodeEnter.append("text")
	  .attr("y", function(d) { 
		  return d.children || d._children ? -65 : -45; })
	  .attr("dy", ".35em") 
	  .attr("text-anchor", "middle")
	  .text(function(d) {return d.value; })
	  .style("fill-opacity", 1);
 
  // Declare the links…
  var link = svgTree.selectAll("path.link") 
	  .data(links, function(d) { return d.target.id; });
  
  // Enter the links.
 var linkEnter = link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", diagonal)
	  ;
	  
	  switchRule(source);
}

switchRule = function switchRule(param) {
	
	document.getElementById('weka_rule').innerHTML = rule_description[param];	
	}
 