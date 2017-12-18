import $ from '$';
import { Graphics } from 'rpg_core';
import { Game_Action, Game_Actor } from 'rpg_objects';
import { SceneManager, SoundManager } from 'rpg_managers';
import { Window_Base, Window_ItemList, Window_MenuActor, Window_SkillList } from 'rpg_windows';

import Scene_MenuBase from './Scene_MenuBase';
import Scene_Gameover from './Scene_Gameover';
import Scene_Map from './Scene_Map';

//-----------------------------------------------------------------------------
// Scene_ItemBase
//
// The superclass of Scene_Item and Scene_Skill.

abstract class Scene_ItemBase extends Scene_MenuBase {
    protected _actorWindow: Window_MenuActor;
    protected _itemWindow: Window_ItemList | Window_SkillList;


    createActorWindow() {
        this._actorWindow = new Window_MenuActor();
        this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
        this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    };

    /**
     * Check whether the game should be triggering a gameover.
     * 
     * @method checkGameover
     * @instance 
     * @memberof Scene_Base
     */
    checkGameover() {
        if ($.gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    };

    item() {
        return this._itemWindow.item();
    };

    abstract user(): Game_Actor;

    isCursorLeft(): boolean {
        return this._itemWindow.index() % 2 === 0;
    };

    showSubWindow(window: Window_Base) {
        window.x = this.isCursorLeft() ? Graphics.boxWidth - window.width : 0;
        window.show();
        window.activate();
    };

    hideSubWindow(window: Window_Base) {
        window.hide();
        window.deactivate();
        this.activateItemWindow();
    };

    onActorOk() {
        if (this.canUse()) {
            this.useItem();
        } else {
            SoundManager.playBuzzer();
        }
    };

    onActorCancel() {
        this.hideSubWindow(this._actorWindow);
    };

    determineItem() {
        const action = new Game_Action(this.user());
        const item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showSubWindow(this._actorWindow);
            this._actorWindow.selectForItem(this.item());
        } else {
            this.useItem();
            this.activateItemWindow();
        }
    };

    /// bungcip: defined to make it compiled
    abstract playSeForItem(): void;

    useItem() {
        this.playSeForItem();
        this.user().useItem(this.item());
        this.applyItem();
        this.checkCommonEvent();
        this.checkGameover();
        this._actorWindow.refresh();
    };

    activateItemWindow() {
        this._itemWindow.refresh();
        this._itemWindow.activate();
    };

    itemTargetActors(): Game_Actor[] {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        if (!action.isForFriend()) {
            return [];
        } else if (action.isForAll()) {
            return $.gameParty.members();
        } else {
            return [$.gameParty.members()[this._actorWindow.index()]];
        }
    };

    canUse(): boolean {
        return this.user().canUse(this.item()) && this.isItemEffectsValid();
    };

    isItemEffectsValid(): boolean {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        return this.itemTargetActors().some(function (target) {
            return action.testApply(target);
        }, this);
    };

    applyItem() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        this.itemTargetActors().forEach(function (target) {
            for (let i = 0; i < action.numRepeats(); i++) {
                action.apply(target);
            }
        }, this);
        action.applyGlobal();
    };

    checkCommonEvent() {
        if ($.gameTemp.isCommonEventReserved()) {
            SceneManager.goto(Scene_Map);
        }
    };

}

export default Scene_ItemBase;