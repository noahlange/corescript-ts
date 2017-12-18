import $ from '$';
import { DataManager, SceneManager, SoundManager, TextManager } from 'rpg_managers';

import Scene_File from './Scene_File';
import Scene_Map from './Scene_Map';

//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.

export default class Scene_Load extends Scene_File {
    protected _loadSuccess: boolean = false;

    terminate() {
        super.terminate();
        if (this._loadSuccess) {
            $.gameSystem.onAfterLoad();
        }
    };
    
    mode() {
        return 'load';
    };
    
    helpWindowText() {
        return TextManager.loadMessage;
    };
    
    firstSavefileIndex() {
        return DataManager.latestSavefileId() - 1;
    };
    
    onSavefileOk() {
        super.onSavefileOk();
        if (DataManager.loadGame(this.savefileId())) {
            this.onLoadSuccess();
        } else {
            this.onLoadFailure();
        }
    };
    
    onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    };
    
    onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    };
    
    reloadMapIfUpdated() {
        if ($.gameSystem.versionId() !== $.dataSystem.versionId) {
            $.gamePlayer.reserveTransfer($.gameMap.mapId(), $.gamePlayer.x, $.gamePlayer.y);
            $.gamePlayer.requestMapReload();
        }
    };
        
}


