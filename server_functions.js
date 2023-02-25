const fs = require("fs");
const path = require("path");

function readFile(pagename, req, res) {
    fs.readFile(path.join(__dirname, "/" + pagename), { encoding: 'utf8', flag: 'r' }, function(err, data) {
        if(err) {
            console.log(err);
        }
        res.send(data);
    });
}

function writeFile(pagename, content, req, res) {
    fs.writeFile(path.join(__dirname, "/" + pagename), content, { encoding: 'utf8', flag: 'r' }, function(err, data) {
        if(err) {
            console.log(err);
        }
        res.send(data);
    });
}

function readFileSync(pagename, req, res) {
    const data = fs.readFileSync(path.join(__dirname, "/" + pagename), { encoding: 'utf8', flag: 'r' });
    res.send(data);
}

function writeFileSync(pagename, content, req, res) {
    fs.writeFileSync(path.join(__dirname, "/" + pagename, { encoding: "utf8", flag: "a+", mode: 0o666 }), content);
    console.log("File written successfully\n");
    console.log("The written file has the following contents:");
    res.send(fs.readFileSync(path.join(__dirname, "/" + pagename), "utf8"));
}

module.exports = { readFile, writeFile, readFileSync, writeFileSync }