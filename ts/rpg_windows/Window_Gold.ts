//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.

class Window_Gold extends Window_Base {

    constructor(x, y) {
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
        var x = this.textPadding();
        var width = this.contents.width - this.textPadding() * 2;
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
        Window_Base.prototype.open.call(this);
    };
    
}
