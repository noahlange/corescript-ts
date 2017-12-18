import { Graphics } from 'rpg_core';
import { Game_Actor } from 'rpg_objects';
import { SoundManager } from 'rpg_managers';
import { Window_SkillType, Window_SkillStatus, Window_SkillList } from 'rpg_windows';
import Scene_ItemBase from './Scene_ItemBase';

//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.

export default class Scene_Skill extends Scene_ItemBase {
    protected _skillTypeWindow: Window_SkillType;
    protected _statusWindow: Window_SkillStatus;
    protected _itemWindow: Window_SkillList;
    
    create() {
        super.create();
        this.createHelpWindow();
        this.createSkillTypeWindow();
        this.createStatusWindow();
        this.createItemWindow();
        this.createActorWindow();
    };
    
    start() {
        super.start();
        this.refreshActor();
    };
    
    createSkillTypeWindow() {
        const wy = this._helpWindow.height;
        this._skillTypeWindow = new Window_SkillType(0, wy);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler('skill',    this.commandSkill.bind(this));
        this._skillTypeWindow.setHandler('cancel',   this.popScene.bind(this));
        this._skillTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._skillTypeWindow.setHandler('pageup',   this.previousActor.bind(this));
        this.addWindow(this._skillTypeWindow);
    };
    
    createStatusWindow() {
        const wx = this._skillTypeWindow.width;
        const wy = this._helpWindow.height;
        const ww = Graphics.boxWidth - wx;
        const wh = this._skillTypeWindow.height;
        this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    };
    
    createItemWindow() {
        const wx = 0;
        const wy = this._statusWindow.y + this._statusWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._skillTypeWindow.setSkillWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    };
    
    refreshActor() {
        const actor = this.actor();
        this._skillTypeWindow.setActor(actor);
        this._statusWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    };
    
    user() {
        return this.actor();
    };
    
    commandSkill() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    };
    
    onItemOk() {
        this.actor().setLastMenuSkill(this.item());
        this.determineItem();
    };
    
    onItemCancel() {
        this._itemWindow.deselect();
        this._skillTypeWindow.activate();
    };
    
    playSeForItem() {
        SoundManager.playUseSkill();
    };
    
    useItem() {
        super.useItem();
        this._statusWindow.refresh();
        this._itemWindow.refresh();
    };
    
    onActorChange() {
        this.refreshActor();
        this._skillTypeWindow.activate();
    };
        
}

