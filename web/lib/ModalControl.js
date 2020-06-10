ModalControl = function (ops) {
    let me = this;
    me.ops = $.extend({
        "target": "body"
    }, ops);

    me.target = $(me.ops.target);
    me.createDelLyrModal(me.target, "delLyrModal", ["test"]);
    me.createAddLyrModal(me.target, "addLyrModal")
};

ModalControl.prototype.createAddLyrModal = function(target, id){
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
            "for": "lyrName"
        })
        .text("图层名称：");

    $("<input>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "lyrName"
        });
    $("<label>").appendTo(form)
        .addClass("label")
        .attr({
            "for": "lyrType"
        })
        .text("图层类型：")
    let typeSelect = $("<select>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "lyrType"
        });

    $("<option>").appendTo(typeSelect)
        .attr({
            "value": "point"
        })
        .text("点图层");
    $("<option>").appendTo(typeSelect)
        .attr({
            "value": "polyline"
        })
        .text("线图层");
    $("<option>").appendTo(typeSelect)
        .attr({
            "value": "polygon"
        })
        .text("面图层");

    let modalFoot = $("<div>").appendTo(modalContent).addClass("modal-footer");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-primary")
        .attr({
            "id": "btnOK",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("确认");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-secondary")
        .attr({
            "id": "btnCancel",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("取消");
};

ModalControl.prototype.createDelLyrModal = function (target, id, lyrs) {
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
            "for": "lyrNameSelector"
        })
        .text("选择要删除的图层：");
    let layerSelect = $("<select>").appendTo(form)
        .addClass("inputUI")
        .attr({
            "id": "lyrNameSelector"
        });

    me.updateLyrs(lyrs);

    let modalFoot = $("<div>").appendTo(modalContent).addClass("modal-footer");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-primary")
        .attr({
            "id": "btnOK",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("确认");
    $("<button>").appendTo(modalFoot)
        .addClass("btn btn-secondary")
        .attr({
            "id": "btnCancel",
            "type": "button",
            "data-dismiss": "modal"
        })
        .text("取消");
};

ModalControl.prototype.updateLyrs = function (lyrs) {
    let layerSelect = $("#lyrNameSelector").empty();
    for(let i = 0; i < lyrs.length; i++){
        $("<option>").appendTo(layerSelect).text(lyrs[i])
            .attr({
                "value": lyrs[i]
            });
    }
};