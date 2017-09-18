//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

class Sprite_Button extends Sprite {
    protected _touching: boolean;
    protected _coldFrame;
    protected _hotFrame;
    protected _clickHandler;

    constructor() {
        super();
        this._touching = false;
        this._coldFrame = null;
        this._hotFrame = null;
        this._clickHandler = null;
    };

    update() {
        super.update();
        this.updateFrame();
        this.processTouch();
    };

    updateFrame() {
        var frame;
        if (this._touching) {
            frame = this._hotFrame;
        } else {
            frame = this._coldFrame;
        }
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    };

    setColdFrame(x: number, y: number, width: number, height: number) {
        this._coldFrame = new Rectangle(x, y, width, height);
    };

    setHotFrame(x: number, y: number, width: number, height: number) {
        this._hotFrame = new Rectangle(x, y, width, height);
    };

    setClickHandler(method) {
        this._clickHandler = method;
    };

    callClickHandler() {
        if (this._clickHandler) {
            this._clickHandler();
        }
    };

    processTouch() {
        if (this.isActive()) {
            if (TouchInput.isTriggered() && this.isButtonTouched()) {
                this._touching = true;
            }
            if (this._touching) {
                if (TouchInput.isReleased() || !this.isButtonTouched()) {
                    this._touching = false;
                    if (TouchInput.isReleased()) {
                        this.callClickHandler();
                    }
                }
            }
        } else {
            this._touching = false;
        }
    };

    isActive() {
        var node = this as any;
        while (node) {
            if (!node.visible) {
                return false;
            }
            node = node.parent;
        }
        return true;
    };

    isButtonTouched() {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

    canvasToLocalX(x: number): number {
        var node = this as any;
        while (node) {
            x -= node.x;
            node = node.parent;
        }
        return x;
    };

    canvasToLocalY(y: number): number {
        var node = this as any;
        while (node) {
            y -= node.y;
            node = node.parent;
        }
        return y;
    };

}


