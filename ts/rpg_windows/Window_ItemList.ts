//-----------------------------------------------------------------------------
// Window_ItemList
//
// The window for selecting an item on the item screen.

class Window_ItemList extends Window_Selectable {
    protected _category: string = 'none';
    protected _data: any[] = [];

    constructor(x: number, y: number, width: number, height?: number, callback?: Function) {
        super(x, y, width, height, callback);
        // this._category = 'none';
        // this._data = [];
    };
    
    setCategory(category: string) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.resetScroll();
        }
    };
    
    maxCols() {
        return 2;
    };
    
    spacing() {
        return 48;
    };
    
    maxItems() {
        return this._data ? this._data.length : 1;
    };
    
    item() {
        var index = this.index();
        return this._data && index >= 0 ? this._data[index] : null;
    };
    
    isCurrentItemEnabled() {
        return this.isEnabled(this.item());
    };
    
    includes(item: any) {
        switch (this._category) {
        case 'item':
            return DataManager.isItem(item) && item.itypeId === 1;
        case 'weapon':
            return DataManager.isWeapon(item);
        case 'armor':
            return DataManager.isArmor(item);
        case 'keyItem':
            return DataManager.isItem(item) && item.itypeId === 2;
        default:
            return false;
        }
    };
    
    needsNumber() {
        return true;
    };
    
    isEnabled(item: Object) {
        return $gameParty.canUse(item);
    };
    
    makeItemList() {
        this._data = $gameParty.allItems().filter(function(item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    };
    
    selectLast() {
        var index = this._data.indexOf($gameParty.lastItem());
        this.select(index >= 0 ? index : 0);
    };
    
    drawItem(index: number) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };
    
    numberWidth() {
        return this.textWidth('000');
    };
    
    drawItemNumber(item: any, x: number, y: number, width: number) {
        if (this.needsNumber()) {
            this.drawText(':', x, y, width - this.textWidth('00'), 'right');
            this.drawText($gameParty.numItems(item).toString(), x, y, width, 'right');
        }
    };
    
    updateHelp() {
        this.setHelpWindowItem(this.item());
    };
    
    refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };
    
}
