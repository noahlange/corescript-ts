//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.

class Scene_Load extends Scene_File {
    protected _loadSuccess;

    constructor() {
        super();
        this._loadSuccess = false;
    };
    
    terminate() {
        Scene_File.prototype.terminate.call(this);
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    };
    
    mode() {
        return 'load';
    };
    
    helpWindowText() {
        return TextManager.loadMessage;
    };
    
    firstSavefileIndex() {
        return DataManager.latestSavefileId() - 1;
    };
    
    onSavefileOk() {
        Scene_File.prototype.onSavefileOk.call(this);
        if (DataManager.loadGame(this.savefileId())) {
            this.onLoadSuccess();
        } else {
            this.onLoadFailure();
        }
    };
    
    onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    };
    
    onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    };
    
    reloadMapIfUpdated() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
            $gamePlayer.requestMapReload();
        }
    };
        
}


