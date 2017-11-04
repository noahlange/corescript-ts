//-----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.

class Window_EquipSlot extends Window_Selectable {
    protected _actor: Game_Actor | null = null;
    protected _itemWindow: Window_EquipItem;
    protected _statusWindow: Window_EquipStatus;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.refresh();
    };
    
    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };
    
    update() {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    };
    
    maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    };
    
    item() {
        return this._actor ? this._actor.equips()[this.index()] : null;
    };
    
    drawItem(index: number) {
        if (this._actor) {
            const rect = this.itemRectForText(index);
            this.changeTextColor(this.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            // this.drawText(this.slotName(index), rect.x, rect.y, 138, Window_Base.lineHeight());
            // (bungcip): changed to make it compile
            this.drawText(this.slotName(index), rect.x, rect.y, 138);
            this.drawItemName(this._actor.equips()[index], rect.x + 138, rect.y);
            this.changePaintOpacity(true);
        }
    };
    
    slotName(index: number) {
        const slots = this._actor.equipSlots();
        return this._actor ? $dataSystem.equipTypes[slots[index]] : '';
    };
    
    isEnabled(index: number) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    };
    
    isCurrentItemEnabled() {
        return this.isEnabled(this.index());
    };
    
    setStatusWindow(statusWindow: Window_EquipStatus) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };
    
    setItemWindow(itemWindow: Window_EquipItem) {
        this._itemWindow = itemWindow;
        this.update();
    };
    
    updateHelp() {
        super.updateHelp();
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setTempActor(null);
        }
    };
    
}
