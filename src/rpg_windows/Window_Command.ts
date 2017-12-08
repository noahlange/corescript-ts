import Window_Base from './Window_Base';
import Window_Selectable from './Window_Selectable';

//-----------------------------------------------------------------------------
// Window_Command
//
// The superclass of windows for selecting a command.

// { name: name, symbol: symbol, enabled: enabled, ext: ext }
interface CommandListItem {
    name: string;
    symbol: string;
    enabled: boolean;
    ext: number | null;
}

export default class Window_Command extends Window_Selectable {
    protected _list: CommandListItem[] = [];

    constructor(x: number, y?: number, callback?: Function) {
        super(x, y, undefined, undefined, function(){
            if (callback !== undefined) {
                let cb = callback.bind(this);
                cb();
            }

            this.clearCommandList();
            this.makeCommandList();
        });
        this.refresh();
        this.select(0);
        this.activate();
    };

    windowWidth() {
        return 240;
    };

    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    };

    numVisibleRows() {
        return Math.ceil(this.maxItems() / this.maxCols());
    };

    maxItems() {
        return this._list.length;
    };

    clearCommandList() {
        this._list = [];
    };

    makeCommandList() {
    };

    addCommand(name: string, symbol: string, enabled: boolean = true, ext: number | null = null) {
        this._list.push({ 
            name: name, 
            symbol: symbol, 
            enabled: enabled, 
            ext: ext 
        });
    };

    commandName(index: number) {
        return this._list[index].name;
    };

    commandSymbol(index: number) {
        return this._list[index].symbol;
    };

    isCommandEnabled(index: number): boolean {
        return this._list[index].enabled;
    };

    currentData() {
        return this.index() >= 0 ? this._list[this.index()] : null;
    };

    isCurrentItemEnabled() {
        return this.currentData() ? this.currentData().enabled : false;
    };

    currentSymbol() {
        return this.currentData() ? this.currentData().symbol : null;
    };

    currentExt() {
        return this.currentData() ? this.currentData().ext : null;
    };

    findSymbol(symbol: string) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].symbol === symbol) {
                return i;
            }
        }
        return -1;
    };

    selectSymbol(symbol: string) {
        const index = this.findSymbol(symbol);
        if (index >= 0) {
            this.select(index);
        } else {
            this.select(0);
        }
    };

    findExt(ext: number) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].ext === ext) {
                return i;
            }
        }
        return -1;
    };

    selectExt(ext: number) {
        const index = this.findExt(ext);
        if (index >= 0) {
            this.select(index);
        } else {
            this.select(0);
        }
    };

    drawItem(index: number) {
        const rect = this.itemRectForText(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    };

    itemTextAlign() {
        return 'left';
    };

    isOkEnabled() {
        return true;
    };

    callOkHandler() {
        const symbol = this.currentSymbol();
        if (this.isHandled(symbol)) {
            this.callHandler(symbol);
        } else if (this.isHandled('ok')) {
            super.callOkHandler();
        } else {
            this.activate();
        }
    };

    refresh() {
        this.clearCommandList();
        this.makeCommandList();
        this.createContents();
        super.refresh();
    };

}

