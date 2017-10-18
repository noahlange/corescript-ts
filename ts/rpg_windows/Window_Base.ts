//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

class Window_Base extends CoreWindow {
    protected _opening: boolean;
    protected _closing: boolean;
    protected _dimmerSprite: Sprite;

    constructor(x?: number, y?: number, width?: number, height?: number, callback?: Function) {
        super();

        /// NOTE: workaround for: 
        ///     - Window_BattleEnemy
        ///     - Window_DebugRange
        ///     - Window_NumberInput
        ///     - Window_Command
        ///     - Window_ChoiceList
        if (callback != undefined) {
            let cb = callback.bind(this);
            cb();
        }


        this.loadWindowskin();

        if (x === undefined) {
            x = this.windowX();
        }

        if (y === undefined) {
            y = this.windowY();
        }

        if (width === undefined) {
            width = this.windowWidth();
        }

        if (height === undefined) {
            height = this.windowHeight()
        }

        this.move(x, y, width, height);
        this.updatePadding();
        this.updateBackOpacity();
        this.updateTone();
        this.createContents();
        this._opening = false;
        this._closing = false;
        this._dimmerSprite = null;
    };

    protected static _iconWidth = 32;
    protected static _iconHeight = 32;
    protected static _faceWidth = 144;
    protected static _faceHeight = 144;

    /// bungcip: this two function added to workaround typescript
    ///          limitation around super() in counstructor
    windowWidth() { return Graphics.boxWidth; }
    windowHeight() { return Graphics.boxHeight; }
    windowX() { return 0; }
    windowY() { return 0; }

    static lineHeight() {
        return 36;
    };

    standardFontFace() {
        if ($gameSystem.isChinese()) {
            return 'SimHei, Heiti TC, sans-serif';
        } else if ($gameSystem.isKorean()) {
            return 'Dotum, AppleGothic, sans-serif';
        } else {
            return 'GameFont';
        }
    };

    standardFontSize(): number {
        return 28;
    };

    static standardPadding(): number {
        return 18;
    };

    textPadding(): number {
        return 6;
    };

    standardBackOpacity(): number {
        return 192;
    };

    loadWindowskin() {
        this.windowskin = ImageManager.loadSystem('Window');
    };

    updatePadding() {
        this.padding = Window_Base.standardPadding();
    };

    updateBackOpacity() {
        this.backOpacity = this.standardBackOpacity();
    };

    contentsWidth(): number {
        return this.width - Window_Base.standardPadding() * 2;
    };

    contentsHeight(): number {
        return this.height - Window_Base.standardPadding() * 2;
    };

    static fittingHeight(numLines: number) {
        return numLines * Window_Base.lineHeight() + this.standardPadding() * 2;
    };

    updateTone() {
        var tone = $gameSystem.windowTone();
        this.setTone(tone[0], tone[1], tone[2]);
    };

    createContents() {
        this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
        this.resetFontSettings();
    };

    resetFontSettings() {
        this.contents.fontFace = this.standardFontFace();
        this.contents.fontSize = this.standardFontSize();
        this.resetTextColor();
    };

    resetTextColor() {
        this.changeTextColor(this.normalColor());
    };

    update() {
        super.update();
        this.updateTone();
        this.updateOpen();
        this.updateClose();
        this.updateBackgroundDimmer();
    };

