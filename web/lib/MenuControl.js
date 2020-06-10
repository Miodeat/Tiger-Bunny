MenuControl = function (ops) {
    let me = this;
    me.options = $.extend({
        "div": "menu"
    }, ops);

    // initialize menu bar
    me.menubar = $("#" + me.options.div).addClass("btn-group row")
        .addClass("menubar");
    me.init();
};

MenuControl.prototype.init = function(){
    let me = this;

    // a json object contain id and text of a "<a>" as menu item,
    // which is used to add a layer.
    let addLyrItemObj = {
        id: "addLyrItem",
        text: "添加图层",
        href: "#addLyrModal"
    };
    // a json object contain id and text of a "<a>" as menu item,
    // which is used to delete a layer.
    let delLyrItemObj = {
        id: "delLyrItem",
        text: "删除图层",
        href: "#delLyrModal"
    };
    let lyrItems = [addLyrItemObj, delLyrItemObj];
    // create drop down menu
    me.lyrMenuGroup = me.addDropDownMenu(me.menubar, "lyrDropDown", "图层控制", lyrItems);

    me.exportMenu = me.addBtnMenu(me.menubar, "exportLyr", "导出图层");

    $("<div>").appendTo(me.menubar).addClass("col-md-10");
};

MenuControl.prototype.addBtnMenu = function(target, menuID, menuTxt){
    let me = this;
    return $("<div>").appendTo(target)
        .addClass("btn btn-primary col-md-1")
        .attr({
            "id": menuID,
            "type": "button"
        })
        .text(menuTxt);
};


MenuControl.prototype.addDropDownMenu = function (target, menuID, menuTxt, items) {
    let me = this;
    let lyrMenuGroup = $("<div>").appendTo(target).addClass("btn-group col-md-1");
    $("<button>").appendTo(lyrMenuGroup)
        .addClass("btn btn-primary dropdown-toggle")
        .attr({
            "id": menuID,
            "type": "button",
            "data-toggle": "dropdown"
        })
        .text(menuTxt);

    me.addDropDownMenuItem(lyrMenuGroup, items);
    return lyrMenuGroup;
};

MenuControl.prototype.addDropDownMenuItem = function (target, items) {
    let me = this;
    let lyrMenu = $("<div>").appendTo(target)
        .addClass("dropdown-menu");
    for (let i = 0; i < items.length; i++) {
        let menuItem = $("<a>").appendTo(lyrMenu)
            .addClass("dropdown-item")
            .attr({
                "id": items[i].id,
                "href": items[i].href,
                "data-toggle": "modal"
            })
            .text(items[i].text);
    }

};