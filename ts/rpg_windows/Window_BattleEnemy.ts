//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

class Window_BattleEnemy extends Window_Selectable {
    protected _enemies;

    constructor(x, y) {
        super(x, y, undefined, undefined, function() {
            this._enemies = [];
        });
        this.refresh();
        this.hide();
    };
    
    windowWidth() {
        return Graphics.boxWidth - 192;
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    };
    
    numVisibleRows() {
        return 4;
    };
    
    maxCols() {
        return 2;
    };
    
    maxItems() {
        return this._enemies.length;
    };
    
    enemy() {
        return this._enemies[this.index()];
    };
    
    enemyIndex() {
        var enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    };
    
    drawItem(index) {
        this.resetTextColor();
        var name = this._enemies[index].name();
        var rect = this.itemRectForText(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    };
    
    show() {
        this.refresh();
        this.select(0);
        Window_Selectable.prototype.show.call(this);
    };
    
    hide() {
        Window_Selectable.prototype.hide.call(this);
        $gameTroop.select(null);
    };
    
    refresh() {
        this._enemies = $gameTroop.aliveMembers();
        Window_Selectable.prototype.refresh.call(this);
    };
    
    select(index) {
        Window_Selectable.prototype.select.call(this, index);
        $gameTroop.select(this.enemy());
    };
    
}

