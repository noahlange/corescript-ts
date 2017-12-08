import Window_Base from './Window_Base';
import { TextManager } from 'rpg_managers';
//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.

export default class Window_Gold extends Window_Base {

    constructor(x: number, y: number) {
        super(x, y);
        this.refresh();
    };
    
    windowWidth() {
        return 240;
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(1);
    };
    
    refresh() {
        const x = this.textPadding();
        const width = this.contents.width - this.textPadding() * 2;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
    };
    
    value() {
        return $gameParty.gold();
    };
    
    currencyUnit() {
        return TextManager.currencyUnit;
    };
    
    open() {
        this.refresh();
        super.open();
    };
    
}
