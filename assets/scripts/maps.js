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

const map = L.map('map').setView([25.761681, -80.191788], 13); //miami latitude and longitude coordinates
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

printMap(map);