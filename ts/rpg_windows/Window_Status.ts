//-----------------------------------------------------------------------------
// Window_Status
//
// The window for displaying full status on the status screen.

class Window_Status extends Window_Selectable {
    protected _actor: Game_Actor = null;

    constructor() {
        super(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        // this._actor = null;
        this.refresh();
        this.activate();
    };
    
    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };
    
    refresh() {
        this.contents.clear();
        if (this._actor) {
            var lineHeight = Window_Base.lineHeight();
            this.drawBlock1(lineHeight * 0);
            this.drawHorzLine(lineHeight * 1);
            this.drawBlock2(lineHeight * 2);
            this.drawHorzLine(lineHeight * 6);
            this.drawBlock3(lineHeight * 7);
            this.drawHorzLine(lineHeight * 13);
            this.drawBlock4(lineHeight * 14);
        }
    };
    
    drawBlock1(y: number) {
        this.drawActorName(this._actor, 6, y);
        this.drawActorClass(this._actor, 192, y);
        this.drawActorNickname(this._actor, 432, y);
    };
    
    drawBlock2(y: number) {
        this.drawActorFace(this._actor, 12, y);
        this.drawBasicInfo(204, y);
        this.drawExpInfo(456, y);
    };
    
    drawBlock3(y: number) {
        this.drawParameters(48, y);
        this.drawEquipments(432, y);
    };
    
    drawBlock4(y: number) {
        this.drawProfile(6, y);
    };
    
    drawHorzLine(y: number) {
        var lineY = y + Window_Base.lineHeight() / 2 - 1;
        this.contents.paintOpacity = 48;
        this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
        this.contents.paintOpacity = 255;
    };
    
    lineColor() {
        return this.normalColor();
    };
    
    drawBasicInfo(x: number, y: number) {
        var lineHeight = Window_Base.lineHeight();
        this.drawActorLevel(this._actor, x, y + lineHeight * 0);
        this.drawActorIcons(this._actor, x, y + lineHeight * 1);
        this.drawActorHp(this._actor, x, y + lineHeight * 2);
        this.drawActorMp(this._actor, x, y + lineHeight * 3);
    };
    
    drawParameters(x: number, y: number) {
        var lineHeight = Window_Base.lineHeight();
        for (var i = 0; i < 6; i++) {
            var paramId = i + 2;
            var y2 = y + lineHeight * i;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(paramId), x, y2, 160);
            this.resetTextColor();
            this.drawText(this._actor.param(paramId).toString(), x + 160, y2, 60, 'right');
        }
    };
    
    drawExpInfo(x: number, y: number) {
        var lineHeight = Window_Base.lineHeight();
        var expTotal = TextManager.expTotal.format(TextManager.exp);
        var expNext = TextManager.expNext.format(TextManager.level);
        var value1 = this._actor.currentExp().toString();
        var value2 = this._actor.nextRequiredExp().toString();
        if (this._actor.isMaxLevel()) {
            value1 = '-------';
            value2 = '-------';
        }
        this.changeTextColor(this.systemColor());
        this.drawText(expTotal, x, y + lineHeight * 0, 270);
        this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        this.drawText(value1, x, y + lineHeight * 1, 270, 'right');
        this.drawText(value2, x, y + lineHeight * 3, 270, 'right');
    };
    
    drawEquipments(x: number, y: number) {
        var equips = this._actor.equips();
        var count = Math.min(equips.length, this.maxEquipmentLines());
        for (var i = 0; i < count; i++) {
            this.drawItemName(equips[i], x, y + Window_Base.lineHeight() * i);
        }
    };
    
    drawProfile(x: number, y: number) {
        this.drawTextEx(this._actor.profile(), x, y);
    };
    
    maxEquipmentLines() {
        return 6;
    };
    
}
