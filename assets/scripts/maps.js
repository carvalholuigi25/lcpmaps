function printMap(map) {
    var customActionToPrint = function(context, mode) {
        return function() {
            window.alert("We are printing the MAP. Let's do Custom print here!");
            context._printMode(mode);
        }
    };
    
    L.control.browserPrint({
        title: 'Just print me!',
        documentTitle: 'Map printed using leaflet.browser.print plugin',
        printLayer: null,
        closePopupsOnPrint: false,
        printModes: [
            L.BrowserPrint.Mode.Landscape("Tabloid",{title: "Tabloid VIEW"}),
            L.browserPrint.mode("Alert",{title:"User specified print action",pageSize: "A6", action: customActionToPrint, invalidateBounds: false}),
            L.BrowserPrint.Mode.Landscape(),
            "Portrait",
            L.BrowserPrint.Mode.Auto("B4",{title: "Auto"}),
            L.BrowserPrint.Mode.Custom("B5",{title:"Select area"})
        ],
        manualMode: false
    }).addTo(map);
}

function loadDrawPlugin(osm, map) {
    var drawnItems = L.featureGroup().addTo(map);
    L.control.layers({
        'osm': osm.addTo(map),
        "google": L.tileLayer('//www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
            attribution: '<a href="//www.google.pt" target="_blank">Google</a>'
        })
    }, { 'drawlayer': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map);

    map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true
            }
        }
    }));

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
    });
}

var osmUrl = '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="//openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),
    map = new L.Map('map', { center: new L.LatLng(25.761681, -80.191788), zoom: 13 }); //miami latitude and longitude coordinates

printMap(map);
loadDrawPlugin(osm, map);