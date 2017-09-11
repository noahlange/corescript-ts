//-----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.

class Window_NameEdit extends Window_Base {
    protected _actor;
    protected _name;
    protected _index;
    protected _maxLength;
    protected _defaultName;

    constructor(actor, maxLength) {
        super();
        this._actor = actor;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._maxLength = maxLength;
        this._defaultName = this._name;
        this.deactivate();
        this.refresh();
        ImageManager.reserveFace(actor.faceName());
    };
    
    windowWidth() {
        return 480;
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(4);
    };
    
    windowX(){
        return (Graphics.boxWidth - this.windowWidth()) / 2;
    }
    
    windowY(){
        return (Graphics.boxHeight - (this.windowHeight() + Window_Base.fittingHeight(9) + 8)) / 2;
    }
    
    
    get name() {
        return this._name;
    };
    
    restoreDefault() {
        this._name = this._defaultName;
        this._index = this._name.length;
        this.refresh();
        return this._name.length > 0;
    };
    
    add(ch) {
        if (this._index < this._maxLength) {
            this._name += ch;
            this._index++;
            this.refresh();
            return true;
        } else {
            return false;
        }
    };
    
    back() {
        if (this._index > 0) {
            this._index--;
            this._name = this._name.slice(0, this._index);
            this.refresh();
            return true;
        } else {
            return false;
        }
    };
    
    faceWidth() {
        return 144;
    };
    
    charWidth() {
        var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
        return this.textWidth(text);
    };
    
    left() {
        var nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
        var nameWidth = (this._maxLength + 1) * this.charWidth();
        return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
    };
    
    itemRect(index) {
        return {
            x: this.left() + index * this.charWidth(),
            y: 54,
            width: this.charWidth(),
            height: Window_Base.lineHeight()
        };
    };
    
    underlineRect(index) {
        var rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    };
    
    underlineColor() {
        return this.normalColor();
    };
    
    drawUnderline(index) {
        var rect = this.underlineRect(index);
        var color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    };
    
    drawChar(index) {
        var rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._name[index] || '', rect.x, rect.y);
    };
    
    refresh() {
        this.contents.clear();
        this.drawActorFace(this._actor, 0, 0);
        for (var i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (var j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        var rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    };
    
}

