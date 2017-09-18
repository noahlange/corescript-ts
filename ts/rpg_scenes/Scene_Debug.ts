//-----------------------------------------------------------------------------
// Scene_Debug
//
// The scene class of the debug screen.

class Scene_Debug extends Scene_MenuBase {
    protected _rangeWindow: Window_DebugRange;
    protected _editWindow: Window_DebugEdit;
    protected _debugHelpWindow: Window_Base;
    
    
    create() {
        super.create();
        this.createRangeWindow();
        this.createEditWindow();
        this.createDebugHelpWindow();
    };
    
    createRangeWindow() {
        this._rangeWindow = new Window_DebugRange(0, 0);
        this._rangeWindow.setHandler('ok',     this.onRangeOk.bind(this));
        this._rangeWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._rangeWindow);
    };
    
    createEditWindow() {
        var wx = this._rangeWindow.width;
        var ww = Graphics.boxWidth - wx;
        this._editWindow = new Window_DebugEdit(wx, 0, ww);
        this._editWindow.setHandler('cancel', this.onEditCancel.bind(this));
        this._rangeWindow.setEditWindow(this._editWindow);
        this.addWindow(this._editWindow);
    };
    
    createDebugHelpWindow() {
        var wx = this._editWindow.x;
        var wy = this._editWindow.height;
        var ww = this._editWindow.width;
        var wh = Graphics.boxHeight - wy;
        this._debugHelpWindow = new Window_Base(wx, wy, ww, wh);
        this.addWindow(this._debugHelpWindow);
    };
    
    onRangeOk() {
        this._editWindow.activate();
        this._editWindow.select(0);
        this.refreshHelpWindow();
    };
    
    onEditCancel() {
        this._rangeWindow.activate();
        this._editWindow.deselect();
        this.refreshHelpWindow();
    };
    
    refreshHelpWindow() {
        this._debugHelpWindow.contents.clear();
        if (this._editWindow.active) {
            this._debugHelpWindow.drawTextEx(this.helpText(), 4, 0);
        }
    };
    
    helpText() {
        if (this._rangeWindow.mode() === 'switch') {
            return 'Enter : ON / OFF';
        } else {
            return ('Left     :  -1\n' +
                    'Right    :  +1\n' +
                    'Pageup   : -10\n' +
                    'Pagedown : +10');
        }
    };
        
}


