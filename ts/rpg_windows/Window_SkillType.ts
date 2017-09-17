//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

class Window_SkillType extends Window_Command {
    protected _actor;
    protected _skillWindow;

    constructor(x: number, y: number) {
        super(x, y);
        this._actor = null;
    };

    windowWidth(): number {
        return 240;
    };

    setActor(actor) {
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
            var skillTypes = this._actor.addedSkillTypes();
            skillTypes.sort(function (a, b) {
                return a - b;
            });
            skillTypes.forEach(function (stypeId) {
                var name = $dataSystem.skillTypes[stypeId];
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

    setSkillWindow(skillWindow) {
        this._skillWindow = skillWindow;
        this.update();
    };

    selectLast() {
        var skill = this._actor.lastMenuSkill();
        if (skill) {
            this.selectExt(skill.stypeId);
        } else {
            this.select(0);
        }
    };

}

