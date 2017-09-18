//-----------------------------------------------------------------------------
// Scene_Gameover
//
// The scene class of the game over screen.

class Scene_Gameover extends Scene_Base {
    protected _backSprite: Sprite;

    create() {
        super.create();
        this.playGameoverMusic();
        this.createBackground();
    };
    
    start() {
        super.start();
        this.startFadeIn(this.slowFadeSpeed(), false);
    };
    
    update() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        super.update();
    };
    
    stop() {
        super.stop();
        this.fadeOutAll();
    };
    
    terminate() {
        super.terminate();
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

