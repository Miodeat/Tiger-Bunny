MapControl = function (options) {
    let me = this;
    me.options = $.extend({
        "width": 400,
        "height": 300,
    }, options);

    me._isDragging = false;
    me.vecLyrs = {};
    me.nextLyrZ = 1;
    me._init();
};

MapControl.prototype._init = function () {
    let me = this;


    me.div = $("<div>").appendTo("#" + me.options.div);
    me.div.css({
        "position": "relative",
        "width": me.options.width + "%",
        "height": me.options.height + "px",
        "float": "left"
    });

    me.bkMapID = "bkMap";


    $("<div>").appendTo(me.div).addClass("full").attr({
        "id": me.bkMapID
    }).css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "z-index": "1"
    });


    let imgURL = "http://t0.tianditu.gov.cn/img_w/wmts?" +
        "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
        "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=186aa633f1cdf769cc0e6795f76ccf30";
    me.bkMapLayer = new T.TileLayer(imgURL, {minZoom: 1, maxZoom: 18});
    me.bkMap = new T.Map(me.bkMapID, {
        layers: [me.bkMapLayer],
        projection: 'EPSG:3857'
    });
    me.bkMap.centerAndZoom(new T.LngLat(112.3, 28.9), 4);
    me.bkMap.enableScrollWheelZoom();

    setTimeout(function () {
        me._hideCopyRight();
    }, 1000);


};

MapControl.prototype.addVectorLyr = function(lyrName, lyrEnName, lyrType) {
    let me = this;
    let sketchSource = new ol.source.Vector();
    let sketchVector = new ol.layer.Vector({
        source: sketchSource,
        zIndex: me.nextLyrZ
    });

    me.nextLyrZ++;

    if(me.olMap == undefined){
        me._addOlMap();
    }
    me.olMap.addLayer(sketchVector);
    me.vecLyrs[lyrName] = {layer: sketchVector};
    me._addDrawInteractions(sketchSource, lyrName, lyrEnName, lyrType);
    me._deactiveCurrentDrawInteraction();
};

MapControl.prototype._addOlMap = function () {
    let me = this;
    me.olMapID = "olMap";

    $("<div>").appendTo(me.div).addClass("full").attr({
        "id": me.olMapID
    }).css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "z-index": "100"
    });


    me.olMap = new ol.Map({
        layers: [],
        target: me.olMapID,
        view: new ol.View({
            center: ol.proj.transform([112.3, 28.9], "EPSG:4326", "EPSG:3857"),
            zoom: 4,
            constrainResolution: true
        }),

    });

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

MapControl.prototype._hideCopyRight = function () {
    $(".tdt-control-copyright").remove();
};

MapControl.prototype._updateBackgroundMap = function () {
    let me = this;

    let view = me.olMap.getView();
    let center = view.getCenter();
    center = ol.proj.transform(center, "EPSG:3857", "EPSG:4326");
    let zoom = view.getZoom();

    me.bkMap.centerAndZoom(new T.LngLat(center[0], center[1]), zoom);
};

MapControl.prototype._addDrawInteractions = function (sketchSource, lyrName, lyrEnName, lyrType) {
    let me = this;

    let layerObj = me.vecLyrs[lyrName];
    layerObj["drawInteraction"] = new ol.interaction.Draw({
        source: sketchSource,
        type: lyrType
    });
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

MapControl.prototype._deactiveCurrentDrawInteraction = function () {
    let me = this;
    if(me._currentInteraction == null){
        return;
    }
    me.olMap.removeInteraction(me._currentInteraction);
};

MapControl.prototype.setCurrentInteraction = function (interaction) {
    let me = this;

    me._deactiveCurrentDrawInteraction();
    me._currentInteraction = interaction;
    if(interaction == null){
        return;
    }
    me.olMap.addInteraction(interaction);
};

MapControl.prototype.setCurrentEditLyr = function (lyrName) {
    let me = this;

    let currentInteraciton = null;
    if(lyrName != ""){
        let lyrObj = me.vecLyrs[lyrName];
        currentInteraciton = lyrObj["drawInteraction"];
    }
    me.setCurrentInteraction(currentInteraciton);
};

MapControl.prototype.delLayer = function (lyrName) {
    let me = this;

    let lyrObj = me.vecLyrs[lyrName];
    if(lyrObj == undefined){
        return;
    }
    let delLyr = lyrObj.layer;
    me.olMap.removeLayer(delLyr);
    me._deactiveCurrentDrawInteraction();
    delete me.vecLyrs[lyrName];
};