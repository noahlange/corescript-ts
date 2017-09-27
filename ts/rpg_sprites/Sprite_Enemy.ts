//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.

class Sprite_Enemy extends Sprite_Battler {
    protected _enemy: Game_Enemy;
    protected _appeared: boolean;
    protected _battlerName: string;
    protected _effectType: null | string;
    protected _battlerHue: number;
    protected _effectDuration: number;
    protected _shake: number;
    protected _stateIconSprite: Sprite_StateIcon;
    

    // constructor(battler: Game_Enemy) {
    //     super(battler)
    // }

    initMembers() {
        super.initMembers();
        this._enemy = null;
        this._appeared = false;
        this._battlerName = '';
        this._battlerHue = 0;
        this._effectType = null;
        this._effectDuration = 0;
        this._shake = 0;
        this.createStateIconSprite();
    };

    createStateIconSprite() {
        this._stateIconSprite = new Sprite_StateIcon();
        this.addChild(this._stateIconSprite);
    };

    setBattler(battler: Game_Enemy) {
        super.setBattler(battler);
        this._enemy = battler;
        this.setHome(battler.screenX(), battler.screenY());
        this._stateIconSprite.setup(battler);
    };

    update() {
        super.update();
        if (this._enemy) {
            this.updateEffect();
            this.updateStateSprite();
        }
    };

    updateBitmap() {
        super.updateBitmap();
        var name = this._enemy.battlerName();
        var hue = this._enemy.battlerHue();
        if (this._battlerName !== name || this._battlerHue !== hue) {
            this._battlerName = name;
            this._battlerHue = hue;
            this.loadBitmap(name, hue);
            this.initVisibility();
        }
    };

    loadBitmap(name: string, hue: number) {
        if ($gameSystem.isSideView()) {
            this.bitmap = ImageManager.loadSvEnemy(name, hue);
        } else {
            this.bitmap = ImageManager.loadEnemy(name, hue);
        }
    };

    updateFrame() {
        super.updateFrame();
        var frameHeight = this.bitmap.height;
        if (this._effectType === 'bossCollapse') {
            frameHeight = this._effectDuration;
        }
        this.setFrame(0, 0, this.bitmap.width, frameHeight);
    };

    updatePosition() {
        super.updatePosition();
        this.x += this._shake;
    };

    updateStateSprite() {
        this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
        if (this._stateIconSprite.y < 20 - this.y) {
            this._stateIconSprite.y = 20 - this.y;
        }
    };

    initVisibility() {
        this._appeared = this._enemy.isAlive();
        if (!this._appeared) {
            this.opacity = 0;
        }
    };

    setupEffect() {
        if (this._appeared && this._enemy.isEffectRequested()) {
            this.startEffect(this._enemy.effectType());
            this._enemy.clearEffect();
        }
        if (!this._appeared && this._enemy.isAlive()) {
            this.startEffect('appear');
        } else if (this._appeared && this._enemy.isHidden()) {
            this.startEffect('disappear');
        }
    };

    startEffect(effectType: string) {
        this._effectType = effectType;
        switch (this._effectType) {
            case 'appear':
                this.startAppear();
                break;
            case 'disappear':
                this.startDisappear();
                break;
            case 'whiten':
                this.startWhiten();
                break;
            case 'blink':
                this.startBlink();
                break;
            case 'collapse':
                this.startCollapse();
                break;
            case 'bossCollapse':
                this.startBossCollapse();
                break;
            case 'instantCollapse':
                this.startInstantCollapse();
                break;
        }
        this.revertToNormal();
    };

    startAppear() {
        this._effectDuration = 16;
        this._appeared = true;
    };

    startDisappear() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    startWhiten() {
        this._effectDuration = 16;
    };

    startBlink() {
        this._effectDuration = 20;
    };

    startCollapse() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    startBossCollapse() {
        this._effectDuration = this.bitmap.height;
        this._appeared = false;
    };

    startInstantCollapse() {
        this._effectDuration = 16;
        this._appeared = false;
    };

    updateEffect() {
        this.setupEffect();
        if (this._effectDuration > 0) {
            this._effectDuration--;
            switch (this._effectType) {
                case 'whiten':
                    this.updateWhiten();
                    break;
                case 'blink':
                    this.updateBlink();
                    break;
                case 'appear':
                    this.updateAppear();
                    break;
                case 'disappear':
                    this.updateDisappear();
                    break;
                case 'collapse':
                    this.updateCollapse();
                    break;
                case 'bossCollapse':
                    this.updateBossCollapse();
                    break;
                case 'instantCollapse':
                    this.updateInstantCollapse();
                    break;
            }
            if (this._effectDuration === 0) {
                this._effectType = null;
            }
        }
    };

    isEffecting() {
        return this._effectType !== null;
    };

    revertToNormal() {
        this._shake = 0;
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
    };

    updateWhiten() {
        var alpha = 128 - (16 - this._effectDuration) * 10;
        this.setBlendColor([255, 255, 255, alpha]);
    };

    updateBlink() {
        this.opacity = (this._effectDuration % 10 < 5) ? 255 : 0;
    };

    updateAppear() {
        this.opacity = (16 - this._effectDuration) * 16;
    };

    updateDisappear() {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    };

    updateCollapse() {
        this.blendMode = Graphics.BLEND_ADD;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
    };

    updateBossCollapse() {
        this._shake = this._effectDuration % 2 * 4 - 2;
        this.blendMode = Graphics.BLEND_ADD;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    };

    updateInstantCollapse() {
        this.opacity = 0;
    };

    damageOffsetX() {
        return 0;
    };

    damageOffsetY() {
        return -8;
    };

}

