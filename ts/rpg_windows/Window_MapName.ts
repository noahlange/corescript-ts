//-----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.

class Window_MapName extends Window_Base {
    protected _showCount;
    
    constructor() {
        super(0, 0);
        this.opacity = 0;
        this.contentsOpacity = 0;
        this._showCount = 0;
        this.refresh();
    };
    
    windowWidth() {
        return 360;
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(1);
    };
    
    update() {
        Window_Base.prototype.update.call(this);
        if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();
            this._showCount--;
        } else {
            this.updateFadeOut();
        }
    };
    
    updateFadeIn() {
        this.contentsOpacity += 16;
    };
    
    updateFadeOut() {
        this.contentsOpacity -= 16;
    };
    
    open() {
        this.refresh();
        this._showCount = 150;
    };
    
    close() {
        this._showCount = 0;
    };
    
    refresh() {
        this.contents.clear();
        if ($gameMap.displayName()) {
            var width = this.contentsWidth();
            this.drawBackground(0, 0, width, Window_Base.lineHeight());
            this.drawText($gameMap.displayName(), 0, 0, width, 'center');
        }
    };
    
    drawBackground(x, y, width, height) {
        var color1 = this.dimColor1();
        var color2 = this.dimColor2();
        this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
        this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
    };
    
}
