//-----------------------------------------------------------------------------
// Scene_Status
//
// The scene class of the status screen.

class Scene_Status extends Scene_MenuBase {
    protected _statusWindow;
    
    // initialize() {
    //     Scene_MenuBase.prototype.initialize.call(this);
    // };

    create() {
        Scene_MenuBase.prototype.create.call(this);
        this._statusWindow = new Window_Status();
        this._statusWindow.setHandler('cancel', this.popScene.bind(this));
        this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._statusWindow.setHandler('pageup', this.previousActor.bind(this));
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    };

    start() {
        Scene_MenuBase.prototype.start.call(this);
        this.refreshActor();
    };

    refreshActor() {
        var actor = this.actor();
        this._statusWindow.setActor(actor);
    };

    onActorChange() {
        this.refreshActor();
        this._statusWindow.activate();
    };

}

