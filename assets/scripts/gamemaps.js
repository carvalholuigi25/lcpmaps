var debug = false;
var map = "";
var img = new Image();
var marker = new Array();
var mapsfile = [];
var markersfile = [];
var bounds = [[0, 0], [1000, 1000]];
var iop = localStorage.getItem("mapid") ?? 0;
var params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

iop = iop >= 1 ? iop - 1 : iop;

function isObjEmpty (obj) {
    return Object.values(obj).length === 0 && obj.constructor === Object;
}

function getMyBlips(maps, markers, id) {
    if(document.querySelector("#blipsblk")) {
        var blipsblk = document.querySelector("#blipsblk");
        var mapsfilef = maps;
        var markersfilef = markers.coords;
        markersfilef = markersfilef.filter(xd => xd.mapId == id) ?? markersfilef;

        if(localStorage.getItem("showMarkers") == "true") {
            blipsblk.innerHTML = `
            <ul class="blipslinks p-0" id="blipslinks"></ul>
            <button class="btn btn-primary btnresetblipsstate mt-3 mb-3" id="btnresetblipsstate">Reset blips state</button>`;
        } else {
            blipsblk.innerHTML = "<p>The blips are hidden!</p>";
        }

        if(document.querySelector("#blipslinks")) {
            if(markersfilef.length > 0) {
                for(var mf = 0; mf < markersfilef.length; mf++) {
                    if(!isObjEmpty(markersfilef[mf].icon) && markersfilef[mf].icon.typeBlip.length > 0) {
                        var mkfcl = markersfilef.filter(x => x.icon.typeBlip == markersfilef[mf].icon.typeBlip) ?? 0;
                        document.querySelector('#blipslinks').innerHTML += `
                        <li>
                            <a href="#${markersfilef[mf].icon.typeBlip}" data-index="${mf}">
                                <img src="${markersfilef[mf].icon.src}" width="${markersfilef[mf].icon.iconSize[1]}" height="${markersfilef[mf].icon.iconSize[0]}" class="img-fluid" />
                                ${markersfilef[mf].icon.typeBlip} (${mkfcl.length})
                            </a>
                        </li>`;
                    } else {
                        if(document.querySelector('#btnresetblipsstate')) {
                            document.querySelector('#btnresetblipsstate').remove();
                        }
                        document.querySelector('#blipslinks').innerHTML = `<li><p>No blips are avabliable for this map!</p></li>`;
                    }
                }
            } else {
                if(document.querySelector('#btnresetblipsstate')) {
                    document.querySelector('#btnresetblipsstate').remove();
                }
                document.querySelector('#blipslinks').innerHTML = `<li><p>No blips are avabliable for this map!</p></li>`;
            }

            if(document.querySelector("#blipsblk #blipslinks a")) {
                var lenlnks = document.querySelectorAll("#blipsblk #blipslinks a").length ?? 0;

                if(document.querySelector('#btnresetblipsstate')) {
                    document.querySelector('#btnresetblipsstate').onclick = function() {
                        if(location.search.length > 0) {
                            if(document.querySelector("#blipsblk #blipslinks a")) {
                                for(var i = 0; i < lenlnks; i++) {
                                    if(document.querySelectorAll("#blipsblk #blipslinks a")[i].classList.contains("active")) {
                                        document.querySelectorAll("#blipsblk #blipslinks a")[i].classList.remove("active");
                                    }
                                }
                            }

                            location.search = "";
                        } else {
                            console.log("Already reseted to blips state to off!");
                        }
                    }
                }

                for(var i = 0; i < lenlnks; i++) {
                    if(document.querySelectorAll("#blipsblk #blipslinks a")[i]) {
                        if(location.search.includes(document.querySelectorAll("#blipsblk #blipslinks a")[i].href.split('#')[1])) {
                            if(!document.querySelectorAll("#blipsblk #blipslinks a")[i].classList.contains("active")) {
                                document.querySelectorAll("#blipsblk #blipslinks a")[i].classList.add("active");
                            }
                        }

                        document.querySelectorAll("#blipsblk #blipslinks a")[i].onclick = function(e) {
                            e.preventDefault();
                            this.classList.toggle("active");
                            var atualqry = ""; var murl = "";
                            var myindex = this.getAttribute("data-index");
                            var mqrysval = this.href.split('#')[1];
                    
                            if(this.classList.contains("active")) {
                                murl = !location.search.includes("?excblip=") ? "?excblip=" + location.search : location.search;
                                murl += !murl.includes(mqrysval) ? mqrysval + "," : "";
                            } else {
                                murl += "?excblip=";
                            }

                            clearMarkers(map, marker);
                            marker = addMarkers(map, markersfile, iop+1);
                            location.search = murl;
                        };
                    }
                }
            }
        }
    }
}

