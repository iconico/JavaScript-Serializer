// Nico Westerdale - 1/2004  - www.iconico.com

// SerializerJS.js
// This pluggable JS file adds a formatting method to the Serializer

//Methods
JSSerializer.prototype.GetJSString = mtdGetJSString;

//method
function mtdGetJSString(strRoot) {
	var theSerializer = this;	//easier to reference later on
	var JSStringRoot = strRoot;	//root function name
	var arr = new Array;		//use array for performace gain
	arr[arr.length] = GetJSStringItem(this.Data)
	arr[arr.length] = GetJSStringAll(this.Data);
	return arr.join('');


//recursive function
function GetJSStringAll(obj) {
	var arr = new Array;	//use array for performace gain
	if (obj) {
		for (var i=0; i<obj.Kids.length; i++) {
			arr[arr.length] = GetJSStringItem(obj.Kids[i]);
			arr[arr.length] = GetJSStringAll(obj.Kids[i])
		}
	}
	return arr.join('');
}


//Formats a single item in a collection and returns the serialized string
function GetJSStringItem(obj) {
	var arr = new Array;	//use array for performace gain
	
	//javascript safe string quote
	function QuoteString(str) {
		str = str.replace(/(["'\\])/g,'\\$1');
		str = str.replace(/\x0D/g,"\\r");
  		str = str.replace(/\x0A/g,"\\n");
		return str;
	}
	
	if (obj) {
	
		//get path
		arr[arr.length] = ItemPath(obj);
		
		if (obj.Link != null) {
			//link to ancestor object
			arr[arr.length] = ' = ' + ItemPath(obj.Link) + ';';
		} else {
			//regular object
			switch (obj.ExactType) {
				case 'n/a':
					if (obj.Value === undefined) {
						arr[arr.length] = ' = undefined;';
					} else {
						if (obj.Value === null) {
							arr[arr.length] = ' = null;';
						} else {
							arr[arr.length] = ' = new Object;';	//DOM nodes and other 'forgien objects' evaluate to this
						}
					}
					break;
				case 'Array':
					arr[arr.length] = ' = new Array;';
					break;
				case 'Object':
					arr[arr.length] = ' = new Object;';
					break;
				case 'Boolean':
					if (obj.Type == 'boolean')
						arr[arr.length] = ' = ' + obj.Value + ';';
					else
						arr[arr.length] = ' = new Boolean(' + obj.Value + ');';
					break;
				case 'Date':
					arr[arr.length] = ' = new Date(\'' + obj.Value + '\');';
					break;
				case 'Enumerator':
					// - this can't ever be serialized!
					break;
				case 'Error':
					arr[arr.length] =  ' = new Error;';
					break;
				case 'Function':
					arr[arr.length] = ' = ' + obj.Value + ';';
					break;
				case 'Number':
					if (obj.Type == 'number')
						arr[arr.length] = ' = ' + obj.Value + ';';
					else
						arr[arr.length] = ' = new Number(' + obj.Value + ');';
					break;
				case 'RegExp':
					arr[arr.length] = ' = new RegExp(' + obj.Value + ');';
					break;
				case 'String':
					if (obj.Type == 'string')
						arr[arr.length] = ' = \'' + QuoteString(obj.Value) + '\';';
					else
						arr[arr.length] = ' = new String(\'' + QuoteString(obj.Value) + '\');';
					break;
				case 'VBArray':
					// - this can't ever be serialized!
					break;
				default:
					//this will be for user defined objects
					arr[arr.length] = ' = new ' + obj.ExactType + ';';
					break;
					
			}
		}
		//line breaks
		if (theSerializer.Prefs.ShowLineBreaks) {
			arr[arr.length] = '\n';
		}
	}
	
	return arr.join('');
	
	
	//returns the path to the item
	function ItemPath(obj) {
		var str = RenderItemName(obj);
		//we concatenate the parent's name in here
		while (obj.Parent != null) {
			str = RenderItemName(obj.Parent) + str;
			obj = obj.Parent;
		}
		return str;
		
		//renders the individual name
		function RenderItemName(obj) {
			if (obj.Parent == null) {
				//root name
				if (JSStringRoot) {
					return JSStringRoot;
				} else {
					return obj.Name;
				}
			} else {
				if (isNaN(obj.Name)) {
					switch (obj.Parent.ExactType) {
						case 'Array':
							return '[' + obj.Name + ']';
							break;
						default:
							return '.' + obj.Name;
							break;
					}
				} else {
					//if the name of the item is a number we always need to use this syntax
					//	this happenes when emumerating the 'arguments' object
					return '[' + obj.Name + ']';
				}
			}
		}
	}
}


}