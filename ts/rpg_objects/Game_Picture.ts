//-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.

class Game_Picture {
    protected _name: string;
    protected _origin: number;
    protected _x: number;
    protected _y: number;
    protected _scaleX: number;
    protected _scaleY: number;
    protected _opacity: number;
    protected _blendMode: number;
    protected _angle: number;
    protected _targetX: number;
    protected _targetY: number;
    protected _targetScaleX: number;
    protected _targetScaleY: number;
    protected _targetOpacity: number;
    protected _duration: number;

    protected _tone: number[];
    protected _toneTarget: number[];
    protected _toneDuration: number;
    protected _rotationSpeed: number;

    constructor() {
        this.initBasic();
        this.initTarget();
        this.initTone();
        this.initRotation();
    };

    name() {
        return this._name;
    };

    origin() {
        return this._origin;
    };

    x() {
        return this._x;
    };

    y() {
        return this._y;
    };

    scaleX() {
        return this._scaleX;
    };

    scaleY() {
        return this._scaleY;
    };

    opacity() {
        return this._opacity;
    };

    blendMode() {
        return this._blendMode;
    };

    tone() {
        return this._tone;
    };

    angle() {
        return this._angle;
    };

    initBasic() {
        this._name = '';
        this._origin = 0;
        this._x = 0;
        this._y = 0;
        this._scaleX = 100;
        this._scaleY = 100;
        this._opacity = 255;
        this._blendMode = 0;
    };

    initTarget() {
        this._targetX = this._x;
        this._targetY = this._y;
        this._targetScaleX = this._scaleX;
        this._targetScaleY = this._scaleY;
        this._targetOpacity = this._opacity;
        this._duration = 0;
    };

    initTone() {
        this._tone = null;
        this._toneTarget = null;
        this._toneDuration = 0;
    };

    initRotation() {
        this._angle = 0;
        this._rotationSpeed = 0;
    };

    show(name: string, origin:number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number) {
        this._name = name;
        this._origin = origin;
        this._x = x;
        this._y = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._opacity = opacity;
        this._blendMode = blendMode;
        this.initTarget();
        this.initTone();
        this.initRotation();
    };

    move(origin:number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: number, duration: number) {
        this._origin = origin;
        this._targetX = x;
        this._targetY = y;
        this._targetScaleX = scaleX;
        this._targetScaleY = scaleY;
        this._targetOpacity = opacity;
        this._blendMode = blendMode;
        this._duration = duration;
    };

    rotate(speed: number) {
        this._rotationSpeed = speed;
    };

    tint(tone: number[], duration: number) {
        if (!this._tone) {
            this._tone = [0, 0, 0, 0];
        }
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    };

    erase() {
        this._name = '';
        this._origin = 0;
        this.initTarget();
        this.initTone();
        this.initRotation();
    };

    update() {
        this.updateMove();
        this.updateTone();
        this.updateRotation();
    };

    updateMove() {
        if (this._duration > 0) {
            const d = this._duration;
            this._x = (this._x * (d - 1) + this._targetX) / d;
            this._y = (this._y * (d - 1) + this._targetY) / d;
            this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
            this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
            this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
            this._duration--;
        }
    };

    updateTone() {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    };

    updateRotation() {
        if (this._rotationSpeed !== 0) {
            this._angle += this._rotationSpeed / 2;
        }
    };

}
