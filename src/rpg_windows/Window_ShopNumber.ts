import { Input, TouchInput } from 'rpg_core';
import { ImageManager, SoundManager, TextManager } from 'rpg_managers';
import { Sprite_Button } from 'rpg_sprites';

import Window_Selectable from './Window_Selectable';
import Window_Base from './Window_Base';

//-----------------------------------------------------------------------------
// Window_ShopNumber
//
// The window for inputting quantity of items to buy or sell on the shop
// screen.

export default class Window_ShopNumber extends Window_Selectable {
    protected _item: DB.Item = null;
    protected _max: number = 1;
    protected _price: number = 0;
    protected _number: number = 1;
    protected _currencyUnit: string = TextManager.currencyUnit;
    protected _buttons: Sprite_Button[];

    constructor(x: number, y: number, height: number) {
        super(x, y, undefined, height);
        this.createButtons();
    };
    
    windowWidth() {
        return 456;
    };
    
    number() {
        return this._number;
    };
    
    setup(item: DB.Item | DB.Armor | DB.Weapon, max: number, price: number) {
        this._item = item as DB.Item;
        this._max = Math.floor(max);
        this._price = price;
        this._number = 1;
        this.placeButtons();
        this.updateButtonsVisiblity();
        this.refresh();
    };
    
    setCurrencyUnit(currencyUnit: string) {
        this._currencyUnit = currencyUnit;
        this.refresh();
    };
    
    createButtons() {
        const bitmap = ImageManager.loadSystem('ButtonSet');
        const buttonWidth = 48;
        const buttonHeight = 48;
        this._buttons = [];
        for (let i = 0; i < 5; i++) {
            const button = new Sprite_Button();
            const x = buttonWidth * i;
            const w = buttonWidth * (i === 4 ? 2 : 1);
            button.bitmap = bitmap;
            button.setColdFrame(x, 0, w, buttonHeight);
            button.setHotFrame(x, buttonHeight, w, buttonHeight);
            button.visible = false;
            this._buttons.push(button);
            this.addChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
        this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
        this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
    };
    
    placeButtons() {
        const numButtons = this._buttons.length;
        const spacing = 16;
        let totalWidth = -spacing;
        for (let i = 0; i < numButtons; i++) {
            totalWidth += this._buttons[i].width + spacing;
        }
        let x = (this.width - totalWidth) / 2;
        for (let j = 0; j < numButtons; j++) {
            const button = this._buttons[j];
            button.x = x;
            button.y = this.buttonY();
            x += button.width + spacing;
        }
    };
    
    updateButtonsVisiblity() {
        if (TouchInput.date > Input.date) {
            this.showButtons();
        } else {
            this.hideButtons();
        }
    };
    
    showButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = true;
        }
    };
    
    hideButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = false;
        }
    };
    
    refresh() {
        this.contents.clear();
        this.drawItemName(this._item, 0, this.itemY());
        this.drawMultiplicationSign();
        this.drawNumber();
        this.drawTotalPrice();
    };
    
    drawMultiplicationSign() {
        const sign = '\u00d7';
        const width = this.textWidth(sign);
        const x = this.cursorX() - width * 2;
        const y = this.itemY();
        this.resetTextColor();
        this.drawText(sign, x, y, width);
    };
    
    drawNumber() {
        const x = this.cursorX();
        const y = this.itemY();
        const width = this.cursorWidth() - this.textPadding();
        this.resetTextColor();
        this.drawText(this._number.toString(), x, y, width, 'right');
    };
    
    drawTotalPrice() {
        const total = this._price * this._number;
        const width = this.contentsWidth() - this.textPadding();
        this.drawCurrencyValue(total, this._currencyUnit, 0, this.priceY(), width);
    };
    
    itemY() {
        return Math.round(this.contentsHeight() / 2 - Window_Base.lineHeight() * 1.5);
    };
    
    priceY() {
        return Math.round(this.contentsHeight() / 2 + Window_Base.lineHeight() / 2);
    };
    
    buttonY() {
        return Math.round(this.priceY() + Window_Base.lineHeight() * 2.5);
    };
    
    cursorWidth() {
        const digitWidth = this.textWidth('0');
        return this.maxDigits() * digitWidth + this.textPadding() * 2;
    };
    
    cursorX() {
        return this.contentsWidth() - this.cursorWidth() - this.textPadding();
    };
    
    maxDigits() {
        return 2;
    };
    
    update() {
        super.update();
        this.processNumberChange();
    };
    
    isOkTriggered() {
        return Input.isTriggered('ok');
    };
    
    playOkSound() {
    };
    
    processNumberChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated('right')) {
                this.changeNumber(1);
            }
            if (Input.isRepeated('left')) {
                this.changeNumber(-1);
            }
            if (Input.isRepeated('up')) {
                this.changeNumber(10);
            }
            if (Input.isRepeated('down')) {
                this.changeNumber(-10);
            }
        }
    };
    
    changeNumber(amount: number) {
        const lastNumber = this._number;
        this._number = (this._number + amount).clamp(1, this._max);
        if (this._number !== lastNumber) {
            SoundManager.playCursor();
            this.refresh();
        }
    };
    
    updateCursor() {
        this.setCursorRect(this.cursorX(), this.itemY(),
                           this.cursorWidth(), Window_Base.lineHeight());
    };
    
    onButtonUp() {
        this.changeNumber(1);
    };
    
    onButtonUp2() {
        this.changeNumber(10);
    };
    
    onButtonDown() {
        this.changeNumber(-1);
    };
    
    onButtonDown2() {
        this.changeNumber(-10);
    };
    
    onButtonOk() {
        this.processOk();
    };
    
}

