import $ from '$';
import { Graphics } from 'rpg_core';
import { Game_Enemy } from 'rpg_objects';

import Window_Selectable from './Window_Selectable';
import Window_Base from './Window_Base';

//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

export default class Window_BattleEnemy extends Window_Selectable {
    protected _enemies: Game_Enemy[];

    constructor(x: number, y: number) {
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
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    };
    
    drawItem(index: number) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemRectForText(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    };
    
    show() {
        this.refresh();
        this.select(0);
        super.show();
    };
    
    hide() {
        super.hide();
        $.gameTroop.select(null);
    };
    
    refresh() {
        this._enemies = $.gameTroop.aliveMembers();
        super.refresh();
    };
    
    select(index: number) {
        super.select( index);
        $.gameTroop.select(this.enemy());
    };
    
}

