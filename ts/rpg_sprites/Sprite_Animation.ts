//-----------------------------------------------------------------------------
// Sprite_Animation
//
// The sprite for displaying an animation.

class Sprite_Animation extends Sprite {
    protected static _checker1: any = {};
    protected static _checker2: any = {};

    protected _reduceArtifacts: boolean = true;
    protected _target: null | Sprite_Base;
    protected _animation: null | DB.Animation;
    protected _mirror: boolean;
    protected _delay: number;
    protected _rate: number;
    protected _duration: number;
    protected _flashColor: number[];
    protected _flashDuration: number;
    protected _screenFlashDuration: number;
    protected _hidingDuration: number;
    protected _bitmap1: Bitmap;
    protected _bitmap2: Bitmap;
    protected _cellSprites: Sprite[] | null;
    protected _screenFlashSprite: ScreenSprite;
    protected _duplicated: boolean;

    public z: number;

    constructor() {
        super();
        // this._reduceArtifacts = true;
        this.initMembers();
    };

    initMembers() {
        this._target = null;
        this._animation = null;
        this._mirror = false;
        this._delay = 0;
        this._rate = 4;
        this._duration = 0;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        this._bitmap1 = null;
        this._bitmap2 = null;
        this._cellSprites = [];
        this._screenFlashSprite = null;
        this._duplicated = false;
        this.z = 8;
    };

    setup(target: Sprite_Base, animation: DB.Animation, mirror: boolean, delay: number) {
        this._target = target;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;
        if (this._animation) {
            this.remove();
            this.setupRate();
            this.setupDuration();
            this.loadBitmaps();
            this.createSprites();
        }
    };

    remove() {
        if (this.parent && this.parent.removeChild(this)) {
            this._target.setBlendColor([0, 0, 0, 0]);
            this._target.show();
        }
    };

    setupRate() {
        this._rate = 4;
    };

    setupDuration() {
        this._duration = this._animation.frames.length * this._rate + 1;
    };

    update() {
        super.update();
        this.updateMain();
        this.updateFlash();
        this.updateScreenFlash();
        this.updateHiding();
        Sprite_Animation._checker1 = {};
        Sprite_Animation._checker2 = {};
    };

    updateFlash() {
        if (this._flashDuration > 0) {
            var d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            this._target.setBlendColor(this._flashColor);
        }
    };

    updateScreenFlash() {
        if (this._screenFlashDuration > 0) {
            var d = this._screenFlashDuration--;
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                this._screenFlashSprite.opacity *= (d - 1) / d;
                this._screenFlashSprite.visible = (this._screenFlashDuration > 0);
            }
        }
    };

    absoluteX() {
        var x = 0;
        var object = this as any;
        while (object) {
            x += object.x;
            object = object.parent;
        }
        return x;
    };

    absoluteY() {
        var y = 0;
        var object = this as any;
        while (object) {
            y += object.y;
            object = object.parent;
        }
        return y;
    };

    updateHiding() {
        if (this._hidingDuration > 0) {
            this._hidingDuration--;
            if (this._hidingDuration === 0) {
                this._target.show();
            }
        }
    };

    isPlaying() {
        return this._duration > 0;
    };

    loadBitmaps() {
        var name1 = this._animation.animation1Name;
        var name2 = this._animation.animation2Name;
        var hue1 = this._animation.animation1Hue;
        var hue2 = this._animation.animation2Hue;
        this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
        this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
    };

    isReady() {
        return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
    };

    createSprites() {
        if (!Sprite_Animation._checker2[this._animation as any]) {
            this.createCellSprites();
            if (this._animation.position === 3) {
                Sprite_Animation._checker2[this._animation as any] = true;
            }
            this.createScreenFlashSprite();
        }
        if (Sprite_Animation._checker1[this._animation as any]) {
            this._duplicated = true;
        } else {
            this._duplicated = false;
            if (this._animation.position === 3) {
                Sprite_Animation._checker1[this._animation as any] = true;
            }
        }
    };

    createCellSprites() {
        this._cellSprites = [];
        for (var i = 0; i < 16; i++) {
            var sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this._cellSprites.push(sprite);
            this.addChild(sprite);
        }
    };

    createScreenFlashSprite() {
        this._screenFlashSprite = new ScreenSprite();
        this.addChild(this._screenFlashSprite);
    };

    updateMain() {
        if (this.isPlaying() && this.isReady()) {
            if (this._delay > 0) {
                this._delay--;
            } else {
                this._duration--;
                this.updatePosition();
                if (this._duration % this._rate === 0) {
                    this.updateFrame();
                }
            }
        }
    };

    updatePosition() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;
        } else {
            var parent = this._target.parent;
            var grandparent = parent ? parent.parent : null;
            this.x = this._target.x;
            this.y = this._target.y;
            if (this.parent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
            if (this._animation.position === 0) {
                this.y -= this._target.height;
            } else if (this._animation.position === 1) {
                this.y -= this._target.height / 2;
            }
        }
    };

    updateFrame() {
        if (this._duration > 0) {
            var frameIndex = this.currentFrameIndex();
            this.updateAllCellSprites(this._animation.frames[frameIndex]);
            this._animation.timings.forEach(function (timing) {
                if (timing.frame === frameIndex) {
                    this.processTimingData(timing);
                }
            }, this);
        }
    };

    currentFrameIndex() {
        return (this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate));
    };

    updateAllCellSprites(frame: number[][]) {
        for (var i = 0; i < this._cellSprites.length; i++) {
            var sprite = this._cellSprites[i];
            if (i < frame.length) {
                this.updateCellSprite(sprite, frame[i]);
            } else {
                sprite.visible = false;
            }
        }
    };

    updateCellSprite(sprite: Sprite, cell: number[]) {
        var pattern = cell[0];
        if (pattern >= 0) {
            var sx = pattern % 5 * 192;
            var sy = Math.floor(pattern % 100 / 5) * 192;
            var mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setFrame(sx, sy, 192, 192);
            sprite.x = cell[1];
            sprite.y = cell[2];
            sprite.rotation = cell[4] * Math.PI / 180;
            sprite.scale.x = cell[3] / 100;

            if (cell[5]) {
                sprite.scale.x *= -1;
            }
            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }

            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    };

    processTimingData(timing: DB.Timing) {
        var duration = timing.flashDuration * this._rate;
        switch (timing.flashScope) {
            case 1:
                this.startFlash(timing.flashColor, duration);
                break;
            case 2:
                this.startScreenFlash(timing.flashColor, duration);
                break;
            case 3:
                this.startHiding(duration);
                break;
        }
        if (!this._duplicated && timing.se) {
            AudioManager.playSe(timing.se);
        }
    };

    startFlash(color: number[], duration: number) {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    };

    startScreenFlash(color: number[], duration: number) {
        this._screenFlashDuration = duration;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.setColor(color[0], color[1], color[2]);
            this._screenFlashSprite.opacity = color[3];
        }
    };

    startHiding(duration: number) {
        this._hidingDuration = duration;
        this._target.hide();
    };

}



