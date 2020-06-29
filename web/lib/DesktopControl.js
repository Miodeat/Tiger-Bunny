$(document).ready(function () {
    let desktopControl = new DesktopControl();
});

DesktopControl = function () {
    let me = this;
    me.lyrs = ["天地图影像"];
    me.alias = {};
    me._init();
};

DesktopControl.prototype._init = function () {
    let me = this;
    me.modalControl = new ModalControl({
        "target": "body"
    });
    me.menuControl = new MenuControl({
        "div": "menu"
    });

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

    me.mapControl = new MapControl({
        "div": "display",
        "width": 87,
        "height": 645
    });

    me.treeCalalogControl.setBuddyControl(me.mapControl);

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

        if(me.modalControl.editableLyrs.indexOf(lyrName) > -1){
            alert("已经存在同名图层！");
            return;
        }
        let lyrType = me.modalControl.getAddLyrType();
        me.addLayer(lyrName, lyrEnName, lyrType);
    });

    $("#btnDelLyrOK").on("click", function() {
        let lyrName = me.modalControl.getDelLyrName();
        if(lyrName == ""){
            alert("没有可删除的图层！");
            return;
        }
        me.deleteLyr(lyrName);
    });

    $("#btnEditLyrOK").on("click", function() {
        let lyrName = me.modalControl.getEditLyrName();

        me.setEditLyr(lyrName);
    });

    $("#btnExportLyrOK").on("click", function () {
        let lyrName = me.modalControl.getExportLyrName();
        if(lyrName == ""){
            alert("未选择要导出的图层！");
            return;
        }
        me.exportLyr(lyrName);
    });

    let nodes = me.treeCalalogControl._tree.transformToArray(me.treeCalalogControl._tree.getNodes());
    let nodeNames = [];
    for(let node in nodes){
        nodeNames.push(node.name);
    }

};

DesktopControl.prototype.addLayer = function (lyrName, lyrEnName, lyrType) {
    let me = this;

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
            if(resObj.success){
                me.treeCalalogControl.addNode(lyrName);
                me.mapControl.addVectorLyr(lyrName, lyrEnName, lyrType);
                me.modalControl.editableLyrs.push(lyrName);
                me.alias[lyrName] = lyrEnName;
                console.log(resObj.message + " " + lyrName);
            }
            else {
                alert(resObj.message);
            }
        }
    });



};

DesktopControl.prototype.deleteLyr = function (lyrName) {
    let me = this;

    $.ajax({
        type: "POST",
        url: "php/deleteLayer.php",
        data: {
            lyrInfo: JSON.stringify({
                "lyrName": me.alias[lyrName]
            })
        },
        success: function (res) {
            let resObj = JSON.parse(res);
            if(resObj.success){
                me.mapControl.delLayer(lyrName);

                let delModalLyrIndex = me.modalControl.editableLyrs.indexOf(lyrName);
                me.modalControl.editableLyrs.splice(delModalLyrIndex, 1);

                me.treeCalalogControl.delNode(lyrName);
                delete me.alias[lyrName];
                console.log(resObj.message + " " + lyrName);
            }
            else {
                alert(resObj.message);
            }
        }
    });
};

DesktopControl.prototype.setEditLyr = function (lyrName) {
    let me = this;

    me.mapControl.setCurrentEditLyr(lyrName);
};

DesktopControl.prototype.exportLyr = function (lyrName) {
    let me = this;

    let path = "../shp";
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
            window.location = "./shp/" + me.alias[lyrName] + ".zip";
            console.log(JSON.parse(res).message);
        }
    });

};