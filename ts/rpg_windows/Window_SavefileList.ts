//-----------------------------------------------------------------------------
// Window_SavefileList
//
// The window for selecting a save file on the save and load screens.

class Window_SavefileList extends Window_Selectable {
    protected _mode: string|null = null;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.activate();
        // this._mode = null;
    };

    setMode(mode: string | null) {
        this._mode = mode;
    };

    maxItems(): number {
        return DataManager.maxSavefiles();
    };

    maxVisibleItems() {
        return 5;
    };

    itemHeight() {
        var innerHeight = this.height - this.padding * 2;
        return Math.floor(innerHeight / this.maxVisibleItems());
    };

    drawItem(index: number) {
        var id = index + 1;
        var valid = DataManager.isThisGameFile(id);
        var info = DataManager.loadSavefileInfo(id);
        var rect = this.itemRectForText(index);
        this.resetTextColor();
        if (this._mode === 'load') {
            this.changePaintOpacity(valid);
        }
        this.drawFileId(id, rect.x, rect.y);
        if (info) {
            this.changePaintOpacity(valid);
            this.drawContents(info, rect, valid);
            this.changePaintOpacity(true);
        }
    };

    drawFileId(id: number, x: number, y: number) {
        this.drawText(TextManager.file + ' ' + id, x, y, 180);
    };

    drawContents(info: SavefileInfo, rect: PIXI.Rectangle, valid: boolean) {
        var bottom = rect.y + rect.height;
        if (rect.width >= 420) {
            this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
            if (valid) {
                this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
            }
        }
        var lineHeight = Window_Base.lineHeight();
        var y2 = bottom - lineHeight;
        if (y2 >= lineHeight) {
            this.drawPlaytime(info, rect.x, y2, rect.width);
        }
    };

    drawGameTitle(info: SavefileInfo, x: number, y: number, width: number) {
        if (info.title) {
            this.drawText(info.title, x, y, width);
        }
    };

    drawPartyCharacters(info: SavefileInfo, x: number, y: number) {
        if (info.characters) {
            for (let i = 0; i < info.characters.length; i++) {
                var data = info.characters[i];
                this.drawCharacter(data[0], data[1], x + i * 48, y);
            }
        }
    };

    drawPlaytime(info: SavefileInfo, x: number, y: number, width: number) {
        if (info.playtime) {
            this.drawText(info.playtime, x, y, width, 'right');
        }
    };

    playOkSound() {
    };

}
