//-----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.

class Window_PartyCommand extends Window_Command {

    constructor() {
        super(0);
        this.openness = 0;
        this.deactivate();
    };
    
    windowWidth() {
        return 192;
    };
    
    windowY() {
        return Graphics.boxHeight - this.windowHeight();
    };
    
    
    numVisibleRows() {
        return 4;
    };
    
    makeCommandList() {
        this.addCommand(TextManager.fight,  'fight');
        this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
    };
    
    setup() {
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.select(0);
        this.activate();
        this.open();
    };
    
}