    updateOpen() {
        if (this._opening) {
            this.openness += 32;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    };

    updateClose() {
        if (this._closing) {
            this.openness -= 32;
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    };

    open() {
        if (!this.isOpen()) {
            this._opening = true;
        }
        this._closing = false;
    };

    close() {
        if (!this.isClosed()) {
            this._closing = true;
        }
        this._opening = false;
    };

    isOpening() {
        return this._opening;
    };

    isClosing() {
        return this._closing;
    };

    show() {
        this.visible = true;
    };

    hide() {
        this.visible = false;
    };

    activate() {
        this.active = true;
    };

    deactivate() {
        this.active = false;
    };

    textColor(n: number) {
        var px = 96 + (n % 8) * 12 + 6;
        var py = 144 + Math.floor(n / 8) * 12 + 6;
        return this.windowskin.getPixel(px, py);
    };

    normalColor() {
        return this.textColor(0);
    };

    systemColor() {
        return this.textColor(16);
    };

    crisisColor() {
        return this.textColor(17);
    };

    deathColor() {
        return this.textColor(18);
    };

    gaugeBackColor() {
        return this.textColor(19);
    };

    hpGaugeColor1() {
        return this.textColor(20);
    };

    hpGaugeColor2() {
        return this.textColor(21);
    };

    mpGaugeColor1() {
        return this.textColor(22);
    };

    mpGaugeColor2() {
        return this.textColor(23);
    };

    mpCostColor() {
        return this.textColor(23);
    };

    powerUpColor() {
        return this.textColor(24);
    };

    powerDownColor() {
        return this.textColor(25);
    };

    tpGaugeColor1() {
        return this.textColor(28);
    };

    tpGaugeColor2() {
        return this.textColor(29);
    };

    tpCostColor() {
        return this.textColor(29);
    };

    pendingColor() {
        return this.windowskin.getPixel(120, 120);
    };

    translucentOpacity(): number {
        return 160;
    };

    changeTextColor(color: string) {
        this.contents.textColor = color;
    };

    changePaintOpacity(enabled: boolean | number) {
        this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
    };

    drawText(text: string, x: number, y: number, maxWidth?: number, align?: string) {
        this.contents.drawText(text, x, y, maxWidth, Window_Base.lineHeight(), align);
    };

    textWidth(text: string) {
        return this.contents.measureTextWidth(text);
    };

    drawTextEx(text: string, x: number, y: number) {
        if (text) {
            var textState: TextState = { 
                index: 0, 
                x: x, 
                y: y, 
                left: x,
                text: this.convertEscapeCharacters(text)
            };
            textState.height = this.calcTextHeight(textState, false);
            this.resetFontSettings();
            while (textState.index < textState.text.length) {
                this.processCharacter(textState);
            }
            return textState.x - x;
        } else {
            return 0;
        }
    };

    convertEscapeCharacters(text: string) {
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function () {
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function () {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    actorName(n: number) {
        var actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : '';
    };

    partyMemberName(n: number) {
        var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : '';
    };

    processCharacter(textState: TextState) {
        switch (textState.text[textState.index]) {
            case '\n':
                this.processNewLine(textState);
                break;
            case '\f':
                this.processNewPage(textState);
                break;
            case '\x1b':
                this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
                break;
            default:
                this.processNormalCharacter(textState);
                break;
        }
    };

    processNormalCharacter(textState: TextState) {
        var c = textState.text[textState.index++];
        var w = this.textWidth(c);
        this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
        textState.x += w;
    };

    processNewLine(textState: TextState) {
        textState.x = textState.left;
        textState.y += textState.height;
        textState.height = this.calcTextHeight(textState, false);
        textState.index++;
    };

    processNewPage(textState: TextState) {
        textState.index++;
    };

    obtainEscapeCode(textState: TextState) {
        textState.index++;
        var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].toUpperCase();
        } else {
            return '';
        }
    };

    obtainEscapeParam(textState: TextState): number {
        var arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        } else {
            return 0; /// (bungcip: changed to compiled)
            // return '';
        }
    };

    processEscapeCharacter(code: string, textState: TextState) {
        switch (code) {
            case 'C':
                this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
                break;
            case 'I':
                this.processDrawIcon(this.obtainEscapeParam(textState), textState);
                break;
            case '{':
                this.makeFontBigger();
                break;
            case '}':
                this.makeFontSmaller();
                break;
        }
    };

    processDrawIcon(iconIndex: number, textState: TextState) {
        this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
        textState.x += Window_Base._iconWidth + 4;
    };

    makeFontBigger() {
        if (this.contents.fontSize <= 96) {
            this.contents.fontSize += 12;
        }
    };

    makeFontSmaller() {
        if (this.contents.fontSize >= 24) {
            this.contents.fontSize -= 12;
        }
    };

    calcTextHeight(textState: TextState, all: boolean) {
        var lastFontSize = this.contents.fontSize;
        var textHeight = 0;
        var lines = textState.text.slice(textState.index).split('\n');
        var maxLines = all ? lines.length : 1;

        for (let i = 0; i < maxLines; i++) {
            var maxFontSize = this.contents.fontSize;
            var regExp = /\x1b[\{\}]/g;
            for (; ;) {
                var array = regExp.exec(lines[i]);
                if (array) {
                    if (array[0] === '\x1b{') {
                        this.makeFontBigger();
                    }
                    if (array[0] === '\x1b}') {
                        this.makeFontSmaller();
                    }
                    if (maxFontSize < this.contents.fontSize) {
                        maxFontSize = this.contents.fontSize;
                    }
                } else {
                    break;
                }
            }
            textHeight += maxFontSize + 8;
        }

        this.contents.fontSize = lastFontSize;
        return textHeight;
    };

    drawIcon(iconIndex: number, x: number, y: number) {
        var bitmap = ImageManager.loadSystem('IconSet');
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = iconIndex % 16 * pw;
        var sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
    };

    drawFace(faceName: string, faceIndex: number, x: number, y: number, width?: number, height?: number) {
        width = width || Window_Base._faceWidth;
        height = height || Window_Base._faceHeight;
        var bitmap = ImageManager.loadFace(faceName);
        var pw = Window_Base._faceWidth;
        var ph = Window_Base._faceHeight;
        var sw = Math.min(width, pw);
        var sh = Math.min(height, ph);
        var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        var sx = faceIndex % 4 * pw + (pw - sw) / 2;
        var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    };

    drawCharacter(characterName: string, characterIndex: number, x: number, y: number) {
        var bitmap = ImageManager.loadCharacter(characterName);
        var big = ImageManager.isBigCharacter(characterName);
        var pw = bitmap.width / (big ? 3 : 12);
        var ph = bitmap.height / (big ? 4 : 8);
        var n = characterIndex;
        var sx = (n % 4 * 3 + 1) * pw;
        var sy = (Math.floor(n / 4) * 4) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    };

    drawGauge(x: number, y: number, width: number, rate: number, color1: string, color2: string) {
        var fillW = Math.floor(width * rate);
        var gaugeY = y + Window_Base.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
    };

    hpColor(actor: Game_Actor) {
        if (actor.isDead()) {
            return this.deathColor();
        } else if (actor.isDying()) {
            return this.crisisColor();
        } else {
            return this.normalColor();
        }
    };

    mpColor(actor: Game_Actor) {
        return this.normalColor();
    };

    tpColor(actor: Game_Actor) {
        return this.normalColor();
    };

    drawActorCharacter(actor: Game_Actor, x: number, y: number) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    };

    drawActorFace(actor: Game_Actor, x: number, y: number, width?: number, height?: number) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    };

