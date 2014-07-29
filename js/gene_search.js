function gene_search_tooltip(param, x, y) {
	
	if(param.indexOf('Tumoral') == -1  && param.indexOf('Normal') == -1) {
		
		d3.select("#tooltip")
					.style("visibility", "visible")
					.html("Loading data from server...")
					.style("top", function () { return (y - 100)+"px"})
					.style("left", function () { return (x - 100)+"px";});
		
	var gene = param.split("|");

	$.get(
    	"http://rest.genenames.org/fetch/symbol/"+gene[0],
	
   		function(data) {
		
		//console.log(JSON.stringify(data, undefined, 2));

		var jsonObject = JSON.parse(JSON.stringify(data));
		
		var symbols = "";
		if(jsonObject.response.docs[0].alias_symbol != null) {
			for(i=0; i<jsonObject.response.docs[0].alias_symbol.length; i++) {
				symbols += jsonObject.response.docs[0].alias_symbol[i] + "&nbsp;&nbsp;&nbsp;&nbsp;"; 
				};
		}
		
		var html_str = "Symbol: " + jsonObject.response.docs[0].symbol + "<br/>Hgnc_id: " + jsonObject.response.docs[0].hgnc_id + "<br/>Name: " + jsonObject.response.docs[0].name + "<br/>Locus type: " + jsonObject.response.docs[0].locus_type + "<br/>Alias symbol: " + symbols + "<br/>Location: " + jsonObject.response.docs[0].location + "<br/><br/>Click on gene name for complete json description.";
		
		d3.select("#tooltip")
					.style("visibility", "visible")
					.html(html_str)
					.style("top", function () { return (y - 100)+"px"})
					.style("left", function () { return (x - 100)+"px";})
		},

		'json'
	);
	}
} 



function gene_search_click(param) {

	if(param.indexOf('Tumoral') == -1  && param.indexOf('Normal') == -1) {
		
	var gene = param.split("|");

	$.get(
    	"http://rest.genenames.org/fetch/symbol/"+gene[0],
	
   		function(data) {
		
		window.open("", "", "width=600, height=600").document.write(JSON.stringify(data, undefined, 2));		 
		},

		'json'
	);
	}
} 