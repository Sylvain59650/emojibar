class EmojiPopin extends EmojiBar {

  constructor(params) {
    console.log("constructor popin");
    super(params);
    document.addEventListener("emojis.onclickIcon", this.onclickIcon.bind(this));
  }

  onclickIcon() {
    this.showPage(false);
  }

  showPage(showing) {
    console.log("showPage", showing);
    var page = this.page;
    if (showing && page.hasClass("emojis-hide")) {
      var attachTo = document.querySelector(page.attachTo);
      page.css({ position: "absolute", left: attachTo.offsetLeft + "px", top: attachTo.offsetTop + "px" });
      page.removeClass("emojis-hide");

    } else if (!showing && !page.hasClass("emojis-hide")) {
      page.addClass("emojis-hide");
    }
  }

  clickCategory(evt) {
    console.log("clickCategory");
    evt.stopImmediatePropagation();
    var cat = evt.target.attr("cat");
    console.log("cat", cat);
    var emojis = this.params.data.where(x => x.cat === cat);
    this.redraw(this.bar2, emojis);
  }

  _construct() {
    console.log("popin _construct");
    var div = newElement("div", { id: "emoji-page" });
    div.addClass(this.params.className);
    this.bar1 = newElement("ul", { id: "emoji-bar1", class: "emojis" });
    for (var ii = 0, l = this.params.data.length; ii < l; ii++) {
      var item = this.params.data[ii];
      if (item.cat != null) {
        var li = newElement("li", { cat: item.cat }, "&#" + item.range[0]);
        li.onclick = this.clickCategory.bind(this);
        this.bar1.afterBegin(li);
      }
    }

    div.afterBegin(this.bar1);
    this.bar2 = this.createBar({ id: "emoji-bar2", data: this.params.data, className: "emojis", onclickIcon: this.params.onClickIcon.bind(this) });
    div.beforeEndHTML("<br/>");
    div.beforeEnd(this.bar2);
    this.page = div;
    document.body.beforeEnd(this.page);
  }


}