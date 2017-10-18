//-----------------------------------------------------------------------------
// Scene_Item
//
// The scene class of the item screen.

class Scene_Item extends Scene_ItemBase {
    protected _categoryWindow: Window_ItemCategory;
    protected _itemWindow: Window_ItemList;
    protected _helpWindow: Window_Help;
    
    
    create() {
        super.create();
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
    };
    
    createCategoryWindow() {
        this._categoryWindow = new Window_ItemCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._helpWindow.height;
        this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    };
    
    createItemWindow() {
        var wy = this._categoryWindow.y + this._categoryWindow.height;
        var wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
    };
    
    user() {
        var members = $gameParty.movableMembers();
        var bestActor = members[0];
        var bestPha = 0;
        for (let i = 0; i < members.length; i++) {
            if (members[i].pha > bestPha) {
                bestPha = members[i].pha;
                bestActor = members[i];
            }
        }
        return bestActor;
    };
    
    onCategoryOk() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    };
    
    onItemOk() {
        $gameParty.setLastItem(this.item());
        this.determineItem();
    };
    
    onItemCancel() {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    };
    
    playSeForItem() {
        SoundManager.playUseItem();
    };
    
    useItem() {
        super.useItem();
        this._itemWindow.redrawCurrentItem();
    };
        
}

