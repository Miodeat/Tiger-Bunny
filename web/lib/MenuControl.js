MenuControl = function (ops) {
    let me = this;
    me.options = $.extend({
        "div": "menu"
    }, ops);

    // initialize menu bar
    me.menubar = $("#" + me.options.div).addClass("btn-group row")
        .addClass("menubar");
    me._init();
};

MenuControl.prototype._init = function(){
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
    // a json object contain id and text of a "<a>" as menu item,
    // which is used to select current edit layer.
    let editLyrItemObj = {
        id: "editLyrItem",
        text: "选择编辑图层",
        href: "#editLyrModal"
    };

    let lyrItems = [addLyrItemObj, delLyrItemObj, editLyrItemObj];
    // create drop down menu
    me.lyrMenuGroup = me._addDropDownMenu(me.menubar, "lyrDropDown", "图层控制", lyrItems);
    // create button menu to export layer
    me.exportMenu = me._addBtnMenu(me.menubar, "exportLyr", "导出图层", "#exportLyrModal");

};

MenuControl.prototype._addBtnMenu = function(target, menuID, menuTxt, href){
    let me = this;
    return $("<div>").appendTo(target)
        .addClass("btn btn-dark col-md-1 menu-spacing")
        .attr({
            "id": menuID,
            "type": "button",
            "data-toggle": "modal",
            "data-target": href
        })
        .text(menuTxt);
};


MenuControl.prototype._addDropDownMenu = function (target, menuID, menuTxt, items) {
    let me = this;
    let lyrMenuGroup = $("<div>").appendTo(target).addClass("btn-group");
    $("<button>").appendTo(lyrMenuGroup)
        .addClass("btn btn-dark dropdown-toggle first-menu-spacing")
        .attr({
            "id": menuID,
            "type": "button",
            "data-toggle": "dropdown"
        })
        .text(menuTxt);

    me._addDropDownMenuItem(lyrMenuGroup, items);
    return lyrMenuGroup;
};

MenuControl.prototype._addDropDownMenuItem = function (target, items) {
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