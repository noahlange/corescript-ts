import Window_SkillList from './Window_SkillList';

//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

export default class Window_BattleSkill extends Window_SkillList {

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.hide();
    };

    show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    };

    hide() {
        this.hideHelpWindow();
        super.hide();
    };

}
