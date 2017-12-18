import $ from '$';
import { Graphics } from 'rpg_core';
import { SoundManager } from 'rpg_managers';
import { Window_Base, Window_Gold, Window_ShopCommand, Window_ShopNumber, Window_ShopStatus, Window_ShopBuy, Window_ItemCategory, Window_ShopSell } from 'rpg_windows';
import Scene_MenuBase from './Scene_MenuBase';

//-----------------------------------------------------------------------------
// Scene_Shop
//
// The scene class of the shop screen.

export default class Scene_Shop extends Scene_MenuBase {
    protected _goods: number[][];
    protected _purchaseOnly: boolean;
    protected _item: null | DB.Item | DB.Weapon | DB.Armor;
    protected _goldWindow: Window_Gold;
    protected _commandWindow: Window_ShopCommand;
    protected _dummyWindow: Window_Base;
    protected _numberWindow: Window_ShopNumber;
    protected _statusWindow: Window_ShopStatus;
    protected _buyWindow: Window_ShopBuy;
    protected _categoryWindow: Window_ItemCategory;
    protected _sellWindow: Window_ShopSell;

    prepare(goods: number[][], purchaseOnly: boolean) {
        this._goods = goods;
        this._purchaseOnly = purchaseOnly;
        this._item = null;
    };
    
    create() {
        super.create();
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createNumberWindow();
        this.createStatusWindow();
        this.createBuyWindow();
        this.createCategoryWindow();
        this.createSellWindow();
    };
    
    createGoldWindow() {
        this._goldWindow = new Window_Gold(0, this._helpWindow.height);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    };
    
    createCommandWindow() {
        this._commandWindow = new Window_ShopCommand(this._goldWindow.x, this._purchaseOnly);
        this._commandWindow.y = this._helpWindow.height;
        this._commandWindow.setHandler('buy',    this.commandBuy.bind(this));
        this._commandWindow.setHandler('sell',   this.commandSell.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };
    
    createDummyWindow() {
        const wy = this._commandWindow.y + this._commandWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
        this.addWindow(this._dummyWindow);
    };
    
    createNumberWindow() {
        const wy = this._dummyWindow.y;
        const wh = this._dummyWindow.height;
        this._numberWindow = new Window_ShopNumber(0, wy, wh);
        this._numberWindow.hide();
        this._numberWindow.setHandler('ok',     this.onNumberOk.bind(this));
        this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    };
    
    createStatusWindow() {
        const wx = this._numberWindow.width;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - wx;
        const wh = this._dummyWindow.height;
        this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);
    };
    
    createBuyWindow() {
        const wy = this._dummyWindow.y;
        const wh = this._dummyWindow.height;
        this._buyWindow = new Window_ShopBuy(0, wy, wh, this._goods);
        this._buyWindow.setHelpWindow(this._helpWindow);
        this._buyWindow.setStatusWindow(this._statusWindow);
        this._buyWindow.hide();
        this._buyWindow.setHandler('ok',     this.onBuyOk.bind(this));
        this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);
    };
    
    createCategoryWindow() {
        this._categoryWindow = new Window_ItemCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._dummyWindow.y;
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    };
    
    createSellWindow() {
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._sellWindow = new Window_ShopSell(0, wy, Graphics.boxWidth, wh);
        this._sellWindow.setHelpWindow(this._helpWindow);
        this._sellWindow.hide();
        this._sellWindow.setHandler('ok',     this.onSellOk.bind(this));
        this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
        this._categoryWindow.setItemWindow(this._sellWindow);
        this.addWindow(this._sellWindow);
    };
    
    activateBuyWindow() {
        this._buyWindow.setMoney(this.money());
        this._buyWindow.show();
        this._buyWindow.activate();
        this._statusWindow.show();
    };
    
    activateSellWindow() {
        this._categoryWindow.show();
        this._sellWindow.refresh();
        this._sellWindow.show();
        this._sellWindow.activate();
        this._statusWindow.hide();
    };
    
    commandBuy() {
        this._dummyWindow.hide();
        this.activateBuyWindow();
    };
    
    commandSell() {
        this._dummyWindow.hide();
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this._sellWindow.show();
        this._sellWindow.deselect();
        this._sellWindow.refresh();
    };
    
    onBuyOk() {
        this._item = this._buyWindow.item();
        this._buyWindow.hide();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
    };
    
    onBuyCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._buyWindow.hide();
        this._statusWindow.hide();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    };
    
    onCategoryOk() {
        this.activateSellWindow();
        this._sellWindow.select(0);
    };
    
    onCategoryCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._categoryWindow.hide();
        this._sellWindow.hide();
    };
    
    onSellOk() {
        this._item = this._sellWindow.item();
        this._categoryWindow.hide();
        this._sellWindow.hide();
        this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
        this._statusWindow.show();
    };
    
    onSellCancel() {
        this._sellWindow.deselect();
        this._categoryWindow.activate();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    };
    
    onNumberOk() {
        SoundManager.playShop();
        switch (this._commandWindow.currentSymbol()) {
        case 'buy':
            this.doBuy(this._numberWindow.number());
            break;
        case 'sell':
            this.doSell(this._numberWindow.number());
            break;
        }
        this.endNumberInput();
        this._goldWindow.refresh();
        this._statusWindow.refresh();
    };
    
    onNumberCancel() {
        SoundManager.playCancel();
        this.endNumberInput();
    };
    
    doBuy(number: number) {
        $.gameParty.loseGold(number * this.buyingPrice());
        $.gameParty.gainItem(this._item, number);
    };
    
    doSell(number: number) {
        $.gameParty.gainGold(number * this.sellingPrice());
        $.gameParty.loseItem(this._item, number);
    };
    
    endNumberInput() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
        case 'buy':
            this.activateBuyWindow();
            break;
        case 'sell':
            this.activateSellWindow();
            break;
        }
    };
    
    maxBuy() {
        const max = $.gameParty.maxItems(this._item) - $.gameParty.numItems(this._item);
        const price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    };
    
    maxSell() {
        return $.gameParty.numItems(this._item);
    };
    
    money() {
        return this._goldWindow.value();
    };
    
    currencyUnit() {
        return this._goldWindow.currencyUnit();
    };
    
    buyingPrice() {
        return this._buyWindow.price(this._item);
    };
    
    sellingPrice() {
        return Math.floor(this._item.price / 2);
    };
        
}

