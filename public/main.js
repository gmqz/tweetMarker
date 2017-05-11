(function ($) {
    var _aFeatures = [],
        textFill = new ol.style.Fill({color: '#fff'}),
        textStroke = new ol.style.Stroke({color: 'rgba(0, 0, 0, 0.6)',width: 3}),
        rasterToner = new ol.layer.Tile({ source: new ol.source.Stamen({ layer: 'toner' }) }); 
    // no se sobreescribe el namespace, si ya existe
    $.Map = $.Map || {};
    $.Map.init = function() {
        //console.log("Main functions load!");
        //Main.init();        
    }
    
    var view = new ol.View({
            center: [0,0],
            zoom: 2
        });
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM(),
                contrast: 0
            }),rasterToner
        ],
        target: 'map',
        controls: [],
        view: view
    });
    
    var source = new ol.source.Vector({
        wrapX: false
    });
    var vector = new ol.layer.Vector({
        source: source
    });    
    map.addLayer(vector);
     
    var styleCache = {};
    var clusters;
    $.Map.addFeature = function(x,y){
        coor = [parseFloat(x), parseFloat(y)];
        
        $('#totalMarkers').html(source.getFeatures().length);
        //console.log(y);
        var geom = new ol.geom.Point(ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857'));
        var feature = new ol.Feature(geom);
        _aFeatures.push(feature);
        map.removeLayer(clusters);
        clusters = new ol.layer.Vector({
            source: new ol.source.Cluster({
                distance: 40,
                source: new ol.source.Vector({
                    features: _aFeatures
                })
            }),
            style: /*styleFunction*/
            function(feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                opacity = Math.min(0.8, 0.1 + size / _aFeatures.length);
                rad = Math.max(20, 20 + size * 3);
                if (!style) {
                  style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: rad > 40 ? 40 : rad ,
                        snapToPixel: false,
                        stroke: new ol.style.Stroke({
                            color: [255,139,148, 0.4],
                            width: 0.25 
                        }),
                        fill: new ol.style.Fill({
                            color: [255,170,165, opacity > 0.4 ? opacity : 0.4],
                        })
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: textFill,
                        stroke: textStroke
                    })
                  });
                  styleCache[size] = style;
                }
                return style;
            }
        });
        source.addFeature(feature);
        map.addLayer(clusters);
    }
    
    var duration = 700;
    function flash(feature) {
        source.removeFeature(feature);
        var start = new Date().getTime();
        var listenerKey;
  
        function animate(event) {
            var vectorContext = event.vectorContext;
            var frameState = event.frameState;
            var flashGeom = feature.getGeometry().clone();
            var elapsed = frameState.time - start;
            var elapsedRatio = elapsed / duration;
            // radius will be 5 at start and 30 at end.
            var radius = ol.easing.easeOut(elapsedRatio) * 55 + 5;
            var opacity = ol.easing.easeOut(0.7 - elapsedRatio);
            var style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    snapToPixel: false,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255,170,165, ' + opacity+ ')',
                        width: 0.5 + opacity
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255,139,148, ' + opacity + ')',
                        width: 0.25 + opacity
                    })
                })
            });
    
            vectorContext.setStyle(style);
            vectorContext.drawGeometry(flashGeom);
            //if animation is completed, unBind listener
            if (elapsed > duration) {
                ol.Observable.unByKey(listenerKey);
                return;
            }
            // tell OL3 to continue postcompose animation
            map.render();
        }
        listenerKey = map.on('postcompose', animate);
    }

    source.on('addfeature', function(e) {
        flash(e.feature);
    });

    //window.setInterval(addRandomFeature, 500);
    //$(document).on('click', ()=>{
    //    addRandomFeature();
    //});
})(jQuery);
