import { Graphics } from 'rpg_core';
import Window_Base from './Window_Base';

//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

export default class Window_Help extends Window_Base {
    protected _text: string = '';

    /// NOTE (bungcip) : useless numLines?
    constructor(numLines?: any) {
        super(0, 0, Graphics.boxWidth);
    };

    windowHeight() {
        return Window_Base.fittingHeight(2);
    }



    setText(text: string) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    };

    clear() {
        this.setText('');
    };

    setItem(item: DB.Item | DB.Weapon | DB.Armor | DB.Skill) {
        this.setText(item ? item.description : '');
    };

    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    };

}
