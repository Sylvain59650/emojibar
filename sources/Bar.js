function EmojiBar(attachId) {
  this.attachId = attachId;
}

EmojiBar.prototype.onclick = function(evt) {
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