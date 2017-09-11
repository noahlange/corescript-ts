//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

class Window_EquipCommand extends Window_HorzCommand {
    protected _windowWidth;
    
    constructor(x, y, width) {
        super(x, y, function() {
            this._windowWidth = width;
        });
    };
    
    windowWidth() {
        return this._windowWidth;
    };
    
    maxCols() {
        return 3;
    };
    
    makeCommandList() {
        this.addCommand(TextManager.equip2,   'equip');
        this.addCommand(TextManager.optimize, 'optimize');
        this.addCommand(TextManager.clear,    'clear');
    };
    
}
