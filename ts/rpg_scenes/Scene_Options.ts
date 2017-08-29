//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

class Scene_Options extends Scene_MenuBase {
    protected _optionsWindow;

    // initialize() {
    //     super.initialize();
    // };

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

