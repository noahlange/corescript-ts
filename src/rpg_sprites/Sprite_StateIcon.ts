import { Sprite } from 'rpg_core';
import { Game_Battler } from 'rpg_objects';

//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

export default class Sprite_StateIcon extends Sprite {
    protected _battler: Game_Battler;
    protected _iconIndex: number;
    protected _animationCount: number;
    protected _animationIndex: number;

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

    setup(battler: Game_Battler) {
        this._battler = battler;
    };

    update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this.updateFrame();
            this._animationCount = 0;
        }
    };

    animationWait() : number{
        return 40;
    };

    updateIcon() {
        let icons: number[] = [];
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
        const pw = Sprite_StateIcon._iconWidth;
        const ph = Sprite_StateIcon._iconHeight;
        const sx = this._iconIndex % 16 * pw;
        const sy = Math.floor(this._iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    };

}

