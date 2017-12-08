import { ConfigManager } from 'rpg_managers';
import { Window_Options } from 'rpg_windows';
import Scene_MenuBase from './Scene_MenuBase';

//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

export default class Scene_Options extends Scene_MenuBase {
    protected _optionsWindow: Window_Options;

    create() {
        super.create();
        this.createOptionsWindow();
    };
    
    terminate() {
        super.terminate();
        ConfigManager.save();
    };
    
    createOptionsWindow() {
        this._optionsWindow = new Window_Options();
        this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    };
    
}

