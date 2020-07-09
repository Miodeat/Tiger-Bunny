// 地图控制组件类的构造函数，该类用于控制地图
//
// @param options: 存放用于生成地图的各项参数，需要包括：
//                div，存放目录树和地图的块状元素id
//                width，地图宽度，百分比形式，使用动态布局
//                height，地图高度
// @return
MapControl = function (options) {
    let me = this;
    me.options = $.extend({
        "width": 400,
        "height": 300,
    }, options);

    me._isDragging = false; // 判断是否进行了拖动操作的bool变量

    // 存放矢量图层及其绘制交互模块的json对象，
    // 结构如下：
    // {
    //    图层名称: {
    //                "layer": 矢量图层(ol.layer.Vector),
    //                "drawInteraction": 绘制交互(ol.interaction.Draw)
    //              },
    // }
    me.vecLyrs = {};
    me.nextLyrZ = 1; // 控制添加的矢量图层的压盖关系，后添加的图层具有更大的Z-Index
    me._init(); // 调用初始化函数
};

// 初始化地图
//
// @param
// @return
MapControl.prototype._init = function () {
    let me = this;

    // 在存放目录树和地图的块状元素中添加存放地图的块状元素
    me.div = $("<div>").appendTo("#" + me.options.div);
    // 设置它的css
    me.div.css({
        "position": "relative",
        "width": me.options.width + "%", // 以百分比形式设置地图宽度
        "height": me.options.height + "px", // 以绝对像素单位设置地图宽度
        "float": "left" // 使用向左浮动布局
    });

    me.bkMapID = "bkMap"; // 设置背景地图ID

    // 添加存放背景地图的块状元素，并设置css进行布局
    $("<div>").appendTo(me.div).addClass("full").attr({
        "id": me.bkMapID
    }).css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "z-index": "1"
    });

    // 使用天地图遥感影像作为背景地图
    let imgURL = "http://t0.tianditu.gov.cn/img_w/wmts?" +
        "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
        "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=186aa633f1cdf769cc0e6795f76ccf30";
    me.bkMapLayer = new T.TileLayer(imgURL, {minZoom: 1, maxZoom: 18});
    me.bkMap = new T.Map(me.bkMapID, {
        layers: [me.bkMapLayer],
        projection: 'EPSG:3857'
    });
    // 设置天地图中心和缩放等级
    me.bkMap.centerAndZoom(new T.LngLat(112.3, 28.9), 4);
    me.bkMap.enableScrollWheelZoom(); // 启用滚轮缩放

    // 隐藏天地图图标
    setTimeout(function () {
        me._hideCopyRight();
    }, 1000);


};

// 使用OpenLayers添加矢量图层
//
// @param lyrName: 添加的矢量图层的名字
//        lyrEnName: 添加的图层的英文名字，用于在数据库中创建数据表
//        lyrType: 图层是点图层、线图层还是面图层
// @return
MapControl.prototype.addVectorLyr = function(lyrName, lyrEnName, lyrType) {
    let me = this;
    // 创建矢量图层
    let sketchSource = new ol.source.Vector();
    let sketchVector = new ol.layer.Vector({
        source: sketchSource,
        zIndex: me.nextLyrZ
    });

    me.nextLyrZ++; // 更新下一个图层的Z-Index
    // 如果OpenLayers map 还未创建，创建一个map
    if(me.olMap == undefined){
        me._addOlMap();
    }
    me.olMap.addLayer(sketchVector); // 向OpenLayers map中添加图层
    me.vecLyrs[lyrName] = {layer: sketchVector}; // 图层存入json object
    // 根据图层类型为图层创建绘制工具
    me._addDrawInteractions(sketchSource, lyrName, lyrEnName, lyrType);
    me._deactiveCurrentDrawInteraction(); // 停止编辑
};

