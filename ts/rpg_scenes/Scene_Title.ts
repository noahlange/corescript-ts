//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.

class Scene_Title extends Scene_Base {
    protected _backSprite1;
    protected _backSprite2;
    protected _commandWindow;
    protected _gameTitleSprite;

    // initialize() {
    //     Scene_Base.prototype.initialize.call(this);
    // };

    create() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    };

    start() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    };

    update() {
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        Scene_Base.prototype.update.call(this);
    };

    isBusy() {
        return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
    };

    terminate() {
        Scene_Base.prototype.terminate.call(this);
        SceneManager.snapForBackground();
    };

    createBackground() {
        this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
        this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    };

    createForeground() {
        this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameTitleSprite);
        if ($dataSystem.optDrawTitle) {
            this.drawGameTitle();
        }
    };

    drawGameTitle() {
        var x = 20;
        var y = Graphics.height / 4;
        var maxWidth = Graphics.width - x * 2;
        var text = $dataSystem.gameTitle;
        this._gameTitleSprite.bitmap.outlineColor = 'black';
        this._gameTitleSprite.bitmap.outlineWidth = 8;
        this._gameTitleSprite.bitmap.fontSize = 72;
        this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
    };

    centerSprite(sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    };

    createCommandWindow() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    };

    commandNewGame() {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };

    commandContinue() {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    };

    commandOptions() {
        this._commandWindow.close();
        SceneManager.push(Scene_Options);
    };

    playTitleMusic() {
        AudioManager.playBgm($dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    };
}

