//-----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.

class Window_ShopCommand extends Window_HorzCommand {
    protected _windowWidth;
    protected _purchaseOnly;

    constructor(width: number, purchaseOnly) {
        super(0, 0, function() {
            this._windowWidth = width;
            this._purchaseOnly = purchaseOnly;
        });
    };
    
    windowWidth(): number {
        return this._windowWidth;
    };
    
    maxCols(): number {
        return 3;
    };
    
    makeCommandList() {
        this.addCommand(TextManager.buy,    'buy');
        this.addCommand(TextManager.sell,   'sell',   !this._purchaseOnly);
        this.addCommand(TextManager.cancel, 'cancel');
    };
    
}

