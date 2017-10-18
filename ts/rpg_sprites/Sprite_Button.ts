//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

class Sprite_Button extends Sprite {
    protected _touching: boolean = false;
    protected _coldFrame: PIXI.Rectangle = null;
    protected _hotFrame: PIXI.Rectangle = null;
    protected _clickHandler: Function = null;

    update() {
        super.update();
        this.updateFrame();
        this.processTouch();
    };

    updateFrame() {
        let frame;
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
        this._coldFrame = new PIXI.Rectangle(x, y, width, height);
    };

    setHotFrame(x: number, y: number, width: number, height: number) {
        this._hotFrame = new PIXI.Rectangle(x, y, width, height);
    };

    setClickHandler(method: Function) {
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
        let node = this as any;
        while (node) {
            if (!node.visible) {
                return false;
            }
            node = node.parent;
        }
        return true;
    };

    isButtonTouched() {
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

    canvasToLocalX(x: number): number {
        let node = this as any;
        while (node) {
            x -= node.x;
            node = node.parent;
        }
        return x;
    };

    canvasToLocalY(y: number): number {
        let node = this as any;
        while (node) {
            y -= node.y;
            node = node.parent;
        }
        return y;
    };

}


