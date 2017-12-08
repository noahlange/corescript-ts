import { Bitmap, Graphics, Input, TouchInput, WebAudio, Utils } from 'rpg_core';
import { Scene_Base, Scene_Shop } from 'rpg_scenes';

import AudioManager from './AudioManager';
import ImageManager from './ImageManager';
import PluginManager from './PluginManager';

//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.

export default class SceneManager {
    /*
    * Gets the current time in ms without on iOS Safari.
    * @private
    */
    protected static _getTimeInMsWithoutMobileSafari = function () {
        return performance.now();
    };

    protected static _scene: Scene_Base | null = null;
    protected static _nextScene: Scene_Base | null = null;
    protected static _stack: Function[] = [];
    protected static _stopped: boolean = false;
    protected static _sceneStarted: boolean = false;
    protected static _exiting: boolean = false;
    protected static _previousClass: Function = null;
    protected static _backgroundBitmap: Bitmap = null;
    protected static _screenWidth = 816;
    protected static _screenHeight = 624;
    protected static _boxWidth = 816;
    protected static _boxHeight = 624;
    protected static _deltaTime = 1.0 / 60.0;

    protected static _currentTime = SceneManager._getTimeInMsWithoutMobileSafari();
    protected static _accumulator = 0.0;

    static run(sceneClass: typeof Scene_Base) {
        try {
            this.initialize();
            this.goto(sceneClass);
            this.requestUpdate();
        } catch (e) {
            this.catchException(e);
        }
    };

    static initialize() {
        this.initGraphics();
        this.checkFileAccess();
        this.initAudio();
        this.initInput();
        this.initNwjs();
        this.checkPluginErrors();
        this.setupErrorHandlers();
    };

    static initGraphics() {
        Graphics.initialize(this._screenWidth, this._screenHeight);
        Graphics.boxWidth = this._boxWidth;
        Graphics.boxHeight = this._boxHeight;
        Graphics.setLoadingImage('img/system/Loading.png');
        if (Utils.isOptionValid('showfps')) {
            Graphics.showFps();
        }

        this.checkWebGL();
    };

    static shouldUseCanvasRenderer() {
        return false;
    };

    static checkWebGL() {
        if (!Graphics.hasWebGL()) {
            throw new Error('Your browser does not support WebGL.');
        }
    };

    static checkFileAccess() {
        if (!Utils.canReadGameFiles()) {
            throw new Error('Your browser does not allow to read local files.');
        }
    };

    static initAudio() {
        const noAudio = Utils.isOptionValid('noaudio');
        if (!WebAudio.initialize(noAudio) && !noAudio) {
            throw new Error('Your browser does not support Web Audio API.');
        }
    };

    static initInput() {
        Input.initialize();
        TouchInput.initialize();
    };

    static initNwjs() {
        if (Utils.isNwjs()) {
            let require = (window as any)['require']; // bungcip: changed to make it compile
            let process = (window as any)['process']; // bungcip: changed to make it compile

            const gui = require('nw.gui');
            const win = gui.Window.get();
            if (process.platform === 'darwin' && !win.menu) {
                const menubar = new gui.Menu({ type: 'menubar' });
                const option = { hideEdit: true, hideWindow: true };
                menubar.createMacBuiltin('Game', option);
                win.menu = menubar;
            }
        }
    };

    static checkPluginErrors() {
        PluginManager.checkErrors();
    };

