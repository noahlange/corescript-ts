//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

class DataManager {
    protected static _globalId       = 'RPGMV';
    protected static _lastAccessedId = 1;
    protected static _errorUrl       = null;
    
    protected static _databaseFiles = [
        { name: '$dataActors',       src: 'Actors.json'       },
        { name: '$dataClasses',      src: 'Classes.json'      },
        { name: '$dataSkills',       src: 'Skills.json'       },
        { name: '$dataItems',        src: 'Items.json'        },
        { name: '$dataWeapons',      src: 'Weapons.json'      },
        { name: '$dataArmors',       src: 'Armors.json'       },
        { name: '$dataEnemies',      src: 'Enemies.json'      },
        { name: '$dataTroops',       src: 'Troops.json'       },
        { name: '$dataStates',       src: 'States.json'       },
        { name: '$dataAnimations',   src: 'Animations.json'   },
        { name: '$dataTilesets',     src: 'Tilesets.json'     },
        { name: '$dataCommonEvents', src: 'CommonEvents.json' },
        { name: '$dataSystem',       src: 'System.json'       },
        { name: '$dataMapInfos',     src: 'MapInfos.json'     }
    ];
    
    static loadDatabase() {
        var test = this.isBattleTest() || this.isEventTest();
        var prefix = test ? 'Test_' : '';
        for (var i = 0; i < this._databaseFiles.length; i++) {
            var name = this._databaseFiles[i].name;
            var src = this._databaseFiles[i].src;
            this.loadDataFile(name, prefix + src);
        }
        if (this.isEventTest()) {
            this.loadDataFile('$testEvent', prefix + 'Event.json');
        }
    };
    
    protected static _mapLoader;
    static loadDataFile(name, src) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
        xhr.onerror = this._mapLoader || function() {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        window[name] = null;
        xhr.send();
    };
    
    static isDatabaseLoaded() {
        this.checkError();
        for (var i = 0; i < this._databaseFiles.length; i++) {
            if (!window[this._databaseFiles[i].name]) {
                return false;
            }
        }
        return true;
    };
    
    static loadMapData(mapId: number) {
        if (mapId > 0) {
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
            this.loadDataFile('$dataMap', filename);
        } else {
            this.makeEmptyMap();
        }
    };
    
    static makeEmptyMap() {
        $dataMap = {};
        $dataMap.data = [];
        $dataMap.events = [];
        $dataMap.width = 100;
        $dataMap.height = 100;
        $dataMap.scrollType = 3;
    };
    
    static isMapLoaded() {
        this.checkError();
        return !!$dataMap;
    };
    
    static onLoad(object) {
        var array;
        if (object === $dataMap) {
            this.extractMetadata(object);
            array = object.events;
        } else {
            array = object;
        }
        if (Array.isArray(array)) {
            for (var i = 0; i < array.length; i++) {
                var data = array[i];
                if (data && data.note !== undefined) {
                    this.extractMetadata(data);
                }
            }
        }
        if (object === $dataSystem) {
            Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
            Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
            Scene_Boot.loadSystemImages();
        }
    };
    
    static extractMetadata(data) {
        var re = /<([^<>:]+)(:?)([^>]*)>/g;
        data.meta = {};
        for (;;) {
            var match = re.exec(data.note);
            if (match) {
                if (match[2] === ':') {
                    data.meta[match[1]] = match[3];
                } else {
                    data.meta[match[1]] = true;
                }
            } else {
                break;
            }
        }
    };
    
    static checkError() {
        if (DataManager._errorUrl) {
            throw new Error('Failed to load: ' + DataManager._errorUrl);
        }
    };
    
    static isBattleTest() {
        return Utils.isOptionValid('btest');
    };
    
    static isEventTest() {
        return Utils.isOptionValid('etest');
    };
    
    static isSkill(item) {
        return item && $dataSkills.contains(item);
    };
    
