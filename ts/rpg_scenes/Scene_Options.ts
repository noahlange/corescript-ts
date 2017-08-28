//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

class Scene_Options extends Scene_MenuBase {
    protected _optionsWindow;

    // initialize() {
    //     Scene_MenuBase.prototype.initialize.call(this);
    // };

    create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createOptionsWindow();
    };
    
    terminate() {
        Scene_MenuBase.prototype.terminate.call(this);
        ConfigManager.save();
    };
    
    createOptionsWindow() {
        this._optionsWindow = new Window_Options();
        this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    };
    
}

