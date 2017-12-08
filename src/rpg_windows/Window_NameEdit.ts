import { Graphics } from 'rpg_core';
import { Game_Actor } from 'rpg_objects';
import { ImageManager } from 'rpg_managers';
import Window_Base from './Window_Base';
//-----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.

export default class Window_NameEdit extends Window_Base {
    protected _actor: Game_Actor;
    protected _name: string;
    protected _index: number;
    protected _maxLength: number;
    protected _defaultName: string;

    constructor(actor: Game_Actor, maxLength: number) {
        super();
        this._actor = actor;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._maxLength = maxLength;
        this._defaultName = this._name;
        this.deactivate();
        this.refresh();
        ImageManager.reserveFace(actor.faceName());
    };

    windowWidth(): number {
        return 480;
    };

    windowHeight(): number {
        return Window_Base.fittingHeight(4);
    };

    windowX(): number {
        return (Graphics.boxWidth - this.windowWidth()) / 2;
    }

    windowY(): number {
        return (Graphics.boxHeight - (this.windowHeight() + Window_Base.fittingHeight(9) + 8)) / 2;
    }


    get name(): string {
        return this._name;
    };

    restoreDefault() {
        this._name = this._defaultName;
        this._index = this._name.length;
        this.refresh();
        return this._name.length > 0;
    };

    add(ch: string) {
        if (this._index < this._maxLength) {
            this._name += ch;
            this._index++;
            this.refresh();
            return true;
        } else {
            return false;
        }
    };

    back() {
        if (this._index > 0) {
            this._index--;
            this._name = this._name.slice(0, this._index);
            this.refresh();
            return true;
        } else {
            return false;
        }
    };

    faceWidth(): number {
        return 144;
    };

    charWidth(): number {
        const text = $gameSystem.isJapanese() ? '\uff21' : 'A';
        return this.textWidth(text);
    };

    left() {
        const nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
        const nameWidth = (this._maxLength + 1) * this.charWidth();
        return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
    };

    itemRect(index: number) {
        return {
            x: this.left() + index * this.charWidth(),
            y: 54,
            width: this.charWidth(),
            height: Window_Base.lineHeight()
        };
    };

    underlineRect(index: number) {
        const rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    };

    underlineColor() {
        return this.normalColor();
    };

    drawUnderline(index: number) {
        const rect = this.underlineRect(index);
        const color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    };

    drawChar(index: number) {
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._name[index] || '', rect.x, rect.y);
    };

    refresh() {
        this.contents.clear();
        this.drawActorFace(this._actor, 0, 0);
        for (let i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (let j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    };

}

