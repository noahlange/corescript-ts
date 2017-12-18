import $ from '$';
import { DataManager, SoundManager, StorageManager, TextManager } from 'rpg_managers';

import Scene_File from './Scene_File';

//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.

export default class Scene_Save extends Scene_File {

    mode() {
        return 'save';
    };
    
    helpWindowText() {
        return TextManager.saveMessage;
    };
    
    firstSavefileIndex() {
        return DataManager.lastAccessedSavefileId() - 1;
    };
    
    onSavefileOk() {
        super.onSavefileOk();
        $.gameSystem.onBeforeSave();
        if (DataManager.saveGame(this.savefileId())) {
            this.onSaveSuccess();
        } else {
            this.onSaveFailure();
        }
    };
    
    onSaveSuccess() {
        SoundManager.playSave();
        StorageManager.cleanBackup(this.savefileId());
        this.popScene();
    };
    
    onSaveFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    };
        
}

