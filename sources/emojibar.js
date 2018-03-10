function EmojiBar(params) {
  this.params = params;
  this.params.onClickIcon = params.onClickIcon || EmojiBar.onclickIcon;
  console.log("constructor", this.params.onClickIcon);
  this.elements = [];
  this._construct();
  return this;
}


EmojiBar.prototype._construct = function() {
  console.log("EmojiBar _construct", this.params.onClickIcon);
  this._bar = this.createBar(this.params);
}

EmojiBar.onclickIcon = function(evt) {
  console.log("onclickIcon");
  if (this.targetElem) {
    evt.stopImmediatePropagation();
    var elem = this.targetElem;
    elem.focus();
    var text = "";
    debugger;
    if (evt.target) text = evt.target.innerText;
    else text = evt.currentTarget.textContent;
    text = "<p class=emo>" + text + "</p>";
    elem.focus();
    elem.insertAtCaret(text);
    var event = new CustomEvent("emojis.onclickIcon", { text: text });
    document.dispatchEvent(event);
  }
}

EmojiBar.prototype.insertElement = function(element) {
  this.elements.push(element);
  this.redraw(this._bar, this.params.data, this.params.onClickIcon);
}


EmojiBar.prototype.createBar = function(params) {
  console.log("createBar", params.onclickIcon);
  var ul = newElement("ul", { class: params.className, id: params.id });
  this.redraw(ul, params.data, params.onclickIcon);
  document.body.beforeEnd(ul);
  return ul;
}

EmojiBar.prototype.redraw = function(container, emojis, onclickIcon) {
  console.log("redraw", this.params.onclickIcon);
  container.html("");
  onclickIcon = onclickIcon || this.params.onclickIcon || EmojiBar.onclickIcon;
  for (var ii = 0, l = emojis.length; ii < l; ii++) {
    var item = emojis[ii];
    item.range[1] = item.range[1] || item.range[0];
    for (var i = item.range[0]; i <= item.range[1]; i++) {
      var li = newElement("li", {}, "&#" + i + ";");
      // li.on("onclick", onclickIcon);      
      container.beforeEnd(li);
      if (onclickIcon) {
        li.addEventListener("click", onclickIcon.bind(this));
      } else {
        console.log("no binding");
      }
    }
  }
  if (this.elements.length > 0) {
    var right = newElement("li", { id: "emojis-elements" });
    right.css("float", "right");
    for (var i = 0; i < this.elements.length; i++) {
      console.log("redraw elements", this.elements[i].onclick);
      right.beforeEnd(this.elements[i]);
    }
    container.beforeEnd(right);
  }
}


EmojiBar.prototype.attachTo = function(targetElem, position) {
  this.targetElem = targetElem;
  if (position === "top") {
    var offset = this.targetElem.offset();
    this._bar.css({ position: "absolute", left: offset.left + "px", top: (offset.top - 32) + "px" });
  }
}


HTMLElement.prototype.getCaretPosition = function() {
  if (window.getSelection && window.getSelection().getRangeAt) {
    var range = window.getSelection().getRangeAt(0);
    var selectedObj = window.getSelection();
    var rangeCount = 0;
    var childNodes = selectedObj.anchorNode.parentNode.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i] == selectedObj.anchorNode) {
        break;
      }
      if (childNodes[i].outerHTML)
        rangeCount += childNodes[i].outerHTML.length;
      else if (childNodes[i].nodeType == 3) {
        rangeCount += childNodes[i].textContent.length;
      }
    }
    return range.startOffset + rangeCount;
  }
  return -1;
}

HTMLElement.prototype.insertAtCaret = function(text) {
  debugger;
  this.focus();
  var pos = this.getCaretPosition();
  console.log("pos", this.html(), pos);
  var h = this.html();
  this.html(h.substring(0, pos) + text + h.substring(pos));
}

HTMLElement.prototype.getCaretPosition2 = function() {
  var caretOffset = 0;
  if (typeof window.getSelection != "undefined") {
    var range = window.getSelection().getRangeAt(0);
    var preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(this);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
    var textRange = document.selection.createRange();
    var preCaretTextRange = document.body.createTextRange();
    preCaretTextRange.moveToElementText(this);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

HTMLElement.prototype.getCaretPosition2 = function() {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == this) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == this) {
      var tempEl = document.createElement("span");
      this.insertBefore(tempEl, this.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}