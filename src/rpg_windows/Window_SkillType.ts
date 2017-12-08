import { Game_Actor } from 'rpg_objects';

import Window_Command from './Window_Command';
import Window_SkillList from './Window_SkillList';

//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

export default class Window_SkillType extends Window_Command {
    protected _actor: Game_Actor = null;
    protected _skillWindow: Window_SkillList;

    windowWidth(): number {
        return 240;
    };

    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    };

    numVisibleRows(): number {
        return 4;
    };

    makeCommandList() {
        if (this._actor) {
            const skillTypes = this._actor.addedSkillTypes();
            skillTypes.sort(function (a, b) {
                return a - b;
            });
            skillTypes.forEach(function (stypeId) {
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, 'skill', true, stypeId);
            }, this);
        }
    };

    update() {
        super.update();
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    };

    setSkillWindow(skillWindow: Window_SkillList) {
        this._skillWindow = skillWindow;
        this.update();
    };

    selectLast() {
        const skill = this._actor.lastMenuSkill();
        if (skill) {
            this.selectExt(skill.stypeId);
        } else {
            this.select(0);
        }
    };

}

