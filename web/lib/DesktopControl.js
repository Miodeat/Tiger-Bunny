// 加载完成后，创建DesktopControl对象
$(document).ready(function () {
    let desktopControl = new DesktopControl();
});

// DesktopControl构造函数，
// 该类通过MapControl，TreeCatalogControl，
// MenuControl 和 ModalControl 搭建并控制系统
//
// @param
// @return
DesktopControl = function () {
    let me = this;
    me.lyrs = ["天地图影像"]; // 系统现有的图层的列表
    me.alias = {}; // 以图层名为键，图层英文名为值的对象
    me._init(); // 初始化desktop
};

// 系统初始化函数，构建并渲染菜单、树状图和天地图影像（作为矢量化底图）
// 并创建系统需要的模态框。
//
// @param
// @return
DesktopControl.prototype._init = function () {
    let me = this;
    // 初始化一个模态框控制组件，模态框添加到 <body> 标签中
    me.modalControl = new ModalControl({
        "target": "body"
    });
    // 初始化菜单控制组件
    me.menuControl = new MenuControl({
        "div": "menu"
    });
    // 初始化图层目录树控制组件
    me.treeCalalogControl = new TreeCatalogControl({
        "div": "display",
        "data": [
            {
                name: "图层",
                nocheck: true,
                open: true,
                children:[
                    {
                        name: "天地图影像",
                        checked: true,
                    }
                ]
            }
        ]
    });
    // 初始化地图控制组件
    me.mapControl = new MapControl({
        "div": "display",
        "width": 87,
        "height": 645
    });
    // 关联图层目录树与地图控制组件
    me.treeCalalogControl.setBuddyControl(me.mapControl);

    // 设置添加图层模态框回调函数
    $("#btnCreateLyrOK").on("click", function () {
        let lyrName = me.modalControl.getAddLyrName();
        let lyrEnName = me.modalControl.getAddLyrEnName();

        if(lyrName == ""){
            alert("图层名不可为空！");
            return;
        }

        if(lyrEnName == ""){
            alert("图层英文名不可为空！");
            return;
        }
        // 检查英文别名是否含有除英文和数字外的字符
        let patternEn = new RegExp("[0-9A-Za-z]+");
        if(!patternEn.test(lyrEnName)){
            alert("图层英文别名含有非法字符");
            return;
        }

        if(me.modalControl.editableLyrs.indexOf(lyrName) > -1){
            alert("已经存在同名图层！");
            return;
        }
        let lyrType = me.modalControl.getAddLyrType();
        me.addLayer(lyrName, lyrEnName, lyrType);
    });
    // 设置删除图层模态框回调函数
    $("#btnDelLyrOK").on("click", function() {
        let lyrName = me.modalControl.getDelLyrName();
        if(lyrName == ""){
            alert("没有可删除的图层！");
            return;
        }
        me.deleteLyr(lyrName);
    });
    // 设置选择编辑图层模态框的回调函数
    $("#btnEditLyrOK").on("click", function() {
        let lyrName = me.modalControl.getEditLyrName();

        me.setEditLyr(lyrName);
    });
    // 设置导出图层模态框
    $("#btnExportLyrOK").on("click", function () {
        let lyrName = me.modalControl.getExportLyrName();
        if(lyrName == ""){
            alert("未选择要导出的图层！");
            return;
        }
        me.exportLyr(lyrName);
    });
};

// 添加一个矢量图层
//
// @param lyrName: 添加的图层的名称
//        lyrEnName: 添加的图层的英文名称，用于在数据库中创建表
//        lyrType: 添加的矢量图层的类型（点或线或面）
// @return
DesktopControl.prototype.addLayer = function (lyrName, lyrEnName, lyrType) {
    let me = this;

    // 通过ajax访问php脚本，创建该图层对应的数据表
    $.ajax({
        type: "POST",
        url:"php/addLayer.php",
        data: {
            lyrInfo: JSON.stringify({
                "lyrName": lyrEnName,
                "lyrType": lyrType.toUpperCase()
            })
        },
        success: function (res) {
            let resObj = JSON.parse(res);
            // 如果数据表成功创建
            if(resObj.success){
                me.treeCalalogControl.addNode(lyrName); // 向目录树中添加图层节点
                // 使用地图控制组件创建图层
                me.mapControl.addVectorLyr(lyrName, lyrEnName, lyrType);
                // 将该图层的图层名加入模态框控制组件的可编辑图层列表中
                me.modalControl.editableLyrs.push(lyrName);
                // 储存该图层名称和英文名的对应关系，便于之后对数据表的访问
                me.alias[lyrName] = lyrEnName;
                // php运行结果输出
                console.log(resObj.message + " " + lyrName);
            }
            else {
                // 若数据表没有成功创建，弹出提示
                alert(resObj.message);
            }
        }
    });

};
// 删除指定的矢量图层
//
// @param: 要删除的矢量图层的名称
// @return
DesktopControl.prototype.deleteLyr = function (lyrName) {
    let me = this;

    let path = "../shp";
    // 通过ajax访问php脚本，删除该图层对应的数据表
    $.ajax({
        type: "POST",
        url: "php/deleteLayer.php",
        data: {
            lyrInfo: JSON.stringify({
                "lyrName": me.alias[lyrName],
                "path": path
            })
        },
        success: function (res) {
            let resObj = JSON.parse(res);
            // 如果数据表成功删除
            if(resObj.success){
                me.mapControl.delLayer(lyrName); // 从地图中删除该图层
                // 从模态框控制组件的可选图层列表中删除该图层的名称
                let delModalLyrIndex = me.modalControl.editableLyrs.indexOf(lyrName);
                me.modalControl.editableLyrs.splice(delModalLyrIndex, 1);

                me.treeCalalogControl.delNode(lyrName); // 删除目录树节点
                delete me.alias[lyrName]; // 删除图层名和英文名对应关系
                console.log(resObj.message + " " + lyrName); // 输出运行结果
            }
            else {
                // 如果数据表没有成功删除，弹出提示
                alert(resObj.message);
            }
        }
    });
};

// 设置当前进行编辑的图层
//
// @param lyrName: 要进行编辑的图层的名称
// @return
DesktopControl.prototype.setEditLyr = function (lyrName) {
    let me = this;
    // 通过地图控制组件设置当前编辑图层
    me.mapControl.setCurrentEditLyr(lyrName);
};

// 将选择的图层导出为shp，会弹出下载对话框
// 将会下载一个压缩包，其中包含：.cpg, .dbf, .prj .shp和.shx文件
//
// @param lyrName: 要导出的图层的名称
// @return
DesktopControl.prototype.exportLyr = function (lyrName) {
    let me = this;

    let path = "../shp"; // 要下载的压缩包在服务器上的储存路径
    $.ajax({
        type: "POST",
        url: "php/exportLayer.php",
        data: {
            lyrInfo: JSON.stringify({
                "lyrName": me.alias[lyrName],
                "path": path
            })
        },
        success: function (res) {
            let resObj = JSON.parse(res);
            // 如果成功导出zip，进行下载
            if(resObj.success) {
                window.location = "./shp/" + me.alias[lyrName] + ".zip"; // 下载
            }
            // 失败，弹出提示
            else {
                alert(resObj.message);
            }
            console.log(resObj.message); // 输出运行结果
        }
    });

};