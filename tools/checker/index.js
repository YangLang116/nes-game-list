const utils = require('./utils.js');

const gameDir = '../..';

function isValidGame(game) {
    const nesPath = gameDir + '/nes_list/' + game.url;
    return utils.validGame(nesPath);
}

function deleteGame(game) {
    const iconPath = gameDir + '/nes_list/' + game.icon;
    const nesPath = gameDir + '/nes_list/' + game.url;
    utils.deleteFiles(iconPath, nesPath);
}

utils.traverseDirectory(gameDir + '/category', (configFile) => {
    if (!utils.isJSONFile(configFile)) return;
    console.log('开始处理文件: ', configFile);
    const validGameList = [];
    const allGameList = utils.parseGameList(configFile);
    for (const game of allGameList) {
        const isValid = isValidGame(game);
        if (isValid) {
            validGameList.push(game);
        } else {
            deleteGame(game);
        }
        console.log(`分析游戏: ${game.name} -> ${isValid ? 'success' : 'fail'}`);
    }
    utils.dumpGame(configFile, validGameList);
    console.log('完成\n');
})