import { Graphics } from 'rpg_core';
import { TextManager } from 'rpg_managers';
import Window_HorzCommand from './Window_HorzCommand';
import Window_ItemList from './Window_ItemList';

//-----------------------------------------------------------------------------
// Window_ItemCategory
//
// The window for selecting a category of items on the item and shop screens.

export default class Window_ItemCategory extends Window_HorzCommand {
    protected _itemWindow: Window_ItemList;
    
    constructor() {
        super(0, 0);
    };
    
    windowWidth() {
        return Graphics.boxWidth;
    };
    
    maxCols() {
        return 4;
    };
    
    update() {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    };
    
    makeCommandList() {
        this.addCommand(TextManager.item,    'item');
        this.addCommand(TextManager.weapon,  'weapon');
        this.addCommand(TextManager.armor,   'armor');
        this.addCommand(TextManager.keyItem, 'keyItem');
    };
    
    setItemWindow(itemWindow: Window_ItemList) {
        this._itemWindow = itemWindow;
        this.update();
    };
    
}