    static isItem(item) {
        return item && $dataItems.contains(item);
    };
    
    static isWeapon(item) {
        return item && $dataWeapons.contains(item);
    };
    
    static isArmor(item) {
        return item && $dataArmors.contains(item);
    };
    
    static createGameObjects() {
        $gameTemp          = new Game_Temp();
        $gameSystem        = new Game_System();
        $gameScreen        = new Game_Screen();
        $gameTimer         = new Game_Timer();
        $gameMessage       = new Game_Message();
        $gameSwitches      = new Game_Switches();
        $gameVariables     = new Game_Variables();
        $gameSelfSwitches  = new Game_SelfSwitches();
        $gameActors        = new Game_Actors();
        $gameParty         = new Game_Party();
        $gameTroop         = new Game_Troop();
        $gameMap           = new Game_Map();
        $gamePlayer        = new Game_Player();
    };
    
    static setupNewGame() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer($dataSystem.startMapId,
            $dataSystem.startX, $dataSystem.startY);
        Graphics.frameCount = 0;
    };
    
    static setupBattleTest() {
        this.createGameObjects();
        $gameParty.setupBattleTest();
        BattleManager.setup($dataSystem.testTroopId, true, false);
        BattleManager.setBattleTest(true);
        BattleManager.playBattleBgm();
    };
    
    static setupEventTest() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(-1, 8, 6);
        $gamePlayer.setTransparent(false);
    };
    
    static loadGlobalInfo() {
        var json;
        try {
            json = StorageManager.load(0);
        } catch (e) {
            console.error(e);
            return [];
        }
        if (json) {
            var globalInfo = JSON.parse(json);
            for (var i = 1; i <= this.maxSavefiles(); i++) {
                if (!StorageManager.exists(i)) {
                    delete globalInfo[i];
                }
            }
            return globalInfo;
        } else {
            return [];
        }
    };
    
    static saveGlobalInfo(info) {
        StorageManager.save(0, JSON.stringify(info));
    };
    
    static isThisGameFile(savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (globalInfo && globalInfo[savefileId]) {
            if (StorageManager.isLocalMode()) {
                return true;
            } else {
                var savefile = globalInfo[savefileId];
                return (savefile.globalId === this._globalId &&
                        savefile.title === $dataSystem.gameTitle);
            }
        } else {
            return false;
        }
    };
    
    static isAnySavefileExists() {
        var globalInfo = this.loadGlobalInfo();
        if (globalInfo) {
            for (var i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i)) {
                    return true;
                }
            }
        }
        return false;
    };
    
    static latestSavefileId() {
        var globalInfo = this.loadGlobalInfo();
        var savefileId = 1;
        var timestamp = 0;
        if (globalInfo) {
            for (var i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    savefileId = i;
                }
            }
        }
        return savefileId;
    };
    
    static loadAllSavefileImages() {
        var globalInfo = this.loadGlobalInfo();
        if (globalInfo) {
            for (var i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i)) {
                    var info = globalInfo[i];
                    this.loadSavefileImages(info);
                }
            }
        }
    };
    
    static loadSavefileImages(info) {
        if (info.characters) {
            for (var i = 0; i < info.characters.length; i++) {
                ImageManager.reserveCharacter(info.characters[i][0]);
            }
        }
        if (info.faces) {
            for (var j = 0; j < info.faces.length; j++) {
                ImageManager.reserveFace(info.faces[j][0]);
            }
        }
    };
    
    static maxSavefiles() {
        return 20;
    };
    
    static saveGame(savefileId) {
        try {
            StorageManager.backup(savefileId);
            return this.saveGameWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            try {
                StorageManager.remove(savefileId);
                StorageManager.restoreBackup(savefileId);
            } catch (e2) {
            }
            return false;
        }
    };
    
    static loadGame(savefileId) {
        try {
            return this.loadGameWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            return false;
        }
    };
    
    static loadSavefileInfo(savefileId) {
        var globalInfo = this.loadGlobalInfo();
        return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
    };
    
    static lastAccessedSavefileId() {
        return this._lastAccessedId;
    };
    
    static saveGameWithoutRescue(savefileId) {
        var json = JsonEx.stringify(this.makeSaveContents());
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        StorageManager.save(savefileId, json);
        this._lastAccessedId = savefileId;
        var globalInfo = this.loadGlobalInfo() || [];
        globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo(globalInfo);
        return true;
    };
    
    static loadGameWithoutRescue(savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (this.isThisGameFile(savefileId)) {
            var json = StorageManager.load(savefileId);
            this.createGameObjects();
            this.extractSaveContents(JsonEx.parse(json));
            this._lastAccessedId = savefileId;
            return true;
        } else {
            return false;
        }
    };
    
    static selectSavefileForNewGame() {
        var globalInfo = this.loadGlobalInfo();
        this._lastAccessedId = 1;
        if (globalInfo) {
            var numSavefiles = Math.max(0, globalInfo.length - 1);
            if (numSavefiles < this.maxSavefiles()) {
                this._lastAccessedId = numSavefiles + 1;
            } else {
                var timestamp = Number.MAX_VALUE;
                for (var i = 1; i < globalInfo.length; i++) {
                    if (!globalInfo[i]) {
                        this._lastAccessedId = i;
                        break;
                    }
                    if (globalInfo[i].timestamp < timestamp) {
                        timestamp = globalInfo[i].timestamp;
                        this._lastAccessedId = i;
                    }
                }
            }
        }
    };
    
    static makeSavefileInfo() {
        var info = {};
        info['globalId']   = this._globalId;
        info['title']      = $dataSystem.gameTitle;
        info['characters'] = $gameParty.charactersForSavefile();
        info['faces']      = $gameParty.facesForSavefile();
        info['playtime']   = $gameSystem.playtimeText();
        info['timestamp']  = Date.now();
        return info;
    };
    
    static makeSaveContents() {
        // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
        var contents = {};
        contents['system']       = $gameSystem;
        contents['screen']       = $gameScreen;
        contents['timer']        = $gameTimer;
        contents['switches']     = $gameSwitches;
        contents['variables']    = $gameVariables;
        contents['selfSwitches'] = $gameSelfSwitches;
        contents['actors']       = $gameActors;
        contents['party']        = $gameParty;
        contents['map']          = $gameMap;
        contents['player']       = $gamePlayer;
        return contents;
    };
    
    static extractSaveContents(contents) {
        $gameSystem        = contents.system;
        $gameScreen        = contents.screen;
        $gameTimer         = contents.timer;
        $gameSwitches      = contents.switches;
        $gameVariables     = contents.variables;
        $gameSelfSwitches  = contents.selfSwitches;
        $gameActors        = contents.actors;
        $gameParty         = contents.party;
        $gameMap           = contents.map;
        $gamePlayer        = contents.player;
    };
}

var $dataActors       = null;
var $dataClasses      = null;
var $dataSkills       = null;
var $dataItems        = null;
var $dataWeapons      = null;
var $dataArmors       = null;
var $dataEnemies      = null;
var $dataTroops       = null;
var $dataStates       = null;
var $dataAnimations   = null;
var $dataTilesets     = null;
var $dataCommonEvents = null;
var $dataSystem       = null;
var $dataMapInfos     = null;
var $dataMap          = null;
var $gameTemp         = null;
var $gameSystem       = null;
var $gameScreen       = null;
var $gameTimer        = null;
var $gameMessage      = null;
var $gameSwitches     = null;
var $gameVariables    = null;
var $gameSelfSwitches = null;
var $gameActors       = null;
var $gameParty        = null;
var $gameTroop        = null;
var $gameMap          = null;
var $gamePlayer       = null;
var $testEvent        = null;

