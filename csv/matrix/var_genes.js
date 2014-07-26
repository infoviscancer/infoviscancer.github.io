var crossValidation = [
['RNFT2|84900_calculated','ESM1|11082_calculated',0.4895,0.2558], //regola con full trainingset
["JA611272|?|1of2_calculated","ESM1|11082_calculated",0.0628,0.251],
["MIR4427|100616390_calculated","ESM1|11082_calculated",0.3335,0.2558],
["SSX1|6756_calculated","ESM1|11082_calculated",0.0134,0.2558]
];

var rule_description = [
  "ESM1|11082_calculated <b>&lt;= 0.2558</b><br />|&nbsp;&nbsp;&nbsp;&nbsp;RNFT2|84900_calculated <b>&lt;= 0.4895: <font color='#0000FF'>Normal</font></b> (34.0/1.0)<br />|&nbsp;&nbsp;&nbsp;&nbsp;RNFT2|84900_calculated <b>&gt; 0.4895: <font color='#ff0000'>Tumoral</font></b> (5.0)<br />ESM1|11082_calculated <b>&gt; 0.2558: <font color='#FF0000'>Tumoral</font></b> (232.0)",
  "ESM1|11082_calculated <b>&lt;= 0.251</b><br />|&nbsp;&nbsp;&nbsp;&nbsp;JA611272|?|1of2_calculated <b>&lt;= 0.0628: <font color='#0000FF'>Normal</font></b> (30.0/1.0)<br />|&nbsp;&nbsp;&nbsp;&nbsp;JA611272|?|1of2_calculated <b>&gt; 0.0628: <font color='#ff0000'>Tumoral</font></b> (2.0)<br />ESM1|11082_calculated <b>&gt; 0.251: <font color='#FF0000'>Tumoral</font></b> (212.0)",
  "ESM1|11082_calculated <b>&lt;= 0.2558</b><br />|&nbsp;&nbsp;&nbsp;&nbsp;MIR4427|100616390_calculated <b>&lt;= 0.3335: <font color='#0000FF'>Normal</font></b> (30.0)<br />|&nbsp;&nbsp;&nbsp;&nbsp;MIR4427|100616390_calculated <b>&gt; 0.3335: <font color='#ff0000'>Tumoral</font></b> (5.0)<br />ESM1|11082_calculated <b>&gt; 0.2558: <font color='#FF0000'>Tumoral</font></b> (209.0)",
  "ESM1|11082_calculated <b>&lt;= 0.2558</b><br />|&nbsp;&nbsp;&nbsp;&nbsp;SSX1|6756_calculated <b>&lt;= 0.0134: <font color='#0000FF'>Normal</font></b> (31.0/1.0)<br />|&nbsp;&nbsp;&nbsp;&nbsp;SSX1|6756_calculated <b>&gt; 0.0134: <font color='#ff0000'>Tumoral</font></b> (4.0)<br />ESM1|11082_calculated <b>&gt; 0.2558: <font color='#FF0000'>Tumoral</font></b> (209.0)"
];

var xAxisOptions = [
  "RNFT2|84900_calculated", 
  "ZNF280A|129025_calculated", 
  "TPX2|22974_calculated",
  "ZNF664|144348_calculated",
	  "SART3|9733_calculated",
	  "C12orf73|728568_calculated",
	  "PIGM|93183_calculated",
	  "RAE1|8480_calculated",
	  "CIT|11113_calculated",
	  "POU2F1|5451_calculated",
	  "BRAP|8315_calculated"
  ];
  var yAxisOptions = [
  "ESM1|11082_calculated", 
  "VEGFA|7422_calculated", 
  "APLN|8862_calculated",
  "XPO5|57510_calculated",
	  "DQ581019|?_calculated",
	  "FLT1|2321_calculated",
	  "RPL7L1|285855_calculated",
	  "TMEM63B|55362_calculated",
	  "AARS2|57505_calculated",
	  "CDC5L|988_calculated",
	  "GTPBP2|54676_calculated"
  ];
  var descriptions = {
    "RNFT2|84900_calculated" : "RPKM value for gene RNFT2|84900_calculated",
	"ZNF280A|129025_calculated" : "RPKM value for gene ZNF280A|129025_calculated",
	"TPX2|22974_calculated" : "RPKM value for gene TPX2|22974_calculated",
	"ZNF664|144348_calculated" : "RPKM value for gene ZNF664|144348_calculated",
	  "SART3|9733_calculated" : "RPKM value for gene SART3|9733_calculated",
	  "C12orf73|728568_calculated" : "RPKM value for gene C12orf73|728568_calculated",
	  "PIGM|93183_calculated" : "RPKM value for gene PIGM|93183_calculated",
	  "RAE1|8480_calculated" : "RPKM value for gene RAE1|8480_calculated",
	  "CIT|11113_calculated" : "RPKM value for gene CIT|11113_calculated",
	  "POU2F1|5451_calculated" : "RPKM value for gene POU2F1|5451_calculated",
	  "BRAP|8315_calculated" : "RPKM value for gene BRAP|8315_calculated",
	
	"ESM1|11082_calculated" : "RPKM value for gene ESM1|11082_calculated",
	"VEGFA|7422_calculated" : "RPKM value for gene VEGFA|7422_calculated",
	"APLN|8862_calculated" : "RPKM value for gene APLN|8862_calculated",
	"XPO5|57510_calculated" : "RPKM value for gene XPO5|57510_calculated",
	  "DQ581019|?_calculated" : "RPKM value for gene DQ581019|?_calculated",
	  "FLT1|2321_calculated" : "RPKM value for gene FLT1|2321_calculated",
	  "RPL7L1|285855_calculated" : "RPKM value for gene RPL7L1|285855_calculated",
	  "TMEM63B|55362_calculated" : "RPKM value for gene TMEM63B|55362_calculated",
	  "AARS2|57505_calculated" : "RPKM value for gene AARS2|57505_calculated",
	  "CDC5L|988_calculated" : "RPKM value for gene CDC5L|988_calculated",
	  "GTPBP2|54676_calculated" : "RPKM value for gene GTPBP2|54676_calculated"
  };
  var pearsonCorrelationX = {
	  "RNFT2|84900_calculated" : 1,
	  "ZNF280A|129025_calculated" : 0.572515819677344,
	  "TPX2|22974_calculated" : 0.560236668450834,
	  "ZNF664|144348_calculated" : 0.558505890069097,
	  "SART3|9733_calculated" : 0.558073234099657,
	  "C12orf73|728568_calculated" : 0.553748097394015,
	  "PIGM|93183_calculated" : 0.553504018679016,
	  "RAE1|8480_calculated" : 0.552278005941927,
	  "CIT|11113_calculated" : 0.548415398233194,
	  "POU2F1|5451_calculated" : 0.546047244650569,
	  "BRAP|8315_calculated" : 0.545464580725976
	  };
  var pearsonCorrelationY = {
	  "ESM1|11082_calculated" : 1,
	  "VEGFA|7422_calculated" : 0.670548840157846,
	  "APLN|8862_calculated" : 0.596615062884087,
	  "XPO5|57510_calculated" : 0.565190152098359,
	  "DQ581019|?_calculated" : 0.559372900164292,
	  "FLT1|2321_calculated" : 0.55264214398218,
	  "RPL7L1|285855_calculated" : 0.551905844602728,
	  "TMEM63B|55362_calculated" : 0.551228715053256,
	  "AARS2|57505_calculated" : 0.549367197207324,
	  "CDC5L|988_calculated" : 0.548631090494484,
	  "GTPBP2|54676_calculated" : 0.547216617469546
	  };