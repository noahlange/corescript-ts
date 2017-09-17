//-----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.

class Window_EquipItem extends Window_ItemList {
    protected _actor;
    protected _slotId: number;
    protected _statusWindow;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this._actor = null;
        this._slotId = 0;
    };

    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.resetScroll();
        }
    };

    setSlotId(slotId: number) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.resetScroll();
        }
    };

    includes(item) {
        if (item === null) {
            return true;
        }
        if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
            return false;
        }
        return this._actor.canEquip(item);
    };

    isEnabled(item) {
        return true;
    };

    selectLast() {
    };

    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };

    updateHelp() {
        super.updateHelp();
        if (this._actor && this._statusWindow) {
            var actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
    };

    playOkSound() {
    };

}
