/**
 * miscellaneous functions
 */

/**
 * Updates the identifier for the knowledge source textarea.
 * Is called each time the knowledge textarea is changed.
 * 
 * @param String Current content of Configuration textarea
 */
function updateKnowledgeSource(confContent) {
	
	//check for occurences of ks.type
	if(confContent.indexOf("ks.type") != -1) {
		
		//find first quotation mark in ks.type
		var firstQuotationMark = confContent.indexOf("\"", confContent.indexOf("ks.type"));
		//find second quotation mark in ks.type
		var secondQuotationMark = confContent.indexOf("\"", firstQuotationMark+1);
		
		//if ks.type is defined (by using two quotation marks)
		if(firstQuotationMark != -1 && secondQuotationMark != -1) {
			var ks = confContent.substring(firstQuotationMark+1, secondQuotationMark)
			console.log("ks.type: "+ks);
			console.log(document.getElementById("ksName"));
			document.getElementById("ksName").innerHTML = "Knowledge Source: "+ks;
		}
	}
	
	
}