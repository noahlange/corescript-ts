//-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

class Window_MenuCommand extends Window_Command {

    constructor(x, y) {
        super(x, y);
        this.selectLast();
    };
    
    static _lastCommandSymbol = null;
    static initCommandPosition = function() {
        this._lastCommandSymbol = null;
    };
    
    windowWidth() {
        return 240;
    };
    
    numVisibleRows() {
        return this.maxItems();
    };
    
    makeCommandList() {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    };
    
    addMainCommands() {
        var enabled = this.areMainCommandsEnabled();
        if (this.needsCommand('item')) {
            this.addCommand(TextManager.item, 'item', enabled);
        }
        if (this.needsCommand('skill')) {
            this.addCommand(TextManager.skill, 'skill', enabled);
        }
        if (this.needsCommand('equip')) {
            this.addCommand(TextManager.equip, 'equip', enabled);
        }
        if (this.needsCommand('status')) {
            this.addCommand(TextManager.status, 'status', enabled);
        }
    };
    
    addFormationCommand() {
        if (this.needsCommand('formation')) {
            var enabled = this.isFormationEnabled();
            this.addCommand(TextManager.formation, 'formation', enabled);
        }
    };
    
    addOriginalCommands() {
    };
    
    addOptionsCommand() {
        if (this.needsCommand('options')) {
            var enabled = this.isOptionsEnabled();
            this.addCommand(TextManager.options, 'options', enabled);
        }
    };
    
    addSaveCommand() {
        if (this.needsCommand('save')) {
            var enabled = this.isSaveEnabled();
            this.addCommand(TextManager.save, 'save', enabled);
        }
    };
    
    addGameEndCommand() {
        var enabled = this.isGameEndEnabled();
        this.addCommand(TextManager.gameEnd, 'gameEnd', enabled);
    };
    
    needsCommand(name) {
        var flags = $dataSystem.menuCommands;
        if (flags) {
            switch (name) {
            case 'item':
                return flags[0];
            case 'skill':
                return flags[1];
            case 'equip':
                return flags[2];
            case 'status':
                return flags[3];
            case 'formation':
                return flags[4];
            case 'save':
                return flags[5];
            }
        }
        return true;
    };
    
    areMainCommandsEnabled() {
        return $gameParty.exists();
    };
    
    isFormationEnabled() {
        return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
    };
    
    isOptionsEnabled() {
        return true;
    };
    
    isSaveEnabled() {
        return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
    };
    
    isGameEndEnabled() {
        return true;
    };
    
    processOk() {
        Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
        Window_Command.prototype.processOk.call(this);
    };
    
    selectLast() {
        this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
    };
    
}
