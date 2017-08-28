//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

class Sprite_StateIcon extends Sprite {
    protected _battler;
    protected _iconIndex;
    protected _animationCount;
    protected _animationIndex;

    constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    };

    protected static _iconWidth = 32;
    protected static _iconHeight = 32;

    initMembers() {
        this._battler = null;
        this._iconIndex = 0;
        this._animationCount = 0;
        this._animationIndex = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };

    loadBitmap() {
        this.bitmap = ImageManager.loadSystem('IconSet');
        this.setFrame(0, 0, 0, 0);
    };

    setup(battler) {
        this._battler = battler;
    };

    update() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this.updateFrame();
            this._animationCount = 0;
        }
    };

    animationWait() {
        return 40;
    };

    updateIcon() {
        var icons = [];
        if (this._battler && this._battler.isAlive()) {
            icons = this._battler.allIcons();
        }
        if (icons.length > 0) {
            this._animationIndex++;
            if (this._animationIndex >= icons.length) {
                this._animationIndex = 0;
            }
            this._iconIndex = icons[this._animationIndex];
        } else {
            this._animationIndex = 0;
            this._iconIndex = 0;
        }
    };

    updateFrame() {
        var pw = Sprite_StateIcon._iconWidth;
        var ph = Sprite_StateIcon._iconHeight;
        var sx = this._iconIndex % 16 * pw;
        var sy = Math.floor(this._iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    };

}