function addMarkers(map, markersfile, i = -1) {
    var m = new Array();
    var ccords = markersfile.coords;
    var typeBlip = params.excblip ? params.excblip.split(",") : null;
    typeBlip = typeBlip != null ? typeBlip.filter(x => x !== "") : typeBlip;

    ccords = i != -1 && ccords != null ? (typeBlip != null ? ccords.filter(x => x.mapId == i && !typeBlip.includes(x.icon.typeBlip)) : ccords.filter(x => x.mapId == i)) : ccords;
    localStorage.setItem("showMarkers", true);
    
    if(ccords) {
        for (var kc = 0; kc < ccords.length; kc++) {
            var myIcon = !isObjEmpty(ccords[kc].icon) && ccords[kc].icon.src !== "" ? L.icon({
                iconUrl: ccords[kc].icon.src ?? "",
                iconSize: ccords[kc].icon.iconSize ?? [25, 36],
                iconAnchor: [10, 34],
                popupAnchor: [3, -30]
            }) : null;
            var paramIcon = !isObjEmpty(ccords[kc].icon) && ccords[kc].icon.src !== "" ? {icon: myIcon} : null;
            var markers = L.marker([ccords[kc].lat, ccords[kc].lng], paramIcon).bindPopup(ccords[kc].name);
            m.push(markers);
            map.addLayer(m[kc]);
        }
    }

    return m;
}

function clearMarkers(map, markerary) {
    localStorage.setItem("showMarkers", false);

    for (var i=0; i < markerary.length; i++) {
        map.removeLayer(markerary[i]);
    } 
}

async function fetchMapsAndMarkers() {
    const [mapsResp, marksResp] = await Promise.all([
        fetch('/assets/data/maps.json'),
        fetch('/assets/data/markers.json')
    ]);
    const maps = await mapsResp.json();
    const marks = await marksResp.json();
    return [maps, marks];
}

function createOptionsForSel(elm, value, name, index) {
    if(document.querySelector(elm)) {
        var opt = document.createElement("option");
        opt.value = value;
        opt.setAttribute("data-mapid", index);
        opt.textContent = name;
        document.querySelector(elm).appendChild(opt);
    }
}

