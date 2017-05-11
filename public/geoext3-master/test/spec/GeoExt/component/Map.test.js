Ext.Loader.syncRequire(['GeoExt.component.Map']);

describe('GeoExt.component.Map', function() {

    describe('basics', function() {
        it('GeoExt.component.Map is defined', function() {
            expect(GeoExt.component.Map).not.to.be(undefined);
        });

        describe('constructor', function() {
            it('can be constructed wo/ arguments via Ext.create()', function() {
                var mapComponent = Ext.create('GeoExt.component.Map');
                expect(mapComponent).to.be.an(GeoExt.component.Map);
            });
        });
    });

    describe('public functions', function() {
        var div;
        var mapComponent;
        var mapPanel;
        var source;
        var layer;
        var olMap;

        beforeEach(function() {
            div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.top = '0';
            div.style.left = '-1000px';
            div.style.width = '512px';
            div.style.height = '256px';
            document.body.appendChild(div);

            source = new ol.source.OSM();
            layer = new ol.layer.Tile({
                source: source
            });

            olMap = new ol.Map({
                layers: [layer],
                view: new ol.View({
                    center: [0, 0],
                    zoom: 2
                })
            });

            mapComponent = Ext.create('GeoExt.component.Map', {
                map: olMap
            });

            mapPanel = Ext.create('Ext.panel.Panel', {
                title: 'GeoExt.component.Map Example',
                items: [mapComponent],
                layout: 'fit',
                renderTo: div
            });
        });

        afterEach(function() {
            mapPanel.destroy();
            document.body.removeChild(div);
        });
        describe('getters and setters', function() {

            it('getCenter() returns an array with 2 numbers',
                function() {
                    expect(mapComponent.getCenter()).to.be.an(Array);
                    expect(mapComponent.getCenter()).to.have.length(2);
                    expect(mapComponent.getCenter()[0]).to.be.a('number');
                    expect(mapComponent.getCenter()[1]).to.be.a('number');
                }
            );

            it('getExtent() returns an array with 4 numbers',
                function() {
                    expect(mapComponent.getExtent()).to.be.an(Array);
                    expect(mapComponent.getExtent()).to.have.length(4);
                    expect(mapComponent.getExtent()[0]).to.be.a('number');
                    expect(mapComponent.getExtent()[1]).to.be.a('number');
                    expect(mapComponent.getExtent()[2]).to.be.a('number');
                    expect(mapComponent.getExtent()[3]).to.be.a('number');
                }
            );

            it('getLayers() returns an ol.Collection containing' +
                ' instances of ol.layers.Base',
                function() {
                    var layers = mapComponent.getLayers();
                    expect(layers).to.be.an(ol.Collection);
                    layers.forEach(function(l) {
                        expect(l).to.be.an(ol.layer.Base);
                    });
                }
            );

            it('getView() returns an ol.View instance', function() {
                expect(mapComponent.getView()).to.be.an(ol.View);
            });

            it('getStore() returns a GeoExt.data.store.Layers instance',
                function() {
                    expect(
                        mapComponent.getStore()
                    ).to.be.an(GeoExt.data.store.Layers);
                }
            );

            it('setCenter() sets the correct center', function() {
                var center = [1183893.8882437304, 7914041.721258021];
                mapComponent.setCenter(center);
                expect(olMap.getView().getCenter()).to.be(center);
            });

            it('setExtent() sets the correct center', function() {
                for (var i = 0; i < 10; i++) {
                    var x1 = Math.random() * 100;
                    var x2 = Math.random() * 100;
                    var y1 = x1 + Math.random() * 100;
                    var y2 = x2 + Math.random() * 100;
                    var extent = [x1, x2, y1, y2];
                    var expectedCenter = [
                        (extent[2] - (extent[2] - extent[0]) / 2).toFixed(3),
                        (extent[3] - (extent[3] - extent[1]) / 2).toFixed(3)
                    ];
                    mapComponent.setExtent(extent);
                    var olCenter = olMap.getView().getCenter();
                    var derivedCenter = [
                        olCenter[0].toFixed(3),
                        olCenter[1].toFixed(3)
                    ];
                    // comparing the extent is hard due to the unpredictable
                    // ol-code of fitextent and calculate extent methods,
                    // so we will use the center for comparison here
                    expect(derivedCenter).to.eql(expectedCenter);
                }
            });

            it('setView() sets the correct ol.View to the ol.Map',
                function() {
                    var view = new ol.View({
                        center: [0.8, 15],
                        zoom: 4
                    });
                    mapComponent.setView(view);
                    expect(olMap.getView()).to.be(view);
                }
            );
        });

        describe('layer handling', function() {
            it('addLayer() adds an ol.layer.Base to the ol.Map',
                function() {
                    var source2 = new ol.source.OSM();
                    var layer2 = new ol.layer.Tile({
                        source: source2
                    });
                    mapComponent.addLayer(layer2);
                    expect(olMap.getLayers().getArray()).to.contain(layer2);
                }
            );

            it('addLayer() throws error if no layer is passed',
                function() {
                    var nolayer = [
                        null,
                        undefined,
                        new ol.source.OSM(),
                        '',
                        olMap
                    ];

                    nolayer.forEach(function(oneLayer) {
                        expect(
                            mapComponent.addLayer
                        ).withArgs(oneLayer).to.throwException();
                    });

                }
            );

            it('removeLayer() removes an ol.layer.Base', function() {
                expect(olMap.getLayers().getArray()).to.contain(layer);
                mapComponent.removeLayer(layer);
                expect(olMap.getLayers().getArray()).to.not.contain(layer);
            });

            it('removeLayer() throws error if no layer is passed',
                function() {
                    var nolayer = [
                        null,
                        undefined,
                        new ol.source.OSM(),
                        '',
                        olMap
                    ];

                    nolayer.forEach(function(oneLayer) {
                        expect(
                            mapComponent.removeLayer
                        ).withArgs(oneLayer).to.throwException();
                    });

                }
            );
        });

        describe('listening to size changes', function() {

            it('ensure the map is updated when the size changes', function() {
                var spy = sinon.spy(olMap, 'updateSize');

                mapComponent.setSize(100, 100);

                expect(spy.called).to.be(true);
                expect(spy.callCount).to.be(1);

                // restore old method
                olMap.updateSize.restore();
            });

        });

    });
});
