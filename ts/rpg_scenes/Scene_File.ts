//-----------------------------------------------------------------------------
// Scene_File
//
// The superclass of Scene_Save and Scene_Load.

class Scene_File extends Scene_MenuBase {
    protected _listWindow;
    protected _helpWindow;
    
    // initialize() {
    //     Scene_MenuBase.prototype.initialize.call(this);
    // };

    create() {
        Scene_MenuBase.prototype.create.call(this);
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createListWindow();
    };

    start() {
        Scene_MenuBase.prototype.start.call(this);
        this._listWindow.refresh();
    };

    savefileId() {
        return this._listWindow.index() + 1;
    };

    createHelpWindow() {
        this._helpWindow = new Window_Help(1);
        this._helpWindow.setText(this.helpWindowText());
        this.addWindow(this._helpWindow);
    };

    createListWindow() {
        var x = 0;
        var y = this._helpWindow.height;
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;
        this._listWindow = new Window_SavefileList(x, y, width, height);
        this._listWindow.setHandler('ok', this.onSavefileOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this._listWindow.select(this.firstSavefileIndex());
        this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
        this._listWindow.setMode(this.mode());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
    };

    mode() {
        return null;
    };

    activateListWindow() {
        this._listWindow.activate();
    };

    helpWindowText() {
        return '';
    };

    firstSavefileIndex() {
        return 0;
    };

    onSavefileOk() {
    };

}

