import $ from '$';
import { ConfigManager, TextManager } from 'rpg_managers';
import { Graphics } from 'rpg_core';
import { Game_Actor } from 'rpg_objects';

import Window_Command from './Window_Command'

//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

export default class Window_ActorCommand extends Window_Command {
    protected _actor: Game_Actor|null = null;

    constructor() {
        super(0);
        this.openness = 0;
        this.deactivate();
        // this._actor = null;
    };
    
    windowWidth(): number {
        return 192;
    };


    windowY(): number {
        return Graphics.boxHeight - this.windowHeight();
    };
    
    numVisibleRows(): number {
        return 4;
    };
    
    makeCommandList() {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addGuardCommand();
            this.addItemCommand();
        }
    };
    
    addAttackCommand() {
        this.addCommand(TextManager.attack, 'attack', this._actor.canAttack());
    };
    
    addSkillCommands() {
        const skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function(a, b) {
            return a - b;
        });
        skillTypes.forEach(function(stypeId) {
            const name = $.dataSystem.skillTypes[stypeId];
            this.addCommand(name, 'skill', true, stypeId);
        }, this);
    };
    
    addGuardCommand() {
        this.addCommand(TextManager.guard, 'guard', this._actor.canGuard());
    };
    
    addItemCommand() {
        this.addCommand(TextManager.item, 'item');
    };
    
    setup(actor: Game_Actor) {
        this._actor = actor;
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    };
    
    processOk() {
        if (this._actor) {
            if (ConfigManager.commandRemember) {
                this._actor.setLastCommandSymbol(this.currentSymbol());
            } else {
                this._actor.setLastCommandSymbol('');
            }
        }
        super.processOk();
    };
    
    selectLast() {
        this.select(0);
        if (this._actor && ConfigManager.commandRemember) {
            const symbol = this._actor.lastCommandSymbol();
            this.selectSymbol(symbol);
            if (symbol === 'skill') {
                const skill = this._actor.lastBattleSkill();
                if (skill) {
                    this.selectExt(skill.stypeId);
                }
            }
        }
    };
    
}
