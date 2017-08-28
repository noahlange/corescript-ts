//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.

class Scene_MenuBase extends Scene_Base {
    protected _actor;
    protected _backgroundSprite;
    protected _helpWindow;
    
    // initialize() {
    //     Scene_Base.prototype.initialize.call(this);
    // };

    create() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
    };

    actor() {
        return this._actor;
    };

    updateActor() {
        this._actor = $gameParty.menuActor();
    };

    createBackground() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);
    };

    setBackgroundOpacity(opacity) {
        this._backgroundSprite.opacity = opacity;
    };

    createHelpWindow() {
        this._helpWindow = new Window_Help();
        this.addWindow(this._helpWindow);
    };

    nextActor() {
        $gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    };

    previousActor() {
        $gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    };

    onActorChange() {
    };
}

