# JavaScript-Serializer

## Intro
This project is a JavaScript object serializer that will preserve object types and the entire object model and custom objects.

The serializer will return the JavaScript object as a string, that string is written in pure JavaScript notation and to deserialize it back to a JavaScript object you can simply call eval() on the string.

In additional the serializer has the option to output the JavaScript object as a formatted XML string.

## A little history (TLDR)
This project was written circa 2004, and is written in ES3 and fully compatible with ES6 and beyond. The project was originally built to solve client side data persistence issues. Back in the early 2000s there was no local storage, no jQuery, and AJAX websites were rare and difficult given the limitations of Internet Explorer 4 and Netscape 4, the most popular browsers of the time. Websites round-tripped to the server with every page load, and persisting anything but the tiniest of objects had to be done on the server using the cookie as a key, or by passing querystring data, which was again limited.

I was working at the time on a project for a client that needed a shopping cart. For some technical reasons that I forget the cart had to be made purely client-side, and post the results to the backend in XML. I needed some way of persisting my cart contents and save my JavaScript cart object to a string and store it in the cookie and then pull it out of the cookie when the next page loaded. Rather than solve this for just my case I took the generic approach. I reasoned that rather than store the JavaScript object in some custom format, or in JSON, which was new at the time, I'd store my JavaScript as, you guessed it, a string containing the JavaScript object. Then all I would need to do is call eval() on the object to deserialize it and recreate my shopping cart on the next page load.

To go further I realized that when it came to posting the XML data back to the server in XML I could use a similar formatter to serialize the JavaScript object out to an XML string. This lead to the architecture of having a single serializer.js file which accepts a JavaScript object and stores it, along with some type data throughout the object tree. I then wrote serailizer-js.js which renders the object as a JavaScript string, and serailizer-xml.js which renders the object as XML.
