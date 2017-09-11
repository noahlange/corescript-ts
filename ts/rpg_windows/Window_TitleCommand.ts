//-----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.

class Window_TitleCommand extends Window_Command {
    constructor() {
        super(0, 0);
        this.updatePlacement();
        this.openness = 0;
        this.selectLast();
    };
    
    static _lastCommandSymbol = null;
    static initCommandPosition = function() {
        this._lastCommandSymbol = null;
    };
    
    windowWidth() {
        return 240;
    };
    
    updatePlacement() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Graphics.boxHeight - this.height - 96;
    };
    
    makeCommandList() {
        this.addCommand(TextManager.newGame,   'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        this.addCommand(TextManager.options,   'options');
    };
    
    isContinueEnabled() {
        return DataManager.isAnySavefileExists();
    };
    
    processOk() {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        Window_Command.prototype.processOk.call(this);
    };
    
    selectLast() {
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        } else if (this.isContinueEnabled()) {
            this.selectSymbol('continue');
        }
    };
    
}

