const LAYER_TYPE_POINT = "Point"; // 点图层类型标识
const LAYER_TYPE_POLYLINE = "LineString"; // 线图层类型标识
const LAYER_TYPE_POLYGON = "Polygon"; // 面图层类型标识

// 模态框控制组件构造函数
//
// @param ops: 用于构造模态框的参数，包括：
//             target: 存放模态框的目标容器
ModalControl = function (ops) {
    let me = this;
    me.ops = $.extend({
        "target": "body"
    }, ops);

    me.target = $(me.ops.target);
    // 可编辑图层列表
    // 选择编辑图层、导出图层、删除图层模态框
    // 会使用该列表作为下拉菜单可选项
    me.editableLyrs = [];
    me._init(); // 初始化模态框
};

// 初始化模态框控制组件
//
// @param
// @return
ModalControl.prototype._init = function () {
    let me = this;

    me._createAddLyrModal(me.target, "addLyrModal"); // 创建添加图层模态框
    me._createDelLyrModal(me.target, "delLyrModal"); // 创建删除图层模态框
    me._createEditLyrModal(me.target, "editLyrModal"); // 创建选择编辑图层模态框
    me._createExportLyrModal(me.target, "exportLyrModal"); // 创建导出图层模态框

    // 添加模态框显示时的响应函数
    $("#addLyrModal").on("show.bs.modal", function () {
        me._resetAddLyrModal(); // 将输入控件重设为空
    });

    $("#delLyrModal").on("show.bs.modal", function () {
        me._updateDelLyrModal(me.editableLyrs); // 更新可删除图层下拉框
    });

    $("#editLyrModal").on("show.bs.modal", function () {
        me._updateEditLyrModal(me.editableLyrs); // 更新可编辑图层下拉框
    });

    $("#exportLyrModal").on("show.bs.modal", function () {
        me._updateExportLyrModal(me.editableLyrs); // 更新可导出图层下拉框
    })
};