function getMapCoords(event) {
    if(document.querySelector('#coordinatesblk')) {
        if(debug) {
            console.log("Coordinates: " + event.latlng.toString());
        }

        var jsstrplatlngin = JSON.stringify(event.latlng) ?? null;
        var jsstrplatlng = JSON.stringify(event.latlng, null, 2) ?? null;
        var jsplatlng = JSON.parse(jsstrplatlng) ?? null;

        if(jsplatlng != null) {
            document.querySelector('#coordinatesblk').innerHTML = "";
            document.querySelector('#coordinatesblk').innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h1>Coordinates</h1>
                    <p><b>Latitude:</b> ${jsplatlng.lat}</p>
                    <p><b>Longitude:</b> ${jsplatlng.lng}</p>
                    <p><b>Format:</b> LatLng(${jsplatlng.lat}, ${jsplatlng.lng})</p>
                    <p><b>JSON Format (inline):</b> <pre>${jsstrplatlngin}</pre></p>
                    <p><b>JSON Format (non-inline):</b> <pre>${jsstrplatlng}</pre></p>
                </div>
            </div>`;

            if(document.querySelector('#clearCoordinates').classList.contains("hidden")) {
                document.querySelector('#clearCoordinates').classList.remove("hidden");
            }

            if(!document.querySelector('#clearCoordinates').classList.contains("shown")) {
                document.querySelector('#clearCoordinates').classList.add("shown");
            }
            
            if(document.querySelector('#clearCoordinates').hasAttribute("disabled")) {
                document.querySelector('#clearCoordinates').removeAttribute("disabled");
            }
        } else {
            if(document.querySelector('#clearCoordinates').classList.contains("shown")) {
                document.querySelector('#clearCoordinates').classList.remove("shown");
            }

            if(!document.querySelector('#clearCoordinates').classList.contains("hidden")) {
                document.querySelector('#clearCoordinates').classList.add("hidden");
            }

            if(!document.querySelector('#clearCoordinates').hasAttribute("disabled")) {
                document.querySelector('#clearCoordinates').setAttribute("disabled", "disabled");
            }
        }
    }
}

function loadDefMap(height, width, i) {
    bounds = [[0, 0], [height, width]];
    const image = L.imageOverlay(img.src, bounds).addTo(map);
    if(localStorage.getItem("showMarkers") == "true") {
        marker = addMarkers(map, markersfile, i);
    }
    map.fitBounds(bounds, {padding: [0, 0]});
}

function resizeMap() {
    map.flyToBounds([[0, 0], [img.height, img.width]]);
    map.zoomSnap = 0;
    map.setZoom(5 / 100);
    map.setMinZoom(-5);
    map.setMaxZoom(19);

    setTimeout(() => {
        map.invalidateSize();
    }, 100 * 4);
}

function doMapOp(img, map, i = -1) {
    var enablecordsMouseMove = false;
    var enableRefreshWindow = true;

    img.onload = function() {
        loadDefMap(this.height, this.width, i);
    };

    if(enablecordsMouseMove) {
        map.on("mousemove", function(event) {
            getMapCoords(event);   
        });
    }

    map.on("contextmenu", function (event) {
        getMapCoords(event);
    });
    
    map.on('resize', function () {
        resizeMap();
    });

    window.onresize = function() {
        console.log(window.innerWidth + "px" + " x " + window.innerHeight + "px");
        if(enableRefreshWindow) {
            setTimeout(() => { location.reload(); }, 1000);
        }
    };

    if(document.querySelector('#showMarkers')) {
        document.querySelector('#showMarkers').onclick = function() {
            clearMarkers(map, marker);
            marker = addMarkers(map, markersfile, i);
            getMyBlips(map, markersfile, i);
        };
    }

    if(document.querySelector('#hideMarkers')) {
        document.querySelector('#hideMarkers').onclick = function() {
            clearMarkers(map, marker);
            getMyBlips(map, markersfile, i);
        };
    }

    if(document.querySelector('#showMarkersInfo')) {
        document.querySelector('#showMarkersInfo').onclick = function() {
            document.querySelector('#markersinfo').classList.toggle("hidden"); 
            this.textContent = !document.querySelector('#markersinfo').classList.contains("hidden") ? this.textContent.replace("Show", "Hide") : this.textContent.replace("Hide", "Show");
        };
    }

    if(document.querySelector('#markersinfo')) {
        var codem = i != -1 ? markersfile.coords.filter(x => x.mapId == i) : markersfile.coords;
        document.querySelector('#markersinfo').innerHTML = `
        <p>Markers coordinates JSON: </p>
        <pre class="code">
            ${JSON.stringify(codem, null, 2)}
        </pre>`;

        document.querySelector('#markersinfo .code').innerHTML = document.querySelector('#markersinfo .code').innerHTML.trim('\r\n\t');
    }

    if(document.querySelector('#clearCoordinates')) {
        document.querySelector('#clearCoordinates').onclick = function() {
            document.querySelector('#coordinatesblk').innerHTML = "";
            
            if(document.querySelector('#clearCoordinates').classList.contains("shown")) {
                document.querySelector('#clearCoordinates').classList.remove("shown");
            }

            if(!document.querySelector('#clearCoordinates').classList.contains("hidden")) {
                document.querySelector('#clearCoordinates').classList.add("hidden");
            }

            if(!document.querySelector('#clearCoordinates').hasAttribute("disabled")) {
                document.querySelector('#clearCoordinates').setAttribute("disabled", "disabled");
            }
        };
    }
}

if(document.querySelector('#map')) {
    map = L.map(document.querySelector('#map'), {
        crs: L.CRS.Simple,
        zoomSnap: 0,
        zoom: 5 / 100,
        minZoom: -5,
        maxZoom: 19,
        trackResize: true
    });


    fetchMapsAndMarkers().then(([maps, markers]) => {
        mapsfile = maps;
        markersfile = markers;

        L.tileLayer('', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="'+mapsfile[iop].copyrightlink+'">'+mapsfile[iop].copyright+'</a>'
        }).addTo(map);

        for(var mf in mapsfile) {
            createOptionsForSel("#selmap", mapsfile[mf].src, mapsfile[mf].name, parseInt(mf)+1);
        }

        if(document.querySelectorAll("#selmap option")[0]) {
            document.querySelector("#selmap option").selectedIndex = iop;
            if(document.querySelectorAll("#selmap option")[iop]) {
                document.querySelectorAll("#selmap option")[iop].setAttribute("selected", "selected");
            }
            img.src = mapsfile[iop].src;
        }

        if(document.querySelector("#selmap")) {
            document.querySelector("#selmap").onchange = function(e) {
                for(var imf = 0; imf < document.querySelectorAll("#selmap option").length; imf++) {
                    if(document.querySelectorAll("#selmap option")[imf].hasAttribute("selected")) {
                        document.querySelectorAll("#selmap option")[imf].removeAttribute("selected");
                    }
                }

                if (map && map.remove) {
                    map.off();
                    map.remove();
                }

                map = L.map(document.querySelector('#map'), {
                    crs: L.CRS.Simple,
                    zoomSnap: 0,
                    zoom: 5 / 100,
                    minZoom: -5,
                    maxZoom: 19,
                    trackResize: true
                });

                L.tileLayer('', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="'+mapsfile[iop].copyrightlink+'">'+mapsfile[iop].copyright+'</a>'
                }).addTo(map);

                img.src = mapsfile[this.selectedIndex].src;
                localStorage.setItem("mapid", mapsfile[this.selectedIndex].mapId);
                document.querySelectorAll("#selmap option")[this.selectedIndex].setAttribute("selected", "selected");
                doMapOp(img, map, this.selectedIndex+1);
                getMyBlips(mapsfile, markersfile, this.selectedIndex+1);
            };
        }

        doMapOp(img, map, iop+1);
        getMyBlips(mapsfile, markersfile, localStorage.getItem("mapid"));
    }).catch(err => console.log(err));
}