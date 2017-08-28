//-----------------------------------------------------------------------------
// Scene_Gameover
//
// The scene class of the game over screen.

class Scene_Gameover extends Scene_Base {
    protected _backSprite;

    // initialize() {
    //     Scene_Base.prototype.initialize.call(this);
    // };
    
    create() {
        Scene_Base.prototype.create.call(this);
        this.playGameoverMusic();
        this.createBackground();
    };
    
    start() {
        Scene_Base.prototype.start.call(this);
        this.startFadeIn(this.slowFadeSpeed(), false);
    };
    
    update() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        Scene_Base.prototype.update.call(this);
    };
    
    stop() {
        Scene_Base.prototype.stop.call(this);
        this.fadeOutAll();
    };
    
    terminate() {
        Scene_Base.prototype.terminate.call(this);
        AudioManager.stopAll();
    };
    
    playGameoverMusic() {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.playMe($dataSystem.gameoverMe);
    };
    
    createBackground() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem('GameOver');
        this.addChild(this._backSprite);
    };
    
    isTriggered() {
        return Input.isTriggered('ok') || TouchInput.isTriggered();
    };
    
    gotoTitle() {
        SceneManager.goto(Scene_Title);
    };
        
}

