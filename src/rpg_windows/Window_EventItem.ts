import $ from '$';
import { Graphics } from 'rpg_core';
import { DataManager } from 'rpg_managers';

import Window_Base from './Window_Base';
import Window_ItemList from './Window_ItemList';
import Window_Message from './Window_Message';

//-----------------------------------------------------------------------------
// Window_EventItem
//
// The window used for the event command [Select Item].

export default class Window_EventItem extends Window_ItemList {
    protected _messageWindow: Window_Message;

    constructor(messageWindow: Window_Message) {
        super(0, 0, Graphics.boxWidth, undefined, function() {
            this._messageWindow = messageWindow;
        });
        this.openness = 0;
        this.deactivate();
        this.setHandler('ok',     this.onOk.bind(this));
        this.setHandler('cancel', this.onCancel.bind(this));
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    };
    
    numVisibleRows() {
        return 4;
    };
    
    start() {
        this.refresh();
        this.updatePlacement();
        this.select(0);
        this.open();
        this.activate();
    };
    
    updatePlacement() {
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            this.y = 0;
        } else {
            this.y = Graphics.boxHeight - this.height;
        }
    };
    
    includes(item: any): item is DB.Item {
        const itypeId = $.gameMessage.itemChoiceItypeId();
        return DataManager.isItem(item) && item.itypeId === itypeId;
    };
    
    isEnabled(item: any) {
        return true;
    };
    
    onOk() {
        const item = this.item();
        const itemId = item ? item.id : 0;
        $.gameVariables.setValue($.gameMessage.itemChoiceVariableId(), itemId);
        this._messageWindow.terminateMessage();
        this.close();
    };
    
    onCancel() {
        $.gameVariables.setValue($.gameMessage.itemChoiceVariableId(), 0);
        this._messageWindow.terminateMessage();
        this.close();
    };
    
}