// 添加OpenLayers map
// @param
// @return
MapControl.prototype._addOlMap = function () {
    let me = this;
    me.olMapID = "olMap";

    // 添加存放OpenLayers map的块状元素，并布局
    $("<div>").appendTo(me.div).addClass("full").attr({
        "id": me.olMapID
    }).css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "z-index": "100"
    });

    // 创建OpenLayers map
    me.olMap = new ol.Map({
        layers: [],
        target: me.olMapID,
        view: new ol.View({
            center: ol.proj.transform([112.3, 28.9], "EPSG:4326", "EPSG:3857"),
            zoom: 4,
            constrainResolution: true,
            maxZoom: 18,
            minZoom: 1
        }),

    });

    // 当OpenLayers map被缩放、平移时，更新背景地图可视范围
    me.olMap.getView().on("change", function (ev) {
        me._updateBackgroundMap();
    });

    me.olMap.on("movestart", function (ev) {
        me._isDragging = true;
    });
    me.olMap.on("moveend", function (ev) {
        me._isDragging = false;
    });

    $("#" + me.olMapID).on("mousemove", function (ev) {
        if(me._isDragging){
            me._updateBackgroundMap();
        }
    });

};

// 隐藏天地图图标
//
// @param
// @return undefined
MapControl.prototype._hideCopyRight = function () {
    $(".tdt-control-copyright").remove();
};

// 更新背景地图可视范围
//
// @param
// @return
MapControl.prototype._updateBackgroundMap = function () {
    let me = this;

    let view = me.olMap.getView(); // 获得olMap的可视范围
    let center = view.getCenter(); // 获得地图中心
    center = ol.proj.transform(center, "EPSG:3857", "EPSG:4326"); // 坐标系转换
    let zoom = view.getZoom(); // 获得缩放等级

    // 更新背景图可视范围
    me.bkMap.centerAndZoom(new T.LngLat(center[0], center[1]), zoom);
};

// 根据给定的source、图层类型创建绘制工具，并与图层进行关联和存储
//
// @param sketchSource: 矢量图层的要素源，ol.source.vector
//        lyrName: 矢量图层的名称
//        lyrEnName: 矢量图层的英文名称
//        lyrType： 矢量图层的类型
// @return
MapControl.prototype._addDrawInteractions = function (sketchSource, lyrName, lyrEnName, lyrType) {
    let me = this;

    let layerObj = me.vecLyrs[lyrName];
    // 创建绘制工具
    layerObj["drawInteraction"] = new ol.interaction.Draw({
        source: sketchSource,
        type: lyrType
    });
    // 绘制工具绘制结束后，将该要素加入数据库中指定数据表
    layerObj["drawInteraction"].on("drawend", function (ev) {
        let wktFormat = new ol.format.WKT();
        let wkt = wktFormat.writeFeature(ev.feature);
        $.ajax({
            type: "POST",
            url: "php/addFeature.php",
            data: {
                lyrInfo: JSON.stringify({
                    "layer": lyrEnName,
                    "wkt": wkt
                })
            },
            success: function (res) {
                console.log(JSON.parse(res).message);
            }
        });
    });

};

// 停止对正在编辑的图层的编辑
//
// @param
// @return
MapControl.prototype._deactiveCurrentDrawInteraction = function () {
    let me = this;
    if(me._currentInteraction == null){
        return;
    }
    me.olMap.removeInteraction(me._currentInteraction);
};

// 设置OpenLayers map当前使用的绘制交互工具
//
// @param interaction: 要使用的绘制工具
MapControl.prototype.setCurrentInteraction = function (interaction) {
    let me = this;

    me._deactiveCurrentDrawInteraction(); // 删除当前使用的绘制工具
    me._currentInteraction = interaction; // 更新当前使用的绘制工具
    if(interaction == null){
        return;
    }
    me.olMap.addInteraction(interaction); // 启用给定的绘制工具
};

// 设置当前编辑图层，并启动与它关联的绘制工具
//
// @param lyrName: 要进行编辑的图层的名称，若为空字符串则退出编辑模式
// @return
MapControl.prototype.setCurrentEditLyr = function (lyrName) {
    let me = this;

    let currentInteraciton = null;
    if(lyrName != ""){
        let lyrObj = me.vecLyrs[lyrName];
        currentInteraciton = lyrObj["drawInteraction"];
    }
    me.setCurrentInteraction(currentInteraciton);
};

// 删除指定的图层
//
// @param lyrName: 要删除的图层名称
// @return
MapControl.prototype.delLayer = function (lyrName) {
    let me = this;

    me._deactiveCurrentDrawInteraction(); // 退出编辑模式
    let lyrObj = me.vecLyrs[lyrName];
    if(lyrObj == undefined){
        return;
    }
    let delLyr = lyrObj.layer;
    me.olMap.removeLayer(delLyr); // 从OpenLayers map中删除图层
    delete me.vecLyrs[lyrName]; // 删除被删除图层在mapControl中存储的object
};