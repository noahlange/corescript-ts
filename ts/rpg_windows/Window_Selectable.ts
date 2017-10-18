//-----------------------------------------------------------------------------
// Window_Selectable
//
// The window class with cursor movement and scroll functions.

interface FunctionMap {
    [key: string]: Function;
}

class Window_Selectable extends Window_Base {
    protected _index: number = -1;
    protected _cursorFixed: boolean = false;
    protected _cursorAll: boolean = false;
    protected _stayCount: number = 0;
    protected _helpWindow: null | Window_Help = null;
    protected _handlers: FunctionMap = {};
    protected _touching: boolean = false;
    protected _scrollX: number = 0;
    protected _scrollY: number = 0;

    constructor(x?: number, y?: number, width?: number, height?: number, callback?: Function) {
        super(x, y, width, height, callback);
        this.deactivate();
    };

    index() {
        return this._index;
    };

    cursorFixed() {
        return this._cursorFixed;
    };

    setCursorFixed(cursorFixed: boolean) {
        this._cursorFixed = cursorFixed;
    };

    cursorAll() {
        return this._cursorAll;
    };

    setCursorAll(cursorAll: boolean) {
        this._cursorAll = cursorAll;
    };

    maxCols() {
        return 1;
    };

    maxItems() {
        return 0;
    };

    spacing() {
        return 12;
    };

    itemWidth() {
        return Math.floor((this.width - this.padding * 2 +
            this.spacing()) / this.maxCols() - this.spacing());
    };

    itemHeight() {
        return Window_Base.lineHeight();
    };

    maxRows() {
        return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
    };

    activate() {
        super.activate();
        this.reselect();
    };

    deactivate() {
        super.deactivate();
        this.reselect();
    };

    select(index: number) {
        this._index = index;
        this._stayCount = 0;
        this.ensureCursorVisible();
        this.updateCursor();
        this.callUpdateHelp();
    };

    deselect() {
        this.select(-1);
    };

    reselect() {
        this.select(this._index);
    };

    row() {
        return Math.floor(this.index() / this.maxCols());
    };

    topRow() {
        return Math.floor(this._scrollY / this.itemHeight());
    };

    maxTopRow() {
        return Math.max(0, this.maxRows() - this.maxPageRows());
    };

    setTopRow(row: number) {
        var scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight();
        if (this._scrollY !== scrollY) {
            this._scrollY = scrollY;
            this.refresh();
            this.updateCursor();
        }
    };

    resetScroll() {
        this.setTopRow(0);
    };

    maxPageRows() {
        var pageHeight = this.height - this.padding * 2;
        return Math.floor(pageHeight / this.itemHeight());
    };

    maxPageItems() {
        return this.maxPageRows() * this.maxCols();
    };

    isHorizontal() {
        return this.maxPageRows() === 1;
    };

    bottomRow() {
        return Math.max(0, this.topRow() + this.maxPageRows() - 1);
    };

    setBottomRow(row: number) {
        this.setTopRow(row - (this.maxPageRows() - 1));
    };

    topIndex() {
        return this.topRow() * this.maxCols();
    };

    itemRect(index: number): PIXI.Rectangle {
        var rect = new PIXI.Rectangle();
        var maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    };

    itemRectForText(index: number) {
        var rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this.textPadding() * 2;
        return rect;
    };

    setHelpWindow(helpWindow: Window_Help) {
        this._helpWindow = helpWindow;
        this.callUpdateHelp();
    };

    showHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.show();
        }
    };

    hideHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.hide();
        }
    };

    setHandler(symbol: string, method: Function) {
        this._handlers[symbol] = method;
    };

    isHandled(symbol: string) {
        return !!this._handlers[symbol];
    };

    callHandler(symbol: string) {
        if (this.isHandled(symbol)) {
            this._handlers[symbol]();
        }
    };

    isOpenAndActive(): boolean {
        return this.isOpen() && this.active;
    };

    isCursorMovable(): boolean {
        return (this.isOpenAndActive() && !this._cursorFixed &&
            !this._cursorAll && this.maxItems() > 0);
    };

    cursorDown(wrap?: boolean) {
        var index = this.index();
        var maxItems = this.maxItems();
        var maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.select((index + maxCols) % maxItems);
        }
    };

    cursorUp(wrap?: boolean) {
        var index = this.index();
        var maxItems = this.maxItems();
        var maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.select((index - maxCols + maxItems) % maxItems);
        }
    };

    cursorRight(wrap: boolean) {
        var index = this.index();
        var maxItems = this.maxItems();
        var maxCols = this.maxCols();
        if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
            this.select((index + 1) % maxItems);
        }
    };

    cursorLeft(wrap: boolean) {
        var index = this.index();
        var maxItems = this.maxItems();
        var maxCols = this.maxCols();
        if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
            this.select((index - 1 + maxItems) % maxItems);
        }
    };

    cursorPagedown() {
        var index = this.index();
        var maxItems = this.maxItems();
        if (this.topRow() + this.maxPageRows() < this.maxRows()) {
            this.setTopRow(this.topRow() + this.maxPageRows());
            this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
        }
    };

    cursorPageup() {
        var index = this.index();
        if (this.topRow() > 0) {
            this.setTopRow(this.topRow() - this.maxPageRows());
            this.select(Math.max(index - this.maxPageItems(), 0));
        }
    };

    scrollDown() {
        if (this.topRow() + 1 < this.maxRows()) {
            this.setTopRow(this.topRow() + 1);
        }
    };

    scrollUp() {
        if (this.topRow() > 0) {
            this.setTopRow(this.topRow() - 1);
        }
    };

    update() {
        super.update();
        this.updateArrows();
        this.processCursorMove();
        this.processHandling();
        this.processWheel();
        this.processTouch();
        this._stayCount++;
    };

    updateArrows() {
        var topRow = this.topRow();
        var maxTopRow = this.maxTopRow();
        this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
        this.upArrowVisible = topRow > 0;
    };

    processCursorMove() {
        if (this.isCursorMovable()) {
            var lastIndex = this.index();
            if (Input.isRepeated('down')) {
                this.cursorDown(Input.isTriggered('down'));
            }
            if (Input.isRepeated('up')) {
                this.cursorUp(Input.isTriggered('up'));
            }
            if (Input.isRepeated('right')) {
                this.cursorRight(Input.isTriggered('right'));
            }
            if (Input.isRepeated('left')) {
                this.cursorLeft(Input.isTriggered('left'));
            }
            if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
                this.cursorPagedown();
            }
            if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
                this.cursorPageup();
            }
            if (this.index() !== lastIndex) {
                SoundManager.playCursor();
            }
        }
    };

    processHandling() {
        if (this.isOpenAndActive()) {
            if (this.isOkEnabled() && this.isOkTriggered()) {
                this.processOk();
            } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
                this.processCancel();
            } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
                this.processPagedown();
            } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
                this.processPageup();
            }
        }
    };

    processWheel() {
        if (this.isOpenAndActive()) {
            var threshold = 20;
            if (TouchInput.wheelY >= threshold) {
                this.scrollDown();
            }
            if (TouchInput.wheelY <= -threshold) {
                this.scrollUp();
            }
        }
    };

    processTouch() {
        if (this.isOpenAndActive()) {
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this._touching = true;
                this.onTouch(true);
            } else if (TouchInput.isCancelled()) {
                if (this.isCancelEnabled()) {
                    this.processCancel();
                }
            }
            if (this._touching) {
                if (TouchInput.isPressed()) {
                    this.onTouch(false);
                } else {
                    this._touching = false;
                }
            }
        } else {
            this._touching = false;
        }
    };

    isTouchedInsideFrame() {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

    onTouch(triggered: boolean) {
        var lastIndex = this.index();
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hitIndex = this.hitTest(x, y);
        if (hitIndex >= 0) {
            if (hitIndex === this.index()) {
                if (triggered && this.isTouchOkEnabled()) {
                    this.processOk();
                }
            } else if (this.isCursorMovable()) {
                this.select(hitIndex);
            }
        } else if (this._stayCount >= 10) {
            if (y < this.padding) {
                this.cursorUp();
            } else if (y >= this.height - this.padding) {
                this.cursorDown();
            }
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    };

    hitTest(x: number, y: number) {
        if (this.isContentsArea(x, y)) {
            var cx = x - this.padding;
            var cy = y - this.padding;
            var topIndex = this.topIndex();
            for (let i = 0; i < this.maxPageItems(); i++) {
                var index = topIndex + i;
                if (index < this.maxItems()) {
                    var rect = this.itemRect(index);
                    var right = rect.x + rect.width;
                    var bottom = rect.y + rect.height;
                    if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                        return index;
                    }
                }
            }
        }
        return -1;
    };

    isContentsArea(x: number, y: number) {
        var left = this.padding;
        var top = this.padding;
        var right = this.width - this.padding;
        var bottom = this.height - this.padding;
        return (x >= left && y >= top && x < right && y < bottom);
    };

    isTouchOkEnabled() {
        return this.isOkEnabled();
    };

    isOkEnabled() {
        return this.isHandled('ok');
    };

    isCancelEnabled() {
        return this.isHandled('cancel');
    };

    isOkTriggered() {
        return Input.isRepeated('ok');
    };

    isCancelTriggered() {
        return Input.isRepeated('cancel');
    };

    processOk() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    };

    playOkSound() {
        SoundManager.playOk();
    };

    playBuzzerSound() {
        SoundManager.playBuzzer();
    };

    callOkHandler() {
        this.callHandler('ok');
    };

    processCancel() {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    };

    callCancelHandler() {
        this.callHandler('cancel');
    };

    processPageup() {
        SoundManager.playCursor();
        this.updateInputData();
        this.deactivate();
        this.callHandler('pageup');
    };

    processPagedown() {
        SoundManager.playCursor();
        this.updateInputData();
        this.deactivate();
        this.callHandler('pagedown');
    };

    updateInputData() {
        Input.update();
        TouchInput.update();
    };

    updateCursor() {
        if (this._cursorAll) {
            var allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        } else if (this.isCursorVisible()) {
            var rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    };

    isCursorVisible() {
        var row = this.row();
        return row >= this.topRow() && row <= this.bottomRow();
    };

    ensureCursorVisible() {
        var row = this.row();
        if (row < this.topRow()) {
            this.setTopRow(row);
        } else if (row > this.bottomRow()) {
            this.setBottomRow(row);
        }
    };

    callUpdateHelp() {
        if (this.active && this._helpWindow) {
            this.updateHelp();
        }
    };

    updateHelp() {
        this._helpWindow.clear();
    };

    setHelpWindowItem(item: DB.Item | DB.Weapon | DB.Armor | DB.Skill) {
        if (this._helpWindow) {
            this._helpWindow.setItem(item);
        }
    };

    isCurrentItemEnabled() {
        return true;
    };

    drawAllItems() {
        var topIndex = this.topIndex();
        for (let i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    };

    drawItem(index: number) {
    };

    clearItem(index: number) {
        var rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    };

    redrawItem(index: number) {
        if (index >= 0) {
            this.clearItem(index);
            this.drawItem(index);
        }
    };

    redrawCurrentItem() {
        this.redrawItem(this.index());
    };

    refresh() {
        if (this.contents) {
            this.contents.clear();
            this.drawAllItems();
        }
    };
}

