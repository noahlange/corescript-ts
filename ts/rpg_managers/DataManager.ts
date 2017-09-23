//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

class DataManager {
    protected static _globalId = 'RPGMV';
    protected static _lastAccessedId = 1;
    protected static _errorUrl: string | null = null;

    protected static _databaseFiles = [
        { name: '$dataActors', src: 'Actors.json' },
        { name: '$dataClasses', src: 'Classes.json' },
        { name: '$dataSkills', src: 'Skills.json' },
        { name: '$dataItems', src: 'Items.json' },
        { name: '$dataWeapons', src: 'Weapons.json' },
        { name: '$dataArmors', src: 'Armors.json' },
        { name: '$dataEnemies', src: 'Enemies.json' },
        { name: '$dataTroops', src: 'Troops.json' },
        { name: '$dataStates', src: 'States.json' },
        { name: '$dataAnimations', src: 'Animations.json' },
        { name: '$dataTilesets', src: 'Tilesets.json' },
        { name: '$dataCommonEvents', src: 'CommonEvents.json' },
        { name: '$dataSystem', src: 'System.json' },
        { name: '$dataMapInfos', src: 'MapInfos.json' }
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

    protected static _mapLoader: (() => void) | null;
    static loadDataFile(name: string, src: string) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status < 400) {
                (window as any)[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad((window as any)[name]);
            }
        };
        xhr.onerror = this._mapLoader || function () {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        (window as any)[name] = null;
        xhr.send();
    };

