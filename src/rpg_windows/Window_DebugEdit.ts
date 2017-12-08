import { Input } from 'rpg_core';
import { SoundManager } from 'rpg_managers';

import Window_Base from './Window_Base';
import Window_Selectable from './Window_Selectable';

//-----------------------------------------------------------------------------
// Window_DebugEdit
//
// The window for displaying switches and variables on the debug screen.

export default class Window_DebugEdit extends Window_Selectable {
    protected _mode: string = 'switch';
    protected _topId: number = 1;

    constructor(x: number, y: number, width: number) {
        super(x, y, width, Window_Base.fittingHeight(10));
        this.refresh();
    };

    maxItems() {
        return 10;
    };

    refresh() {
        this.contents.clear();
        this.drawAllItems();
    };

    drawItem(index: number) {
        const dataId = this._topId + index;
        const idText = dataId.padZero(4) + ':';
        const idWidth = this.textWidth(idText);
        const statusWidth = this.textWidth('-00000000');
        const name = this.itemName(dataId);
        const status = this.itemStatus(dataId);
        const rect = this.itemRectForText(index);
        this.resetTextColor();
        this.drawText(idText, rect.x, rect.y, rect.width);
        rect.x += idWidth;
        rect.width -= idWidth + statusWidth;
        this.drawText(name, rect.x, rect.y, rect.width);
        this.drawText(status, rect.x + rect.width, rect.y, statusWidth, 'right');
    };

    itemName(dataId: number) {
        if (this._mode === 'switch') {
            return $dataSystem.switches[dataId];
        } else {
            return $dataSystem.variables[dataId];
        }
    };

    itemStatus(dataId: number) {
        if (this._mode === 'switch') {
            return $gameSwitches.value(dataId) ? '[ON]' : '[OFF]';
        } else {
            return String($gameVariables.value(dataId));
        }
    };

    setMode(mode: string) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    };

    setTopId(id: number) {
        if (this._topId !== id) {
            this._topId = id;
            this.refresh();
        }
    };

    currentId() : number{
        return this._topId + this.index();
    };

    update() {
        super.update();
        if (this.active) {
            if (this._mode === 'switch') {
                this.updateSwitch();
            } else {
                this.updateVariable();
            }
        }
    };

    updateSwitch() {
        if (Input.isRepeated('ok')) {
            const switchId = this.currentId();
            SoundManager.playCursor();
            $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
            this.redrawCurrentItem();
        }
    };

    updateVariable() {
        const variableId = this.currentId();
        let value = $gameVariables.value(variableId);
        if (typeof value === 'number') {
            if (Input.isRepeated('right')) {
                value++;
            }
            if (Input.isRepeated('left')) {
                value--;
            }
            if (Input.isRepeated('pagedown')) {
                value += 10;
            }
            if (Input.isRepeated('pageup')) {
                value -= 10;
            }
            if ($gameVariables.value(variableId) !== value) {
                $gameVariables.setValue(variableId, value);
                SoundManager.playCursor();
                this.redrawCurrentItem();
            }
        }
    };

}
