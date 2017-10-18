//-----------------------------------------------------------------------------
// Window_ShopStatus
//
// The window for displaying number of items in possession and the actor's
// equipment on the shop screen.

class Window_ShopStatus extends Window_Base {
    protected _item: DB.Item | DB.Weapon | DB.Armor = null;
    protected _pageIndex: number = 0;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.refresh();
    };

    refresh() {
        this.contents.clear();
        if (this._item) {
            var x = this.textPadding();
            this.drawPossession(x, 0);
            if (this.isEquipItem()) {
                this.drawEquipInfo(x, Window_Base.lineHeight() * 2);
            }
        }
    };

    setItem(item: DB.Item | DB.Weapon | DB.Armor) {
        this._item = item;
        this.refresh();
    };

    isEquipItem(): boolean {
        return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
    };

    drawPossession(x: number, y: number) {
        var width = this.contents.width - this.textPadding() - x;
        var possessionWidth = this.textWidth('0000');
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.resetTextColor();
        this.drawText($gameParty.numItems(this._item).toString(), x, y, width, 'right');
    };

    drawEquipInfo(x: number, y: number) {
        var members = this.statusMembers();
        for (let i = 0; i < members.length; i++) {
            this.drawActorEquipInfo(x, y + Window_Base.lineHeight() * (i * 2.4), members[i]);
        }
    };

    statusMembers() {
        var start = this._pageIndex * this.pageSize();
        var end = start + this.pageSize();
        return $gameParty.members().slice(start, end);
    };

    pageSize(): number {
        return 4;
    };

    maxPages(): number {
        return Math.floor(($gameParty.size() + this.pageSize() - 1) / this.pageSize());
    };

    drawActorEquipInfo(x: number, y: number, actor: Game_Actor) {
        var enabled = actor.canEquip(this._item);
        this.changePaintOpacity(enabled);
        this.resetTextColor();
        this.drawText(actor.name(), x, y, 168);
        var item1 = this.currentEquippedItem(actor, (this._item as DB.Weapon).etypeId);
        if (enabled) {
            this.drawActorParamChange(x, y, actor, item1);
        }
        this.drawItemName(item1, x, y + Window_Base.lineHeight());
        this.changePaintOpacity(true);
    };

    drawActorParamChange(x: number, y: number, actor: Game_Actor, item1: DB.Weapon) {
        var width = this.contents.width - this.textPadding() - x;
        var paramId = this.paramId();
        var change = (this._item as DB.Weapon).params[paramId] - (item1 ? item1.params[paramId] : 0);
        this.changeTextColor(this.paramchangeTextColor(change));
        this.drawText((change > 0 ? '+' : '') + change, x, y, width, 'right');
    };

    paramId(): number {
        return DataManager.isWeapon(this._item) ? 2 : 3;
    };

    currentEquippedItem(actor: Game_Actor, etypeId: number) {
        var list = [];
        var equips = actor.equips();
        var slots = actor.equipSlots();
        for (let i = 0; i < slots.length; i++) {
            if (slots[i] === etypeId) {
                list.push(equips[i]);
            }
        }
        var paramId = this.paramId();
        var worstParam = Number.MAX_VALUE;
        var worstItem = null;
        for (let j = 0; j < list.length; j++) {
            if (list[j] && list[j].params[paramId] < worstParam) {
                worstParam = list[j].params[paramId];
                worstItem = list[j];
            }
        }
        return worstItem;
    };

    update() {
        super.update();
        this.updatePage();
    };

    updatePage() {
        if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
            this.changePage();
        }
    };

    isPageChangeEnabled() {
        return this.visible && this.maxPages() >= 2;
    };

    isPageChangeRequested() {
        if (Input.isTriggered('shift')) {
            return true;
        }
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            return true;
        }
        return false;
    };

    isTouchedInsideFrame() {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

    changePage() {
        this._pageIndex = (this._pageIndex + 1) % this.maxPages();
        this.refresh();
        SoundManager.playCursor();
    };

}
