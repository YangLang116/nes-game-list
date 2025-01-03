const fs = require('fs');
const path = require('path');
const {NES} = require("jsnes");

function traverseDirectory(directory, callback) {
    fs.readdir(directory, (err, files) => {
        files.forEach(file => {
            const filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (stats.isDirectory()) {
                    traverseDirectory(filePath);
                } else {
                    callback(filePath);
                }
            });
        });
    });
}

function isJSONFile(filePath) {
    return filePath.indexOf('.json') !== -1;
}

function parseGameList(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function deleteFiles(...files) {
    for (const file of files) {
        fs.unlinkSync(file);
    }
}

function validGame(nesPath) {
    try {
        const nes = new NES();
        const romData = fs.readFileSync(nesPath, {encoding: 'binary'});
        nes.loadROM(romData);
        return true;
    } catch (err) {
        return false;
    }
}

function dumpGame(filePath, gameList) {
    //json file
    const formatJson = JSON.stringify(gameList, null, 4);
    fs.writeFileSync(filePath, formatJson);
    //base64 encode file
    const encodePath = filePath.substring(0, filePath.lastIndexOf('.')) + '.txt';
    const data = Buffer.from(JSON.stringify(gameList)).toString('base64');
    fs.writeFileSync(encodePath, data);
}


module.exports = {
    traverseDirectory,
    isJSONFile,
    parseGameList,
    validGame,
    dumpGame,
    deleteFiles,
};