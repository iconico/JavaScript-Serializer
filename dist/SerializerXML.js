// Nico Westerdale - 1/2004  - www.iconico.com

// SerializerXML.js
// This pluggable JS file adds a formatting method to the Serializer

//Methods
JSSerializer.prototype.GetXMLString = mtdGetXMLString;

//method
function mtdGetXMLString(strRoot) {
	var theSerializer = this;	//easier to reference later on
	var XMLStringRoot = strRoot;	//root function name
	var arr = new Array;		//use array for performace gain
	arr[arr.length] = GetXMLStringItem(this.Data);
	arr[arr.length] = GetXMLStringAll(this.Data);
	arr[arr.length] = GetXMLStringItemEnd(this.Data)
	return arr.join('');


//recursive function
function GetXMLStringAll(obj) {
	var arr = new Array;	//use array for performace gain
	if (obj) {
		for (var i=0; i<obj.Kids.length; i++) {
			arr[arr.length] = GetXMLStringItem(obj.Kids[i]);
			arr[arr.length] = GetXMLStringAll(obj.Kids[i]);
			arr[arr.length] = GetXMLStringItemEnd(obj.Kids[i]);
		}
	}
	return arr.join('');
}


//Formats a single item in a collection and returns the serialized string
function GetXMLStringItem(obj) {
	var arr = new Array;	//use array for performace gain
	
	if (obj) {
		//smart indent
		if (theSerializer.Prefs.SmartIndent) {
			arr[arr.length] = getIndent(obj);
		}
		//start tag
		arr[arr.length] = '<';
		arr[arr.length] = getNodeName(obj);
		//types
		if (theSerializer.Prefs.ShowTypes) {
			arr[arr.length] = ' type="';
			switch (obj.ExactType) {
				case 'n/a':
					//we diferentiate the null and undefined types too
					if (obj.Value  === undefined) {
						arr[arr.length] = 'undefined';
					} else {
						arr[arr.length] = 'Object';
					}
					break;
				case 'Enumerator':
					// - this can't ever be serialized!
					break;
				case 'VBArray':
					// - this can't ever be serialized!
					break;
				default:
					//this will be for user defined objects and String, Array and all the rest
					arr[arr.length] = obj.ExactType;
					break;
			}
			arr[arr.length] = '"';
		}
		//end tag
		arr[arr.length] = '>';
		//kids
		if (obj.Kids.length == 0) {
			//no kids so put the value in
			if ((obj.ExactType) == 'n/a') {
				if (obj.Value  === undefined) {
					arr[arr.length] = 'undefined';
				} else {
					arr[arr.length] = 'null';
				}
			} else {
				//Only show Value data for objects that arn't containers.
				if (!obj.IsContainer) {
					arr[arr.length] = escapeXML(obj.Value);
				}
			}
		} else {
			//put line break for the contents
			if (theSerializer.Prefs.ShowLineBreaks) {
				arr[arr.length] = '\n';
			}
		}
	}
	
	return arr.join('');
}

//Formats a single item in a collection and returns the serialized string
function GetXMLStringItemEnd(obj) {
	var arr = new Array;	//use array for performace gain
	
	if (obj) {
		//smart indent
		if (obj.Kids.length > 0) {
			if (theSerializer.Prefs.SmartIndent) {
				arr[arr.length] = getIndent(obj);
			}
		}
		
		//closing tag
		arr[arr.length] = '</';
		arr[arr.length] = getNodeName(obj);
		arr[arr.length] = '>';
		
		//line breaks
		if (theSerializer.Prefs.ShowLineBreaks) {
			arr[arr.length] = '\n';
		}
	}
	
	return arr.join('');
}

//escapes a string to make it XML safe
function escapeXML(strXML){
	if (strXML) {
		strXML = strXML.toString();
		//escape the sequence to render ok
		var arrEscape = [['&', '&amp;'],['<', '&lt;'],['>', '&gt;']];
		for (var i = 0; i<arrEscape.length; i++){
			var r = new RegExp(arrEscape[i][0], 'gi');
			strXML = strXML.replace(r, arrEscape[i][1]);
		}
	}
	return strXML;
}

//returns the tabbed indent string
function getIndent(obj) {
	var str = '';
	while (obj.Parent != null) {
		str = '\t' + str;
		obj = obj.Parent;
	}
	return str;
}

//returns the name of the node as a string
function getNodeName(obj) {
	//node name
	var nodeName;
	if (obj.Parent == null) {
		//root name
		if (XMLStringRoot) {
			var nodeName = XMLStringRoot;
		} else {
			var nodeName = obj.Name;
		}
	} else {
		if (parseInt(obj.Name) == obj.Name) {
			var nodeName = 'Item';
		} else {
			var nodeName = obj.Name;
		}
	}
	return nodeName;
}

}