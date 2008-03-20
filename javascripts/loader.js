// loader.js, version 1.0.0
// 
// Your friendly neighborhood AJAX-based gracefully
// degrading unobtrusive-scripting link-loader.
// 
// For more information, please visit the project
// homepage at:
// http://github.com/brendan/loaderjs
// 
// Thanks! --brendan@usergenic.com

// Wrap this whole thing in a check for reasonable
// level of javascript; i.e. if we can't find the
// Array#push function, then we're certainly not going
// to be doing any AJAX.
if(typeof(Array.prototype)!='undefined' &&
   typeof(Array.prototype.push)!='undefined') {
  function Loader() {
    this.script_links = this.getScriptLinkTags();
    this.load_queue = new Array;
    for(var s = 0; s < this.script_links.length; s++) {
      this.load_queue.push(this.script_links[s].href);
    }
    this.eval_buffer = "";
    this.processLoadQueue();
  }
  Loader.prototype.getAllLinkTags = function() {
    return document.getElementsByTagName("link");
  }
  Loader.prototype.getScriptLinkTags = function() {
    var all_links = this.getAllLinkTags();
    var script_links = new Array;
    for(var a = 0; a < all_links.length; a++) {
      var link = all_links.item(a);
      if(link.rel &&
         link.type &&
         link.href &&
         link.rel == 'script' &&
         link.type == 'text/javascript') {
         script_links.push(link);
      }
    }
    return script_links;
  }
  Loader.prototype.evalScript = function(script) {
    // Don't evaluate a script unless it contains something
    // other than whitespace, because it will bomb in IE.
    if(script.match (/[^\s]/)) {
      // IE has this execScript method (!) to make up for
      // scoping problems with setTimeout implementation.
      if(window.execScript) window.execScript(script);
      // everybody else uses setTimeout because they can.
      else window.setTimeout(script,0);
    }
  }
  Loader.prototype.processLoadQueue = function() {
    if(this.load_queue.length == 0) return true;
    var url = this.load_queue.shift();
    var xhr = false;
    var self = this;
    if(window.XMLHttpRequest) { // Moz, Safari, ...
      xhr = new XMLHttpRequest();
      if(xhr.overrideMimeType) {
        xhr.overrideMimeType('text/javascript');
      }
    }
    else if (window.ActiveXObject) { // IE
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(!xhr) return false;
    xhr.onreadystatechange = function() {
      self.processXHRResponse(xhr)
    }
    xhr.open('GET', url, true);
    xhr.send(null);
  }
  Loader.prototype.processXHRResponse = function(xhr) {
    if(xhr.readyState == 4 && xhr.status == 200) {
      this.evalScript(xhr.responseText);
      this.processLoadQueue();
    }
  }
  var Loader = new Loader;
}