    static isDatabaseLoaded() {
        this.checkError();
        for (var i = 0; i < this._databaseFiles.length; i++) {
            if (!(window as any)[this._databaseFiles[i].name]) {
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
        $dataMap = {
            data: [],
            events: [],
            width: 100,
            height: 100,
            scrollType: 3,


            /// (bungcip): empty Data, added to make it compile
            autoplayBgm: false,
            autoplayBgs: false,
            battleback1Name: '',
            battleback2Name: '',
            bgm: null,
            bgs: null,
            disableDashing: false,
            displayName: '',
            encounterList: [],
            encounterStep: 0,
            note: '',
            parallaxLoopX: false,
            parallaxLoopY: false,
            parallaxName: '',
            parallaxShow: false,
            parallaxSx: 0,
            parallaxSy: 0,
            specifyBattleback: false,
            tilesetId: 0,

        };
    };

    static isMapLoaded() {
        this.checkError();
        return !!$dataMap;
    };

    static onLoad(object: object) {
        var array;
        if (object === $dataMap) {
            this.extractMetadata(object);
            array = $dataMap.events;
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
            Decrypter.hasEncryptedImages = !!$dataSystem.hasEncryptedImages;
            Decrypter.hasEncryptedAudio = !!$dataSystem.hasEncryptedAudio;
            Scene_Boot.loadSystemImages();
        }
    };

    static extractMetadata(data: any) {
        var re = /<([^<>:]+)(:?)([^>]*)>/g;
        data.meta = {};
        for (; ;) {
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

    static isBattleTest(): boolean {
        return Utils.isOptionValid('btest');
    };

    static isEventTest(): boolean {
        return Utils.isOptionValid('etest');
    };

    static isSkill(item: any): item is DB.Skill {
        return item && $dataSkills.contains(item);
    };

    static isItem(item: any): item is DB.Item {
        return item && $dataItems.contains(item);
    };

    static isWeapon(item: any): item is DB.Weapon {
        return item && $dataWeapons.contains(item);
    };

    static isArmor(item: any): item is DB.Armor {
        return item && $dataArmors.contains(item);
    };

    static createGameObjects() {
        $gameTemp = new Game_Temp();
        $gameSystem = new Game_System();
        $gameScreen = new Game_Screen();
        $gameTimer = new Game_Timer();
        $gameMessage = new Game_Message();
        $gameSwitches = new Game_Switches();
        $gameVariables = new Game_Variables();
        $gameSelfSwitches = new Game_SelfSwitches();
        $gameActors = new Game_Actors();
        $gameParty = new Game_Party();
        $gameTroop = new Game_Troop();
        $gameMap = new Game_Map();
        $gamePlayer = new Game_Player();
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

    static loadGlobalInfo(): SavefileInfo[] {
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

    static saveGlobalInfo(info: SavefileInfo[]) {
        StorageManager.save(0, JSON.stringify(info));
    };

    static isThisGameFile(savefileId: number): boolean {
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

    static isAnySavefileExists(): boolean {
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

    static latestSavefileId(): number {
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

    static loadSavefileImages(info: SavefileInfo) {
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

    static maxSavefiles(): number {
        return 20;
    };

    static saveGame(savefileId: number): boolean {
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

    static loadGame(savefileId: number): boolean {
        try {
            return this.loadGameWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    static loadSavefileInfo(savefileId: number) {
        var globalInfo = this.loadGlobalInfo();
        return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
    };

    static lastAccessedSavefileId() {
        return this._lastAccessedId;
    };

    static saveGameWithoutRescue(savefileId: number) {
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

    static loadGameWithoutRescue(savefileId: number) {
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

    static makeSavefileInfo(): SavefileInfo {
        return {
            globalId: this._globalId,
            title: $dataSystem.gameTitle,
            characters: $gameParty.charactersForSavefile(),
            faces: $gameParty.facesForSavefile(),
            playtime: $gameSystem.playtimeText(),
            timestamp: Date.now(),
        }
    };

    static makeSaveContents(): SaveContents {
        // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
        return {
            system: $gameSystem,
            screen: $gameScreen,
            timer: $gameTimer,
            switches: $gameSwitches,
            variables: $gameVariables,
            selfSwitches: $gameSelfSwitches,
            actors: $gameActors,
            party: $gameParty,
            map: $gameMap,
            player: $gamePlayer,
        }
    };

    static extractSaveContents(contents: SaveContents) {
        $gameSystem = contents.system;
        $gameScreen = contents.screen;
        $gameTimer = contents.timer;
        $gameSwitches = contents.switches;
        $gameVariables = contents.variables;
        $gameSelfSwitches = contents.selfSwitches;
        $gameActors = contents.actors;
        $gameParty = contents.party;
        $gameMap = contents.map;
        $gamePlayer = contents.player;
    };
}

interface SavefileInfo {
    globalId: string;
    title: string;
    characters: any[];
    faces: any[];
    playtime: string;
    timestamp: number;
}


interface SaveContents {
    system: Game_System;
    screen: Game_Screen;
    timer: Game_Timer;
    switches: Game_Switches;
    variables: Game_Variables;
    selfSwitches: Game_SelfSwitches;
    actors: Game_Actors;
    party: Game_Party;
    map: Game_Map;
    player: Game_Player;
}


var $dataActors: DB.Actor[] = null;
var $dataClasses: DB.Class[] = null;
var $dataSkills: DB.Skill[] = null;
var $dataItems: DB.Item[] = null;
var $dataWeapons: DB.Weapon[] = null;
var $dataArmors: DB.Armor[] = null;
var $dataEnemies: DB.Enemy[] = null;
var $dataTroops: DB.Troop[] = null;
var $dataStates: DB.State[] = null;
var $dataAnimations: DB.Animation[] = null;
var $dataTilesets: DB.Tileset[] = null;
var $dataCommonEvents: DB.CommonEvent[] = null;
var $dataSystem: DB.System = null;
var $dataMapInfos: DB.MapInfo[] = null;
var $dataMap: DB.Map = null;
var $gameTemp: Game_Temp = null;
var $gameSystem: Game_System = null;
var $gameScreen: Game_Screen = null;
var $gameTimer: Game_Timer = null;
var $gameMessage: Game_Message = null;
var $gameSwitches: Game_Switches = null;
var $gameVariables: Game_Variables = null;
var $gameSelfSwitches: Game_SelfSwitches = null;
var $gameActors: Game_Actors = null;
var $gameParty: Game_Party = null;
var $gameTroop: Game_Troop = null;
var $gameMap: Game_Map = null;
var $gamePlayer: Game_Player = null;
var $testEvent: DB.List[] = null;

