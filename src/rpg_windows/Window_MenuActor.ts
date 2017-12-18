import $ from '$';
import { Game_Action } from 'rpg_objects';
import { DataManager } from 'rpg_managers';

import Window_MenuStatus from './Window_MenuStatus';

//-----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.

export default class Window_MenuActor extends Window_MenuStatus {

    constructor() {
        super(0, 0);
        this.hide();
    };
    
    processOk() {
        if (!this.cursorAll()) {
            $.gameParty.setTargetActor($.gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    };
    
    selectLast() {
        this.select($.gameParty.targetActor().index() || 0);
    };
    
    selectForItem(item: DB.Item | DB.Armor | DB.Weapon | DB.Skill) {
        const actor = $.gameParty.menuActor();
        const action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.select(actor.index());
            } else {
                this.selectLast();
            }
        } else if (action.isForAll()) {
            this.setCursorAll(true);
            this.select(0);
        } else {
            this.selectLast();
        }
    };
    
}
