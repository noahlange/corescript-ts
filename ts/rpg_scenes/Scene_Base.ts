//=============================================================================

/**
 * The Superclass of all scene within the game.
 * 
 * @class Scene_Base
 * @constructor 
 * @extends Stage
 */
class Scene_Base extends Stage {
    protected _active: boolean;
    protected _fadeSign: number;
    protected _fadeDuration: number;
    protected _fadeSprite: ScreenSprite|null;
    protected _imageReservationId: number;
    protected _windowLayer: WindowLayer;

    /**
     * Create a instance of Scene_Base.
     * 
     * @instance 
     * @memberof Scene_Base
     */
    constructor() {
        super();

        this._active = false;
        this._fadeSign = 0;
        this._fadeDuration = 0;
        this._fadeSprite = null;
        this._imageReservationId = Utils.generateRuntimeId();
    };



    /**
     * Attach a reservation to the reserve queue.
     * 
     * @method attachReservation
     * @instance 
     * @memberof Scene_Base
     */
    attachReservation() {
        ImageManager.setDefaultReservationId(this._imageReservationId);
    };

    /**
     * Remove the reservation from the Reserve queue.
     * 
     * @method detachReservation
     * @instance 
     * @memberof Scene_Base
     */
    detachReservation() {
        ImageManager.releaseReservation(this._imageReservationId);
    };

    /**
     * Create the components and add them to the rendering process.
     * 
     * @method create
     * @instance 
     * @memberof Scene_Base
     */
    create() {
    };

    /**
     * Returns whether the scene is active or not.
     * 
     * @method isActive
     * @instance 
     * @memberof Scene_Base
     * @return {Boolean} return true if the scene is active
     */
    isActive() {
        return this._active;
    };

    /**
     * Return whether the scene is ready to start or not.
     * 
     * @method isReady
     * @instance 
     * @memberof Scene_Base
     * @return {Boolean} Return true if the scene is ready to start
     */
    isReady() {
        return ImageManager.isReady();
    };

    /**
     * Start the scene processing.
     * 
     * @method start
     * @instance 
     * @memberof Scene_Base
     */
    start() {
        this._active = true;
    };

    /**
     * Update the scene processing each new frame.
     * 
     * @method update
     * @instance 
     * @memberof Scene_Base
     */
    update() {
        this.updateFade();
        this.updateChildren();
    };

    /**
     * Stop the scene processing.
     * 
     * @method stop
     * @instance 
     * @memberof Scene_Base
     */
    stop() {
        this._active = false;
    };


    /**
     * Return whether the scene is busy or not.
     * 
     * @method isBusy
     * @instance
     * @memberof Scene_Base
     * @return {Boolean} Return true if the scene is currently busy
     */
    isBusy() {
        return this._fadeDuration > 0;
    };

    /**
     * Terminate the scene before switching to a another scene.
     * 
     * @method terminate
     * @instance 
     * @memberof Scene_Base
     */
    terminate() {
    };

    /**
     * Create the layer for the windows children
     * and add it to the rendering process.
     * 
     * @method createWindowLayer
     * @instance 
     * @memberof Scene_Base
     */
    createWindowLayer() {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        this._windowLayer = new WindowLayer();
        this._windowLayer.move(x, y, width, height);
        this.addChild(this._windowLayer);
    };

    /**
     * Add the children window to the windowLayer processing.
     * 
     * @method addWindow
     * @instance 
     * @memberof Scene_Base
     */
    addWindow(window: CoreWindow) {
        this._windowLayer.addChild(window);
    };

    /**
     * Request a fadeIn screen process.
     * 
     * @method startFadeIn
     * @param {Number} [duration=30] The time the process will take for fadeIn the screen
     * @param {Boolean} [white=false] If true the fadein will be process with a white color else it's will be black
     * 
     * @instance 
     * @memberof Scene_Base
     */
    startFadeIn(duration: number = 30, white: boolean = false) {
        this.createFadeSprite(white);
        this._fadeSign = 1;
        this._fadeDuration = duration;
        this._fadeSprite.opacity = 255;
    };

    /**
     * Request a fadeOut screen process.
     * 
     * @method startFadeOut
     * @param {Number} [duration=30] The time the process will take for fadeOut the screen
     * @param {Boolean} [white=false] If true the fadeOut will be process with a white color else it's will be black
     * 
     * @instance 
     * @memberof Scene_Base
     */
    startFadeOut(duration: number = 30, white: boolean = false) {
        this.createFadeSprite(white);
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeSprite.opacity = 0;
    };

    /**
     * Create a Screen sprite for the fadein and fadeOut purpose and
     * add it to the rendering process.
     * 
     * @method createFadeSprite
     * @instance 
     * @memberof Scene_Base
     */
    createFadeSprite(white: boolean) {
        if (!this._fadeSprite) {
            this._fadeSprite = new ScreenSprite();
            this.addChild(this._fadeSprite);
        }
        if (white) {
            this._fadeSprite.setWhite();
        } else {
            this._fadeSprite.setBlack();
        }
    };

    /**
     * Update the screen fade processing.
     * 
     * @method updateFade
     * @instance 
     * @memberof Scene_Base
     */
    updateFade() {
        if (this._fadeDuration > 0) {
            var d = this._fadeDuration;
            if (this._fadeSign > 0) {
                this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
            } else {
                this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
            }
            this._fadeDuration--;
        }
    };

    /**
     * Update the children of the scene EACH frame.
     * 
     * @method updateChildren
     * @instance 
     * @memberof Scene_Base
     */
    updateChildren() {
        this.children.forEach(function (child: any) {
            if (child['update']) {
                child['update']();
            }
        });
    };

    /**
     * Pop the scene from the stack array and switch to the
     * previous scene.
     * 
     * @method popScene
     * @instance 
     * @memberof Scene_Base
     */
    popScene() {
        SceneManager.pop();
    };

    /**
     * Check whether the game should be triggering a gameover.
     * 
     * @method checkGameover
     * @instance 
     * @memberof Scene_Base
     */
    checkGameover() {
        if ($gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    };

    /**
     * Slowly fade out all the visual and audio of the scene.
     * 
     * @method fadeOutAll
     * @instance 
     * @memberof Scene_Base
     */
    fadeOutAll() {
        var time = this.slowFadeSpeed() / 60;
        AudioManager.fadeOutBgm(time);
        AudioManager.fadeOutBgs(time);
        AudioManager.fadeOutMe(time);
        this.startFadeOut(this.slowFadeSpeed());
    };

    /**
     * Return the screen fade speed value.
     * 
     * @method fadeSpeed
     * @instance 
     * @memberof Scene_Base
     * @return {Number} Return the fade speed
     */
    fadeSpeed(): number {
        return 24;
    };

    /**
     * Return a slow screen fade speed value.
     * 
     * @method slowFadeSpeed
     * @instance 
     * @memberof Scene_Base
     * @return {Number} Return the fade speed
     */
    slowFadeSpeed(): number {
        return this.fadeSpeed() * 2;
    };


}

