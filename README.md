# JavaScript-Serializer

## Intro
This project is a JavaScript object serializer that will preserve object types and the entire object model and custom objects.

The serializer will return the JavaScript object as a string, that string is written in pure JavaScript notation and to deserialize it back to a JavaScript object you can simply call eval() on the string.

In additional the serializer has the option to output the JavaScript object as a formatted XML string.

## Demo
A fully featured demo including all available properties is available in the [test_html](https://github.com/iconico/JavaScript-Serializer/tree/master/test_html) directory.

## A little history (TLDR)
This project was written circa 2004, and is written in ES3 and fully compatible with ES6 and beyond. The project was originally built to solve client side data persistence issues. Back in the early 2000s there was no local storage, no jQuery, and AJAX websites were rare and difficult given the limitations of Internet Explorer 4 and Netscape 4, the most popular browsers of the time. Websites round-tripped to the server with every page load, and persisting anything but the tiniest of objects had to be done on the server using the cookie as a key, or by passing querystring data, which was again limited.

I was working at the time on a project for a client that needed a shopping cart. For some technical reasons that I forget the cart had to be made purely client-side, and post the results to the backend in XML. I needed some way of persisting my cart contents and save my JavaScript cart object to a string and store it in the cookie and then pull it out of the cookie when the next page loaded. Rather than solve this for just my case I took the generic approach. I reasoned that rather than store the JavaScript object in some custom format, or in JSON, which was new at the time, I'd store my JavaScript as, you guessed it, a string containing the JavaScript object. Then all I would need to do is call eval() on the object to deserialize it and recreate my shopping cart on the next page load.

To go further I realized that when it came to posting the XML data back to the server in XML I could use a similar formatter to serialize the JavaScript object out to an XML string. This led to the architecture of having a single serializer.js file which accepts a JavaScript object and stores it, along with some type data throughout the object tree. I then wrote serailizer-js.js which renders the object as a JavaScript string, and serailizer-xml.js which renders the object as XML.

Although started to solve a problem that may not be as prevalent today, especially given the rise of JSON, there are still many applications for the serializer. Being able to convert in-memory JavaScript objects to a lossless format for storage, that is independent of the serializer itself can be a huge benefit, and I would be happy to see this project used in NodeJS libraries. I've taken a look through the current stock of similar projects on GitHub and have yet to find anyone who has taken the same approach that I have. I'd very much welcome feedback and extensions to the project. There are TODO comments in the code that can still be explored, including an XML deserializer, and additional output types, JSON, YAML, etc. I'd welcome any additions and branching the project for an ES6 or TypeScript version would also be welcome.

## Installation
Add the following in your HTML file:
```
<script language="javascript" src="../dist/serializer-min.js"></script>
```
To serialize JavaScript objects to a JavaScript string format add the following:
```
<script language="javascript" src="../dist/serializer-js-min.js"></script>
```
To serialize JavaScript objects to an XML format add the following:
```
<script language="javascript" src="../dist/serializer-xml-min.js"></script>
```

## Usage
Create a JavaScript object that you wish to serialize:
```
objTest = { foo:'bar', counter: 123 }
```
Create a new JSSerializer object and call the Serialize method passing in the object that you want to serialize
```
objSerializer = new JSSerializer();
objSerializer.Serialize(objTest);
```
To output the current serialized object to a JavaScript string format call the GetJSString method, passing the name of the variable that you wish the object to be stored as:
```
var strJS = objSerializer.GetJSString('objTest');
```
Similarly, to output in XML format use the GetXMLString method:
```
var strXML = objSerializer.GetXMLString('objTest');
```

### Deserializing
Deserializing the JavaScript object can be acomplished simply by evaluating the JavaScript string.
```
eval(strJS);
```
Note that the XML format currently cannot be deserialized.

## Preferences
- SmartIndent
    -    Boolean, default false
    -    If the output is indented by tabs. This preference only applies to the GetXMLString() method.
- ShowLineBreaks
    -    Boolean, default false
    -    If the output contains line breaks.
- ShowTypes
    -    Boolean, default false
    -    If the output contains types. This preference only applies to the GetXMLString() method.

### Preferences Usage
The types are defined off of the Prefs property object.
```
objSerializer.Prefs.SmartIndent = true;
```

## Types
- UseNull
    -    Boolean, default true
    -    If Null properties of the object being serialized are included.
- UseUndefined
    -    Boolean, default true
    -    If Undefined properties of the object being serialized are included.
- UseArray
    -    Boolean, default true
    -    If Array properties of the object being serialized are included.
- UseObject
    -    Boolean, default true
    -    If Object properties of the object being serialized are included.
- UseBoolean
    -    Boolean, default true
    -    If Boolean properties of the object being serialized are included.
- UseDate
    -    Boolean, default true
    -    If Date properties of the object being serialized are included.
- UseError
    -    Boolean, default true
    -    If Error properties of the object being serialized are included.
- UseFunction
    -    Boolean, default true
    -    If Function properties of the object being serialized are included.
- UseNumber
    -    Boolean, default true
    -    If Number properties of the object being serialized are included.
- UseRegExp
    -    Boolean, default true
    -    If RegExp properties of the object being serialized are included.
- UseString
    -    Boolean, default true
    -    If String properties of the object being serialized are included.
- UseUserDefined
    -    Boolean, default true
    -    If user defined Objects that are properties of the object being serialized are included.
- UseObjectsForUserDefined
    -    If user defined Objects are declared as their defined type, or if they are serialized as Object properties.
    -    Boolean, default false

### Types Usage
The types are defined off of the Types property object.
```
objSerializer.Types.UseNull = false;
```

## Rules
- CheckInfiniteLoops
    -    Boolean, default true
    -    Check for infinte loops where child properties can reference parent objects, and exclude child properties in this case.
- MaxDepth
    -    Integer, default null
    -    Maximum depth of child properties to serialize. If left as Null then this value is ignored, and no check is performed.

### Rules Usage
The rules are defined directly off of the base serializer object.
```
objSerializer.CheckInfiniteLoops = false;
```
