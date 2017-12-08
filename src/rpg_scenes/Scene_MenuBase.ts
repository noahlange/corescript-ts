import { Sprite } from 'rpg_core';
import { Game_Actor } from 'rpg_objects';
import { SceneManager } from 'rpg_managers';
import { Window_Help } from 'rpg_windows';

import Scene_Base from './Scene_Base';

//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.

export default class Scene_MenuBase extends Scene_Base {
    protected _actor: Game_Actor;
    protected _backgroundSprite: Sprite;
    protected _helpWindow: Window_Help;
    
    create() {
        super.create();
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
    };

    actor(): Game_Actor {
        return this._actor;
    };

    updateActor() {
        this._actor = $gameParty.menuActor();
    };

    createBackground() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);
    };

    setBackgroundOpacity(opacity: number) {
        this._backgroundSprite.opacity = opacity;
    };

    createHelpWindow() {
        this._helpWindow = new Window_Help();
        this.addWindow(this._helpWindow);
    };

    nextActor() {
        $gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    };

    previousActor() {
        $gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    };

    onActorChange() {
    };
}

