const LAYER_TYPE_POINT = "Point";
const LAYER_TYPE_POLYLINE = "LineString";
const LAYER_TYPE_POLYGON = "Polygon";

ModalControl = function (ops) {
    let me = this;
    me.ops = $.extend({
        "target": "body"
    }, ops);

    me.target = $(me.ops.target);
    me.editableLyrs = [];
    me._init();
};

ModalControl.prototype._init = function () {
    let me = this;

    me._createAddLyrModal(me.target, "addLyrModal");
    me._createDelLyrModal(me.target, "delLyrModal");
    me._createEditLyrModal(me.target, "editLyrModal");
    me._createExportLyrModal(me.target, "exportLyrModal");

    $("#addLyrModal").on("show.bs.modal", function () {
        me._resetAddLyrModal();
    });

    $("#delLyrModal").on("show.bs.modal", function () {
        me._updateDelLyrModal(me.editableLyrs);
    });

    $("#editLyrModal").on("show.bs.modal", function () {
        me._updateEditLyrModal(me.editableLyrs);
    });

    $("#exportLyrModal").on("show.bs.modal", function () {
        me._updateExportLyrModal(me.editableLyrs);
    })
};

ModalControl.prototype._createAddLyrModal = function(target, id){
    let me = this;
    me.addLyrModal = $("<div>").appendTo(target)
        .addClass("modal fade")
        .attr({
            "id": id
        });

    let modalDialog = $("<div>").appendTo(me.addLyrModal).addClass("modal-dialog");
    let modalContent = $("<div>").appendTo(modalDialog).addClass("modal-content");
    let modalHeader = $("<div>").appendTo(modalContent).addClass("modal-header");
    $("<h4>").appendTo(modalHeader).addClass("modal-title")
        .text("添加图层");
    $("<button>").appendTo(modalHeader)
        .addClass("close")
        .attr({
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("X");
    let modalBody = $("<div>").appendTo(modalContent).addClass("modal-body");
    let form = $("<form>").appendTo(modalBody);
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "addLyrName"
        })
        .text("图层名称：");

    $("<input>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "addLyrName",
        });

    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "addLyrEnName"
        })
        .text("图层英文别名：");

    $("<input>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "addLyrEnName",
        });

    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "addLyrType"
        })
        .text("图层类型：");
    let typeSelect = $("<select>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "addLyrType"
        });

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

    let modalFoot = $("<div>").appendTo(modalContent).addClass("modal-footer");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-primary")
        .attr({
            "id": "btnCreateLyrOK",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("确认");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-secondary")
        .attr({
            "id": "btnCreateLyrCancel",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("取消");
};

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

ModalControl.prototype._updateDelLyrModal = function (lyrs) {
    let layerSelect = $("#delLyrName").empty();
    for(let i = 0; i < lyrs.length; i++){
        $("<option>").appendTo(layerSelect).text(lyrs[i])
            .attr({
                "value": lyrs[i]
            });
    }

};

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

ModalControl.prototype._updateExportLyrModal = function (lyrs){
    let layerSelect = $("#exportLyrName").empty();
    for(let i = 0; i < lyrs.length; i++){
        $("<option>").appendTo(layerSelect).text(lyrs[i])
            .attr({
                "value": lyrs[i]
            });
    }
};

ModalControl.prototype._resetAddLyrModal = function () {
    $("#addLyrName").val("");
    $("#addLyrEnName").val("");
    $("#addLyrType").val(LAYER_TYPE_POINT);
};


ModalControl.prototype.getAddLyrName = function () {
    return $("#addLyrName").val();
};

ModalControl.prototype.getAddLyrType = function () {
    return $("#addLyrType").val();
};

ModalControl.prototype.getDelLyrName = function () {
    return $("#delLyrName").val();
};

ModalControl.prototype.getEditLyrName = function () {
    return $("#editLyrName").val();
};

ModalControl.prototype.getExportLyrName = function () {
    return $("#exportLyrName").val();
};

ModalControl.prototype.getAddLyrEnName = function () {
    return $("#addLyrEnName").val();
};