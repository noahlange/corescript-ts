//-----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.

class Window_MenuStatus extends Window_Selectable {
    protected _formationMode: boolean = false;
    protected _pendingIndex: number = -1;

    constructor(x: number, y: number) {
        super(x, y);
        // this._formationMode = false;
        // this._pendingIndex = -1;
        this.refresh();
    };

    windowWidth(): number {
        return Graphics.boxWidth - 240;
    };

    windowHeight(): number {
        return Graphics.boxHeight;
    };

    maxItems(): number {
        return $gameParty.size();
    };

    itemHeight(): number {
        var clientHeight = this.height - this.padding * 2;
        return Math.floor(clientHeight / this.numVisibleRows());
    };

    numVisibleRows(): number {
        return 4;
    };

    loadImages() {
        $gameParty.members().forEach(function (actor) {
            ImageManager.reserveFace(actor.faceName());
        }, this);
    };

    drawItem(index: number) {
        this.drawItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    };

    drawItemBackground(index: number) {
        if (index === this._pendingIndex) {
            var rect = this.itemRect(index);
            var color = this.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    };

    drawItemImage(index: number) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
        this.changePaintOpacity(true);
    };

    drawItemStatus(index: number) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        var x = rect.x + 162;
        var y = rect.y + rect.height / 2 - Window_Base.lineHeight() * 1.5;
        var width = rect.width - x - this.textPadding();
        this.drawActorSimpleStatus(actor, x, y, width);
    };

    processOk() {
        super.processOk();
        $gameParty.setMenuActor($gameParty.members()[this.index()]);
    };

    isCurrentItemEnabled() {
        if (this._formationMode) {
            var actor = $gameParty.members()[this.index()];
            return actor && actor.isFormationChangeOk();
        } else {
            return true;
        }
    };

    selectLast() {
        this.select($gameParty.menuActor().index() || 0);
    };

    formationMode() {
        return this._formationMode;
    };

    setFormationMode(formationMode: boolean) {
        this._formationMode = formationMode;
    };

    pendingIndex(): number {
        return this._pendingIndex;
    };

    setPendingIndex(index: number) {
        var lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    };

}
