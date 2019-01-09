// Nico Westerdale - 1/2004-7  - www.iconico.com

// Serializer.js

//	TODO: error trapping
//	TODO: Internt Explorer 4 doesn't support try-catch statements!


//Serializer object
function JSSerializer() {
	//properties
	this.Data = null;		//this is the root for the internal SerialData object
	//methods
	this.Serialize = mtdSerialize;
	this.HasData = function() {return this.Data?true:false};	//whether Data has been loaded into the Serializer
	this.MaxDepth = null;
	this.CheckInfiniteLoops = true;
	//locals
	var theSerializer = this;	//easier to reference later on
	var currDepth = 0;
	
	//TODO: Unchanged Prototype Data Exclusion
	//	Would be really nice to have an option to exclude the data that's in the prototype.
	//	This is a little tricky to accomplish so I'm going to leave it for v2.0
	//	You have to check prototype inheritance situations like this one:
	//		Monkey.prototype = new Ape();
	//		Monkey.prototype.constructor = Monkey;
	//	And to compund the problem, Ape could also inherit, so it needs to be recursive.
	//	This is further confused by properties being set in the prototypes too.

	//TODO:
	//this.GetJSDataSerialString <- this should be a JSON string - then write a method to seed data back in!
	//	also do this from XML, should be easy to write a simple parser etc.
	//TODO: also make this into a Javascript  HTML code colorizer = use CSS for the display
	
	
//serializes any Javascript object and returns a string
function mtdSerialize(obj) {
	if (IsSerializable('SrliZe', obj)) {
		//Set root SerialData object to be the root object passed in to be serialized
		//	We give it the default name 'SrliZe'
		this.Data = new SerialData('SrliZe', obj, null);
		//Start serializing entire tree
		SerializeAll(obj, this.Data);
		//Return true because we could serialize something
		return true;
		//TODO: Should keep track of whether we could serialize the entire tree.
	} else {
		//Couldn't serialize anything
		return false;
	}
}

//Private functions


//recursive serialization function
function SerializeAll(obj, objParent) {
	
	currDepth++;
	//depth check
	if ((theSerializer.MaxDepth==null) || (theSerializer.MaxDepth=='') || (theSerializer.MaxDepth < 0) || (currDepth <= theSerializer.MaxDepth)) {
		var i;
		var objSerial;
		var blnDidForIn = false;
		//loop through items
		try {
			for (i in obj) {
				SerializeItem(i, obj, objParent);
				blnDidForIn = true;
			}
		} catch (e) {
			//some DOM container objects throw enumeration errors here, i.e. the extrnal object 
		}
		//alternate enumeration for objects.
		//	Objects like the 'arguments' object need this type of enumeration
		if (!blnDidForIn) {
			if (obj) {
				if (obj.length && (GetExactType(obj) == 'Object')) {
					for (var i = 0; i < obj.length; i++) {
						SerializeItem(i, obj, objParent);
					}
				}
			}
		}
	
	}
	currDepth--;
}

//serializes an individual item
function SerializeItem(i, obj, objParent) {
	//for now we're going to ignore non-serializable objects
	if (IsSerializable(i, obj[i])) {
		//build the SerialData object to encapsulate this item
		objSerial = new SerialData(i, obj[i], objParent);
		//assign this item to it's parent's Kids array
		objParent.Kids[objParent.Kids.length] = objSerial;
		//check infinite loops
		if (theSerializer.CheckInfiniteLoops) {
			//save the actual object, this is used to check links
			objSerial.RealObject = obj[i];
			//TODO: Might want to delete these after serializing object is complete
			//Add any links to ancestors
			objSerial.Link = findSerialLink(objSerial);
		}
		//recurse down the object tree if container object and not a linked object
		if ((IsContainerType(obj[i])) && (objSerial.Link == null)) {
			SerializeAll(obj[i], objSerial)
		}
	}
}

//returns an ancestor object if it's identical to this one
function findSerialLink(objSerial) {
	//check parents to see if they are the same object as this
	var obj = objSerial;
	blnDidCheck = false;
	try {
		while ((obj.Parent != null) && (obj.Parent.RealObject != objSerial.RealObject)) {
			blnDidCheck = true;
			obj = obj.Parent;
		}
	} catch (e) {
		return null;	//Some DOM objects throw errors when trying to equate obj.Parent.RealObject!
	}
	//return object
	if (blnDidCheck) {
		return obj.Parent;
	} else {
		return null;
	}
}

//Returns the type of an object from the constructor as a string
function GetExactType(obj) {
	try {
		if (obj.constructor) {
			var strType;
			strType = obj.constructor.toString().match(/function (\w*)/)[1];
			if (strType.replace(' ','') == '') strType = 'n/a';			//Mozilla needs this
			if (theSerializer.Types.UseObjectsForUserDefined && ! (strType in oc(['Array','Boolean','Date','Enumerator','Error','Function','Number','RegExp','String','VBArray'])) ) {
				strType = 'Object';
			}
			return strType;
		} else {
			return 'n/a';
		}
	} catch(e) {
		return 'n/a';
	}
}

//Object converter function
function oc(a) {
	var o = {};
	for(var i=0;i<a.length;i++) {
		o[a[i]]='';
	}
	return o;
}

//Returns true if the javascript object can be expanded.
function IsContainerType(obj) {
	try {
		//return (GetExactType(obj) != 'Boolean' && GetExactType(obj) != 'Date' && GetExactType(obj) != 'Enumerator' && GetExactType(obj) != 'Function' && GetExactType(obj) != 'Number' && GetExactType(obj) != 'RegExp' && GetExactType(obj) != 'String' && GetExactType(obj) != 'VBArray' && GetExactType(obj) != null && GetExactType(obj) !== undefined && GetExactType(obj) != 'n/a')
		return (GetExactType(obj) != 'Boolean' && GetExactType(obj) != 'Date' && GetExactType(obj) != 'Enumerator' && GetExactType(obj) != 'Function' && GetExactType(obj) != 'Number' && GetExactType(obj) != 'RegExp' && GetExactType(obj) != 'String' && GetExactType(obj) != 'VBArray' && GetExactType(obj) != null && GetExactType(obj) !== undefined)
	} catch(e) {
		return false;
	}
}

//Returns true if the object can be serialized.
//Returns false if the object cannot
function IsSerializable(strName, obj) {
	try {
		//check Types to see what we should serialize
		switch (GetExactType(obj)) {
			case 'n/a':
				if (obj == undefined) {
					return theSerializer.Types.UseUndefined;
				} else {
					return theSerializer.Types.UseNull;
				}
				break;
			case 'Array':		return theSerializer.Types.UseArray;	break;
			case 'Object':		return theSerializer.Types.UseObject;	break;
			case 'Boolean':		return theSerializer.Types.UseBoolean;	break;
			case 'Date':		return theSerializer.Types.UseDate;	break;
			case 'Enumerator':	return false;	break;	// - this can't ever be serialized!
			case 'Error':		return theSerializer.Types.UseError;	break;
			case 'Function':
				if (strName=='constructor') {
					//Check that this isn't the object's constructor, which we never serialize.
					//This is only neccesary in Mozilla.
					return false;
				} else {
					return theSerializer.Types.UseFunction;
				}
				break;
			case 'Number':		return theSerializer.Types.UseNumber;	break;
			case 'RegExp':		return theSerializer.Types.UseRegExp;	break;
			case 'String':		return theSerializer.Types.UseString;	break;
			case 'VBArray':		return false;	break;	// - this can't ever be serialized!
			default:			return theSerializer.Types.UseUserDefined;	break;
		}
		
	} catch(e) {
		return false;
	}
}

//Constructor
//The SerialData object is used internally by the serializer to maintain the object in it's hierarchy
//This object's properties (apart from Kids) are all meant to be read-only after it's constructed.
function SerialData(strName, obj, objParent) {
	//properties
	this.Name = strName;		//This is the name of the object or property or method.
	//This is the value of the property. This can be of any type.
	if (obj != null) {
		try {
			if (obj.toString) {					//If we use a DOM object some nodes fail here, e.g. the namespaces collection
				this.Value = obj.toString();	//We save the string representation of the object
			}
		} catch (e) {}					//Some DOM objects throw errors on obj.toString!
	} else {
		this.Value = obj;				//This could be either null or undefined
	}
	//Used for checking infinite loops
	this.RealObject = null;
	//the type of the object retrieved from using typeof()
	this.Type = typeof(obj);
	//the name of the constructor of the object
	this.ExactType = GetExactType(obj);
	//Whether the object is of a type that has kids
	this.IsContainer = IsContainerType(obj);
	//points to the parent SerialData object. Top level SerialData object will have null parent
	this.Parent = objParent;
	//array of child SerialData objects
	this.Kids = new Array;
	//link to an ancestor SerialData object, where appropriate
	this.Link = null;
}


}

JSSerializer.prototype.Prefs = new SerialPrefs();

//Constructor
//The SerialPrefs object is used for output rendering preferences
//	Different formatter objects may add properties to the SerialPrefs object
function SerialPrefs() {
	//properties
	this.ShowLineBreaks = false;	//Whether to render line breaks in formatter output
	this.SmartIndent = false;		//Whether to insert tabs in output based on hierarchy. Used by XML formatters mainly.
	this.ShowTypes = false;			//Whether to show the data types in the output. Used by XML formatters mainly.
	//TODO:	this.ShowErrors = false;	//Whether to show javascript errors or fail gracefully
}

JSSerializer.prototype.Types = new SerialTypes();

//Constructor
//The SerialTypes object is used for runtime choices of which types of objects should be serialized
function SerialTypes() {
	//properties
	this.UseNull = true;
	this.UseUndefined = true;
	this.UseArray = true;
	this.UseObject = true;
	this.UseBoolean = true;
	this.UseDate = true;
	this.UseError = true;
	this.UseFunction = true;
	this.UseNumber = true;
	this.UseRegExp = true;
	this.UseString = true;
	this.UseUserDefined = true;		//this will be for user defined objects
	this.UseObjectsForUserDefined = false;
}