// 创建添加图层模态框
//
// @param target: 模态框的容器
//        id: 模态框的id
// @return
ModalControl.prototype._createAddLyrModal = function(target, id){
    let me = this;
    // 创建模态框灰色背景
    me.addLyrModal = $("<div>").appendTo(target)
        .addClass("modal fade")
        .attr({
            "id": id
        });

    // 创建对话框
    let modalDialog = $("<div>").appendTo(me.addLyrModal).addClass("modal-dialog");
    let modalContent = $("<div>").appendTo(modalDialog).addClass("modal-content");
    // 创建模态框头部
    let modalHeader = $("<div>").appendTo(modalContent).addClass("modal-header");
    $("<h4>").appendTo(modalHeader).addClass("modal-title")
        .text("添加图层"); // 设置标题
    $("<button>").appendTo(modalHeader)
        .addClass("close")
        .attr({
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("X"); // 设置关闭按钮
    // 创建对话框主体
    let modalBody = $("<div>").appendTo(modalContent).addClass("modal-body");
    // 在主体中添加输入参数的inputs组件
    let form = $("<form>").appendTo(modalBody);

    // 创建输入图层名称的input控件的标注
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "addLyrName"
        })
        .text("图层名称：");
    // 创建输入图层名的input组件
    $("<input>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "addLyrName",
        });

    // 创建输入图层英文名的input组件的标注
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "addLyrEnName"
        })
        .text("图层英文别名：");
    // 创建输入图层英文名的input组件的标注
    $("<input>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "addLyrEnName",
        });

    // 创建选择图层类型的下拉框组件的标注
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "addLyrType"
        })
        .text("图层类型：");
    // 创建选择图层类型的下拉框
    let typeSelect = $("<select>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "addLyrType"
        });
    // 创建下拉框选项
    $("<option>").appendTo(typeSelect)
        .attr({
            "value": LAYER_TYPE_POINT
        })
        .text("点图层");
    $("<option>").appendTo(typeSelect)
        .attr({
            "value": LAYER_TYPE_POLYLINE
        })
        .text("线图层");
    $("<option>").appendTo(typeSelect)
        .attr({
            "value": LAYER_TYPE_POLYGON
        })
        .text("面图层");
    // 创建模态框底部
    let modalFoot = $("<div>").appendTo(modalContent).addClass("modal-footer");
    // 创建确定按钮
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-primary")
        .attr({
            "id": "btnCreateLyrOK",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("确认");
    // 创建取消按钮
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-secondary")
        .attr({
            "id": "btnCreateLyrCancel",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("取消");
};

// 创建删除图层模态框
//
// @param target: 模态框的容器
//        id: 模态框的id
// @return
ModalControl.prototype._createDelLyrModal = function (target, id) {
    let me = this;
    me.delLyrModal = $("<div>").appendTo(target)
        .addClass("modal fade")
        .attr({
            "id": id
        });

    let modalDialog = $("<div>").appendTo(me.delLyrModal).addClass("modal-dialog");
    let modalContent = $("<div>").appendTo(modalDialog).addClass("modal-content");
    let modalHeader = $("<div>").appendTo(modalContent).addClass("modal-header");
    $("<h4>").appendTo(modalHeader).addClass("modal-title")
        .text("删除图层");
    $("<button>").appendTo(modalHeader)
        .addClass("close")
        .attr({
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("X");
    let modalBody = $("<div>").appendTo(modalContent).addClass("modal-body");
    let form = $("<form>").appendTo(modalBody);
    // 创建选择图层下拉框及标注
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "delLyrName"
        })
        .text("选择要删除的图层：");
    let layerSelect = $("<select>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "delLyrName"
        });


    let modalFoot = $("<div>").appendTo(modalContent).addClass("modal-footer");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-primary")
        .attr({
            "id": "btnDelLyrOK",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("确认");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-secondary")
        .attr({
            "id": "btnDelLyrCancel",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("取消");
};

// 创建选择编辑图层模态框
//
// @param target: 模态框的容器
//        id: 模态框的id
// @return
ModalControl.prototype._createEditLyrModal = function (target, id) {
    let me = this;

    me.editLyrModal = $("<div>").appendTo(target)
        .addClass("modal fade")
        .attr({
            "id": id
        });

    let modalDialog = $("<div>").appendTo(me.editLyrModal).addClass("modal-dialog");
    let modalContent = $("<div>").appendTo(modalDialog).addClass("modal-content");
    let modalHeader = $("<div>").appendTo(modalContent).addClass("modal-header");

    $("<h4>").appendTo(modalHeader).addClass("modal-title")
        .text("选择当前编辑图层");
    $("<button>").appendTo(modalHeader)
        .addClass("close")
        .attr({
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("X");
    let modalBody = $("<div>").appendTo(modalContent).addClass("modal-body");

    let form = $("<form>").appendTo(modalBody);
    // 创建选择图层下拉框及标注
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "editLyrName"
        })
        .text("要编辑的图层：");
    let layerSelect = $("<select>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "editLyrName"
        });

    let modalFoot = $("<div>").appendTo(modalContent).addClass("modal-footer");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-primary")
        .attr({
            "id": "btnEditLyrOK",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("确认");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-secondary")
        .attr({
            "id": "btnEditLyrCancel",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("取消");
};

// 创建选择编辑图层模态框
//
// @param target: 模态框的容器
//        id: 模态框的id
// @return
ModalControl.prototype._createExportLyrModal = function(target, id){
    let me = this;

    me.exportLyrModal = $("<div>").appendTo(target)
        .addClass("modal fade")
        .attr({
            "id": id
        });

    let modalDialog = $("<div>").appendTo(me.exportLyrModal).addClass("modal-dialog");
    let modalContent = $("<div>").appendTo(modalDialog).addClass("modal-content");
    let modalHeader = $("<div>").appendTo(modalContent).addClass("modal-header");
    $("<h4>").appendTo(modalHeader).addClass("modal-title")
        .text("选择要导出的图层：");
    $("<button>").appendTo(modalHeader)
        .addClass("close")
        .attr({
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("X");
    let modalBody = $("<div>").appendTo(modalContent).addClass("modal-body");
    let form = $("<form>").appendTo(modalBody);
    // 创建选择图层下拉框及标注
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "exportLyrName"
        })
        .text("要导出的图层：");
    let layerSelect = $("<select>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "exportLyrName"
        });

    let modalFoot = $("<div>").appendTo(modalContent).addClass("modal-footer");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-primary")
        .attr({
            "id": "btnExportLyrOK",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("确认");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-secondary")
        .attr({
            "id": "btnExportLyrCancel",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("取消");
};

// 根据可编辑图层列表更新删除图层模态框中的下拉框
//
// @param lyrs: 可编辑图层，即可以删除的图层
// @return
ModalControl.prototype._updateDelLyrModal = function (lyrs) {
    let layerSelect = $("#delLyrName").empty(); // 清除下拉框中的选项
    // 根据列表重新创建选项
    for(let i = 0; i < lyrs.length; i++){
        $("<option>").appendTo(layerSelect).text(lyrs[i])
            .attr({
                "value": lyrs[i]
            });
    }

};

// 根据可编辑图层列表更新选择编辑图层模态框中的下拉框
//
// @param lyrs: 可编辑图层，即可以进行编辑的图层
// @return
ModalControl.prototype._updateEditLyrModal = function (lyrs) {
    let layerSelect = $("#editLyrName").empty();
    $("<option>").appendTo(layerSelect).text("无")
        .attr({
            "value": ""
        });
    for(let i = 0; i < lyrs.length; i++){
        $("<option>").appendTo(layerSelect).text(lyrs[i])
            .attr({
                "value": lyrs[i]
            });
    }
};

// 根据可编辑图层列表更新导出图层模态框中的下拉框
//
// @param lyrs: 可编辑图层，即可以导出的图层
// @return
ModalControl.prototype._updateExportLyrModal = function (lyrs){
    let layerSelect = $("#exportLyrName").empty();
    for(let i = 0; i < lyrs.length; i++){
        $("<option>").appendTo(layerSelect).text(lyrs[i])
            .attr({
                "value": lyrs[i]
            });
    }
};

// 将添加图层模态框的输入控件重设为默认值
//
// @param
// @return
ModalControl.prototype._resetAddLyrModal = function () {
    $("#addLyrName").val("");
    $("#addLyrEnName").val("");
    $("#addLyrType").val(LAYER_TYPE_POINT);
};

// 获得添加图层模态框中的图层名称
//
// @param
// @return: 添加图层模态框中的图层名称
ModalControl.prototype.getAddLyrName = function () {
    return $("#addLyrName").val();
};

// 获得添加图层模态框中的图层类型
//
// @param
// @return: 添加图层模态框中的图层类型
ModalControl.prototype.getAddLyrType = function () {
    return $("#addLyrType").val();
};

// 获得删除图层模态框中的图层名称
//
// @param
// @return: 删除图层模态框中的图层名称
ModalControl.prototype.getDelLyrName = function () {
    return $("#delLyrName").val();
};

// 获得选择编辑图层模态框中的图层名称
//
// @param
// @return: 选择编辑图层模态框中的图层名称
ModalControl.prototype.getEditLyrName = function () {
    return $("#editLyrName").val();
};

// 获得图层模态框中的图层名称
//
// @param
// @return: 选择编辑图层模态框中的图层名称
ModalControl.prototype.getExportLyrName = function () {
    return $("#exportLyrName").val();
};

// 获得添加图层模态框中的图层英文名称
//
// @param
// @return: 添加图层模态框中的图层英文名称
ModalControl.prototype.getAddLyrEnName = function () {
    return $("#addLyrEnName").val();
};