    drawActorName(actor: Game_Actor, x: number, y: number, width: number = 168) {
        this.changeTextColor(this.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    };

    drawActorClass(actor: Game_Actor, x: number, y: number, width: number = 168) {
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    };

    drawActorNickname(actor: Game_Actor, x: number, y: number, width: number = 270) {
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    };

    drawActorLevel(actor: Game_Actor, x: number, y: number) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level.toString(), x + 84, y, 36, 'right');
    };

    drawActorIcons(actor: Game_Actor, x: number, y: number, width: number = 144) {
        var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
        for (let i = 0; i < icons.length; i++) {
            this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
        }
    };

    drawCurrentAndMax(current: string, max: string, x: number, y: number, width: number, color1: string, color2: string) {
        var labelWidth = this.textWidth('HP');
        var valueWidth = this.textWidth('0000');
        var slashWidth = this.textWidth('/');
        var x1 = x + width - valueWidth;
        var x2 = x1 - slashWidth;
        var x3 = x2 - valueWidth;
        if (x3 >= x + labelWidth) {
            this.changeTextColor(color1);
            this.drawText(current, x3, y, valueWidth, 'right');
            this.changeTextColor(color2);
            this.drawText('/', x2, y, slashWidth, 'right');
            this.drawText(max, x1, y, valueWidth, 'right');
        } else {
            this.changeTextColor(color1);
            this.drawText(current, x1, y, valueWidth, 'right');
        }
    };

    drawActorHp(actor: Game_Actor, x: number, y: number, width: number = 186) {
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(actor.hp.toString(), actor.mhp.toString(), x, y, width,
            this.hpColor(actor), this.normalColor());
    };

    drawActorMp(actor: Game_Actor, x: number, y: number, width: number = 186) {
        var color1 = this.mpGaugeColor1();
        var color2 = this.mpGaugeColor2();
        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA, x, y, 44);
        this.drawCurrentAndMax(actor.mp.toString(), actor.mmp.toString(), x, y, width,
            this.mpColor(actor), this.normalColor());
    };

    drawActorTp(actor: Game_Actor, x: number, y: number, width: number = 96) {
        var color1 = this.tpGaugeColor1();
        var color2 = this.tpGaugeColor2();
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp.toString(), x + width - 64, y, 64, 'right');
    };

    drawActorSimpleStatus(actor: Game_Actor, x: number, y: number, width: number) {
        var lineHeight = Window_Base.lineHeight();
        var x2 = x + 180;
        var width2 = Math.min(200, width - 180 - this.textPadding());
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
        this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
    };

    drawItemName(item: DB.Item | DB.Skill | DB.Weapon | DB.Armor, x: number, y: number, width: number = 312) {
        if (item) {
            var iconBoxWidth = Window_Base._iconWidth + 4;
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    };

    drawCurrencyValue(value: number, unit: string, x: number, y: number, width: number) {
        var unitWidth = Math.min(80, this.textWidth(unit));
        this.resetTextColor();
        this.drawText(value.toString(), x, y, width - unitWidth - 6, 'right');
        this.changeTextColor(this.systemColor());
        this.drawText(unit, x + width - unitWidth, y, unitWidth, 'right');
    };

    paramchangeTextColor(change: number) {
        if (change > 0) {
            return this.powerUpColor();
        } else if (change < 0) {
            return this.powerDownColor();
        } else {
            return this.normalColor();
        }
    };

    setBackgroundType(type: number) {
        if (type === 0) {
            this.opacity = 255;
        } else {
            this.opacity = 0;
        }
        if (type === 1) {
            this.showBackgroundDimmer();
        } else {
            this.hideBackgroundDimmer();
        }
    };

    showBackgroundDimmer() {
        if (!this._dimmerSprite) {
            this._dimmerSprite = new Sprite();
            this._dimmerSprite.bitmap = new Bitmap(0, 0);
            this.addChildToBack(this._dimmerSprite);
        }
        var bitmap = this._dimmerSprite.bitmap;
        if (bitmap.width !== this.width || bitmap.height !== this.height) {
            this.refreshDimmerBitmap();
        }
        this._dimmerSprite.visible = true;
        this.updateBackgroundDimmer();
    };

    hideBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.visible = false;
        }
    };

    updateBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.opacity = this.openness;
        }
    };

    refreshDimmerBitmap() {
        if (this._dimmerSprite) {
            var bitmap = this._dimmerSprite.bitmap;
            var w = this.width;
            var h = this.height;
            var m = this.padding;
            var c1 = this.dimColor1();
            var c2 = this.dimColor2();
            bitmap.resize(w, h);
            bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
            bitmap.fillRect(0, m, w, h - m * 2, c1);
            bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
            this._dimmerSprite.setFrame(0, 0, w, h);
        }
    };

    dimColor1() {
        return 'rgba(0, 0, 0, 0.6)';
    };

    dimColor2() {
        return 'rgba(0, 0, 0, 0)';
    };

    canvasToLocalX(x: number): number {
        var node = this as any;
        while (node) {
            x -= node.x;
            node = node.parent;
        }
        return x;
    };

    canvasToLocalY(y: number): number {
        var node = this as any;
        while (node) {
            y -= node.y;
            node = node.parent;
        }
        return y;
    };

    reserveFaceImages() {
        $gameParty.members().forEach(function (actor) {
            ImageManager.reserveFace(actor.faceName());
        }, this);
    };

}
