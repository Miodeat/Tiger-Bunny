TreeCatalogControl = function (ops) {
    let me = this;
    me.ops = $.extend({
        "div": "display",
        "data": [],
    });
    me.data = ops.data;
    me.treeAndMapDiv = $("#" + me.ops.div);
    me._init();
};

TreeCatalogControl.prototype.setBuddyControl = function (mapControl) {
    let me = this;
    me.mapControl = mapControl;
};

TreeCatalogControl.prototype._init = function () {
    let me = this;
    me.containerDiv = $("<div>").appendTo(me.treeAndMapDiv)
        .addClass("tree-scroll-container");

    me.treeDiv = $("<div>").appendTo(me.containerDiv)
        .addClass("ztree")
        .attr({
            "id":"treeDiv"
        });

    me.treeSetting = {
        view: {
            dblClickExpand: false,
            showLine: false,
            fontCss:{'color':'black','font-weight':'bold'},
            selectedMulti: true
        },
        check:{
            chkboxType: { "Y": "", "N": "" },
            enable: true
        },
        edit:{
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        callback:{
            beforeDrop: function (treeId, treeNodes, targetNode, moveType, isCopy) {
                if(moveType == "inner" || targetNode.name == "图层" ||
                    (targetNode.name == "天地图影像" && moveType == "next")){
                    return false;
                }
                else {
                    for(let i = 0; i < treeNodes.length; i++){
                        if(treeNodes[i].name == "天地图影像"){
                            return false;
                        }
                    }
                    return true;
                }
            },
            onCheck: function (event, treeId, treeNode) {
                if(treeNode.name == "天地图影像"){
                    if(!treeNode.checked) {
                        $("#" + me.mapControl.bkMapID).hide();
                        return;
                    }
                    else {
                        $("#" + me.mapControl.bkMapID).show();
                        return;
                    }
                }

                let lyrs = me.mapControl.vecLyrs;
                if(!treeNode.checked) {
                    let lyrObj = lyrs[treeNode.name];
                    lyrObj.layer.setVisible(false);
                }
                else {
                    let lyrObj = lyrs[treeNode.name];
                    lyrObj.layer.setVisible(true);
                }
            },

            onDrop: function (event, treeId, treeNodes, targetNode, moveType, isCopy) {
                let nodes = me._tree.getNodeByTId("tree_1").children;
                let lyrs = me.mapControl.vecLyrs;
                for(let i = 0; i < nodes.length - 1; i++){
                    let node = nodes[i];
                    let lyrObj = lyrs[node.name];
                    lyrObj.layer.setZIndex(nodes.length - 1 - i);
                    console.log(node.name);
                    console.log(lyrObj.layer.getZIndex());
                }
            }
        }

    };

    me._tree = $.fn.zTree.init(me.treeDiv, me.treeSetting, me.data);
};

TreeCatalogControl.prototype.getTree = function () {
    let me = this;
    return me._tree;
};

TreeCatalogControl.prototype.addNode = function (nodeName) {
    let me = this;

    let newNode = {
        name: nodeName,
        checked: true
    };

    me._tree.addNodes(me._tree.getNodeByTId("tree_1"), 0, newNode, false);
};

TreeCatalogControl.prototype.delNode = function (lyrName) {
    let me = this;

    let delNode = me._tree.getNodeByParam("name", lyrName);
    if(delNode == null){
        alert("Err: 列表中不存在选中的图层");
        return;
    }

    me._tree.removeNode(delNode);
};