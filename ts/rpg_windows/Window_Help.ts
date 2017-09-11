//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

class Window_Help extends Window_Base {
    protected _text;

    /// NOTE (bungcip) : useless numLines?
    constructor(numLines?) {
        var width = Graphics.boxWidth;
        super(0, 0, width);
        this._text = '';
    };
    
    windowHeight(){
        return Window_Base.fittingHeight(2);
    }
    
    
    
    setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    };
    
    clear() {
        this.setText('');
    };
    
    setItem(item) {
        this.setText(item ? item.description : '');
    };
    
    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    };
    
}