    static setupErrorHandlers() {
        window.addEventListener('error', this.onError.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    };

    static requestUpdate() {
        if (!this._stopped) {
            requestAnimationFrame(this.update.bind(this));
        }
    };

    static update() {
        try {
            this.tickStart();
            this.updateManagers();
            this.updateMain();
            this.tickEnd();
        } catch (e) {
            this.catchException(e);
        }
    };

    static terminate() {
        window.close();
    };

    static onError(e: any) {
        console.error(e.message);
        console.error(e.filename, e.lineno);
        try {
            this.stop();
            Graphics.printError('Error', e.message);
            AudioManager.stopAll();
        } catch (e2) {
        }
    };

    static onKeyDown(event: any) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 116:   // F5
                    if (Utils.isNwjs()) {
                        location.reload();
                    }
                    break;
                case 119:   // F8
                    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                        let require = (window as any)['require']; // bungcip: changed to make it compile
                        require('nw.gui').Window.get().showDevTools();
                    }
                    break;
            }
        }
    };

    static catchException(e: any) {
        if (e instanceof Error) {
            Graphics.printError(e.name, e.message);
            console.error(e.stack);
        } else {
            Graphics.printError('UnknownError', e);
        }
        AudioManager.stopAll();
        this.stop();
    };

    static tickStart() {
        Graphics.tickStart();
    };

    static tickEnd() {
        Graphics.tickEnd();
    };

    static updateInputData() {
        Input.update();
        TouchInput.update();
    };

    static updateMain() {
        const newTime = this._getTimeInMsWithoutMobileSafari();
        let fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25){
            fTime = 0.25;
        } 
        this._currentTime = newTime;
        this._accumulator += fTime;
        while (this._accumulator >= this._deltaTime) {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._deltaTime;
        }
        this.renderScene();
        this.requestUpdate();
    };

    static updateManagers() {
        ImageManager.update();
    };

    static changeScene() {
        if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
            if (this._scene) {
                this._scene.terminate();
                this._scene.detachReservation();
                this._previousClass = this._scene.constructor;
            }
            this._scene = this._nextScene;
            if (this._scene) {
                this._scene.attachReservation();
                this._scene.create();
                this._nextScene = null;
                this._sceneStarted = false;
                this.onSceneCreate();
            }
            if (this._exiting) {
                this.terminate();
            }
        }
    };

    static updateScene() {
        if (this._scene) {
            if (!this._sceneStarted && this._scene.isReady()) {
                this._scene.start();
                this._sceneStarted = true;
                this.onSceneStart();
            }
            if (this.isCurrentSceneStarted()) {
                this._scene.update();
            }
        }
    };

    static renderScene() {
        if (this.isCurrentSceneStarted()) {
            Graphics.render(this._scene);
        } else if (this._scene) {
            this.onSceneLoading();
        }
    };

    static onSceneCreate() {
        Graphics.startLoading();
    };

    static onSceneStart() {
        Graphics.endLoading();
    };

    static onSceneLoading() {
        Graphics.updateLoading();
    };

    static isSceneChanging() {
        return this._exiting || !!this._nextScene;
    };

    static isCurrentSceneBusy() {
        return this._scene && this._scene.isBusy();
    };

    static isCurrentSceneStarted() {
        return this._scene && this._sceneStarted;
    };

    static isNextScene(sceneClass: Function) {
        return this._nextScene && this._nextScene.constructor === sceneClass;
    };

    static isPreviousScene(sceneClass: Function) {
        return this._previousClass === sceneClass;
    };

    static goto(sceneClass: typeof Scene_Base) {
        if (sceneClass) {
            this._nextScene = new sceneClass();
        }
        if (this._scene) {
            this._scene.stop();
        }
    };

    static push(sceneClass: typeof Scene_Base) {
        this._stack.push(this._scene.constructor);
        this.goto(sceneClass);
    };

    static pop() {
        if (this._stack.length > 0) {
            this.goto( (this._stack as any).pop());
        } else {
            this.exit();
        }
    };

    static exit() {
        this.goto(null);
        this._exiting = true;
    };

    static clearStack() {
        this._stack = [];
    };

    static stop() {
        this._stopped = true;
    };

    static prepareNextScene(...arg: any[]) {
        /// bungcip: prepare() only exist in Shop/NameInput
        (this._nextScene as Scene_Shop).prepare.apply(this._nextScene, arg);
    };

    static snap() {
        return Bitmap.snap(this._scene);
    };

    static snapForBackground() {
        this._backgroundBitmap = this.snap();
        this._backgroundBitmap.blur();
    };

    static backgroundBitmap() {
        return this._backgroundBitmap;
    };

    static resume() {
        this._stopped = false;
        this.requestUpdate();

        this._currentTime = this._getTimeInMsWithoutMobileSafari();
        this._accumulator = 0;
    };

}

