import $ from '$';
import { Graphics, ScreenSprite, Sprite, ToneFilter } from 'rpg_core';
//-----------------------------------------------------------------------------
import Sprite_Timer from './Sprite_Timer';
import Sprite_Picture from './Sprite_Picture';

// Spriteset_Base
//
// The superclass of Spriteset_Map and Spriteset_Battle.

abstract class Spriteset_Base extends Sprite {
    protected _tone: number[] = [0, 0, 0, 0];
    protected _baseSprite: Sprite;
    protected _blackScreen: ScreenSprite;
    protected _toneFilter: ToneFilter;
    protected _pictureContainer: Sprite;
    protected _timerSprite: Sprite_Timer;
    protected _flashSprite: ScreenSprite;
    protected _fadeSprite: ScreenSprite;

    constructor() {
        super();
        this.setFrame(0, 0, Graphics.width, Graphics.height);
        this.opaque = true;
        this.createLowerLayer();
        this.createToneChanger();
        this.createUpperLayer();
        this.update();
    };

    createLowerLayer() {
        this.createBaseSprite();
    };

    createUpperLayer() {
        this.createPictures();
        this.createTimer();
        this.createScreenSprites();
    };

    update() {
        super.update();
        this.updateScreenSprites();
        this.updateToneChanger();
        this.updatePosition();
    };

    createBaseSprite() {
        this._baseSprite = new Sprite();
        this._baseSprite.setFrame(0, 0, this.width, this.height);
        this._blackScreen = new ScreenSprite();
        this._blackScreen.opacity = 255;
        this.addChild(this._baseSprite);
        this._baseSprite.addChild(this._blackScreen);
    };

    createToneChanger() {
        this.createWebGLToneChanger();
    };

    createWebGLToneChanger() {
        const margin = 48;
        const width = Graphics.width + margin * 2;
        const height = Graphics.height + margin * 2;
        this._toneFilter = new ToneFilter();
        this._baseSprite.filters = [this._toneFilter];
        this._baseSprite.filterArea = new PIXI.Rectangle(-margin, -margin, width, height);
    };

    createPictures() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._pictureContainer = new Sprite();
        this._pictureContainer.setFrame(x, y, width, height);
        for (let i = 1; i <= $.gameScreen.maxPictures(); i++) {
            this._pictureContainer.addChild(new Sprite_Picture(i));
        }
        this.addChild(this._pictureContainer);
    };

    createTimer() {
        this._timerSprite = new Sprite_Timer();
        this.addChild(this._timerSprite);
    };

    createScreenSprites() {
        this._flashSprite = new ScreenSprite();
        this._fadeSprite = new ScreenSprite();
        this.addChild(this._flashSprite);
        this.addChild(this._fadeSprite);
    };

    updateScreenSprites() {
        const color = $.gameScreen.flashColor();
        this._flashSprite.setColor(color[0], color[1], color[2]);
        this._flashSprite.opacity = color[3];
        this._fadeSprite.opacity = 255 - $.gameScreen.brightness();
    };

    updateToneChanger() {
        const tone = $.gameScreen.tone();
        if (!this._tone.equals(tone)) {
            this._tone = tone.clone();
            this.updateWebGLToneChanger();
        }
    };

    updateWebGLToneChanger() {
        const tone = this._tone;
        this._toneFilter.reset();
        this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
        this._toneFilter.adjustSaturation(-tone[3]);
    };

    updatePosition() {
        const screen = $.gameScreen;
        const scale = screen.zoomScale();
        this.scale.x = scale;
        this.scale.y = scale;
        this.x = Math.round(-screen.zoomX() * (scale - 1));
        this.y = Math.round(-screen.zoomY() * (scale - 1));
        this.x += Math.round(screen.shake());
    };

}

export default Spriteset_Base;
