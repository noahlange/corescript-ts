//-----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.

function Window_PartyCommand() {
    this.initialize.apply(this, arguments);
}

Window_PartyCommand.prototype = Object.create(Window_Command.prototype);
Window_PartyCommand.prototype.constructor = Window_PartyCommand;

Window_PartyCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0);
    this.openness = 0;
    this.deactivate();
};

Window_PartyCommand.prototype.windowWidth = function() {
    return 192;
};

Window_PartyCommand.prototype.windowY = function() {
    return Graphics.boxHeight - this.windowHeight();
};


Window_PartyCommand.prototype.numVisibleRows = function() {
    return 4;
};

Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight,  'fight');
    this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
};

Window_PartyCommand.prototype.setup = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.select(0);
    this.activate();
    this.open();
};
