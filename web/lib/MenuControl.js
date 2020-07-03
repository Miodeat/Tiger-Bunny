// 菜单控制组件构造函数，该组件使用 bootstrap4 创建菜单
//
// @param ops: 创建菜单需要的参数，需要包括：
//             div，存放菜单的块状元素
// @return
MenuControl = function (ops) {
    let me = this;
    me.options = $.extend({
        "div": "menu"
    }, ops);

    // 初始化菜单栏
    me.menubar = $("#" + me.options.div).addClass("btn-group row")
        .addClass("menubar");
    me._init();
};

MenuControl.prototype._init = function(){
    let me = this;

    // 用于存放创建添加图层菜单项参数的json对象
    let addLyrItemObj = {
        id: "addLyrItem", // 菜单项id
        text: "添加图层", // 菜单项标题
        href: "#addLyrModal" // 菜单项指向的模态框
    };
    // 用于存放创建删除图层菜单项参数的json对象
    let delLyrItemObj = {
        id: "delLyrItem",
        text: "删除图层",
        href: "#delLyrModal"
    };
    // 用于存放创建选择编辑图层菜单项参数的json对象
    let editLyrItemObj = {
        id: "editLyrItem",
        text: "选择编辑图层",
        href: "#editLyrModal"
    };

    let lyrItems = [addLyrItemObj, delLyrItemObj, editLyrItemObj];
    // 创建下拉菜单栏，其下属菜单栏有添加图层，删除图层和选择编辑图层
    me.lyrMenuGroup = me._addDropDownMenu(me.menubar, "lyrDropDown", "图层控制", lyrItems);
    // 创建按钮式菜单，用于导出图层
    me.exportMenu = me._addBtnMenu(me.menubar, "exportLyr", "导出图层", "#exportLyrModal");

};

// 创建按钮式菜单，用于导出图层
//
// @param target: 菜单将被添加到的图层
//        menuID: 菜单项的id
//        menuTxt: 菜单项的文本
//        href: 点击菜单项会唤出的模态框id
// @return
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

// 创建下拉菜单栏
// @param target: 菜单栏将被添加到的图层
//        menuID: 菜单栏的id
//        menuTxt: 菜单栏的文本
//        items: 菜单栏应包含的菜单项
// @return
MenuControl.prototype._addDropDownMenu = function (target, menuID, menuTxt, items) {
    let me = this;
    // 创建菜单栏
    let lyrMenuGroup = $("<div>").appendTo(target).addClass("btn-group");
    $("<button>").appendTo(lyrMenuGroup)
        .addClass("btn btn-dark dropdown-toggle first-menu-spacing")
        .attr({
            "id": menuID,
            "type": "button",
            "data-toggle": "dropdown"
        })
        .text(menuTxt);
    // 向下拉菜单栏中添加菜单项
    me._addDropDownMenuItem(lyrMenuGroup, items);
    return lyrMenuGroup;
};
// 向下拉菜单栏中添加菜单项
//
// @param target: 目标菜单栏，菜单项添加到其中
//        items: 菜单项对象列表
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