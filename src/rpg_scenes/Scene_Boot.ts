import $ from '$';
import { Graphics } from 'rpg_core';
import { ConfigManager, DataManager, ImageManager, SceneManager, SoundManager } from 'rpg_managers';
import { Window_TitleCommand } from 'rpg_windows';

import Scene_Base from './Scene_Base';
import Scene_Battle from './Scene_Battle';
import Scene_Map from './Scene_Map';
import Scene_Title from './Scene_Title';

//-----------------------------------------------------------------------------
// Scene_Boot
//
// The scene class for initializing the entire game.

export default class Scene_Boot extends Scene_Base {
    protected _startDate: number = Date.now();

    create() {
        super.create();
        DataManager.loadDatabase();
        ConfigManager.load();
        this.loadSystemWindowImage();
    };
    
    loadSystemWindowImage() {
        ImageManager.reserveSystem('Window');
    };
    
    static loadSystemImages() {
        ImageManager.reserveSystem('IconSet');
        ImageManager.reserveSystem('Balloon');
        ImageManager.reserveSystem('Shadow1');
        ImageManager.reserveSystem('Shadow2');
        ImageManager.reserveSystem('Damage');
        ImageManager.reserveSystem('States');
        ImageManager.reserveSystem('Weapons1');
        ImageManager.reserveSystem('Weapons2');
        ImageManager.reserveSystem('Weapons3');
        ImageManager.reserveSystem('ButtonSet');
    };
    
    isReady() {
        if (super.isReady()) {
            return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
        } else {
            return false;
        }
    };
    
    isGameFontLoaded() {
        if (Graphics.isFontLoaded('GameFont')) {
            return true;
        } else if (!Graphics.canUseCssFontLoading()) {
            const elapsed = Date.now() - this._startDate;
            if (elapsed >= 60000) {
                throw new Error('Failed to load GameFont');
            }
        }
    };
    
    start() {
        super.start();
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            SceneManager.goto(Scene_Map);
        } else {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Title);
            Window_TitleCommand.initCommandPosition();
        }
        this.updateDocumentTitle();
    };
    
    updateDocumentTitle() {
        document.title = $.dataSystem.gameTitle;
    };
    
    checkPlayerLocation() {
        if ($.dataSystem.startMapId === 0) {
            throw new Error('Player\'s starting position is not set');
        }
    };
        
}


