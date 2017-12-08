import { Graphics, Input } from 'rpg_core';
import Window_DebugEdit from './Window_DebugEdit';
import Window_Selectable from './Window_Selectable';

//-----------------------------------------------------------------------------
// Window_DebugRange
//
// The window for selecting a block of switches/variables on the debug screen.

export default class Window_DebugRange extends Window_Selectable {
    static lastTopRow = 0;
    static lastIndex = 0;

    protected _maxSwitches: number;
    protected _maxVariables: number;
    protected _editWindow: Window_DebugEdit;

    constructor(x: number, y: number) {
        super(x, y, undefined, undefined, function () {
            this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);
            this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);
        });
        this.refresh();
        this.setTopRow(Window_DebugRange.lastTopRow);
        this.select(Window_DebugRange.lastIndex);
        this.activate();
    };

    windowWidth() {
        return 246;
    };

    windowHeight() {
        return Graphics.boxHeight;
    };

    maxItems() {
        return this._maxSwitches + this._maxVariables;
    };

    update() {
        super.update();
        if (this._editWindow) {
            this._editWindow.setMode(this.mode());
            this._editWindow.setTopId(this.topId());
        }
    };

    mode() {
        return this.index() < this._maxSwitches ? 'switch' : 'variable';
    };

    topId() {
        const index = this.index();
        if (index < this._maxSwitches) {
            return index * 10 + 1;
        } else {
            return (index - this._maxSwitches) * 10 + 1;
        }
    };

    refresh() {
        this.createContents();
        this.drawAllItems();
    };

    drawItem(index: number) {
        const rect = this.itemRectForText(index);
        let start;
        let text;
        if (index < this._maxSwitches) {
            start = index * 10 + 1;
            text = 'S';
        } else {
            start = (index - this._maxSwitches) * 10 + 1;
            text = 'V';
        }
        const end = start + 9;
        text += ' [' + start.padZero(4) + '-' + end.padZero(4) + ']';
        this.drawText(text, rect.x, rect.y, rect.width);
    };

    isCancelTriggered() {
        return (super.isCancelTriggered() ||
            Input.isTriggered('debug'));
    };

    processCancel() {
        super.processCancel();
        Window_DebugRange.lastTopRow = this.topRow();
        Window_DebugRange.lastIndex = this.index();
    };

    setEditWindow(editWindow: Window_DebugEdit) {
        this._editWindow = editWindow;
        this.update();
    };

}

