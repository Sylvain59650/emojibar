function EmojiBar() {
  return this;
}


function boldify() {
  var elem = document.querySelector("#t2");
  elem.focus();
  document.execCommand('bold', false, null);
}

function insertHtml(html) {
  var elem = document.querySelector("#t2");
  elem.focus();
  document.execCommand('insertHTML', false, html);
}

function fontify() {
  debugger;
  var text = document.getSelection();
  var html = "<font size=48>" + text + "</font>";
  insertHtml(html);

}

function onclicked(evt) {
  debugger;
  var elem = document.querySelector(this.attachId);
  elem.focus();
  var text = "";
  if (evt.srcElement) text = evt.srcElement.innerText;
  else text = evt.currentTarget.textContent;
  //   text = "<font size=32>" + text + "</font>";
  elem.focus();
  document.execCommand('bold', false, null);
  elem.insertAtCaret(text);
}

function showPage(showing) {
  var page = document.querySelector(".emojis");
  if (showing && page.className.indexOf("emojis-hide") >= 0) {
    var attachTo = document.querySelector("#" + page.attachTo);
    setPlacement(page, attachTo.offsetLeft, attachTo.offsetTop);
    page.className = page.className.replace(" emojis-hide", "");

  } else if (!showing && page.className.indexOf("emojis-hide") === -1) {
    page.className += " emojis-hide";
  }
}

function toogleEmojisPage(evt) {
  var page = document.querySelector(".emojis");
  if (page.className.indexOf("emojis-hide") >= 0) {
    var attachTo = document.querySelector("#" + page.attachTo);
    setPlacement(page, attachTo.offsetLeft, attachTo.offsetTop);
    page.className = page.className.replace(" emojis-hide", "");

  } else {
    page.className += " emojis-hide";
  }
  // if (page.style.display == "none") {
  //   page.style.display = "inline";
  // } else {
  //   page.style.display = "inline";
  // }
}

function clickOutsidePage(evt) {
  if (pageEmojis != evt.target && evt.target.id !== "more_emojis") {
    showPage(false);
  }
}

function SetClickOutside(pageEmojis) {
  window.addEventListener('click', clickOutsidePage);
}



HTMLTextAreaElement.prototype.insertAtCaret = function(text) {
  text = text || '';
  if (document.selection) {
    // IE
    this.focus();
    var sel = document.selection.createRange();
    sel.text = text;
  } else if (this.selectionStart || this.selectionStart === 0) {
    // Others
    var startPos = this.selectionStart;
    var endPos = this.selectionEnd;
    this.value = this.value.substring(0, startPos) +
      text +
      this.value.substring(endPos, this.value.length);
    this.selectionStart = startPos + text.length;
    this.selectionEnd = startPos + text.length;
  } else {
    this.value += text;
  }
};


function setPlacement(elem, x_pos, y_pos) {
  elem.style.position = "absolute";
  elem.style.left = x_pos + 'px';
  elem.style.top = y_pos + 'px';
}


var emojisBar = [{
  "range": [8252, 8252]
}, {
  "range": [8265, 8265]
}];

function toHexa(num) { return num.toString(16); }

function toDecimal(hexa) { return parseInt(hexa, 16); }

function insertEmojisBar(emojiBarId, attachToId, emojis, emojiClass) {
  insertEmojisPage(emojiBarId, attachToId, emojis, emojiClass);
  var parent = document.querySelector("#" + emojiBarId);
  var st = "<li id='more_emojis' onclick='toogleEmojisPage()'>...</li>";
  parent.insertAdjacentHTML("beforeend", st);
}


function insertEmojisPage(emojisPageId, attachToId, emojis, emojiClass, emojiCategory) {
  attachToId = attachToId || "body";
  if (attachToId == "body") {
    emojiClass += " " + "emojis-hide";
  }
  st = "<ul class='" + emojiClass + "' id='" + emojisPageId + "'>";
  for (var ii = 0, l = emojis.length; ii < l; ii++) {
    var item = emojis[ii];
    for (var i = item.range[0]; i <= item.range[1]; i++)
      st += "<li title=" + i + ">&#" + i + "</li>";
  }
  st += "</ul>";

  var textarea = document.querySelector(attachToId);
  textarea.insertAdjacentHTML("beforeBegin", st);
  var lis = document.querySelectorAll("#" + emojisPageId + " li");
  for (var i = 0, l = lis.length; i < l; i++) {
    var li = lis[i];
    li.onclick = onclicked;
  }
}


var pageEmojis = null;

function attachEmojisPageTo(elementId) {
  pageEmojis = document.querySelector(".emojis");
  pageEmojis.attachTo = elementId;
  SetClickOutside(pageEmojis);
}