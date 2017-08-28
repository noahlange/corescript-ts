//-----------------------------------------------------------------------------
// Scene_GameEnd
//
// The scene class of the game end screen.

class Scene_GameEnd extends Scene_MenuBase {
    protected _commandWindow;
    // initialize() {
    //     Scene_MenuBase.prototype.initialize.call(this);
    // };
    
    create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
    };
    
    stop() {
        Scene_MenuBase.prototype.stop.call(this);
        this._commandWindow.close();
    };
    
    createBackground() {
        Scene_MenuBase.prototype.createBackground.call(this);
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

