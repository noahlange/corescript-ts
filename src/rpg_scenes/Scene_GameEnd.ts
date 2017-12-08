import { SceneManager } from 'rpg_managers';
import { Window_GameEnd } from 'rpg_windows';

import Scene_MenuBase from './Scene_MenuBase';
import Scene_Title from './Scene_Title';

//-----------------------------------------------------------------------------
// Scene_GameEnd
//
// The scene class of the game end screen.

export default class Scene_GameEnd extends Scene_MenuBase {
    protected _commandWindow: Window_GameEnd;
    
    create() {
        super.create();
        this.createCommandWindow();
    };
    
    stop() {
        super.stop();
        this._commandWindow.close();
    };
    
    createBackground() {
        super.createBackground();
        this.setBackgroundOpacity(128);
    };
    
    createCommandWindow() {
        this._commandWindow = new Window_GameEnd();
        this._commandWindow.setHandler('toTitle',  this.commandToTitle.bind(this));
        this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };
    
    commandToTitle() {
        this.fadeOutAll();
        SceneManager.goto(Scene_Title);
    };
        
}

