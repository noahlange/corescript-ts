import $ from '$';
import Window_Base from './Window_Base';
//-----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.

export default class Window_MapName extends Window_Base {
    protected _showCount: number = 0;
    
    constructor() {
        super(0, 0);
        this.opacity = 0;
        this.contentsOpacity = 0;
        this.refresh();
    };
    
    windowWidth() {
        return 360;
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(1);
    };
    
    update() {
        super.update();
        if (this._showCount > 0 && $.gameMap.isNameDisplayEnabled()) {
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
        if ($.gameMap.displayName()) {
            const width = this.contentsWidth();
            this.drawBackground(0, 0, width, Window_Base.lineHeight());
            this.drawText($.gameMap.displayName(), 0, 0, width, 'center');
        }
    };
    
    drawBackground(x: number, y: number, width: number, height: number) {
        const color1 = this.dimColor1();
        const color2 = this.dimColor2();
        this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
        this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
    };
    
}
