function mtdGetXMLString(e){var t=this,r=e,n=new Array;return n[n.length]=a(this.Data),n[n.length]=function e(n){var t=new Array;if(n)for(var r=0;r<n.Kids.length;r++)t[t.length]=a(n.Kids[r]),t[t.length]=e(n.Kids[r]),t[t.length]=l(n.Kids[r]);return t.join("")}(this.Data),n[n.length]=l(this.Data),n.join("");function a(e){var n=new Array;if(e){if(t.Prefs.SmartIndent&&(n[n.length]=i(e)),n[n.length]="<",n[n.length]=h(e),t.Prefs.ShowTypes){switch(n[n.length]=' type="',e.ExactType){case"n/a":void 0===e.Value?n[n.length]="undefined":n[n.length]="Object";break;case"Enumerator":case"VBArray":break;default:n[n.length]=e.ExactType}n[n.length]='"'}n[n.length]=">",0==e.Kids.length?"n/a"==e.ExactType?void 0===e.Value?n[n.length]="undefined":n[n.length]="null":e.IsContainer||(n[n.length]=function(e){if(e){e=e.toString();for(var n=[["&","&amp;"],["<","&lt;"],[">","&gt;"]],t=0;t<n.length;t++){var r=new RegExp(n[t][0],"gi");e=e.replace(r,n[t][1])}}return e}(e.Value)):t.Prefs.ShowLineBreaks&&(n[n.length]="\n")}return n.join("")}function l(e){var n=new Array;return e&&(0<e.Kids.length&&t.Prefs.SmartIndent&&(n[n.length]=i(e)),n[n.length]="</",n[n.length]=h(e),n[n.length]=">",t.Prefs.ShowLineBreaks&&(n[n.length]="\n")),n.join("")}function i(e){for(var n="";null!=e.Parent;)n="\t"+n,e=e.Parent;return n}function h(e){if(null==e.Parent)if(r)var n=r;else n=e.Name;else if(parseInt(e.Name)==e.Name)n="Item";else n=e.Name;return n}}JSSerializer.prototype.GetXMLString=mtdGetXMLString;