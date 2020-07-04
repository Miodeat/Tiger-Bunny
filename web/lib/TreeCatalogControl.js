// 图层目录树控制组件构造函数
//
// @params ops:
// @return
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

// 设定与图层目录树相关联的地图控制组件
//
// @param mapControl: 与图层目录树相关联的地图控制组件
// @return
TreeCatalogControl.prototype.setBuddyControl = function (mapControl) {
    let me = this;
    me.mapControl = mapControl;
};
// 初始化图层目录树
//
// @param
// @return
TreeCatalogControl.prototype._init = function () {
    let me = this;
    // 创建滚动条容器
    me.containerDiv = $("<div>").appendTo(me.treeAndMapDiv)
        .addClass("tree-scroll-container");
    // 创建图层目录树并将其放入滚动条容器
    me.treeDiv = $("<div>").appendTo(me.containerDiv)
        .addClass("ztree")
        .attr({
            "id":"treeDiv"
        });
    // 设置ZTree控件，各个设置的含义见ZTree文档：http://www.treejs.cn/v3/api.php
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
            // 拖动操作生效前的响应函数，
            // 阻止矢量图节点成为另一个矢量图节点的子节点，
            // 阻止“天地图影像”节点被拖动，
            // 阻止矢量图节点成为“图层”根节点的同级节点
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
            // 根据勾选框是否选中控制图层是否显示
            onCheck: function (event, treeId, treeNode) {
                // 天地图影像的显示与隐藏
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
                // 矢量图层的显示与隐藏
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
            // 树节点拖动结束事件响应函数，
            // 根据拖动的顺序，改变图层显示顺序
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

    // 创建图层目录树
    me._tree = $.fn.zTree.init(me.treeDiv, me.treeSetting, me.data);
};

// 向图层目录树中添加节点
//
// @param nodeName: 节点的名称
// @return
TreeCatalogControl.prototype.addNode = function (nodeName) {
    let me = this;

    let newNode = {
        name: nodeName,
        checked: true
    };

    me._tree.addNodes(me._tree.getNodeByTId("tree_1"), 0, newNode, false);
};

// 向图层目录树中删除节点
//
// @param nodeName: 要删除的节点的名称
// @return
TreeCatalogControl.prototype.delNode = function (lyrName) {
    let me = this;

    let delNode = me._tree.getNodeByParam("name", lyrName);
    if(delNode == null){
        alert("Err: 列表中不存在选中的图层");
        return;
    }

    me._tree.removeNode(delNode);
};