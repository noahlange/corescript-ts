//-----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.

class Window_BattleStatus extends Window_Selectable {
    constructor() {
        super();
        this.refresh();
        this.openness = 0;
    };
    
    windowWidth() {
        return Graphics.boxWidth - 192;
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    };
    
    windowX() {
        return Graphics.boxWidth - this.windowWidth();
    };
    
    windowY() {
        return Graphics.boxHeight - this.windowHeight();
    };
    
    
    
    numVisibleRows() {
        return 4;
    };
    
    maxItems() {
        return $gameParty.battleMembers().length;
    };
    
    refresh() {
        this.contents.clear();
        this.drawAllItems();
    };
    
    drawItem(index) {
        var actor = $gameParty.battleMembers()[index];
        this.drawBasicArea(this.basicAreaRect(index), actor);
        this.drawGaugeArea(this.gaugeAreaRect(index), actor);
    };
    
    basicAreaRect(index) {
        var rect = this.itemRectForText(index);
        rect.width -= this.gaugeAreaWidth() + 15;
        return rect;
    };
    
    gaugeAreaRect(index) {
        var rect = this.itemRectForText(index);
        rect.x += rect.width - this.gaugeAreaWidth();
        rect.width = this.gaugeAreaWidth();
        return rect;
    };
    
    gaugeAreaWidth() {
        return 330;
    };
    
    drawBasicArea(rect, actor) {
        this.drawActorName(actor, rect.x + 0, rect.y, 150);
        this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
    };
    
    drawGaugeArea(rect, actor) {
        if ($dataSystem.optDisplayTp) {
            this.drawGaugeAreaWithTp(rect, actor);
        } else {
            this.drawGaugeAreaWithoutTp(rect, actor);
        }
    };
    
    drawGaugeAreaWithTp(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        this.drawActorMp(actor, rect.x + 123, rect.y, 96);
        this.drawActorTp(actor, rect.x + 234, rect.y, 96);
    };
    
    drawGaugeAreaWithoutTp(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 201);
        this.drawActorMp(actor, rect.x + 216,  rect.y, 114);
    };
    
}

