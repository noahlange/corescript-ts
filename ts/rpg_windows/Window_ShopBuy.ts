//-----------------------------------------------------------------------------
// Window_ShopBuy
//
// The window for selecting an item to buy on the shop screen.

class Window_ShopBuy extends Window_Selectable {
    protected _shopGoods: number[][];
    protected _money: number;
    protected _data: (DB.Item|DB.Weapon|DB.Armor)[];
    protected _price;
    protected _statusWindow;

    constructor(x: number, y: number, height: number, shopGoods: number[][]) {
        super(x, y, undefined, height);
        this._shopGoods = shopGoods;
        this._money = 0;
        this.refresh();
        this.select(0);
    };

    windowWidth(): number {
        return 456;
    };

    maxItems(): number {
        return this._data ? this._data.length : 1;
    };

    item() {
        return this._data[this.index()];
    };

    setMoney(money: number) {
        this._money = money;
        this.refresh();
    };

    isCurrentItemEnabled(): boolean {
        return this.isEnabled(this._data[this.index()]);
    };

    price(item): number {
        return this._price[this._data.indexOf(item)] || 0;
    };

    isEnabled(item): boolean {
        return (item && this.price(item) <= this._money &&
            !$gameParty.hasMaxItems(item));
    };

    refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    makeItemList() {
        this._data = [];
        this._price = [];
        this._shopGoods.forEach(function (goods) {
            var item = null;
            switch (goods[0]) {
                case 0:
                    item = $dataItems[goods[1]];
                    break;
                case 1:
                    item = $dataWeapons[goods[1]];
                    break;
                case 2:
                    item = $dataArmors[goods[1]];
                    break;
            }
            if (item) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
        }, this);
    };

    drawItem(index: number) {
        var item = this._data[index];
        var rect = this.itemRect(index);
        var priceWidth = 96;
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
        this.drawText(this.price(item).toString(), rect.x + rect.width - priceWidth,
            rect.y, priceWidth, 'right');
        this.changePaintOpacity(true);
    };

    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };

    updateHelp() {
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item());
        }
    };

}

