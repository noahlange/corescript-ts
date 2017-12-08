import Window_HorzCommand from './Window_HorzCommand';
import { TextManager } from 'rpg_managers';
//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

export default class Window_EquipCommand extends Window_HorzCommand {
    protected _windowWidth: number;
    
    constructor(x: number, y: number, width: number) {
        super(x, y, function() {
            this._windowWidth = width;
        });
    };
    
    windowWidth(): number {
        return this._windowWidth;
    };
    
    maxCols(): number {
        return 3;
    };
    
    makeCommandList() {
        this.addCommand(TextManager.equip2,   'equip');
        this.addCommand(TextManager.optimize, 'optimize');
        this.addCommand(TextManager.clear,    'clear');
    };
    
}
