(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.cs = global.cs || {})));
}(this, (function (exports) { 'use strict';

//-----------------------------------------------------------------------------
/**
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 *
 * @class JsExtensions
 */
/**
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @return {Number} A number in the range (min, max)
 */
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
/**
 * Returns a modulo value which is always positive.
 *
 * @method Number.prototype.mod
 * @param {Number} n The divisor
 * @return {Number} A modulo value
 */
Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};
/**
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args The objects to format
 * @return {String} A formatted string
 */
String.prototype.format = function () {
    const args = arguments;
    return this.replace(/%([0-9]+)/g, function (s, n) {
        return args[Number(n) - 1];
    });
};
/**
 * Makes a number string with leading zeros.
 *
 * @method String.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
String.prototype.padZero = function (length) {
    let s = this;
    while (s.length < length) {
        s = '0' + s;
    }
    return s;
};
/**
 * Makes a number string with leading zeros.
 *
 * @method Number.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
Number.prototype.padZero = function (length) {
    return String(this).padZero(length);
};
Object.defineProperties(Array.prototype, {
    /**
     * Checks whether the two arrays are same.
     *
     * @method Array.prototype.equals
     * @param {Array} array The array to compare to
     * @return {Boolean} True if the two arrays are same
     */
    equals: {
        enumerable: false,
        value: function (array) {
            if (!array || this.length !== array.length) {
                return false;
            }
            for (let i = 0; i < this.length; i++) {
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    if (!this[i].equals(array[i])) {
                        return false;
                    }
                }
                else if (this[i] !== array[i]) {
                    return false;
                }
            }
            return true;
        }
    },
    /**
     * Makes a shallow copy of the array.
     *
     * @method Array.prototype.clone
     * @return {Array} A shallow copy of the array
     */
    clone: {
        enumerable: false,
        value: function () {
            return this.slice(0);
        }
    },
    /**
     * Checks whether the array contains a given element.
     *
     * @method Array.prototype.contains
     * @param {Any} element The element to search for
     * @return {Boolean} True if the array contains a given element
     */
    contains: {
        enumerable: false,
        value: function (element) {
            return this.indexOf(element) >= 0;
        }
    }
});
/**
 * Checks whether the string contains a given string.
 *
 * @method String.prototype.contains
 * @param {String} string The string to search for
 * @return {Boolean} True if the string contains a given string
 */
String.prototype.contains = function (string) {
    return this.indexOf(string) >= 0;
};
/**
 * Generates a random integer in the range (0, max-1).
 *
 * @static
 * @method Math.randomInt
 * @param {Number} max The upper boundary (excluded)
 * @return {Number} A random integer
 */
Math.randomInt = function (max) {
    return Math.floor(max * Math.random());
};

//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class Stage
 * @constructor
 */
class Stage extends PIXI.Container {
    constructor() {
        super();
        // The interactive flag causes a memory leak.
        this.interactive = false;
    }
    ;
}

//-----------------------------------------------------------------------------
/**
 * The static class that defines utility methods.
 *
 * @class Utils
 */
class Utils {
    /**
     * Checks whether the option is in the query string.
     *
     * @static
     * @method isOptionValid
     * @param {String} name The option name
     * @return {Boolean} True if the option is in the query string
     */
    static isOptionValid(name) {
        return location.search.slice(1).split('&').contains(name);
    }
    ;
    /**
     * Checks whether the platform is NW.js.
     *
     * @static
     * @method isNwjs
     * @return {Boolean} True if the platform is NW.js
     */
    static isNwjs() {
        return !this.isElectron() && typeof window['require'] === 'function' && typeof window['process'] === 'object';
    }
    ;
    static isElectron() {
        let processOne = window.Process;
        let processTwo = window.process;
        if (typeof window !== 'undefined'
            && processOne
            && processOne.type === 'renderer') {
            return true;
        }
        if (typeof processTwo !== 'undefined'
            && processTwo.versions
            && !!processTwo.versions.electron) {
            return true;
        }
        return false;
    }
    /**
     * Checks whether the browser can read files in the game folder.
     *
     * @static
     * @method canReadGameFiles
     * @return {Boolean} True if the browser can read files in the game folder
     */
    static canReadGameFiles() {
        const scripts = document.getElementsByTagName('script');
        const lastScript = scripts[scripts.length - 1];
        const xhr = new XMLHttpRequest();
        try {
            xhr.open('GET', lastScript.src);
            xhr.overrideMimeType('text/javascript');
            xhr.send();
            return true;
        }
        catch (e) {
            return false;
        }
    }
    ;
    /**
     * Makes a CSS color string from RGB values.
     *
     * @static
     * @method rgbToCssColor
     * @param {Number} r The red value in the range (0, 255)
     * @param {Number} g The green value in the range (0, 255)
     * @param {Number} b The blue value in the range (0, 255)
     * @return {String} CSS color string
     */
    static rgbToCssColor(r, g, b) {
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    ;
    static generateRuntimeId() {
        return Utils._id++;
    }
    ;
    /**
     * Test this browser support passive event feature
     *
     * @static
     * @method isSupportPassiveEvent
     * @return {Boolean} this browser support passive event or not
     */
    static isSupportPassiveEvent() {
        if (typeof Utils._supportPassiveEvent === "boolean") {
            return Utils._supportPassiveEvent;
        }
        // test support passive event
        // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
        let passive = false;
        const options = Object.defineProperty({}, "passive", {
            get: function () { passive = true; }
        });
        window.addEventListener("test", null, options);
        Utils._supportPassiveEvent = passive;
        return passive;
    }
}
/**
 * The name of the RPG Maker. 'MV' in the current version.
 *
 * @static
 * @property RPGMAKER_NAME
 * @type String
 * @final
 */
Utils.RPGMAKER_NAME = 'MV';
/**
 * The version of the RPG Maker.
 *
 * @static
 * @property RPGMAKER_VERSION
 * @type String
 * @final
 */
Utils.RPGMAKER_VERSION = "1.4.1";
Utils.RPGMAKER_ENGINE = "community-1.2c";
Utils._id = 1;
Utils._supportPassiveEvent = null;

// import { SceneManager } from 'rpg_managers';
//-----------------------------------------------------------------------------
/**
 * The static class that handles resource loading.
 *
 * @class ResourceHandler
 */
class ResourceHandler {
    static createLoader(url, retryMethod, resignMethod, retryInterval) {
        retryInterval = retryInterval || this._defaultRetryInterval;
        const reloaders = this._reloaders;
        let retryCount = 0;
        return function () {
            if (retryCount < retryInterval.length) {
                setTimeout(retryMethod, retryInterval[retryCount]);
                retryCount++;
            }
            else {
                if (resignMethod) {
                    resignMethod();
                }
                if (url) {
                    if (reloaders.length === 0) {
                        Graphics.printLoadingError(url);
                        // SceneManager.stop();
                    }
                    reloaders.push(function () {
                        retryCount = 0;
                        retryMethod();
                    });
                }
            }
        };
    }
    ;
    static exists() {
        return this._reloaders.length > 0;
    }
    ;
    static retry() {
        if (this._reloaders.length > 0) {
            Graphics.eraseLoadingError();
            // SceneManager.resume();
            this._reloaders.forEach(function (reloader) {
                reloader();
            });
            this._reloaders.length = 0;
        }
    }
    ;
}
ResourceHandler._reloaders = [];
ResourceHandler._defaultRetryInterval = [500, 1000, 3000];

// import { SceneManager } from 'rpg_managers';
//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */
class Graphics {
    /**
     * Initializes the graphics system.
     *
     * @static
     * @method initialize
     * @param {Number} width The width of the game screen
     * @param {Number} height The height of the game screen
     */
    static initialize(width = 800, height = 800) {
        this._width = width;
        this._height = height;
        this._boxWidth = this._width;
        this._boxHeight = this._height;
        this._scale = 1;
        this._realScale = 1;
        this._errorShowed = false;
        this._errorPrinter = null;
        this._canvas = null;
        this._video = null;
        this._videoUnlocked = true;
        this._videoLoading = false;
        this._upperCanvas = null;
        this._renderer = null;
        this._fpsMeter = null;
        this._modeBox = null;
        this._skipCount = 0;
        this._maxSkip = 3;
        this._rendered = false;
        this._loadingImage = null;
        this._loadingCount = 0;
        this._fpsMeterToggled = false;
        this._stretchEnabled = this._defaultStretchMode();
        this._canUseDifferenceBlend = false;
        this._canUseSaturationBlend = false;
        this._hiddenCanvas = null;
        this._testCanvasBlendModes();
        this._modifyExistingElements();
        this._updateRealScale();
        this._createAllElements();
        this._disableTextSelection();
        this._disableContextMenu();
        this._setupEventHandlers();
        this._setupCssFontLoading();
    }
    ;
    static _setupCssFontLoading() {
        if (Graphics._cssFontLoading) {
            document.fonts.ready.then(function (fonts) {
                Graphics._fontLoaded = fonts;
            });
        }
    }
    ;
    static canUseCssFontLoading() {
        return !!this._cssFontLoading;
    }
    ;
    /**
     * Marks the beginning of each frame for FPSMeter.
     *
     * @static
     * @method tickStart
     */
    static tickStart() {
        if (this._fpsMeter) {
            this._fpsMeter.tickStart();
        }
    }
    ;
    /**
     * Marks the end of each frame for FPSMeter.
     *
     * @static
     * @method tickEnd
     */
    static tickEnd() {
        if (this._fpsMeter && this._rendered) {
            this._fpsMeter.tick();
        }
    }
    ;
    /**
     * Renders the stage to the game screen.
     *
     * @static
     * @method render
     * @param {Stage} stage The stage object to be rendered
     */
    static render(stage) {
        if (this._skipCount === 0) {
            const startTime = Date.now();
            if (stage) {
                this._renderer.render(stage);
                if (this._renderer.gl && this._renderer.gl.flush) {
                    this._renderer.gl.flush();
                }
            }
            const endTime = Date.now();
            const elapsed = endTime - startTime;
            this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
            this._rendered = true;
        }
        else {
            this._skipCount--;
            this._rendered = false;
        }
        this.frameCount++;
    }
    ;
    /**
     * Checks whether the current browser supports WebGL.
     *
     * @static
     * @method hasWebGL
     * @return {Boolean} True if the current browser supports WebGL.
     */
    static hasWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        }
        catch (e) {
            return false;
        }
    }
    ;
    /**
     * Checks whether the canvas blend mode 'difference' is supported.
     *
     * @static
     * @method canUseDifferenceBlend
     * @return {Boolean} True if the canvas blend mode 'difference' is supported
     */
    static canUseDifferenceBlend() {
        return this._canUseDifferenceBlend;
    }
    ;
    /**
     * Checks whether the canvas blend mode 'saturation' is supported.
     *
     * @static
     * @method canUseSaturationBlend
     * @return {Boolean} True if the canvas blend mode 'saturation' is supported
     */
    static canUseSaturationBlend() {
        return this._canUseSaturationBlend;
    }
    ;
    /**
     * Sets the source of the "Now Loading" image.
     *
     * @static
     * @method setLoadingImage
     */
    static setLoadingImage(src) {
        this._loadingImage = new Image();
        this._loadingImage.src = src;
    }
    ;
    /**
     * Initializes the counter for displaying the "Now Loading" image.
     *
     * @static
     * @method startLoading
     */
    static startLoading() {
        this._loadingCount = 0;
    }
    ;
    /**
     * Increments the loading counter and displays the "Now Loading" image if necessary.
     *
     * @static
     * @method updateLoading
     */
    static updateLoading() {
        this._loadingCount++;
        this._paintUpperCanvas();
        this._upperCanvas.style.opacity = 1;
    }
    ;
    /**
     * Erases the "Now Loading" image.
     *
     * @static
     * @method endLoading
     */
    static endLoading() {
        this._clearUpperCanvas();
        this._upperCanvas.style.opacity = 0;
    }
    ;
    /**
     * Displays the loading error text to the screen.
     *
     * @static
     * @method printLoadingError
     * @param {String} url The url of the resource failed to load
     */
    static printLoadingError(url) {
        if (this._errorPrinter && !this._errorShowed) {
            this._errorPrinter.innerHTML = this._makeErrorHtml('Loading Error', 'Failed to load: ' + url);
            const button = document.createElement('button');
            button.innerHTML = 'Retry';
            button.style.fontSize = '24px';
            button.style.color = '#ffffff';
            button.style.backgroundColor = '#000000';
            button.onmousedown = button.ontouchstart = function (event) {
                ResourceHandler.retry();
                event.stopPropagation();
            };
            this._errorPrinter.appendChild(button);
            this._loadingCount = -Infinity;
        }
    }
    ;
    /**
     * Erases the loading error text.
     *
     * @static
     * @method eraseLoadingError
     */
    static eraseLoadingError() {
        if (this._errorPrinter && !this._errorShowed) {
            this._errorPrinter.innerHTML = '';
            this.startLoading();
        }
    }
    ;
    /**
     * Displays the error text to the screen.
     *
     * @static
     * @method printError
     * @param {String} name The name of the error
     * @param {String} message The message of the error
     */
    static printError(name, message) {
        this._errorShowed = true;
        if (this._errorPrinter) {
            this._errorPrinter.innerHTML = this._makeErrorHtml(name, message);
        }
        this._applyCanvasFilter();
        this._clearUpperCanvas();
    }
    ;
    /**
     * Shows the FPSMeter element.
     *
     * @static
     * @method showFps
     */
    static showFps() {
        if (this._fpsMeter) {
            this._fpsMeter.show();
            this._modeBox.style.opacity = 1;
        }
    }
    ;
    /**
     * Hides the FPSMeter element.
     *
     * @static
     * @method hideFps
     */
    static hideFps() {
        if (this._fpsMeter) {
            this._fpsMeter.hide();
            this._modeBox.style.opacity = 0;
        }
    }
    ;
    /**
     * Loads a font file.
     *
     * @static
     * @method loadFont
     * @param {String} name The face name of the font
     * @param {String} url The url of the font file
     */
    static loadFont(name, url) {
        const style = document.createElement('style');
        const head = document.getElementsByTagName('head');
        const rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
        style.type = 'text/css';
        head.item(0).appendChild(style);
        style.sheet.insertRule(rule, 0);
        this._createFontLoader(name);
    }
    ;
    /**
     * Checks whether the font file is loaded.
     *
     * @static
     * @method isFontLoaded
     * @param {String} name The face name of the font
     * @return {Boolean} True if the font file is loaded
     */
    static isFontLoaded(name) {
        if (Graphics._cssFontLoading) {
            if (Graphics._fontLoaded) {
                return Graphics._fontLoaded.check('10px "' + name + '"');
            }
            return false;
        }
        else {
            if (!this._hiddenCanvas) {
                this._hiddenCanvas = document.createElement('canvas');
            }
            const context = this._hiddenCanvas.getContext('2d');
            const text = 'abcdefghijklmnopqrstuvwxyz';
            let width1, width2;
            context.font = '40px ' + name + ', sans-serif';
            width1 = context.measureText(text).width;
            context.font = '40px sans-serif';
            width2 = context.measureText(text).width;
            return width1 !== width2;
        }
    }
    ;
    static playVideo(src) {
        this._videoLoader = ResourceHandler.createLoader(null, this._playVideo.bind(this, src), this._onVideoError.bind(this));
        this._playVideo(src);
    }
    ;
    /**
     * @static
     * @method _playVideo
     * @param {String} src
     * @private
     */
    static _playVideo(src) {
        this._video.src = src;
        this._video.onloadeddata = this._onVideoLoad.bind(this);
        this._video.onerror = this._videoLoader;
        this._video.onended = this._onVideoEnd.bind(this);
        this._video.load();
        this._videoLoading = true;
    }
    ;
    /**
     * Checks whether the video is playing.
     *
     * @static
     * @method isVideoPlaying
     * @return {Boolean} True if the video is playing
     */
    static isVideoPlaying() {
        return this._videoLoading || this._isVideoVisible();
    }
    ;
    /**
     * Checks whether the browser can play the specified video type.
     *
     * @static
     * @method canPlayVideoType
     * @param {String} type The video type to test support for
     * @return {Boolean} True if the browser can play the specified video type
     */
    static canPlayVideoType(type) {
        return this._video && this._video.canPlayType(type);
    }
    ;
    /**
     * Sets volume of a video.
     *
     * @static
     * @method setVideoVolume
     * @param {Number} value
     */
    static setVideoVolume(value) {
        this._videoVolume = value;
        if (this._video) {
            this._video.volume = this._videoVolume;
        }
    }
    ;
    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasX
     * @param {Number} x The x coordinate on the page to be converted
     * @return {Number} The x coordinate on the canvas area
     */
    static pageToCanvasX(x) {
        if (this._canvas) {
            const left = this._canvas.offsetLeft;
            return Math.round((x - left) / this._realScale);
        }
        else {
            return 0;
        }
    }
    ;
    /**
     * Converts a y coordinate on the page to the corresponding
     * y coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasY
     * @param {Number} y The y coordinate on the page to be converted
     * @return {Number} The y coordinate on the canvas area
     */
    static pageToCanvasY(y) {
        if (this._canvas) {
            const top = this._canvas.offsetTop;
            return Math.round((y - top) / this._realScale);
        }
        else {
            return 0;
        }
    }
    ;
    /**
     * Checks whether the specified point is inside the game canvas area.
     *
     * @static
     * @method isInsideCanvas
     * @param {Number} x The x coordinate on the canvas area
     * @param {Number} y The y coordinate on the canvas area
     * @return {Boolean} True if the specified point is inside the game canvas area
     */
    static isInsideCanvas(x, y) {
        return (x >= 0 && x < this._width && y >= 0 && y < this._height);
    }
    ;
    /**
     * Calls pixi.js garbage collector
     */
    static callGC() {
        Graphics._renderer.textureGC.run();
    }
    ;
    /**
     * The width of the game screen.
     *
     * @static
     * @property width
     * @type Number
     */
    static get width() {
        return this._width;
    }
    static set width(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    }
    /**
     * The height of the game screen.
     *
     * @static
     * @property height
     * @type Number
     */
    static get height() {
        return this._height;
    }
    static set height(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    }
    /**
     * The width of the window display area.
     *
     * @static
     * @property boxWidth
     * @type Number
     */
    static get boxWidth() {
        return this._boxWidth;
    }
    static set boxWidth(value) {
        this._boxWidth = value;
    }
    /**
     * The height of the window display area.
     *
     * @static
     * @property boxHeight
     * @type Number
     */
    static get boxHeight() {
        return this._boxHeight;
    }
    static set boxHeight(value) {
        this._boxHeight = value;
    }
    /**
     * The zoom scale of the game screen.
     *
     * @static
     * @property scale
     * @type Number
     */
    static get scale() {
        return this._scale;
    }
    static set scale(value) {
        if (this._scale !== value) {
            this._scale = value;
            this._updateAllElements();
        }
    }
    /**
     * @static
     * @method _createAllElements
     * @private
     */
    static _createAllElements() {
        this._createErrorPrinter();
        this._createCanvas();
        this._createVideo();
        this._createUpperCanvas();
        this._createRenderer();
        this._createFPSMeter();
        this._createModeBox();
        this._createGameFontLoader();
    }
    ;
    /**
     * @static
     * @method _updateAllElements
     * @private
     */
    static _updateAllElements() {
        this._updateRealScale();
        this._updateErrorPrinter();
        this._updateCanvas();
        this._updateVideo();
        this._updateUpperCanvas();
        this._updateRenderer();
        this._paintUpperCanvas();
    }
    ;
    /**
     * @static
     * @method _updateRealScale
     * @private
     */
    static _updateRealScale() {
        if (this._stretchEnabled) {
            const h = window.innerWidth / this._width;
            const v = window.innerHeight / this._height;
            this._realScale = Math.min(h, v);
        }
        else {
            this._realScale = this._scale;
        }
    }
    ;
    /**
     * @static
     * @method _makeErrorHtml
     * @param {String} name
     * @param {String} message
     * @return {String}
     * @private
     */
    static _makeErrorHtml(name, message) {
        return ('<font color="yellow"><b>' + name + '</b></font><br>' +
            '<font color="white">' + message + '</font><br>');
    }
    ;
    /**
     * @static
     * @method _defaultStretchMode
     * @private
     */
    static _defaultStretchMode() {
        return Utils.isNwjs();
    }
    ;
    /**
     * @static
     * @method _testCanvasBlendModes
     * @private
     */
    static _testCanvasBlendModes() {
        let canvas, context, imageData1, imageData2;
        canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        context = canvas.getContext('2d');
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = 'white';
        context.fillRect(0, 0, 1, 1);
        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, 1, 1);
        imageData1 = context.getImageData(0, 0, 1, 1);
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = 'black';
        context.fillRect(0, 0, 1, 1);
        context.globalCompositeOperation = 'saturation';
        context.fillStyle = 'white';
        context.fillRect(0, 0, 1, 1);
        imageData2 = context.getImageData(0, 0, 1, 1);
        this._canUseDifferenceBlend = imageData1.data[0] === 0;
        this._canUseSaturationBlend = imageData2.data[0] === 0;
    }
    ;
    /**
     * @static
     * @method _modifyExistingElements
     * @private
     */
    static _modifyExistingElements() {
        const elements = document.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            /// bungcip: diubah agar bisa dicompile
            if (elements[i].style.zIndex > 0) {
                elements[i].style.zIndex = 0;
            }
        }
    }
    ;
    /**
     * @static
     * @method _createErrorPrinter
     * @private
     */
    static _createErrorPrinter() {
        this._errorPrinter = document.createElement('p');
        this._errorPrinter.id = 'ErrorPrinter';
        this._updateErrorPrinter();
        document.body.appendChild(this._errorPrinter);
    }
    ;
    /**
     * @static
     * @method _updateErrorPrinter
     * @private
     */
    static _updateErrorPrinter() {
        this._errorPrinter.width = this._width * 0.9;
        this._errorPrinter.height = 40;
        this._errorPrinter.style.textAlign = 'center';
        this._errorPrinter.style.textShadow = '1px 1px 3px #000';
        this._errorPrinter.style.fontSize = '20px';
        this._errorPrinter.style.zIndex = 99;
        this._centerElement(this._errorPrinter);
    }
    ;
    /**
     * @static
     * @method _createCanvas
     * @private
     */
    static _createCanvas() {
        this._canvas = document.createElement('canvas');
        this._canvas.id = 'GameCanvas';
        this._updateCanvas();
        document.body.appendChild(this._canvas);
    }
    ;
    /**
     * @static
     * @method _updateCanvas
     * @private
     */
    static _updateCanvas() {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.zIndex = 1;
        this._centerElement(this._canvas);
    }
    ;
    /**
     * @static
     * @method _createVideo
     * @private
     */
    static _createVideo() {
        this._video = document.createElement('video');
        this._video.id = 'GameVideo';
        this._video.style.opacity = 0;
        this._video.setAttribute('playsinline', '');
        this._video.volume = this._videoVolume;
        this._updateVideo();
        makeVideoPlayableInline(this._video);
        document.body.appendChild(this._video);
    }
    ;
    /**
     * @static
     * @method _updateVideo
     * @private
     */
    static _updateVideo() {
        this._video.width = this._width;
        this._video.height = this._height;
        this._video.style.zIndex = 2;
        this._centerElement(this._video);
    }
    ;
    /**
     * @static
     * @method _createUpperCanvas
     * @private
     */
    static _createUpperCanvas() {
        this._upperCanvas = document.createElement('canvas');
        this._upperCanvas.id = 'UpperCanvas';
        this._updateUpperCanvas();
        document.body.appendChild(this._upperCanvas);
    }
    ;
    /**
     * @static
     * @method _updateUpperCanvas
     * @private
     */
    static _updateUpperCanvas() {
        this._upperCanvas.width = this._width;
        this._upperCanvas.height = this._height;
        this._upperCanvas.style.zIndex = 3;
        this._centerElement(this._upperCanvas);
    }
    ;
    /**
     * @static
     * @method _clearUpperCanvas
     * @private
     */
    static _clearUpperCanvas() {
        const context = this._upperCanvas.getContext('2d');
        context.clearRect(0, 0, this._width, this._height);
    }
    ;
    /**
     * @static
     * @method _paintUpperCanvas
     * @private
     */
    static _paintUpperCanvas() {
        this._clearUpperCanvas();
        if (this._loadingImage && this._loadingCount >= 20) {
            const context = this._upperCanvas.getContext('2d');
            const dx = (this._width - this._loadingImage.width) / 2;
            const dy = (this._height - this._loadingImage.height) / 2;
            const alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
            context.save();
            context.globalAlpha = alpha;
            context.drawImage(this._loadingImage, dx, dy);
            context.restore();
        }
    }
    ;
    /**
     * @static
     * @method _createRenderer
     * @private
     */
    static _createRenderer() {
        // PIXI.dontSayHello = true;
        const width = this._width;
        const height = this._height;
        const options = { view: this._canvas };
        try {
            this._renderer = new PIXI.WebGLRenderer(width, height, options);
            if (this._renderer && this._renderer.textureGC) {
                this._renderer.textureGC.maxIdle = 1;
            }
        }
        catch (e) {
            this._renderer = null;
        }
    }
    ;
    /**
     * @static
     * @method _updateRenderer
     * @private
     */
    static _updateRenderer() {
        if (this._renderer) {
            this._renderer.resize(this._width, this._height);
        }
    }
    ;
    /**
     * @static
     * @method _createFPSMeter
     * @private
     */
    static _createFPSMeter() {
        const options = { graph: 1, decimals: 0, theme: 'transparent', toggleOn: null };
        this._fpsMeter = new FPSMeter(options);
        this._fpsMeter.hide();
    }
    ;
    /**
     * @static
     * @method _createModeBox
     * @private
     */
    static _createModeBox() {
        const box = document.createElement('div');
        box.id = 'modeTextBack';
        box.style.position = 'absolute';
        box.style.left = '5px';
        box.style.top = '5px';
        box.style.width = '119px';
        box.style.height = '58px';
        box.style.background = 'rgba(0,0,0,0.2)';
        box.style.zIndex = '9';
        box.style.opacity = '0';
        const text = document.createElement('div');
        text.id = 'modeText';
        text.style.position = 'absolute';
        text.style.left = '0px';
        text.style.top = '41px';
        text.style.width = '119px';
        text.style.fontSize = '12px';
        text.style.fontFamily = 'monospace';
        text.style.color = 'white';
        text.style.textAlign = 'center';
        text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';
        text.innerHTML = 'WebGL mode';
        document.body.appendChild(box);
        box.appendChild(text);
        this._modeBox = box;
    }
    ;
    /**
     * @static
     * @method _createGameFontLoader
     * @private
     */
    static _createGameFontLoader() {
        this._createFontLoader('GameFont');
    }
    ;
    /**
     * @static
     * @method _createFontLoader
     * @param {String} name
     * @private
     */
    static _createFontLoader(name) {
        const div = document.createElement('div');
        const text = document.createTextNode('.');
        div.style.fontFamily = name;
        div.style.fontSize = '0px';
        div.style.color = 'transparent';
        div.style.position = 'absolute';
        div.style.margin = 'auto';
        div.style.top = '0px';
        div.style.left = '0px';
        div.style.width = '1px';
        div.style.height = '1px';
        div.appendChild(text);
        document.body.appendChild(div);
    }
    ;
    /**
     * @static
     * @method _centerElement
     * @param {HTMLElement} element
     * @private
     */
    static _centerElement(element) {
        const width = element['width'] * this._realScale;
        const height = element['height'] * this._realScale;
        element.style.position = 'absolute';
        element.style.margin = 'auto';
        element.style.top = '0';
        element.style.left = '0';
        element.style.right = '0';
        element.style.bottom = '0';
        element.style.width = width + 'px';
        element.style.height = height + 'px';
    }
    ;
    /**
     * @static
     * @method _disableTextSelection
     * @private
     */
    static _disableTextSelection() {
        const body = document.body;
        body.style.userSelect = 'none';
        body.style.webkitUserSelect = 'none';
        body.style.msUserSelect = 'none';
        // body.style.mozUserSelect = 'none';
    }
    ;
    /**
     * @static
     * @method _disableContextMenu
     * @private
     */
    static _disableContextMenu() {
        const elements = document.body.getElementsByTagName('*');
        const oncontextmenu = () => false;
        for (let i = 0; i < elements.length; i++) {
            elements[i]['oncontextmenu'] = oncontextmenu;
        }
    }
    ;
    /**
     * @static
     * @method _applyCanvasFilter
     * @private
     */
    static _applyCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = 0.5;
            this._canvas.style.filter = 'blur(8px)';
            this._canvas.style.webkitFilter = 'blur(8px)';
        }
    }
    ;
    /**
     * @static
     * @method _onVideoLoad
     * @private
     */
    static _onVideoLoad() {
        this._video.play();
        this._updateVisibility(true);
        this._videoLoading = false;
    }
    ;
    /**
     * @static
     * @method _onVideoError
     * @private
     */
    static _onVideoError() {
        this._updateVisibility(false);
        this._videoLoading = false;
    }
    ;
    /**
     * @static
     * @method _onVideoEnd
     * @private
     */
    static _onVideoEnd() {
        this._updateVisibility(false);
    }
    ;
    /**
     * @static
     * @method _updateVisibility
     * @param {Boolean} videoVisible
     * @private
     */
    static _updateVisibility(videoVisible) {
        this._video.style.opacity = videoVisible ? 1 : 0;
        this._canvas.style.opacity = videoVisible ? 0 : 1;
    }
    ;
    /**
     * @static
     * @method _isVideoVisible
     * @return {Boolean}
     * @private
     */
    static _isVideoVisible() {
        return this._video.style.opacity > 0;
    }
    ;
    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    static _setupEventHandlers() {
        window.addEventListener('resize', this._onWindowResize.bind(this));
        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('touchend', this._onTouchEnd.bind(this));
    }
    ;
    /**
     * @static
     * @method _onWindowResize
     * @private
     */
    static _onWindowResize() {
        this._updateAllElements();
    }
    ;
    /**
     * @static
     * @method _onKeyDown
     * @param {KeyboardEvent} event
     * @private
     */
    static _onKeyDown(event) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 113:// F2
                    event.preventDefault();
                    this._switchFPSMeter();
                    break;
                case 114:// F3
                    event.preventDefault();
                    this._switchStretchMode();
                    break;
                case 115:// F4
                    event.preventDefault();
                    this._switchFullScreen();
                    break;
            }
        }
    }
    ;
    /**
     * @static
     * @method _onTouchEnd
     * @param {TouchEvent} event
     * @private
     */
    static _onTouchEnd(event) {
        if (!this._videoUnlocked) {
            this._video.play();
            this._videoUnlocked = true;
        }
        if (this._isVideoVisible() && this._video.paused) {
            this._video.play();
        }
    }
    ;
    /**
     * @static
     * @method _switchFPSMeter
     * @private
     */
    static _switchFPSMeter() {
        if (this._fpsMeter.isPaused) {
            this.showFps();
            this._fpsMeter.showFps();
            this._fpsMeterToggled = false;
        }
        else if (!this._fpsMeterToggled) {
            this._fpsMeter.showDuration();
            this._fpsMeterToggled = true;
        }
        else {
            this.hideFps();
        }
    }
    ;
    /**
     * @static
     * @method _switchStretchMode
     * @private
     */
    static _switchStretchMode() {
        this._stretchEnabled = !this._stretchEnabled;
        this._updateAllElements();
    }
    ;
    /**
     * @static
     * @method _switchFullScreen
     * @private
     */
    static _switchFullScreen() {
        if (this._isFullScreen()) {
            this._cancelFullScreen();
        }
        else {
            this._requestFullScreen();
        }
    }
    ;
    /**
     * @static
     * @method _isFullScreen
     * @return {Boolean}
     * @private
     */
    static _isFullScreen() {
        return (document.fullscreenElement ||
            document.mozFullScreen ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement) !== null;
    }
    ;
    /**
     * @static
     * @method _requestFullScreen
     * @private
     */
    static _requestFullScreen() {
        const element = document.body;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    }
    ;
    /**
     * @static
     * @method _cancelFullScreen
     * @private
     */
    static _cancelFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    ;
}
Graphics._cssFontLoading = document.fonts && document.fonts.ready;
Graphics._fontLoaded = null;
Graphics._videoVolume = 1;
/**
 * The total frame count of the game screen.
 *
 * @static
 * @property frameCount
 * @type Number
 */
Graphics.frameCount = 0;
/**
 * The alias of PIXI.blendModes.ADD.
 *
 * @static
 * @property BLEND_ADD
 * @type Number
 * @final
 */
Graphics.BLEND_ADD = 1;
/**
 * Starts playback of a video.
 *
 * @static
 * @method playVideo
 * @param {String} src
 */
Graphics._videoLoader = null;

//-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 *
 * @class Bitmap
 * @constructor
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
 */
class Bitmap {
    constructor(width, height, defer = false) {
        if (!defer) {
            this._createCanvas(width, height);
        }
        this._image = null;
        this._url = '';
        this._paintOpacity = 255;
        this._smooth = false;
        this._loadListeners = [];
        this._loadingState = 'none';
        this._decodeAfterRequest = false;
        this.cacheEntry = null;
        this.fontFace = 'GameFont';
        this.fontSize = 28;
        this.fontItalic = false;
        this.textColor = '#ffffff';
        /**
         * The color of the outline of the text in CSS format.
         *
         * @property outlineColor
         * @type String
         */
        this.outlineColor = 'rgba(0, 0, 0, 0.5)';
        /**
         * The width of the outline of the text.
         *
         * @property outlineWidth
         * @type Number
         */
        this.outlineWidth = 4;
    }
    /**
     * Bitmap states(Bitmap._loadingState):
     *
     * none:
     * Empty Bitmap
     *
     * pending:
     * Url requested, but pending to load until startRequest called
     *
     * purged:
     * Url request completed and purged.
     *
     * requesting:
     * Requesting supplied URI now.
     *
     * requestCompleted:
     * Request completed
     *
     * loaded:
     * loaded. isReady() === true, so It's usable.
     *
     * error:
     * error occurred
     *
     */
    _createCanvas(width = 0, height = 0) {
        this.__canvas = this.__canvas || document.createElement('canvas');
        this.__context = this.__canvas.getContext('2d');
        this.__canvas.width = Math.max(width, 1);
        this.__canvas.height = Math.max(height, 1);
        if (this._image) {
            const w = Math.max(this._image.width || 0, 1);
            const h = Math.max(this._image.height || 0, 1);
            this.__canvas.width = w;
            this.__canvas.height = h;
            this._createBaseTexture(this._canvas);
            this.__context.drawImage(this._image, 0, 0);
        }
        this._setDirty();
    }
    _createBaseTexture(source) {
        this.__baseTexture = new PIXI.BaseTexture(source);
        this.__baseTexture.mipmap = false;
        this.__baseTexture.width = source.width;
        this.__baseTexture.height = source.height;
        if (this._smooth) {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        }
        else {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
    }
    ;
    _clearImgInstance() {
        this._image.src = "";
        this._image.onload = null;
        this._image.onerror = null;
        this._errorListener = null;
        this._loadListener = null;
        Bitmap._reuseImages.push(this._image);
        this._image = null;
    }
    ;
    //
    //We don't want to waste memory, so creating canvas is deferred.
    //
    get _canvas() {
        if (!this.__canvas)
            this._createCanvas();
        return this.__canvas;
    }
    get _context() {
        if (!this.__context)
            this._createCanvas();
        return this.__context;
    }
    get _baseTexture() {
        if (!this.__baseTexture)
            this._createBaseTexture(this._image || this.__canvas);
        return this.__baseTexture;
    }
    _renewCanvas() {
        const newImage = this._image;
        if (newImage && this.__canvas && (this.__canvas.width < newImage.width || this.__canvas.height < newImage.height)) {
            this._createCanvas();
        }
    }
    ;
    ;
    /**
     * Loads a image file and returns a new bitmap object.
     *
     * @static
     * @method load
     * @param {String} url The image url of the texture
     * @return Bitmap
     */
    static load(url) {
        let bitmap = new Bitmap(undefined, undefined, true);
        bitmap._decodeAfterRequest = true;
        bitmap._requestImage(url);
        return bitmap;
    }
    ;
    /**
     * Takes a snapshot of the game screen and returns a new bitmap object.
     *
     * @static
     * @method snap
     * @param {Stage} stage The stage object
     * @return Bitmap
     */
    static snap(stage) {
        const width = Graphics.width;
        const height = Graphics.height;
        const bitmap = new Bitmap(width, height);
        const context = bitmap._context;
        const renderTexture = PIXI.RenderTexture.create(width, height);
        if (stage) {
            Graphics._renderer.render(stage, renderTexture);
            stage.worldTransform.identity();
            // let canvas = null;
            const canvas = Graphics._renderer.extract.canvas(renderTexture);
            context.drawImage(canvas, 0, 0);
        }
        else {
        }
        renderTexture.destroy({ destroyBase: true }); /// bungcip: pixi 4.5 use boolean....
        bitmap._setDirty();
        return bitmap;
    }
    ;
    /**
     * Checks whether the bitmap is ready to render.
     *
     * @method isReady
     * @return {Boolean} True if the bitmap is ready to render
     */
    isReady() {
        return this._loadingState === 'loaded' || this._loadingState === 'none';
    }
    ;
    /**
     * Checks whether a loading error has occurred.
     *
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    isError() {
        return this._loadingState === 'error';
    }
    ;
    /**
     * touch the resource
     * @method touch
     */
    touch() {
        if (this.cacheEntry) {
            this.cacheEntry.touch();
        }
    }
    ;
    /**
     * [read-only] The url of the image file.
     *
     * @property url
     * @type String
     */
    get url() {
        return this._url;
    }
    /**
     * [read-only] The base texture that holds the image.
     *
     * @property baseTexture
     * @type PIXI.BaseTexture
     */
    get baseTexture() {
        return this._baseTexture;
    }
    /**
     * [read-only] The bitmap canvas.
     *
     * @property canvas
     * @type HTMLCanvasElement
     */
    get canvas() {
        return this._canvas;
    }
    /**
     * [read-only] The 2d context of the bitmap canvas.
     *
     * @property context
     * @type CanvasRenderingContext2D
     */
    get context() {
        return this._context;
    }
    /**
     * [read-only] The width of the bitmap.
     *
     * @property width
     * @type Number
     */
    get width() {
        if (this.isReady()) {
            return this._image ? this._image.width : this._canvas.width;
        }
        return 0;
    }
    /**
     * [read-only] The height of the bitmap.
     *
     * @property height
     * @type Number
     */
    get height() {
        if (this.isReady()) {
            return this._image ? this._image.height : this._canvas.height;
        }
        return 0;
    }
    /**
     * [read-only] The rectangle of the bitmap.
     *
     * @property rect
     * @type Rectangle
     */
    get rect() {
        return new PIXI.Rectangle(0, 0, this.width, this.height);
    }
    get smooth() {
        return this._smooth;
    }
    set smooth(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            if (this.__baseTexture) {
                if (this._smooth) {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
                }
                else {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                }
            }
        }
    }
    get paintOpacity() {
        return this._paintOpacity;
    }
    set paintOpacity(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this._context.globalAlpha = this._paintOpacity / 255;
        }
    }
    /**
     * Resizes the bitmap.
     *
     * @method resize
     * @param {Number} width The new width of the bitmap
     * @param {Number} height The new height of the bitmap
     */
    resize(width = 0, height = 0) {
        width = Math.max(width || 0, 1);
        height = Math.max(height || 0, 1);
        this._canvas.width = width;
        this._canvas.height = height;
        this._baseTexture.width = width;
        this._baseTexture.height = height;
    }
    ;
    /**
     * Performs a block transfer.
     *
     * @method blt
     * @param {Bitmap} source The bitmap to draw
     * @param {Number} sx The x coordinate in the source
     * @param {Number} sy The y coordinate in the source
     * @param {Number} sw The width of the source image
     * @param {Number} sh The height of the source image
     * @param {Number} dx The x coordinate in the destination
     * @param {Number} dy The y coordinate in the destination
     * @param {Number} [dw=sw] The width to draw the image in the destination
     * @param {Number} [dh=sh] The height to draw the image in the destination
     */
    blt(source, sx, sy, sw, sh, dx, dy, dw = sw, dh = sh) {
        // dw = dw || sw;
        // dh = dh || sh;
        if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
            sx + sw <= source.width && sy + sh <= source.height) {
            this._context.globalCompositeOperation = 'source-over';
            this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
            this._setDirty();
        }
    }
    ;
    /**
     * Performs a block transfer, using assumption that original image was not modified (no hue)
     *
     * @method blt
     * @param {Bitmap} source The bitmap to draw
     * @param {Number} sx The x coordinate in the source
     * @param {Number} sy The y coordinate in the source
     * @param {Number} sw The width of the source image
     * @param {Number} sh The height of the source image
     * @param {Number} dx The x coordinate in the destination
     * @param {Number} dy The y coordinate in the destination
     * @param {Number} [dw=sw] The width to draw the image in the destination
     * @param {Number} [dh=sh] The height to draw the image in the destination
     */
    bltImage(source, sx, sy, sw, sh, dx, dy, dw = sw, dh = sh) {
        // dw = dw || sw;
        // dh = dh || sh;
        if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
            sx + sw <= source.width && sy + sh <= source.height) {
            this._context.globalCompositeOperation = 'source-over';
            this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
            this._setDirty();
        }
    }
    ;
    /**
     * Returns pixel color at the specified point.
     *
     * @method getPixel
     * @param {Number} x The x coordinate of the pixel in the bitmap
     * @param {Number} y The y coordinate of the pixel in the bitmap
     * @return {String} The pixel color (hex format)
     */
    getPixel(x, y) {
        const data = this._context.getImageData(x, y, 1, 1).data;
        let result = '#';
        for (let i = 0; i < 3; i++) {
            result += data[i].toString(16).padZero(2);
        }
        return result;
    }
    ;
    /**
     * Returns alpha pixel value at the specified point.
     *
     * @method getAlphaPixel
     * @param {Number} x The x coordinate of the pixel in the bitmap
     * @param {Number} y The y coordinate of the pixel in the bitmap
     * @return {String} The alpha value
     */
    getAlphaPixel(x, y) {
        const data = this._context.getImageData(x, y, 1, 1).data;
        return data[3];
    }
    ;
    /**
     * Clears the specified rectangle.
     *
     * @method clearRect
     * @param {Number} x The x coordinate for the upper-left corner
     * @param {Number} y The y coordinate for the upper-left corner
     * @param {Number} width The width of the rectangle to clear
     * @param {Number} height The height of the rectangle to clear
     */
    clearRect(x, y, width, height) {
        this._context.clearRect(x, y, width, height);
        this._setDirty();
    }
    ;
    /**
     * Clears the entire bitmap.
     *
     * @method clear
     */
    clear() {
        this.clearRect(0, 0, this.width, this.height);
    }
    ;
    /**
     * Fills the specified rectangle.
     *
     * @method fillRect
     * @param {Number} x The x coordinate for the upper-left corner
     * @param {Number} y The y coordinate for the upper-left corner
     * @param {Number} width The width of the rectangle to fill
     * @param {Number} height The height of the rectangle to fill
     * @param {String} color The color of the rectangle in CSS format
     */
    fillRect(x, y, width, height, color) {
        const context = this._context;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
        this._setDirty();
    }
    ;
    /**
     * Fills the entire bitmap.
     *
     * @method fillAll
     * @param {String} color The color of the rectangle in CSS format
     */
    fillAll(color) {
        this.fillRect(0, 0, this.width, this.height, color);
    }
    ;
    /**
     * Draws the rectangle with a gradation.
     *
     * @method gradientFillRect
     * @param {Number} x The x coordinate for the upper-left corner
     * @param {Number} y The y coordinate for the upper-left corner
     * @param {Number} width The width of the rectangle to fill
     * @param {Number} height The height of the rectangle to fill
     * @param {String} color1 The gradient starting color
     * @param {String} color2 The gradient ending color
     * @param {Boolean} vertical Wether the gradient should be draw as vertical or not
     */
    gradientFillRect(x, y, width, height, color1, color2, vertical = false) {
        const context = this._context;
        let grad;
        if (vertical) {
            grad = context.createLinearGradient(x, y, x, y + height);
        }
        else {
            grad = context.createLinearGradient(x, y, x + width, y);
        }
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        context.save();
        context.fillStyle = grad;
        context.fillRect(x, y, width, height);
        context.restore();
        this._setDirty();
    }
    ;
    /**
     * Draw a bitmap in the shape of a circle
     *
     * @method drawCircle
     * @param {Number} x The x coordinate based on the circle center
     * @param {Number} y The y coordinate based on the circle center
     * @param {Number} radius The radius of the circle
     * @param {String} color The color of the circle in CSS format
     */
    drawCircle(x, y, radius, color) {
        const context = this._context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        this._setDirty();
    }
    ;
    /**
     * Draws the outline text to the bitmap.
     *
     * @method drawText
     * @param {String} text The text that will be drawn
     * @param {Number} x The x coordinate for the left of the text
     * @param {Number} y The y coordinate for the top of the text
     * @param {Number} maxWidth The maximum allowed width of the text
     * @param {Number} lineHeight The height of the text line
     * @param {String} align The alignment of the text
     */
    drawText(text, x, y, maxWidth, lineHeight, align) {
        // Note: Firefox has a bug with textBaseline: Bug 737852
        //       So we use 'alphabetic' here.
        if (text !== undefined) {
            let tx = x;
            const ty = y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;
            const context = this._context;
            const alpha = context.globalAlpha;
            maxWidth = maxWidth || 0xffffffff;
            if (align === 'center') {
                tx += maxWidth / 2;
            }
            if (align === 'right') {
                tx += maxWidth;
            }
            context.save();
            context.font = this._makeFontNameText();
            context.textAlign = align;
            context.textBaseline = 'alphabetic';
            context.globalAlpha = 1;
            this._drawTextOutline(text, tx, ty, maxWidth);
            context.globalAlpha = alpha;
            this._drawTextBody(text, tx, ty, maxWidth);
            context.restore();
            this._setDirty();
        }
    }
    ;
    /**
     * Returns the width of the specified text.
     *
     * @method measureTextWidth
     * @param {String} text The text to be measured
     * @return {Number} The width of the text in pixels
     */
    measureTextWidth(text) {
        const context = this._context;
        context.save();
        context.font = this._makeFontNameText();
        const width = context.measureText(text).width;
        context.restore();
        return width;
    }
    ;
    /**
     * Changes the color tone of the entire bitmap.
     *
     * @method adjustTone
     * @param {Number} r The red strength in the range (-255, 255)
     * @param {Number} g The green strength in the range (-255, 255)
     * @param {Number} b The blue strength in the range (-255, 255)
     */
    adjustTone(r, g, b) {
        if ((r || g || b) && this.width > 0 && this.height > 0) {
            const context = this._context;
            const imageData = context.getImageData(0, 0, this.width, this.height);
            const pixels = imageData.data;
            for (let i = 0; i < pixels.length; i += 4) {
                pixels[i + 0] += r;
                pixels[i + 1] += g;
                pixels[i + 2] += b;
            }
            context.putImageData(imageData, 0, 0);
            this._setDirty();
        }
    }
    ;
    /**
     * Rotates the hue of the entire bitmap.
     *
     * @method rotateHue
     * @param {Number} offset The hue offset in 360 degrees
     */
    rotateHue(offset) {
        function rgbToHsl(r, g, b) {
            const cmin = Math.min(r, g, b);
            const cmax = Math.max(r, g, b);
            let h = 0;
            let s = 0;
            const l = (cmin + cmax) / 2;
            const delta = cmax - cmin;
            if (delta > 0) {
                if (r === cmax) {
                    h = 60 * (((g - b) / delta + 6) % 6);
                }
                else if (g === cmax) {
                    h = 60 * ((b - r) / delta + 2);
                }
                else {
                    h = 60 * ((r - g) / delta + 4);
                }
                s = delta / (255 - Math.abs(2 * l - 255));
            }
            return [h, s, l];
        }
        function hslToRgb(h, s, l) {
            const c = (255 - Math.abs(2 * l - 255)) * s;
            const x = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = l - c / 2;
            const cm = c + m;
            const xm = x + m;
            if (h < 60) {
                return [cm, xm, m];
            }
            else if (h < 120) {
                return [xm, cm, m];
            }
            else if (h < 180) {
                return [m, cm, xm];
            }
            else if (h < 240) {
                return [m, xm, cm];
            }
            else if (h < 300) {
                return [xm, m, cm];
            }
            else {
                return [cm, m, xm];
            }
        }
        if (offset && this.width > 0 && this.height > 0) {
            offset = ((offset % 360) + 360) % 360;
            const context = this._context;
            const imageData = context.getImageData(0, 0, this.width, this.height);
            const pixels = imageData.data;
            for (let i = 0; i < pixels.length; i += 4) {
                const hsl = rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2]);
                const h = (hsl[0] + offset) % 360;
                const s = hsl[1];
                const l = hsl[2];
                const rgb = hslToRgb(h, s, l);
                pixels[i + 0] = rgb[0];
                pixels[i + 1] = rgb[1];
                pixels[i + 2] = rgb[2];
            }
            context.putImageData(imageData, 0, 0);
            this._setDirty();
        }
    }
    ;
    /**
     * Applies a blur effect to the bitmap.
     *
     * @method blur
     */
    blur() {
        for (let i = 0; i < 2; i++) {
            const w = this.width;
            const h = this.height;
            const canvas = this._canvas;
            const context = this._context;
            const tempCanvas = document.createElement('canvas');
            const tempContext = tempCanvas.getContext('2d');
            tempCanvas.width = w + 2;
            tempCanvas.height = h + 2;
            tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
            tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
            tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
            tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
            tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
            context.save();
            context.fillStyle = 'black';
            context.fillRect(0, 0, w, h);
            context.globalCompositeOperation = 'lighter';
            context.globalAlpha = 1 / 9;
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
                }
            }
            context.restore();
        }
        this._setDirty();
    }
    ;
    /**
     * Add a callback function that will be called when the bitmap is loaded.
     *
     * @method addLoadListener
     * @param {Function} listener The callback function
     */
    addLoadListener(listener) {
        if (!this.isReady()) {
            this._loadListeners.push(listener);
        }
        else {
            listener(this);
        }
    }
    ;
    /**
     * @method _makeFontNameText
     * @private
     */
    _makeFontNameText() {
        return (this.fontItalic ? 'Italic ' : '') +
            this.fontSize + 'px ' + this.fontFace;
    }
    ;
    /**
     * @method _drawTextOutline
     * @param {String} text
     * @param {Number} tx
     * @param {Number} ty
     * @param {Number} maxWidth
     * @private
     */
    _drawTextOutline(text, tx, ty, maxWidth) {
        const context = this._context;
        context.strokeStyle = this.outlineColor;
        context.lineWidth = this.outlineWidth;
        context.lineJoin = 'round';
        context.strokeText(text, tx, ty, maxWidth);
    }
    ;
    /**
     * @method _drawTextBody
     * @param {String} text
     * @param {Number} tx
     * @param {Number} ty
     * @param {Number} maxWidth
     * @private
     */
    _drawTextBody(text, tx, ty, maxWidth) {
        const context = this._context;
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }
    ;
    /**
     * @method _onLoad
     * @private
     */
    _onLoad() {
        this._image.removeEventListener('load', this._loadListener);
        this._image.removeEventListener('error', this._errorListener);
        this._renewCanvas();
        switch (this._loadingState) {
            case 'requesting':
                this._loadingState = 'requestCompleted';
                if (this._decodeAfterRequest) {
                    this.decode();
                }
                else {
                    this._loadingState = 'purged';
                    this._clearImgInstance();
                }
                break;
        }
    }
    ;
    decode() {
        switch (this._loadingState) {
            case 'requestCompleted':
                this._loadingState = 'loaded';
                if (!this.__canvas)
                    this._createBaseTexture(this._image);
                this._setDirty();
                this._callLoadListeners();
                break;
            case 'requesting':
                this._decodeAfterRequest = true;
                if (!this._loader) {
                    this._loader = ResourceHandler.createLoader(this._url, this._requestImage.bind(this, this._url), this._onError.bind(this));
                    this._image.removeEventListener('error', this._errorListener);
                    this._image.addEventListener('error', this._errorListener = this._loader);
                }
                break;
            case 'pending':
            case 'purged':
            case 'error':
                this._decodeAfterRequest = true;
                this._requestImage(this._url);
                break;
        }
    }
    ;
    /**
     * @method _callLoadListeners
     * @private
     */
    _callLoadListeners() {
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener(this);
        }
    }
    ;
    /**
     * @method _onError
     * @private
     */
    _onError() {
        this._image.removeEventListener('load', this._loadListener);
        this._image.removeEventListener('error', this._errorListener);
        this._loadingState = 'error';
    }
    ;
    /**
     * @method _setDirty
     * @private
     */
    _setDirty() {
        this._dirty = true;
    }
    ;
    /**
     * updates texture is bitmap was dirty
     * @method checkDirty
     */
    checkDirty() {
        if (this._dirty) {
            this._baseTexture.update();
            this._dirty = false;
        }
    }
    ;
    static request(url) {
        let bitmap = new Bitmap(undefined, undefined, true);
        bitmap._url = url;
        bitmap._loadingState = 'pending';
        return bitmap;
    }
    ;
    _requestImage(url) {
        if (Bitmap._reuseImages.length !== 0) {
            this._image = Bitmap._reuseImages.pop();
        }
        else {
            this._image = new Image();
        }
        if (this._decodeAfterRequest && !this._loader) {
            this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
        }
        this._image = new Image();
        this._url = url;
        this._loadingState = 'requesting';
        this._image.src = url;
        this._image.addEventListener('load', this._loadListener = this._onLoad.bind(this));
        this._image.addEventListener('error', this._errorListener = this._loader || this._onError.bind(this));
    }
    ;
    isRequestOnly() {
        return !(this._decodeAfterRequest || this.isReady());
    }
    ;
    isRequestReady() {
        return this._loadingState !== 'pending' &&
            this._loadingState !== 'requesting';
    }
    ;
    startRequest() {
        if (this._loadingState === 'pending') {
            this._decodeAfterRequest = false;
            this._requestImage(this._url);
        }
    }
    ;
}
//for iOS. img consumes memory. so reuse it.
Bitmap._reuseImages = [];

//-----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 *
 * @class Sprite
 * @constructor
 * @param {Bitmap} bitmap The image for the sprite
 */
console.info(PIXI);
class Sprite extends PIXI.Sprite {
    constructor(bitmap) {
        super(new PIXI.Texture(new PIXI.BaseTexture()));
        this._bitmap = null;
        this._frame = new PIXI.Rectangle();
        this._realFrame = new PIXI.Rectangle();
        this._blendColor = [0, 0, 0, 0];
        this._colorTone = [0, 0, 0, 0];
        this._canvas = null;
        this._context = null;
        this._tintTexture = null;
        /**
         * use heavy renderer that will reduce border artifacts and apply advanced blendModes
         * @type {boolean}
         * @private
         */
        this._isPicture = false;
        this.opaque = false;
        this._renderWebGL_PIXI = super._renderWebGL;
        this.spriteId = Sprite._counter++;
        this.bitmap = bitmap;
    }
    ;
    ;
    /**
     * The image for the sprite.
     *
     * @property bitmap
     * @type Bitmap
     */
    get bitmap() {
        return this._bitmap;
    }
    set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            if (value) {
                this._refreshFrame = true;
                value.addLoadListener(this._onBitmapLoad.bind(this));
            }
            else {
                this._refreshFrame = false;
                this.texture.frame = PIXI.Rectangle.EMPTY;
            }
        }
    }
    /**
     * The width of the sprite without the scale.
     *
     * @property width
     * @type Number
     */
    get width() {
        return this._frame.width;
    }
    set width(value) {
        this._frame.width = value;
        this._refresh();
    }
    /**
     * The height of the sprite without the scale.
     *
     * @property height
     * @type Number
     */
    get height() {
        return this._frame.height;
    }
    set height(value) {
        this._frame.height = value;
        this._refresh();
    }
    /**
     * The opacity of the sprite (0 to 255).
     *
     * @property opacity
     * @type Number
     */
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    /**
     * Updates the sprite for each frame.
     *
     * @method update
     */
    update() {
        this.children.forEach(function (child) {
            if (child['update']) {
                child['update']();
            }
        });
    }
    ;
    /**
     * Sets the x and y at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the sprite
     * @param {Number} y The y coordinate of the sprite
     */
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    ;
    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     *
     * @method setFrame
     * @param {Number} x The x coordinate of the frame
     * @param {Number} y The y coordinate of the frame
     * @param {Number} width The width of the frame
     * @param {Number} height The height of the frame
     */
    setFrame(x, y, width, height) {
        this._refreshFrame = false;
        const frame = this._frame;
        if (x !== frame.x || y !== frame.y ||
            width !== frame.width || height !== frame.height) {
            frame.x = x;
            frame.y = y;
            frame.width = width;
            frame.height = height;
            this._refresh();
        }
    }
    ;
    /**
     * Gets the blend color for the sprite.
     *
     * @method getBlendColor
     * @return {Array} The blend color [r, g, b, a]
     */
    getBlendColor() {
        return this._blendColor.clone();
    }
    ;
    /**
     * Sets the blend color for the sprite.
     *
     * @method setBlendColor
     * @param {Array} color The blend color [r, g, b, a]
     */
    setBlendColor(color) {
        if (!(color instanceof Array)) {
            throw new Error('Argument must be an array');
        }
        if (!this._blendColor.equals(color)) {
            this._blendColor = color.clone();
            this._refresh();
        }
    }
    ;
    /**
     * Gets the color tone for the sprite.
     *
     * @method getColorTone
     * @return {Array} The color tone [r, g, b, gray]
     */
    getColorTone() {
        return this._colorTone.clone();
    }
    ;
    /**
     * Sets the color tone for the sprite.
     *
     * @method setColorTone
     * @param {Array} tone The color tone [r, g, b, gray]
     */
    setColorTone(tone) {
        if (!(tone instanceof Array)) {
            throw new Error('Argument must be an array');
        }
        if (!this._colorTone.equals(tone)) {
            this._colorTone = tone.clone();
            this._refresh();
        }
    }
    ;
    /**
     * @method _onBitmapLoad
     * @private
     */
    _onBitmapLoad(bitmapLoaded) {
        if (bitmapLoaded === this._bitmap) {
            if (this._refreshFrame && this._bitmap) {
                this._refreshFrame = false;
                this._frame.width = this._bitmap.width;
                this._frame.height = this._bitmap.height;
            }
        }
        this._refresh();
    }
    ;
    /**
     * @method _refresh
     * @private
     */
    _refresh() {
        const frameX = Math.floor(this._frame.x);
        const frameY = Math.floor(this._frame.y);
        const frameW = Math.floor(this._frame.width);
        const frameH = Math.floor(this._frame.height);
        const bitmapW = this._bitmap ? this._bitmap.width : 0;
        const bitmapH = this._bitmap ? this._bitmap.height : 0;
        const realX = frameX.clamp(0, bitmapW);
        const realY = frameY.clamp(0, bitmapH);
        const realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
        const realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);
        this._realFrame.x = realX;
        this._realFrame.y = realY;
        this._realFrame.width = realW;
        this._realFrame.height = realH;
        this.pivot.x = frameX - realX;
        this.pivot.y = frameY - realY;
        if (realW > 0 && realH > 0) {
            if (this._needsTint()) {
                this._createTinter(realW, realH);
                this._executeTint(realX, realY, realW, realH);
                this._tintTexture.update();
                this.texture.baseTexture = this._tintTexture;
                this.texture.frame = new PIXI.Rectangle(0, 0, realW, realH);
            }
            else {
                if (this._bitmap) {
                    this.texture.baseTexture = this._bitmap.baseTexture;
                }
                this.texture.frame = this._realFrame;
            }
        }
        else if (this._bitmap) {
            this.texture.frame = PIXI.Rectangle.EMPTY;
        }
        else {
            this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
            this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
            this.texture.frame = this._frame;
        }
        /// bungcip: changed to compile
        this.texture._updateID++;
    }
    ;
    /**
     * @method _isInBitmapRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return {Boolean}
     * @private
     */
    _isInBitmapRect(x, y, w, h) {
        return (this._bitmap && x + w > 0 && y + h > 0 &&
            x < this._bitmap.width && y < this._bitmap.height);
    }
    ;
    /**
     * @method _needsTint
     * @return {Boolean}
     * @private
     */
    _needsTint() {
        const tone = this._colorTone;
        return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;
    }
    ;
    /**
     * @method _createTinter
     * @param {Number} w
     * @param {Number} h
     * @private
     */
    _createTinter(w, h) {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._context = this._canvas.getContext('2d');
        }
        this._canvas.width = w;
        this._canvas.height = h;
        if (!this._tintTexture) {
            this._tintTexture = new PIXI.BaseTexture(this._canvas);
        }
        this._tintTexture.width = w;
        this._tintTexture.height = h;
        this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;
    }
    ;
    /**
     * @method _executeTint
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @private
     */
    _executeTint(x, y, w, h) {
        const context = this._context;
        const tone = this._colorTone;
        const color = this._blendColor;
        context.globalCompositeOperation = 'copy';
        context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
        if (Graphics.canUseSaturationBlend()) {
            const gray = Math.max(0, tone[3]);
            context.globalCompositeOperation = 'saturation';
            context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';
            context.fillRect(0, 0, w, h);
        }
        const r1 = Math.max(0, tone[0]);
        const g1 = Math.max(0, tone[1]);
        const b1 = Math.max(0, tone[2]);
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
        context.fillRect(0, 0, w, h);
        if (Graphics.canUseDifferenceBlend()) {
            context.globalCompositeOperation = 'difference';
            context.fillStyle = 'white';
            context.fillRect(0, 0, w, h);
            const r2 = Math.max(0, -tone[0]);
            const g2 = Math.max(0, -tone[1]);
            const b2 = Math.max(0, -tone[2]);
            context.globalCompositeOperation = 'lighter';
            context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
            context.fillRect(0, 0, w, h);
            context.globalCompositeOperation = 'difference';
            context.fillStyle = 'white';
            context.fillRect(0, 0, w, h);
        }
        const r3 = Math.max(0, color[0]);
        const g3 = Math.max(0, color[1]);
        const b3 = Math.max(0, color[2]);
        const a3 = Math.max(0, color[3]);
        context.globalCompositeOperation = 'source-atop';
        context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
        context.globalAlpha = a3 / 255;
        context.fillRect(0, 0, w, h);
        context.globalCompositeOperation = 'destination-in';
        context.globalAlpha = 1;
        context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
    }
    ;
    /**
     * checks if we need to speed up custom blendmodes
     * @param renderer
     * @private
     */
    /// bungcip: jadi public karena dipakai di TilingSprite
    _speedUpCustomBlendModes(renderer) {
        const picture = renderer.plugins.picture;
        const blend = this.blendMode;
        if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
            if (picture.drawModes[blend]) {
                const stage = renderer._lastObjectRendered;
                const f = stage._filters;
                if (!f || !f[0]) {
                    setTimeout(function () {
                        const f = stage._filters;
                        if (!f || !f[0]) {
                            stage.filters = [Sprite.voidFilter];
                            stage.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
                        }
                    }, 0);
                }
            }
        }
    }
    ;
    /**
     * @method _renderWebGL
     * @param {Object} renderer
     * @private
     */
    _renderWebGL(renderer) {
        if (this.bitmap) {
            this.bitmap.touch();
        }
        if (this.bitmap && !this.bitmap.isReady()) {
            return;
        }
        if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
            if (this._bitmap) {
                this._bitmap.checkDirty();
            }
            //copy of pixi-v4 internal code
            this.calculateVertices();
            if (this._isPicture) {
                // use heavy renderer, which reduces artifacts and applies corrent blendMode,
                // but does not use multitexture optimization
                this._speedUpCustomBlendModes(renderer);
                renderer.setObjectRenderer(renderer.plugins['picture']);
                renderer.plugins['picture'].render(this);
            }
            else {
                // use pixi super-speed renderer
                renderer.setObjectRenderer(renderer.plugins['sprite']);
                renderer.plugins['sprite'].render(this);
            }
        }
    }
    ;
}
Sprite.voidFilter = new PIXI.filters.AlphaFilter();
// Number of the created objects.
/// bungcip: pakai public karena dipakai di TilingSprite
Sprite._counter = 0;

//-----------------------------------------------------------------------------
/**
 * The window in the game.
 *
 * @class CoreWindow
 * @constructor
 */
/// bungcip: direname karena bentrok dengan Window dari DOM
class CoreWindow extends PIXI.Container {
    constructor() {
        super();
        this._isWindow = true;
        this._windowskin = null;
        this._width = 0;
        this._height = 0;
        this._cursorRect = new PIXI.Rectangle();
        /// bungcip: required to public in order to compile
        this._openness = 255;
        this._animationCount = 0;
        this._padding = 18;
        this._margin = 4;
        this._colorTone = [0, 0, 0];
        this._windowSpriteContainer = null;
        this._windowBackSprite = null;
        this._windowCursorSprite = null;
        this._windowFrameSprite = null;
        this._windowContentsSprite = null;
        this._windowArrowSprites = [];
        this._windowPauseSignSprite = null;
        /**
         * The origin point of the window for scrolling.
         *
         * @property origin
         * @type Point
         */
        this.origin = new PIXI.Point();
        /**
         * The active state for the window.
         *
         * @property active
         * @type Boolean
         */
        this.active = true;
        /**
         * The visibility of the down scroll arrow.
         *
         * @property downArrowVisible
         * @type Boolean
         */
        this.downArrowVisible = false;
        /**
         * The visibility of the up scroll arrow.
         *
         * @property upArrowVisible
         * @type Boolean
         */
        this.upArrowVisible = false;
        /**
         * The visibility of the pause sign.
         *
         * @property pause
         * @type Boolean
         */
        this.pause = false;
        this._createAllParts();
    }
    ;
    /**
     * The image used as a window skin.
     *
     * @property windowskin
     * @type Bitmap
     */
    get windowskin() {
        return this._windowskin;
    }
    set windowskin(value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    }
    /**
     * The bitmap used for the window contents.
     *
     * @property contents
     * @type Bitmap
     */
    get contents() {
        return this._windowContentsSprite.bitmap;
    }
    set contents(value) {
        this._windowContentsSprite.bitmap = value;
    }
    /**
     * The width of the window in pixels.
     *
     * @property width
     * @type Number
     */
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        this._refreshAllParts();
    }
    /**
     * The height of the window in pixels.
     *
     * @property height
     * @type Number
     */
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this._refreshAllParts();
    }
    /**
     * The size of the padding between the frame and contents.
     *
     * @property padding
     * @type Number
     */
    get padding() {
        return this._padding;
    }
    set padding(value) {
        this._padding = value;
        this._refreshAllParts();
    }
    /**
     * The size of the margin for the window background.
     *
     * @property margin
     * @type Number
     */
    get margin() {
        return this._margin;
    }
    set margin(value) {
        this._margin = value;
        this._refreshAllParts();
    }
    /**
     * The opacity of the window without contents (0 to 255).
     *
     * @property opacity
     * @type Number
     */
    get opacity() {
        return this._windowSpriteContainer.alpha * 255;
    }
    set opacity(value) {
        this._windowSpriteContainer.alpha = value.clamp(0, 255) / 255;
    }
    /**
     * The opacity of the window background (0 to 255).
     *
     * @property backOpacity
     * @type Number
     */
    get backOpacity() {
        return this._windowBackSprite.alpha * 255;
    }
    set backOpacity(value) {
        this._windowBackSprite.alpha = value.clamp(0, 255) / 255;
    }
    /**
     * The opacity of the window contents (0 to 255).
     *
     * @property contentsOpacity
     * @type Number
     */
    get contentsOpacity() {
        return this._windowContentsSprite.alpha * 255;
    }
    set contentsOpacity(value) {
        this._windowContentsSprite.alpha = value.clamp(0, 255) / 255;
    }
    /**
     * The openness of the window (0 to 255).
     *
     * @property openness
     * @type Number
     */
    get openness() {
        return this._openness;
    }
    set openness(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._windowSpriteContainer.scale.y = this._openness / 255;
            this._windowSpriteContainer.y = this.height / 2 * (1 - this._openness / 255);
        }
    }
    /**
     * Updates the window for each frame.
     *
     * @method update
     */
    update() {
        if (this.active) {
            this._animationCount++;
        }
        this.children.forEach(function (child) {
            if (child['update']) {
                child['update']();
            }
        });
    }
    ;
    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the window
     * @param {Number} y The y coordinate of the window
     * @param {Number} width The width of the window
     * @param {Number} height The height of the window
     */
    move(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        if (this._width !== width || this._height !== height) {
            this._width = width || 0;
            this._height = height || 0;
            this._refreshAllParts();
        }
    }
    ;
    /**
     * Returns true if the window is completely open (openness == 255).
     *
     * @method isOpen
     */
    isOpen() {
        return this._openness >= 255;
    }
    ;
    /**
     * Returns true if the window is completely closed (openness == 0).
     *
     * @method isClosed
     */
    isClosed() {
        return this._openness <= 0;
    }
    ;
    /**
     * Sets the position of the command cursor.
     *
     * @method setCursorRect
     * @param {Number} x The x coordinate of the cursor
     * @param {Number} y The y coordinate of the cursor
     * @param {Number} width The width of the cursor
     * @param {Number} height The height of the cursor
     */
    setCursorRect(x, y, width, height) {
        const cx = Math.floor(x || 0);
        const cy = Math.floor(y || 0);
        const cw = Math.floor(width || 0);
        const ch = Math.floor(height || 0);
        const rect = this._cursorRect;
        if (rect.x !== cx || rect.y !== cy || rect.width !== cw || rect.height !== ch) {
            this._cursorRect.x = cx;
            this._cursorRect.y = cy;
            this._cursorRect.width = cw;
            this._cursorRect.height = ch;
            this._refreshCursor();
        }
    }
    ;
    /**
     * Changes the color of the background.
     *
     * @method setTone
     * @param {Number} r The red value in the range (-255, 255)
     * @param {Number} g The green value in the range (-255, 255)
     * @param {Number} b The blue value in the range (-255, 255)
     */
    setTone(r, g, b) {
        const tone = this._colorTone;
        if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
            this._colorTone = [r, g, b];
            this._refreshBack();
        }
    }
    ;
    /**
     * Adds a child between the background and contents.
     *
     * @method addChildToBack
     * @param {Object} child The child to add
     * @return {Object} The child that was added
     */
    addChildToBack(child) {
        const containerIndex = this.children.indexOf(this._windowSpriteContainer);
        return this.addChildAt(child, containerIndex + 1);
    }
    ;
    /**
     * @method updateTransform
     * @private
     */
    updateTransform() {
        this._updateCursor();
        this._updateArrows();
        this._updatePauseSign();
        this._updateContents();
        super.updateTransform();
    }
    ;
    _createAllParts() {
        this._windowSpriteContainer = new PIXI.Container();
        this._windowBackSprite = new Sprite();
        this._windowCursorSprite = new Sprite();
        this._windowFrameSprite = new Sprite();
        this._windowContentsSprite = new Sprite();
        this._downArrowSprite = new Sprite();
        this._upArrowSprite = new Sprite();
        this._windowPauseSignSprite = new Sprite();
        this._windowBackSprite.bitmap = new Bitmap(1, 1);
        this._windowBackSprite.alpha = 192 / 255;
        this.addChild(this._windowSpriteContainer);
        this._windowSpriteContainer.addChild(this._windowBackSprite);
        this._windowSpriteContainer.addChild(this._windowFrameSprite);
        this.addChild(this._windowCursorSprite);
        this.addChild(this._windowContentsSprite);
        this.addChild(this._downArrowSprite);
        this.addChild(this._upArrowSprite);
        this.addChild(this._windowPauseSignSprite);
    }
    ;
    /**
     * @method _onWindowskinLoad
     * @private
     */
    _onWindowskinLoad() {
        this._refreshAllParts();
    }
    ;
    /**
     * @method _refreshAllParts
     * @private
     */
    _refreshAllParts() {
        this._refreshBack();
        this._refreshFrame();
        this._refreshCursor();
        this._refreshContents();
        this._refreshArrows();
        this._refreshPauseSign();
    }
    ;
    /**
     * @method _refreshBack
     * @private
     */
    _refreshBack() {
        const m = this._margin;
        const w = this._width - m * 2;
        const h = this._height - m * 2;
        const bitmap = new Bitmap(w, h);
        this._windowBackSprite.bitmap = bitmap;
        this._windowBackSprite.setFrame(0, 0, w, h);
        this._windowBackSprite.move(m, m);
        if (w > 0 && h > 0 && this._windowskin) {
            const p = 96;
            bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h);
            for (let y = 0; y < h; y += p) {
                for (let x = 0; x < w; x += p) {
                    bitmap.blt(this._windowskin, 0, p, p, p, x, y, p, p);
                }
            }
            const tone = this._colorTone;
            bitmap.adjustTone(tone[0], tone[1], tone[2]);
        }
    }
    ;
    /**
     * @method _refreshFrame
     * @private
     */
    _refreshFrame() {
        const w = this._width;
        const h = this._height;
        const m = 24;
        const bitmap = new Bitmap(w, h);
        this._windowFrameSprite.bitmap = bitmap;
        this._windowFrameSprite.setFrame(0, 0, w, h);
        if (w > 0 && h > 0 && this._windowskin) {
            const skin = this._windowskin;
            const p = 96;
            const q = 96;
            bitmap.blt(skin, p + m, 0 + 0, p - m * 2, m, m, 0, w - m * 2, m);
            bitmap.blt(skin, p + m, 0 + q - m, p - m * 2, m, m, h - m, w - m * 2, m);
            bitmap.blt(skin, p + 0, 0 + m, m, p - m * 2, 0, m, m, h - m * 2);
            bitmap.blt(skin, p + q - m, 0 + m, m, p - m * 2, w - m, m, m, h - m * 2);
            bitmap.blt(skin, p + 0, 0 + 0, m, m, 0, 0, m, m);
            bitmap.blt(skin, p + q - m, 0 + 0, m, m, w - m, 0, m, m);
            bitmap.blt(skin, p + 0, 0 + q - m, m, m, 0, h - m, m, m);
            bitmap.blt(skin, p + q - m, 0 + q - m, m, m, w - m, h - m, m, m);
        }
    }
    ;
    /**
     * @method _refreshCursor
     * @private
     */
    _refreshCursor() {
        const pad = this._padding;
        const x = this._cursorRect.x + pad - this.origin.x;
        const y = this._cursorRect.y + pad - this.origin.y;
        const w = this._cursorRect.width;
        const h = this._cursorRect.height;
        const m = 4;
        const x2 = Math.max(x, pad);
        const y2 = Math.max(y, pad);
        const ox = x - x2;
        const oy = y - y2;
        const w2 = Math.min(w, this._width - pad - x2);
        const h2 = Math.min(h, this._height - pad - y2);
        const bitmap = new Bitmap(w2, h2);
        this._windowCursorSprite.bitmap = bitmap;
        this._windowCursorSprite.setFrame(0, 0, w2, h2);
        this._windowCursorSprite.move(x2, y2);
        if (w > 0 && h > 0 && this._windowskin) {
            const skin = this._windowskin;
            const p = 96;
            const q = 48;
            bitmap.blt(skin, p + m, p + m, q - m * 2, q - m * 2, ox + m, oy + m, w - m * 2, h - m * 2);
            bitmap.blt(skin, p + m, p + 0, q - m * 2, m, ox + m, oy + 0, w - m * 2, m);
            bitmap.blt(skin, p + m, p + q - m, q - m * 2, m, ox + m, oy + h - m, w - m * 2, m);
            bitmap.blt(skin, p + 0, p + m, m, q - m * 2, ox + 0, oy + m, m, h - m * 2);
            bitmap.blt(skin, p + q - m, p + m, m, q - m * 2, ox + w - m, oy + m, m, h - m * 2);
            bitmap.blt(skin, p + 0, p + 0, m, m, ox + 0, oy + 0, m, m);
            bitmap.blt(skin, p + q - m, p + 0, m, m, ox + w - m, oy + 0, m, m);
            bitmap.blt(skin, p + 0, p + q - m, m, m, ox + 0, oy + h - m, m, m);
            bitmap.blt(skin, p + q - m, p + q - m, m, m, ox + w - m, oy + h - m, m, m);
        }
    }
    ;
    /**
     * @method _refreshContents
     * @private
     */
    _refreshContents() {
        this._windowContentsSprite.move(this.padding, this.padding);
    }
    ;
    /**
     * @method _refreshArrows
     * @private
     */
    _refreshArrows() {
        const w = this._width;
        const h = this._height;
        const p = 24;
        const q = p / 2;
        const sx = 96 + p;
        const sy = 0 + p;
        this._downArrowSprite.bitmap = this._windowskin;
        this._downArrowSprite.anchor.x = 0.5;
        this._downArrowSprite.anchor.y = 0.5;
        this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
        this._downArrowSprite.move(w / 2, h - q);
        this._upArrowSprite.bitmap = this._windowskin;
        this._upArrowSprite.anchor.x = 0.5;
        this._upArrowSprite.anchor.y = 0.5;
        this._upArrowSprite.setFrame(sx + q, sy, p, q);
        this._upArrowSprite.move(w / 2, q);
    }
    ;
    /**
     * @method _refreshPauseSign
     * @private
     */
    _refreshPauseSign() {
        const sx = 144;
        const sy = 96;
        const p = 24;
        this._windowPauseSignSprite.bitmap = this._windowskin;
        this._windowPauseSignSprite.anchor.x = 0.5;
        this._windowPauseSignSprite.anchor.y = 1;
        this._windowPauseSignSprite.move(this._width / 2, this._height);
        this._windowPauseSignSprite.setFrame(sx, sy, p, p);
        this._windowPauseSignSprite.alpha = 0;
    }
    ;
    /**
     * @method _updateCursor
     * @private
     */
    _updateCursor() {
        const blinkCount = this._animationCount % 40;
        let cursorOpacity = this.contentsOpacity;
        if (this.active) {
            if (blinkCount < 20) {
                cursorOpacity -= blinkCount * 8;
            }
            else {
                cursorOpacity -= (40 - blinkCount) * 8;
            }
        }
        this._windowCursorSprite.alpha = cursorOpacity / 255;
        this._windowCursorSprite.visible = this.isOpen();
    }
    ;
    /**
     * @method _updateContents
     * @private
     */
    _updateContents() {
        const w = this._width - this._padding * 2;
        const h = this._height - this._padding * 2;
        if (w > 0 && h > 0) {
            this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
            this._windowContentsSprite.visible = this.isOpen();
        }
        else {
            this._windowContentsSprite.visible = false;
        }
    }
    ;
    /**
     * @method _updateArrows
     * @private
     */
    _updateArrows() {
        this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
        this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
    }
    ;
    /**
     * @method _updatePauseSign
     * @private
     */
    _updatePauseSign() {
        const sprite = this._windowPauseSignSprite;
        const x = Math.floor(this._animationCount / 16) % 2;
        const y = Math.floor(this._animationCount / 16 / 2) % 2;
        const sx = 144;
        const sy = 96;
        const p = 24;
        if (!this.pause) {
            sprite.alpha = 0;
        }
        else if (sprite.alpha < 1) {
            sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
        }
        sprite.setFrame(sx + x * p, sy + y * p, p, p);
        sprite.visible = this.isOpen();
    }
    ;
}

//-----------------------------------------------------------------------------
/**
 * The resource class. Allows to be collected as a garbage if not use for some time or ticks
 *
 * @class CacheEntry
 * @constructor
 * @param {ResourceManager} resource manager
 * @param {string} key, url of the resource
 * @param {string} item - Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
 */
class CacheEntry {
    constructor(cache, key, item) {
        this.cached = false;
        this.touchTicks = 0;
        this.touchSeconds = 0;
        this.ttlSeconds = 0;
        this.ttlTicks = 0;
        this.freedByTTL = false;
        this.cache = cache;
        this.key = key;
        this.item = item;
    }
    /**
     * frees the resource
     */
    free(byTTL = false) {
        this.freedByTTL = byTTL;
        if (this.cached) {
            this.cached = false;
            delete this.cache._inner[this.key];
        }
    }
    ;
    /**
     * Allocates the resource
     * @returns {CacheEntry}
     */
    allocate() {
        if (!this.cached) {
            this.cache._inner[this.key] = this;
            this.cached = true;
        }
        this.touch();
        return this;
    }
    ;
    /**
     * Sets the time to live
     * @param {number} ticks TTL in ticks, 0 if not set
     * @param {number} time TTL in seconds, 0 if not set
     * @returns {CacheEntry}
     */
    setTimeToLive(ticks = 0, seconds = 0) {
        this.ttlTicks = ticks;
        this.ttlSeconds = seconds;
        return this;
    }
    ;
    isStillAlive() {
        const cache = this.cache;
        return ((this.ttlTicks == 0) || (this.touchTicks + this.ttlTicks < cache.updateTicks)) &&
            ((this.ttlSeconds == 0) || (this.touchSeconds + this.ttlSeconds < cache.updateSeconds));
    }
    ;
    /**
     * makes sure that resource wont freed by Time To Live
     * if resource was already freed by TTL, put it in cache again
     */
    touch() {
        const cache = this.cache;
        if (this.cached) {
            this.touchTicks = cache.updateTicks;
            this.touchSeconds = cache.updateSeconds;
        }
        else if (this.freedByTTL) {
            this.freedByTTL = false;
            if (!cache._inner[this.key]) {
                cache._inner[this.key] = this;
            }
        }
    }
    ;
}

/**
 * Cache for images, audio, or any other kind of resource
 * @param manager
 * @constructor
 */
class CacheMap {
    constructor(manager) {
        this._inner = {};
        this._lastRemovedEntries = [];
        this.updateTicks = 0;
        this.lastCheckTTL = 0;
        this.delayCheckTTL = 100;
        this.updateSeconds = Date.now();
        this.manager = manager;
    }
    /**
     * checks ttl of all elements and removes dead ones
     */
    checkTTL() {
        let cache = this._inner;
        let temp = this._lastRemovedEntries;
        if (!temp) {
            temp = [];
            this._lastRemovedEntries = temp;
        }
        for (const key in cache) {
            const entry = cache[key];
            if (!entry.isStillAlive()) {
                temp.push(entry);
            }
        }
        for (let i = 0; i < temp.length; i++) {
            temp[i].free(true);
        }
        temp.length = 0;
    }
    ;
    /**
     * cache item
     * @param key url of cache element
     * @returns {*|null}
     */
    getItem(key) {
        const entry = this._inner[key];
        if (entry) {
            return entry.item;
        }
        return null;
    }
    ;
    clear() {
        const keys = Object.keys(this._inner);
        for (let i = 0; i < keys.length; i++) {
            this._inner[keys[i]].free();
        }
    }
    ;
    setItem(key, item) {
        return new CacheEntry(this, key, item).allocate();
    }
    ;
    update(ticks, delta) {
        this.updateTicks += ticks;
        this.updateSeconds += delta;
        if (this.updateSeconds >= this.delayCheckTTL + this.lastCheckTTL) {
            this.lastCheckTTL = this.updateSeconds;
            this.checkTTL();
        }
    }
    ;
}

class ImageCache {
    constructor() {
        this._items = {};
    }
    add(key, value) {
        this._items[key] = {
            bitmap: value,
            touch: Date.now(),
            key: key
        };
        this._truncateCache();
    }
    ;
    get(key) {
        if (this._items[key]) {
            const item = this._items[key];
            item.touch = Date.now();
            return item.bitmap;
        }
        return null;
    }
    ;
    reserve(key, value, reservationId) {
        if (!this._items[key]) {
            this._items[key] = {
                bitmap: value,
                touch: Date.now(),
                key: key
            };
        }
        this._items[key].reservationId = reservationId;
    }
    ;
    releaseReservation(reservationId) {
        const items = this._items;
        Object.keys(items)
            .map(function (key) { return items[key]; })
            .forEach(function (item) {
            if (item.reservationId === reservationId) {
                delete item.reservationId;
            }
        });
    }
    ;
    _truncateCache() {
        const items = this._items;
        let sizeLeft = ImageCache.limit;
        Object.keys(items).map(function (key) {
            return items[key];
        }).sort(function (a, b) {
            return b.touch - a.touch;
        }).forEach(function (item) {
            if (sizeLeft > 0 || this._mustBeHeld(item)) {
                const bitmap = item.bitmap;
                sizeLeft -= bitmap.width * bitmap.height;
            }
            else {
                delete items[item.key];
            }
        }.bind(this));
    }
    ;
    _mustBeHeld(item) {
        // request only is weak so It's purgeable
        if (item.bitmap.isRequestOnly())
            return false;
        // reserved item must be held
        if (item.reservationId)
            return true;
        // not ready bitmap must be held (because of checking isReady())
        if (!item.bitmap.isReady())
            return true;
        // then the item may purgeable
        return false;
    }
    ;
    isReady() {
        const items = this._items;
        return !Object.keys(items).some(function (key) {
            return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
        });
    }
    ;
    getErrorBitmap() {
        const items = this._items;
        let bitmap = null;
        if (Object.keys(items).some(function (key) {
            if (items[key].bitmap.isError()) {
                bitmap = items[key].bitmap;
                return true;
            }
            return false;
        })) {
            return bitmap;
        }
        return null;
    }
    ;
}
ImageCache.limit = 10 * 1000 * 1000;

class RequestQueue {
    constructor() {
        this._queue = [];
    }
    enqueue(key, value) {
        this._queue.push({
            key: key,
            value: value,
        });
    }
    ;
    update() {
        if (this._queue.length === 0)
            return;
        const top = this._queue[0];
        if (top.value.isRequestReady()) {
            this._queue.shift();
            if (this._queue.length !== 0) {
                this._queue[0].value.startRequest();
            }
        }
        else {
            top.value.startRequest();
        }
    }
    ;
    raisePriority(key) {
        for (let n = 0; n < this._queue.length; n++) {
            const item = this._queue[n];
            if (item.key === key) {
                this._queue.splice(n, 1);
                this._queue.unshift(item);
                break;
            }
        }
    }
    ;
    clear() {
        this._queue.splice(0);
    }
    ;
}

/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @class Input
 */
class Input {
    /**
     * Initializes the input system.
     *
     * @static
     * @method initialize
     */
    static initialize() {
        this.clear();
        this._wrapNwjsAlert();
        this._setupEventHandlers();
    }
    ;
    /**
     * Clears all the input data.
     *
     * @static
     * @method clear
     */
    static clear() {
        this._currentState = {};
        this._previousState = {};
        this._gamepadStates = [];
        this._latestButton = null;
        this._pressedTime = 0;
        this._dir4 = 0;
        this._dir8 = 0;
        this._preferredAxis = '';
        this._date = 0;
    }
    ;
    /**
     * Updates the input data.
     *
     * @static
     * @method update
     */
    static update() {
        this._pollGamepads();
        if (this._currentState[this._latestButton]) {
            this._pressedTime++;
        }
        else {
            this._latestButton = null;
        }
        for (let name in this._currentState) {
            if (this._currentState[name] && !this._previousState[name]) {
                this._latestButton = name;
                this._pressedTime = 0;
                this._date = Date.now();
            }
            this._previousState[name] = this._currentState[name];
        }
        this._updateDirection();
    }
    ;
    /**
     * Checks whether a key is currently pressed down.
     *
     * @static
     * @method isPressed
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is pressed
     */
    static isPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isPressed('escape')) {
            return true;
        }
        else {
            return !!this._currentState[keyName];
        }
    }
    ;
    /**
     * Checks whether a key is just pressed.
     *
     * @static
     * @method isTriggered
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is triggered
     */
    static isTriggered(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isTriggered('escape')) {
            return true;
        }
        else {
            return this._latestButton === keyName && this._pressedTime === 0;
        }
    }
    ;
    /**
     * Checks whether a key is just pressed or a key repeat occurred.
     *
     * @static
     * @method isRepeated
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is repeated
     */
    static isRepeated(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isRepeated('escape')) {
            return true;
        }
        else {
            return (this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                    (this._pressedTime >= this.keyRepeatWait &&
                        this._pressedTime % this.keyRepeatInterval === 0)));
        }
    }
    ;
    /**
     * Checks whether a key is kept depressed.
     *
     * @static
     * @method isLongPressed
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is long-pressed
     */
    static isLongPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
            return true;
        }
        else {
            return (this._latestButton === keyName &&
                this._pressedTime >= this.keyRepeatWait);
        }
    }
    ;
    /**
     * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
     *
     * @static
     * @property dir4
     * @type Number
     */
    static get dir4() {
        return this._dir4;
    }
    /**
     * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
     *
     * @static
     * @property dir8
     * @type Number
     */
    static get dir8() {
        return this._dir8;
    }
    /**
     * [read-only] The time of the last input in milliseconds.
     *
     * @static
     * @property date
     * @type Number
     */
    static get date() {
        return this._date;
    }
    /**
     * @static
     * @method _wrapNwjsAlert
     * @private
     */
    static _wrapNwjsAlert() {
        if (Utils.isNwjs()) {
            const _alert = window.alert;
            window.alert = function () {
                let require = window['require'];
                const gui = require('nw.gui');
                const win = gui.Window.get();
                _alert.apply(this, arguments);
                win.focus();
                this.clear();
            };
        }
    }
    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    static _setupEventHandlers() {
        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('keyup', this._onKeyUp.bind(this));
        window.addEventListener('blur', this._onLostFocus.bind(this));
    }
    ;
    /**
     * @static
     * @method _onKeyDown
     * @param {KeyboardEvent} event
     * @private
     */
    static _onKeyDown(event) {
        if (this._shouldPreventDefault(event.keyCode)) {
            event.preventDefault();
        }
        if (event.keyCode === 144) {
            this.clear();
        }
        const buttonName = this.keyMapper[event.keyCode];
        if (ResourceHandler.exists() && buttonName === 'ok') {
            ResourceHandler.retry();
        }
        else if (buttonName) {
            this._currentState[buttonName] = true;
        }
    }
    ;
    /**
     * @static
     * @method _shouldPreventDefault
     * @param {Number} keyCode
     * @private
     */
    static _shouldPreventDefault(keyCode) {
        switch (keyCode) {
            case 8: // backspace
            case 33: // pageup
            case 34: // pagedown
            case 37: // left arrow
            case 38: // up arrow
            case 39: // right arrow
            case 40:// down arrow
                return true;
        }
        return false;
    }
    ;
    /**
     * @static
     * @method _onKeyUp
     * @param {KeyboardEvent} event
     * @private
     */
    static _onKeyUp(event) {
        const buttonName = this.keyMapper[event.keyCode];
        if (buttonName) {
            this._currentState[buttonName] = false;
        }
        if (event.keyCode === 0) {
            this.clear();
        }
    }
    ;
    /**
     * @static
     * @method _onLostFocus
     * @private
     */
    static _onLostFocus() {
        this.clear();
    }
    ;
    /**
     * @static
     * @method _pollGamepads
     * @private
     */
    static _pollGamepads() {
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            if (gamepads) {
                for (let i = 0; i < gamepads.length; i++) {
                    const gamepad = gamepads[i];
                    if (gamepad && gamepad.connected) {
                        this._updateGamepadState(gamepad);
                    }
                }
            }
        }
    }
    ;
    /**
     * @static
     * @method _updateGamepadState
     * @param {Gamepad} gamepad
     * @param {Number} index
     * @private
     */
    static _updateGamepadState(gamepad) {
        const lastState = this._gamepadStates[gamepad.index] || [];
        const newState = [];
        const buttons = gamepad.buttons;
        const axes = gamepad.axes;
        const threshold = 0.5;
        newState[12] = false;
        newState[13] = false;
        newState[14] = false;
        newState[15] = false;
        for (let i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }
        if (axes[1] < -threshold) {
            newState[12] = true; // up
        }
        else if (axes[1] > threshold) {
            newState[13] = true; // down
        }
        if (axes[0] < -threshold) {
            newState[14] = true; // left
        }
        else if (axes[0] > threshold) {
            newState[15] = true; // right
        }
        for (let j = 0; j < newState.length; j++) {
            if (newState[j] !== lastState[j]) {
                const buttonName = this.gamepadMapper[j];
                if (buttonName) {
                    this._currentState[buttonName] = newState[j];
                }
            }
        }
        this._gamepadStates[gamepad.index] = newState;
    }
    ;
    /**
     * @static
     * @method _updateDirection
     * @private
     */
    static _updateDirection() {
        let x = this._signX();
        let y = this._signY();
        this._dir8 = this._makeNumpadDirection(x, y);
        if (x !== 0 && y !== 0) {
            if (this._preferredAxis === 'x') {
                y = 0;
            }
            else {
                x = 0;
            }
        }
        else if (x !== 0) {
            this._preferredAxis = 'y';
        }
        else if (y !== 0) {
            this._preferredAxis = 'x';
        }
        this._dir4 = this._makeNumpadDirection(x, y);
    }
    ;
    /**
     * @static
     * @method _signX
     * @private
     */
    static _signX() {
        let x = 0;
        if (this.isPressed('left')) {
            x--;
        }
        if (this.isPressed('right')) {
            x++;
        }
        return x;
    }
    ;
    /**
     * @static
     * @method _signY
     * @private
     */
    static _signY() {
        let y = 0;
        if (this.isPressed('up')) {
            y--;
        }
        if (this.isPressed('down')) {
            y++;
        }
        return y;
    }
    ;
    /**
     * @static
     * @method _makeNumpadDirection
     * @param {Number} x
     * @param {Number} y
     * @return {Number}
     * @private
     */
    static _makeNumpadDirection(x, y) {
        if (x !== 0 || y !== 0) {
            return 5 - y * 3 + x;
        }
        return 0;
    }
    ;
    /**
     * @static
     * @method _isEscapeCompatible
     * @param {String} keyName
     * @return {Boolean}
     * @private
     */
    static _isEscapeCompatible(keyName) {
        return keyName === 'cancel' || keyName === 'menu';
    }
    ;
}
/**
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
Input.keyRepeatWait = 24;
/**
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
Input.keyRepeatInterval = 6;
/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
    9: 'tab',
    13: 'ok',
    16: 'shift',
    17: 'control',
    18: 'control',
    27: 'escape',
    32: 'ok',
    33: 'pageup',
    34: 'pagedown',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'escape',
    81: 'pageup',
    87: 'pagedown',
    88: 'escape',
    90: 'ok',
    96: 'escape',
    98: 'down',
    100: 'left',
    102: 'right',
    104: 'up',
    120: 'debug' // F9
};
/**
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
Input.gamepadMapper = {
    0: 'ok',
    1: 'cancel',
    2: 'shift',
    3: 'menu',
    4: 'pageup',
    5: 'pagedown',
    12: 'up',
    13: 'down',
    14: 'left',
    15: 'right',
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @class TouchInput
 */
class TouchInput {
    /**
     * Initializes the touch system.
     *
     * @static
     * @method initialize
     */
    static initialize() {
        this.clear();
        this._setupEventHandlers();
    }
    ;
    static clear() {
        this._mousePressed = false;
        this._screenPressed = false;
        this._pressedTime = 0;
        this._events = {};
        this._events.triggered = false;
        this._events.cancelled = false;
        this._events.moved = false;
        this._events.released = false;
        this._events.wheelX = 0;
        this._events.wheelY = 0;
        this._triggered = false;
        this._cancelled = false;
        this._moved = false;
        this._released = false;
        this._wheelX = 0;
        this._wheelY = 0;
        this._x = 0;
        this._y = 0;
        this._date = 0;
    }
    ;
    /**
     * Updates the touch data.
     *
     * @static
     * @method update
     */
    static update() {
        this._triggered = this._events.triggered;
        this._cancelled = this._events.cancelled;
        this._moved = this._events.moved;
        this._released = this._events.released;
        this._wheelX = this._events.wheelX;
        this._wheelY = this._events.wheelY;
        this._events.triggered = false;
        this._events.cancelled = false;
        this._events.moved = false;
        this._events.released = false;
        this._events.wheelX = 0;
        this._events.wheelY = 0;
        if (this.isPressed()) {
            this._pressedTime++;
        }
    }
    ;
    /**
     * Checks whether the mouse button or touchscreen is currently pressed down.
     *
     * @static
     * @method isPressed
     * @return {Boolean} True if the mouse button or touchscreen is pressed
     */
    static isPressed() {
        return this._mousePressed || this._screenPressed;
    }
    ;
    /**
     * Checks whether the left mouse button or touchscreen is just pressed.
     *
     * @static
     * @method isTriggered
     * @return {Boolean} True if the mouse button or touchscreen is triggered
     */
    static isTriggered() {
        return this._triggered;
    }
    ;
    /**
     * Checks whether the left mouse button or touchscreen is just pressed
     * or a pseudo key repeat occurred.
     *
     * @static
     * @method isRepeated
     * @return {Boolean} True if the mouse button or touchscreen is repeated
     */
    static isRepeated() {
        return (this.isPressed() &&
            (this._triggered ||
                (this._pressedTime >= this.keyRepeatWait &&
                    this._pressedTime % this.keyRepeatInterval === 0)));
    }
    ;
    /**
     * Checks whether the left mouse button or touchscreen is kept depressed.
     *
     * @static
     * @method isLongPressed
     * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
     */
    static isLongPressed() {
        return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
    }
    ;
    /**
     * Checks whether the right mouse button is just pressed.
     *
     * @static
     * @method isCancelled
     * @return {Boolean} True if the right mouse button is just pressed
     */
    static isCancelled() {
        return this._cancelled;
    }
    ;
    /**
     * Checks whether the mouse or a finger on the touchscreen is moved.
     *
     * @static
     * @method isMoved
     * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
     */
    static isMoved() {
        return this._moved;
    }
    ;
    /**
     * Checks whether the left mouse button or touchscreen is released.
     *
     * @static
     * @method isReleased
     * @return {Boolean} True if the mouse button or touchscreen is released
     */
    static isReleased() {
        return this._released;
    }
    ;
    /**
     * [read-only] The horizontal scroll amount.
     *
     * @static
     * @property wheelX
     * @type Number
     */
    static get wheelX() {
        return this._wheelX;
    }
    /**
     * [read-only] The vertical scroll amount.
     *
     * @static
     * @property wheelY
     * @type Number
     */
    static get wheelY() {
        return this._wheelY;
    }
    /**
     * [read-only] The x coordinate on the canvas area of the latest touch event.
     *
     * @static
     * @property x
     * @type Number
     */
    static get x() {
        return this._x;
    }
    /**
     * [read-only] The y coordinate on the canvas area of the latest touch event.
     *
     * @static
     * @property y
     * @type Number
     */
    static get y() {
        return this._y;
    }
    /**
     * [read-only] The time of the last input in milliseconds.
     *
     * @static
     * @property date
     * @type Number
     */
    static get date() {
        return this._date;
    }
    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    static _setupEventHandlers() {
        const isSupportPassive = Utils.isSupportPassiveEvent();
        document.addEventListener('mousedown', this._onMouseDown.bind(this));
        document.addEventListener('mousemove', this._onMouseMove.bind(this));
        document.addEventListener('mouseup', this._onMouseUp.bind(this));
        document.addEventListener('wheel', this._onWheel.bind(this));
        /// bungcip: biar bisa dicompile
        document.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? { passive: false } : false);
        document.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? { passive: false } : false);
        document.addEventListener('touchend', this._onTouchEnd.bind(this));
        document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
        document.addEventListener('pointerdown', this._onPointerDown.bind(this));
    }
    ;
    /**
     * @static
     * @method _onMouseDown
     * @param {MouseEvent} event
     * @private
     */
    static _onMouseDown(event) {
        if (event.button === 0) {
            this._onLeftButtonDown(event);
        }
        else if (event.button === 1) {
            this._onMiddleButtonDown(event);
        }
        else if (event.button === 2) {
            this._onRightButtonDown(event);
        }
    }
    ;
    /**
     * @static
     * @method _onLeftButtonDown
     * @param {MouseEvent} event
     * @private
     */
    static _onLeftButtonDown(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._mousePressed = true;
            this._pressedTime = 0;
            this._onTrigger(x, y);
        }
    }
    ;
    /**
     * @static
     * @method _onMiddleButtonDown
     * @param {MouseEvent} event
     * @private
     */
    static _onMiddleButtonDown(event) {
    }
    ;
    /**
     * @static
     * @method _onRightButtonDown
     * @param {MouseEvent} event
     * @private
     */
    static _onRightButtonDown(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onCancel(x, y);
        }
    }
    ;
    /**
     * @static
     * @method _onMouseMove
     * @param {MouseEvent} event
     * @private
     */
    static _onMouseMove(event) {
        if (this._mousePressed) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            this._onMove(x, y);
        }
    }
    ;
    /**
     * @static
     * @method _onMouseUp
     * @param {MouseEvent} event
     * @private
     */
    static _onMouseUp(event) {
        if (event.button === 0) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            this._mousePressed = false;
            this._onRelease(x, y);
        }
    }
    ;
    /**
     * @static
     * @method _onWheel
     * @param {WheelEvent} event
     * @private
     */
    static _onWheel(event) {
        this._events.wheelX += event.deltaX;
        this._events.wheelY += event.deltaY;
        event.preventDefault();
    }
    ;
    /**
     * @static
     * @method _onTouchStart
     * @param {TouchEvent} event
     * @private
     */
    static _onTouchStart(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            if (Graphics.isInsideCanvas(x, y)) {
                this._screenPressed = true;
                this._pressedTime = 0;
                if (event.touches.length >= 2) {
                    this._onCancel(x, y);
                }
                else {
                    this._onTrigger(x, y);
                }
                event.preventDefault();
            }
        }
        if (window['cordova'] || window.navigator['standalone']) {
            event.preventDefault();
        }
    }
    ;
    /**
     * @static
     * @method _onTouchMove
     * @param {TouchEvent} event
     * @private
     */
    static _onTouchMove(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._onMove(x, y);
        }
    }
    ;
    /**
     * @static
     * @method _onTouchEnd
     * @param {TouchEvent} event
     * @private
     */
    static _onTouchEnd(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._screenPressed = false;
            this._onRelease(x, y);
        }
    }
    ;
    /**
     * @static
     * @method _onTouchCancel
     * @param {TouchEvent} event
     * @private
     */
    static _onTouchCancel(event) {
        this._screenPressed = false;
    }
    ;
    /**
     * @static
     * @method _onPointerDown
     * @param {PointerEvent} event
     * @private
     */
    static _onPointerDown(event) {
        if (event.pointerType === 'touch' && !event.isPrimary) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            if (Graphics.isInsideCanvas(x, y)) {
                // For Microsoft Edge
                this._onCancel(x, y);
                event.preventDefault();
            }
        }
    }
    ;
    /**
     * @static
     * @method _onTrigger
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    static _onTrigger(x, y) {
        this._events.triggered = true;
        this._x = x;
        this._y = y;
        this._date = Date.now();
    }
    ;
    /**
     * @static
     * @method _onCancel
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    static _onCancel(x, y) {
        this._events.cancelled = true;
        this._x = x;
        this._y = y;
    }
    ;
    /**
     * @static
     * @method _onMove
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    static _onMove(x, y) {
        this._events.moved = true;
        this._x = x;
        this._y = y;
    }
    ;
    /**
     * @static
     * @method _onRelease
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    static _onRelease(x, y) {
        this._events.released = true;
        this._x = x;
        this._y = y;
    }
    ;
}
/**
 * The wait time of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
TouchInput.keyRepeatWait = 24;
/**
 * The interval of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
TouchInput.keyRepeatInterval = 6;

//-----------------------------------------------------------------------------
/**
 * The tilemap which displays 2D tile-based game map.
 *
 * @class Tilemap
 * @constructor
 */
class Tilemap extends PIXI.Container {
    constructor() {
        super();
        this._margin = 20;
        this._width = Graphics.width + this._margin * 2;
        this._height = Graphics.height + this._margin * 2;
        this._tileWidth = 48;
        this._tileHeight = 48;
        this._mapWidth = 0;
        this._mapHeight = 0;
        this._mapData = null;
        this._layerWidth = 0;
        this._layerHeight = 0;
        this._lastTiles = [];
        /**
         * The bitmaps used as a tileset.
         *
         * @property bitmaps
         * @type Array
         */
        this.bitmaps = [];
        /**
         * The origin point of the tilemap for scrolling.
         *
         * @property origin
         * @type PIXI.Point
         */
        this.origin = new PIXI.Point();
        /**
         * The tileset flags.
         *
         * @property flags
         * @type Array
         */
        this.flags = [];
        /**
         * The animation count for autotiles.
         *
         * @property animationCount
         * @type Number
         */
        this.animationCount = 0;
        /**
         * Whether the tilemap loops horizontal.
         *
         * @property horizontalWrap
         * @type Boolean
         */
        this.horizontalWrap = false;
        /**
         * Whether the tilemap loops vertical.
         *
         * @property verticalWrap
         * @type Boolean
         */
        this.verticalWrap = false;
        this._createLayers();
        this.refresh();
    }
    ;
    /**
     * The width of the screen in pixels.
     *
     * @property width
     * @type Number
     */
    get width() {
        return this._width;
    }
    set width(value) {
        if (this._width !== value) {
            this._width = value;
            this._createLayers();
        }
    }
    /**
     * The height of the screen in pixels.
     *
     * @property height
     * @type Number
     */
    get height() {
        return this._height;
    }
    set height(value) {
        if (this._height !== value) {
            this._height = value;
            this._createLayers();
        }
    }
    /**
     * The width of a tile in pixels.
     *
     * @property tileWidth
     * @type Number
     */
    get tileWidth() {
        return this._tileWidth;
    }
    set tileWidth(value) {
        if (this._tileWidth !== value) {
            this._tileWidth = value;
            this._createLayers();
        }
    }
    /**
     * The height of a tile in pixels.
     *
     * @property tileHeight
     * @type Number
     */
    get tileHeight() {
        return this._tileHeight;
    }
    set tileHeight(value) {
        if (this._tileHeight !== value) {
            this._tileHeight = value;
            this._createLayers();
        }
    }
    /**
     * Sets the tilemap data.
     *
     * @method setData
     * @param {Number} width The width of the map in number of tiles
     * @param {Number} height The height of the map in number of tiles
     * @param {Array} data The one dimensional array for the map data
     */
    setData(width, height, data) {
        this._mapWidth = width;
        this._mapHeight = height;
        this._mapData = data;
    }
    ;
    /**
     * Checks whether the tileset is ready to render.
     *
     * @method isReady
     * @type Boolean
     * @return {Boolean} True if the tilemap is ready
     */
    isReady() {
        for (let i = 0; i < this.bitmaps.length; i++) {
            if (this.bitmaps[i] && !this.bitmaps[i].isReady()) {
                return false;
            }
        }
        return true;
    }
    ;
    update() {
        this.animationCount++;
        this.animationFrame = Math.floor(this.animationCount / 30);
        this.children.forEach(function (child) {
            if (child['update']) {
                child['update']();
            }
        });
        for (let i = 0; i < this.bitmaps.length; i++) {
            if (this.bitmaps[i]) {
                this.bitmaps[i].touch();
            }
        }
    }
    ;
    /**
     * Forces to repaint the entire tilemap.
     *
     * @method refresh
     */
    refresh() {
        this._lastTiles.length = 0;
    }
    ;
    /**
     * Forces to refresh the tileset
     *
     * @method refresh
     */
    refreshTileset() {
    }
    ;
    updateTransform() {
        const ox = Math.floor(this.origin.x);
        const oy = Math.floor(this.origin.y);
        const startX = Math.floor((ox - this._margin) / this._tileWidth);
        const startY = Math.floor((oy - this._margin) / this._tileHeight);
        this._updateLayerPositions(startX, startY);
        if (this._needsRepaint || this._lastAnimationFrame !== this.animationFrame ||
            this._lastStartX !== startX || this._lastStartY !== startY) {
            this._frameUpdated = this._lastAnimationFrame !== this.animationFrame;
            this._lastAnimationFrame = this.animationFrame;
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._paintAllTiles(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
        super.updateTransform();
    }
    ;
    /**
     * @method _createLayers
     * @private
     */
    _createLayers() {
        const width = this._width;
        const height = this._height;
        const margin = this._margin;
        const tileCols = Math.ceil(width / this._tileWidth) + 1;
        const tileRows = Math.ceil(height / this._tileHeight) + 1;
        const layerWidth = tileCols * this._tileWidth;
        const layerHeight = tileRows * this._tileHeight;
        this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
        this._upperBitmap = new Bitmap(layerWidth, layerHeight);
        this._layerWidth = layerWidth;
        this._layerHeight = layerHeight;
        /*
         * Z coordinate:
         *
         * 0 : Lower tiles
         * 1 : Lower characters
         * 3 : Normal characters
         * 4 : Upper tiles
         * 5 : Upper characters
         * 6 : Airship shadow
         * 7 : Balloon
         * 8 : Animation
         * 9 : Destination
         */
        this._lowerLayer = new Sprite();
        this._lowerLayer.move(-margin, -margin); /// bungcip: diedit
        this._lowerLayer['z'] = 0;
        this._upperLayer = new Sprite();
        this._upperLayer.move(-margin, -margin); /// bungcip: diedit
        this._upperLayer['z'] = 4;
        for (let i = 0; i < 4; i++) {
            this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
            this._upperLayer.addChild(new Sprite(this._upperBitmap));
        }
        this.addChild(this._lowerLayer);
        this.addChild(this._upperLayer);
    }
    ;
    /**
     * @method _updateLayerPositions
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    _updateLayerPositions(startX, startY) {
        const m = this._margin;
        const ox = Math.floor(this.origin.x);
        const oy = Math.floor(this.origin.y);
        const x2 = (ox - m).mod(this._layerWidth);
        const y2 = (oy - m).mod(this._layerHeight);
        const w1 = this._layerWidth - x2;
        const h1 = this._layerHeight - y2;
        const w2 = this._width - w1;
        const h2 = this._height - h1;
        for (let i = 0; i < 2; i++) {
            let children;
            if (i === 0) {
                children = this._lowerLayer.children;
            }
            else {
                children = this._upperLayer.children;
            }
            children[0].move(0, 0, w1, h1);
            children[0].setFrame(x2, y2, w1, h1);
            children[1].move(w1, 0, w2, h1);
            children[1].setFrame(0, y2, w2, h1);
            children[2].move(0, h1, w1, h2);
            children[2].setFrame(x2, 0, w1, h2);
            children[3].move(w1, h1, w2, h2);
            children[3].setFrame(0, 0, w2, h2);
        }
    }
    ;
    /**
     * @method _paintAllTiles
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    _paintAllTiles(startX, startY) {
        const tileCols = Math.ceil(this._width / this._tileWidth) + 1;
        const tileRows = Math.ceil(this._height / this._tileHeight) + 1;
        for (let y = 0; y < tileRows; y++) {
            for (let x = 0; x < tileCols; x++) {
                this._paintTiles(startX, startY, x, y);
            }
        }
    }
    ;
    /**
     * @method _paintTiles
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    _paintTiles(startX, startY, x, y) {
        const tableEdgeVirtualId = 10000;
        const mx = startX + x;
        const my = startY + y;
        const dx = (mx * this._tileWidth).mod(this._layerWidth);
        const dy = (my * this._tileHeight).mod(this._layerHeight);
        const lx = dx / this._tileWidth;
        const ly = dy / this._tileHeight;
        const tileId0 = this._readMapData(mx, my, 0);
        const tileId1 = this._readMapData(mx, my, 1);
        const tileId2 = this._readMapData(mx, my, 2);
        const tileId3 = this._readMapData(mx, my, 3);
        const shadowBits = this._readMapData(mx, my, 4);
        const upperTileId1 = this._readMapData(mx, my - 1, 1);
        const lowerTiles = [];
        const upperTiles = [];
        if (this._isHigherTile(tileId0)) {
            upperTiles.push(tileId0);
        }
        else {
            lowerTiles.push(tileId0);
        }
        if (this._isHigherTile(tileId1)) {
            upperTiles.push(tileId1);
        }
        else {
            lowerTiles.push(tileId1);
        }
        lowerTiles.push(-shadowBits);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                lowerTiles.push(tableEdgeVirtualId + upperTileId1);
            }
        }
        if (this._isOverpassPosition(mx, my)) {
            upperTiles.push(tileId2);
            upperTiles.push(tileId3);
        }
        else {
            if (this._isHigherTile(tileId2)) {
                upperTiles.push(tileId2);
            }
            else {
                lowerTiles.push(tileId2);
            }
            if (this._isHigherTile(tileId3)) {
                upperTiles.push(tileId3);
            }
            else {
                lowerTiles.push(tileId3);
            }
        }
        const lastLowerTiles = this._readLastTiles(0, lx, ly);
        if (!lowerTiles.equals(lastLowerTiles) ||
            (Tilemap.isTileA1(tileId0) && this._frameUpdated)) {
            this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
            for (let i = 0; i < lowerTiles.length; i++) {
                const lowerTileId = lowerTiles[i];
                if (lowerTileId < 0) {
                    this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
                }
                else if (lowerTileId >= tableEdgeVirtualId) {
                    this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
                }
                else {
                    this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
                }
            }
            this._writeLastTiles(0, lx, ly, lowerTiles);
        }
        const lastUpperTiles = this._readLastTiles(1, lx, ly);
        if (!upperTiles.equals(lastUpperTiles)) {
            this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
            for (let j = 0; j < upperTiles.length; j++) {
                this._drawTile(this._upperBitmap, upperTiles[j], dx, dy);
            }
            this._writeLastTiles(1, lx, ly, upperTiles);
        }
    }
    ;
    /**
     * @method _readLastTiles
     * @param {Number} i
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    _readLastTiles(i, x, y) {
        const array1 = this._lastTiles[i];
        if (array1) {
            const array2 = array1[y];
            if (array2) {
                const tiles = array2[x];
                if (tiles) {
                    return tiles;
                }
            }
        }
        return [];
    }
    ;
    /**
     * @method _writeLastTiles
     * @param {Number} i
     * @param {Number} x
     * @param {Number} y
     * @param {Array} tiles
     * @private
     */
    _writeLastTiles(i, x, y, tiles) {
        let array1 = this._lastTiles[i];
        if (!array1) {
            array1 = this._lastTiles[i] = [];
        }
        let array2 = array1[y];
        if (!array2) {
            array2 = array1[y] = [];
        }
        array2[x] = tiles;
    }
    ;
    /**
     * @method _drawTile
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawTile(bitmap, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._drawAutotile(bitmap, tileId, dx, dy);
            }
            else {
                this._drawNormalTile(bitmap, tileId, dx, dy);
            }
        }
    }
    ;
    /**
     * @method _drawNormalTile
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawNormalTile(bitmap, tileId, dx, dy) {
        let setNumber = 0;
        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        }
        else {
            setNumber = 5 + Math.floor(tileId / 256);
        }
        const w = this._tileWidth;
        const h = this._tileHeight;
        const sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
        const sy = (Math.floor(tileId % 256 / 8) % 16) * h;
        const source = this.bitmaps[setNumber];
        if (source) {
            bitmap.bltImage(source, sx, sy, w, h, dx, dy, w, h);
        }
    }
    ;
    /**
     * @method _drawAutotile
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawAutotile(bitmap, tileId, dx, dy) {
        let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        const kind = Tilemap.getAutotileKind(tileId);
        const shape = Tilemap.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        let bx = 0;
        let by = 0;
        let setNumber = 0;
        let isTable = false;
        if (Tilemap.isTileA1(tileId)) {
            const waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
            setNumber = 0;
            if (kind === 0) {
                bx = waterSurfaceIndex * 2;
                by = 0;
            }
            else if (kind === 1) {
                bx = waterSurfaceIndex * 2;
                by = 3;
            }
            else if (kind === 2) {
                bx = 6;
                by = 0;
            }
            else if (kind === 3) {
                bx = 6;
                by = 3;
            }
            else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
                if (kind % 2 === 0) {
                    bx += waterSurfaceIndex * 2;
                }
                else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    by += this.animationFrame % 3;
                }
            }
        }
        else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        }
        else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
        else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }
        const table = autotileTable[shape];
        const source = this.bitmaps[setNumber];
        if (table && source) {
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            for (let i = 0; i < 4; i++) {
                const qsx = table[i][0];
                const qsy = table[i][1];
                const sx1 = (bx * 2 + qsx) * w1;
                const sy1 = (by * 2 + qsy) * h1;
                const dx1 = dx + (i % 2) * w1;
                let dy1 = dy + Math.floor(i / 2) * h1;
                if (isTable && (qsy === 1 || qsy === 5)) {
                    let qsx2 = qsx;
                    const qsy2 = 3;
                    if (qsy === 1) {
                        qsx2 = [0, 3, 2, 1][qsx];
                    }
                    const sx2 = (bx * 2 + qsx2) * w1;
                    const sy2 = (by * 2 + qsy2) * h1;
                    bitmap.bltImage(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
                    dy1 += h1 / 2;
                    bitmap.bltImage(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
                }
                else {
                    bitmap.bltImage(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
                }
            }
        }
    }
    ;
    /**
     * @method _drawTableEdge
     * @param {Bitmap} bitmap
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawTableEdge(bitmap, tileId, dx, dy) {
        if (Tilemap.isTileA2(tileId)) {
            const autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            const kind = Tilemap.getAutotileKind(tileId);
            const shape = Tilemap.getAutotileShape(tileId);
            const tx = kind % 8;
            const ty = Math.floor(kind / 8);
            const setNumber = 1;
            const bx = tx * 2;
            const by = (ty - 2) * 3;
            const table = autotileTable[shape];
            if (table) {
                const source = this.bitmaps[setNumber];
                const w1 = this._tileWidth / 2;
                const h1 = this._tileHeight / 2;
                for (let i = 0; i < 2; i++) {
                    const qsx = table[2 + i][0];
                    const qsy = table[2 + i][1];
                    const sx1 = (bx * 2 + qsx) * w1;
                    const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                    const dx1 = dx + (i % 2) * w1;
                    const dy1 = dy + Math.floor(i / 2) * h1;
                    bitmap.bltImage(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
                }
            }
        }
    }
    ;
    /**
     * @method _drawShadow
     * @param {Bitmap} bitmap
     * @param {Number} shadowBits
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawShadow(bitmap, shadowBits, dx, dy) {
        if (shadowBits & 0x0f) {
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            const color = 'rgba(0,0,0,0.5)';
            for (let i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    const dx1 = dx + (i % 2) * w1;
                    const dy1 = dy + Math.floor(i / 2) * h1;
                    bitmap.fillRect(dx1, dy1, w1, h1, color);
                }
            }
        }
    }
    ;
    /**
     * @method _readMapData
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @return {Number}
     * @private
     */
    _readMapData(x, y, z) {
        if (this._mapData) {
            const width = this._mapWidth;
            const height = this._mapHeight;
            if (this.horizontalWrap) {
                x = x.mod(width);
            }
            if (this.verticalWrap) {
                y = y.mod(height);
            }
            if (x >= 0 && x < width && y >= 0 && y < height) {
                return this._mapData[(z * height + y) * width + x] || 0;
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }
    ;
    /**
     * @method _isHigherTile
     * @param {Number} tileId
     * @return {Boolean}
     * @private
     */
    _isHigherTile(tileId) {
        return (this.flags[tileId] & 0x10) != 0;
    }
    ;
    /**
     * @method _isTableTile
     * @param {Number} tileId
     * @return {Boolean}
     * @private
     */
    _isTableTile(tileId) {
        return Tilemap.isTileA2(tileId) && ((this.flags[tileId] & 0x80) != 0);
    }
    ;
    /**
     * @method _isOverpassPosition
     * @param {Number} mx
     * @param {Number} my
     * @return {Boolean}
     * @private
     */
    _isOverpassPosition(mx, my) {
        return false;
    }
    ;
    /**
     * @method _sortChildren
     * @private
     */
    _sortChildren() {
        this.children.sort(this._compareChildOrder.bind(this));
    }
    ;
    /**
     * @method _compareChildOrder
     * @param {Object} a
     * @param {Object} b
     * @private
     */
    _compareChildOrder(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        }
        else if (a.y !== b.y) {
            return a.y - b.y;
        }
        else {
            return a.spriteId - b.spriteId;
        }
    }
    ;
    static isVisibleTile(tileId) {
        return tileId > 0 && tileId < this.TILE_ID_MAX;
    }
    ;
    static isAutotile(tileId) {
        return tileId >= this.TILE_ID_A1;
    }
    ;
    static getAutotileKind(tileId) {
        return Math.floor((tileId - this.TILE_ID_A1) / 48);
    }
    ;
    static getAutotileShape(tileId) {
        return (tileId - this.TILE_ID_A1) % 48;
    }
    ;
    static makeAutotileId(kind, shape) {
        return this.TILE_ID_A1 + kind * 48 + shape;
    }
    ;
    static isSameKindTile(tileID1, tileID2) {
        if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
            return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
        }
        else {
            return tileID1 === tileID2;
        }
    }
    ;
    static isTileA1(tileId) {
        return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
    }
    ;
    static isTileA2(tileId) {
        return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
    }
    ;
    static isTileA3(tileId) {
        return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
    }
    ;
    static isTileA4(tileId) {
        return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
    }
    ;
    static isTileA5(tileId) {
        return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
    }
    ;
    static isWaterTile(tileId) {
        if (this.isTileA1(tileId)) {
            return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);
        }
        else {
            return false;
        }
    }
    ;
    static isWaterfallTile(tileId) {
        if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
            return this.getAutotileKind(tileId) % 2 === 1;
        }
        else {
            return false;
        }
    }
    ;
    static isGroundTile(tileId) {
        return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);
    }
    ;
    static isShadowingTile(tileId) {
        return this.isTileA3(tileId) || this.isTileA4(tileId);
    }
    ;
    static isRoofTile(tileId) {
        return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }
    ;
    static isWallTopTile(tileId) {
        return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }
    ;
    static isWallSideTile(tileId) {
        return (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
            this.getAutotileKind(tileId) % 16 >= 8;
    }
    ;
    static isWallTile(tileId) {
        return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
    }
    ;
    static isFloorTypeAutotile(tileId) {
        return (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
            this.isTileA2(tileId) || this.isWallTopTile(tileId);
    }
    ;
    static isWallTypeAutotile(tileId) {
        return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
    }
    ;
    static isWaterfallTypeAutotile(tileId) {
        return this.isWaterfallTile(tileId);
    }
    ;
}
// Tile type checkers
Tilemap.TILE_ID_B = 0;
Tilemap.TILE_ID_C = 256;
Tilemap.TILE_ID_D = 512;
Tilemap.TILE_ID_E = 768;
Tilemap.TILE_ID_A5 = 1536;
Tilemap.TILE_ID_A1 = 2048;
Tilemap.TILE_ID_A2 = 2816;
Tilemap.TILE_ID_A3 = 4352;
Tilemap.TILE_ID_A4 = 5888;
Tilemap.TILE_ID_MAX = 8192;
// Autotile shape number to coordinates of tileset images
Tilemap.FLOOR_AUTOTILE_TABLE = [
    [[2, 4], [1, 4], [2, 3], [1, 3]], [[2, 0], [1, 4], [2, 3], [1, 3]],
    [[2, 4], [3, 0], [2, 3], [1, 3]], [[2, 0], [3, 0], [2, 3], [1, 3]],
    [[2, 4], [1, 4], [2, 3], [3, 1]], [[2, 0], [1, 4], [2, 3], [3, 1]],
    [[2, 4], [3, 0], [2, 3], [3, 1]], [[2, 0], [3, 0], [2, 3], [3, 1]],
    [[2, 4], [1, 4], [2, 1], [1, 3]], [[2, 0], [1, 4], [2, 1], [1, 3]],
    [[2, 4], [3, 0], [2, 1], [1, 3]], [[2, 0], [3, 0], [2, 1], [1, 3]],
    [[2, 4], [1, 4], [2, 1], [3, 1]], [[2, 0], [1, 4], [2, 1], [3, 1]],
    [[2, 4], [3, 0], [2, 1], [3, 1]], [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 4], [1, 4], [0, 3], [1, 3]], [[0, 4], [3, 0], [0, 3], [1, 3]],
    [[0, 4], [1, 4], [0, 3], [3, 1]], [[0, 4], [3, 0], [0, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]], [[2, 2], [1, 2], [2, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 1], [1, 3]], [[2, 2], [1, 2], [2, 1], [3, 1]],
    [[2, 4], [3, 4], [2, 3], [3, 3]], [[2, 4], [3, 4], [2, 1], [3, 3]],
    [[2, 0], [3, 4], [2, 3], [3, 3]], [[2, 0], [3, 4], [2, 1], [3, 3]],
    [[2, 4], [1, 4], [2, 5], [1, 5]], [[2, 0], [1, 4], [2, 5], [1, 5]],
    [[2, 4], [3, 0], [2, 5], [1, 5]], [[2, 0], [3, 0], [2, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 3], [3, 3]], [[2, 2], [1, 2], [2, 5], [1, 5]],
    [[0, 2], [1, 2], [0, 3], [1, 3]], [[0, 2], [1, 2], [0, 3], [3, 1]],
    [[2, 2], [3, 2], [2, 3], [3, 3]], [[2, 2], [3, 2], [2, 1], [3, 3]],
    [[2, 4], [3, 4], [2, 5], [3, 5]], [[2, 0], [3, 4], [2, 5], [3, 5]],
    [[0, 4], [1, 4], [0, 5], [1, 5]], [[0, 4], [3, 0], [0, 5], [1, 5]],
    [[0, 2], [3, 2], [0, 3], [3, 3]], [[0, 2], [1, 2], [0, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 5], [3, 5]], [[2, 2], [3, 2], [2, 5], [3, 5]],
    [[0, 2], [3, 2], [0, 5], [3, 5]], [[0, 0], [1, 0], [0, 1], [1, 1]]
];
Tilemap.WALL_AUTOTILE_TABLE = [
    [[2, 2], [1, 2], [2, 1], [1, 1]], [[0, 2], [1, 2], [0, 1], [1, 1]],
    [[2, 0], [1, 0], [2, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 2], [3, 2], [2, 1], [3, 1]], [[0, 2], [3, 2], [0, 1], [3, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]], [[0, 0], [3, 0], [0, 1], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]], [[0, 2], [1, 2], [0, 3], [1, 3]],
    [[2, 0], [1, 0], [2, 3], [1, 3]], [[0, 0], [1, 0], [0, 3], [1, 3]],
    [[2, 2], [3, 2], [2, 3], [3, 3]], [[0, 2], [3, 2], [0, 3], [3, 3]],
    [[2, 0], [3, 0], [2, 3], [3, 3]], [[0, 0], [3, 0], [0, 3], [3, 3]]
];
Tilemap.WATERFALL_AUTOTILE_TABLE = [
    [[2, 0], [1, 0], [2, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]], [[0, 0], [3, 0], [0, 1], [3, 1]]
];

//=============================================================================
/**
 * The Superclass of all scene within the game.
 *
 * @class Scene_Base
 * @constructor
 * @extends Stage
 */
class Scene_Base extends Stage {
    constructor() {
        super(...arguments);
        this._active = false;
        this._fadeSign = 0;
        this._fadeDuration = 0;
        this._fadeSprite = null;
        this._imageReservationId = Utils.generateRuntimeId();
    }
    /**
     * Attach a reservation to the reserve queue.
     *
     * @method attachReservation
     * @instance
     * @memberof Scene_Base
     */
    attachReservation() {
        ImageManager.setDefaultReservationId(this._imageReservationId);
    }
    ;
    /**
     * Remove the reservation from the Reserve queue.
     *
     * @method detachReservation
     * @instance
     * @memberof Scene_Base
     */
    detachReservation() {
        ImageManager.releaseReservation(this._imageReservationId);
    }
    ;
    /**
     * Create the components and add them to the rendering process.
     *
     * @method create
     * @instance
     * @memberof Scene_Base
     */
    create() {
    }
    ;
    /**
     * Returns whether the scene is active or not.
     *
     * @method isActive
     * @instance
     * @memberof Scene_Base
     * @return {Boolean} return true if the scene is active
     */
    isActive() {
        return this._active;
    }
    ;
    /**
     * Return whether the scene is ready to start or not.
     *
     * @method isReady
     * @instance
     * @memberof Scene_Base
     * @return {Boolean} Return true if the scene is ready to start
     */
    isReady() {
        return ImageManager.isReady();
    }
    ;
    /**
     * Start the scene processing.
     *
     * @method start
     * @instance
     * @memberof Scene_Base
     */
    start() {
        this._active = true;
    }
    ;
    /**
     * Update the scene processing each new frame.
     *
     * @method update
     * @instance
     * @memberof Scene_Base
     */
    update() {
        this.updateFade();
        this.updateChildren();
    }
    ;
    /**
     * Stop the scene processing.
     *
     * @method stop
     * @instance
     * @memberof Scene_Base
     */
    stop() {
        this._active = false;
    }
    ;
    /**
     * Return whether the scene is busy or not.
     *
     * @method isBusy
     * @instance
     * @memberof Scene_Base
     * @return {Boolean} Return true if the scene is currently busy
     */
    isBusy() {
        return this._fadeDuration > 0;
    }
    ;
    /**
     * Terminate the scene before switching to a another scene.
     *
     * @method terminate
     * @instance
     * @memberof Scene_Base
     */
    terminate() {
    }
    ;
    /**
     * Create the layer for the windows children
     * and add it to the rendering process.
     *
     * @method createWindowLayer
     * @instance
     * @memberof Scene_Base
     */
    createWindowLayer() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._windowLayer = new WindowLayer();
        this._windowLayer.move(x, y, width, height);
        this.addChild(this._windowLayer);
    }
    ;
    /**
     * Add the children window to the windowLayer processing.
     *
     * @method addWindow
     * @instance
     * @memberof Scene_Base
     */
    addWindow(window) {
        this._windowLayer.addChild(window);
    }
    ;
    /**
     * Request a fadeIn screen process.
     *
     * @method startFadeIn
     * @param {Number} [duration=30] The time the process will take for fadeIn the screen
     * @param {Boolean} [white=false] If true the fadein will be process with a white color else it's will be black
     *
     * @instance
     * @memberof Scene_Base
     */
    startFadeIn(duration = 30, white = false) {
        this.createFadeSprite(white);
        this._fadeSign = 1;
        this._fadeDuration = duration;
        this._fadeSprite.opacity = 255;
    }
    ;
    /**
     * Request a fadeOut screen process.
     *
     * @method startFadeOut
     * @param {Number} [duration=30] The time the process will take for fadeOut the screen
     * @param {Boolean} [white=false] If true the fadeOut will be process with a white color else it's will be black
     *
     * @instance
     * @memberof Scene_Base
     */
    startFadeOut(duration = 30, white = false) {
        this.createFadeSprite(white);
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeSprite.opacity = 0;
    }
    ;
    /**
     * Create a Screen sprite for the fadein and fadeOut purpose and
     * add it to the rendering process.
     *
     * @method createFadeSprite
     * @instance
     * @memberof Scene_Base
     */
    createFadeSprite(white) {
        if (!this._fadeSprite) {
            this._fadeSprite = new ScreenSprite();
            this.addChild(this._fadeSprite);
        }
        if (white) {
            this._fadeSprite.setWhite();
        }
        else {
            this._fadeSprite.setBlack();
        }
    }
    ;
    /**
     * Update the screen fade processing.
     *
     * @method updateFade
     * @instance
     * @memberof Scene_Base
     */
    updateFade() {
        if (this._fadeDuration > 0) {
            const d = this._fadeDuration;
            if (this._fadeSign > 0) {
                this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
            }
            else {
                this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
            }
            this._fadeDuration--;
        }
    }
    ;
    /**
     * Update the children of the scene EACH frame.
     *
     * @method updateChildren
     * @instance
     * @memberof Scene_Base
     */
    updateChildren() {
        this.children.forEach(function (child) {
            if (child['update']) {
                child['update']();
            }
        });
    }
    ;
    /**
     * Pop the scene from the stack array and switch to the
     * previous scene.
     *
     * @method popScene
     * @instance
     * @memberof Scene_Base
     */
    popScene() {
        SceneManager.pop();
    }
    ;
    /**
     * Slowly fade out all the visual and audio of the scene.
     *
     * @method fadeOutAll
     * @instance
     * @memberof Scene_Base
     */
    fadeOutAll() {
        const time = this.slowFadeSpeed() / 60;
        AudioManager.fadeOutBgm(time);
        AudioManager.fadeOutBgs(time);
        AudioManager.fadeOutMe(time);
        this.startFadeOut(this.slowFadeSpeed());
    }
    ;
    /**
     * Return the screen fade speed value.
     *
     * @method fadeSpeed
     * @instance
     * @memberof Scene_Base
     * @return {Number} Return the fade speed
     */
    fadeSpeed() {
        return 24;
    }
    ;
    /**
     * Return a slow screen fade speed value.
     *
     * @method slowFadeSpeed
     * @instance
     * @memberof Scene_Base
     * @return {Number} Return the fade speed
     */
    slowFadeSpeed() {
        return this.fadeSpeed() * 2;
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.
class Window_Base extends CoreWindow {
    constructor(x, y, width, height, callback) {
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
            height = this.windowHeight();
        }
        this.move(x, y, width, height);
        this.updatePadding();
        this.updateBackOpacity();
        this.updateTone();
        this.createContents();
        this._opening = false;
        this._closing = false;
        this._dimmerSprite = null;
    }
    ;
    /// bungcip: this two function added to workaround typescript
    ///          limitation around super() in counstructor
    windowWidth() { return Graphics.boxWidth; }
    windowHeight() { return Graphics.boxHeight; }
    windowX() { return 0; }
    windowY() { return 0; }
    static lineHeight() {
        return 36;
    }
    ;
    standardFontFace() {
        if ($gameSystem.isChinese()) {
            return 'SimHei, Heiti TC, sans-serif';
        }
        else if ($gameSystem.isKorean()) {
            return 'Dotum, AppleGothic, sans-serif';
        }
        else {
            return 'GameFont';
        }
    }
    ;
    standardFontSize() {
        return 28;
    }
    ;
    static standardPadding() {
        return 18;
    }
    ;
    textPadding() {
        return 6;
    }
    ;
    standardBackOpacity() {
        return 192;
    }
    ;
    loadWindowskin() {
        this.windowskin = ImageManager.loadSystem('Window');
    }
    ;
    updatePadding() {
        this.padding = Window_Base.standardPadding();
    }
    ;
    updateBackOpacity() {
        this.backOpacity = this.standardBackOpacity();
    }
    ;
    contentsWidth() {
        return this.width - Window_Base.standardPadding() * 2;
    }
    ;
    contentsHeight() {
        return this.height - Window_Base.standardPadding() * 2;
    }
    ;
    static fittingHeight(numLines) {
        return numLines * this.lineHeight() + this.standardPadding() * 2;
    }
    ;
    updateTone() {
        const tone = $gameSystem.windowTone();
        this.setTone(tone[0], tone[1], tone[2]);
    }
    ;
    createContents() {
        this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
        this.resetFontSettings();
    }
    ;
    resetFontSettings() {
        this.contents.fontFace = this.standardFontFace();
        this.contents.fontSize = this.standardFontSize();
        this.resetTextColor();
    }
    ;
    resetTextColor() {
        this.changeTextColor(this.normalColor());
    }
    ;
    update() {
        super.update();
        this.updateTone();
        this.updateOpen();
        this.updateClose();
        this.updateBackgroundDimmer();
    }
    ;
    updateOpen() {
        if (this._opening) {
            this.openness += 32;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    }
    ;
    updateClose() {
        if (this._closing) {
            this.openness -= 32;
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    }
    ;
    open() {
        if (!this.isOpen()) {
            this._opening = true;
        }
        this._closing = false;
    }
    ;
    close() {
        if (!this.isClosed()) {
            this._closing = true;
        }
        this._opening = false;
    }
    ;
    isOpening() {
        return this._opening;
    }
    ;
    isClosing() {
        return this._closing;
    }
    ;
    show() {
        this.visible = true;
    }
    ;
    hide() {
        this.visible = false;
    }
    ;
    activate() {
        this.active = true;
    }
    ;
    deactivate() {
        this.active = false;
    }
    ;
    textColor(n) {
        const px = 96 + (n % 8) * 12 + 6;
        const py = 144 + Math.floor(n / 8) * 12 + 6;
        return this.windowskin.getPixel(px, py);
    }
    ;
    normalColor() {
        return this.textColor(0);
    }
    ;
    systemColor() {
        return this.textColor(16);
    }
    ;
    crisisColor() {
        return this.textColor(17);
    }
    ;
    deathColor() {
        return this.textColor(18);
    }
    ;
    gaugeBackColor() {
        return this.textColor(19);
    }
    ;
    hpGaugeColor1() {
        return this.textColor(20);
    }
    ;
    hpGaugeColor2() {
        return this.textColor(21);
    }
    ;
    mpGaugeColor1() {
        return this.textColor(22);
    }
    ;
    mpGaugeColor2() {
        return this.textColor(23);
    }
    ;
    mpCostColor() {
        return this.textColor(23);
    }
    ;
    powerUpColor() {
        return this.textColor(24);
    }
    ;
    powerDownColor() {
        return this.textColor(25);
    }
    ;
    tpGaugeColor1() {
        return this.textColor(28);
    }
    ;
    tpGaugeColor2() {
        return this.textColor(29);
    }
    ;
    tpCostColor() {
        return this.textColor(29);
    }
    ;
    pendingColor() {
        return this.windowskin.getPixel(120, 120);
    }
    ;
    translucentOpacity() {
        return 160;
    }
    ;
    changeTextColor(color) {
        this.contents.textColor = color;
    }
    ;
    changePaintOpacity(enabled) {
        this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
    }
    ;
    drawText(text, x, y, maxWidth, align) {
        this.contents.drawText(text, x, y, maxWidth, Window_Base.lineHeight(), align);
    }
    ;
    textWidth(text) {
        return this.contents.measureTextWidth(text);
    }
    ;
    drawTextEx(text, x, y) {
        if (text) {
            const textState = {
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
        }
        else {
            return 0;
        }
    }
    ;
    convertEscapeCharacters(text) {
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
    }
    ;
    actorName(n) {
        const actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : '';
    }
    ;
    partyMemberName(n) {
        const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : '';
    }
    ;
    processCharacter(textState) {
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
    }
    ;
    processNormalCharacter(textState) {
        const c = textState.text[textState.index++];
        const w = this.textWidth(c);
        this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
        textState.x += w;
    }
    ;
    processNewLine(textState) {
        textState.x = textState.left;
        textState.y += textState.height;
        textState.height = this.calcTextHeight(textState, false);
        textState.index++;
    }
    ;
    processNewPage(textState) {
        textState.index++;
    }
    ;
    obtainEscapeCode(textState) {
        textState.index++;
        const regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].toUpperCase();
        }
        else {
            return '';
        }
    }
    ;
    obtainEscapeParam(textState) {
        const arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        }
        else {
            return 0; /// (bungcip: changed to compiled)
            // return '';
        }
    }
    ;
    processEscapeCharacter(code, textState) {
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
    }
    ;
    processDrawIcon(iconIndex, textState) {
        this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
        textState.x += Window_Base._iconWidth + 4;
    }
    ;
    makeFontBigger() {
        if (this.contents.fontSize <= 96) {
            this.contents.fontSize += 12;
        }
    }
    ;
    makeFontSmaller() {
        if (this.contents.fontSize >= 24) {
            this.contents.fontSize -= 12;
        }
    }
    ;
    calcTextHeight(textState, all) {
        const lastFontSize = this.contents.fontSize;
        let textHeight = 0;
        const lines = textState.text.slice(textState.index).split('\n');
        const maxLines = all ? lines.length : 1;
        for (let i = 0; i < maxLines; i++) {
            let maxFontSize = this.contents.fontSize;
            const regExp = /\x1b[\{\}]/g;
            for (;;) {
                const array = regExp.exec(lines[i]);
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
                }
                else {
                    break;
                }
            }
            textHeight += maxFontSize + 8;
        }
        this.contents.fontSize = lastFontSize;
        return textHeight;
    }
    ;
    drawIcon(iconIndex, x, y) {
        const bitmap = ImageManager.loadSystem('IconSet');
        const pw = Window_Base._iconWidth;
        const ph = Window_Base._iconHeight;
        const sx = iconIndex % 16 * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
    }
    ;
    drawFace(faceName, faceIndex, x, y, width, height) {
        width = width || Window_Base._faceWidth;
        height = height || Window_Base._faceHeight;
        const bitmap = ImageManager.loadFace(faceName);
        const pw = Window_Base._faceWidth;
        const ph = Window_Base._faceHeight;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        const sx = faceIndex % 4 * pw + (pw - sw) / 2;
        const sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    }
    ;
    drawCharacter(characterName, characterIndex, x, y) {
        const bitmap = ImageManager.loadCharacter(characterName);
        const big = ImageManager.isBigCharacter(characterName);
        const pw = bitmap.width / (big ? 3 : 12);
        const ph = bitmap.height / (big ? 4 : 8);
        const n = characterIndex;
        const sx = (n % 4 * 3 + 1) * pw;
        const sy = (Math.floor(n / 4) * 4) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    }
    ;
    drawGauge(x, y, width, rate, color1, color2) {
        const fillW = Math.floor(width * rate);
        const gaugeY = y + Window_Base.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
    }
    ;
    hpColor(actor) {
        if (actor.isDead()) {
            return this.deathColor();
        }
        else if (actor.isDying()) {
            return this.crisisColor();
        }
        else {
            return this.normalColor();
        }
    }
    ;
    mpColor(actor) {
        return this.normalColor();
    }
    ;
    tpColor(actor) {
        return this.normalColor();
    }
    ;
    drawActorCharacter(actor, x, y) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    }
    ;
    drawActorFace(actor, x, y, width, height) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    }
    ;
    drawActorName(actor, x, y, width = 168) {
        this.changeTextColor(this.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    }
    ;
    drawActorClass(actor, x, y, width = 168) {
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    }
    ;
    drawActorNickname(actor, x, y, width = 270) {
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    }
    ;
    drawActorLevel(actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level.toString(), x + 84, y, 36, 'right');
    }
    ;
    drawActorIcons(actor, x, y, width = 144) {
        const icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
        for (let i = 0; i < icons.length; i++) {
            this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
        }
    }
    ;
    drawCurrentAndMax(current, max, x, y, width, color1, color2) {
        const labelWidth = this.textWidth('HP');
        const valueWidth = this.textWidth('0000');
        const slashWidth = this.textWidth('/');
        const x1 = x + width - valueWidth;
        const x2 = x1 - slashWidth;
        const x3 = x2 - valueWidth;
        if (x3 >= x + labelWidth) {
            this.changeTextColor(color1);
            this.drawText(current, x3, y, valueWidth, 'right');
            this.changeTextColor(color2);
            this.drawText('/', x2, y, slashWidth, 'right');
            this.drawText(max, x1, y, valueWidth, 'right');
        }
        else {
            this.changeTextColor(color1);
            this.drawText(current, x1, y, valueWidth, 'right');
        }
    }
    ;
    drawActorHp(actor, x, y, width = 186) {
        const color1 = this.hpGaugeColor1();
        const color2 = this.hpGaugeColor2();
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(actor.hp.toString(), actor.mhp.toString(), x, y, width, this.hpColor(actor), this.normalColor());
    }
    ;
    drawActorMp(actor, x, y, width = 186) {
        const color1 = this.mpGaugeColor1();
        const color2 = this.mpGaugeColor2();
        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA, x, y, 44);
        this.drawCurrentAndMax(actor.mp.toString(), actor.mmp.toString(), x, y, width, this.mpColor(actor), this.normalColor());
    }
    ;
    drawActorTp(actor, x, y, width = 96) {
        const color1 = this.tpGaugeColor1();
        const color2 = this.tpGaugeColor2();
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp.toString(), x + width - 64, y, 64, 'right');
    }
    ;
    drawActorSimpleStatus(actor, x, y, width) {
        const lineHeight = Window_Base.lineHeight();
        const x2 = x + 180;
        const width2 = Math.min(200, width - 180 - this.textPadding());
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
        this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
    }
    ;
    drawItemName(item, x, y, width = 312) {
        if (item) {
            const iconBoxWidth = Window_Base._iconWidth + 4;
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    }
    ;
    drawCurrencyValue(value, unit, x, y, width) {
        const unitWidth = Math.min(80, this.textWidth(unit));
        this.resetTextColor();
        this.drawText(value.toString(), x, y, width - unitWidth - 6, 'right');
        this.changeTextColor(this.systemColor());
        this.drawText(unit, x + width - unitWidth, y, unitWidth, 'right');
    }
    ;
    paramchangeTextColor(change) {
        if (change > 0) {
            return this.powerUpColor();
        }
        else if (change < 0) {
            return this.powerDownColor();
        }
        else {
            return this.normalColor();
        }
    }
    ;
    setBackgroundType(type) {
        if (type === 0) {
            this.opacity = 255;
        }
        else {
            this.opacity = 0;
        }
        if (type === 1) {
            this.showBackgroundDimmer();
        }
        else {
            this.hideBackgroundDimmer();
        }
    }
    ;
    showBackgroundDimmer() {
        if (!this._dimmerSprite) {
            this._dimmerSprite = new Sprite();
            this._dimmerSprite.bitmap = new Bitmap(0, 0);
            this.addChildToBack(this._dimmerSprite);
        }
        const bitmap = this._dimmerSprite.bitmap;
        if (bitmap.width !== this.width || bitmap.height !== this.height) {
            this.refreshDimmerBitmap();
        }
        this._dimmerSprite.visible = true;
        this.updateBackgroundDimmer();
    }
    ;
    hideBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.visible = false;
        }
    }
    ;
    updateBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.opacity = this.openness;
        }
    }
    ;
    refreshDimmerBitmap() {
        if (this._dimmerSprite) {
            const bitmap = this._dimmerSprite.bitmap;
            const w = this.width;
            const h = this.height;
            const m = this.padding;
            const c1 = this.dimColor1();
            const c2 = this.dimColor2();
            bitmap.resize(w, h);
            bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
            bitmap.fillRect(0, m, w, h - m * 2, c1);
            bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
            this._dimmerSprite.setFrame(0, 0, w, h);
        }
    }
    ;
    dimColor1() {
        return 'rgba(0, 0, 0, 0.6)';
    }
    ;
    dimColor2() {
        return 'rgba(0, 0, 0, 0)';
    }
    ;
    canvasToLocalX(x) {
        let node = this;
        while (node) {
            x -= node.x;
            node = node.parent;
        }
        return x;
    }
    ;
    canvasToLocalY(y) {
        let node = this;
        while (node) {
            y -= node.y;
            node = node.parent;
        }
        return y;
    }
    ;
    reserveFaceImages() {
        $gameParty.members().forEach(function (actor) {
            ImageManager.reserveFace(actor.faceName());
        }, this);
    }
    ;
}
Window_Base._iconWidth = 32;
Window_Base._iconHeight = 32;
Window_Base._faceWidth = 144;
Window_Base._faceHeight = 144;

class Window_Selectable extends Window_Base {
    constructor(x, y, width, height, callback) {
        super(x, y, width, height, callback);
        this._index = -1;
        this._cursorFixed = false;
        this._cursorAll = false;
        this._stayCount = 0;
        this._helpWindow = null;
        this._handlers = {};
        this._touching = false;
        this._scrollX = 0;
        this._scrollY = 0;
        this.deactivate();
    }
    ;
    index() {
        return this._index;
    }
    ;
    cursorFixed() {
        return this._cursorFixed;
    }
    ;
    setCursorFixed(cursorFixed) {
        this._cursorFixed = cursorFixed;
    }
    ;
    cursorAll() {
        return this._cursorAll;
    }
    ;
    setCursorAll(cursorAll) {
        this._cursorAll = cursorAll;
    }
    ;
    maxCols() {
        return 1;
    }
    ;
    maxItems() {
        return 0;
    }
    ;
    spacing() {
        return 12;
    }
    ;
    itemWidth() {
        return Math.floor((this.width - this.padding * 2 +
            this.spacing()) / this.maxCols() - this.spacing());
    }
    ;
    itemHeight() {
        return Window_Base.lineHeight();
    }
    ;
    maxRows() {
        return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
    }
    ;
    activate() {
        super.activate();
        this.reselect();
    }
    ;
    deactivate() {
        super.deactivate();
        this.reselect();
    }
    ;
    select(index) {
        this._index = index;
        this._stayCount = 0;
        this.ensureCursorVisible();
        this.updateCursor();
        this.callUpdateHelp();
    }
    ;
    deselect() {
        this.select(-1);
    }
    ;
    reselect() {
        this.select(this._index);
    }
    ;
    row() {
        return Math.floor(this.index() / this.maxCols());
    }
    ;
    topRow() {
        return Math.floor(this._scrollY / this.itemHeight());
    }
    ;
    maxTopRow() {
        return Math.max(0, this.maxRows() - this.maxPageRows());
    }
    ;
    setTopRow(row) {
        const scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight();
        if (this._scrollY !== scrollY) {
            this._scrollY = scrollY;
            this.refresh();
            this.updateCursor();
        }
    }
    ;
    resetScroll() {
        this.setTopRow(0);
    }
    ;
    maxPageRows() {
        const pageHeight = this.height - this.padding * 2;
        return Math.floor(pageHeight / this.itemHeight());
    }
    ;
    maxPageItems() {
        return this.maxPageRows() * this.maxCols();
    }
    ;
    isHorizontal() {
        return this.maxPageRows() === 1;
    }
    ;
    bottomRow() {
        return Math.max(0, this.topRow() + this.maxPageRows() - 1);
    }
    ;
    setBottomRow(row) {
        this.setTopRow(row - (this.maxPageRows() - 1));
    }
    ;
    topIndex() {
        return this.topRow() * this.maxCols();
    }
    ;
    itemRect(index) {
        const rect = new PIXI.Rectangle();
        const maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    }
    ;
    itemRectForText(index) {
        const rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this.textPadding() * 2;
        return rect;
    }
    ;
    setHelpWindow(helpWindow) {
        this._helpWindow = helpWindow;
        this.callUpdateHelp();
    }
    ;
    showHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.show();
        }
    }
    ;
    hideHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.hide();
        }
    }
    ;
    setHandler(symbol, method) {
        this._handlers[symbol] = method;
    }
    ;
    isHandled(symbol) {
        return !!this._handlers[symbol];
    }
    ;
    callHandler(symbol) {
        if (this.isHandled(symbol)) {
            this._handlers[symbol]();
        }
    }
    ;
    isOpenAndActive() {
        return this.isOpen() && this.active;
    }
    ;
    isCursorMovable() {
        return (this.isOpenAndActive() && !this._cursorFixed &&
            !this._cursorAll && this.maxItems() > 0);
    }
    ;
    cursorDown(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.select((index + maxCols) % maxItems);
        }
    }
    ;
    cursorUp(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.select((index - maxCols + maxItems) % maxItems);
        }
    }
    ;
    cursorRight(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
            this.select((index + 1) % maxItems);
        }
    }
    ;
    cursorLeft(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
            this.select((index - 1 + maxItems) % maxItems);
        }
    }
    ;
    cursorPagedown() {
        const index = this.index();
        const maxItems = this.maxItems();
        if (this.topRow() + this.maxPageRows() < this.maxRows()) {
            this.setTopRow(this.topRow() + this.maxPageRows());
            this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
        }
    }
    ;
    cursorPageup() {
        const index = this.index();
        if (this.topRow() > 0) {
            this.setTopRow(this.topRow() - this.maxPageRows());
            this.select(Math.max(index - this.maxPageItems(), 0));
        }
    }
    ;
    scrollDown() {
        if (this.topRow() + 1 < this.maxRows()) {
            this.setTopRow(this.topRow() + 1);
        }
    }
    ;
    scrollUp() {
        if (this.topRow() > 0) {
            this.setTopRow(this.topRow() - 1);
        }
    }
    ;
    update() {
        super.update();
        this.updateArrows();
        this.processCursorMove();
        this.processHandling();
        this.processWheel();
        this.processTouch();
        this._stayCount++;
    }
    ;
    updateArrows() {
        const topRow = this.topRow();
        const maxTopRow = this.maxTopRow();
        this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
        this.upArrowVisible = topRow > 0;
    }
    ;
    processCursorMove() {
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
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
    }
    ;
    processHandling() {
        if (this.isOpenAndActive()) {
            if (this.isOkEnabled() && this.isOkTriggered()) {
                this.processOk();
            }
            else if (this.isCancelEnabled() && this.isCancelTriggered()) {
                this.processCancel();
            }
            else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
                this.processPagedown();
            }
            else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
                this.processPageup();
            }
        }
    }
    ;
    processWheel() {
        if (this.isOpenAndActive()) {
            const threshold = 20;
            if (TouchInput.wheelY >= threshold) {
                this.scrollDown();
            }
            if (TouchInput.wheelY <= -threshold) {
                this.scrollUp();
            }
        }
    }
    ;
    processTouch() {
        if (this.isOpenAndActive()) {
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this._touching = true;
                this.onTouch(true);
            }
            else if (TouchInput.isCancelled()) {
                if (this.isCancelEnabled()) {
                    this.processCancel();
                }
            }
            if (this._touching) {
                if (TouchInput.isPressed()) {
                    this.onTouch(false);
                }
                else {
                    this._touching = false;
                }
            }
        }
        else {
            this._touching = false;
        }
    }
    ;
    isTouchedInsideFrame() {
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    ;
    onTouch(triggered) {
        const lastIndex = this.index();
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        const hitIndex = this.hitTest(x, y);
        if (hitIndex >= 0) {
            if (hitIndex === this.index()) {
                if (triggered && this.isTouchOkEnabled()) {
                    this.processOk();
                }
            }
            else if (this.isCursorMovable()) {
                this.select(hitIndex);
            }
        }
        else if (this._stayCount >= 10) {
            if (y < this.padding) {
                this.cursorUp();
            }
            else if (y >= this.height - this.padding) {
                this.cursorDown();
            }
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
    ;
    hitTest(x, y) {
        if (this.isContentsArea(x, y)) {
            const cx = x - this.padding;
            const cy = y - this.padding;
            const topIndex = this.topIndex();
            for (let i = 0; i < this.maxPageItems(); i++) {
                const index = topIndex + i;
                if (index < this.maxItems()) {
                    const rect = this.itemRect(index);
                    const right = rect.x + rect.width;
                    const bottom = rect.y + rect.height;
                    if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                        return index;
                    }
                }
            }
        }
        return -1;
    }
    ;
    isContentsArea(x, y) {
        const left = this.padding;
        const top = this.padding;
        const right = this.width - this.padding;
        const bottom = this.height - this.padding;
        return (x >= left && y >= top && x < right && y < bottom);
    }
    ;
    isTouchOkEnabled() {
        return this.isOkEnabled();
    }
    ;
    isOkEnabled() {
        return this.isHandled('ok');
    }
    ;
    isCancelEnabled() {
        return this.isHandled('cancel');
    }
    ;
    isOkTriggered() {
        return Input.isRepeated('ok');
    }
    ;
    isCancelTriggered() {
        return Input.isRepeated('cancel');
    }
    ;
    processOk() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        }
        else {
            this.playBuzzerSound();
        }
    }
    ;
    playOkSound() {
        SoundManager.playOk();
    }
    ;
    playBuzzerSound() {
        SoundManager.playBuzzer();
    }
    ;
    callOkHandler() {
        this.callHandler('ok');
    }
    ;
    processCancel() {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    }
    ;
    callCancelHandler() {
        this.callHandler('cancel');
    }
    ;
    processPageup() {
        SoundManager.playCursor();
        this.updateInputData();
        this.deactivate();
        this.callHandler('pageup');
    }
    ;
    processPagedown() {
        SoundManager.playCursor();
        this.updateInputData();
        this.deactivate();
        this.callHandler('pagedown');
    }
    ;
    updateInputData() {
        Input.update();
        TouchInput.update();
    }
    ;
    updateCursor() {
        if (this._cursorAll) {
            const allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        }
        else if (this.isCursorVisible()) {
            const rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        }
        else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }
    ;
    isCursorVisible() {
        const row = this.row();
        return row >= this.topRow() && row <= this.bottomRow();
    }
    ;
    ensureCursorVisible() {
        const row = this.row();
        if (row < this.topRow()) {
            this.setTopRow(row);
        }
        else if (row > this.bottomRow()) {
            this.setBottomRow(row);
        }
    }
    ;
    callUpdateHelp() {
        if (this.active && this._helpWindow) {
            this.updateHelp();
        }
    }
    ;
    updateHelp() {
        this._helpWindow.clear();
    }
    ;
    setHelpWindowItem(item) {
        if (this._helpWindow) {
            this._helpWindow.setItem(item);
        }
    }
    ;
    isCurrentItemEnabled() {
        return true;
    }
    ;
    drawAllItems() {
        const topIndex = this.topIndex();
        for (let i = 0; i < this.maxPageItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItem(index);
            }
        }
    }
    ;
    drawItem(index) {
    }
    ;
    clearItem(index) {
        const rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    }
    ;
    redrawItem(index) {
        if (index >= 0) {
            this.clearItem(index);
            this.drawItem(index);
        }
    }
    ;
    redrawCurrentItem() {
        this.redrawItem(this.index());
    }
    ;
    refresh() {
        if (this.contents) {
            this.contents.clear();
            this.drawAllItems();
        }
    }
    ;
}

class Window_Command extends Window_Selectable {
    constructor(x, y, callback) {
        super(x, y, undefined, undefined, function () {
            if (callback !== undefined) {
                let cb = callback.bind(this);
                cb();
            }
            this.clearCommandList();
            this.makeCommandList();
        });
        this._list = [];
        this.refresh();
        this.select(0);
        this.activate();
    }
    ;
    windowWidth() {
        return 240;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    }
    ;
    numVisibleRows() {
        return Math.ceil(this.maxItems() / this.maxCols());
    }
    ;
    maxItems() {
        return this._list.length;
    }
    ;
    clearCommandList() {
        this._list = [];
    }
    ;
    makeCommandList() {
    }
    ;
    addCommand(name, symbol, enabled = true, ext = null) {
        this._list.push({
            name: name,
            symbol: symbol,
            enabled: enabled,
            ext: ext
        });
    }
    ;
    commandName(index) {
        return this._list[index].name;
    }
    ;
    commandSymbol(index) {
        return this._list[index].symbol;
    }
    ;
    isCommandEnabled(index) {
        return this._list[index].enabled;
    }
    ;
    currentData() {
        return this.index() >= 0 ? this._list[this.index()] : null;
    }
    ;
    isCurrentItemEnabled() {
        return this.currentData() ? this.currentData().enabled : false;
    }
    ;
    currentSymbol() {
        return this.currentData() ? this.currentData().symbol : null;
    }
    ;
    currentExt() {
        return this.currentData() ? this.currentData().ext : null;
    }
    ;
    findSymbol(symbol) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].symbol === symbol) {
                return i;
            }
        }
        return -1;
    }
    ;
    selectSymbol(symbol) {
        const index = this.findSymbol(symbol);
        if (index >= 0) {
            this.select(index);
        }
        else {
            this.select(0);
        }
    }
    ;
    findExt(ext) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].ext === ext) {
                return i;
            }
        }
        return -1;
    }
    ;
    selectExt(ext) {
        const index = this.findExt(ext);
        if (index >= 0) {
            this.select(index);
        }
        else {
            this.select(0);
        }
    }
    ;
    drawItem(index) {
        const rect = this.itemRectForText(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    }
    ;
    itemTextAlign() {
        return 'left';
    }
    ;
    isOkEnabled() {
        return true;
    }
    ;
    callOkHandler() {
        const symbol = this.currentSymbol();
        if (this.isHandled(symbol)) {
            this.callHandler(symbol);
        }
        else if (this.isHandled('ok')) {
            super.callOkHandler();
        }
        else {
            this.activate();
        }
    }
    ;
    refresh() {
        this.clearCommandList();
        this.makeCommandList();
        this.createContents();
        super.refresh();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_HorzCommand
//
// The command window for the horizontal selection format.
class Window_HorzCommand extends Window_Command {
    numVisibleRows() {
        return 1;
    }
    ;
    maxCols() {
        return 4;
    }
    ;
    itemTextAlign() {
        return 'center';
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.
class Window_Help extends Window_Base {
    /// NOTE (bungcip) : useless numLines?
    constructor(numLines) {
        super(0, 0, Graphics.boxWidth);
        this._text = '';
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(2);
    }
    setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    }
    ;
    clear() {
        this.setText('');
    }
    ;
    setItem(item) {
        this.setText(item ? item.description : '');
    }
    ;
    refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.
class Window_Gold extends Window_Base {
    constructor(x, y) {
        super(x, y);
        this.refresh();
    }
    ;
    windowWidth() {
        return 240;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(1);
    }
    ;
    refresh() {
        const x = this.textPadding();
        const width = this.contents.width - this.textPadding() * 2;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
    }
    ;
    value() {
        return $gameParty.gold();
    }
    ;
    currencyUnit() {
        return TextManager.currencyUnit;
    }
    ;
    open() {
        this.refresh();
        super.open();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.
class Window_MenuCommand extends Window_Command {
    constructor(x, y) {
        super(x, y);
        this.selectLast();
    }
    ;
    windowWidth() {
        return 240;
    }
    ;
    numVisibleRows() {
        return this.maxItems();
    }
    ;
    makeCommandList() {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    }
    ;
    addMainCommands() {
        const enabled = this.areMainCommandsEnabled();
        if (this.needsCommand('item')) {
            this.addCommand(TextManager.item, 'item', enabled);
        }
        if (this.needsCommand('skill')) {
            this.addCommand(TextManager.skill, 'skill', enabled);
        }
        if (this.needsCommand('equip')) {
            this.addCommand(TextManager.equip, 'equip', enabled);
        }
        if (this.needsCommand('status')) {
            this.addCommand(TextManager.status, 'status', enabled);
        }
    }
    ;
    addFormationCommand() {
        if (this.needsCommand('formation')) {
            const enabled = this.isFormationEnabled();
            this.addCommand(TextManager.formation, 'formation', enabled);
        }
    }
    ;
    addOriginalCommands() {
    }
    ;
    addOptionsCommand() {
        if (this.needsCommand('options')) {
            const enabled = this.isOptionsEnabled();
            this.addCommand(TextManager.options, 'options', enabled);
        }
    }
    ;
    addSaveCommand() {
        if (this.needsCommand('save')) {
            const enabled = this.isSaveEnabled();
            this.addCommand(TextManager.save, 'save', enabled);
        }
    }
    ;
    addGameEndCommand() {
        const enabled = this.isGameEndEnabled();
        this.addCommand(TextManager.gameEnd, 'gameEnd', enabled);
    }
    ;
    needsCommand(name) {
        const flags = $dataSystem.menuCommands;
        if (flags) {
            switch (name) {
                case 'item':
                    return flags[0];
                case 'skill':
                    return flags[1];
                case 'equip':
                    return flags[2];
                case 'status':
                    return flags[3];
                case 'formation':
                    return flags[4];
                case 'save':
                    return flags[5];
            }
        }
        return true;
    }
    ;
    areMainCommandsEnabled() {
        return $gameParty.exists();
    }
    ;
    isFormationEnabled() {
        return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
    }
    ;
    isOptionsEnabled() {
        return true;
    }
    ;
    isSaveEnabled() {
        return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
    }
    ;
    isGameEndEnabled() {
        return true;
    }
    ;
    processOk() {
        Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }
    ;
    selectLast() {
        this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
    }
    ;
}
Window_MenuCommand._lastCommandSymbol = null;
Window_MenuCommand.initCommandPosition = function () {
    this._lastCommandSymbol = null;
};

//-----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.
class Window_MenuStatus extends Window_Selectable {
    constructor(x, y) {
        super(x, y);
        this._formationMode = false;
        this._pendingIndex = -1;
        this.refresh();
    }
    ;
    windowWidth() {
        return Graphics.boxWidth - 240;
    }
    ;
    windowHeight() {
        return Graphics.boxHeight;
    }
    ;
    maxItems() {
        return $gameParty.size();
    }
    ;
    itemHeight() {
        const clientHeight = this.height - this.padding * 2;
        return Math.floor(clientHeight / this.numVisibleRows());
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    loadImages() {
        $gameParty.members().forEach(function (actor) {
            ImageManager.reserveFace(actor.faceName());
        }, this);
    }
    ;
    drawItem(index) {
        this.drawItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }
    ;
    drawItemBackground(index) {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = this.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    }
    ;
    drawItemImage(index) {
        const actor = $gameParty.members()[index];
        const rect = this.itemRect(index);
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
        this.changePaintOpacity(true);
    }
    ;
    drawItemStatus(index) {
        const actor = $gameParty.members()[index];
        const rect = this.itemRect(index);
        const x = rect.x + 162;
        const y = rect.y + rect.height / 2 - Window_Base.lineHeight() * 1.5;
        const width = rect.width - x - this.textPadding();
        this.drawActorSimpleStatus(actor, x, y, width);
    }
    ;
    processOk() {
        super.processOk();
        $gameParty.setMenuActor($gameParty.members()[this.index()]);
    }
    ;
    isCurrentItemEnabled() {
        if (this._formationMode) {
            const actor = $gameParty.members()[this.index()];
            return actor && actor.isFormationChangeOk();
        }
        else {
            return true;
        }
    }
    ;
    selectLast() {
        this.select($gameParty.menuActor().index() || 0);
    }
    ;
    formationMode() {
        return this._formationMode;
    }
    ;
    setFormationMode(formationMode) {
        this._formationMode = formationMode;
    }
    ;
    pendingIndex() {
        return this._pendingIndex;
    }
    ;
    setPendingIndex(index) {
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.
class Game_Temp {
    constructor() {
        this._commonEventId = 0;
        this._destinationX = null;
        this._destinationY = null;
        this._isPlaytest = Utils.isOptionValid('test');
    }
    ;
    isPlaytest() {
        return this._isPlaytest;
    }
    ;
    reserveCommonEvent(commonEventId) {
        this._commonEventId = commonEventId;
    }
    ;
    clearCommonEvent() {
        this._commonEventId = 0;
    }
    ;
    isCommonEventReserved() {
        return this._commonEventId > 0;
    }
    ;
    reservedCommonEvent() {
        return $dataCommonEvents[this._commonEventId];
    }
    ;
    setDestination(x, y) {
        this._destinationX = x;
        this._destinationY = y;
    }
    ;
    clearDestination() {
        this._destinationX = null;
        this._destinationY = null;
    }
    ;
    isDestinationValid() {
        return this._destinationX !== null;
    }
    ;
    destinationX() {
        return this._destinationX;
    }
    ;
    destinationY() {
        return this._destinationY;
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.
class Game_System {
    constructor() {
        this._saveEnabled = true;
        this._menuEnabled = true;
        this._encounterEnabled = true;
        this._formationEnabled = true;
        this._battleCount = 0;
        this._winCount = 0;
        this._escapeCount = 0;
        this._saveCount = 0;
        this._versionId = 0;
        this._framesOnSave = 0;
        this._bgmOnSave = null;
        this._bgsOnSave = null;
        this._windowTone = null;
        this._battleBgm = null;
        this._victoryMe = null;
        this._defeatMe = null;
        this._savedBgm = null;
        this._walkingBgm = null;
    }
    isJapanese() {
        return $dataSystem.locale.match(/^ja/);
    }
    ;
    isChinese() {
        return $dataSystem.locale.match(/^zh/);
    }
    ;
    isKorean() {
        return $dataSystem.locale.match(/^ko/);
    }
    ;
    isCJK() {
        return $dataSystem.locale.match(/^(ja|zh|ko)/);
    }
    ;
    isRussian() {
        return $dataSystem.locale.match(/^ru/);
    }
    ;
    isSideView() {
        return $dataSystem.optSideView;
    }
    ;
    isSaveEnabled() {
        return this._saveEnabled;
    }
    ;
    disableSave() {
        this._saveEnabled = false;
    }
    ;
    enableSave() {
        this._saveEnabled = true;
    }
    ;
    isMenuEnabled() {
        return this._menuEnabled;
    }
    ;
    disableMenu() {
        this._menuEnabled = false;
    }
    ;
    enableMenu() {
        this._menuEnabled = true;
    }
    ;
    isEncounterEnabled() {
        return this._encounterEnabled;
    }
    ;
    disableEncounter() {
        this._encounterEnabled = false;
    }
    ;
    enableEncounter() {
        this._encounterEnabled = true;
    }
    ;
    isFormationEnabled() {
        return this._formationEnabled;
    }
    ;
    disableFormation() {
        this._formationEnabled = false;
    }
    ;
    enableFormation() {
        this._formationEnabled = true;
    }
    ;
    battleCount() {
        return this._battleCount;
    }
    ;
    winCount() {
        return this._winCount;
    }
    ;
    escapeCount() {
        return this._escapeCount;
    }
    ;
    saveCount() {
        return this._saveCount;
    }
    ;
    versionId() {
        return this._versionId;
    }
    ;
    windowTone() {
        return this._windowTone || $dataSystem.windowTone;
    }
    ;
    setWindowTone(value) {
        this._windowTone = value;
    }
    ;
    battleBgm() {
        return this._battleBgm || $dataSystem.battleBgm;
    }
    ;
    setBattleBgm(value) {
        this._battleBgm = value;
    }
    ;
    victoryMe() {
        return this._victoryMe || $dataSystem.victoryMe;
    }
    ;
    setVictoryMe(value) {
        this._victoryMe = value;
    }
    ;
    defeatMe() {
        return this._defeatMe || $dataSystem.defeatMe;
    }
    ;
    setDefeatMe(value) {
        this._defeatMe = value;
    }
    ;
    onBattleStart() {
        this._battleCount++;
    }
    ;
    onBattleWin() {
        this._winCount++;
    }
    ;
    onBattleEscape() {
        this._escapeCount++;
    }
    ;
    onBeforeSave() {
        this._saveCount++;
        this._versionId = $dataSystem.versionId;
        this._framesOnSave = Graphics.frameCount;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    }
    ;
    onAfterLoad() {
        Graphics.frameCount = this._framesOnSave;
        AudioManager.playBgm(this._bgmOnSave);
        AudioManager.playBgs(this._bgsOnSave);
    }
    ;
    playtime() {
        return Math.floor(Graphics.frameCount / 60);
    }
    ;
    playtimeText() {
        const hour = Math.floor(this.playtime() / 60 / 60);
        const min = Math.floor(this.playtime() / 60) % 60;
        const sec = this.playtime() % 60;
        return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2);
    }
    ;
    saveBgm() {
        this._savedBgm = AudioManager.saveBgm();
    }
    ;
    replayBgm() {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    }
    ;
    saveWalkingBgm() {
        this._walkingBgm = AudioManager.saveBgm();
    }
    ;
    replayWalkingBgm() {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    }
    ;
    saveWalkingBgm2() {
        this._walkingBgm = $dataMap.bgm;
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.
class Game_Timer {
    constructor() {
        this._frames = 0;
        this._working = false;
    }
    update(sceneActive) {
        if (sceneActive && this._working && this._frames > 0) {
            this._frames--;
            if (this._frames === 0) {
                this.onExpire();
            }
        }
    }
    ;
    start(count) {
        this._frames = count;
        this._working = true;
    }
    ;
    stop() {
        this._working = false;
    }
    ;
    isWorking() {
        return this._working;
    }
    ;
    seconds() {
        return Math.floor(this._frames / 60);
    }
    ;
    onExpire() {
        BattleManager.abort();
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.
class Game_Message {
    constructor() {
        this.clear();
    }
    ;
    clear() {
        this._texts = [];
        this._choices = [];
        this._faceName = '';
        this._faceIndex = 0;
        this._background = 0;
        this._positionType = 2;
        this._choiceDefaultType = 0;
        this._choiceCancelType = 0;
        this._choiceBackground = 0;
        this._choicePositionType = 2;
        this._numInputVariableId = 0;
        this._numInputMaxDigits = 0;
        this._itemChoiceVariableId = 0;
        this._itemChoiceItypeId = 0;
        this._scrollMode = false;
        this._scrollSpeed = 2;
        this._scrollNoFast = false;
        this._choiceCallback = null;
    }
    ;
    choices() {
        return this._choices;
    }
    ;
    faceName() {
        return this._faceName;
    }
    ;
    faceIndex() {
        return this._faceIndex;
    }
    ;
    background() {
        return this._background;
    }
    ;
    positionType() {
        return this._positionType;
    }
    ;
    choiceDefaultType() {
        return this._choiceDefaultType;
    }
    ;
    choiceCancelType() {
        return this._choiceCancelType;
    }
    ;
    choiceBackground() {
        return this._choiceBackground;
    }
    ;
    choicePositionType() {
        return this._choicePositionType;
    }
    ;
    numInputVariableId() {
        return this._numInputVariableId;
    }
    ;
    numInputMaxDigits() {
        return this._numInputMaxDigits;
    }
    ;
    itemChoiceVariableId() {
        return this._itemChoiceVariableId;
    }
    ;
    itemChoiceItypeId() {
        return this._itemChoiceItypeId;
    }
    ;
    scrollMode() {
        return this._scrollMode;
    }
    ;
    scrollSpeed() {
        return this._scrollSpeed;
    }
    ;
    scrollNoFast() {
        return this._scrollNoFast;
    }
    ;
    add(text) {
        this._texts.push(text);
    }
    ;
    setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    }
    ;
    setBackground(background) {
        this._background = background;
    }
    ;
    setPositionType(positionType) {
        this._positionType = positionType;
    }
    ;
    setChoices(choices, defaultType, cancelType) {
        this._choices = choices;
        this._choiceDefaultType = defaultType;
        this._choiceCancelType = cancelType;
    }
    ;
    setChoiceBackground(background) {
        this._choiceBackground = background;
    }
    ;
    setChoicePositionType(positionType) {
        this._choicePositionType = positionType;
    }
    ;
    setNumberInput(variableId, maxDigits) {
        this._numInputVariableId = variableId;
        this._numInputMaxDigits = maxDigits;
    }
    ;
    setItemChoice(variableId, itemType) {
        this._itemChoiceVariableId = variableId;
        this._itemChoiceItypeId = itemType;
    }
    ;
    setScroll(speed, noFast) {
        this._scrollMode = true;
        this._scrollSpeed = speed;
        this._scrollNoFast = noFast;
    }
    ;
    setChoiceCallback(callback) {
        this._choiceCallback = callback;
    }
    ;
    onChoice(n) {
        if (this._choiceCallback) {
            this._choiceCallback(n);
            this._choiceCallback = null;
        }
    }
    ;
    hasText() {
        return this._texts.length > 0;
    }
    ;
    isChoice() {
        return this._choices.length > 0;
    }
    ;
    isNumberInput() {
        return this._numInputVariableId > 0;
    }
    ;
    isItemChoice() {
        return this._itemChoiceVariableId > 0;
    }
    ;
    isBusy() {
        return (this.hasText() || this.isChoice() ||
            this.isNumberInput() || this.isItemChoice());
    }
    ;
    newPage() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += '\f';
        }
    }
    ;
    allText() {
        return this._texts.join('\n');
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.
class Game_Switches {
    constructor() {
        this._data = [];
    }
    clear() {
        this._data = [];
    }
    ;
    value(switchId) {
        return !!this._data[switchId];
    }
    ;
    setValue(switchId, value) {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    }
    ;
    onChange() {
        $gameMap.requestRefresh();
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.
class Game_Variables {
    constructor() {
        this.clear();
    }
    ;
    clear() {
        this._data = [];
    }
    ;
    value(variableId) {
        return this._data[variableId] || 0;
    }
    ;
    setValue(variableId, value) {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (typeof value === 'number') {
                value = Math.floor(value);
            }
            this._data[variableId] = value;
            this.onChange();
        }
    }
    ;
    onChange() {
        $gameMap.requestRefresh();
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.
class Game_SelfSwitches {
    constructor() {
        this._data = {};
    }
    clear() {
        this._data = {};
    }
    ;
    /// NOTE(bungcip: changed to any because weird line in Game_Event.ts: 224)
    value(key) {
        return !!this._data[key];
    }
    ;
    setValue(key, value) {
        if (value) {
            this._data[key] = true;
        }
        else {
            delete this._data[key];
        }
        this.onChange();
    }
    ;
    onChange() {
        $gameMap.requestRefresh();
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.
class Game_Picture {
    constructor() {
        this.initBasic();
        this.initTarget();
        this.initTone();
        this.initRotation();
    }
    ;
    name() {
        return this._name;
    }
    ;
    origin() {
        return this._origin;
    }
    ;
    x() {
        return this._x;
    }
    ;
    y() {
        return this._y;
    }
    ;
    scaleX() {
        return this._scaleX;
    }
    ;
    scaleY() {
        return this._scaleY;
    }
    ;
    opacity() {
        return this._opacity;
    }
    ;
    blendMode() {
        return this._blendMode;
    }
    ;
    tone() {
        return this._tone;
    }
    ;
    angle() {
        return this._angle;
    }
    ;
    initBasic() {
        this._name = '';
        this._origin = 0;
        this._x = 0;
        this._y = 0;
        this._scaleX = 100;
        this._scaleY = 100;
        this._opacity = 255;
        this._blendMode = 0;
    }
    ;
    initTarget() {
        this._targetX = this._x;
        this._targetY = this._y;
        this._targetScaleX = this._scaleX;
        this._targetScaleY = this._scaleY;
        this._targetOpacity = this._opacity;
        this._duration = 0;
    }
    ;
    initTone() {
        this._tone = null;
        this._toneTarget = null;
        this._toneDuration = 0;
    }
    ;
    initRotation() {
        this._angle = 0;
        this._rotationSpeed = 0;
    }
    ;
    show(name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
        this._name = name;
        this._origin = origin;
        this._x = x;
        this._y = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._opacity = opacity;
        this._blendMode = blendMode;
        this.initTarget();
        this.initTone();
        this.initRotation();
    }
    ;
    move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
        this._origin = origin;
        this._targetX = x;
        this._targetY = y;
        this._targetScaleX = scaleX;
        this._targetScaleY = scaleY;
        this._targetOpacity = opacity;
        this._blendMode = blendMode;
        this._duration = duration;
    }
    ;
    rotate(speed) {
        this._rotationSpeed = speed;
    }
    ;
    tint(tone, duration) {
        if (!this._tone) {
            this._tone = [0, 0, 0, 0];
        }
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    }
    ;
    erase() {
        this._name = '';
        this._origin = 0;
        this.initTarget();
        this.initTone();
        this.initRotation();
    }
    ;
    update() {
        this.updateMove();
        this.updateTone();
        this.updateRotation();
    }
    ;
    updateMove() {
        if (this._duration > 0) {
            const d = this._duration;
            this._x = (this._x * (d - 1) + this._targetX) / d;
            this._y = (this._y * (d - 1) + this._targetY) / d;
            this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
            this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
            this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
            this._duration--;
        }
    }
    ;
    updateTone() {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    }
    ;
    updateRotation() {
        if (this._rotationSpeed !== 0) {
            this._angle += this._rotationSpeed / 2;
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.
class Game_Screen {
    constructor() {
        this.clear();
    }
    ;
    clear() {
        this.clearFade();
        this.clearTone();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.clearWeather();
        this.clearPictures();
    }
    ;
    onBattleStart() {
        this.clearFade();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.eraseBattlePictures();
    }
    ;
    brightness() {
        return this._brightness;
    }
    ;
    tone() {
        return this._tone;
    }
    ;
    flashColor() {
        return this._flashColor;
    }
    ;
    shake() {
        return this._shake;
    }
    ;
    zoomX() {
        return this._zoomX;
    }
    ;
    zoomY() {
        return this._zoomY;
    }
    ;
    zoomScale() {
        return this._zoomScale;
    }
    ;
    weatherType() {
        return this._weatherType;
    }
    ;
    weatherPower() {
        return this._weatherPower;
    }
    ;
    picture(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        return this._pictures[realPictureId];
    }
    ;
    realPictureId(pictureId) {
        if ($gameParty.inBattle()) {
            return pictureId + this.maxPictures();
        }
        else {
            return pictureId;
        }
    }
    ;
    clearFade() {
        this._brightness = 255;
        this._fadeOutDuration = 0;
        this._fadeInDuration = 0;
    }
    ;
    clearTone() {
        this._tone = [0, 0, 0, 0];
        this._toneTarget = [0, 0, 0, 0];
        this._toneDuration = 0;
    }
    ;
    clearFlash() {
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
    }
    ;
    clearShake() {
        this._shakePower = 0;
        this._shakeSpeed = 0;
        this._shakeDuration = 0;
        this._shakeDirection = 1;
        this._shake = 0;
    }
    ;
    clearZoom() {
        this._zoomX = 0;
        this._zoomY = 0;
        this._zoomScale = 1;
        this._zoomScaleTarget = 1;
        this._zoomDuration = 0;
    }
    ;
    clearWeather() {
        this._weatherType = 'none';
        this._weatherPower = 0;
        this._weatherPowerTarget = 0;
        this._weatherDuration = 0;
    }
    ;
    clearPictures() {
        this._pictures = [];
    }
    ;
    eraseBattlePictures() {
        this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
    }
    ;
    maxPictures() {
        return 100;
    }
    ;
    startFadeOut(duration) {
        this._fadeOutDuration = duration;
        this._fadeInDuration = 0;
    }
    ;
    startFadeIn(duration) {
        this._fadeInDuration = duration;
        this._fadeOutDuration = 0;
    }
    ;
    startTint(tone, duration) {
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    }
    ;
    startFlash(color, duration) {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    }
    ;
    startShake(power, speed, duration) {
        this._shakePower = power;
        this._shakeSpeed = speed;
        this._shakeDuration = duration;
    }
    ;
    startZoom(x, y, scale, duration) {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScaleTarget = scale;
        this._zoomDuration = duration;
    }
    ;
    setZoom(x, y, scale) {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScale = scale;
    }
    ;
    changeWeather(type, power, duration) {
        if (type !== 'none' || duration === 0) {
            this._weatherType = type;
        }
        this._weatherPowerTarget = type === 'none' ? 0 : power;
        this._weatherDuration = duration;
        if (duration === 0) {
            this._weatherPower = this._weatherPowerTarget;
        }
    }
    ;
    update() {
        this.updateFadeOut();
        this.updateFadeIn();
        this.updateTone();
        this.updateFlash();
        this.updateShake();
        this.updateZoom();
        this.updateWeather();
        this.updatePictures();
    }
    ;
    updateFadeOut() {
        if (this._fadeOutDuration > 0) {
            const d = this._fadeOutDuration;
            this._brightness = (this._brightness * (d - 1)) / d;
            this._fadeOutDuration--;
        }
    }
    ;
    updateFadeIn() {
        if (this._fadeInDuration > 0) {
            const d = this._fadeInDuration;
            this._brightness = (this._brightness * (d - 1) + 255) / d;
            this._fadeInDuration--;
        }
    }
    ;
    updateTone() {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    }
    ;
    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration;
            this._flashColor[3] *= (d - 1) / d;
            this._flashDuration--;
        }
    }
    ;
    updateShake() {
        if (this._shakeDuration > 0 || this._shake !== 0) {
            const delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
                this._shake = 0;
            }
            else {
                this._shake += delta;
            }
            if (this._shake > this._shakePower * 2) {
                this._shakeDirection = -1;
            }
            if (this._shake < -this._shakePower * 2) {
                this._shakeDirection = 1;
            }
            this._shakeDuration--;
        }
    }
    ;
    updateZoom() {
        if (this._zoomDuration > 0) {
            const d = this._zoomDuration;
            const t = this._zoomScaleTarget;
            this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
            this._zoomDuration--;
        }
    }
    ;
    updateWeather() {
        if (this._weatherDuration > 0) {
            const d = this._weatherDuration;
            const t = this._weatherPowerTarget;
            this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
            this._weatherDuration--;
            if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
                this._weatherType = 'none';
            }
        }
    }
    ;
    updatePictures() {
        this._pictures.forEach(function (picture) {
            if (picture) {
                picture.update();
            }
        });
    }
    ;
    startFlashForDamage() {
        this.startFlash([255, 0, 0, 128], 8);
    }
    ;
    showPicture(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
        const realPictureId = this.realPictureId(pictureId);
        const picture = new Game_Picture();
        picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
        this._pictures[realPictureId] = picture;
    }
    ;
    movePicture(pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
        }
    }
    ;
    rotatePicture(pictureId, speed) {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.rotate(speed);
        }
    }
    ;
    tintPicture(pictureId, tone, duration) {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.tint(tone, duration);
        }
    }
    ;
    erasePicture(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        this._pictures[realPictureId] = null;
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.
class Game_Item {
    constructor(item) {
        this._dataClass = '';
        this._itemId = 0;
        if (item) {
            this.setObject(item);
        }
    }
    ;
    isSkill() {
        return this._dataClass === 'skill';
    }
    ;
    isItem() {
        return this._dataClass === 'item';
    }
    ;
    isUsableItem() {
        return this.isSkill() || this.isItem();
    }
    ;
    isWeapon() {
        return this._dataClass === 'weapon';
    }
    ;
    isArmor() {
        return this._dataClass === 'armor';
    }
    ;
    isEquipItem() {
        return this.isWeapon() || this.isArmor();
    }
    ;
    isNull() {
        return this._dataClass === '';
    }
    ;
    itemId() {
        return this._itemId;
    }
    ;
    object() {
        if (this.isSkill()) {
            return $dataSkills[this._itemId];
        }
        else if (this.isItem()) {
            return $dataItems[this._itemId];
        }
        else if (this.isWeapon()) {
            return $dataWeapons[this._itemId];
        }
        else if (this.isArmor()) {
            return $dataArmors[this._itemId];
        }
        else {
            return null;
        }
    }
    ;
    setObject(item) {
        if (DataManager.isSkill(item)) {
            this._dataClass = 'skill';
        }
        else if (DataManager.isItem(item)) {
            this._dataClass = 'item';
        }
        else if (DataManager.isWeapon(item)) {
            this._dataClass = 'weapon';
        }
        else if (DataManager.isArmor(item)) {
            this._dataClass = 'armor';
        }
        else {
            this._dataClass = '';
        }
        this._itemId = item ? item.id : 0;
    }
    ;
    setEquip(isWeapon, itemId) {
        this._dataClass = isWeapon ? 'weapon' : 'armor';
        this._itemId = itemId;
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.
var ActionEffect;
(function (ActionEffect) {
    ActionEffect[ActionEffect["RECOVER_HP"] = 11] = "RECOVER_HP";
    ActionEffect[ActionEffect["RECOVER_MP"] = 12] = "RECOVER_MP";
    ActionEffect[ActionEffect["GAIN_TP"] = 13] = "GAIN_TP";
    ActionEffect[ActionEffect["ADD_STATE"] = 21] = "ADD_STATE";
    ActionEffect[ActionEffect["REMOVE_STATE"] = 22] = "REMOVE_STATE";
    ActionEffect[ActionEffect["ADD_BUFF"] = 31] = "ADD_BUFF";
    ActionEffect[ActionEffect["ADD_DEBUFF"] = 32] = "ADD_DEBUFF";
    ActionEffect[ActionEffect["REMOVE_BUFF"] = 33] = "REMOVE_BUFF";
    ActionEffect[ActionEffect["REMOVE_DEBUFF"] = 34] = "REMOVE_DEBUFF";
    ActionEffect[ActionEffect["SPECIAL"] = 41] = "SPECIAL";
    ActionEffect[ActionEffect["GROW"] = 42] = "GROW";
    ActionEffect[ActionEffect["LEARN_SKILL"] = 43] = "LEARN_SKILL";
    ActionEffect[ActionEffect["COMMON_EVENT"] = 44] = "COMMON_EVENT";
})(ActionEffect || (ActionEffect = {}));
var HitType;
(function (HitType) {
    HitType[HitType["CERTAIN"] = 0] = "CERTAIN";
    HitType[HitType["PHYSICAL"] = 1] = "PHYSICAL";
    HitType[HitType["MAGICAL"] = 2] = "MAGICAL";
})(HitType || (HitType = {}));
class Game_Action {
    constructor(subject, forcing = false) {
        this._subjectActorId = 0;
        this._subjectEnemyIndex = -1;
        this._forcing = forcing;
        this.setSubject(subject);
        this.clear();
    }
    ;
    clear() {
        this._item = new Game_Item();
        this._targetIndex = -1;
    }
    ;
    setSubject(subject) {
        if (subject.isActor()) {
            this._subjectActorId = subject.actorId();
            this._subjectEnemyIndex = -1;
        }
        else if (subject.isEnemy()) {
            this._subjectEnemyIndex = subject.index();
            this._subjectActorId = 0;
        }
    }
    ;
    subject() {
        if (this._subjectActorId > 0) {
            return $gameActors.actor(this._subjectActorId);
        }
        else {
            return $gameTroop.members()[this._subjectEnemyIndex];
        }
    }
    ;
    friendsUnit() {
        return this.subject().friendsUnit();
    }
    ;
    opponentsUnit() {
        return this.subject().opponentsUnit();
    }
    ;
    setEnemyAction(action) {
        if (action) {
            this.setSkill(action.skillId);
        }
        else {
            this.clear();
        }
    }
    ;
    setAttack() {
        this.setSkill(this.subject().attackSkillId());
    }
    ;
    setGuard() {
        this.setSkill(this.subject().guardSkillId());
    }
    ;
    setSkill(skillId) {
        this._item.setObject($dataSkills[skillId]);
    }
    ;
    setItem(itemId) {
        this._item.setObject($dataItems[itemId]);
    }
    ;
    setItemObject(object) {
        this._item.setObject(object);
    }
    ;
    setTarget(targetIndex) {
        this._targetIndex = targetIndex;
    }
    ;
    item() {
        return this._item.object();
    }
    ;
    isSkill() {
        return this._item.isSkill();
    }
    ;
    isItem() {
        return this._item.isItem();
    }
    ;
    numRepeats() {
        let repeats = this.item().repeats;
        if (this.isAttack()) {
            repeats += this.subject().attackTimesAdd();
        }
        return Math.floor(repeats);
    }
    ;
    checkItemScope(list) {
        let scope = this.item().scope;
        return list.contains(scope);
    }
    ;
    isForOpponent() {
        return this.checkItemScope([1, 2, 3, 4, 5, 6]);
    }
    ;
    isForFriend() {
        return this.checkItemScope([7, 8, 9, 10, 11]);
    }
    ;
    isForDeadFriend() {
        return this.checkItemScope([9, 10]);
    }
    ;
    isForUser() {
        return this.checkItemScope([11]);
    }
    ;
    isForOne() {
        return this.checkItemScope([1, 3, 7, 9, 11]);
    }
    ;
    isForRandom() {
        return this.checkItemScope([3, 4, 5, 6]);
    }
    ;
    isForAll() {
        return this.checkItemScope([2, 8, 10]);
    }
    ;
    needsSelection() {
        return this.checkItemScope([1, 7, 9]);
    }
    ;
    numTargets() {
        return this.isForRandom() ? this.item().scope - 2 : 0;
    }
    ;
    checkDamageType(list) {
        return list.contains(this.item().damage.type);
    }
    ;
    isHpEffect() {
        return this.checkDamageType([1, 3, 5]);
    }
    ;
    isMpEffect() {
        return this.checkDamageType([2, 4, 6]);
    }
    ;
    isDamage() {
        return this.checkDamageType([1, 2]);
    }
    ;
    isRecover() {
        return this.checkDamageType([3, 4]);
    }
    ;
    isDrain() {
        return this.checkDamageType([5, 6]);
    }
    ;
    isHpRecover() {
        return this.checkDamageType([3]);
    }
    ;
    isMpRecover() {
        return this.checkDamageType([4]);
    }
    ;
    isCertainHit() {
        return this.item().hitType === HitType.CERTAIN;
    }
    ;
    isPhysical() {
        return this.item().hitType === HitType.PHYSICAL;
    }
    ;
    isMagical() {
        return this.item().hitType === HitType.MAGICAL;
    }
    ;
    isAttack() {
        return this.item() === $dataSkills[this.subject().attackSkillId()];
    }
    ;
    isGuard() {
        return this.item() === $dataSkills[this.subject().guardSkillId()];
    }
    ;
    isMagicSkill() {
        if (this.isSkill()) {
            return $dataSystem.magicSkills.contains(this.item().stypeId);
        }
        else {
            return false;
        }
    }
    ;
    decideRandomTarget() {
        let target;
        if (this.isForDeadFriend()) {
            target = this.friendsUnit().randomDeadTarget();
        }
        else if (this.isForFriend()) {
            target = this.friendsUnit().randomTarget();
        }
        else {
            target = this.opponentsUnit().randomTarget();
        }
        if (target) {
            this._targetIndex = target.index();
        }
        else {
            this.clear();
        }
    }
    ;
    setConfusion() {
        this.setAttack();
    }
    ;
    prepare() {
        if (this.subject().isConfused() && !this._forcing) {
            this.setConfusion();
        }
    }
    ;
    isValid() {
        return (this._forcing && this.item() !== null) || this.subject().canUse(this.item());
    }
    ;
    speed() {
        const agi = this.subject().agi;
        let speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
        if (this.item()) {
            speed += this.item().speed;
        }
        if (this.isAttack()) {
            speed += this.subject().attackSpeed();
        }
        return speed;
    }
    ;
    makeTargets() {
        let targets = [];
        if (!this._forcing && this.subject().isConfused()) {
            targets = [this.confusionTarget()];
        }
        else if (this.isForOpponent()) {
            targets = this.targetsForOpponents();
        }
        else if (this.isForFriend()) {
            targets = this.targetsForFriends();
        }
        return this.repeatTargets(targets);
    }
    ;
    repeatTargets(targets) {
        const repeatedTargets = [];
        const repeats = this.numRepeats();
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (target) {
                for (let j = 0; j < repeats; j++) {
                    repeatedTargets.push(target);
                }
            }
        }
        return repeatedTargets;
    }
    ;
    confusionTarget() {
        switch (this.subject().confusionLevel()) {
            case 1:
                return this.opponentsUnit().randomTarget();
            case 2:
                if (Math.randomInt(2) === 0) {
                    return this.opponentsUnit().randomTarget();
                }
                return this.friendsUnit().randomTarget();
            default:
                return this.friendsUnit().randomTarget();
        }
    }
    ;
    targetsForOpponents() {
        let targets = [];
        const unit = this.opponentsUnit();
        if (this.isForRandom()) {
            for (let i = 0; i < this.numTargets(); i++) {
                targets.push(unit.randomTarget());
            }
        }
        else if (this.isForOne()) {
            if (this._targetIndex < 0) {
                targets.push(unit.randomTarget());
            }
            else {
                targets.push(unit.smoothTarget(this._targetIndex));
            }
        }
        else {
            targets = unit.aliveMembers();
        }
        return targets;
    }
    ;
    targetsForFriends() {
        let targets = [];
        const unit = this.friendsUnit();
        if (this.isForUser()) {
            return [this.subject()];
        }
        else if (this.isForDeadFriend()) {
            if (this.isForOne()) {
                targets.push(unit.smoothDeadTarget(this._targetIndex));
            }
            else {
                targets = unit.deadMembers();
            }
        }
        else if (this.isForOne()) {
            if (this._targetIndex < 0) {
                targets.push(unit.randomTarget());
            }
            else {
                targets.push(unit.smoothTarget(this._targetIndex));
            }
        }
        else {
            targets = unit.aliveMembers();
        }
        return targets;
    }
    ;
    evaluate() {
        let value = 0;
        this.itemTargetCandidates().forEach(function (target) {
            const targetValue = this.evaluateWithTarget(target);
            if (this.isForAll()) {
                value += targetValue;
            }
            else if (targetValue > value) {
                value = targetValue;
                this._targetIndex = target.index();
            }
        }, this);
        value *= this.numRepeats();
        if (value > 0) {
            value += Math.random();
        }
        return value;
    }
    ;
    itemTargetCandidates() {
        if (!this.isValid()) {
            return [];
        }
        else if (this.isForOpponent()) {
            return this.opponentsUnit().aliveMembers();
        }
        else if (this.isForUser()) {
            return [this.subject()];
        }
        else if (this.isForDeadFriend()) {
            return this.friendsUnit().deadMembers();
        }
        else {
            return this.friendsUnit().aliveMembers();
        }
    }
    ;
    evaluateWithTarget(target) {
        if (this.isHpEffect()) {
            const value = this.makeDamageValue(target, false);
            if (this.isForOpponent()) {
                return value / Math.max(target.hp, 1);
            }
            else {
                const recovery = Math.min(-value, target.mhp - target.hp);
                return recovery / target.mhp;
            }
        }
    }
    ;
    testApply(target) {
        return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
                (this.isHpRecover() && target.hp < target.mhp) ||
                (this.isMpRecover() && target.mp < target.mmp) ||
                (this.hasItemAnyValidEffects(target))));
    }
    ;
    hasItemAnyValidEffects(target) {
        return this.item().effects.some(function (effect) {
            return this.testItemEffect(target, effect);
        }, this);
    }
    ;
    testItemEffect(target, effect) {
        switch (effect.code) {
            case ActionEffect.RECOVER_HP:
                return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
            case ActionEffect.RECOVER_MP:
                return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
            case ActionEffect.ADD_STATE:
                return !target.isStateAffected(effect.dataId);
            case ActionEffect.REMOVE_STATE:
                return target.isStateAffected(effect.dataId);
            case ActionEffect.ADD_BUFF:
                return !target.isMaxBuffAffected(effect.dataId);
            case ActionEffect.ADD_DEBUFF:
                return !target.isMaxDebuffAffected(effect.dataId);
            case ActionEffect.REMOVE_BUFF:
                return target.isBuffAffected(effect.dataId);
            case ActionEffect.REMOVE_DEBUFF:
                return target.isDebuffAffected(effect.dataId);
            case ActionEffect.LEARN_SKILL:
                return target.isActor() && !target.isLearnedSkill(effect.dataId);
            default:
                return true;
        }
    }
    ;
    itemCnt(target) {
        if (this.isPhysical() && target.canMove()) {
            return target.cnt;
        }
        else {
            return 0;
        }
    }
    ;
    itemMrf(target) {
        if (this.isMagical()) {
            return target.mrf;
        }
        else {
            return 0;
        }
    }
    ;
    itemHit(target) {
        if (this.isPhysical()) {
            return this.item().successRate * 0.01 * this.subject().hit;
        }
        else {
            return this.item().successRate * 0.01;
        }
    }
    ;
    itemEva(target) {
        if (this.isPhysical()) {
            return target.eva;
        }
        else if (this.isMagical()) {
            return target.mev;
        }
        else {
            return 0;
        }
    }
    ;
    itemCri(target) {
        return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
    }
    ;
    apply(target) {
        const result = target.result();
        this.subject().clearResult();
        result.clear();
        result.used = this.testApply(target);
        result.missed = (result.used && Math.random() >= this.itemHit(target));
        result.evaded = (!result.missed && Math.random() < this.itemEva(target));
        result.physical = this.isPhysical();
        result.drain = this.isDrain();
        if (result.isHit()) {
            if (this.item().damage.type > 0) {
                result.critical = (Math.random() < this.itemCri(target));
                const value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
            }
            this.item().effects.forEach(function (effect) {
                this.applyItemEffect(target, effect);
            }, this);
            this.applyItemUserEffect(target);
        }
    }
    ;
    makeDamageValue(target, critical) {
        const item = this.item();
        const baseValue = this.evalDamageFormula(target);
        let value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            value *= target.pdr;
        }
        if (this.isMagical()) {
            value *= target.mdr;
        }
        if (baseValue < 0) {
            value *= target.rec;
        }
        if (critical) {
            value = this.applyCritical(value);
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    }
    ;
    evalDamageFormula(target) {
        try {
            const item = this.item();
            const a = this.subject();
            const v = $gameVariables._data;
            const sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
            let value = Math.max(eval(item.damage.formula), 0) * sign;
            if (isNaN(value))
                value = 0;
            return value;
        }
        catch (e) {
            return 0;
        }
    }
    ;
    calcElementRate(target) {
        if (this.item().damage.elementId < 0) {
            return this.elementsMaxRate(target, this.subject().attackElements());
        }
        else {
            return target.elementRate(this.item().damage.elementId);
        }
    }
    ;
    elementsMaxRate(target, elements) {
        if (elements.length > 0) {
            return Math.max.apply(null, elements.map(function (elementId) {
                return target.elementRate(elementId);
            }, this));
        }
        else {
            return 1;
        }
    }
    ;
    applyCritical(damage) {
        return damage * 3;
    }
    ;
    applyVariance(damage, variance) {
        const amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
        const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
        return damage >= 0 ? damage + v : damage - v;
    }
    ;
    applyGuard(damage, target) {
        return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
    }
    ;
    executeDamage(target, value) {
        const result = target.result();
        if (value === 0) {
            result.critical = false;
        }
        if (this.isHpEffect()) {
            this.executeHpDamage(target, value);
        }
        if (this.isMpEffect()) {
            this.executeMpDamage(target, value);
        }
    }
    ;
    executeHpDamage(target, value) {
        if (this.isDrain()) {
            value = Math.min(target.hp, value);
        }
        this.makeSuccess(target);
        target.gainHp(-value);
        if (value > 0) {
            target.onDamage(value);
        }
        this.gainDrainedHp(value);
    }
    ;
    executeMpDamage(target, value) {
        if (!this.isMpRecover()) {
            value = Math.min(target.mp, value);
        }
        if (value !== 0) {
            this.makeSuccess(target);
        }
        target.gainMp(-value);
        this.gainDrainedMp(value);
    }
    ;
    gainDrainedHp(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget !== undefined) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainHp(value);
        }
    }
    ;
    gainDrainedMp(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget !== undefined) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainMp(value);
        }
    }
    ;
    applyItemEffect(target, effect) {
        switch (effect.code) {
            case ActionEffect.RECOVER_HP:
                this.itemEffectRecoverHp(target, effect);
                break;
            case ActionEffect.RECOVER_MP:
                this.itemEffectRecoverMp(target, effect);
                break;
            case ActionEffect.GAIN_TP:
                this.itemEffectGainTp(target, effect);
                break;
            case ActionEffect.ADD_STATE:
                this.itemEffectAddState(target, effect);
                break;
            case ActionEffect.REMOVE_STATE:
                this.itemEffectRemoveState(target, effect);
                break;
            case ActionEffect.ADD_BUFF:
                this.itemEffectAddBuff(target, effect);
                break;
            case ActionEffect.ADD_DEBUFF:
                this.itemEffectAddDebuff(target, effect);
                break;
            case ActionEffect.REMOVE_BUFF:
                this.itemEffectRemoveBuff(target, effect);
                break;
            case ActionEffect.REMOVE_DEBUFF:
                this.itemEffectRemoveDebuff(target, effect);
                break;
            case ActionEffect.SPECIAL:
                this.itemEffectSpecial(target, effect);
                break;
            case ActionEffect.GROW:
                this.itemEffectGrow(target, effect);
                break;
            case ActionEffect.LEARN_SKILL:
                this.itemEffectLearnSkill(target, effect);
                break;
            case ActionEffect.COMMON_EVENT:
                this.itemEffectCommonEvent(target, effect);
                break;
        }
    }
    ;
    itemEffectRecoverHp(target, effect) {
        let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainHp(value);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectRecoverMp(target, effect) {
        let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainMp(value);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectGainTp(target, effect) {
        const value = Math.floor(effect.value1);
        if (value !== 0) {
            target.gainTp(value);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectAddState(target, effect) {
        if (effect.dataId === 0) {
            this.itemEffectAddAttackState(target, effect);
        }
        else {
            this.itemEffectAddNormalState(target, effect);
        }
    }
    ;
    itemEffectAddAttackState(target, effect) {
        this.subject().attackStates().forEach(function (stateId) {
            let chance = effect.value1;
            chance *= target.stateRate(stateId);
            chance *= this.subject().attackStatesRate(stateId);
            chance *= this.lukEffectRate(target);
            if (Math.random() < chance) {
                target.addState(stateId);
                this.makeSuccess(target);
            }
        }.bind(this), target);
    }
    ;
    itemEffectAddNormalState(target, effect) {
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= target.stateRate(effect.dataId);
            chance *= this.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            target.addState(effect.dataId);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectRemoveState(target, effect) {
        const chance = effect.value1;
        if (Math.random() < chance) {
            target.removeState(effect.dataId);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectAddBuff(target, effect) {
        target.addBuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
    ;
    itemEffectAddDebuff(target, effect) {
        const chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectRemoveBuff(target, effect) {
        if (target.isBuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectRemoveDebuff(target, effect) {
        if (target.isDebuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectSpecial(target, effect) {
        if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
            target.escape();
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectGrow(target, effect) {
        target.addParam(effect.dataId, Math.floor(effect.value1));
        this.makeSuccess(target);
    }
    ;
    itemEffectLearnSkill(target, effect) {
        if (target.isActor()) {
            target.learnSkill(effect.dataId);
            this.makeSuccess(target);
        }
    }
    ;
    itemEffectCommonEvent(target, effect) {
    }
    ;
    makeSuccess(target) {
        target.result().success = true;
    }
    ;
    applyItemUserEffect(target) {
        const value = Math.floor(this.item().tpGain * this.subject().tcr);
        this.subject().gainSilentTp(value);
    }
    ;
    lukEffectRate(target) {
        return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
    }
    ;
    applyGlobal() {
        this.item().effects.forEach(function (effect) {
            if (effect.code === ActionEffect.COMMON_EVENT) {
                $gameTemp.reserveCommonEvent(effect.dataId);
            }
        }, this);
    }
    ;
}
Game_Action.SPECIAL_EFFECT_ESCAPE = 0;

//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.
class Game_ActionResult {
    constructor() {
        this.clear();
    }
    clear() {
        this.used = false;
        this.missed = false;
        this.evaded = false;
        this.physical = false;
        this.drain = false;
        this.critical = false;
        this.success = false;
        this.hpAffected = false;
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.tpDamage = 0;
        this.addedStates = [];
        this.removedStates = [];
        this.addedBuffs = [];
        this.addedDebuffs = [];
        this.removedBuffs = [];
    }
    ;
    addedStateObjects() {
        return this.addedStates.map(function (id) {
            return $dataStates[id];
        });
    }
    ;
    removedStateObjects() {
        return this.removedStates.map(function (id) {
            return $dataStates[id];
        });
    }
    ;
    isStatusAffected() {
        return (this.addedStates.length > 0 || this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0);
    }
    ;
    isHit() {
        return this.used && !this.missed && !this.evaded;
    }
    ;
    isStateAdded(stateId) {
        return this.addedStates.contains(stateId);
    }
    ;
    pushAddedState(stateId) {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    }
    ;
    isStateRemoved(stateId) {
        return this.removedStates.contains(stateId);
    }
    ;
    pushRemovedState(stateId) {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    }
    ;
    isBuffAdded(paramId) {
        return this.addedBuffs.contains(paramId);
    }
    ;
    pushAddedBuff(paramId) {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    }
    ;
    isDebuffAdded(paramId) {
        return this.addedDebuffs.contains(paramId);
    }
    ;
    pushAddedDebuff(paramId) {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    }
    ;
    isBuffRemoved(paramId) {
        return this.removedBuffs.contains(paramId);
    }
    ;
    pushRemovedBuff(paramId) {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    }
    ;
}

class Game_BattlerBase {
    constructor() {
        this.initMembers();
    }
    // Hit Points
    get hp() { return this._hp; }
    // Magic Points
    get mp() { return this._mp; }
    // Tactical Points
    get tp() { return this._tp; }
    // Maximum Hit Points
    get mhp() { return this.param(0); }
    // Maximum Magic Points
    get mmp() { return this.param(1); }
    // ATtacK power
    get atk() { return this.param(2); }
    // DEFense power
    get def() { return this.param(3); }
    // Magic ATtack power
    get mat() { return this.param(4); }
    // Magic DeFense power
    get mdf() { return this.param(5); }
    // AGIlity
    get agi() { return this.param(6); }
    // LUcK
    get luk() { return this.param(7); }
    // HIT rate
    get hit() { return this.xparam(0); }
    // EVAsion rate
    get eva() { return this.xparam(1); }
    // CRItical rate
    get cri() { return this.xparam(2); }
    // Critical EVasion rate
    get cev() { return this.xparam(3); }
    // Magic EVasion rate
    get mev() { return this.xparam(4); }
    // Magic ReFlection rate
    get mrf() { return this.xparam(5); }
    // CouNTer attack rate
    get cnt() { return this.xparam(6); }
    // Hp ReGeneration rate
    get hrg() { return this.xparam(7); }
    // Mp ReGeneration rate
    get mrg() { return this.xparam(8); }
    // Tp ReGeneration rate
    get trg() { return this.xparam(9); }
    // TarGet Rate
    get tgr() { return this.sparam(0); }
    // GuaRD effect rate
    get grd() { return this.sparam(1); }
    // RECovery effect rate
    get rec() { return this.sparam(2); }
    // PHArmacology
    get pha() { return this.sparam(3); }
    // Mp Cost Rate
    get mcr() { return this.sparam(4); }
    // Tp Charge Rate
    get tcr() { return this.sparam(5); }
    // Physical Damage Rate
    get pdr() { return this.sparam(6); }
    // Magical Damage Rate
    get mdr() { return this.sparam(7); }
    // Floor Damage Rate
    get fdr() { return this.sparam(8); }
    // EXperience Rate
    get exr() { return this.sparam(9); }
    ;
    initMembers() {
        this._hp = 1;
        this._mp = 0;
        this._tp = 0;
        this._hidden = false;
        this.clearParamPlus();
        this.clearStates();
        this.clearBuffs();
    }
    ;
    clearParamPlus() {
        this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    ;
    clearStates() {
        this._states = [];
        this._stateTurns = {};
    }
    ;
    eraseState(stateId) {
        const index = this._states.indexOf(stateId);
        if (index >= 0) {
            this._states.splice(index, 1);
        }
        delete this._stateTurns[stateId];
    }
    ;
    isStateAffected(stateId) {
        return this._states.contains(stateId);
    }
    ;
    isDeathStateAffected() {
        return this.isStateAffected(this.deathStateId());
    }
    ;
    deathStateId() {
        return 1;
    }
    ;
    resetStateCounts(stateId) {
        const state = $dataStates[stateId];
        const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
        this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
    }
    ;
    isStateExpired(stateId) {
        return this._stateTurns[stateId] === 0;
    }
    ;
    updateStateTurns() {
        this._states.forEach(function (stateId) {
            if (this._stateTurns[stateId] > 0) {
                this._stateTurns[stateId]--;
            }
        }, this);
    }
    ;
    clearBuffs() {
        this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
        this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
    }
    ;
    eraseBuff(paramId) {
        this._buffs[paramId] = 0;
        this._buffTurns[paramId] = 0;
    }
    ;
    buffLength() {
        return this._buffs.length;
    }
    ;
    buff(paramId) {
        return this._buffs[paramId];
    }
    ;
    isBuffAffected(paramId) {
        return this._buffs[paramId] > 0;
    }
    ;
    isDebuffAffected(paramId) {
        return this._buffs[paramId] < 0;
    }
    ;
    isBuffOrDebuffAffected(paramId) {
        return this._buffs[paramId] !== 0;
    }
    ;
    isMaxBuffAffected(paramId) {
        return this._buffs[paramId] === 2;
    }
    ;
    isMaxDebuffAffected(paramId) {
        return this._buffs[paramId] === -2;
    }
    ;
    increaseBuff(paramId) {
        if (!this.isMaxBuffAffected(paramId)) {
            this._buffs[paramId]++;
        }
    }
    ;
    decreaseBuff(paramId) {
        if (!this.isMaxDebuffAffected(paramId)) {
            this._buffs[paramId]--;
        }
    }
    ;
    overwriteBuffTurns(paramId, turns) {
        if (this._buffTurns[paramId] < turns) {
            this._buffTurns[paramId] = turns;
        }
    }
    ;
    isBuffExpired(paramId) {
        return this._buffTurns[paramId] === 0;
    }
    ;
    updateBuffTurns() {
        for (let i = 0; i < this._buffTurns.length; i++) {
            if (this._buffTurns[i] > 0) {
                this._buffTurns[i]--;
            }
        }
    }
    ;
    die() {
        this._hp = 0;
        this.clearStates();
        this.clearBuffs();
    }
    ;
    revive() {
        if (this._hp === 0) {
            this._hp = 1;
        }
    }
    ;
    states() {
        return this._states.map(function (id) {
            return $dataStates[id];
        });
    }
    ;
    stateIcons() {
        return this.states().map(function (state) {
            return state.iconIndex;
        }).filter(function (iconIndex) {
            return iconIndex > 0;
        });
    }
    ;
    buffIcons() {
        const icons = [];
        for (let i = 0; i < this._buffs.length; i++) {
            if (this._buffs[i] !== 0) {
                icons.push(this.buffIconIndex(this._buffs[i], i));
            }
        }
        return icons;
    }
    ;
    buffIconIndex(buffLevel, paramId) {
        if (buffLevel > 0) {
            return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
        }
        else if (buffLevel < 0) {
            return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
        }
        else {
            return 0;
        }
    }
    ;
    allIcons() {
        return this.stateIcons().concat(this.buffIcons());
    }
    ;
    traitObjects() {
        // Returns an array of the all objects having traits. States only here.
        return this.states();
    }
    ;
    allTraits() {
        return this.traitObjects().reduce(function (r, obj) {
            return r.concat(obj.traits);
        }, []);
    }
    ;
    traits(code) {
        return this.allTraits().filter(function (trait) {
            return trait.code === code;
        });
    }
    ;
    traitsWithId(code, id) {
        return this.allTraits().filter(function (trait) {
            return trait.code === code && trait.dataId === id;
        });
    }
    ;
    traitsPi(code, id) {
        return this.traitsWithId(code, id).reduce(function (r, trait) {
            return r * trait.value;
        }, 1);
    }
    ;
    traitsSum(code, id) {
        return this.traitsWithId(code, id).reduce(function (r, trait) {
            return r + trait.value;
        }, 0);
    }
    ;
    traitsSumAll(code) {
        return this.traits(code).reduce(function (r, trait) {
            return r + trait.value;
        }, 0);
    }
    ;
    traitsSet(code) {
        return this.traits(code).reduce(function (r, trait) {
            return r.concat(trait.dataId);
        }, []);
    }
    ;
    paramBase(paramId) {
        return 0;
    }
    ;
    paramPlus(paramId) {
        return this._paramPlus[paramId];
    }
    ;
    paramMin(paramId) {
        if (paramId === 1) {
            return 0; // MMP
        }
        else {
            return 1;
        }
    }
    ;
    paramMax(paramId) {
        if (paramId === 0) {
            return 999999; // MHP
        }
        else if (paramId === 1) {
            return 9999; // MMP
        }
        else {
            return 999;
        }
    }
    ;
    paramRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
    }
    ;
    paramBuffRate(paramId) {
        return this._buffs[paramId] * 0.25 + 1.0;
    }
    ;
    param(paramId) {
        let value = this.paramBase(paramId) + this.paramPlus(paramId);
        value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    }
    ;
    xparam(xparamId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
    }
    ;
    sparam(sparamId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
    }
    ;
    elementRate(elementId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
    }
    ;
    debuffRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
    }
    ;
    stateRate(stateId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
    }
    ;
    stateResistSet() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
    }
    ;
    isStateResist(stateId) {
        return this.stateResistSet().contains(stateId);
    }
    ;
    attackElements() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
    }
    ;
    attackStates() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
    }
    ;
    attackStatesRate(stateId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
    }
    ;
    attackSpeed() {
        return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
    }
    ;
    attackTimesAdd() {
        return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
    }
    ;
    addedSkillTypes() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
    }
    ;
    isSkillTypeSealed(stypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
    }
    ;
    addedSkills() {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
    }
    ;
    isSkillSealed(skillId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
    }
    ;
    isEquipWtypeOk(wtypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
    }
    ;
    isEquipAtypeOk(atypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
    }
    ;
    isEquipTypeLocked(etypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
    }
    ;
    isEquipTypeSealed(etypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
    }
    ;
    slotType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
        return set.length > 0 ? Math.max.apply(null, set) : 0;
    }
    ;
    isDualWield() {
        return this.slotType() === 1;
    }
    ;
    actionPlusSet() {
        return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function (trait) {
            return trait.value;
        });
    }
    ;
    specialFlag(flagId) {
        return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function (trait) {
            return trait.dataId === flagId;
        });
    }
    ;
    collapseType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
        return set.length > 0 ? Math.max.apply(null, set) : 0;
    }
    ;
    partyAbility(abilityId) {
        return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function (trait) {
            return trait.dataId === abilityId;
        });
    }
    ;
    isAutoBattle() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
    }
    ;
    isGuard() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
    }
    ;
    isSubstitute() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
    }
    ;
    isPreserveTp() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
    }
    ;
    addParam(paramId, value) {
        this._paramPlus[paramId] += value;
        this.refresh();
    }
    ;
    setHp(hp) {
        this._hp = hp;
        this.refresh();
    }
    ;
    setMp(mp) {
        this._mp = mp;
        this.refresh();
    }
    ;
    setTp(tp) {
        this._tp = tp;
        this.refresh();
    }
    ;
    maxTp() {
        return 100;
    }
    ;
    refresh() {
        this.stateResistSet().forEach(function (stateId) {
            this.eraseState(stateId);
        }, this);
        this._hp = this._hp.clamp(0, this.mhp);
        this._mp = this._mp.clamp(0, this.mmp);
        this._tp = this._tp.clamp(0, this.maxTp());
    }
    ;
    recoverAll() {
        this.clearStates();
        this._hp = this.mhp;
        this._mp = this.mmp;
    }
    ;
    hpRate() {
        return this.hp / this.mhp;
    }
    ;
    mpRate() {
        return this.mmp > 0 ? this.mp / this.mmp : 0;
    }
    ;
    tpRate() {
        return this.tp / this.maxTp();
    }
    ;
    hide() {
        this._hidden = true;
    }
    ;
    appear() {
        this._hidden = false;
    }
    ;
    isHidden() {
        return this._hidden;
    }
    ;
    isAppeared() {
        return !this.isHidden();
    }
    ;
    isDead() {
        return this.isAppeared() && this.isDeathStateAffected();
    }
    ;
    isAlive() {
        return this.isAppeared() && !this.isDeathStateAffected();
    }
    ;
    isDying() {
        return this.isAlive() && this._hp < this.mhp / 4;
    }
    ;
    isRestricted() {
        return this.isAppeared() && this.restriction() > 0;
    }
    ;
    canInput() {
        return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
    }
    ;
    canMove() {
        return this.isAppeared() && this.restriction() < 4;
    }
    ;
    isConfused() {
        return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
    }
    ;
    confusionLevel() {
        return this.isConfused() ? this.restriction() : 0;
    }
    ;
    isActor() {
        return false;
    }
    ;
    isEnemy() {
        return false;
    }
    ;
    sortStates() {
        this._states.sort(function (a, b) {
            const p1 = $dataStates[a].priority;
            const p2 = $dataStates[b].priority;
            if (p1 !== p2) {
                return p2 - p1;
            }
            return a - b;
        });
    }
    ;
    restriction() {
        return Math.max.apply(null, this.states().map(function (state) {
            return state.restriction;
        }).concat(0));
    }
    ;
    addNewState(stateId) {
        if (stateId === this.deathStateId()) {
            this.die();
        }
        const restricted = this.isRestricted();
        this._states.push(stateId);
        this.sortStates();
        if (!restricted && this.isRestricted()) {
            this.onRestrict();
        }
    }
    ;
    onRestrict() {
    }
    ;
    mostImportantStateText() {
        const states = this.states();
        for (let i = 0; i < states.length; i++) {
            if (states[i].message3) {
                return states[i].message3;
            }
        }
        return '';
    }
    ;
    stateMotionIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].motion;
        }
        else {
            return 0;
        }
    }
    ;
    stateOverlayIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].overlay;
        }
        else {
            return 0;
        }
    }
    ;
    isSkillWtypeOk(skill) {
        return true;
    }
    ;
    skillMpCost(skill) {
        return Math.floor(skill.mpCost * this.mcr);
    }
    ;
    skillTpCost(skill) {
        return skill.tpCost;
    }
    ;
    canPaySkillCost(skill) {
        return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
    }
    ;
    paySkillCost(skill) {
        this._mp -= this.skillMpCost(skill);
        this._tp -= this.skillTpCost(skill);
    }
    ;
    isOccasionOk(item) {
        if ($gameParty.inBattle()) {
            return item.occasion === 0 || item.occasion === 1;
        }
        else {
            return item.occasion === 0 || item.occasion === 2;
        }
    }
    ;
    meetsUsableItemConditions(item) {
        return this.canMove() && this.isOccasionOk(item);
    }
    ;
    meetsSkillConditions(skill) {
        return (this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId));
    }
    ;
    meetsItemConditions(item) {
        return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
    }
    ;
    canUse(item) {
        if (!item) {
            return false;
        }
        else if (DataManager.isSkill(item)) {
            return this.meetsSkillConditions(item);
        }
        else if (DataManager.isItem(item)) {
            return this.meetsItemConditions(item);
        }
        else {
            return false;
        }
    }
    ;
    canEquip(item) {
        if (!item) {
            return false;
        }
        else if (DataManager.isWeapon(item)) {
            return this.canEquipWeapon(item);
        }
        else if (DataManager.isArmor(item)) {
            return this.canEquipArmor(item);
        }
        else {
            return false;
        }
    }
    ;
    canEquipWeapon(item) {
        return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
    }
    ;
    canEquipArmor(item) {
        return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
    }
    ;
    attackSkillId() {
        return 1;
    }
    ;
    guardSkillId() {
        return 2;
    }
    ;
    canAttack() {
        return this.canUse($dataSkills[this.attackSkillId()]);
    }
    ;
    canGuard() {
        return this.canUse($dataSkills[this.guardSkillId()]);
    }
    ;
}
Game_BattlerBase.TRAIT_ELEMENT_RATE = 11;
Game_BattlerBase.TRAIT_DEBUFF_RATE = 12;
Game_BattlerBase.TRAIT_STATE_RATE = 13;
Game_BattlerBase.TRAIT_STATE_RESIST = 14;
Game_BattlerBase.TRAIT_PARAM = 21;
Game_BattlerBase.TRAIT_XPARAM = 22;
Game_BattlerBase.TRAIT_SPARAM = 23;
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
Game_BattlerBase.TRAIT_ATTACK_STATE = 32;
Game_BattlerBase.TRAIT_ATTACK_SPEED = 33;
Game_BattlerBase.TRAIT_ATTACK_TIMES = 34;
Game_BattlerBase.TRAIT_STYPE_ADD = 41;
Game_BattlerBase.TRAIT_STYPE_SEAL = 42;
Game_BattlerBase.TRAIT_SKILL_ADD = 43;
Game_BattlerBase.TRAIT_SKILL_SEAL = 44;
Game_BattlerBase.TRAIT_EQUIP_WTYPE = 51;
Game_BattlerBase.TRAIT_EQUIP_ATYPE = 52;
Game_BattlerBase.TRAIT_EQUIP_LOCK = 53;
Game_BattlerBase.TRAIT_EQUIP_SEAL = 54;
Game_BattlerBase.TRAIT_SLOT_TYPE = 55;
Game_BattlerBase.TRAIT_ACTION_PLUS = 61;
Game_BattlerBase.TRAIT_SPECIAL_FLAG = 62;
Game_BattlerBase.TRAIT_COLLAPSE_TYPE = 63;
Game_BattlerBase.TRAIT_PARTY_ABILITY = 64;
Game_BattlerBase.FLAG_ID_AUTO_BATTLE = 0;
Game_BattlerBase.FLAG_ID_GUARD = 1;
Game_BattlerBase.FLAG_ID_SUBSTITUTE = 2;
Game_BattlerBase.FLAG_ID_PRESERVE_TP = 3;
Game_BattlerBase.ICON_BUFF_START = 32;
Game_BattlerBase.ICON_DEBUFF_START = 48;

class Game_Battler extends Game_BattlerBase {
    constructor() {
        super(...arguments);
        this._actions = [];
        this._speed = 0;
        this._result = new Game_ActionResult();
        this._actionState = '';
        this._lastTargetIndex = 0;
        this._animations = [];
        this._damagePopup = false;
        this._effectType = null;
        this._motionType = null;
        this._weaponImageId = 0;
        this._motionRefresh = false;
        this._selected = false;
    }
    initMembers() {
        super.initMembers();
        this._actions = [];
        this._speed = 0;
        this._result = new Game_ActionResult();
        this._actionState = '';
        this._lastTargetIndex = 0;
        this._animations = [];
        this._damagePopup = false;
        this._effectType = null;
        this._motionType = null;
        this._weaponImageId = 0;
        this._motionRefresh = false;
        this._selected = false;
    }
    ;
    clearAnimations() {
        this._animations = [];
    }
    ;
    clearDamagePopup() {
        this._damagePopup = false;
    }
    ;
    clearWeaponAnimation() {
        this._weaponImageId = 0;
    }
    ;
    clearEffect() {
        this._effectType = null;
    }
    ;
    clearMotion() {
        this._motionType = null;
        this._motionRefresh = false;
    }
    ;
    requestEffect(effectType) {
        this._effectType = effectType;
    }
    ;
    requestMotion(motionType) {
        this._motionType = motionType;
    }
    ;
    requestMotionRefresh() {
        this._motionRefresh = true;
    }
    ;
    select() {
        this._selected = true;
    }
    ;
    deselect() {
        this._selected = false;
    }
    ;
    isAnimationRequested() {
        return this._animations.length > 0;
    }
    ;
    isDamagePopupRequested() {
        return this._damagePopup;
    }
    ;
    isEffectRequested() {
        return !!this._effectType;
    }
    ;
    isMotionRequested() {
        return !!this._motionType;
    }
    ;
    isWeaponAnimationRequested() {
        return this._weaponImageId > 0;
    }
    ;
    isMotionRefreshRequested() {
        return this._motionRefresh;
    }
    ;
    isSelected() {
        return this._selected;
    }
    ;
    effectType() {
        return this._effectType;
    }
    ;
    motionType() {
        return this._motionType;
    }
    ;
    weaponImageId() {
        return this._weaponImageId;
    }
    ;
    shiftAnimation() {
        return this._animations.shift();
    }
    ;
    startAnimation(animationId, mirror, delay) {
        const data = { animationId: animationId, mirror: mirror, delay: delay };
        this._animations.push(data);
    }
    ;
    startDamagePopup() {
        this._damagePopup = true;
    }
    ;
    startWeaponAnimation(weaponImageId) {
        this._weaponImageId = weaponImageId;
    }
    ;
    action(index) {
        return this._actions[index];
    }
    ;
    setAction(index, action) {
        this._actions[index] = action;
    }
    ;
    numActions() {
        return this._actions.length;
    }
    ;
    clearActions() {
        this._actions = [];
    }
    ;
    result() {
        return this._result;
    }
    ;
    clearResult() {
        this._result.clear();
    }
    ;
    refresh() {
        super.refresh();
        if (this.hp === 0) {
            this.addState(this.deathStateId());
        }
        else {
            this.removeState(this.deathStateId());
        }
    }
    ;
    addState(stateId) {
        if (this.isStateAddable(stateId)) {
            if (!this.isStateAffected(stateId)) {
                this.addNewState(stateId);
                this.refresh();
            }
            this.resetStateCounts(stateId);
            this._result.pushAddedState(stateId);
        }
    }
    ;
    isStateAddable(stateId) {
        return (this.isAlive() && $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this._result.isStateRemoved(stateId) &&
            !this.isStateRestrict(stateId));
    }
    ;
    isStateRestrict(stateId) {
        return $dataStates[stateId].removeByRestriction && this.isRestricted();
    }
    ;
    onRestrict() {
        super.onRestrict();
        this.clearActions();
        this.states().forEach(function (state) {
            if (state.removeByRestriction) {
                this.removeState(state.id);
            }
        }, this);
    }
    ;
    removeState(stateId) {
        if (this.isStateAffected(stateId)) {
            if (stateId === this.deathStateId()) {
                this.revive();
            }
            this.eraseState(stateId);
            this.refresh();
            this._result.pushRemovedState(stateId);
        }
    }
    ;
    escape() {
        if ($gameParty.inBattle()) {
            this.hide();
        }
        this.clearActions();
        this.clearStates();
        SoundManager.playEscape();
    }
    ;
    addBuff(paramId, turns) {
        if (this.isAlive()) {
            this.increaseBuff(paramId);
            if (this.isBuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedBuff(paramId);
            this.refresh();
        }
    }
    ;
    addDebuff(paramId, turns) {
        if (this.isAlive()) {
            this.decreaseBuff(paramId);
            if (this.isDebuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedDebuff(paramId);
            this.refresh();
        }
    }
    ;
    removeBuff(paramId) {
        if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
            this.eraseBuff(paramId);
            this._result.pushRemovedBuff(paramId);
            this.refresh();
        }
    }
    ;
    removeBattleStates() {
        this.states().forEach(function (state) {
            if (state.removeAtBattleEnd) {
                this.removeState(state.id);
            }
        }, this);
    }
    ;
    removeAllBuffs() {
        for (let i = 0; i < this.buffLength(); i++) {
            this.removeBuff(i);
        }
    }
    ;
    removeStatesAuto(timing) {
        this.states().forEach(function (state) {
            if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
                this.removeState(state.id);
            }
        }, this);
    }
    ;
    removeBuffsAuto() {
        for (let i = 0; i < this.buffLength(); i++) {
            if (this.isBuffExpired(i)) {
                this.removeBuff(i);
            }
        }
    }
    ;
    removeStatesByDamage() {
        this.states().forEach(function (state) {
            if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
                this.removeState(state.id);
            }
        }, this);
    }
    ;
    makeActionTimes() {
        return this.actionPlusSet().reduce(function (r, p) {
            return Math.random() < p ? r + 1 : r;
        }, 1);
    }
    ;
    makeActions() {
        this.clearActions();
        if (this.canMove()) {
            const actionTimes = this.makeActionTimes();
            this._actions = [];
            for (let i = 0; i < actionTimes; i++) {
                this._actions.push(new Game_Action(this));
            }
        }
    }
    ;
    speed() {
        return this._speed;
    }
    ;
    makeSpeed() {
        this._speed = Math.min.apply(null, this._actions.map(function (action) {
            return action.speed();
        })) || 0;
    }
    ;
    currentAction() {
        return this._actions[0];
    }
    ;
    removeCurrentAction() {
        this._actions.shift();
    }
    ;
    setLastTarget(target) {
        if (target) {
            this._lastTargetIndex = target.index();
        }
        else {
            this._lastTargetIndex = 0;
        }
    }
    ;
    forceAction(skillId, targetIndex) {
        this.clearActions();
        const action = new Game_Action(this, true);
        action.setSkill(skillId);
        if (targetIndex === -2) {
            action.setTarget(this._lastTargetIndex);
        }
        else if (targetIndex === -1) {
            action.decideRandomTarget();
        }
        else {
            action.setTarget(targetIndex);
        }
        this._actions.push(action);
    }
    ;
    useItem(item) {
        if (DataManager.isSkill(item)) {
            this.paySkillCost(item);
        }
        else if (DataManager.isItem(item)) {
            this.consumeItem(item);
        }
    }
    ;
    consumeItem(item) {
        $gameParty.consumeItem(item);
    }
    ;
    gainHp(value) {
        this._result.hpDamage = -value;
        this._result.hpAffected = true;
        this.setHp(this.hp + value);
    }
    ;
    gainMp(value) {
        this._result.mpDamage = -value;
        this.setMp(this.mp + value);
    }
    ;
    gainTp(value) {
        this._result.tpDamage = -value;
        this.setTp(this.tp + value);
    }
    ;
    gainSilentTp(value) {
        this.setTp(this.tp + value);
    }
    ;
    initTp() {
        this.setTp(Math.randomInt(25));
    }
    ;
    clearTp() {
        this.setTp(0);
    }
    ;
    chargeTpByDamage(damageRate) {
        const value = Math.floor(50 * damageRate * this.tcr);
        this.gainSilentTp(value);
    }
    ;
    regenerateHp() {
        let value = Math.floor(this.mhp * this.hrg);
        value = Math.max(value, -this.maxSlipDamage());
        if (value !== 0) {
            this.gainHp(value);
        }
    }
    ;
    maxSlipDamage() {
        return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
    }
    ;
    regenerateMp() {
        const value = Math.floor(this.mmp * this.mrg);
        if (value !== 0) {
            this.gainMp(value);
        }
    }
    ;
    regenerateTp() {
        const value = Math.floor(100 * this.trg);
        this.gainSilentTp(value);
    }
    ;
    regenerateAll() {
        if (this.isAlive()) {
            this.regenerateHp();
            this.regenerateMp();
            this.regenerateTp();
        }
    }
    ;
    onBattleStart() {
        this.setActionState('undecided');
        this.clearMotion();
        if (!this.isPreserveTp()) {
            this.initTp();
        }
    }
    ;
    onAllActionsEnd() {
        this.clearResult();
        this.removeStatesAuto(1);
        this.removeBuffsAuto();
    }
    ;
    onTurnEnd() {
        this.clearResult();
        this.regenerateAll();
        this.updateStateTurns();
        this.updateBuffTurns();
        this.removeStatesAuto(2);
    }
    ;
    onBattleEnd() {
        this.clearResult();
        this.removeBattleStates();
        this.removeAllBuffs();
        this.clearActions();
        if (!this.isPreserveTp()) {
            this.clearTp();
        }
        this.appear();
    }
    ;
    onDamage(value) {
        this.removeStatesByDamage();
        this.chargeTpByDamage(value / this.mhp);
    }
    ;
    setActionState(actionState) {
        this._actionState = actionState;
        this.requestMotionRefresh();
    }
    ;
    isUndecided() {
        return this._actionState === 'undecided';
    }
    ;
    isInputting() {
        return this._actionState === 'inputting';
    }
    ;
    isWaiting() {
        return this._actionState === 'waiting';
    }
    ;
    isActing() {
        return this._actionState === 'acting';
    }
    ;
    isChanting() {
        if (this.isWaiting()) {
            return this._actions.some(function (action) {
                return action.isMagicSkill();
            });
        }
        return false;
    }
    ;
    isGuardWaiting() {
        if (this.isWaiting()) {
            return this._actions.some(function (action) {
                return action.isGuard();
            });
        }
        return false;
    }
    ;
    performActionStart(action) {
        if (!action.isGuard()) {
            this.setActionState('acting');
        }
    }
    ;
    performAction(action) {
    }
    ;
    performActionEnd() {
        this.setActionState('done');
    }
    ;
    performDamage() {
    }
    ;
    performMiss() {
        SoundManager.playMiss();
    }
    ;
    performRecovery() {
        SoundManager.playRecovery();
    }
    ;
    performEvasion() {
        SoundManager.playEvasion();
    }
    ;
    performMagicEvasion() {
        SoundManager.playMagicEvasion();
    }
    ;
    performCounter() {
        SoundManager.playEvasion();
    }
    ;
    performReflection() {
        SoundManager.playReflection();
    }
    ;
    performSubstitute(target) {
    }
    ;
    performCollapse() {
    }
    ;
    /// bungcip: added to base clas
    isSpriteVisible() {
        return true;
    }
}

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.
class Game_Actor extends Game_Battler {
    get level() {
        return this._level;
    }
    constructor(actorId) {
        super();
        this.setup(actorId);
    }
    ;
    initMembers() {
        super.initMembers();
        this._actorId = 0;
        this._name = '';
        this._nickname = '';
        this._classId = 0;
        this._level = 0;
        this._characterName = '';
        this._characterIndex = 0;
        this._faceName = '';
        this._faceIndex = 0;
        this._battlerName = '';
        this._exp = {};
        this._skills = [];
        this._equips = [];
        this._actionInputIndex = 0;
        this._lastMenuSkill = new Game_Item();
        this._lastBattleSkill = new Game_Item();
        this._lastCommandSymbol = '';
    }
    ;
    setup(actorId) {
        const actor = $dataActors[actorId];
        this._actorId = actorId;
        this._name = actor.name;
        this._nickname = actor.nickname;
        this._profile = actor.profile;
        this._classId = actor.classId;
        this._level = actor.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor.equips);
        this.clearParamPlus();
        this.recoverAll();
    }
    ;
    actorId() {
        return this._actorId;
    }
    ;
    actor() {
        return $dataActors[this._actorId];
    }
    ;
    name() {
        return this._name;
    }
    ;
    setName(name) {
        this._name = name;
    }
    ;
    nickname() {
        return this._nickname;
    }
    ;
    setNickname(nickname) {
        this._nickname = nickname;
    }
    ;
    profile() {
        return this._profile;
    }
    ;
    setProfile(profile) {
        this._profile = profile;
    }
    ;
    characterName() {
        return this._characterName;
    }
    ;
    characterIndex() {
        return this._characterIndex;
    }
    ;
    faceName() {
        return this._faceName;
    }
    ;
    faceIndex() {
        return this._faceIndex;
    }
    ;
    battlerName() {
        return this._battlerName;
    }
    ;
    clearStates() {
        super.clearStates();
        this._stateSteps = {};
    }
    ;
    eraseState(stateId) {
        super.eraseState(stateId);
        delete this._stateSteps[stateId];
    }
    ;
    resetStateCounts(stateId) {
        super.resetStateCounts(stateId);
        this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
    }
    ;
    initImages() {
        const actor = this.actor();
        this._characterName = actor.characterName;
        this._characterIndex = actor.characterIndex;
        this._faceName = actor.faceName;
        this._faceIndex = actor.faceIndex;
        this._battlerName = actor.battlerName;
    }
    ;
    expForLevel(level) {
        const c = this.currentClass();
        const basis = c.expParams[0];
        const extra = c.expParams[1];
        const acc_a = c.expParams[2];
        const acc_b = c.expParams[3];
        return Math.round(basis * (Math.pow(level - 1, 0.9 + acc_a / 250)) * level *
            (level + 1) / (6 + Math.pow(level, 2) / 50 / acc_b) + (level - 1) * extra);
    }
    ;
    initExp() {
        this._exp[this._classId] = this.currentLevelExp();
    }
    ;
    currentExp() {
        return this._exp[this._classId];
    }
    ;
    currentLevelExp() {
        return this.expForLevel(this._level);
    }
    ;
    nextLevelExp() {
        return this.expForLevel(this._level + 1);
    }
    ;
    nextRequiredExp() {
        return this.nextLevelExp() - this.currentExp();
    }
    ;
    maxLevel() {
        return this.actor().maxLevel;
    }
    ;
    isMaxLevel() {
        return this._level >= this.maxLevel();
    }
    ;
    initSkills() {
        this._skills = [];
        this.currentClass().learnings.forEach(function (learning) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    }
    ;
    initEquips(equips) {
        const slots = this.equipSlots();
        const maxSlots = slots.length;
        this._equips = [];
        for (let i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (let j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    }
    ;
    equipSlots() {
        const slots = [];
        for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
            slots.push(i);
        }
        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }
        return slots;
    }
    ;
    equips() {
        return this._equips.map(function (item) {
            return item.object();
        });
    }
    ;
    weapons() {
        return this.equips().filter(function (item) {
            return item && DataManager.isWeapon(item);
        });
    }
    ;
    armors() {
        return this.equips().filter(function (item) {
            return item && DataManager.isArmor(item);
        });
    }
    ;
    hasWeapon(weapon) {
        return this.weapons().contains(weapon);
    }
    ;
    hasArmor(armor) {
        return this.armors().contains(armor);
    }
    ;
    isEquipChangeOk(slotId) {
        return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId]));
    }
    ;
    changeEquip(slotId, item) {
        if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    }
    ;
    forceChangeEquip(slotId, item) {
        this._equips[slotId].setObject(item);
        this.releaseUnequippableItems(true);
        this.refresh();
    }
    ;
    tradeItemWithParty(newItem, oldItem) {
        if (newItem && !$gameParty.hasItem(newItem)) {
            return false;
        }
        else {
            $gameParty.gainItem(oldItem, 1);
            $gameParty.loseItem(newItem, 1);
            return true;
        }
    }
    ;
    changeEquipById(etypeId, itemId) {
        const slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            this.changeEquip(slotId, $dataWeapons[itemId]);
        }
        else {
            this.changeEquip(slotId, $dataArmors[itemId]);
        }
    }
    ;
    isEquipped(item) {
        return this.equips().contains(item);
    }
    ;
    discardEquip(item) {
        const slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this._equips[slotId].setObject(null);
        }
    }
    ;
    releaseUnequippableItems(forcing) {
        for (;;) {
            const slots = this.equipSlots();
            const equips = this.equips();
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    }
    ;
    clearEquipments() {
        const maxSlots = this.equipSlots().length;
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    }
    ;
    optimizeEquipments() {
        const maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    }
    ;
    bestEquipItem(slotId) {
        const etypeId = this.equipSlots()[slotId];
        const items = $gameParty.equipItems().filter(function (item) {
            return item.etypeId === etypeId && this.canEquip(item);
        }, this);
        let bestItem = null;
        let bestPerformance = -1000;
        for (let i = 0; i < items.length; i++) {
            const performance = this.calcEquipItemPerformance(items[i]);
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestItem = items[i];
            }
        }
        return bestItem;
    }
    ;
    calcEquipItemPerformance(item) {
        return item.params.reduce(function (a, b) {
            return a + b;
        });
    }
    ;
    isSkillWtypeOk(skill) {
        const wtypeId1 = skill.requiredWtypeId1;
        const wtypeId2 = skill.requiredWtypeId2;
        if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    isWtypeEquipped(wtypeId) {
        return this.weapons().some(function (weapon) {
            return weapon.wtypeId === wtypeId;
        });
    }
    ;
    refresh() {
        this.releaseUnequippableItems(false);
        super.refresh();
    }
    ;
    isActor() {
        return true;
    }
    ;
    friendsUnit() {
        return $gameParty;
    }
    ;
    opponentsUnit() {
        return $gameTroop;
    }
    ;
    index() {
        return $gameParty.members().indexOf(this);
    }
    ;
    isBattleMember() {
        return $gameParty.battleMembers().contains(this);
    }
    ;
    isFormationChangeOk() {
        return true;
    }
    ;
    currentClass() {
        return $dataClasses[this._classId];
    }
    ;
    isClass(gameClass) {
        return gameClass && this._classId === gameClass.id;
    }
    ;
    skills() {
        const list = [];
        this._skills.concat(this.addedSkills()).forEach(function (id) {
            if (!list.contains($dataSkills[id])) {
                list.push($dataSkills[id]);
            }
        });
        return list;
    }
    ;
    usableSkills() {
        return this.skills().filter(function (skill) {
            return this.canUse(skill);
        }, this);
    }
    ;
    traitObjects() {
        let objects = super.traitObjects();
        objects = objects.concat([this.actor(), this.currentClass()]);
        const equips = this.equips();
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item) {
                objects.push(item);
            }
        }
        return objects;
    }
    ;
    attackElements() {
        const set = super.attackElements();
        if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
            set.push(this.bareHandsElementId());
        }
        return set;
    }
    ;
    hasNoWeapons() {
        return this.weapons().length === 0;
    }
    ;
    bareHandsElementId() {
        return 1;
    }
    ;
    paramMax(paramId) {
        if (paramId === 0) {
            return 9999; // MHP
        }
        return super.paramMax(paramId);
    }
    ;
    paramBase(paramId) {
        return this.currentClass().params[paramId][this._level];
    }
    ;
    paramPlus(paramId) {
        let value = super.paramPlus(paramId);
        const equips = this.equips();
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item) {
                value += item.params[paramId];
            }
        }
        return value;
    }
    ;
    attackAnimationId1() {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        }
        else {
            const weapons = this.weapons();
            return weapons[0] ? weapons[0].animationId : 0;
        }
    }
    ;
    attackAnimationId2() {
        const weapons = this.weapons();
        return weapons[1] ? weapons[1].animationId : 0;
    }
    ;
    bareHandsAnimationId() {
        return 1;
    }
    ;
    changeExp(exp, show) {
        this._exp[this._classId] = Math.max(exp, 0);
        const lastLevel = this._level;
        const lastSkills = this.skills();
        while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
            this.levelUp();
        }
        while (this.currentExp() < this.currentLevelExp()) {
            this.levelDown();
        }
        if (show && this._level > lastLevel) {
            this.displayLevelUp(this.findNewSkills(lastSkills));
        }
        this.refresh();
    }
    ;
    levelUp() {
        this._level++;
        this.currentClass().learnings.forEach(function (learning) {
            if (learning.level === this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    }
    ;
    levelDown() {
        this._level--;
    }
    ;
    findNewSkills(lastSkills) {
        const newSkills = this.skills();
        for (let i = 0; i < lastSkills.length; i++) {
            const index = newSkills.indexOf(lastSkills[i]);
            if (index >= 0) {
                newSkills.splice(index, 1);
            }
        }
        return newSkills;
    }
    ;
    displayLevelUp(newSkills) {
        const text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
        $gameMessage.newPage();
        $gameMessage.add(text);
        newSkills.forEach(function (skill) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        });
    }
    ;
    gainExp(exp) {
        const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
        this.changeExp(newExp, this.shouldDisplayLevelUp());
    }
    ;
    finalExpRate() {
        return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
    }
    ;
    benchMembersExpRate() {
        return $dataSystem.optExtraExp ? 1 : 0;
    }
    ;
    shouldDisplayLevelUp() {
        return true;
    }
    ;
    changeLevel(level, show) {
        level = level.clamp(1, this.maxLevel());
        this.changeExp(this.expForLevel(level), show);
    }
    ;
    learnSkill(skillId) {
        if (!this.isLearnedSkill(skillId)) {
            this._skills.push(skillId);
            this._skills.sort(function (a, b) {
                return a - b;
            });
        }
    }
    ;
    forgetSkill(skillId) {
        const index = this._skills.indexOf(skillId);
        if (index >= 0) {
            this._skills.splice(index, 1);
        }
    }
    ;
    isLearnedSkill(skillId) {
        return this._skills.contains(skillId);
    }
    ;
    hasSkill(skillId) {
        return this.skills().contains($dataSkills[skillId]);
    }
    ;
    changeClass(classId, keepExp) {
        if (keepExp) {
            this._exp[classId] = this.currentExp();
        }
        this._classId = classId;
        this.changeExp(this._exp[this._classId] || 0, false);
        this.refresh();
    }
    ;
    setCharacterImage(characterName, characterIndex) {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    }
    ;
    setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    }
    ;
    setBattlerImage(battlerName) {
        this._battlerName = battlerName;
    }
    ;
    isSpriteVisible() {
        return $gameSystem.isSideView();
    }
    ;
    startAnimation(animationId, mirror, delay) {
        mirror = !mirror;
        super.startAnimation(animationId, mirror, delay);
    }
    ;
    performAction(action) {
        super.performAction(action);
        if (action.isAttack()) {
            this.performAttack();
        }
        else if (action.isGuard()) {
            this.requestMotion('guard');
        }
        else if (action.isMagicSkill()) {
            this.requestMotion('spell');
        }
        else if (action.isSkill()) {
            this.requestMotion('skill');
        }
        else if (action.isItem()) {
            this.requestMotion('item');
        }
    }
    ;
    performAttack() {
        const weapons = this.weapons();
        const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        const attackMotion = $dataSystem.attackMotions[wtypeId];
        if (attackMotion) {
            if (attackMotion.type === 0) {
                this.requestMotion('thrust');
            }
            else if (attackMotion.type === 1) {
                this.requestMotion('swing');
            }
            else if (attackMotion.type === 2) {
                this.requestMotion('missile');
            }
            this.startWeaponAnimation(attackMotion.weaponImageId);
        }
    }
    ;
    performDamage() {
        super.performDamage();
        if (this.isSpriteVisible()) {
            this.requestMotion('damage');
        }
        else {
            $gameScreen.startShake(5, 5, 10);
        }
        SoundManager.playActorDamage();
    }
    ;
    performEvasion() {
        super.performEvasion();
        this.requestMotion('evade');
    }
    ;
    performMagicEvasion() {
        super.performMagicEvasion();
        this.requestMotion('evade');
    }
    ;
    performCounter() {
        super.performCounter();
        this.performAttack();
    }
    ;
    performCollapse() {
        super.performCollapse();
        if ($gameParty.inBattle()) {
            SoundManager.playActorCollapse();
        }
    }
    ;
    performVictory() {
        if (this.canMove()) {
            this.requestMotion('victory');
        }
    }
    ;
    performEscape() {
        if (this.canMove()) {
            this.requestMotion('escape');
        }
    }
    ;
    makeActionList() {
        const list = [];
        let action = new Game_Action(this);
        action.setAttack();
        list.push(action);
        this.usableSkills().forEach(function (skill) {
            action = new Game_Action(this);
            action.setSkill(skill.id);
            list.push(action);
        }, this);
        return list;
    }
    ;
    makeAutoBattleActions() {
        for (let i = 0; i < this.numActions(); i++) {
            const list = this.makeActionList();
            let maxValue = Number.MIN_VALUE;
            for (let j = 0; j < list.length; j++) {
                const value = list[j].evaluate();
                if (value > maxValue) {
                    maxValue = value;
                    this.setAction(i, list[j]);
                }
            }
        }
        this.setActionState('waiting');
    }
    ;
    makeConfusionActions() {
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setConfusion();
        }
        this.setActionState('waiting');
    }
    ;
    makeActions() {
        super.makeActions();
        if (this.numActions() > 0) {
            this.setActionState('undecided');
        }
        else {
            this.setActionState('waiting');
        }
        if (this.isAutoBattle()) {
            this.makeAutoBattleActions();
        }
        else if (this.isConfused()) {
            this.makeConfusionActions();
        }
    }
    ;
    onPlayerWalk() {
        this.clearResult();
        this.checkFloorEffect();
        if ($gamePlayer.isNormal()) {
            this.turnEndOnMap();
            this.states().forEach(function (state) {
                this.updateStateSteps(state);
            }, this);
            this.showAddedStates();
            this.showRemovedStates();
        }
    }
    ;
    updateStateSteps(state) {
        if (state.removeByWalking) {
            if (this._stateSteps[state.id] > 0) {
                if (--this._stateSteps[state.id] === 0) {
                    this.removeState(state.id);
                }
            }
        }
    }
    ;
    showAddedStates() {
        this.result().addedStateObjects().forEach(function (state) {
            if (state.message1) {
                $gameMessage.add(this._name + state.message1);
            }
        }, this);
    }
    ;
    showRemovedStates() {
        this.result().removedStateObjects().forEach(function (state) {
            if (state.message4) {
                $gameMessage.add(this._name + state.message4);
            }
        }, this);
    }
    ;
    stepsForTurn() {
        return 20;
    }
    ;
    turnEndOnMap() {
        if ($gameParty.steps() % this.stepsForTurn() === 0) {
            this.onTurnEnd();
            if (this.result().hpDamage > 0) {
                this.performMapDamage();
            }
        }
    }
    ;
    checkFloorEffect() {
        if ($gamePlayer.isOnDamageFloor()) {
            this.executeFloorDamage();
        }
    }
    ;
    executeFloorDamage() {
        let damage = Math.floor(this.basicFloorDamage() * this.fdr);
        damage = Math.min(damage, this.maxFloorDamage());
        this.gainHp(-damage);
        if (damage > 0) {
            this.performMapDamage();
        }
    }
    ;
    basicFloorDamage() {
        return 10;
    }
    ;
    maxFloorDamage() {
        return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
    }
    ;
    performMapDamage() {
        if (!$gameParty.inBattle()) {
            $gameScreen.startFlashForDamage();
        }
    }
    ;
    clearActions() {
        super.clearActions();
        this._actionInputIndex = 0;
    }
    ;
    inputtingAction() {
        return this.action(this._actionInputIndex);
    }
    ;
    selectNextCommand() {
        if (this._actionInputIndex < this.numActions() - 1) {
            this._actionInputIndex++;
            return true;
        }
        else {
            return false;
        }
    }
    ;
    selectPreviousCommand() {
        if (this._actionInputIndex > 0) {
            this._actionInputIndex--;
            return true;
        }
        else {
            return false;
        }
    }
    ;
    lastMenuSkill() {
        return this._lastMenuSkill.object();
    }
    ;
    setLastMenuSkill(skill) {
        this._lastMenuSkill.setObject(skill);
    }
    ;
    lastBattleSkill() {
        return this._lastBattleSkill.object();
    }
    ;
    setLastBattleSkill(skill) {
        this._lastBattleSkill.setObject(skill);
    }
    ;
    lastCommandSymbol() {
        return this._lastCommandSymbol;
    }
    ;
    setLastCommandSymbol(symbol) {
        this._lastCommandSymbol = symbol;
    }
    ;
    testEscape(item) {
        return item.effects.some(function (effect, index, ar) {
            return effect && effect.code === ActionEffect.SPECIAL;
        });
    }
    ;
    meetsUsableItemConditions(item) {
        if ($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)) {
            return false;
        }
        return super.meetsUsableItemConditions(item);
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.
class Game_Enemy extends Game_Battler {
    constructor(enemyId, x, y) {
        super();
        this.setup(enemyId, x, y);
    }
    ;
    initMembers() {
        super.initMembers();
        this._enemyId = 0;
        this._letter = '';
        this._plural = false;
        this._screenX = 0;
        this._screenY = 0;
    }
    ;
    setup(enemyId, x, y) {
        this._enemyId = enemyId;
        this._screenX = x;
        this._screenY = y;
        this.recoverAll();
    }
    ;
    isEnemy() {
        return true;
    }
    ;
    friendsUnit() {
        return $gameTroop;
    }
    ;
    opponentsUnit() {
        return $gameParty;
    }
    ;
    index() {
        return $gameTroop.members().indexOf(this);
    }
    ;
    isBattleMember() {
        return this.index() >= 0;
    }
    ;
    enemyId() {
        return this._enemyId;
    }
    ;
    enemy() {
        return $dataEnemies[this._enemyId];
    }
    ;
    traitObjects() {
        let enemy = this.enemy();
        return super.traitObjects().concat(enemy);
    }
    ;
    paramBase(paramId) {
        return this.enemy().params[paramId];
    }
    ;
    exp() {
        return this.enemy().exp;
    }
    ;
    gold() {
        return this.enemy().gold;
    }
    ;
    makeDropItems() {
        return this.enemy().dropItems.reduce(function (r, di) {
            if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
                return r.concat(this.itemObject(di.kind, di.dataId));
            }
            else {
                return r;
            }
        }.bind(this), []);
    }
    ;
    dropItemRate() {
        return $gameParty.hasDropItemDouble() ? 2 : 1;
    }
    ;
    itemObject(kind, dataId) {
        if (kind === 1) {
            return $dataItems[dataId];
        }
        else if (kind === 2) {
            return $dataWeapons[dataId];
        }
        else if (kind === 3) {
            return $dataArmors[dataId];
        }
        else {
            return null;
        }
    }
    ;
    isSpriteVisible() {
        return true;
    }
    ;
    screenX() {
        return this._screenX;
    }
    ;
    screenY() {
        return this._screenY;
    }
    ;
    battlerName() {
        return this.enemy().battlerName;
    }
    ;
    battlerHue() {
        return this.enemy().battlerHue;
    }
    ;
    originalName() {
        return this.enemy().name;
    }
    ;
    name() {
        return this.originalName() + (this._plural ? this._letter : '');
    }
    ;
    isLetterEmpty() {
        return this._letter === '';
    }
    ;
    setLetter(letter) {
        this._letter = letter;
    }
    ;
    setPlural(plural) {
        this._plural = plural;
    }
    ;
    performActionStart(action) {
        super.performActionStart(action);
        this.requestEffect('whiten');
    }
    ;
    // performAction(action: Game_Action) {
    //     super.performAction(action);
    // };
    // performActionEnd() {
    //     super.performActionEnd();
    // };
    performDamage() {
        super.performDamage();
        SoundManager.playEnemyDamage();
        this.requestEffect('blink');
    }
    ;
    performCollapse() {
        super.performCollapse();
        switch (this.collapseType()) {
            case 0:
                this.requestEffect('collapse');
                SoundManager.playEnemyCollapse();
                break;
            case 1:
                this.requestEffect('bossCollapse');
                SoundManager.playBossCollapse1();
                break;
            case 2:
                this.requestEffect('instantCollapse');
                break;
        }
    }
    ;
    transform(enemyId) {
        const name = this.originalName();
        this._enemyId = enemyId;
        if (this.originalName() !== name) {
            this._letter = '';
            this._plural = false;
        }
        this.refresh();
        if (this.numActions() > 0) {
            this.makeActions();
        }
    }
    ;
    meetsCondition(action) {
        const param1 = action.conditionParam1;
        const param2 = action.conditionParam2;
        switch (action.conditionType) {
            case 1:
                return this.meetsTurnCondition(param1, param2);
            case 2:
                return this.meetsHpCondition(param1, param2);
            case 3:
                return this.meetsMpCondition(param1, param2);
            case 4:
                return this.meetsStateCondition(param1);
            case 5:
                return this.meetsPartyLevelCondition(param1);
            case 6:
                return this.meetsSwitchCondition(param1);
            default:
                return true;
        }
    }
    ;
    meetsTurnCondition(param1, param2) {
        const n = $gameTroop.turnCount();
        if (param2 === 0) {
            return n === param1;
        }
        else {
            return n > 0 && n >= param1 && n % param2 === param1 % param2;
        }
    }
    ;
    meetsHpCondition(param1, param2) {
        return this.hpRate() >= param1 && this.hpRate() <= param2;
    }
    ;
    meetsMpCondition(param1, param2) {
        return this.mpRate() >= param1 && this.mpRate() <= param2;
    }
    ;
    meetsStateCondition(param) {
        return this.isStateAffected(param);
    }
    ;
    meetsPartyLevelCondition(param) {
        return $gameParty.highestLevel() >= param;
    }
    ;
    meetsSwitchCondition(param) {
        return $gameSwitches.value(param);
    }
    ;
    isActionValid(action) {
        return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
    }
    ;
    selectAction(actionList, ratingZero) {
        const sum = actionList.reduce(function (r, a) {
            return r + a.rating - ratingZero;
        }, 0);
        if (sum > 0) {
            let value = Math.randomInt(sum);
            for (let i = 0; i < actionList.length; i++) {
                const action = actionList[i];
                value -= action.rating - ratingZero;
                if (value < 0) {
                    return action;
                }
            }
        }
        else {
            return null;
        }
    }
    ;
    selectAllActions(actionList) {
        const ratingMax = Math.max.apply(null, actionList.map(function (a) {
            return a.rating;
        }));
        const ratingZero = ratingMax - 3;
        actionList = actionList.filter(function (a) {
            return a.rating > ratingZero;
        });
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
        }
    }
    ;
    makeActions() {
        super.makeActions();
        if (this.numActions() > 0) {
            const actionList = this.enemy().actions.filter(function (a) {
                return this.isActionValid(a);
            }, this);
            if (actionList.length > 0) {
                this.selectAllActions(actionList);
            }
        }
        this.setActionState('waiting');
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.
class Game_Actors {
    constructor() {
        this._data = [];
    }
    actor(actorId) {
        if ($dataActors[actorId]) {
            if (!this._data[actorId]) {
                this._data[actorId] = new Game_Actor(actorId);
            }
            return this._data[actorId];
        }
        return null;
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.
class Game_Unit {
    constructor() {
        this._inBattle = false;
    }
    inBattle() {
        return this._inBattle;
    }
    ;
    members() {
        return [];
    }
    ;
    aliveMembers() {
        return this.members().filter(function (member) {
            return member.isAlive();
        });
    }
    ;
    deadMembers() {
        return this.members().filter(function (member) {
            return member.isDead();
        });
    }
    ;
    movableMembers() {
        return this.members().filter(function (member) {
            return member.canMove();
        });
    }
    ;
    clearActions() {
        return this.members().forEach(function (member) {
            return member.clearActions();
        });
    }
    ;
    agility() {
        const members = this.members();
        if (members.length === 0) {
            return 1;
        }
        const sum = members.reduce(function (r, member) {
            return r + member.agi;
        }, 0);
        return sum / members.length;
    }
    ;
    tgrSum() {
        return this.aliveMembers().reduce(function (r, member) {
            return r + member.tgr;
        }, 0);
    }
    ;
    randomTarget() {
        let tgrRand = Math.random() * this.tgrSum();
        let target = null;
        this.aliveMembers().forEach(function (member) {
            tgrRand -= member.tgr;
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        });
        return target;
    }
    ;
    randomDeadTarget() {
        const members = this.deadMembers();
        if (members.length === 0) {
            return null;
        }
        return members[Math.floor(Math.random() * members.length)];
    }
    ;
    smoothTarget(index) {
        if (index < 0) {
            index = 0;
        }
        const member = this.members()[index];
        return (member && member.isAlive()) ? member : this.aliveMembers()[0];
    }
    ;
    smoothDeadTarget(index) {
        if (index < 0) {
            index = 0;
        }
        const member = this.members()[index];
        return (member && member.isDead()) ? member : this.deadMembers()[0];
    }
    ;
    clearResults() {
        this.members().forEach(function (member) {
            member.clearResult();
        });
    }
    ;
    onBattleStart() {
        this.members().forEach(function (member) {
            member.onBattleStart();
        });
        this._inBattle = true;
    }
    ;
    onBattleEnd() {
        this._inBattle = false;
        this.members().forEach(function (member) {
            member.onBattleEnd();
        });
    }
    ;
    makeActions() {
        this.members().forEach(function (member) {
            member.makeActions();
        });
    }
    ;
    select(activeMember) {
        this.members().forEach(function (member) {
            if (member === activeMember) {
                member.select();
            }
            else {
                member.deselect();
            }
        });
    }
    ;
    isAllDead() {
        return this.aliveMembers().length === 0;
    }
    ;
    substituteBattler() {
        const members = this.members();
        for (let i = 0; i < members.length; i++) {
            if (members[i].isSubstitute()) {
                return members[i];
            }
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.
var PartyAbility;
(function (PartyAbility) {
    PartyAbility[PartyAbility["ENCOUNTER_HALF"] = 0] = "ENCOUNTER_HALF";
    PartyAbility[PartyAbility["ENCOUNTER_NONE"] = 1] = "ENCOUNTER_NONE";
    PartyAbility[PartyAbility["CANCEL_SURPRISE"] = 2] = "CANCEL_SURPRISE";
    PartyAbility[PartyAbility["RAISE_PREEMPTIVE"] = 3] = "RAISE_PREEMPTIVE";
    PartyAbility[PartyAbility["GOLD_DOUBLE"] = 4] = "GOLD_DOUBLE";
    PartyAbility[PartyAbility["DROP_ITEM_DOUBLE"] = 5] = "DROP_ITEM_DOUBLE";
})(PartyAbility || (PartyAbility = {}));
class Game_Party extends Game_Unit {
    constructor() {
        super(...arguments);
        this._gold = 0;
        this._steps = 0;
        this._lastItem = new Game_Item();
        this._menuActorId = 0;
        this._targetActorId = 0;
        this._actors = [];
        this._items = {};
        this._weapons = {};
        this._armors = {};
    }
    exists() {
        return this._actors.length > 0;
    }
    ;
    size() {
        return this.members().length;
    }
    ;
    isEmpty() {
        return this.size() === 0;
    }
    ;
    members() {
        return this.inBattle() ?
            this.battleMembers() :
            this.allMembers();
    }
    ;
    allMembers() {
        return this._actors.map(function (id) {
            return $gameActors.actor(id);
        });
    }
    ;
    battleMembers() {
        return this.allMembers().slice(0, this.maxBattleMembers()).filter(function (actor) {
            return actor.isAppeared();
        });
    }
    ;
    maxBattleMembers() {
        return 4;
    }
    ;
    leader() {
        return this.battleMembers()[0];
    }
    ;
    reviveBattleMembers() {
        this.battleMembers().forEach(function (actor) {
            if (actor.isDead()) {
                actor.setHp(1);
            }
        });
    }
    ;
    items() {
        const list = [];
        for (let id in this._items) {
            list.push($dataItems[id]);
        }
        return list;
    }
    ;
    weapons() {
        const list = [];
        for (let id in this._weapons) {
            list.push($dataWeapons[id]);
        }
        return list;
    }
    ;
    armors() {
        const list = [];
        for (let id in this._armors) {
            list.push($dataArmors[id]);
        }
        return list;
    }
    ;
    equipItems() {
        const armors = this.armors();
        const weapons = this.weapons();
        return weapons.concat(armors);
    }
    ;
    allItems() {
        const equips = this.equipItems();
        const items = this.items();
        return items.concat(equips);
    }
    ;
    itemContainer(item) {
        if (!item) {
            return null;
        }
        else if (DataManager.isItem(item)) {
            return this._items;
        }
        else if (DataManager.isWeapon(item)) {
            return this._weapons;
        }
        else if (DataManager.isArmor(item)) {
            return this._armors;
        }
        else {
            return null;
        }
    }
    ;
    setupStartingMembers() {
        this._actors = [];
        $dataSystem.partyMembers.forEach(function (actorId) {
            if ($gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }, this);
    }
    ;
    name() {
        const numBattleMembers = this.battleMembers().length;
        if (numBattleMembers === 0) {
            return '';
        }
        else if (numBattleMembers === 1) {
            return this.leader().name();
        }
        else {
            return TextManager.partyName.format(this.leader().name());
        }
    }
    ;
    setupBattleTest() {
        this.setupBattleTestMembers();
        this.setupBattleTestItems();
    }
    ;
    setupBattleTestMembers() {
        $dataSystem.testBattlers.forEach(function (battler) {
            const actor = $gameActors.actor(battler.actorId);
            if (actor) {
                actor.changeLevel(battler.level, false);
                actor.initEquips(battler.equips);
                actor.recoverAll();
                this.addActor(battler.actorId);
            }
        }, this);
    }
    ;
    setupBattleTestItems() {
        $dataItems.forEach(function (item) {
            if (item && item.name.length > 0) {
                this.gainItem(item, this.maxItems(item));
            }
        }, this);
    }
    ;
    highestLevel() {
        return Math.max.apply(null, this.members().map(function (actor) {
            return actor.level;
        }));
    }
    ;
    addActor(actorId) {
        if (!this._actors.contains(actorId)) {
            this._actors.push(actorId);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    }
    ;
    removeActor(actorId) {
        if (this._actors.contains(actorId)) {
            this._actors.splice(this._actors.indexOf(actorId), 1);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    }
    ;
    gold() {
        return this._gold;
    }
    ;
    gainGold(amount) {
        this._gold = (this._gold + amount).clamp(0, this.maxGold());
    }
    ;
    loseGold(amount) {
        this.gainGold(-amount);
    }
    ;
    maxGold() {
        return 99999999;
    }
    ;
    steps() {
        return this._steps;
    }
    ;
    increaseSteps() {
        this._steps++;
    }
    ;
    numItems(item) {
        const container = this.itemContainer(item);
        return container ? container[item.id] || 0 : 0;
    }
    ;
    maxItems(item) {
        return 99;
    }
    ;
    hasMaxItems(item) {
        return this.numItems(item) >= this.maxItems(item);
    }
    ;
    hasItem(item, includeEquip = false) {
        if (this.numItems(item) > 0) {
            return true;
        }
        else if (includeEquip && this.isAnyMemberEquipped(item)) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    isAnyMemberEquipped(item) {
        return this.members().some(function (actor) {
            return actor.equips().contains(item);
        });
    }
    ;
    gainItem(item, amount, includeEquip = false) {
        const container = this.itemContainer(item);
        if (container) {
            const lastNumber = this.numItems(item);
            const newNumber = lastNumber + amount;
            container[item.id] = newNumber.clamp(0, this.maxItems(item));
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item, -newNumber);
            }
            $gameMap.requestRefresh();
        }
    }
    ;
    discardMembersEquip(item, amount) {
        let n = amount;
        this.members().forEach(function (actor) {
            while (n > 0 && actor.isEquipped(item)) {
                actor.discardEquip(item);
                n--;
            }
        });
    }
    ;
    loseItem(item, amount, includeEquip) {
        this.gainItem(item, -amount, includeEquip);
    }
    ;
    consumeItem(item) {
        if (DataManager.isItem(item) && item.consumable) {
            this.loseItem(item, 1);
        }
    }
    ;
    canUse(item) {
        return this.members().some(function (actor) {
            return actor.canUse(item);
        });
    }
    ;
    canInput() {
        return this.members().some(function (actor) {
            return actor.canInput();
        });
    }
    ;
    isAllDead() {
        if (super.isAllDead()) {
            return this.inBattle() || !this.isEmpty();
        }
        else {
            return false;
        }
    }
    ;
    onPlayerWalk() {
        this.members().forEach(function (actor) {
            return actor.onPlayerWalk();
        });
    }
    ;
    menuActor() {
        let actor = $gameActors.actor(this._menuActorId);
        if (!this.members().contains(actor)) {
            actor = this.members()[0];
        }
        return actor;
    }
    ;
    setMenuActor(actor) {
        this._menuActorId = actor.actorId();
    }
    ;
    makeMenuActorNext() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        }
        else {
            this.setMenuActor(this.members()[0]);
        }
    }
    ;
    makeMenuActorPrevious() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + this.members().length - 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        }
        else {
            this.setMenuActor(this.members()[0]);
        }
    }
    ;
    targetActor() {
        let actor = $gameActors.actor(this._targetActorId);
        if (!this.members().contains(actor)) {
            actor = this.members()[0];
        }
        return actor;
    }
    ;
    setTargetActor(actor) {
        this._targetActorId = actor.actorId();
    }
    ;
    lastItem() {
        return this._lastItem.object();
    }
    ;
    setLastItem(item) {
        this._lastItem.setObject(item);
    }
    ;
    swapOrder(index1, index2) {
        const temp = this._actors[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        $gamePlayer.refresh();
    }
    ;
    charactersForSavefile() {
        return this.battleMembers().map(function (actor) {
            return [actor.characterName(), actor.characterIndex()];
        });
    }
    ;
    facesForSavefile() {
        return this.battleMembers().map(function (actor) {
            return [actor.faceName(), actor.faceIndex()];
        });
    }
    ;
    partyAbility(abilityId) {
        return this.battleMembers().some(function (actor) {
            return actor.partyAbility(abilityId);
        });
    }
    ;
    hasEncounterHalf() {
        return this.partyAbility(PartyAbility.ENCOUNTER_HALF);
    }
    ;
    hasEncounterNone() {
        return this.partyAbility(PartyAbility.ENCOUNTER_NONE);
    }
    ;
    hasCancelSurprise() {
        return this.partyAbility(PartyAbility.CANCEL_SURPRISE);
    }
    ;
    hasRaisePreemptive() {
        return this.partyAbility(PartyAbility.RAISE_PREEMPTIVE);
    }
    ;
    hasGoldDouble() {
        return this.partyAbility(PartyAbility.GOLD_DOUBLE);
    }
    ;
    hasDropItemDouble() {
        return this.partyAbility(PartyAbility.DROP_ITEM_DOUBLE);
    }
    ;
    ratePreemptive(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    }
    ;
    rateSurprise(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
        if (this.hasCancelSurprise()) {
            rate = 0;
        }
        return rate;
    }
    ;
    performVictory() {
        this.members().forEach(function (actor) {
            actor.performVictory();
        });
    }
    ;
    performEscape() {
        this.members().forEach(function (actor) {
            actor.performEscape();
        });
    }
    ;
    removeBattleStates() {
        this.members().forEach(function (actor) {
            actor.removeBattleStates();
        });
    }
    ;
    requestMotionRefresh() {
        this.members().forEach(function (actor) {
            actor.requestMotionRefresh();
        });
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.
class Game_CharacterBase {
    get x() { return this._x; }
    get y() { return this._y; }
    constructor() {
        this.initMembers();
    }
    ;
    initMembers() {
        this._x = 0;
        this._y = 0;
        this._realX = 0;
        this._realY = 0;
        this._moveSpeed = 4;
        this._moveFrequency = 6;
        this._opacity = 255;
        this._blendMode = 0;
        this._direction = 2;
        this._pattern = 1;
        this._priorityType = 1;
        this._tileId = 0;
        this._characterName = '';
        this._characterIndex = 0;
        this._isObjectCharacter = false;
        this._walkAnime = true;
        this._stepAnime = false;
        this._directionFix = false;
        this._through = false;
        this._transparent = false;
        this._bushDepth = 0;
        this._animationId = 0;
        this._balloonId = 0;
        this._animationPlaying = false;
        this._balloonPlaying = false;
        this._animationCount = 0;
        this._stopCount = 0;
        this._jumpCount = 0;
        this._jumpPeak = 0;
        this._movementSuccess = true;
    }
    ;
    pos(x, y) {
        return this._x === x && this._y === y;
    }
    ;
    posNt(x, y) {
        // No through
        return this.pos(x, y) && !this.isThrough();
    }
    ;
    moveSpeed() {
        return this._moveSpeed;
    }
    ;
    setMoveSpeed(moveSpeed) {
        this._moveSpeed = moveSpeed;
    }
    ;
    moveFrequency() {
        return this._moveFrequency;
    }
    ;
    setMoveFrequency(moveFrequency) {
        this._moveFrequency = moveFrequency;
    }
    ;
    opacity() {
        return this._opacity;
    }
    ;
    setOpacity(opacity) {
        this._opacity = opacity;
    }
    ;
    blendMode() {
        return this._blendMode;
    }
    ;
    setBlendMode(blendMode) {
        this._blendMode = blendMode;
    }
    ;
    isNormalPriority() {
        return this._priorityType === 1;
    }
    ;
    setPriorityType(priorityType) {
        this._priorityType = priorityType;
    }
    ;
    isMoving() {
        return this._realX !== this._x || this._realY !== this._y;
    }
    ;
    isJumping() {
        return this._jumpCount > 0;
    }
    ;
    jumpHeight() {
        return (this._jumpPeak * this._jumpPeak -
            Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
    }
    ;
    isStopping() {
        return !this.isMoving() && !this.isJumping();
    }
    ;
    checkStop(threshold) {
        return this._stopCount > threshold;
    }
    ;
    resetStopCount() {
        this._stopCount = 0;
    }
    ;
    realMoveSpeed() {
        return this._moveSpeed + (this.isDashing() ? 1 : 0);
    }
    ;
    distancePerFrame() {
        return Math.pow(2, this.realMoveSpeed()) / 256;
    }
    ;
    isDashing() {
        return false;
    }
    ;
    isDebugThrough() {
        return false;
    }
    ;
    straighten() {
        if (this.hasWalkAnime() || this.hasStepAnime()) {
            this._pattern = 1;
        }
        this._animationCount = 0;
    }
    ;
    reverseDir(d) {
        return 10 - d;
    }
    ;
    canPass(x, y, d) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (this.isThrough() || this.isDebugThrough()) {
            return true;
        }
        if (!this.isMapPassable(x, y, d)) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
        return true;
    }
    ;
    canPassDiagonally(x, y, horz, vert) {
        const x2 = $gameMap.roundXWithDirection(x, horz);
        const y2 = $gameMap.roundYWithDirection(y, vert);
        if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
            return true;
        }
        if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
            return true;
        }
        return false;
    }
    ;
    isMapPassable(x, y, d) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        const d2 = this.reverseDir(d);
        return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
    }
    ;
    isCollidedWithCharacters(x, y) {
        return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
    }
    ;
    isCollidedWithEvents(x, y) {
        const events = $gameMap.eventsXyNt(x, y);
        return events.some(function (event) {
            return event.isNormalPriority();
        });
    }
    ;
    isCollidedWithVehicles(x, y) {
        return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
    }
    ;
    setPosition(x, y) {
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._realX = x;
        this._realY = y;
    }
    ;
    copyPosition(character) {
        this._x = character._x;
        this._y = character._y;
        this._realX = character._realX;
        this._realY = character._realY;
        this._direction = character._direction;
    }
    ;
    locate(x, y) {
        this.setPosition(x, y);
        this.straighten();
        this.refreshBushDepth();
    }
    ;
    direction() {
        return this._direction;
    }
    ;
    setDirection(d) {
        if (!this.isDirectionFixed() && d) {
            this._direction = d;
        }
        this.resetStopCount();
    }
    ;
    isTile() {
        return this._tileId > 0 && this._priorityType === 0;
    }
    ;
    isObjectCharacter() {
        return this._isObjectCharacter;
    }
    ;
    shiftY() {
        return this.isObjectCharacter() ? 0 : 6;
    }
    ;
    scrolledX() {
        return $gameMap.adjustX(this._realX);
    }
    ;
    scrolledY() {
        return $gameMap.adjustY(this._realY);
    }
    ;
    screenX() {
        const tw = $gameMap.tileWidth();
        return Math.round(this.scrolledX() * tw + tw / 2);
    }
    ;
    screenY() {
        const th = $gameMap.tileHeight();
        return Math.round(this.scrolledY() * th + th -
            this.shiftY() - this.jumpHeight());
    }
    ;
    screenZ() {
        return this._priorityType * 2 + 1;
    }
    ;
    isNearTheScreen() {
        const gw = Graphics.width;
        const gh = Graphics.height;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const px = this.scrolledX() * tw + tw / 2 - gw / 2;
        const py = this.scrolledY() * th + th / 2 - gh / 2;
        return px >= -gw && px <= gw && py >= -gh && py <= gh;
    }
    ;
    update() {
        if (this.isStopping()) {
            this.updateStop();
        }
        if (this.isJumping()) {
            this.updateJump();
        }
        else if (this.isMoving()) {
            this.updateMove();
        }
        this.updateAnimation();
    }
    ;
    updateStop() {
        this._stopCount++;
    }
    ;
    updateJump() {
        this._jumpCount--;
        this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
        this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
        this.refreshBushDepth();
        if (this._jumpCount === 0) {
            this._realX = this._x = $gameMap.roundX(this._x);
            this._realY = this._y = $gameMap.roundY(this._y);
        }
    }
    ;
    updateMove() {
        if (this._x < this._realX) {
            this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
        }
        if (this._x > this._realX) {
            this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
        }
        if (this._y < this._realY) {
            this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
        }
        if (this._y > this._realY) {
            this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
        }
        if (!this.isMoving()) {
            this.refreshBushDepth();
        }
    }
    ;
    updateAnimation() {
        this.updateAnimationCount();
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this._animationCount = 0;
        }
    }
    ;
    animationWait() {
        return (9 - this.realMoveSpeed()) * 3;
    }
    ;
    updateAnimationCount() {
        if (this.isMoving() && this.hasWalkAnime()) {
            this._animationCount += 1.5;
        }
        else if (this.hasStepAnime() || !this.isOriginalPattern()) {
            this._animationCount++;
        }
    }
    ;
    updatePattern() {
        if (!this.hasStepAnime() && this._stopCount > 0) {
            this.resetPattern();
        }
        else {
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }
    }
    ;
    maxPattern() {
        return 4;
    }
    ;
    pattern() {
        return this._pattern < 3 ? this._pattern : 1;
    }
    ;
    setPattern(pattern) {
        this._pattern = pattern;
    }
    ;
    isOriginalPattern() {
        return this.pattern() === 1;
    }
    ;
    resetPattern() {
        this.setPattern(1);
    }
    ;
    refreshBushDepth() {
        if (this.isNormalPriority() && !this.isObjectCharacter() &&
            this.isOnBush() && !this.isJumping()) {
            if (!this.isMoving()) {
                this._bushDepth = 12;
            }
        }
        else {
            this._bushDepth = 0;
        }
    }
    ;
    isOnLadder() {
        return $gameMap.isLadder(this._x, this._y);
    }
    ;
    isOnBush() {
        return $gameMap.isBush(this._x, this._y);
    }
    ;
    terrainTag() {
        return $gameMap.terrainTag(this._x, this._y);
    }
    ;
    regionId() {
        return $gameMap.regionId(this._x, this._y);
    }
    ;
    increaseSteps() {
        if (this.isOnLadder()) {
            this.setDirection(8);
        }
        this.resetStopCount();
        this.refreshBushDepth();
    }
    ;
    tileId() {
        return this._tileId;
    }
    ;
    characterName() {
        return this._characterName;
    }
    ;
    characterIndex() {
        return this._characterIndex;
    }
    ;
    setImage(characterName, characterIndex) {
        this._tileId = 0;
        this._characterName = characterName;
        this._characterIndex = characterIndex;
        this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
    }
    ;
    setTileImage(tileId) {
        this._tileId = tileId;
        this._characterName = '';
        this._characterIndex = 0;
        this._isObjectCharacter = true;
    }
    ;
    checkEventTriggerTouchFront(d) {
        const x2 = $gameMap.roundXWithDirection(this._x, d);
        const y2 = $gameMap.roundYWithDirection(this._y, d);
        this.checkEventTriggerTouch(x2, y2);
    }
    ;
    checkEventTriggerTouch(x, y) {
        // return false;
    }
    ;
    /// bungcip: x & y harusnya tidak perlu....
    isMovementSucceeded(x, y) {
        return this._movementSuccess;
    }
    ;
    setMovementSuccess(success) {
        this._movementSuccess = success;
    }
    ;
    moveStraight(d) {
        this.setMovementSuccess(this.canPass(this._x, this._y, d));
        if (this.isMovementSucceeded()) {
            this.setDirection(d);
            this._x = $gameMap.roundXWithDirection(this._x, d);
            this._y = $gameMap.roundYWithDirection(this._y, d);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
            this.increaseSteps();
        }
        else {
            this.setDirection(d);
            this.checkEventTriggerTouchFront(d);
        }
    }
    ;
    moveDiagonally(horz, vert) {
        this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
        if (this.isMovementSucceeded()) {
            this._x = $gameMap.roundXWithDirection(this._x, horz);
            this._y = $gameMap.roundYWithDirection(this._y, vert);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
            this.increaseSteps();
        }
        if (this._direction === this.reverseDir(horz)) {
            this.setDirection(horz);
        }
        if (this._direction === this.reverseDir(vert)) {
            this.setDirection(vert);
        }
    }
    ;
    jump(xPlus, yPlus) {
        if (Math.abs(xPlus) > Math.abs(yPlus)) {
            if (xPlus !== 0) {
                this.setDirection(xPlus < 0 ? 4 : 6);
            }
        }
        else {
            if (yPlus !== 0) {
                this.setDirection(yPlus < 0 ? 8 : 2);
            }
        }
        this._x += xPlus;
        this._y += yPlus;
        const distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
        this._jumpPeak = 10 + distance - this._moveSpeed;
        this._jumpCount = this._jumpPeak * 2;
        this.resetStopCount();
        this.straighten();
    }
    ;
    hasWalkAnime() {
        return this._walkAnime;
    }
    ;
    setWalkAnime(walkAnime) {
        this._walkAnime = walkAnime;
    }
    ;
    hasStepAnime() {
        return this._stepAnime;
    }
    ;
    setStepAnime(stepAnime) {
        this._stepAnime = stepAnime;
    }
    ;
    isDirectionFixed() {
        return this._directionFix;
    }
    ;
    setDirectionFix(directionFix) {
        this._directionFix = directionFix;
    }
    ;
    isThrough() {
        return this._through;
    }
    ;
    setThrough(through) {
        this._through = through;
    }
    ;
    isTransparent() {
        return this._transparent;
    }
    ;
    bushDepth() {
        return this._bushDepth;
    }
    ;
    setTransparent(transparent) {
        this._transparent = transparent;
    }
    ;
    requestAnimation(animationId) {
        this._animationId = animationId;
    }
    ;
    requestBalloon(balloonId) {
        this._balloonId = balloonId;
    }
    ;
    animationId() {
        return this._animationId;
    }
    ;
    balloonId() {
        return this._balloonId;
    }
    ;
    startAnimation() {
        this._animationId = 0;
        this._animationPlaying = true;
    }
    ;
    startBalloon() {
        this._balloonId = 0;
        this._balloonPlaying = true;
    }
    ;
    isAnimationPlaying() {
        return this._animationId > 0 || this._animationPlaying;
    }
    ;
    isBalloonPlaying() {
        return this._balloonId > 0 || this._balloonPlaying;
    }
    ;
    endAnimation() {
        this._animationPlaying = false;
    }
    ;
    endBalloon() {
        this._balloonPlaying = false;
    }
    ;
}

var Route;
(function (Route) {
    Route[Route["END"] = 0] = "END";
    Route[Route["MOVE_DOWN"] = 1] = "MOVE_DOWN";
    Route[Route["MOVE_LEFT"] = 2] = "MOVE_LEFT";
    Route[Route["MOVE_RIGHT"] = 3] = "MOVE_RIGHT";
    Route[Route["MOVE_UP"] = 4] = "MOVE_UP";
    Route[Route["MOVE_LOWER_L"] = 5] = "MOVE_LOWER_L";
    Route[Route["MOVE_LOWER_R"] = 6] = "MOVE_LOWER_R";
    Route[Route["MOVE_UPPER_L"] = 7] = "MOVE_UPPER_L";
    Route[Route["MOVE_UPPER_R"] = 8] = "MOVE_UPPER_R";
    Route[Route["MOVE_RANDOM"] = 9] = "MOVE_RANDOM";
    Route[Route["MOVE_TOWARD"] = 10] = "MOVE_TOWARD";
    Route[Route["MOVE_AWAY"] = 11] = "MOVE_AWAY";
    Route[Route["MOVE_FORWARD"] = 12] = "MOVE_FORWARD";
    Route[Route["MOVE_BACKWARD"] = 13] = "MOVE_BACKWARD";
    Route[Route["JUMP"] = 14] = "JUMP";
    Route[Route["WAIT"] = 15] = "WAIT";
    Route[Route["TURN_DOWN"] = 16] = "TURN_DOWN";
    Route[Route["TURN_LEFT"] = 17] = "TURN_LEFT";
    Route[Route["TURN_RIGHT"] = 18] = "TURN_RIGHT";
    Route[Route["TURN_UP"] = 19] = "TURN_UP";
    Route[Route["TURN_90D_R"] = 20] = "TURN_90D_R";
    Route[Route["TURN_90D_L"] = 21] = "TURN_90D_L";
    Route[Route["TURN_180D"] = 22] = "TURN_180D";
    Route[Route["TURN_90D_R_L"] = 23] = "TURN_90D_R_L";
    Route[Route["TURN_RANDOM"] = 24] = "TURN_RANDOM";
    Route[Route["TURN_TOWARD"] = 25] = "TURN_TOWARD";
    Route[Route["TURN_AWAY"] = 26] = "TURN_AWAY";
    Route[Route["SWITCH_ON"] = 27] = "SWITCH_ON";
    Route[Route["SWITCH_OFF"] = 28] = "SWITCH_OFF";
    Route[Route["CHANGE_SPEED"] = 29] = "CHANGE_SPEED";
    Route[Route["CHANGE_FREQ"] = 30] = "CHANGE_FREQ";
    Route[Route["WALK_ANIME_ON"] = 31] = "WALK_ANIME_ON";
    Route[Route["WALK_ANIME_OFF"] = 32] = "WALK_ANIME_OFF";
    Route[Route["STEP_ANIME_ON"] = 33] = "STEP_ANIME_ON";
    Route[Route["STEP_ANIME_OFF"] = 34] = "STEP_ANIME_OFF";
    Route[Route["DIR_FIX_ON"] = 35] = "DIR_FIX_ON";
    Route[Route["DIR_FIX_OFF"] = 36] = "DIR_FIX_OFF";
    Route[Route["THROUGH_ON"] = 37] = "THROUGH_ON";
    Route[Route["THROUGH_OFF"] = 38] = "THROUGH_OFF";
    Route[Route["TRANSPARENT_ON"] = 39] = "TRANSPARENT_ON";
    Route[Route["TRANSPARENT_OFF"] = 40] = "TRANSPARENT_OFF";
    Route[Route["CHANGE_IMAGE"] = 41] = "CHANGE_IMAGE";
    Route[Route["CHANGE_OPACITY"] = 42] = "CHANGE_OPACITY";
    Route[Route["CHANGE_BLEND_MODE"] = 43] = "CHANGE_BLEND_MODE";
    Route[Route["PLAY_SE"] = 44] = "PLAY_SE";
    Route[Route["SCRIPT"] = 45] = "SCRIPT";
})(Route || (Route = {}));
class Game_Character extends Game_CharacterBase {
    constructor() {
        super(...arguments);
        this._moveRoute = null;
        this._moveRouteIndex = 0;
        this._originalMoveRoute = null;
        this._originalMoveRouteIndex = 0;
        this._waitCount = 0;
    }
    initMembers() {
        super.initMembers();
        this._moveRouteForcing = false;
        this._moveRoute = null;
        this._moveRouteIndex = 0;
        this._originalMoveRoute = null;
        this._originalMoveRouteIndex = 0;
        this._waitCount = 0;
    }
    ;
    memorizeMoveRoute() {
        this._originalMoveRoute = this._moveRoute;
        this._originalMoveRouteIndex = this._moveRouteIndex;
    }
    ;
    restoreMoveRoute() {
        this._moveRoute = this._originalMoveRoute;
        this._moveRouteIndex = this._originalMoveRouteIndex;
        this._originalMoveRoute = null;
    }
    ;
    isMoveRouteForcing() {
        return this._moveRouteForcing;
    }
    ;
    setMoveRoute(moveRoute) {
        this._moveRoute = moveRoute;
        this._moveRouteIndex = 0;
        this._moveRouteForcing = false;
    }
    ;
    forceMoveRoute(moveRoute) {
        if (!this._originalMoveRoute) {
            this.memorizeMoveRoute();
        }
        this._moveRoute = moveRoute;
        this._moveRouteIndex = 0;
        this._moveRouteForcing = true;
        this._waitCount = 0;
    }
    ;
    updateStop() {
        super.updateStop();
        if (this._moveRouteForcing) {
            this.updateRoutineMove();
        }
    }
    ;
    updateRoutineMove() {
        if (this._waitCount > 0) {
            this._waitCount--;
        }
        else {
            this.setMovementSuccess(true);
            const command = this._moveRoute.list[this._moveRouteIndex];
            if (command) {
                this.processMoveCommand(command);
                this.advanceMoveRouteIndex();
            }
        }
    }
    ;
    processMoveCommand(command) {
        // const gc = Game_Character;
        const params = command.parameters;
        switch (command.code) {
            case Route.END:
                this.processRouteEnd();
                break;
            case Route.MOVE_DOWN:
                this.moveStraight(2);
                break;
            case Route.MOVE_LEFT:
                this.moveStraight(4);
                break;
            case Route.MOVE_RIGHT:
                this.moveStraight(6);
                break;
            case Route.MOVE_UP:
                this.moveStraight(8);
                break;
            case Route.MOVE_LOWER_L:
                this.moveDiagonally(4, 2);
                break;
            case Route.MOVE_LOWER_R:
                this.moveDiagonally(6, 2);
                break;
            case Route.MOVE_UPPER_L:
                this.moveDiagonally(4, 8);
                break;
            case Route.MOVE_UPPER_R:
                this.moveDiagonally(6, 8);
                break;
            case Route.MOVE_RANDOM:
                this.moveRandom();
                break;
            case Route.MOVE_TOWARD:
                this.moveTowardPlayer();
                break;
            case Route.MOVE_AWAY:
                this.moveAwayFromPlayer();
                break;
            case Route.MOVE_FORWARD:
                this.moveForward();
                break;
            case Route.MOVE_BACKWARD:
                this.moveBackward();
                break;
            case Route.JUMP:
                this.jump(params[0], params[1]);
                break;
            case Route.WAIT:
                this._waitCount = params[0] - 1;
                break;
            case Route.TURN_DOWN:
                this.setDirection(2);
                break;
            case Route.TURN_LEFT:
                this.setDirection(4);
                break;
            case Route.TURN_RIGHT:
                this.setDirection(6);
                break;
            case Route.TURN_UP:
                this.setDirection(8);
                break;
            case Route.TURN_90D_R:
                this.turnRight90();
                break;
            case Route.TURN_90D_L:
                this.turnLeft90();
                break;
            case Route.TURN_180D:
                this.turn180();
                break;
            case Route.TURN_90D_R_L:
                this.turnRightOrLeft90();
                break;
            case Route.TURN_RANDOM:
                this.turnRandom();
                break;
            case Route.TURN_TOWARD:
                this.turnTowardPlayer();
                break;
            case Route.TURN_AWAY:
                this.turnAwayFromPlayer();
                break;
            case Route.SWITCH_ON:
                $gameSwitches.setValue(params[0], true);
                break;
            case Route.SWITCH_OFF:
                $gameSwitches.setValue(params[0], false);
                break;
            case Route.CHANGE_SPEED:
                this.setMoveSpeed(params[0]);
                break;
            case Route.CHANGE_FREQ:
                this.setMoveFrequency(params[0]);
                break;
            case Route.WALK_ANIME_ON:
                this.setWalkAnime(true);
                break;
            case Route.WALK_ANIME_OFF:
                this.setWalkAnime(false);
                break;
            case Route.STEP_ANIME_ON:
                this.setStepAnime(true);
                break;
            case Route.STEP_ANIME_OFF:
                this.setStepAnime(false);
                break;
            case Route.DIR_FIX_ON:
                this.setDirectionFix(true);
                break;
            case Route.DIR_FIX_OFF:
                this.setDirectionFix(false);
                break;
            case Route.THROUGH_ON:
                this.setThrough(true);
                break;
            case Route.THROUGH_OFF:
                this.setThrough(false);
                break;
            case Route.TRANSPARENT_ON:
                this.setTransparent(true);
                break;
            case Route.TRANSPARENT_OFF:
                this.setTransparent(false);
                break;
            case Route.CHANGE_IMAGE:
                this.setImage(params[0], params[1]);
                break;
            case Route.CHANGE_OPACITY:
                this.setOpacity(params[0]);
                break;
            case Route.CHANGE_BLEND_MODE:
                this.setBlendMode(params[0]);
                break;
            case Route.PLAY_SE:
                AudioManager.playSe(params[0]);
                break;
            case Route.SCRIPT:
                eval(params[0]);
                break;
        }
    }
    ;
    deltaXFrom(x) {
        return $gameMap.deltaX(this.x, x);
    }
    ;
    deltaYFrom(y) {
        return $gameMap.deltaY(this.y, y);
    }
    ;
    moveRandom() {
        const d = 2 + Math.randomInt(4) * 2;
        if (this.canPass(this.x, this.y, d)) {
            this.moveStraight(d);
        }
    }
    ;
    moveTowardCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 4 : 6);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
        }
        else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 4 : 6);
            }
        }
    }
    ;
    moveAwayFromCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 6 : 4);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 2 : 8);
            }
        }
        else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 6 : 4);
            }
        }
    }
    ;
    turnTowardCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 4 : 6);
        }
        else if (sy !== 0) {
            this.setDirection(sy > 0 ? 8 : 2);
        }
    }
    ;
    turnAwayFromCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 6 : 4);
        }
        else if (sy !== 0) {
            this.setDirection(sy > 0 ? 2 : 8);
        }
    }
    ;
    turnTowardPlayer() {
        this.turnTowardCharacter($gamePlayer);
    }
    ;
    turnAwayFromPlayer() {
        this.turnAwayFromCharacter($gamePlayer);
    }
    ;
    moveTowardPlayer() {
        this.moveTowardCharacter($gamePlayer);
    }
    ;
    moveAwayFromPlayer() {
        this.moveAwayFromCharacter($gamePlayer);
    }
    ;
    moveForward() {
        this.moveStraight(this.direction());
    }
    ;
    moveBackward() {
        const lastDirectionFix = this.isDirectionFixed();
        this.setDirectionFix(true);
        this.moveStraight(this.reverseDir(this.direction()));
        this.setDirectionFix(lastDirectionFix);
    }
    ;
    processRouteEnd() {
        if (this._moveRoute.repeat) {
            this._moveRouteIndex = -1;
        }
        else if (this._moveRouteForcing) {
            this._moveRouteForcing = false;
            this.restoreMoveRoute();
        }
    }
    ;
    advanceMoveRouteIndex() {
        const moveRoute = this._moveRoute;
        if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
            const numCommands = moveRoute.list.length - 1;
            this._moveRouteIndex++;
            if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
                this._moveRouteIndex = 0;
            }
        }
    }
    ;
    turnRight90() {
        switch (this.direction()) {
            case 2:
                this.setDirection(4);
                break;
            case 4:
                this.setDirection(8);
                break;
            case 6:
                this.setDirection(2);
                break;
            case 8:
                this.setDirection(6);
                break;
        }
    }
    ;
    turnLeft90() {
        switch (this.direction()) {
            case 2:
                this.setDirection(6);
                break;
            case 4:
                this.setDirection(2);
                break;
            case 6:
                this.setDirection(8);
                break;
            case 8:
                this.setDirection(4);
                break;
        }
    }
    ;
    turn180() {
        this.setDirection(this.reverseDir(this.direction()));
    }
    ;
    turnRightOrLeft90() {
        switch (Math.randomInt(2)) {
            case 0:
                this.turnRight90();
                break;
            case 1:
                this.turnLeft90();
                break;
        }
    }
    ;
    turnRandom() {
        this.setDirection(2 + Math.randomInt(4) * 2);
    }
    ;
    swap(character) {
        const newX = character.x;
        const newY = character.y;
        character.locate(this.x, this.y);
        this.locate(newX, newY);
    }
    ;
    findDirectionTo(goalX, goalY) {
        const searchLimit = this.searchLimit();
        const mapWidth = $gameMap.width();
        const nodeList = [];
        const openList = [];
        const closedList = [];
        if (this.x === goalX && this.y === goalY) {
            return 0;
        }
        const start = {
            parent: null,
            x: this.x,
            y: this.y,
            g: 0,
            f: $gameMap.distance(this.x, this.y, goalX, goalY)
        };
        let best = start;
        nodeList.push(start);
        openList.push(start['y'] * mapWidth + start['x']);
        while (nodeList.length > 0) {
            let bestIndex = 0;
            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].f < nodeList[bestIndex].f) {
                    bestIndex = i;
                }
            }
            const current = nodeList[bestIndex];
            const x1 = current.x;
            const y1 = current.y;
            const pos1 = y1 * mapWidth + x1;
            const g1 = current.g;
            nodeList.splice(bestIndex, 1);
            openList.splice(openList.indexOf(pos1), 1);
            closedList.push(pos1);
            if (current.x === goalX && current.y === goalY) {
                best = current;
                break;
            }
            if (g1 >= searchLimit) {
                continue;
            }
            for (let j = 0; j < 4; j++) {
                const direction = 2 + j * 2;
                const x2 = $gameMap.roundXWithDirection(x1, direction);
                const y2 = $gameMap.roundYWithDirection(y1, direction);
                const pos2 = y2 * mapWidth + x2;
                if (closedList.contains(pos2)) {
                    continue;
                }
                if (!this.canPass(x1, y1, direction)) {
                    continue;
                }
                const g2 = g1 + 1;
                const index2 = openList.indexOf(pos2);
                if (index2 < 0 || g2 < nodeList[index2].g) {
                    let neighbor;
                    if (index2 >= 0) {
                        neighbor = nodeList[index2];
                    }
                    else {
                        neighbor = {};
                        nodeList.push(neighbor);
                        openList.push(pos2);
                    }
                    neighbor.parent = current;
                    neighbor.x = x2;
                    neighbor.y = y2;
                    neighbor.g = g2;
                    neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                    if (!best || neighbor.f - neighbor.g < best['f'] - best['g']) {
                        best = neighbor;
                    }
                }
            }
        }
        let node = best;
        while (node['parent'] && node['parent'] !== start) {
            node = node['parent'];
        }
        const deltaX1 = $gameMap.deltaX(node['x'], start['x']);
        const deltaY1 = $gameMap.deltaY(node['y'], start['y']);
        if (deltaY1 > 0) {
            return 2;
        }
        else if (deltaX1 < 0) {
            return 4;
        }
        else if (deltaX1 > 0) {
            return 6;
        }
        else if (deltaY1 < 0) {
            return 8;
        }
        const deltaX2 = this.deltaXFrom(goalX);
        const deltaY2 = this.deltaYFrom(goalY);
        if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
            return deltaX2 > 0 ? 4 : 6;
        }
        else if (deltaY2 !== 0) {
            return deltaY2 > 0 ? 8 : 2;
        }
        return 0;
    }
    ;
    searchLimit() {
        return 12;
    }
    ;
}

class Game_Interpreter {
    constructor(depth = 0) {
        this._branch = {};
        this._params = [];
        this._indent = 0;
        this._frameCount = 0;
        this._freezeChecker = 0;
        this._depth = depth;
        this.checkOverflow();
        this.clear();
    }
    ;
    checkOverflow() {
        if (this._depth >= 100) {
            throw new Error('Common event calls exceeded the limit');
        }
    }
    ;
    clear() {
        this._mapId = 0;
        this._eventId = 0;
        this._list = null;
        this._index = 0;
        this._waitCount = 0;
        this._waitMode = '';
        this._comments = '';
        this._character = null;
        this._childInterpreter = null;
    }
    ;
    setup(list, eventId = 0) {
        this.clear();
        this._mapId = $gameMap.mapId();
        this._eventId = eventId;
        this._list = list;
        Game_Interpreter.requestImages(list);
    }
    ;
    eventId() {
        return this._eventId;
    }
    ;
    isOnCurrentMap() {
        return this._mapId === $gameMap.mapId();
    }
    ;
    setupReservedCommonEvent() {
        if ($gameTemp.isCommonEventReserved()) {
            this.setup($gameTemp.reservedCommonEvent().list);
            $gameTemp.clearCommonEvent();
            return true;
        }
        else {
            return false;
        }
    }
    ;
    isRunning() {
        return !!this._list;
    }
    ;
    update() {
        while (this.isRunning()) {
            if (this.updateChild() || this.updateWait()) {
                break;
            }
            if (SceneManager.isSceneChanging()) {
                break;
            }
            if (!this.executeCommand()) {
                break;
            }
            if (this.checkFreeze()) {
                break;
            }
        }
    }
    ;
    updateChild() {
        if (this._childInterpreter) {
            this._childInterpreter.update();
            if (this._childInterpreter.isRunning()) {
                return true;
            }
            else {
                this._childInterpreter = null;
            }
        }
        return false;
    }
    ;
    updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }
    ;
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }
    ;
    updateWaitMode() {
        let waiting = false;
        switch (this._waitMode) {
            case 'message':
                waiting = $gameMessage.isBusy();
                break;
            case 'transfer':
                waiting = $gamePlayer.isTransferring();
                break;
            case 'scroll':
                waiting = $gameMap.isScrolling();
                break;
            case 'route':
                waiting = this._character.isMoveRouteForcing();
                break;
            case 'animation':
                waiting = this._character.isAnimationPlaying();
                break;
            case 'balloon':
                waiting = this._character.isBalloonPlaying();
                break;
            case 'gather':
                waiting = $gamePlayer.areFollowersGathering();
                break;
            case 'action':
                waiting = BattleManager.isActionForced();
                break;
            case 'video':
                waiting = Graphics.isVideoPlaying();
                break;
            case 'image':
                waiting = !ImageManager.isReady();
                break;
        }
        if (!waiting) {
            this._waitMode = '';
        }
        return waiting;
    }
    ;
    setWaitMode(waitMode) {
        this._waitMode = waitMode;
    }
    ;
    wait(duration) {
        this._waitCount = duration;
    }
    ;
    fadeSpeed() {
        return 24;
    }
    ;
    executeCommand() {
        const command = this.currentCommand();
        if (command) {
            this._params = command.parameters;
            this._indent = command.indent;
            const methodName = 'command' + command.code;
            if (typeof this[methodName] === 'function') {
                if (!this[methodName]()) {
                    return false;
                }
            }
            this._index++;
        }
        else {
            this.terminate();
        }
        return true;
    }
    ;
    checkFreeze() {
        if (this._frameCount !== Graphics.frameCount) {
            this._frameCount = Graphics.frameCount;
            this._freezeChecker = 0;
        }
        if (this._freezeChecker++ >= 100000) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    terminate() {
        this._list = null;
        this._comments = '';
    }
    ;
    skipBranch() {
        while (this._list[this._index + 1].indent > this._indent) {
            this._index++;
        }
    }
    ;
    currentCommand() {
        return this._list[this._index];
    }
    ;
    nextEventCode() {
        const command = this._list[this._index + 1];
        if (command) {
            return command.code;
        }
        else {
            return 0;
        }
    }
    ;
    iterateActorId(param, callback) {
        if (param === 0) {
            $gameParty.members().forEach(callback);
        }
        else {
            const actor = $gameActors.actor(param);
            if (actor) {
                callback(actor);
            }
        }
    }
    ;
    iterateActorEx(param1, param2, callback) {
        if (param1 === 0) {
            this.iterateActorId(param2, callback);
        }
        else {
            this.iterateActorId($gameVariables.value(param2), callback);
        }
    }
    ;
    iterateActorIndex(param, callback) {
        if (param < 0) {
            $gameParty.members().forEach(callback);
        }
        else {
            const actor = $gameParty.members()[param];
            if (actor) {
                callback(actor);
            }
        }
    }
    ;
    iterateEnemyIndex(param, callback) {
        if (param < 0) {
            $gameTroop.members().forEach(callback);
        }
        else {
            const enemy = $gameTroop.members()[param];
            if (enemy) {
                callback(enemy);
            }
        }
    }
    ;
    iterateBattler(param1, param2, callback) {
        if ($gameParty.inBattle()) {
            if (param1 === 0) {
                this.iterateEnemyIndex(param2, callback);
            }
            else {
                this.iterateActorId(param2, callback);
            }
        }
    }
    ;
    character(param) {
        if ($gameParty.inBattle()) {
            return null;
        }
        else if (param < 0) {
            return $gamePlayer;
        }
        else if (this.isOnCurrentMap()) {
            return $gameMap.event(param > 0 ? param : this._eventId);
        }
        else {
            return null;
        }
    }
    ;
    operateValue(operation, operandType, operand) {
        const value = operandType === 0 ? operand : $gameVariables.value(operand);
        return operation === 0 ? value : -value;
    }
    ;
    changeHp(target, value, allowDeath) {
        if (target.isAlive()) {
            if (!allowDeath && target.hp <= -value) {
                value = 1 - target.hp;
            }
            target.gainHp(value);
            if (target.isDead()) {
                target.performCollapse();
            }
        }
    }
    ;
    // Show Text
    command101() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setFaceImage(this._params[0], this._params[1]);
            $gameMessage.setBackground(this._params[2]);
            $gameMessage.setPositionType(this._params[3]);
            while (this.nextEventCode() === 401) {
                this._index++;
                $gameMessage.add(this.currentCommand().parameters[0]);
            }
            switch (this.nextEventCode()) {
                case 102:// Show Choices
                    this._index++;
                    this.setupChoices(this.currentCommand().parameters);
                    break;
                case 103:// Input Number
                    this._index++;
                    this.setupNumInput(this.currentCommand().parameters);
                    break;
                case 104:// Select Item
                    this._index++;
                    this.setupItemChoice(this.currentCommand().parameters);
                    break;
            }
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
    ;
    // Show Choices
    command102() {
        if (!$gameMessage.isBusy()) {
            this.setupChoices(this._params);
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
    ;
    setupChoices(params) {
        const choices = params[0].clone();
        let cancelType = params[1];
        const defaultType = params.length > 2 ? params[2] : 0;
        const positionType = params.length > 3 ? params[3] : 2;
        const background = params.length > 4 ? params[4] : 0;
        if (cancelType >= choices.length) {
            cancelType = -2;
        }
        $gameMessage.setChoices(choices, defaultType, cancelType);
        $gameMessage.setChoiceBackground(background);
        $gameMessage.setChoicePositionType(positionType);
        $gameMessage.setChoiceCallback(function (n) {
            this._branch[this._indent] = n;
        }.bind(this));
    }
    ;
    // When [**]
    command402() {
        if (this._branch[this._indent] !== this._params[0]) {
            this.skipBranch();
        }
        return true;
    }
    ;
    // When Cancel
    command403() {
        if (this._branch[this._indent] >= 0) {
            this.skipBranch();
        }
        return true;
    }
    ;
    // Input Number
    command103() {
        if (!$gameMessage.isBusy()) {
            this.setupNumInput(this._params);
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
    ;
    setupNumInput(params) {
        $gameMessage.setNumberInput(params[0], params[1]);
    }
    ;
    // Select Item
    command104() {
        if (!$gameMessage.isBusy()) {
            this.setupItemChoice(this._params);
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
    ;
    setupItemChoice(params) {
        $gameMessage.setItemChoice(params[0], params[1] || 2);
    }
    ;
    // Show Scrolling Text
    command105() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setScroll(this._params[0], this._params[1]);
            while (this.nextEventCode() === 405) {
                this._index++;
                $gameMessage.add(this.currentCommand().parameters[0]);
            }
            this._index++;
            this.setWaitMode('message');
        }
        return false;
    }
    ;
    // Comment
    command108() {
        this._comments = [this._params[0]];
        while (this.nextEventCode() === 408) {
            this._index++;
            this._comments.push(this.currentCommand().parameters[0]);
        }
        return true;
    }
    ;
    // Conditional Branch
    command111() {
        let result = false;
        switch (this._params[0]) {
            case 0:// Switch
                result = ($gameSwitches.value(this._params[1]) === (this._params[2] === 0));
                break;
            case 1:// Variable
                const value1 = $gameVariables.value(this._params[1]);
                let value2;
                if (this._params[2] === 0) {
                    value2 = this._params[3];
                }
                else {
                    value2 = $gameVariables.value(this._params[3]);
                }
                switch (this._params[4]) {
                    case 0:// Equal to
                        result = (value1 === value2);
                        break;
                    case 1:// Greater than or Equal to
                        result = (value1 >= value2);
                        break;
                    case 2:// Less than or Equal to
                        result = (value1 <= value2);
                        break;
                    case 3:// Greater than
                        result = (value1 > value2);
                        break;
                    case 4:// Less than
                        result = (value1 < value2);
                        break;
                    case 5:// Not Equal to
                        result = (value1 !== value2);
                        break;
                }
                break;
            case 2:// Self Switch
                if (this._eventId > 0) {
                    const key = [this._mapId, this._eventId, this._params[1]];
                    result = ($gameSelfSwitches.value(key) === (this._params[2] === 0));
                }
                break;
            case 3:// Timer
                if ($gameTimer.isWorking()) {
                    if (this._params[2] === 0) {
                        result = ($gameTimer.seconds() >= this._params[1]);
                    }
                    else {
                        result = ($gameTimer.seconds() <= this._params[1]);
                    }
                }
                break;
            case 4:// Actor
                const actor = $gameActors.actor(this._params[1]);
                if (actor) {
                    const n = this._params[3];
                    switch (this._params[2]) {
                        case 0:// In the Party
                            result = $gameParty.members().contains(actor);
                            break;
                        case 1:// Name
                            result = (actor.name() === n);
                            break;
                        case 2:// Class
                            result = actor.isClass($dataClasses[n]);
                            break;
                        case 3:// Skill
                            result = actor.hasSkill(n);
                            break;
                        case 4:// Weapon
                            result = actor.hasWeapon($dataWeapons[n]);
                            break;
                        case 5:// Armor
                            result = actor.hasArmor($dataArmors[n]);
                            break;
                        case 6:// State
                            result = actor.isStateAffected(n);
                            break;
                    }
                }
                break;
            case 5:// Enemy
                const enemy = $gameTroop.members()[this._params[1]];
                if (enemy) {
                    switch (this._params[2]) {
                        case 0:// Appeared
                            result = enemy.isAlive();
                            break;
                        case 1:// State
                            result = enemy.isStateAffected(this._params[3]);
                            break;
                    }
                }
                break;
            case 6:// Character
                const character = this.character(this._params[1]);
                if (character) {
                    result = (character.direction() === this._params[2]);
                }
                break;
            case 7:// Gold
                switch (this._params[2]) {
                    case 0:// Greater than or equal to
                        result = ($gameParty.gold() >= this._params[1]);
                        break;
                    case 1:// Less than or equal to
                        result = ($gameParty.gold() <= this._params[1]);
                        break;
                    case 2:// Less than
                        result = ($gameParty.gold() < this._params[1]);
                        break;
                }
                break;
            case 8:// Item
                result = $gameParty.hasItem($dataItems[this._params[1]]);
                break;
            case 9:// Weapon
                result = $gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
                break;
            case 10:// Armor
                result = $gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
                break;
            case 11:// Button
                result = Input.isPressed(this._params[1]);
                break;
            case 12:// Script
                result = !!eval(this._params[1]);
                break;
            case 13:// Vehicle
                result = ($gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]));
                break;
        }
        this._branch[this._indent] = result;
        if (this._branch[this._indent] === false) {
            this.skipBranch();
        }
        return true;
    }
    ;
    // Else
    command411() {
        if (this._branch[this._indent] !== false) {
            this.skipBranch();
        }
        return true;
    }
    ;
    // Loop
    command112() {
        return true;
    }
    ;
    // Repeat Above
    command413() {
        do {
            this._index--;
        } while (this.currentCommand().indent !== this._indent);
        return true;
    }
    ;
    // Break Loop
    command113() {
        while (this._index < this._list.length - 1) {
            this._index++;
            const command = this.currentCommand();
            if (command.code === 413 && command.indent < this._indent) {
                break;
            }
        }
        return true;
    }
    ;
    // Exit Event Processing
    command115() {
        this._index = this._list.length;
        return true;
    }
    ;
    // Common Event
    command117() {
        const commonEvent = $dataCommonEvents[this._params[0]];
        if (commonEvent) {
            const eventId = this.isOnCurrentMap() ? this._eventId : 0;
            this.setupChild(commonEvent.list, eventId);
        }
        return true;
    }
    ;
    setupChild(list, eventId) {
        this._childInterpreter = new Game_Interpreter(this._depth + 1);
        this._childInterpreter.setup(list, eventId);
    }
    ;
    // Label
    command118() {
        return true;
    }
    ;
    // Jump to Label
    command119() {
        const labelName = this._params[0];
        for (let i = 0; i < this._list.length; i++) {
            const command = this._list[i];
            if (command.code === 118 && command.parameters[0] === labelName) {
                this.jumpTo(i);
                return;
            }
        }
        return true;
    }
    ;
    jumpTo(index) {
        const lastIndex = this._index;
        const startIndex = Math.min(index, lastIndex);
        const endIndex = Math.max(index, lastIndex);
        let indent = this._indent;
        for (let i = startIndex; i <= endIndex; i++) {
            const newIndent = this._list[i].indent;
            if (newIndent !== indent) {
                this._branch[indent] = null;
                indent = newIndent;
            }
        }
        this._index = index;
    }
    ;
    // Control Switches
    command121() {
        for (let i = this._params[0]; i <= this._params[1]; i++) {
            $gameSwitches.setValue(i, this._params[2] === 0);
        }
        return true;
    }
    ;
    // Control Variables
    command122() {
        let value = 0;
        switch (this._params[3]) {
            case 0:// Constant
                value = this._params[4];
                break;
            case 1:// Variable
                value = $gameVariables.value(this._params[4]);
                break;
            case 2:// Random
                value = this._params[4] + Math.randomInt(this._params[5] - this._params[4] + 1);
                break;
            case 3:// Game Data
                value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
                break;
            case 4:// Script
                value = eval(this._params[4]);
                break;
        }
        for (let i = this._params[0]; i <= this._params[1]; i++) {
            this.operateVariable(i, this._params[2], value);
        }
        return true;
    }
    ;
    gameDataOperand(type, param1, param2) {
        switch (type) {
            case 0:// Item
                return $gameParty.numItems($dataItems[param1]);
            case 1:// Weapon
                return $gameParty.numItems($dataWeapons[param1]);
            case 2:// Armor
                return $gameParty.numItems($dataArmors[param1]);
            case 3:// Actor
                const actor = $gameActors.actor(param1);
                if (actor) {
                    switch (param2) {
                        case 0:// Level
                            return actor.level;
                        case 1:// EXP
                            return actor.currentExp();
                        case 2:// HP
                            return actor.hp;
                        case 3:// MP
                            return actor.mp;
                        default:// Parameter
                            if (param2 >= 4 && param2 <= 11) {
                                return actor.param(param2 - 4);
                            }
                    }
                }
                break;
            case 4:// Enemy
                const enemy = $gameTroop.members()[param1];
                if (enemy) {
                    switch (param2) {
                        case 0:// HP
                            return enemy.hp;
                        case 1:// MP
                            return enemy.mp;
                        default:// Parameter
                            if (param2 >= 2 && param2 <= 9) {
                                return enemy.param(param2 - 2);
                            }
                    }
                }
                break;
            case 5:// Character
                const character = this.character(param1);
                if (character) {
                    switch (param2) {
                        case 0:// Map X
                            return character.x;
                        case 1:// Map Y
                            return character.y;
                        case 2:// Direction
                            return character.direction();
                        case 3:// Screen X
                            return character.screenX();
                        case 4:// Screen Y
                            return character.screenY();
                    }
                }
                break;
            case 6: {
                const actor = $gameParty.members()[param1];
                return actor ? actor.actorId() : 0;
            }
            case 7:// Other
                switch (param1) {
                    case 0:// Map ID
                        return $gameMap.mapId();
                    case 1:// Party Members
                        return $gameParty.size();
                    case 2:// Gold
                        return $gameParty.gold();
                    case 3:// Steps
                        return $gameParty.steps();
                    case 4:// Play Time
                        return $gameSystem.playtime();
                    case 5:// Timer
                        return $gameTimer.seconds();
                    case 6:// Save Count
                        return $gameSystem.saveCount();
                    case 7:// Battle Count
                        return $gameSystem.battleCount();
                    case 8:// Win Count
                        return $gameSystem.winCount();
                    case 9:// Escape Count
                        return $gameSystem.escapeCount();
                }
                break;
        }
        return 0;
    }
    ;
    operateVariable(variableId, operationType, value) {
        try {
            let oldValue = $gameVariables.value(variableId);
            switch (operationType) {
                case 0:// Set
                    $gameVariables.setValue(variableId, oldValue = value);
                    break;
                case 1:// Add
                    $gameVariables.setValue(variableId, oldValue + value);
                    break;
                case 2:// Sub
                    $gameVariables.setValue(variableId, oldValue - value);
                    break;
                case 3:// Mul
                    $gameVariables.setValue(variableId, oldValue * value);
                    break;
                case 4:// Div
                    $gameVariables.setValue(variableId, oldValue / value);
                    break;
                case 5:// Mod
                    $gameVariables.setValue(variableId, oldValue % value);
                    break;
            }
        }
        catch (e) {
            $gameVariables.setValue(variableId, 0);
        }
    }
    ;
    // Control Self Switch
    command123() {
        if (this._eventId > 0) {
            const key = [this._mapId, this._eventId, this._params[0]];
            $gameSelfSwitches.setValue(key, this._params[1] === 0);
        }
        return true;
    }
    ;
    // Control Timer
    command124() {
        if (this._params[0] === 0) {
            $gameTimer.start(this._params[1] * 60);
        }
        else {
            $gameTimer.stop();
        }
        return true;
    }
    ;
    // Change Gold
    command125() {
        const value = this.operateValue(this._params[0], this._params[1], this._params[2]);
        $gameParty.gainGold(value);
        return true;
    }
    ;
    // Change Items
    command126() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        $gameParty.gainItem($dataItems[this._params[0]], value);
        return true;
    }
    ;
    // Change Weapons
    command127() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);
        return true;
    }
    ;
    // Change Armors
    command128() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);
        return true;
    }
    ;
    // Change Party Member
    command129() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            if (this._params[1] === 0) {
                if (this._params[2]) {
                    $gameActors.actor(this._params[0]).setup(this._params[0]);
                }
                $gameParty.addActor(this._params[0]);
            }
            else {
                $gameParty.removeActor(this._params[0]);
            }
        }
        return true;
    }
    ;
    // Change Battle BGM
    command132() {
        $gameSystem.setBattleBgm(this._params[0]);
        return true;
    }
    ;
    // Change Victory ME
    command133() {
        $gameSystem.setVictoryMe(this._params[0]);
        return true;
    }
    ;
    // Change Save Access
    command134() {
        if (this._params[0] === 0) {
            $gameSystem.disableSave();
        }
        else {
            $gameSystem.enableSave();
        }
        return true;
    }
    ;
    // Change Menu Access
    command135() {
        if (this._params[0] === 0) {
            $gameSystem.disableMenu();
        }
        else {
            $gameSystem.enableMenu();
        }
        return true;
    }
    ;
    // Change Encounter Disable
    command136() {
        if (this._params[0] === 0) {
            $gameSystem.disableEncounter();
        }
        else {
            $gameSystem.enableEncounter();
        }
        $gamePlayer.makeEncounterCount();
        return true;
    }
    ;
    // Change Formation Access
    command137() {
        if (this._params[0] === 0) {
            $gameSystem.disableFormation();
        }
        else {
            $gameSystem.enableFormation();
        }
        return true;
    }
    ;
    // Change Window Color
    command138() {
        $gameSystem.setWindowTone(this._params[0]);
        return true;
    }
    ;
    // Change Defeat ME
    command139() {
        $gameSystem.setDefeatMe(this._params[0]);
        return true;
    }
    ;
    // Change Vehicle BGM
    command140() {
        const vehicle = $gameMap.vehicle(this._params[0]);
        if (vehicle) {
            vehicle.setBgm(this._params[1]);
        }
        return true;
    }
    ;
    // Transfer Player
    command201() {
        if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
            let mapId, x, y;
            if (this._params[0] === 0) {
                mapId = this._params[1];
                x = this._params[2];
                y = this._params[3];
            }
            else {
                mapId = $gameVariables.value(this._params[1]);
                x = $gameVariables.value(this._params[2]);
                y = $gameVariables.value(this._params[3]);
            }
            $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
            this.setWaitMode('transfer');
            this._index++;
        }
        return false;
    }
    ;
    // Set Vehicle Location
    command202() {
        let mapId, x, y;
        if (this._params[1] === 0) {
            mapId = this._params[2];
            x = this._params[3];
            y = this._params[4];
        }
        else {
            mapId = $gameVariables.value(this._params[2]);
            x = $gameVariables.value(this._params[3]);
            y = $gameVariables.value(this._params[4]);
        }
        const vehicle = $gameMap.vehicle(this._params[0]);
        if (vehicle) {
            vehicle.setLocation(mapId, x, y);
        }
        return true;
    }
    ;
    // Set Event Location
    command203() {
        const character = this.character(this._params[0]);
        if (character) {
            if (this._params[1] === 0) {
                character.locate(this._params[2], this._params[3]);
            }
            else if (this._params[1] === 1) {
                const x = $gameVariables.value(this._params[2]);
                const y = $gameVariables.value(this._params[3]);
                character.locate(x, y);
            }
            else {
                const character2 = this.character(this._params[2]);
                if (character2) {
                    character.swap(character2);
                }
            }
            if (this._params[4] > 0) {
                character.setDirection(this._params[4]);
            }
        }
        return true;
    }
    ;
    // Scroll Map
    command204() {
        if (!$gameParty.inBattle()) {
            if ($gameMap.isScrolling()) {
                this.setWaitMode('scroll');
                return false;
            }
            $gameMap.startScroll(this._params[0], this._params[1], this._params[2]);
        }
        return true;
    }
    ;
    // Set Movement Route
    command205() {
        $gameMap.refreshIfNeeded();
        this._character = this.character(this._params[0]);
        if (this._character) {
            this._character.forceMoveRoute(this._params[1]);
            if (this._params[1].wait) {
                this.setWaitMode('route');
            }
        }
        return true;
    }
    ;
    // Getting On and Off Vehicles
    command206() {
        $gamePlayer.getOnOffVehicle();
        return true;
    }
    ;
    // Change Transparency
    command211() {
        $gamePlayer.setTransparent(this._params[0] === 0);
        return true;
    }
    ;
    // Show Animation
    command212() {
        this._character = this.character(this._params[0]);
        if (this._character) {
            this._character.requestAnimation(this._params[1]);
            if (this._params[2]) {
                this.setWaitMode('animation');
            }
        }
        return true;
    }
    ;
    // Show Balloon Icon
    command213() {
        this._character = this.character(this._params[0]);
        if (this._character) {
            this._character.requestBalloon(this._params[1]);
            if (this._params[2]) {
                this.setWaitMode('balloon');
            }
        }
        return true;
    }
    ;
    // Erase Event
    command214() {
        if (this.isOnCurrentMap() && this._eventId > 0) {
            $gameMap.eraseEvent(this._eventId);
        }
        return true;
    }
    ;
    // Change Player Followers
    command216() {
        if (this._params[0] === 0) {
            $gamePlayer.showFollowers();
        }
        else {
            $gamePlayer.hideFollowers();
        }
        $gamePlayer.refresh();
        return true;
    }
    ;
    // Gather Followers
    command217() {
        if (!$gameParty.inBattle()) {
            $gamePlayer.gatherFollowers();
            this.setWaitMode('gather');
        }
        return true;
    }
    ;
    // Fadeout Screen
    command221() {
        if (!$gameMessage.isBusy()) {
            $gameScreen.startFadeOut(this.fadeSpeed());
            this.wait(this.fadeSpeed());
            this._index++;
        }
        return false;
    }
    ;
    // Fadein Screen
    command222() {
        if (!$gameMessage.isBusy()) {
            $gameScreen.startFadeIn(this.fadeSpeed());
            this.wait(this.fadeSpeed());
            this._index++;
        }
        return false;
    }
    ;
    // Tint Screen
    command223() {
        $gameScreen.startTint(this._params[0], this._params[1]);
        if (this._params[2]) {
            this.wait(this._params[1]);
        }
        return true;
    }
    ;
    // Flash Screen
    command224() {
        $gameScreen.startFlash(this._params[0], this._params[1]);
        if (this._params[2]) {
            this.wait(this._params[1]);
        }
        return true;
    }
    ;
    // Shake Screen
    command225() {
        $gameScreen.startShake(this._params[0], this._params[1], this._params[2]);
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
        return true;
    }
    ;
    // Wait
    command230() {
        this.wait(this._params[0]);
        return true;
    }
    ;
    // Show Picture
    command231() {
        let x, y;
        if (this._params[3] === 0) {
            x = this._params[4];
            y = this._params[5];
        }
        else {
            x = $gameVariables.value(this._params[4]);
            y = $gameVariables.value(this._params[5]);
        }
        $gameScreen.showPicture(this._params[0], this._params[1], this._params[2], x, y, this._params[6], this._params[7], this._params[8], this._params[9]);
        return true;
    }
    ;
    // Move Picture
    command232() {
        let x, y;
        if (this._params[3] === 0) {
            x = this._params[4];
            y = this._params[5];
        }
        else {
            x = $gameVariables.value(this._params[4]);
            y = $gameVariables.value(this._params[5]);
        }
        $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6], this._params[7], this._params[8], this._params[9], this._params[10]);
        if (this._params[11]) {
            this.wait(this._params[10]);
        }
        return true;
    }
    ;
    // Rotate Picture
    command233() {
        $gameScreen.rotatePicture(this._params[0], this._params[1]);
        return true;
    }
    ;
    // Tint Picture
    command234() {
        $gameScreen.tintPicture(this._params[0], this._params[1], this._params[2]);
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
        return true;
    }
    ;
    // Erase Picture
    command235() {
        $gameScreen.erasePicture(this._params[0]);
        return true;
    }
    ;
    // Set Weather Effect
    command236() {
        if (!$gameParty.inBattle()) {
            $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
            if (this._params[3]) {
                this.wait(this._params[2]);
            }
        }
        return true;
    }
    ;
    // Play BGM
    command241() {
        AudioManager.playBgm(this._params[0]);
        return true;
    }
    ;
    // Fadeout BGM
    command242() {
        AudioManager.fadeOutBgm(this._params[0]);
        return true;
    }
    ;
    // Save BGM
    command243() {
        $gameSystem.saveBgm();
        return true;
    }
    ;
    // Resume BGM
    command244() {
        $gameSystem.replayBgm();
        return true;
    }
    ;
    // Play BGS
    command245() {
        AudioManager.playBgs(this._params[0]);
        return true;
    }
    ;
    // Fadeout BGS
    command246() {
        AudioManager.fadeOutBgs(this._params[0]);
        return true;
    }
    ;
    // Play ME
    command249() {
        AudioManager.playMe(this._params[0]);
        return true;
    }
    ;
    // Play SE
    command250() {
        AudioManager.playSe(this._params[0]);
        return true;
    }
    ;
    // Stop SE
    command251() {
        AudioManager.stopSe();
        return true;
    }
    ;
    // Play Movie
    command261() {
        if (!$gameMessage.isBusy()) {
            const name = this._params[0];
            if (name.length > 0) {
                const ext = this.videoFileExt();
                Graphics.playVideo('movies/' + name + ext);
                this.setWaitMode('video');
            }
            this._index++;
        }
        return false;
    }
    ;
    videoFileExt() {
        if (Graphics.canPlayVideoType('video/webm')) {
            return '.webm';
        }
        else {
            return '.mp4';
        }
    }
    ;
    // Change Map Name Display
    command281() {
        if (this._params[0] === 0) {
            $gameMap.enableNameDisplay();
        }
        else {
            $gameMap.disableNameDisplay();
        }
        return true;
    }
    ;
    // Change Tileset
    command282() {
        const tileset = $dataTilesets[this._params[0]];
        if (!this._imageReservationId) {
            this._imageReservationId = Utils.generateRuntimeId();
        }
        const allReady = tileset.tilesetNames.map(function (tilesetName) {
            return ImageManager.reserveTileset(tilesetName, 0, this._imageReservationId);
        }, this).every(function (bitmap) { return bitmap.isReady(); });
        if (allReady) {
            $gameMap.changeTileset(this._params[0]);
            ImageManager.releaseReservation(this._imageReservationId);
            this._imageReservationId = null;
            return true;
        }
        else {
            return false;
        }
    }
    ;
    // Change Battle Back
    command283() {
        $gameMap.changeBattleback(this._params[0], this._params[1]);
        return true;
    }
    ;
    // Change Parallax
    command284() {
        $gameMap.changeParallax(this._params[0], this._params[1], this._params[2], this._params[3], this._params[4]);
        return true;
    }
    ;
    // Get Location Info
    command285() {
        let x, y, value;
        if (this._params[2] === 0) {
            x = this._params[3];
            y = this._params[4];
        }
        else {
            x = $gameVariables.value(this._params[3]);
            y = $gameVariables.value(this._params[4]);
        }
        switch (this._params[1]) {
            case 0:// Terrain Tag
                value = $gameMap.terrainTag(x, y);
                break;
            case 1:// Event ID
                value = $gameMap.eventIdXy(x, y);
                break;
            case 2: // Tile ID (Layer 1)
            case 3: // Tile ID (Layer 2)
            case 4: // Tile ID (Layer 3)
            case 5:// Tile ID (Layer 4)
                value = $gameMap.tileId(x, y, this._params[1] - 2);
                break;
            default:// Region ID
                value = $gameMap.regionId(x, y);
                break;
        }
        $gameVariables.setValue(this._params[0], value);
        return true;
    }
    ;
    // Battle Processing
    command301() {
        if (!$gameParty.inBattle()) {
            let troopId;
            if (this._params[0] === 0) {
                troopId = this._params[1];
            }
            else if (this._params[0] === 1) {
                troopId = $gameVariables.value(this._params[1]);
            }
            else {
                troopId = $gamePlayer.makeEncounterTroopId();
            }
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, this._params[2], this._params[3]);
                BattleManager.setEventCallback(function (n) {
                    this._branch[this._indent] = n;
                }.bind(this));
                $gamePlayer.makeEncounterCount();
                SceneManager.push(Scene_Base);
            }
        }
        return true;
    }
    ;
    // If Win
    command601() {
        if (this._branch[this._indent] !== 0) {
            this.skipBranch();
        }
        return true;
    }
    ;
    // If Escape
    command602() {
        if (this._branch[this._indent] !== 1) {
            this.skipBranch();
        }
        return true;
    }
    ;
    // If Lose
    command603() {
        if (this._branch[this._indent] !== 2) {
            this.skipBranch();
        }
        return true;
    }
    ;
    // Shop Processing
    command302() {
        if (!$gameParty.inBattle()) {
            const goods = [this._params];
            while (this.nextEventCode() === 605) {
                this._index++;
                goods.push(this.currentCommand().parameters);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(goods, this._params[4]);
        }
        return true;
    }
    ;
    // Name Input Processing
    command303() {
        if (!$gameParty.inBattle()) {
            if ($dataActors[this._params[0]]) {
                SceneManager.push(Scene_Name);
                SceneManager.prepareNextScene(this._params[0], this._params[1]);
            }
        }
        return true;
    }
    ;
    // Change HP
    command311() {
        const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            this.changeHp(actor, value, this._params[5]);
        }.bind(this));
        return true;
    }
    ;
    // Change MP
    command312() {
        const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            actor.gainMp(value);
        }.bind(this));
        return true;
    }
    ;
    // Change TP
    command326() {
        const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            actor.gainTp(value);
        }.bind(this));
        return true;
    }
    ;
    // Change State
    command313() {
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            const alreadyDead = actor.isDead();
            if (this._params[2] === 0) {
                actor.addState(this._params[3]);
            }
            else {
                actor.removeState(this._params[3]);
            }
            if (actor.isDead() && !alreadyDead) {
                actor.performCollapse();
            }
            actor.clearResult();
        }.bind(this));
        return true;
    }
    ;
    // Recover All
    command314() {
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            actor.recoverAll();
        }.bind(this));
        return true;
    }
    ;
    // Change EXP
    command315() {
        const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            actor.changeExp(actor.currentExp() + value, this._params[5]);
        }.bind(this));
        return true;
    }
    ;
    // Change Level
    command316() {
        const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            actor.changeLevel(actor.level + value, this._params[5]);
        }.bind(this));
        return true;
    }
    ;
    // Change Parameter
    command317() {
        const value = this.operateValue(this._params[3], this._params[4], this._params[5]);
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            actor.addParam(this._params[2], value);
        }.bind(this));
        return true;
    }
    ;
    // Change Skill
    command318() {
        this.iterateActorEx(this._params[0], this._params[1], function (actor) {
            if (this._params[2] === 0) {
                actor.learnSkill(this._params[3]);
            }
            else {
                actor.forgetSkill(this._params[3]);
            }
        }.bind(this));
        return true;
    }
    ;
    // Change Equipment
    command319() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.changeEquipById(this._params[1], this._params[2]);
        }
        return true;
    }
    ;
    // Change Name
    command320() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setName(this._params[1]);
        }
        return true;
    }
    ;
    // Change Class
    command321() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor && $dataClasses[this._params[1]]) {
            actor.changeClass(this._params[1], this._params[2]);
        }
        return true;
    }
    ;
    // Change Actor Images
    command322() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setCharacterImage(this._params[1], this._params[2]);
            actor.setFaceImage(this._params[3], this._params[4]);
            actor.setBattlerImage(this._params[5]);
        }
        $gamePlayer.refresh();
        return true;
    }
    ;
    // Change Vehicle Image
    command323() {
        const vehicle = $gameMap.vehicle(this._params[0]);
        if (vehicle) {
            vehicle.setImage(this._params[1], this._params[2]);
        }
        return true;
    }
    ;
    // Change Nickname
    command324() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setNickname(this._params[1]);
        }
        return true;
    }
    ;
    // Change Profile
    command325() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setProfile(this._params[1]);
        }
        return true;
    }
    ;
    // Change Enemy HP
    command331() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            this.changeHp(enemy, value, this._params[4]);
        }.bind(this));
        return true;
    }
    ;
    // Change Enemy MP
    command332() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            enemy.gainMp(value);
        }.bind(this));
        return true;
    }
    ;
    // Change Enemy TP
    command342() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            enemy.gainTp(value);
        }.bind(this));
        return true;
    }
    ;
    // Change Enemy State
    command333() {
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            const alreadyDead = enemy.isDead();
            if (this._params[1] === 0) {
                enemy.addState(this._params[2]);
            }
            else {
                enemy.removeState(this._params[2]);
            }
            if (enemy.isDead() && !alreadyDead) {
                enemy.performCollapse();
            }
            enemy.clearResult();
        }.bind(this));
        return true;
    }
    ;
    // Enemy Recover All
    command334() {
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            enemy.recoverAll();
        }.bind(this));
        return true;
    }
    ;
    // Enemy Appear
    command335() {
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            enemy.appear();
            $gameTroop.makeUniqueNames();
        }.bind(this));
        return true;
    }
    ;
    // Enemy Transform
    command336() {
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            enemy.transform(this._params[1]);
            $gameTroop.makeUniqueNames();
        }.bind(this));
        return true;
    }
    ;
    // Show Battle Animation
    command337() {
        if (this._params[2] == true) {
            this.iterateEnemyIndex(-1, function (enemy) {
                if (enemy.isAlive()) {
                    enemy.startAnimation(this._params[1], false, 0);
                }
            }.bind(this));
        }
        else {
            this.iterateEnemyIndex(this._params[0], function (enemy) {
                if (enemy.isAlive()) {
                    enemy.startAnimation(this._params[1], false, 0);
                }
            }.bind(this));
        }
        return true;
    }
    ;
    // Force Action
    command339() {
        this.iterateBattler(this._params[0], this._params[1], function (battler) {
            if (!battler.isDeathStateAffected()) {
                battler.forceAction(this._params[2], this._params[3]);
                BattleManager.forceAction(battler);
                this.setWaitMode('action');
            }
        }.bind(this));
        return true;
    }
    ;
    // Abort Battle
    command340() {
        BattleManager.abort();
        return true;
    }
    ;
    // Open Menu Screen
    command351() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Menu);
            Window_MenuCommand.initCommandPosition();
        }
        return true;
    }
    ;
    // Open Save Screen
    command352() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Save);
        }
        return true;
    }
    ;
    // Game Over
    command353() {
        SceneManager.goto(Scene_Gameover);
        return true;
    }
    ;
    // Return to Title Screen
    command354() {
        SceneManager.goto(Scene_Title);
        return true;
    }
    ;
    // Script
    command355() {
        let script = this.currentCommand().parameters[0] + '\n';
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand().parameters[0] + '\n';
        }
        eval(script);
        return true;
    }
    ;
    // Plugin Command
    command356() {
        const args = this._params[0].split(" ");
        const command = args.shift();
        this.pluginCommand(command, args);
        return true;
    }
    ;
    pluginCommand(command, args) {
        // to be overridden by plugins
    }
    ;
    static requestImages(list, commonList) {
        if (!list)
            return;
        list.forEach(function (command) {
            const params = command.parameters;
            switch (command.code) {
                // Show Text
                case 101:
                    ImageManager.requestFace(params[0]);
                    break;
                // Common Event
                case 117:
                    const commonEvent = $dataCommonEvents[params[0]];
                    if (commonEvent) {
                        if (!commonList) {
                            commonList = [];
                        }
                        if (!commonList.contains(params[0])) {
                            commonList.push(params[0]);
                            Game_Interpreter.requestImages(commonEvent.list, commonList);
                        }
                    }
                    break;
                // Change Party Member
                case 129:
                    const actor = $gameActors.actor(params[0]);
                    if (actor && params[1] === 0) {
                        const name = actor.characterName();
                        ImageManager.requestCharacter(name);
                    }
                    break;
                // Set Movement Route
                case 205:
                    if (params[1]) {
                        params[1].list.forEach(function (command) {
                            const params = command.parameters;
                            if (command.code === Route.CHANGE_IMAGE) {
                                ImageManager.requestCharacter(params[0]);
                            }
                        });
                    }
                    break;
                // Show Animation, Show Battle Animation
                case 212:
                case 337:
                    if (params[1]) {
                        const animation = $dataAnimations[params[1]];
                        const name1 = animation.animation1Name;
                        const name2 = animation.animation2Name;
                        const hue1 = animation.animation1Hue;
                        const hue2 = animation.animation2Hue;
                        ImageManager.requestAnimation(name1, hue1);
                        ImageManager.requestAnimation(name2, hue2);
                    }
                    break;
                // Change Player Followers
                case 216:
                    if (params[0] === 0) {
                        $gamePlayer.followers().forEach(function (follower) {
                            const name = follower.characterName();
                            ImageManager.requestCharacter(name);
                        });
                    }
                    break;
                // Show Picture
                case 231:
                    ImageManager.requestPicture(params[1]);
                    break;
                // Change Tileset
                case 282:
                    const tileset = $dataTilesets[params[0]];
                    tileset.tilesetNames.forEach(function (tilesetName) {
                        ImageManager.requestTileset(tilesetName);
                    });
                    break;
                // Change Battle Back
                case 283:
                    if ($gameParty.inBattle()) {
                        ImageManager.requestBattleback1(params[0]);
                        ImageManager.requestBattleback2(params[1]);
                    }
                    break;
                // Change Parallax
                case 284:
                    if (!$gameParty.inBattle()) {
                        ImageManager.requestParallax(params[0]);
                    }
                    break;
                // Change Actor Images
                case 322:
                    ImageManager.requestCharacter(params[1]);
                    ImageManager.requestFace(params[3]);
                    ImageManager.requestSvActor(params[5]);
                    break;
                // Change Vehicle Image
                case 323:
                    const vehicle = $gameMap.vehicle(params[0]);
                    if (vehicle) {
                        ImageManager.requestCharacter(params[1]);
                    }
                    break;
                // Enemy Transform
                case 336:
                    const enemy = $dataEnemies[params[1]];
                    const name = enemy.battlerName;
                    const hue = enemy.battlerHue;
                    if ($gameSystem.isSideView()) {
                        ImageManager.requestSvEnemy(name, hue);
                    }
                    else {
                        ImageManager.requestEnemy(name, hue);
                    }
                    break;
            }
        });
    }
    ;
}

class Game_Troop extends Game_Unit {
    constructor() {
        super();
        this._interpreter = new Game_Interpreter();
        this.clear();
    }
    ;
    isEventRunning() {
        return this._interpreter.isRunning();
    }
    ;
    updateInterpreter() {
        this._interpreter.update();
    }
    ;
    turnCount() {
        return this._turnCount;
    }
    ;
    members() {
        return this._enemies;
    }
    ;
    clear() {
        this._interpreter.clear();
        this._troopId = 0;
        this._eventFlags = {};
        this._enemies = [];
        this._turnCount = 0;
        this._namesCount = {};
    }
    ;
    troop() {
        return $dataTroops[this._troopId];
    }
    ;
    setup(troopId) {
        this.clear();
        this._troopId = troopId;
        this._enemies = [];
        this.troop().members.forEach(function (member) {
            if ($dataEnemies[member.enemyId]) {
                const enemyId = member.enemyId;
                const x = member.x;
                const y = member.y;
                const enemy = new Game_Enemy(enemyId, x, y);
                if (member.hidden) {
                    enemy.hide();
                }
                this._enemies.push(enemy);
            }
        }, this);
        this.makeUniqueNames();
    }
    ;
    makeUniqueNames() {
        const table = this.letterTable();
        this.members().forEach(function (enemy) {
            if (enemy.isAlive() && enemy.isLetterEmpty()) {
                const name = enemy.originalName();
                const n = this._namesCount[name] || 0;
                enemy.setLetter(table[n % table.length]);
                this._namesCount[name] = n + 1;
            }
        }, this);
        this.members().forEach(function (enemy) {
            const name = enemy.originalName();
            if (this._namesCount[name] >= 2) {
                enemy.setPlural(true);
            }
        }, this);
    }
    ;
    letterTable() {
        return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL :
            Game_Troop.LETTER_TABLE_HALF;
    }
    ;
    enemyNames() {
        const names = [];
        this.members().forEach(function (enemy) {
            const name = enemy.originalName();
            if (enemy.isAlive() && !names.contains(name)) {
                names.push(name);
            }
        });
        return names;
    }
    ;
    meetsConditions(page) {
        const c = page.conditions;
        if (!c.turnEnding && !c.turnValid && !c.enemyValid &&
            !c.actorValid && !c.switchValid) {
            return false; // Conditions not set
        }
        if (c.turnEnding) {
            if (!BattleManager.isTurnEnd()) {
                return false;
            }
        }
        if (c.turnValid) {
            const n = this._turnCount;
            const a = c.turnA;
            const b = c.turnB;
            if ((b === 0 && n !== a)) {
                return false;
            }
            if ((b > 0 && (n < 1 || n < a || n % b !== a % b))) {
                return false;
            }
        }
        if (c.enemyValid) {
            const enemy = $gameTroop.members()[c.enemyIndex];
            if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = $gameActors.actor(c.actorId);
            if (!actor || actor.hpRate() * 100 > c.actorHp) {
                return false;
            }
        }
        if (c.switchValid) {
            if (!$gameSwitches.value(c.switchId)) {
                return false;
            }
        }
        return true;
    }
    ;
    setupBattleEvent() {
        if (!this._interpreter.isRunning()) {
            if (this._interpreter.setupReservedCommonEvent()) {
                return;
            }
            const pages = this.troop().pages;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (this.meetsConditions(page) && !this._eventFlags[i]) {
                    this._interpreter.setup(page.list);
                    if (page.span <= 1) {
                        this._eventFlags[i] = true;
                    }
                    break;
                }
            }
        }
    }
    ;
    increaseTurn() {
        const pages = this.troop().pages;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page.span === 1) {
                this._eventFlags[i] = false;
            }
        }
        this._turnCount++;
    }
    ;
    expTotal() {
        return this.deadMembers().reduce(function (r, enemy) {
            return r + enemy.exp();
        }, 0);
    }
    ;
    goldTotal() {
        return this.deadMembers().reduce(function (r, enemy) {
            return r + enemy.gold();
        }, 0) * this.goldRate();
    }
    ;
    goldRate() {
        return $gameParty.hasGoldDouble() ? 2 : 1;
    }
    ;
    makeDropItems() {
        return this.deadMembers().reduce(function (r, enemy) {
            return r.concat(enemy.makeDropItems());
        }, []);
    }
    ;
}
Game_Troop.LETTER_TABLE_HALF = [
    ' A', ' B', ' C', ' D', ' E', ' F', ' G', ' H', ' I', ' J', ' K', ' L', ' M',
    ' N', ' O', ' P', ' Q', ' R', ' S', ' T', ' U', ' V', ' W', ' X', ' Y', ' Z'
];
Game_Troop.LETTER_TABLE_FULL = [
    'Ａ', 'Ｂ', 'Ｃ', 'Ｄ', 'Ｅ', 'Ｆ', 'Ｇ', 'Ｈ', 'Ｉ', 'Ｊ', 'Ｋ', 'Ｌ', 'Ｍ',
    'Ｎ', 'Ｏ', 'Ｐ', 'Ｑ', 'Ｒ', 'Ｓ', 'Ｔ', 'Ｕ', 'Ｖ', 'Ｗ', 'Ｘ', 'Ｙ', 'Ｚ'
];

//-----------------------------------------------------------------------------
// Game_CommonEvent
//
// The game object class for a common event. It contains functionality for
// running parallel process events.
class Game_CommonEvent {
    constructor(commonEventId) {
        this._commonEventId = commonEventId;
        this.refresh();
    }
    ;
    event() {
        return $dataCommonEvents[this._commonEventId];
    }
    ;
    list() {
        return this.event().list;
    }
    ;
    refresh() {
        if (this.isActive()) {
            if (!this._interpreter) {
                this._interpreter = new Game_Interpreter();
            }
        }
        else {
            this._interpreter = null;
        }
    }
    ;
    isActive() {
        const event = this.event();
        return event.trigger === 2 && $gameSwitches.value(event.switchId);
    }
    ;
    update() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list());
            }
            this._interpreter.update();
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Event
//
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.
class Game_Event extends Game_Character {
    constructor(mapId, eventId) {
        super();
        this._mapId = mapId;
        this._eventId = eventId;
        this.locate(this.event().x, this.event().y);
        this.refresh();
    }
    ;
    initMembers() {
        super.initMembers();
        this._moveType = 0;
        this._trigger = 0;
        this._starting = false;
        this._erased = false;
        this._pageIndex = -2;
        this._originalPattern = 1;
        this._originalDirection = 2;
        this._prelockDirection = 0;
        this._locked = false;
    }
    ;
    eventId() {
        return this._eventId;
    }
    ;
    event() {
        return $dataMap.events[this._eventId];
    }
    ;
    page() {
        return this.event().pages[this._pageIndex];
    }
    ;
    list() {
        return this.page().list;
    }
    ;
    isCollidedWithCharacters(x, y) {
        return (super.isCollidedWithCharacters(x, y) ||
            this.isCollidedWithPlayerCharacters(x, y));
    }
    ;
    isCollidedWithEvents(x, y) {
        const events = $gameMap.eventsXyNt(x, y);
        return events.length > 0;
    }
    ;
    isCollidedWithPlayerCharacters(x, y) {
        return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
    }
    ;
    lock() {
        if (!this._locked) {
            this._prelockDirection = this.direction();
            this.turnTowardPlayer();
            this._locked = true;
        }
    }
    ;
    unlock() {
        if (this._locked) {
            this._locked = false;
            this.setDirection(this._prelockDirection);
        }
    }
    ;
    updateStop() {
        if (this._locked) {
            this.resetStopCount();
        }
        super.updateStop();
        if (!this.isMoveRouteForcing()) {
            this.updateSelfMovement();
        }
    }
    ;
    updateSelfMovement() {
        if (!this._locked && this.isNearTheScreen() &&
            this.checkStop(this.stopCountThreshold())) {
            switch (this._moveType) {
                case 1:
                    this.moveTypeRandom();
                    break;
                case 2:
                    this.moveTypeTowardPlayer();
                    break;
                case 3:
                    this.moveTypeCustom();
                    break;
            }
        }
    }
    ;
    stopCountThreshold() {
        return 30 * (5 - this.moveFrequency());
    }
    ;
    moveTypeRandom() {
        switch (Math.randomInt(6)) {
            case 0:
            case 1:
                this.moveRandom();
                break;
            case 2:
            case 3:
            case 4:
                this.moveForward();
                break;
            case 5:
                this.resetStopCount();
                break;
        }
    }
    ;
    moveTypeTowardPlayer() {
        if (this.isNearThePlayer()) {
            switch (Math.randomInt(6)) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.moveTowardPlayer();
                    break;
                case 4:
                    this.moveRandom();
                    break;
                case 5:
                    this.moveForward();
                    break;
            }
        }
        else {
            this.moveRandom();
        }
    }
    ;
    isNearThePlayer() {
        const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return sx + sy < 20;
    }
    ;
    moveTypeCustom() {
        this.updateRoutineMove();
    }
    ;
    isStarting() {
        return this._starting;
    }
    ;
    clearStartingFlag() {
        this._starting = false;
    }
    ;
    isTriggerIn(triggers) {
        return triggers.contains(this._trigger);
    }
    ;
    start() {
        const list = this.list();
        if (list && list.length > 1) {
            this._starting = true;
            if (this.isTriggerIn([0, 1, 2])) {
                this.lock();
            }
        }
    }
    ;
    erase() {
        this._erased = true;
        this.refresh();
    }
    ;
    refresh() {
        const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
        if (this._pageIndex !== newPageIndex) {
            this._pageIndex = newPageIndex;
            this.setupPage();
        }
    }
    ;
    findProperPageIndex() {
        const pages = this.event().pages;
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (this.meetsConditions(page)) {
                return i;
            }
        }
        return -1;
    }
    ;
    meetsConditions(page) {
        const c = page.conditions;
        if (c.switch1Valid) {
            if (!$gameSwitches.value(c.switch1Id)) {
                return false;
            }
        }
        if (c.switch2Valid) {
            if (!$gameSwitches.value(c.switch2Id)) {
                return false;
            }
        }
        if (c.variableValid) {
            if ($gameVariables.value(c.variableId) < c.variableValue) {
                return false;
            }
        }
        if (c.selfSwitchValid) {
            const key = [this._mapId, this._eventId, c.selfSwitchCh];
            if ($gameSelfSwitches.value(key) !== true) {
                return false;
            }
        }
        if (c.itemValid) {
            const item = $dataItems[c.itemId];
            if (!$gameParty.hasItem(item)) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = $gameActors.actor(c.actorId);
            if (!$gameParty.members().contains(actor)) {
                return false;
            }
        }
        return true;
    }
    ;
    setupPage() {
        if (this._pageIndex >= 0) {
            this.setupPageSettings();
        }
        else {
            this.clearPageSettings();
        }
        this.refreshBushDepth();
        this.clearStartingFlag();
        this.checkEventTriggerAuto();
    }
    ;
    clearPageSettings() {
        this.setImage('', 0);
        this._moveType = 0;
        this._trigger = null;
        this._interpreter = null;
        this.setThrough(true);
    }
    ;
    setupPageSettings() {
        const page = this.page();
        const image = page.image;
        if (image.tileId > 0) {
            this.setTileImage(image.tileId);
        }
        else {
            this.setImage(image.characterName, image.characterIndex);
        }
        if (this._originalDirection !== image.direction) {
            this._originalDirection = image.direction;
            this._prelockDirection = 0;
            this.setDirectionFix(false);
            this.setDirection(image.direction);
        }
        if (this._originalPattern !== image.pattern) {
            this._originalPattern = image.pattern;
            this.setPattern(image.pattern);
        }
        this.setMoveSpeed(page.moveSpeed);
        this.setMoveFrequency(page.moveFrequency);
        this.setPriorityType(page.priorityType);
        this.setWalkAnime(page.walkAnime);
        this.setStepAnime(page.stepAnime);
        this.setDirectionFix(page.directionFix);
        this.setThrough(page.through);
        this.setMoveRoute(page.moveRoute);
        this._moveType = page.moveType;
        this._trigger = page.trigger;
        if (this._trigger === 4) {
            this._interpreter = new Game_Interpreter();
        }
        else {
            this._interpreter = null;
        }
    }
    ;
    isOriginalPattern() {
        return this.pattern() === this._originalPattern;
    }
    ;
    resetPattern() {
        this.setPattern(this._originalPattern);
    }
    ;
    checkEventTriggerTouch(x, y) {
        if (!$gameMap.isEventRunning()) {
            if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    this.start();
                }
            }
        }
    }
    ;
    checkEventTriggerAuto() {
        if (this._trigger === 3) {
            this.start();
        }
    }
    ;
    update() {
        super.update();
        this.checkEventTriggerAuto();
        this.updateParallel();
    }
    ;
    updateParallel() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list(), this._eventId);
            }
            this._interpreter.update();
        }
    }
    ;
    locate(x, y) {
        super.locate(x, y);
        this._prelockDirection = 0;
    }
    ;
    forceMoveRoute(moveRoute) {
        super.forceMoveRoute(moveRoute);
        this._prelockDirection = 0;
    }
    ;
}

class Game_Vehicle extends Game_Character {
    constructor(type) {
        super();
        this._type = type;
        this.resetDirection();
        this.initMoveSpeed();
        this.loadSystemSettings();
    }
    ;
    initMembers() {
        super.initMembers();
        this._type = '';
        this._mapId = 0;
        this._altitude = 0;
        this._driving = false;
        this._bgm = null;
    }
    ;
    isBoat() {
        return this._type === 'boat';
    }
    ;
    isShip() {
        return this._type === 'ship';
    }
    ;
    isAirship() {
        return this._type === 'airship';
    }
    ;
    resetDirection() {
        this.setDirection(4);
    }
    ;
    initMoveSpeed() {
        if (this.isBoat()) {
            this.setMoveSpeed(4);
        }
        else if (this.isShip()) {
            this.setMoveSpeed(5);
        }
        else if (this.isAirship()) {
            this.setMoveSpeed(6);
        }
    }
    ;
    vehicle() {
        if (this.isBoat()) {
            return $dataSystem.boat;
        }
        else if (this.isShip()) {
            return $dataSystem.ship;
        }
        else if (this.isAirship()) {
            return $dataSystem.airship;
        }
        else {
            return null;
        }
    }
    ;
    loadSystemSettings() {
        const vehicle = this.vehicle();
        this._mapId = vehicle.startMapId;
        this.setPosition(vehicle.startX, vehicle.startY);
        this.setImage(vehicle.characterName, vehicle.characterIndex);
    }
    ;
    refresh() {
        if (this._driving) {
            this._mapId = $gameMap.mapId();
            this.syncWithPlayer();
        }
        else if (this._mapId === $gameMap.mapId()) {
            this.locate(this.x, this.y);
        }
        if (this.isAirship()) {
            this.setPriorityType(this._driving ? 2 : 0);
        }
        else {
            this.setPriorityType(1);
        }
        this.setWalkAnime(this._driving);
        this.setStepAnime(this._driving);
        this.setTransparent(this._mapId !== $gameMap.mapId());
    }
    ;
    setLocation(mapId, x, y) {
        this._mapId = mapId;
        this.setPosition(x, y);
        this.refresh();
    }
    ;
    pos(x, y) {
        if (this._mapId === $gameMap.mapId()) {
            return super.pos(x, y);
        }
        else {
            return false;
        }
    }
    ;
    isMapPassable(x, y, d) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        if (this.isBoat()) {
            return $gameMap.isBoatPassable(x2, y2);
        }
        else if (this.isShip()) {
            return $gameMap.isShipPassable(x2, y2);
        }
        else if (this.isAirship()) {
            return true;
        }
        else {
            return false;
        }
    }
    ;
    getOn() {
        this._driving = true;
        this.setWalkAnime(true);
        this.setStepAnime(true);
        $gameSystem.saveWalkingBgm();
        this.playBgm();
    }
    ;
    getOff() {
        this._driving = false;
        this.setWalkAnime(false);
        this.setStepAnime(false);
        this.resetDirection();
        $gameSystem.replayWalkingBgm();
    }
    ;
    setBgm(bgm) {
        this._bgm = bgm;
    }
    ;
    playBgm() {
        AudioManager.playBgm(this._bgm || this.vehicle().bgm);
    }
    ;
    syncWithPlayer() {
        this.copyPosition($gamePlayer);
        this.refreshBushDepth();
    }
    ;
    screenY() {
        return super.screenY() - this._altitude;
    }
    ;
    shadowX() {
        return this.screenX();
    }
    ;
    shadowY() {
        return this.screenY() + this._altitude;
    }
    ;
    shadowOpacity() {
        return 255 * this._altitude / this.maxAltitude();
    }
    ;
    canMove() {
        if (this.isAirship()) {
            return this.isHighest();
        }
        else {
            return true;
        }
    }
    ;
    update() {
        super.update();
        if (this.isAirship()) {
            this.updateAirship();
        }
    }
    ;
    updateAirship() {
        this.updateAirshipAltitude();
        this.setStepAnime(this.isHighest());
        this.setPriorityType(this.isLowest() ? 0 : 2);
    }
    ;
    updateAirshipAltitude() {
        if (this._driving && !this.isHighest()) {
            this._altitude++;
        }
        if (!this._driving && !this.isLowest()) {
            this._altitude--;
        }
    }
    ;
    maxAltitude() {
        return 48;
    }
    ;
    isLowest() {
        return this._altitude <= 0;
    }
    ;
    isHighest() {
        return this._altitude >= this.maxAltitude();
    }
    ;
    isTakeoffOk() {
        return $gamePlayer.areFollowersGathered();
    }
    ;
    isLandOk(x, y, d) {
        if (this.isAirship()) {
            if (!$gameMap.isAirshipLandOk(x, y)) {
                return false;
            }
            if ($gameMap.eventsXy(x, y).length > 0) {
                return false;
            }
        }
        else {
            const x2 = $gameMap.roundXWithDirection(x, d);
            const y2 = $gameMap.roundYWithDirection(y, d);
            if (!$gameMap.isValid(x2, y2)) {
                return false;
            }
            if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
                return false;
            }
            if (this.isCollidedWithCharacters(x2, y2)) {
                return false;
            }
        }
        return true;
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.
class Game_Map {
    constructor() {
        this._mapId = 0;
        this._tilesetId = 0;
        this._events = [];
        this._commonEvents = [];
        this._vehicles = [];
        this._displayX = 0;
        this._displayY = 0;
        this._nameDisplay = true;
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
        this._parallaxName = '';
        this._parallaxZero = false;
        this._parallaxLoopX = false;
        this._parallaxLoopY = false;
        this._parallaxSx = 0;
        this._parallaxSy = 0;
        this._parallaxX = 0;
        this._parallaxY = 0;
        this._battleback1Name = null;
        this._battleback2Name = null;
        this._interpreter = new Game_Interpreter();
        this.createVehicles();
    }
    ;
    setup(mapId) {
        if (!$dataMap) {
            throw new Error('The map data is not available');
        }
        this._mapId = mapId;
        this._tilesetId = $dataMap.tilesetId;
        this._displayX = 0;
        this._displayY = 0;
        this.refereshVehicles();
        this.setupEvents();
        this.setupScroll();
        this.setupParallax();
        this.setupBattleback();
        this._needsRefresh = false;
    }
    ;
    isEventRunning() {
        return this._interpreter.isRunning() || this.isAnyEventStarting();
    }
    ;
    tileWidth() {
        return 48;
    }
    ;
    tileHeight() {
        return 48;
    }
    ;
    mapId() {
        return this._mapId;
    }
    ;
    tilesetId() {
        return this._tilesetId;
    }
    ;
    displayX() {
        return this._displayX;
    }
    ;
    displayY() {
        return this._displayY;
    }
    ;
    parallaxName() {
        return this._parallaxName;
    }
    ;
    battleback1Name() {
        return this._battleback1Name;
    }
    ;
    battleback2Name() {
        return this._battleback2Name;
    }
    ;
    requestRefresh(mapId) {
        this._needsRefresh = true;
    }
    ;
    isNameDisplayEnabled() {
        return this._nameDisplay;
    }
    ;
    disableNameDisplay() {
        this._nameDisplay = false;
    }
    ;
    enableNameDisplay() {
        this._nameDisplay = true;
    }
    ;
    createVehicles() {
        this._vehicles = [];
        this._vehicles[0] = new Game_Vehicle('boat');
        this._vehicles[1] = new Game_Vehicle('ship');
        this._vehicles[2] = new Game_Vehicle('airship');
    }
    ;
    refereshVehicles() {
        this._vehicles.forEach(function (vehicle) {
            vehicle.refresh();
        });
    }
    ;
    vehicles() {
        return this._vehicles;
    }
    ;
    vehicle(type) {
        if (type === 0 || type === 'boat') {
            return this.boat();
        }
        else if (type === 1 || type === 'ship') {
            return this.ship();
        }
        else if (type === 2 || type === 'airship') {
            return this.airship();
        }
        else {
            return null;
        }
    }
    ;
    boat() {
        return this._vehicles[0];
    }
    ;
    ship() {
        return this._vehicles[1];
    }
    ;
    airship() {
        return this._vehicles[2];
    }
    ;
    setupEvents() {
        this._events = [];
        for (let i = 0; i < $dataMap.events.length; i++) {
            if ($dataMap.events[i]) {
                this._events[i] = new Game_Event(this._mapId, i);
            }
        }
        this._commonEvents = this.parallelCommonEvents().map(function (commonEvent) {
            return new Game_CommonEvent(commonEvent.id);
        });
        this.refreshTileEvents();
    }
    ;
    events() {
        return this._events.filter(function (event) {
            return !!event;
        });
    }
    ;
    event(eventId) {
        return this._events[eventId];
    }
    ;
    eraseEvent(eventId) {
        this._events[eventId].erase();
    }
    ;
    parallelCommonEvents() {
        return $dataCommonEvents.filter(function (commonEvent) {
            return commonEvent && commonEvent.trigger === 2;
        });
    }
    ;
    setupScroll() {
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
    }
    ;
    setupParallax() {
        this._parallaxName = $dataMap.parallaxName || '';
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = $dataMap.parallaxLoopX;
        this._parallaxLoopY = $dataMap.parallaxLoopY;
        this._parallaxSx = $dataMap.parallaxSx;
        this._parallaxSy = $dataMap.parallaxSy;
        this._parallaxX = 0;
        this._parallaxY = 0;
    }
    ;
    setupBattleback() {
        if ($dataMap.specifyBattleback) {
            this._battleback1Name = $dataMap.battleback1Name;
            this._battleback2Name = $dataMap.battleback2Name;
        }
        else {
            this._battleback1Name = null;
            this._battleback2Name = null;
        }
    }
    ;
    setDisplayPos(x, y) {
        if (this.isLoopHorizontal()) {
            this._displayX = x.mod(this.width());
            this._parallaxX = x;
        }
        else {
            const endX = this.width() - this.screenTileX();
            this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
            this._parallaxX = this._displayX;
        }
        if (this.isLoopVertical()) {
            this._displayY = y.mod(this.height());
            this._parallaxY = y;
        }
        else {
            const endY = this.height() - this.screenTileY();
            this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
            this._parallaxY = this._displayY;
        }
    }
    ;
    parallaxOx() {
        if (this._parallaxZero) {
            return this._parallaxX * this.tileWidth();
        }
        else if (this._parallaxLoopX) {
            return this._parallaxX * this.tileWidth() / 2;
        }
        else {
            return 0;
        }
    }
    ;
    parallaxOy() {
        if (this._parallaxZero) {
            return this._parallaxY * this.tileHeight();
        }
        else if (this._parallaxLoopY) {
            return this._parallaxY * this.tileHeight() / 2;
        }
        else {
            return 0;
        }
    }
    ;
    tileset() {
        return $dataTilesets[this._tilesetId];
    }
    ;
    tilesetFlags() {
        const tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        }
        else {
            return [];
        }
    }
    ;
    displayName() {
        return $dataMap.displayName;
    }
    ;
    width() {
        return $dataMap.width;
    }
    ;
    height() {
        return $dataMap.height;
    }
    ;
    data() {
        return $dataMap.data;
    }
    ;
    isLoopHorizontal() {
        return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
    }
    ;
    isLoopVertical() {
        return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
    }
    ;
    isDashDisabled() {
        return $dataMap.disableDashing;
    }
    ;
    encounterList() {
        return $dataMap.encounterList;
    }
    ;
    encounterStep() {
        return $dataMap.encounterStep;
    }
    ;
    isOverworld() {
        return this.tileset() && this.tileset().mode === 0;
    }
    ;
    screenTileX() {
        return Graphics.width / this.tileWidth();
    }
    ;
    screenTileY() {
        return Graphics.height / this.tileHeight();
    }
    ;
    adjustX(x) {
        if (this.isLoopHorizontal() && x < this._displayX -
            (this.width() - this.screenTileX()) / 2) {
            return x - this._displayX + $dataMap.width;
        }
        else {
            return x - this._displayX;
        }
    }
    ;
    adjustY(y) {
        if (this.isLoopVertical() && y < this._displayY -
            (this.height() - this.screenTileY()) / 2) {
            return y - this._displayY + $dataMap.height;
        }
        else {
            return y - this._displayY;
        }
    }
    ;
    roundX(x) {
        return this.isLoopHorizontal() ? x.mod(this.width()) : x;
    }
    ;
    roundY(y) {
        return this.isLoopVertical() ? y.mod(this.height()) : y;
    }
    ;
    xWithDirection(x, d) {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    }
    ;
    yWithDirection(y, d) {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    }
    ;
    roundXWithDirection(x, d) {
        return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    }
    ;
    roundYWithDirection(y, d) {
        return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    }
    ;
    deltaX(x1, x2) {
        let result = x1 - x2;
        if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
            if (result < 0) {
                result += this.width();
            }
            else {
                result -= this.width();
            }
        }
        return result;
    }
    ;
    deltaY(y1, y2) {
        let result = y1 - y2;
        if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
            if (result < 0) {
                result += this.height();
            }
            else {
                result -= this.height();
            }
        }
        return result;
    }
    ;
    distance(x1, y1, x2, y2) {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    }
    ;
    canvasToMapX(x) {
        const tileWidth = this.tileWidth();
        const originX = this._displayX * tileWidth;
        const mapX = Math.floor((originX + x) / tileWidth);
        return this.roundX(mapX);
    }
    ;
    canvasToMapY(y) {
        const tileHeight = this.tileHeight();
        const originY = this._displayY * tileHeight;
        const mapY = Math.floor((originY + y) / tileHeight);
        return this.roundY(mapY);
    }
    ;
    autoplay() {
        if ($dataMap.autoplayBgm) {
            if ($gamePlayer.isInVehicle()) {
                $gameSystem.saveWalkingBgm2();
            }
            else {
                AudioManager.playBgm($dataMap.bgm);
            }
        }
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
    }
    ;
    refreshIfNeeded() {
        if (this._needsRefresh) {
            this.refresh();
        }
    }
    ;
    refresh() {
        this.events().forEach(function (event) {
            event.refresh();
        });
        this._commonEvents.forEach(function (event) {
            event.refresh();
        });
        this.refreshTileEvents();
        this._needsRefresh = false;
    }
    ;
    refreshTileEvents() {
        this.tileEvents = this.events().filter(function (event) {
            return event.isTile();
        });
    }
    ;
    eventsXy(x, y) {
        return this.events().filter(function (event) {
            return event.pos(x, y);
        });
    }
    ;
    eventsXyNt(x, y) {
        return this.events().filter(function (event) {
            return event.posNt(x, y);
        });
    }
    ;
    tileEventsXy(x, y) {
        return this.tileEvents.filter(function (event) {
            return event.posNt(x, y);
        });
    }
    ;
    eventIdXy(x, y) {
        const list = this.eventsXy(x, y);
        return list.length === 0 ? 0 : list[0].eventId();
    }
    ;
    scrollDown(distance) {
        if (this.isLoopVertical()) {
            this._displayY += distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY += distance;
            }
        }
        else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.min(this._displayY + distance, this.height() - this.screenTileY());
            this._parallaxY += this._displayY - lastY;
        }
    }
    ;
    scrollLeft(distance) {
        if (this.isLoopHorizontal()) {
            this._displayX += $dataMap.width - distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX -= distance;
            }
        }
        else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.max(this._displayX - distance, 0);
            this._parallaxX += this._displayX - lastX;
        }
    }
    ;
    scrollRight(distance) {
        if (this.isLoopHorizontal()) {
            this._displayX += distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX += distance;
            }
        }
        else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.min(this._displayX + distance, this.width() - this.screenTileX());
            this._parallaxX += this._displayX - lastX;
        }
    }
    ;
    scrollUp(distance) {
        if (this.isLoopVertical()) {
            this._displayY += $dataMap.height - distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY -= distance;
            }
        }
        else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.max(this._displayY - distance, 0);
            this._parallaxY += this._displayY - lastY;
        }
    }
    ;
    isValid(x, y) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    }
    ;
    checkPassage(x, y, bit) {
        const flags = this.tilesetFlags();
        const tiles = this.allTiles(x, y);
        for (let i = 0; i < tiles.length; i++) {
            const flag = flags[tiles[i]];
            if ((flag & 0x10) !== 0)
                continue;
            if ((flag & bit) === 0)
                return true;
            if ((flag & bit) === bit)
                return false;
        }
        return false;
    }
    ;
    tileId(x, y, z) {
        const width = $dataMap.width;
        const height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    }
    ;
    layeredTiles(x, y) {
        const tiles = [];
        for (let i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    }
    ;
    allTiles(x, y) {
        const tiles = this.tileEventsXy(x, y).map(function (event) {
            return event.tileId();
        });
        return tiles.concat(this.layeredTiles(x, y));
    }
    ;
    autotileType(x, y, z) {
        const tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    }
    ;
    isPassable(x, y, d) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    }
    ;
    isBoatPassable(x, y) {
        return this.checkPassage(x, y, 0x0200);
    }
    ;
    isShipPassable(x, y) {
        return this.checkPassage(x, y, 0x0400);
    }
    ;
    isAirshipLandOk(x, y) {
        return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
    }
    ;
    checkLayeredTilesFlags(x, y, bit) {
        const flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some(function (tileId) {
            return (flags[tileId] & bit) !== 0;
        });
    }
    ;
    isLadder(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    }
    ;
    isBush(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    }
    ;
    isCounter(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    }
    ;
    isDamageFloor(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    }
    ;
    terrainTag(x, y) {
        if (this.isValid(x, y)) {
            const flags = this.tilesetFlags();
            const tiles = this.layeredTiles(x, y);
            for (let i = 0; i < tiles.length; i++) {
                const tag = flags[tiles[i]] >> 12;
                if (tag > 0) {
                    return tag;
                }
            }
        }
        return 0;
    }
    ;
    regionId(x, y) {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    }
    ;
    startScroll(direction, distance, speed) {
        this._scrollDirection = direction;
        this._scrollRest = distance;
        this._scrollSpeed = speed;
    }
    ;
    isScrolling() {
        return this._scrollRest > 0;
    }
    ;
    update(sceneActive) {
        this.refreshIfNeeded();
        if (sceneActive) {
            this.updateInterpreter();
        }
        this.updateScroll();
        this.updateEvents();
        this.updateVehicles();
        this.updateParallax();
    }
    ;
    updateScroll() {
        if (this.isScrolling()) {
            const lastX = this._displayX;
            const lastY = this._displayY;
            this.doScroll(this._scrollDirection, this.scrollDistance());
            if (this._displayX === lastX && this._displayY === lastY) {
                this._scrollRest = 0;
            }
            else {
                this._scrollRest -= this.scrollDistance();
            }
        }
    }
    ;
    scrollDistance() {
        return Math.pow(2, this._scrollSpeed) / 256;
    }
    ;
    doScroll(direction, distance) {
        switch (direction) {
            case 2:
                this.scrollDown(distance);
                break;
            case 4:
                this.scrollLeft(distance);
                break;
            case 6:
                this.scrollRight(distance);
                break;
            case 8:
                this.scrollUp(distance);
                break;
        }
    }
    ;
    updateEvents() {
        this.events().forEach(function (event) {
            event.update();
        });
        this._commonEvents.forEach(function (event) {
            event.update();
        });
    }
    ;
    updateVehicles() {
        this._vehicles.forEach(function (vehicle) {
            vehicle.update();
        });
    }
    ;
    updateParallax() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
        }
    }
    ;
    changeTileset(tilesetId) {
        this._tilesetId = tilesetId;
        this.refresh();
    }
    ;
    changeBattleback(battleback1Name, battleback2Name) {
        this._battleback1Name = battleback1Name;
        this._battleback2Name = battleback2Name;
    }
    ;
    changeParallax(name, loopX, loopY, sx, sy) {
        this._parallaxName = name;
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        if (this._parallaxLoopX && !loopX) {
            this._parallaxX = 0;
        }
        if (this._parallaxLoopY && !loopY) {
            this._parallaxY = 0;
        }
        this._parallaxLoopX = loopX;
        this._parallaxLoopY = loopY;
        this._parallaxSx = sx;
        this._parallaxSy = sy;
    }
    ;
    updateInterpreter() {
        for (;;) {
            this._interpreter.update();
            if (this._interpreter.isRunning()) {
                return;
            }
            if (this._interpreter.eventId() > 0) {
                this.unlockEvent(this._interpreter.eventId());
                this._interpreter.clear();
            }
            if (!this.setupStartingEvent()) {
                return;
            }
        }
    }
    ;
    unlockEvent(eventId) {
        if (this._events[eventId]) {
            this._events[eventId].unlock();
        }
    }
    ;
    setupStartingEvent() {
        this.refreshIfNeeded();
        if (this._interpreter.setupReservedCommonEvent()) {
            return true;
        }
        if (this.setupTestEvent()) {
            return true;
        }
        if (this.setupStartingMapEvent()) {
            return true;
        }
        if (this.setupAutorunCommonEvent()) {
            return true;
        }
        return false;
    }
    ;
    setupTestEvent() {
        if ($testEvent) {
            this._interpreter.setup($testEvent, 0);
            $testEvent = null;
            return true;
        }
        return false;
    }
    ;
    setupStartingMapEvent() {
        const events = this.events();
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (event.isStarting()) {
                event.clearStartingFlag();
                this._interpreter.setup(event.list(), event.eventId());
                return true;
            }
        }
        return false;
    }
    ;
    setupAutorunCommonEvent() {
        for (let i = 0; i < $dataCommonEvents.length; i++) {
            const event = $dataCommonEvents[i];
            if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
                this._interpreter.setup(event.list);
                return true;
            }
        }
        return false;
    }
    ;
    isAnyEventStarting() {
        return this.events().some(function (event) {
            return event.isStarting();
        });
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Follower
//
// The game object class for a follower. A follower is an allied character,
// other than the front character, displayed in the party.
class Game_Follower extends Game_Character {
    constructor(memberIndex) {
        super();
        this._memberIndex = memberIndex;
        this.setTransparent($dataSystem.optTransparent);
        this.setThrough(true);
    }
    ;
    refresh() {
        const characterName = this.isVisible() ? this.actor().characterName() : '';
        const characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
        this.setImage(characterName, characterIndex);
    }
    ;
    actor() {
        return $gameParty.battleMembers()[this._memberIndex];
    }
    ;
    isVisible() {
        return this.actor() && $gamePlayer.followers().isVisible();
    }
    ;
    update() {
        super.update();
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
        this.setOpacity($gamePlayer.opacity());
        this.setBlendMode($gamePlayer.blendMode());
        this.setWalkAnime($gamePlayer.hasWalkAnime());
        this.setStepAnime($gamePlayer.hasStepAnime());
        this.setDirectionFix($gamePlayer.isDirectionFixed());
        this.setTransparent($gamePlayer.isTransparent());
    }
    ;
    chaseCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (sx !== 0 && sy !== 0) {
            this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
        }
        else if (sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        }
        else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
    }
    ;
}

class Game_Followers {
    constructor() {
        this._gathering = false;
        this._data = [];
        this._visible = $dataSystem.optFollowers;
        for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
            this._data.push(new Game_Follower(i));
        }
    }
    isVisible() {
        return this._visible;
    }
    ;
    show() {
        this._visible = true;
    }
    ;
    hide() {
        this._visible = false;
    }
    ;
    follower(index) {
        return this._data[index];
    }
    ;
    forEach(callback, thisObject) {
        this._data.forEach(callback, thisObject);
    }
    ;
    reverseEach(callback, thisObject) {
        this._data.reverse();
        this._data.forEach(callback, thisObject);
        this._data.reverse();
    }
    ;
    refresh() {
        this.forEach(function (follower) {
            return follower.refresh();
        }, this);
    }
    ;
    update() {
        if (this.areGathering()) {
            if (!this.areMoving()) {
                this.updateMove();
            }
            if (this.areGathered()) {
                this._gathering = false;
            }
        }
        this.forEach(function (follower) {
            follower.update();
        }, this);
    }
    ;
    updateMove() {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
            this._data[i].chaseCharacter(precedingCharacter);
        }
    }
    ;
    jumpAll() {
        if ($gamePlayer.isJumping()) {
            for (let i = 0; i < this._data.length; i++) {
                const follower = this._data[i];
                const sx = $gamePlayer.deltaXFrom(follower.x);
                const sy = $gamePlayer.deltaYFrom(follower.y);
                follower.jump(sx, sy);
            }
        }
    }
    ;
    synchronize(x, y, d) {
        this.forEach(function (follower) {
            follower.locate(x, y);
            follower.setDirection(d);
        }, this);
    }
    ;
    gather() {
        this._gathering = true;
    }
    ;
    areGathering() {
        return this._gathering;
    }
    ;
    visibleFollowers() {
        return this._data.filter(function (follower) {
            return follower.isVisible();
        }, this);
    }
    ;
    areMoving() {
        return this.visibleFollowers().some(function (follower) {
            return follower.isMoving();
        }, this);
    }
    ;
    areGathered() {
        return this.visibleFollowers().every(function (follower) {
            return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
        }, this);
    }
    ;
    isSomeoneCollided(x, y) {
        return this.visibleFollowers().some(function (follower) {
            return follower.pos(x, y);
        }, this);
    }
    ;
}

//-----------------------------------------------------------------------------
// Game_Player
//
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.
class Game_Player extends Game_Character {
    constructor() {
        super();
        this.setTransparent($dataSystem.optTransparent);
    }
    ;
    initMembers() {
        super.initMembers();
        this._vehicleType = 'walk';
        this._vehicleGettingOn = false;
        this._vehicleGettingOff = false;
        this._dashing = false;
        this._needsMapReload = false;
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
        this._fadeType = 0;
        this._followers = new Game_Followers();
        this._encounterCount = 0;
    }
    ;
    clearTransferInfo() {
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
    }
    ;
    followers() {
        return this._followers;
    }
    ;
    refresh() {
        const actor = $gameParty.leader();
        const characterName = actor ? actor.characterName() : '';
        const characterIndex = actor ? actor.characterIndex() : 0;
        this.setImage(characterName, characterIndex);
        this._followers.refresh();
    }
    ;
    isStopping() {
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        return super.isStopping();
    }
    ;
    reserveTransfer(mapId, x, y, d, fadeType) {
        this._transferring = true;
        this._newMapId = mapId;
        this._newX = x;
        this._newY = y;
        this._newDirection = d;
        this._fadeType = fadeType;
    }
    ;
    requestMapReload() {
        this._needsMapReload = true;
    }
    ;
    isTransferring() {
        return this._transferring;
    }
    ;
    newMapId() {
        return this._newMapId;
    }
    ;
    fadeType() {
        return this._fadeType;
    }
    ;
    performTransfer() {
        if (this.isTransferring()) {
            this.setDirection(this._newDirection);
            if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
                $gameMap.setup(this._newMapId);
                this._needsMapReload = false;
            }
            this.locate(this._newX, this._newY);
            this.refresh();
            this.clearTransferInfo();
        }
    }
    ;
    isMapPassable(x, y, d) {
        const vehicle = this.vehicle();
        if (vehicle) {
            return vehicle.isMapPassable(x, y, d);
        }
        else {
            return super.isMapPassable(x, y, d);
        }
    }
    ;
    vehicle() {
        return $gameMap.vehicle(this._vehicleType);
    }
    ;
    isInBoat() {
        return this._vehicleType === 'boat';
    }
    ;
    isInShip() {
        return this._vehicleType === 'ship';
    }
    ;
    isInAirship() {
        return this._vehicleType === 'airship';
    }
    ;
    isInVehicle() {
        return this.isInBoat() || this.isInShip() || this.isInAirship();
    }
    ;
    isNormal() {
        return this._vehicleType === 'walk' && !this.isMoveRouteForcing();
    }
    ;
    isDashing() {
        return this._dashing;
    }
    ;
    isDebugThrough() {
        return Input.isPressed('control') && $gameTemp.isPlaytest();
    }
    ;
    isCollided(x, y) {
        if (this.isThrough()) {
            return false;
        }
        else {
            return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
        }
    }
    ;
    centerX() {
        return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
    }
    ;
    centerY() {
        return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
    }
    ;
    center(x, y) {
        return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
    }
    ;
    locate(x, y) {
        super.locate(x, y);
        this.center(x, y);
        this.makeEncounterCount();
        if (this.isInVehicle()) {
            this.vehicle().refresh();
        }
        this._followers.synchronize(x, y, this.direction());
    }
    ;
    increaseSteps() {
        super.increaseSteps();
        if (this.isNormal()) {
            $gameParty.increaseSteps();
        }
    }
    ;
    makeEncounterCount() {
        const n = $gameMap.encounterStep();
        this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
    }
    ;
    makeEncounterTroopId() {
        const encounterList = [];
        let weightSum = 0;
        $gameMap.encounterList().forEach(function (encounter) {
            if (this.meetsEncounterConditions(encounter)) {
                encounterList.push(encounter);
                weightSum += encounter.weight;
            }
        }, this);
        if (weightSum > 0) {
            let value = Math.randomInt(weightSum);
            for (let i = 0; i < encounterList.length; i++) {
                value -= encounterList[i].weight;
                if (value < 0) {
                    return encounterList[i].troopId;
                }
            }
        }
        return 0;
    }
    ;
    meetsEncounterConditions(encounter) {
        return (encounter.regionSet.length === 0 ||
            encounter.regionSet.contains(this.regionId()));
    }
    ;
    executeEncounter() {
        if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
            this.makeEncounterCount();
            const troopId = this.makeEncounterTroopId();
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, true, false);
                BattleManager.onEncounter();
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    ;
    startMapEvent(x, y, triggers, normal) {
        if (!$gameMap.isEventRunning()) {
            $gameMap.eventsXy(x, y).forEach(function (event) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    event.start();
                }
            });
        }
    }
    ;
    moveByInput() {
        if (!this.isMoving() && this.canMove()) {
            let direction = this.getInputDirection();
            if (direction > 0) {
                $gameTemp.clearDestination();
            }
            else if ($gameTemp.isDestinationValid()) {
                const x = $gameTemp.destinationX();
                const y = $gameTemp.destinationY();
                direction = this.findDirectionTo(x, y);
            }
            if (direction > 0) {
                this.executeMove(direction);
            }
        }
    }
    ;
    canMove() {
        if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
            return false;
        }
        if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
            return false;
        }
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        if (this.isInVehicle() && !this.vehicle().canMove()) {
            return false;
        }
        return true;
    }
    ;
    getInputDirection() {
        return Input.dir4;
    }
    ;
    executeMove(direction) {
        this.moveStraight(direction);
    }
    ;
    update(sceneActive) {
        const lastScrolledX = this.scrolledX();
        const lastScrolledY = this.scrolledY();
        const wasMoving = this.isMoving();
        this.updateDashing();
        if (sceneActive) {
            this.moveByInput();
        }
        super.update();
        this.updateScroll(lastScrolledX, lastScrolledY);
        this.updateVehicle();
        if (!this.isMoving()) {
            this.updateNonmoving(wasMoving);
        }
        this._followers.update();
    }
    ;
    updateDashing() {
        if (this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
            this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
        }
        else {
            this._dashing = false;
        }
    }
    ;
    isDashButtonPressed() {
        const shift = Input.isPressed('shift');
        if (ConfigManager.alwaysDash) {
            return !shift;
        }
        else {
            return shift;
        }
    }
    ;
    updateScroll(lastScrolledX, lastScrolledY) {
        const x1 = lastScrolledX;
        const y1 = lastScrolledY;
        const x2 = this.scrolledX();
        const y2 = this.scrolledY();
        if (y2 > y1 && y2 > this.centerY()) {
            $gameMap.scrollDown(y2 - y1);
        }
        if (x2 < x1 && x2 < this.centerX()) {
            $gameMap.scrollLeft(x1 - x2);
        }
        if (x2 > x1 && x2 > this.centerX()) {
            $gameMap.scrollRight(x2 - x1);
        }
        if (y2 < y1 && y2 < this.centerY()) {
            $gameMap.scrollUp(y1 - y2);
        }
    }
    ;
    updateVehicle() {
        if (this.isInVehicle() && !this.areFollowersGathering()) {
            if (this._vehicleGettingOn) {
                this.updateVehicleGetOn();
            }
            else if (this._vehicleGettingOff) {
                this.updateVehicleGetOff();
            }
            else {
                this.vehicle().syncWithPlayer();
            }
        }
    }
    ;
    updateVehicleGetOn() {
        if (!this.areFollowersGathering() && !this.isMoving()) {
            this.setDirection(this.vehicle().direction());
            this.setMoveSpeed(this.vehicle().moveSpeed());
            this._vehicleGettingOn = false;
            this.setTransparent(true);
            if (this.isInAirship()) {
                this.setThrough(true);
            }
            this.vehicle().getOn();
        }
    }
    ;
    updateVehicleGetOff() {
        if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
            this._vehicleGettingOff = false;
            this._vehicleType = 'walk';
            this.setTransparent(false);
        }
    }
    ;
    updateNonmoving(wasMoving) {
        if (!$gameMap.isEventRunning()) {
            if (wasMoving) {
                $gameParty.onPlayerWalk();
                this.checkEventTriggerHere([1, 2]);
                if ($gameMap.setupStartingEvent()) {
                    return;
                }
            }
            if (this.triggerAction()) {
                return;
            }
            if (wasMoving) {
                this.updateEncounterCount();
            }
            else {
                $gameTemp.clearDestination();
            }
        }
    }
    ;
    triggerAction() {
        if (this.canMove()) {
            if (this.triggerButtonAction()) {
                return true;
            }
            if (this.triggerTouchAction()) {
                return true;
            }
        }
        return false;
    }
    ;
    triggerButtonAction() {
        if (Input.isTriggered('ok')) {
            if (this.getOnOffVehicle()) {
                return true;
            }
            this.checkEventTriggerHere([0]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
            this.checkEventTriggerThere([0, 1, 2]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
        }
        return false;
    }
    ;
    triggerTouchAction() {
        if ($gameTemp.isDestinationValid()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            const x3 = $gameMap.roundXWithDirection(x2, direction);
            const y3 = $gameMap.roundYWithDirection(y2, direction);
            const destX = $gameTemp.destinationX();
            const destY = $gameTemp.destinationY();
            if (destX === x1 && destY === y1) {
                return this.triggerTouchActionD1(x1, y1);
            }
            else if (destX === x2 && destY === y2) {
                return this.triggerTouchActionD2(x2, y2);
            }
            else if (destX === x3 && destY === y3) {
                return this.triggerTouchActionD3(x2, y2);
            }
        }
        return false;
    }
    ;
    triggerTouchActionD1(x1, y1) {
        if ($gameMap.airship().pos(x1, y1)) {
            if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerHere([0]);
        return $gameMap.setupStartingEvent();
    }
    ;
    triggerTouchActionD2(x2, y2) {
        if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
            if (TouchInput.isTriggered() && this.getOnVehicle()) {
                return true;
            }
        }
        if (this.isInBoat() || this.isInShip()) {
            if (TouchInput.isTriggered() && this.getOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerThere([0, 1, 2]);
        return $gameMap.setupStartingEvent();
    }
    ;
    triggerTouchActionD3(x2, y2) {
        if ($gameMap.isCounter(x2, y2)) {
            this.checkEventTriggerThere([0, 1, 2]);
        }
        return $gameMap.setupStartingEvent();
    }
    ;
    updateEncounterCount() {
        if (this.canEncounter()) {
            this._encounterCount -= this.encounterProgressValue();
        }
    }
    ;
    canEncounter() {
        return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough());
    }
    ;
    encounterProgressValue() {
        let value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
        if ($gameParty.hasEncounterHalf()) {
            value *= 0.5;
        }
        if (this.isInShip()) {
            value *= 0.5;
        }
        return value;
    }
    ;
    checkEventTriggerHere(triggers) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(this.x, this.y, triggers, false);
        }
    }
    ;
    checkEventTriggerThere(triggers) {
        if (this.canStartLocalEvents()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            this.startMapEvent(x2, y2, triggers, true);
            if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
                const x3 = $gameMap.roundXWithDirection(x2, direction);
                const y3 = $gameMap.roundYWithDirection(y2, direction);
                this.startMapEvent(x3, y3, triggers, true);
            }
        }
    }
    ;
    checkEventTriggerTouch(x, y) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(x, y, [1, 2], true);
        }
    }
    ;
    canStartLocalEvents() {
        return !this.isInAirship();
    }
    ;
    getOnOffVehicle() {
        if (this.isInVehicle()) {
            return this.getOffVehicle();
        }
        else {
            return this.getOnVehicle();
        }
    }
    ;
    getOnVehicle() {
        const direction = this.direction();
        const x1 = this.x;
        const y1 = this.y;
        const x2 = $gameMap.roundXWithDirection(x1, direction);
        const y2 = $gameMap.roundYWithDirection(y1, direction);
        if ($gameMap.airship().pos(x1, y1)) {
            this._vehicleType = 'airship';
        }
        else if ($gameMap.ship().pos(x2, y2)) {
            this._vehicleType = 'ship';
        }
        else if ($gameMap.boat().pos(x2, y2)) {
            this._vehicleType = 'boat';
        }
        if (this.isInVehicle()) {
            this._vehicleGettingOn = true;
            if (!this.isInAirship()) {
                this.forceMoveForward();
            }
            this.gatherFollowers();
        }
        return this._vehicleGettingOn;
    }
    ;
    getOffVehicle() {
        if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
            if (this.isInAirship()) {
                this.setDirection(2);
            }
            this._followers.synchronize(this.x, this.y, this.direction());
            this.vehicle().getOff();
            if (!this.isInAirship()) {
                this.forceMoveForward();
                this.setTransparent(false);
            }
            this._vehicleGettingOff = true;
            this.setMoveSpeed(4);
            this.setThrough(false);
            this.makeEncounterCount();
            this.gatherFollowers();
        }
        return this._vehicleGettingOff;
    }
    ;
    forceMoveForward() {
        this.setThrough(true);
        this.moveForward();
        this.setThrough(false);
    }
    ;
    isOnDamageFloor() {
        return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
    }
    ;
    moveStraight(d) {
        if (this.canPass(this.x, this.y, d)) {
            this._followers.updateMove();
        }
        super.moveStraight(d);
    }
    ;
    moveDiagonally(horz, vert) {
        if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
            this._followers.updateMove();
        }
        super.moveDiagonally(horz, vert);
    }
    ;
    jump(xPlus, yPlus) {
        super.jump(xPlus, yPlus);
        this._followers.jumpAll();
    }
    ;
    showFollowers() {
        this._followers.show();
    }
    ;
    hideFollowers() {
        this._followers.hide();
    }
    ;
    gatherFollowers() {
        this._followers.gather();
    }
    ;
    areFollowersGathering() {
        return this._followers.areGathering();
    }
    ;
    areFollowersGathered() {
        return this._followers.areGathered();
    }
    ;
}



var index$4 = Object.freeze({
	Game_Action: Game_Action,
	Game_ActionResult: Game_ActionResult,
	Game_Actor: Game_Actor,
	Game_Actors: Game_Actors,
	Game_Battler: Game_Battler,
	Game_BattlerBase: Game_BattlerBase,
	Game_Character: Game_Character,
	Game_CharacterBase: Game_CharacterBase,
	Game_CommonEvent: Game_CommonEvent,
	Game_Enemy: Game_Enemy,
	Game_Event: Game_Event,
	Game_Follower: Game_Follower,
	Game_Followers: Game_Followers,
	Game_Interpreter: Game_Interpreter,
	Game_Item: Game_Item,
	Game_Map: Game_Map,
	Game_Message: Game_Message,
	Game_Party: Game_Party,
	Game_Picture: Game_Picture,
	Game_Player: Game_Player,
	Game_Screen: Game_Screen,
	Game_SelfSwitches: Game_SelfSwitches,
	Game_Switches: Game_Switches,
	Game_System: Game_System,
	Game_Temp: Game_Temp,
	Game_Timer: Game_Timer,
	Game_Troop: Game_Troop,
	Game_Unit: Game_Unit,
	Game_Variables: Game_Variables,
	Game_Vehicle: Game_Vehicle
});

//-----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.
class Window_MenuActor extends Window_MenuStatus {
    constructor() {
        super(0, 0);
        this.hide();
    }
    ;
    processOk() {
        if (!this.cursorAll()) {
            $gameParty.setTargetActor($gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    }
    ;
    selectLast() {
        this.select($gameParty.targetActor().index() || 0);
    }
    ;
    selectForItem(item) {
        const actor = $gameParty.menuActor();
        const action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.select(actor.index());
            }
            else {
                this.selectLast();
            }
        }
        else if (action.isForAll()) {
            this.setCursorAll(true);
            this.select(0);
        }
        else {
            this.selectLast();
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ItemCategory
//
// The window for selecting a category of items on the item and shop screens.
class Window_ItemCategory extends Window_HorzCommand {
    constructor() {
        super(0, 0);
    }
    ;
    windowWidth() {
        return Graphics.boxWidth;
    }
    ;
    maxCols() {
        return 4;
    }
    ;
    update() {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.item, 'item');
        this.addCommand(TextManager.weapon, 'weapon');
        this.addCommand(TextManager.armor, 'armor');
        this.addCommand(TextManager.keyItem, 'keyItem');
    }
    ;
    setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
        this.update();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ItemList
//
// The window for selecting an item on the item screen.
class Window_ItemList extends Window_Selectable {
    constructor(x, y, width, height, callback) {
        super(x, y, width, height, callback);
        this._category = 'none';
        this._data = [];
    }
    ;
    setCategory(category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.resetScroll();
        }
    }
    ;
    maxCols() {
        return 2;
    }
    ;
    spacing() {
        return 48;
    }
    ;
    maxItems() {
        return this._data ? this._data.length : 1;
    }
    ;
    item() {
        const index = this.index();
        return this._data && index >= 0 ? this._data[index] : null;
    }
    ;
    isCurrentItemEnabled() {
        return this.isEnabled(this.item());
    }
    ;
    includes(item) {
        switch (this._category) {
            case 'item':
                return DataManager.isItem(item) && item.itypeId === 1;
            case 'weapon':
                return DataManager.isWeapon(item);
            case 'armor':
                return DataManager.isArmor(item);
            case 'keyItem':
                return DataManager.isItem(item) && item.itypeId === 2;
            default:
                return false;
        }
    }
    ;
    needsNumber() {
        return true;
    }
    ;
    isEnabled(item) {
        return $gameParty.canUse(item);
    }
    ;
    makeItemList() {
        this._data = $gameParty.allItems().filter(function (item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    }
    ;
    selectLast() {
        const index = this._data.indexOf($gameParty.lastItem());
        this.select(index >= 0 ? index : 0);
    }
    ;
    drawItem(index) {
        const item = this._data[index];
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }
    ;
    numberWidth() {
        return this.textWidth('000');
    }
    ;
    drawItemNumber(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(':', x, y, width - this.textWidth('00'), 'right');
            this.drawText($gameParty.numItems(item).toString(), x, y, width, 'right');
        }
    }
    ;
    updateHelp() {
        this.setHelpWindowItem(this.item());
    }
    ;
    refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.
class Window_SkillType extends Window_Command {
    constructor() {
        super(...arguments);
        this._actor = null;
    }
    windowWidth() {
        return 240;
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    makeCommandList() {
        if (this._actor) {
            const skillTypes = this._actor.addedSkillTypes();
            skillTypes.sort(function (a, b) {
                return a - b;
            });
            skillTypes.forEach(function (stypeId) {
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, 'skill', true, stypeId);
            }, this);
        }
    }
    ;
    update() {
        super.update();
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    }
    ;
    setSkillWindow(skillWindow) {
        this._skillWindow = skillWindow;
        this.update();
    }
    ;
    selectLast() {
        const skill = this._actor.lastMenuSkill();
        if (skill) {
            this.selectExt(skill.stypeId);
        }
        else {
            this.select(0);
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_SkillStatus
//
// The window for displaying the skill user's status on the skill screen.
class Window_SkillStatus extends Window_Base {
    constructor() {
        super(...arguments);
        this._actor = null;
    }
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }
    ;
    refresh() {
        this.contents.clear();
        if (this._actor) {
            const w = this.width - this.padding * 2;
            const h = this.height - this.padding * 2;
            const y = h / 2 - Window_Base.lineHeight() * 1.5;
            const width = w - 162 - this.textPadding();
            this.drawActorFace(this._actor, 0, 0, 144, h);
            this.drawActorSimpleStatus(this._actor, 162, y, width);
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_SkillList
//
// The window for selecting a skill on the skill screen.
class Window_SkillList extends Window_Selectable {
    constructor() {
        super(...arguments);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
    }
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.resetScroll();
        }
    }
    ;
    setStypeId(stypeId) {
        if (this._stypeId !== stypeId) {
            this._stypeId = stypeId;
            this.refresh();
            this.resetScroll();
        }
    }
    ;
    maxCols() {
        return 2;
    }
    ;
    spacing() {
        return 48;
    }
    ;
    maxItems() {
        return this._data ? this._data.length : 1;
    }
    ;
    item() {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    }
    ;
    isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }
    ;
    includes(item) {
        return item && item.stypeId === this._stypeId;
    }
    ;
    isEnabled(item) {
        return this._actor && this._actor.canUse(item);
    }
    ;
    makeItemList() {
        if (this._actor) {
            this._data = this._actor.skills().filter(function (item) {
                return this.includes(item);
            }, this);
        }
        else {
            this._data = [];
        }
    }
    ;
    selectLast() {
        let skill;
        if ($gameParty.inBattle()) {
            skill = this._actor.lastBattleSkill();
        }
        else {
            skill = this._actor.lastMenuSkill();
        }
        const index = this._data.indexOf(skill);
        this.select(index >= 0 ? index : 0);
    }
    ;
    drawItem(index) {
        const skill = this._data[index];
        if (skill) {
            const costWidth = this.costWidth();
            const rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }
    ;
    costWidth() {
        return this.textWidth('000');
    }
    ;
    drawSkillCost(skill, x, y, width) {
        if (this._actor.skillTpCost(skill) > 0) {
            this.changeTextColor(this.tpCostColor());
            this.drawText(this._actor.skillTpCost(skill).toString(), x, y, width, 'right');
        }
        else if (this._actor.skillMpCost(skill) > 0) {
            this.changeTextColor(this.mpCostColor());
            this.drawText(this._actor.skillMpCost(skill).toString(), x, y, width, 'right');
        }
    }
    ;
    updateHelp() {
        this.setHelpWindowItem(this.item());
    }
    ;
    refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_EquipStatus
//
// The window for displaying parameter changes on the equipment screen.
class Window_EquipStatus extends Window_Base {
    constructor(x, y) {
        super(x, y);
        this._actor = null;
        this._tempActor = null;
        this.refresh();
    }
    ;
    windowWidth() {
        return 312;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    }
    ;
    numVisibleRows() {
        return 7;
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }
    ;
    refresh() {
        this.contents.clear();
        if (this._actor) {
            this.drawActorName(this._actor, this.textPadding(), 0);
            for (let i = 0; i < 6; i++) {
                this.drawItem(0, Window_Base.lineHeight() * (1 + i), 2 + i);
            }
        }
    }
    ;
    setTempActor(tempActor) {
        if (this._tempActor !== tempActor) {
            this._tempActor = tempActor;
            this.refresh();
        }
    }
    ;
    drawItem(x, y, paramId) {
        this.drawParamName(x + this.textPadding(), y, paramId);
        if (this._actor) {
            this.drawCurrentParam(x + 140, y, paramId);
        }
        this.drawRightArrow(x + 188, y);
        if (this._tempActor) {
            this.drawNewParam(x + 222, y, paramId);
        }
    }
    ;
    drawParamName(x, y, paramId) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(paramId), x, y, 120);
    }
    ;
    drawCurrentParam(x, y, paramId) {
        this.resetTextColor();
        this.drawText(this._actor.param(paramId).toString(), x, y, 48, 'right');
    }
    ;
    drawRightArrow(x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText('\u2192', x, y, 32, 'center');
    }
    ;
    drawNewParam(x, y, paramId) {
        const newValue = this._tempActor.param(paramId);
        const diffvalue = newValue - this._actor.param(paramId);
        this.changeTextColor(this.paramchangeTextColor(diffvalue));
        this.drawText(newValue.toString(), x, y, 48, 'right');
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.
class Window_EquipCommand extends Window_HorzCommand {
    constructor(x, y, width) {
        super(x, y, function () {
            this._windowWidth = width;
        });
    }
    ;
    windowWidth() {
        return this._windowWidth;
    }
    ;
    maxCols() {
        return 3;
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.equip2, 'equip');
        this.addCommand(TextManager.optimize, 'optimize');
        this.addCommand(TextManager.clear, 'clear');
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.
class Window_EquipSlot extends Window_Selectable {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this._actor = null;
        this.refresh();
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }
    ;
    update() {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    }
    ;
    maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    }
    ;
    item() {
        return this._actor ? this._actor.equips()[this.index()] : null;
    }
    ;
    drawItem(index) {
        if (this._actor) {
            const rect = this.itemRectForText(index);
            this.changeTextColor(this.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            // this.drawText(this.slotName(index), rect.x, rect.y, 138, Window_Base.lineHeight());
            // (bungcip): changed to make it compile
            this.drawText(this.slotName(index), rect.x, rect.y, 138);
            this.drawItemName(this._actor.equips()[index], rect.x + 138, rect.y);
            this.changePaintOpacity(true);
        }
    }
    ;
    slotName(index) {
        const slots = this._actor.equipSlots();
        return this._actor ? $dataSystem.equipTypes[slots[index]] : '';
    }
    ;
    isEnabled(index) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    }
    ;
    isCurrentItemEnabled() {
        return this.isEnabled(this.index());
    }
    ;
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }
    ;
    setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
        this.update();
    }
    ;
    updateHelp() {
        super.updateHelp();
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setTempActor(null);
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.
class Window_EquipItem extends Window_ItemList {
    constructor() {
        super(...arguments);
        this._actor = null;
        this._slotId = 0;
    }
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.resetScroll();
        }
    }
    ;
    setSlotId(slotId) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.resetScroll();
        }
    }
    ;
    includes(item) {
        if (item === null) {
            return true;
        }
        if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
            return false;
        }
        return this._actor.canEquip(item);
    }
    ;
    isEnabled(item) {
        return true;
    }
    ;
    selectLast() {
    }
    ;
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }
    ;
    updateHelp() {
        super.updateHelp();
        if (this._actor && this._statusWindow) {
            const actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
    }
    ;
    playOkSound() {
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_Status
//
// The window for displaying full status on the status screen.
class Window_Status extends Window_Selectable {
    constructor() {
        super(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._actor = null;
        this.refresh();
        this.activate();
    }
    ;
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }
    ;
    refresh() {
        this.contents.clear();
        if (this._actor) {
            const lineHeight = Window_Base.lineHeight();
            this.drawBlock1(lineHeight * 0);
            this.drawHorzLine(lineHeight * 1);
            this.drawBlock2(lineHeight * 2);
            this.drawHorzLine(lineHeight * 6);
            this.drawBlock3(lineHeight * 7);
            this.drawHorzLine(lineHeight * 13);
            this.drawBlock4(lineHeight * 14);
        }
    }
    ;
    drawBlock1(y) {
        this.drawActorName(this._actor, 6, y);
        this.drawActorClass(this._actor, 192, y);
        this.drawActorNickname(this._actor, 432, y);
    }
    ;
    drawBlock2(y) {
        this.drawActorFace(this._actor, 12, y);
        this.drawBasicInfo(204, y);
        this.drawExpInfo(456, y);
    }
    ;
    drawBlock3(y) {
        this.drawParameters(48, y);
        this.drawEquipments(432, y);
    }
    ;
    drawBlock4(y) {
        this.drawProfile(6, y);
    }
    ;
    drawHorzLine(y) {
        const lineY = y + Window_Base.lineHeight() / 2 - 1;
        this.contents.paintOpacity = 48;
        this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
        this.contents.paintOpacity = 255;
    }
    ;
    lineColor() {
        return this.normalColor();
    }
    ;
    drawBasicInfo(x, y) {
        const lineHeight = Window_Base.lineHeight();
        this.drawActorLevel(this._actor, x, y + lineHeight * 0);
        this.drawActorIcons(this._actor, x, y + lineHeight * 1);
        this.drawActorHp(this._actor, x, y + lineHeight * 2);
        this.drawActorMp(this._actor, x, y + lineHeight * 3);
    }
    ;
    drawParameters(x, y) {
        const lineHeight = Window_Base.lineHeight();
        for (let i = 0; i < 6; i++) {
            const paramId = i + 2;
            const y2 = y + lineHeight * i;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(paramId), x, y2, 160);
            this.resetTextColor();
            this.drawText(this._actor.param(paramId).toString(), x + 160, y2, 60, 'right');
        }
    }
    ;
    drawExpInfo(x, y) {
        const lineHeight = Window_Base.lineHeight();
        const expTotal = TextManager.expTotal.format(TextManager.exp);
        const expNext = TextManager.expNext.format(TextManager.level);
        let value1 = this._actor.currentExp().toString();
        let value2 = this._actor.nextRequiredExp().toString();
        if (this._actor.isMaxLevel()) {
            value1 = '-------';
            value2 = '-------';
        }
        this.changeTextColor(this.systemColor());
        this.drawText(expTotal, x, y + lineHeight * 0, 270);
        this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        this.drawText(value1, x, y + lineHeight * 1, 270, 'right');
        this.drawText(value2, x, y + lineHeight * 3, 270, 'right');
    }
    ;
    drawEquipments(x, y) {
        const equips = this._actor.equips();
        const count = Math.min(equips.length, this.maxEquipmentLines());
        for (let i = 0; i < count; i++) {
            this.drawItemName(equips[i], x, y + Window_Base.lineHeight() * i);
        }
    }
    ;
    drawProfile(x, y) {
        this.drawTextEx(this._actor.profile(), x, y);
    }
    ;
    maxEquipmentLines() {
        return 6;
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_Options
//
// The window for changing various settings on the options screen.
class Window_Options extends Window_Command {
    constructor() {
        super(0, 0);
        this.updatePlacement();
    }
    ;
    windowWidth() {
        return 400;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(Math.min(this.numVisibleRows(), 12));
    }
    ;
    updatePlacement() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = (Graphics.boxHeight - this.height) / 2;
    }
    ;
    makeCommandList() {
        this.addGeneralOptions();
        this.addVolumeOptions();
    }
    ;
    addGeneralOptions() {
        this.addCommand(TextManager.alwaysDash, 'alwaysDash');
        this.addCommand(TextManager.commandRemember, 'commandRemember');
    }
    ;
    addVolumeOptions() {
        this.addCommand(TextManager.bgmVolume, 'bgmVolume');
        this.addCommand(TextManager.bgsVolume, 'bgsVolume');
        this.addCommand(TextManager.meVolume, 'meVolume');
        this.addCommand(TextManager.seVolume, 'seVolume');
    }
    ;
    drawItem(index) {
        const rect = this.itemRectForText(index);
        const statusWidth = this.statusWidth();
        const titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
        this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
    }
    ;
    statusWidth() {
        return 120;
    }
    ;
    statusText(index) {
        const symbol = this.commandSymbol(index);
        const value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        }
        else {
            return this.booleanStatusText(value);
        }
    }
    ;
    isVolumeSymbol(symbol) {
        return symbol.contains('Volume');
    }
    ;
    booleanStatusText(value) {
        return value ? 'ON' : 'OFF';
    }
    ;
    volumeStatusText(value) {
        return value + '%';
    }
    ;
    processOk() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        let value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value += this.volumeOffset();
            if (value > 100) {
                value = 0;
            }
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        }
        else {
            this.changeValue(symbol, !value);
        }
    }
    ;
    cursorRight(wrap) {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        let value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value += this.volumeOffset();
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        }
        else {
            this.changeValue(symbol, true);
        }
    }
    ;
    cursorLeft(wrap) {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        let value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            value -= this.volumeOffset();
            value = value.clamp(0, 100);
            this.changeValue(symbol, value);
        }
        else {
            this.changeValue(symbol, false);
        }
    }
    ;
    volumeOffset() {
        return 20;
    }
    ;
    changeValue(symbol, value) {
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            SoundManager.playCursor();
        }
    }
    ;
    getConfigValue(symbol) {
        return ConfigManager[symbol];
    }
    ;
    setConfigValue(symbol, volume) {
        ConfigManager[symbol] = volume;
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_SavefileList
//
// The window for selecting a save file on the save and load screens.
class Window_SavefileList extends Window_Selectable {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this._mode = null;
        this.activate();
        // this._mode = null;
    }
    ;
    setMode(mode) {
        this._mode = mode;
    }
    ;
    maxItems() {
        return DataManager.maxSavefiles();
    }
    ;
    maxVisibleItems() {
        return 5;
    }
    ;
    itemHeight() {
        const innerHeight = this.height - this.padding * 2;
        return Math.floor(innerHeight / this.maxVisibleItems());
    }
    ;
    drawItem(index) {
        const id = index + 1;
        const valid = DataManager.isThisGameFile(id);
        const info = DataManager.loadSavefileInfo(id);
        const rect = this.itemRectForText(index);
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
    }
    ;
    drawFileId(id, x, y) {
        this.drawText(TextManager.file + ' ' + id, x, y, 180);
    }
    ;
    drawContents(info, rect, valid) {
        const bottom = rect.y + rect.height;
        if (rect.width >= 420) {
            this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
            if (valid) {
                this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
            }
        }
        const lineHeight = Window_Base.lineHeight();
        const y2 = bottom - lineHeight;
        if (y2 >= lineHeight) {
            this.drawPlaytime(info, rect.x, y2, rect.width);
        }
    }
    ;
    drawGameTitle(info, x, y, width) {
        if (info.title) {
            this.drawText(info.title, x, y, width);
        }
    }
    ;
    drawPartyCharacters(info, x, y) {
        if (info.characters) {
            for (let i = 0; i < info.characters.length; i++) {
                const data = info.characters[i];
                this.drawCharacter(data[0], data[1], x + i * 48, y);
            }
        }
    }
    ;
    drawPlaytime(info, x, y, width) {
        if (info.playtime) {
            this.drawText(info.playtime, x, y, width, 'right');
        }
    }
    ;
    playOkSound() {
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.
class Window_ShopCommand extends Window_HorzCommand {
    constructor(width, purchaseOnly) {
        super(0, 0, function () {
            this._windowWidth = width;
            this._purchaseOnly = purchaseOnly;
        });
    }
    ;
    windowWidth() {
        return this._windowWidth;
    }
    ;
    maxCols() {
        return 3;
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.buy, 'buy');
        this.addCommand(TextManager.sell, 'sell', !this._purchaseOnly);
        this.addCommand(TextManager.cancel, 'cancel');
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ShopBuy
//
// The window for selecting an item to buy on the shop screen.
class Window_ShopBuy extends Window_Selectable {
    constructor(x, y, height, shopGoods) {
        super(x, y, undefined, height);
        this._shopGoods = shopGoods;
        this._money = 0;
        this.refresh();
        this.select(0);
    }
    ;
    windowWidth() {
        return 456;
    }
    ;
    maxItems() {
        return this._data ? this._data.length : 1;
    }
    ;
    item() {
        return this._data[this.index()];
    }
    ;
    setMoney(money) {
        this._money = money;
        this.refresh();
    }
    ;
    isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }
    ;
    price(item) {
        return this._price[this._data.indexOf(item)] || 0;
    }
    ;
    isEnabled(item) {
        return (item && this.price(item) <= this._money &&
            !$gameParty.hasMaxItems(item));
    }
    ;
    refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    }
    ;
    makeItemList() {
        this._data = [];
        this._price = [];
        this._shopGoods.forEach(function (goods) {
            let item = null;
            switch (goods[0]) {
                case 0:
                    item = $dataItems[goods[1]];
                    break;
                case 1:
                    item = $dataWeapons[goods[1]];
                    break;
                case 2:
                    item = $dataArmors[goods[1]];
                    break;
            }
            if (item) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
        }, this);
    }
    ;
    drawItem(index) {
        const item = this._data[index];
        const rect = this.itemRect(index);
        const priceWidth = 96;
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
        this.drawText(this.price(item).toString(), rect.x + rect.width - priceWidth, rect.y, priceWidth, 'right');
        this.changePaintOpacity(true);
    }
    ;
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }
    ;
    updateHelp() {
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item());
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.
class Window_ShopSell extends Window_ItemList {
    isEnabled(item) {
        return item && item.price > 0;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Animation
//
// The sprite for displaying an animation.
class Sprite_Animation extends Sprite {
    constructor() {
        super();
        this._reduceArtifacts = true;
        // this._reduceArtifacts = true;
        this.initMembers();
    }
    ;
    initMembers() {
        this._target = null;
        this._animation = null;
        this._mirror = false;
        this._delay = 0;
        this._rate = 4;
        this._duration = 0;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        this._bitmap1 = null;
        this._bitmap2 = null;
        this._cellSprites = [];
        this._screenFlashSprite = null;
        this._duplicated = false;
        this.z = 8;
    }
    ;
    setup(target, animation, mirror, delay) {
        this._target = target;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;
        if (this._animation) {
            this.remove();
            this.setupRate();
            this.setupDuration();
            this.loadBitmaps();
            this.createSprites();
        }
    }
    ;
    remove() {
        if (this.parent && this.parent.removeChild(this)) {
            this._target.setBlendColor([0, 0, 0, 0]);
            this._target.show();
        }
    }
    ;
    setupRate() {
        this._rate = 4;
    }
    ;
    setupDuration() {
        this._duration = this._animation.frames.length * this._rate + 1;
    }
    ;
    update() {
        super.update();
        this.updateMain();
        this.updateFlash();
        this.updateScreenFlash();
        this.updateHiding();
        Sprite_Animation._checker1 = {};
        Sprite_Animation._checker2 = {};
    }
    ;
    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            this._target.setBlendColor(this._flashColor);
        }
    }
    ;
    updateScreenFlash() {
        if (this._screenFlashDuration > 0) {
            const d = this._screenFlashDuration--;
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                this._screenFlashSprite.opacity *= (d - 1) / d;
                this._screenFlashSprite.visible = (this._screenFlashDuration > 0);
            }
        }
    }
    ;
    absoluteX() {
        let x = 0;
        let object = this;
        while (object) {
            x += object.x;
            object = object.parent;
        }
        return x;
    }
    ;
    absoluteY() {
        let y = 0;
        let object = this;
        while (object) {
            y += object.y;
            object = object.parent;
        }
        return y;
    }
    ;
    updateHiding() {
        if (this._hidingDuration > 0) {
            this._hidingDuration--;
            if (this._hidingDuration === 0) {
                this._target.show();
            }
        }
    }
    ;
    isPlaying() {
        return this._duration > 0;
    }
    ;
    loadBitmaps() {
        const name1 = this._animation.animation1Name;
        const name2 = this._animation.animation2Name;
        const hue1 = this._animation.animation1Hue;
        const hue2 = this._animation.animation2Hue;
        this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
        this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
    }
    ;
    isReady() {
        return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
    }
    ;
    createSprites() {
        if (!Sprite_Animation._checker2[this._animation]) {
            this.createCellSprites();
            if (this._animation.position === 3) {
                Sprite_Animation._checker2[this._animation] = true;
            }
            this.createScreenFlashSprite();
        }
        if (Sprite_Animation._checker1[this._animation]) {
            this._duplicated = true;
        }
        else {
            this._duplicated = false;
            if (this._animation.position === 3) {
                Sprite_Animation._checker1[this._animation] = true;
            }
        }
    }
    ;
    createCellSprites() {
        this._cellSprites = [];
        for (let i = 0; i < 16; i++) {
            const sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this._cellSprites.push(sprite);
            this.addChild(sprite);
        }
    }
    ;
    createScreenFlashSprite() {
        this._screenFlashSprite = new ScreenSprite();
        this.addChild(this._screenFlashSprite);
    }
    ;
    updateMain() {
        if (this.isPlaying() && this.isReady()) {
            if (this._delay > 0) {
                this._delay--;
            }
            else {
                this._duration--;
                this.updatePosition();
                if (this._duration % this._rate === 0) {
                    this.updateFrame();
                }
            }
        }
    }
    ;
    updatePosition() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;
        }
        else {
            const parent = this._target.parent;
            const grandparent = parent ? parent.parent : null;
            this.x = this._target.x;
            this.y = this._target.y;
            if (this.parent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
            if (this._animation.position === 0) {
                this.y -= this._target.height;
            }
            else if (this._animation.position === 1) {
                this.y -= this._target.height / 2;
            }
        }
    }
    ;
    updateFrame() {
        if (this._duration > 0) {
            const frameIndex = this.currentFrameIndex();
            this.updateAllCellSprites(this._animation.frames[frameIndex]);
            this._animation.timings.forEach(function (timing) {
                if (timing.frame === frameIndex) {
                    this.processTimingData(timing);
                }
            }, this);
        }
    }
    ;
    currentFrameIndex() {
        return (this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate));
    }
    ;
    updateAllCellSprites(frame) {
        for (let i = 0; i < this._cellSprites.length; i++) {
            const sprite = this._cellSprites[i];
            if (i < frame.length) {
                this.updateCellSprite(sprite, frame[i]);
            }
            else {
                sprite.visible = false;
            }
        }
    }
    ;
    updateCellSprite(sprite, cell) {
        const pattern = cell[0];
        if (pattern >= 0) {
            const sx = pattern % 5 * 192;
            const sy = Math.floor(pattern % 100 / 5) * 192;
            const mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setFrame(sx, sy, 192, 192);
            sprite.x = cell[1];
            sprite.y = cell[2];
            sprite.rotation = cell[4] * Math.PI / 180;
            sprite.scale.x = cell[3] / 100;
            if (cell[5]) {
                sprite.scale.x *= -1;
            }
            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }
            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        }
        else {
            sprite.visible = false;
        }
    }
    ;
    processTimingData(timing) {
        const duration = timing.flashDuration * this._rate;
        switch (timing.flashScope) {
            case 1:
                this.startFlash(timing.flashColor, duration);
                break;
            case 2:
                this.startScreenFlash(timing.flashColor, duration);
                break;
            case 3:
                this.startHiding(duration);
                break;
        }
        if (!this._duplicated && timing.se) {
            AudioManager.playSe(timing.se);
        }
    }
    ;
    startFlash(color, duration) {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    }
    ;
    startScreenFlash(color, duration) {
        this._screenFlashDuration = duration;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.setColor(color[0], color[1], color[2]);
            this._screenFlashSprite.opacity = color[3];
        }
    }
    ;
    startHiding(duration) {
        this._hidingDuration = duration;
        this._target.hide();
    }
    ;
}
Sprite_Animation._checker1 = {};
Sprite_Animation._checker2 = {};

//-----------------------------------------------------------------------------
// Sprite_Base
//
// The sprite class with a feature which displays animations.
class Sprite_Base extends Sprite {
    constructor() {
        super(...arguments);
        this._animationSprites = [];
        this._effectTarget = this;
        this._hiding = false;
    }
    update() {
        super.update();
        this.updateVisibility();
        this.updateAnimationSprites();
    }
    ;
    hide() {
        this._hiding = true;
        this.updateVisibility();
    }
    ;
    show() {
        this._hiding = false;
        this.updateVisibility();
    }
    ;
    updateVisibility() {
        this.visible = !this._hiding;
    }
    ;
    updateAnimationSprites() {
        if (this._animationSprites.length > 0) {
            const sprites = this._animationSprites.clone();
            this._animationSprites = [];
            for (let i = 0; i < sprites.length; i++) {
                const sprite = sprites[i];
                if (sprite.isPlaying()) {
                    this._animationSprites.push(sprite);
                }
                else {
                    sprite.remove();
                }
            }
        }
    }
    ;
    startAnimation(animation, mirror, delay) {
        const sprite = new Sprite_Animation();
        sprite.setup(this._effectTarget, animation, mirror, delay);
        this.parent.addChild(sprite);
        this._animationSprites.push(sprite);
    }
    ;
    isAnimationPlaying() {
        return this._animationSprites.length > 0;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.
class Sprite_Button extends Sprite {
    constructor() {
        super(...arguments);
        this._touching = false;
        this._coldFrame = null;
        this._hotFrame = null;
        this._clickHandler = null;
    }
    update() {
        super.update();
        this.updateFrame();
        this.processTouch();
    }
    ;
    updateFrame() {
        let frame;
        if (this._touching) {
            frame = this._hotFrame;
        }
        else {
            frame = this._coldFrame;
        }
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    }
    ;
    setColdFrame(x, y, width, height) {
        this._coldFrame = new PIXI.Rectangle(x, y, width, height);
    }
    ;
    setHotFrame(x, y, width, height) {
        this._hotFrame = new PIXI.Rectangle(x, y, width, height);
    }
    ;
    setClickHandler(method) {
        this._clickHandler = method;
    }
    ;
    callClickHandler() {
        if (this._clickHandler) {
            this._clickHandler();
        }
    }
    ;
    processTouch() {
        if (this.isActive()) {
            if (TouchInput.isTriggered() && this.isButtonTouched()) {
                this._touching = true;
            }
            if (this._touching) {
                if (TouchInput.isReleased() || !this.isButtonTouched()) {
                    this._touching = false;
                    if (TouchInput.isReleased()) {
                        this.callClickHandler();
                    }
                }
            }
        }
        else {
            this._touching = false;
        }
    }
    ;
    isActive() {
        let node = this;
        while (node) {
            if (!node.visible) {
                return false;
            }
            node = node.parent;
        }
        return true;
    }
    ;
    isButtonTouched() {
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    ;
    canvasToLocalX(x) {
        let node = this;
        while (node) {
            x -= node.x;
            node = node.parent;
        }
        return x;
    }
    ;
    canvasToLocalY(y) {
        let node = this;
        while (node) {
            y -= node.y;
            node = node.parent;
        }
        return y;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Balloon
//
// The sprite for displaying a balloon icon.
class Sprite_Balloon extends Sprite_Base {
    constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    }
    ;
    initMembers() {
        this._balloonId = 0;
        this._duration = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.z = 7;
    }
    ;
    loadBitmap() {
        this.bitmap = ImageManager.loadSystem('Balloon');
        this.setFrame(0, 0, 0, 0);
    }
    ;
    setup(balloonId) {
        this._balloonId = balloonId;
        this._duration = 8 * this.speed() + this.waitTime();
    }
    ;
    update() {
        super.update();
        if (this._duration > 0) {
            this._duration--;
            if (this._duration > 0) {
                this.updateFrame();
            }
        }
    }
    ;
    updateFrame() {
        const w = 48;
        const h = 48;
        const sx = this.frameIndex() * w;
        const sy = (this._balloonId - 1) * h;
        this.setFrame(sx, sy, w, h);
    }
    ;
    speed() {
        return 8;
    }
    ;
    waitTime() {
        return 12;
    }
    ;
    frameIndex() {
        const index = (this._duration - this.waitTime()) / this.speed();
        return 7 - Math.max(Math.floor(index), 0);
    }
    ;
    isPlaying() {
        return this._duration > 0;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.
class Sprite_Character extends Sprite_Base {
    constructor(character) {
        super();
        this.initMembers();
        this.setCharacter(character);
    }
    ;
    initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._character = null;
        this._balloonDuration = 0;
        this._tilesetId = 0;
        this._upperBody = null;
        this._lowerBody = null;
    }
    ;
    setCharacter(character) {
        this._character = character;
    }
    ;
    update() {
        super.update();
        this.updateBitmap();
        this.updateFrame();
        this.updatePosition();
        this.updateAnimation();
        this.updateBalloon();
        this.updateOther();
    }
    ;
    updateVisibility() {
        super.updateVisibility();
        if (this._character.isTransparent()) {
            this.visible = false;
        }
    }
    ;
    isTile() {
        /// bungcip: change it to make it compile
        return this._character.tileId() > 0;
    }
    ;
    tilesetBitmap(tileId) {
        const tileset = $gameMap.tileset();
        const setNumber = 5 + Math.floor(tileId / 256);
        return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
    }
    ;
    updateBitmap() {
        if (this.isImageChanged()) {
            this._tilesetId = $gameMap.tilesetId();
            this._tileId = this._character.tileId();
            this._characterName = this._character.characterName();
            this._characterIndex = this._character.characterIndex();
            if (this._tileId > 0) {
                this.setTileBitmap();
            }
            else {
                this.setCharacterBitmap();
            }
        }
    }
    ;
    isImageChanged() {
        return (this._tilesetId !== $gameMap.tilesetId() ||
            this._tileId !== this._character.tileId() ||
            this._characterName !== this._character.characterName() ||
            this._characterIndex !== this._character.characterIndex());
    }
    ;
    setTileBitmap() {
        this.bitmap = this.tilesetBitmap(this._tileId);
    }
    ;
    setCharacterBitmap() {
        this.bitmap = ImageManager.loadCharacter(this._characterName);
        this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
    }
    ;
    updateFrame() {
        if (this._tileId > 0) {
            this.updateTileFrame();
        }
        else {
            this.updateCharacterFrame();
        }
    }
    ;
    updateTileFrame() {
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = (Math.floor(this._tileId / 128) % 2 * 8 + this._tileId % 8) * pw;
        const sy = Math.floor(this._tileId % 256 / 8) % 16 * ph;
        this.setFrame(sx, sy, pw, ph);
    }
    ;
    updateCharacterFrame() {
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
        const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
        this.updateHalfBodySprites();
        if (this._bushDepth > 0) {
            const d = this._bushDepth;
            this._upperBody.setFrame(sx, sy, pw, ph - d);
            this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
            this.setFrame(sx, sy, 0, ph);
        }
        else {
            this.setFrame(sx, sy, pw, ph);
        }
    }
    ;
    characterBlockX() {
        if (this._isBigCharacter) {
            return 0;
        }
        else {
            const index = this._character.characterIndex();
            return index % 4 * 3;
        }
    }
    ;
    characterBlockY() {
        if (this._isBigCharacter) {
            return 0;
        }
        else {
            const index = this._character.characterIndex();
            return Math.floor(index / 4) * 4;
        }
    }
    ;
    characterPatternX() {
        return this._character.pattern();
    }
    ;
    characterPatternY() {
        return (this._character.direction() - 2) / 2;
    }
    ;
    patternWidth() {
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        }
        else if (this._isBigCharacter) {
            return this.bitmap.width / 3;
        }
        else {
            return this.bitmap.width / 12;
        }
    }
    ;
    patternHeight() {
        if (this._tileId > 0) {
            return $gameMap.tileHeight();
        }
        else if (this._isBigCharacter) {
            return this.bitmap.height / 4;
        }
        else {
            return this.bitmap.height / 8;
        }
    }
    ;
    updateHalfBodySprites() {
        if (this._bushDepth > 0) {
            this.createHalfBodySprites();
            this._upperBody.bitmap = this.bitmap;
            this._upperBody.visible = true;
            this._upperBody.y = -this._bushDepth;
            this._lowerBody.bitmap = this.bitmap;
            this._lowerBody.visible = true;
            this._upperBody.setBlendColor(this.getBlendColor());
            this._lowerBody.setBlendColor(this.getBlendColor());
            this._upperBody.setColorTone(this.getColorTone());
            this._lowerBody.setColorTone(this.getColorTone());
        }
        else if (this._upperBody) {
            this._upperBody.visible = false;
            this._lowerBody.visible = false;
        }
    }
    ;
    createHalfBodySprites() {
        if (!this._upperBody) {
            this._upperBody = new Sprite();
            this._upperBody.anchor.x = 0.5;
            this._upperBody.anchor.y = 1;
            this.addChild(this._upperBody);
        }
        if (!this._lowerBody) {
            this._lowerBody = new Sprite();
            this._lowerBody.anchor.x = 0.5;
            this._lowerBody.anchor.y = 1;
            this._lowerBody.opacity = 128;
            this.addChild(this._lowerBody);
        }
    }
    ;
    updatePosition() {
        this.x = this._character.screenX();
        this.y = this._character.screenY();
        this.z = this._character.screenZ();
    }
    ;
    updateAnimation() {
        this.setupAnimation();
        if (!this.isAnimationPlaying()) {
            this._character.endAnimation();
        }
        if (!this.isBalloonPlaying()) {
            this._character.endBalloon();
        }
    }
    ;
    updateOther() {
        this.opacity = this._character.opacity();
        this.blendMode = this._character.blendMode();
        this._bushDepth = this._character.bushDepth();
    }
    ;
    setupAnimation() {
        if (this._character.animationId() > 0) {
            const animation = $dataAnimations[this._character.animationId()];
            this.startAnimation(animation, false, 0);
            this._character.startAnimation();
        }
    }
    ;
    setupBalloon() {
        if (this._character.balloonId() > 0) {
            this.startBalloon();
            this._character.startBalloon();
        }
    }
    ;
    startBalloon() {
        if (!this._balloonSprite) {
            this._balloonSprite = new Sprite_Balloon();
        }
        this._balloonSprite.setup(this._character.balloonId());
        this.parent.addChild(this._balloonSprite);
    }
    ;
    updateBalloon() {
        this.setupBalloon();
        if (this._balloonSprite) {
            this._balloonSprite.x = this.x;
            this._balloonSprite.y = this.y - this.height;
            if (!this._balloonSprite.isPlaying()) {
                this.endBalloon();
            }
        }
    }
    ;
    endBalloon() {
        if (this._balloonSprite) {
            this.parent.removeChild(this._balloonSprite);
            this._balloonSprite = null;
        }
    }
    ;
    isBalloonPlaying() {
        return !!this._balloonSprite;
    }
    ;
}

class Sprite_Damage extends Sprite {
    constructor() {
        super();
        this._duration = 90;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        // this._duration = 90;
        // this._flashColor = [0, 0, 0, 0];
        // this._flashDuration = 0;
        this._damageBitmap = ImageManager.loadSystem('Damage');
    }
    ;
    setup(target) {
        const result = target.result();
        if (result.missed || result.evaded) {
            this.createMiss();
        }
        else if (result.hpAffected) {
            this.createDigits(0, result.hpDamage);
        }
        else if (target.isAlive() && result.mpDamage !== 0) {
            this.createDigits(2, result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    }
    ;
    setupCriticalEffect() {
        this._flashColor = [255, 0, 0, 160];
        this._flashDuration = 60;
    }
    ;
    digitWidth() {
        return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
    }
    ;
    digitHeight() {
        return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
    }
    ;
    createMiss() {
        const w = this.digitWidth();
        const h = this.digitHeight();
        const sprite = this.createChildSprite();
        sprite.setFrame(0, 4 * h, 4 * w, h);
        sprite['dy'] = 0; // bungcip: changed to make it compile
    }
    ;
    createDigits(baseRow, value) {
        const string = Math.abs(value).toString();
        const row = baseRow + (value < 0 ? 1 : 0);
        const w = this.digitWidth();
        const h = this.digitHeight();
        for (let i = 0; i < string.length; i++) {
            const sprite = this.createChildSprite();
            const n = Number(string[i]);
            sprite.setFrame(n * w, row * h, w, h);
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite['dy'] = -i; // bungcip: changed to make it compile
        }
    }
    ;
    createChildSprite() {
        const sprite = new Sprite();
        sprite.bitmap = this._damageBitmap;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        this.addChild(sprite);
        return sprite;
    }
    ;
    update() {
        super.update();
        if (this._duration > 0) {
            this._duration--;
            for (let i = 0; i < this.children.length; i++) {
                this.updateChild(this.children[i]);
            }
        }
        this.updateFlash();
        this.updateOpacity();
    }
    ;
    updateChild(sprite) {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    }
    ;
    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    }
    ;
    updateOpacity() {
        if (this._duration < 10) {
            this.opacity = 255 * this._duration / 10;
        }
    }
    ;
    isPlaying() {
        return this._duration > 0;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.
class Sprite_Battler extends Sprite_Base {
    constructor(battler) {
        super();
        this.initMembers();
        this.setBattler(battler);
    }
    ;
    initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._battler = null;
        this._damages = [];
        this._homeX = 0;
        this._homeY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._targetOffsetX = NaN;
        this._targetOffsetY = NaN;
        this._movementDuration = 0;
        this._selectionEffectCount = 0;
    }
    ;
    setBattler(battler) {
        this._battler = battler;
    }
    ;
    setHome(x, y) {
        this._homeX = x;
        this._homeY = y;
        this.updatePosition();
    }
    ;
    update() {
        super.update();
        if (this._battler) {
            this.updateMain();
            this.updateAnimation();
            this.updateDamagePopup();
            this.updateSelectionEffect();
        }
        else {
            this.bitmap = null;
        }
    }
    ;
    updateVisibility() {
        super.updateVisibility();
        if (!this._battler || !this._battler.isSpriteVisible()) {
            this.visible = false;
        }
    }
    ;
    updateMain() {
        if (this._battler.isSpriteVisible()) {
            this.updateBitmap();
            this.updateFrame();
        }
        this.updateMove();
        this.updatePosition();
    }
    ;
    updateBitmap() {
    }
    ;
    updateFrame() {
    }
    ;
    updateMove() {
        if (this._movementDuration > 0) {
            const d = this._movementDuration;
            this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
            this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
            this._movementDuration--;
            if (this._movementDuration === 0) {
                this.onMoveEnd();
            }
        }
    }
    ;
    updatePosition() {
        this.x = this._homeX + this._offsetX;
        this.y = this._homeY + this._offsetY;
    }
    ;
    updateAnimation() {
        this.setupAnimation();
    }
    ;
    updateDamagePopup() {
        this.setupDamagePopup();
        if (this._damages.length > 0) {
            for (let i = 0; i < this._damages.length; i++) {
                this._damages[i].update();
            }
            if (!this._damages[0].isPlaying()) {
                this.parent.removeChild(this._damages[0]);
                this._damages.shift();
            }
        }
    }
    ;
    updateSelectionEffect() {
        const target = this._effectTarget;
        if (this._battler.isSelected()) {
            this._selectionEffectCount++;
            if (this._selectionEffectCount % 30 < 15) {
                target.setBlendColor([255, 255, 255, 64]);
            }
            else {
                target.setBlendColor([0, 0, 0, 0]);
            }
        }
        else if (this._selectionEffectCount > 0) {
            this._selectionEffectCount = 0;
            target.setBlendColor([0, 0, 0, 0]);
        }
    }
    ;
    setupAnimation() {
        while (this._battler.isAnimationRequested()) {
            const data = this._battler.shiftAnimation();
            const animation = $dataAnimations[data.animationId];
            const mirror = data.mirror;
            const delay = animation.position === 3 ? 0 : data.delay;
            this.startAnimation(animation, mirror, delay);
            for (let i = 0; i < this._animationSprites.length; i++) {
                const sprite = this._animationSprites[i];
                sprite.visible = this._battler.isSpriteVisible();
            }
        }
    }
    ;
    setupDamagePopup() {
        if (this._battler.isDamagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                const sprite = new Sprite_Damage();
                sprite.x = this.x + this.damageOffsetX();
                sprite.y = this.y + this.damageOffsetY();
                sprite.setup(this._battler);
                this._damages.push(sprite);
                this.parent.addChild(sprite);
            }
            this._battler.clearDamagePopup();
            this._battler.clearResult();
        }
    }
    ;
    damageOffsetX() {
        return 0;
    }
    ;
    damageOffsetY() {
        return 0;
    }
    ;
    startMove(x, y, duration) {
        if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
            this._targetOffsetX = x;
            this._targetOffsetY = y;
            this._movementDuration = duration;
            if (duration === 0) {
                this._offsetX = x;
                this._offsetY = y;
            }
        }
    }
    ;
    onMoveEnd() {
    }
    ;
    isEffecting() {
        return false;
    }
    ;
    isMoving() {
        return this._movementDuration > 0;
    }
    ;
    inHomePosition() {
        return this._offsetX === 0 && this._offsetY === 0;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Weapon
//
// The sprite for displaying a weapon image for attacking.
class Sprite_Weapon extends Sprite_Base {
    constructor() {
        super();
        this.initMembers();
    }
    ;
    initMembers() {
        this._weaponImageId = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.x = -16;
    }
    ;
    setup(weaponImageId) {
        this._weaponImageId = weaponImageId;
        this._animationCount = 0;
        this._pattern = 0;
        this.loadBitmap();
        this.updateFrame();
    }
    ;
    update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }
    ;
    animationWait() {
        return 12;
    }
    ;
    updatePattern() {
        this._pattern++;
        if (this._pattern >= 3) {
            this._weaponImageId = 0;
        }
    }
    ;
    loadBitmap() {
        const pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
        if (pageId >= 1) {
            this.bitmap = ImageManager.loadSystem('Weapons' + pageId);
        }
        else {
            this.bitmap = ImageManager.loadSystem('');
        }
    }
    ;
    updateFrame() {
        if (this._weaponImageId > 0) {
            const index = (this._weaponImageId - 1) % 12;
            const w = 96;
            const h = 64;
            const sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
            const sy = Math.floor(index % 6) * h;
            this.setFrame(sx, sy, w, h);
        }
        else {
            this.setFrame(0, 0, 0, 0);
        }
    }
    ;
    isPlaying() {
        return this._weaponImageId > 0;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.
class Sprite_StateOverlay extends Sprite_Base {
    constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    }
    ;
    initMembers() {
        this._battler = null;
        this._overlayIndex = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }
    ;
    loadBitmap() {
        this.bitmap = ImageManager.loadSystem('States');
        this.setFrame(0, 0, 0, 0);
    }
    ;
    setup(battler) {
        this._battler = battler;
    }
    ;
    update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }
    ;
    animationWait() {
        return 8;
    }
    ;
    updatePattern() {
        this._pattern++;
        this._pattern %= 8;
        if (this._battler) {
            this._overlayIndex = this._battler.stateOverlayIndex();
        }
    }
    ;
    updateFrame() {
        if (this._overlayIndex > 0) {
            const w = 96;
            const h = 96;
            const sx = this._pattern * w;
            const sy = (this._overlayIndex - 1) * h;
            this.setFrame(sx, sy, w, h);
        }
        else {
            this.setFrame(0, 0, 0, 0);
        }
    }
    ;
}

class Sprite_Actor extends Sprite_Battler {
    constructor(battler) {
        super(battler);
        this._battlerName = '';
        this._motion = null;
        this._motionCount = 0;
        this._pattern = 0;
        this.moveToStartPosition();
    }
    ;
    initMembers() {
        super.initMembers();
        this.createShadowSprite();
        this.createWeaponSprite();
        this.createMainSprite();
        this.createStateSprite();
    }
    ;
    createMainSprite() {
        this._mainSprite = new Sprite_Base();
        this._mainSprite.anchor.x = 0.5;
        this._mainSprite.anchor.y = 1;
        this.addChild(this._mainSprite);
        this._effectTarget = this._mainSprite;
    }
    ;
    createShadowSprite() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow2');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 0.5;
        this._shadowSprite.y = -2;
        this.addChild(this._shadowSprite);
    }
    ;
    createWeaponSprite() {
        this._weaponSprite = new Sprite_Weapon();
        this.addChild(this._weaponSprite);
    }
    ;
    createStateSprite() {
        this._stateSprite = new Sprite_StateOverlay();
        this.addChild(this._stateSprite);
    }
    ;
    setBattler(battler) {
        super.setBattler(battler);
        const changed = (battler !== this._actor);
        if (changed) {
            this._actor = battler;
            if (battler) {
                this.setActorHome(battler.index());
            }
            this.startEntryMotion();
            this._stateSprite.setup(battler);
        }
    }
    ;
    moveToStartPosition() {
        this.startMove(300, 0, 0);
    }
    ;
    setActorHome(index) {
        this.setHome(600 + index * 32, 280 + index * 48);
    }
    ;
    update() {
        super.update();
        this.updateShadow();
        if (this._actor) {
            this.updateMotion();
        }
    }
    ;
    updateShadow() {
        this._shadowSprite.visible = !!this._actor;
    }
    ;
    updateMain() {
        super.updateMain();
        if (this._actor.isSpriteVisible() && !this.isMoving()) {
            this.updateTargetPosition();
        }
    }
    ;
    setupMotion() {
        if (this._actor.isMotionRequested()) {
            this.startMotion(this._actor.motionType());
            this._actor.clearMotion();
        }
    }
    ;
    setupWeaponAnimation() {
        if (this._actor.isWeaponAnimationRequested()) {
            this._weaponSprite.setup(this._actor.weaponImageId());
            this._actor.clearWeaponAnimation();
        }
    }
    ;
    startMotion(motionType) {
        const newMotion = Sprite_Actor.MOTIONS[motionType];
        if (this._motion !== newMotion) {
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    }
    ;
    updateTargetPosition() {
        if (this._actor.isInputting() || this._actor.isActing()) {
            this.stepForward();
        }
        else if (this._actor.canMove() && BattleManager.isEscaped()) {
            this.retreat();
        }
        else if (!this.inHomePosition()) {
            this.stepBack();
        }
    }
    ;
    updateBitmap() {
        super.updateBitmap();
        const name = this._actor.battlerName();
        if (this._battlerName !== name) {
            this._battlerName = name;
            this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        }
    }
    ;
    updateFrame() {
        super.updateFrame();
        const bitmap = this._mainSprite.bitmap;
        if (bitmap) {
            const motionIndex = this._motion ? this._motion.index : 0;
            const pattern = this._pattern < 3 ? this._pattern : 1;
            const cw = bitmap.width / 9;
            const ch = bitmap.height / 6;
            const cx = Math.floor(motionIndex / 6) * 3 + pattern;
            const cy = motionIndex % 6;
            this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
        }
    }
    ;
    updateMove() {
        const bitmap = this._mainSprite.bitmap;
        if (!bitmap || bitmap.isReady()) {
            super.updateMove();
        }
    }
    ;
    updateMotion() {
        this.setupMotion();
        this.setupWeaponAnimation();
        if (this._actor.isMotionRefreshRequested()) {
            this.refreshMotion();
            this._actor.clearMotion();
        }
        this.updateMotionCount();
    }
    ;
    updateMotionCount() {
        if (this._motion && ++this._motionCount >= this.motionSpeed()) {
            if (this._motion.loop) {
                this._pattern = (this._pattern + 1) % 4;
            }
            else if (this._pattern < 2) {
                this._pattern++;
            }
            else {
                this.refreshMotion();
            }
            this._motionCount = 0;
        }
    }
    ;
    motionSpeed() {
        return 12;
    }
    ;
    refreshMotion() {
        const actor = this._actor;
        const motionGuard = Sprite_Actor.MOTIONS['guard'];
        if (actor) {
            if (this._motion === motionGuard && !BattleManager.isInputting()) {
                return;
            }
            const stateMotion = actor.stateMotionIndex();
            if (actor.isInputting() || actor.isActing()) {
                this.startMotion('walk');
            }
            else if (stateMotion === 3) {
                this.startMotion('dead');
            }
            else if (stateMotion === 2) {
                this.startMotion('sleep');
            }
            else if (actor.isChanting()) {
                this.startMotion('chant');
            }
            else if (actor.isGuard() || actor.isGuardWaiting()) {
                this.startMotion('guard');
            }
            else if (stateMotion === 1) {
                this.startMotion('abnormal');
            }
            else if (actor.isDying()) {
                this.startMotion('dying');
            }
            else if (actor.isUndecided()) {
                this.startMotion('walk');
            }
            else {
                this.startMotion('wait');
            }
        }
    }
    ;
    startEntryMotion() {
        if (this._actor && this._actor.canMove()) {
            this.startMotion('walk');
            this.startMove(0, 0, 30);
        }
        else if (!this.isMoving()) {
            this.refreshMotion();
            this.startMove(0, 0, 0);
        }
    }
    ;
    stepForward() {
        this.startMove(-48, 0, 12);
    }
    ;
    stepBack() {
        this.startMove(0, 0, 12);
    }
    ;
    retreat() {
        this.startMove(300, 0, 30);
    }
    ;
    onMoveEnd() {
        super.onMoveEnd();
        if (!BattleManager.isBattleEnd()) {
            this.refreshMotion();
        }
    }
    ;
    damageOffsetX() {
        return -32;
    }
    ;
    damageOffsetY() {
        return 0;
    }
    ;
}
Sprite_Actor.MOTIONS = {
    walk: { index: 0, loop: true },
    wait: { index: 1, loop: true },
    chant: { index: 2, loop: true },
    guard: { index: 3, loop: true },
    damage: { index: 4, loop: false },
    evade: { index: 5, loop: false },
    thrust: { index: 6, loop: false },
    swing: { index: 7, loop: false },
    missile: { index: 8, loop: false },
    skill: { index: 9, loop: false },
    spell: { index: 10, loop: false },
    item: { index: 11, loop: false },
    escape: { index: 12, loop: true },
    victory: { index: 13, loop: true },
    dying: { index: 14, loop: true },
    abnormal: { index: 15, loop: true },
    sleep: { index: 16, loop: true },
    dead: { index: 17, loop: true }
};

//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.
class Sprite_StateIcon extends Sprite {
    constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    }
    ;
    initMembers() {
        this._battler = null;
        this._iconIndex = 0;
        this._animationCount = 0;
        this._animationIndex = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }
    ;
    loadBitmap() {
        this.bitmap = ImageManager.loadSystem('IconSet');
        this.setFrame(0, 0, 0, 0);
    }
    ;
    setup(battler) {
        this._battler = battler;
    }
    ;
    update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this.updateFrame();
            this._animationCount = 0;
        }
    }
    ;
    animationWait() {
        return 40;
    }
    ;
    updateIcon() {
        let icons = [];
        if (this._battler && this._battler.isAlive()) {
            icons = this._battler.allIcons();
        }
        if (icons.length > 0) {
            this._animationIndex++;
            if (this._animationIndex >= icons.length) {
                this._animationIndex = 0;
            }
            this._iconIndex = icons[this._animationIndex];
        }
        else {
            this._animationIndex = 0;
            this._iconIndex = 0;
        }
    }
    ;
    updateFrame() {
        const pw = Sprite_StateIcon._iconWidth;
        const ph = Sprite_StateIcon._iconHeight;
        const sx = this._iconIndex % 16 * pw;
        const sy = Math.floor(this._iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }
    ;
}
Sprite_StateIcon._iconWidth = 32;
Sprite_StateIcon._iconHeight = 32;

//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.
class Sprite_Enemy extends Sprite_Battler {
    initMembers() {
        super.initMembers();
        this._enemy = null;
        this._appeared = false;
        this._battlerName = '';
        this._battlerHue = 0;
        this._effectType = null;
        this._effectDuration = 0;
        this._shake = 0;
        this.createStateIconSprite();
    }
    ;
    createStateIconSprite() {
        this._stateIconSprite = new Sprite_StateIcon();
        this.addChild(this._stateIconSprite);
    }
    ;
    setBattler(battler) {
        super.setBattler(battler);
        this._enemy = battler;
        this.setHome(battler.screenX(), battler.screenY());
        this._stateIconSprite.setup(battler);
    }
    ;
    update() {
        super.update();
        if (this._enemy) {
            this.updateEffect();
            this.updateStateSprite();
        }
    }
    ;
    updateBitmap() {
        super.updateBitmap();
        const name = this._enemy.battlerName();
        const hue = this._enemy.battlerHue();
        if (this._battlerName !== name || this._battlerHue !== hue) {
            this._battlerName = name;
            this._battlerHue = hue;
            this.loadBitmap(name, hue);
            this.initVisibility();
        }
    }
    ;
    loadBitmap(name, hue) {
        if ($gameSystem.isSideView()) {
            this.bitmap = ImageManager.loadSvEnemy(name, hue);
        }
        else {
            this.bitmap = ImageManager.loadEnemy(name, hue);
        }
    }
    ;
    updateFrame() {
        super.updateFrame();
        let frameHeight = this.bitmap.height;
        if (this._effectType === 'bossCollapse') {
            frameHeight = this._effectDuration;
        }
        this.setFrame(0, 0, this.bitmap.width, frameHeight);
    }
    ;
    updatePosition() {
        super.updatePosition();
        this.x += this._shake;
    }
    ;
    updateStateSprite() {
        this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
        if (this._stateIconSprite.y < 20 - this.y) {
            this._stateIconSprite.y = 20 - this.y;
        }
    }
    ;
    initVisibility() {
        this._appeared = this._enemy.isAlive();
        if (!this._appeared) {
            this.opacity = 0;
        }
    }
    ;
    setupEffect() {
        if (this._appeared && this._enemy.isEffectRequested()) {
            this.startEffect(this._enemy.effectType());
            this._enemy.clearEffect();
        }
        if (!this._appeared && this._enemy.isAlive()) {
            this.startEffect('appear');
        }
        else if (this._appeared && this._enemy.isHidden()) {
            this.startEffect('disappear');
        }
    }
    ;
    startEffect(effectType) {
        this._effectType = effectType;
        switch (this._effectType) {
            case 'appear':
                this.startAppear();
                break;
            case 'disappear':
                this.startDisappear();
                break;
            case 'whiten':
                this.startWhiten();
                break;
            case 'blink':
                this.startBlink();
                break;
            case 'collapse':
                this.startCollapse();
                break;
            case 'bossCollapse':
                this.startBossCollapse();
                break;
            case 'instantCollapse':
                this.startInstantCollapse();
                break;
        }
        this.revertToNormal();
    }
    ;
    startAppear() {
        this._effectDuration = 16;
        this._appeared = true;
    }
    ;
    startDisappear() {
        this._effectDuration = 32;
        this._appeared = false;
    }
    ;
    startWhiten() {
        this._effectDuration = 16;
    }
    ;
    startBlink() {
        this._effectDuration = 20;
    }
    ;
    startCollapse() {
        this._effectDuration = 32;
        this._appeared = false;
    }
    ;
    startBossCollapse() {
        this._effectDuration = this.bitmap.height;
        this._appeared = false;
    }
    ;
    startInstantCollapse() {
        this._effectDuration = 16;
        this._appeared = false;
    }
    ;
    updateEffect() {
        this.setupEffect();
        if (this._effectDuration > 0) {
            this._effectDuration--;
            switch (this._effectType) {
                case 'whiten':
                    this.updateWhiten();
                    break;
                case 'blink':
                    this.updateBlink();
                    break;
                case 'appear':
                    this.updateAppear();
                    break;
                case 'disappear':
                    this.updateDisappear();
                    break;
                case 'collapse':
                    this.updateCollapse();
                    break;
                case 'bossCollapse':
                    this.updateBossCollapse();
                    break;
                case 'instantCollapse':
                    this.updateInstantCollapse();
                    break;
            }
            if (this._effectDuration === 0) {
                this._effectType = null;
            }
        }
    }
    ;
    isEffecting() {
        return this._effectType !== null;
    }
    ;
    revertToNormal() {
        this._shake = 0;
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
    }
    ;
    updateWhiten() {
        const alpha = 128 - (16 - this._effectDuration) * 10;
        this.setBlendColor([255, 255, 255, alpha]);
    }
    ;
    updateBlink() {
        this.opacity = (this._effectDuration % 10 < 5) ? 255 : 0;
    }
    ;
    updateAppear() {
        this.opacity = (16 - this._effectDuration) * 16;
    }
    ;
    updateDisappear() {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    }
    ;
    updateCollapse() {
        this.blendMode = Graphics.BLEND_ADD;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
    }
    ;
    updateBossCollapse() {
        this._shake = this._effectDuration % 2 * 4 - 2;
        this.blendMode = Graphics.BLEND_ADD;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    }
    ;
    updateInstantCollapse() {
        this.opacity = 0;
    }
    ;
    damageOffsetX() {
        return 0;
    }
    ;
    damageOffsetY() {
        return -8;
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Picture
//
// The sprite for displaying a picture.
class Sprite_Picture extends Sprite {
    constructor(pictureId) {
        super();
        this._pictureName = '';
        this._pictureId = pictureId;
        // this._pictureName = '';
        this._isPicture = true;
        this.update();
    }
    ;
    picture() {
        return $gameScreen.picture(this._pictureId);
    }
    ;
    update() {
        super.update();
        this.updateBitmap();
        if (this.visible) {
            this.updateOrigin();
            this.updatePosition();
            this.updateScale();
            this.updateTone();
            this.updateOther();
        }
    }
    ;
    updateBitmap() {
        const picture = this.picture();
        if (picture) {
            const pictureName = picture.name();
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.loadBitmap();
            }
            this.visible = true;
        }
        else {
            this._pictureName = '';
            this.bitmap = null;
            this.visible = false;
        }
    }
    ;
    updateOrigin() {
        const picture = this.picture();
        if (picture.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        }
        else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    }
    ;
    updatePosition() {
        const picture = this.picture();
        this.x = Math.floor(picture.x());
        this.y = Math.floor(picture.y());
    }
    ;
    updateScale() {
        const picture = this.picture();
        this.scale.x = picture.scaleX() / 100;
        this.scale.y = picture.scaleY() / 100;
    }
    ;
    updateTone() {
        const picture = this.picture();
        if (picture.tone()) {
            this.setColorTone(picture.tone());
        }
        else {
            this.setColorTone([0, 0, 0, 0]);
        }
    }
    ;
    updateOther() {
        const picture = this.picture();
        this.opacity = picture.opacity();
        this.blendMode = picture.blendMode();
        this.rotation = picture.angle() * Math.PI / 180;
    }
    ;
    loadBitmap() {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.
class Sprite_Timer extends Sprite {
    constructor() {
        super();
        this._seconds = 0;
        // this._seconds = 0;
        this.createBitmap();
        this.update();
    }
    ;
    createBitmap() {
        this.bitmap = new Bitmap(96, 48);
        this.bitmap.fontSize = 32;
    }
    ;
    update() {
        super.update();
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    }
    ;
    updateBitmap() {
        if (this._seconds !== $gameTimer.seconds()) {
            this._seconds = $gameTimer.seconds();
            this.redraw();
        }
    }
    ;
    redraw() {
        const text = this.timerText();
        const width = this.bitmap.width;
        const height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(text, 0, 0, width, height, 'center');
    }
    ;
    timerText() {
        const min = Math.floor(this._seconds / 60) % 60;
        const sec = this._seconds % 60;
        return min.padZero(2) + ':' + sec.padZero(2);
    }
    ;
    updatePosition() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 0;
    }
    ;
    updateVisibility() {
        this.visible = $gameTimer.isWorking();
    }
    ;
}

//-----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.
class Sprite_Destination extends Sprite {
    constructor() {
        super();
        this._frameCount = 0;
        this.createBitmap();
        // this._frameCount = 0;
    }
    ;
    update() {
        super.update();
        if ($gameTemp.isDestinationValid()) {
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        }
        else {
            this._frameCount = 0;
            this.visible = false;
        }
    }
    ;
    createBitmap() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.bitmap.fillAll('white');
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = Graphics.BLEND_ADD;
    }
    ;
    updatePosition() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
        this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
    }
    ;
    updateAnimation() {
        this._frameCount++;
        this._frameCount %= 20;
        this.opacity = (20 - this._frameCount) * 6;
        this.scale.x = 1 + this._frameCount / 20;
        this.scale.y = this.scale.x;
    }
    ;
}

//-----------------------------------------------------------------------------
// Spriteset_Base
//
// The superclass of Spriteset_Map and Spriteset_Battle.
class Spriteset_Base extends Sprite {
    constructor() {
        super();
        this._tone = [0, 0, 0, 0];
        this.setFrame(0, 0, Graphics.width, Graphics.height);
        this.opaque = true;
        this.createLowerLayer();
        this.createToneChanger();
        this.createUpperLayer();
        this.update();
    }
    ;
    createLowerLayer() {
        this.createBaseSprite();
    }
    ;
    createUpperLayer() {
        this.createPictures();
        this.createTimer();
        this.createScreenSprites();
    }
    ;
    update() {
        super.update();
        this.updateScreenSprites();
        this.updateToneChanger();
        this.updatePosition();
    }
    ;
    createBaseSprite() {
        this._baseSprite = new Sprite();
        this._baseSprite.setFrame(0, 0, this.width, this.height);
        this._blackScreen = new ScreenSprite();
        this._blackScreen.opacity = 255;
        this.addChild(this._baseSprite);
        this._baseSprite.addChild(this._blackScreen);
    }
    ;
    createToneChanger() {
        this.createWebGLToneChanger();
    }
    ;
    createWebGLToneChanger() {
        const margin = 48;
        const width = Graphics.width + margin * 2;
        const height = Graphics.height + margin * 2;
        this._toneFilter = new ToneFilter();
        this._baseSprite.filters = [this._toneFilter];
        this._baseSprite.filterArea = new PIXI.Rectangle(-margin, -margin, width, height);
    }
    ;
    createPictures() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._pictureContainer = new Sprite();
        this._pictureContainer.setFrame(x, y, width, height);
        for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
            this._pictureContainer.addChild(new Sprite_Picture(i));
        }
        this.addChild(this._pictureContainer);
    }
    ;
    createTimer() {
        this._timerSprite = new Sprite_Timer();
        this.addChild(this._timerSprite);
    }
    ;
    createScreenSprites() {
        this._flashSprite = new ScreenSprite();
        this._fadeSprite = new ScreenSprite();
        this.addChild(this._flashSprite);
        this.addChild(this._fadeSprite);
    }
    ;
    updateScreenSprites() {
        const color = $gameScreen.flashColor();
        this._flashSprite.setColor(color[0], color[1], color[2]);
        this._flashSprite.opacity = color[3];
        this._fadeSprite.opacity = 255 - $gameScreen.brightness();
    }
    ;
    updateToneChanger() {
        const tone = $gameScreen.tone();
        if (!this._tone.equals(tone)) {
            this._tone = tone.clone();
            this.updateWebGLToneChanger();
        }
    }
    ;
    updateWebGLToneChanger() {
        const tone = this._tone;
        this._toneFilter.reset();
        this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
        this._toneFilter.adjustSaturation(-tone[3]);
    }
    ;
    updatePosition() {
        const screen = $gameScreen;
        const scale = screen.zoomScale();
        this.scale.x = scale;
        this.scale.y = scale;
        this.x = Math.round(-screen.zoomX() * (scale - 1));
        this.y = Math.round(-screen.zoomY() * (scale - 1));
        this.x += Math.round(screen.shake());
    }
    ;
}

//-----------------------------------------------------------------------------
// Spriteset_Map
//
// The set of sprites on the map screen.
class Spriteset_Map extends Spriteset_Base {
    createLowerLayer() {
        super.createLowerLayer();
        this.createParallax();
        this.createTilemap();
        this.createCharacters();
        this.createShadow();
        this.createDestination();
        this.createWeather();
    }
    ;
    update() {
        super.update();
        this.updateTileset();
        this.updateParallax();
        this.updateTilemap();
        this.updateShadow();
        this.updateWeather();
    }
    ;
    hideCharacters() {
        for (let i = 0; i < this._characterSprites.length; i++) {
            const sprite = this._characterSprites[i];
            if (!sprite.isTile()) {
                sprite.hide();
            }
        }
    }
    ;
    createParallax() {
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._baseSprite.addChild(this._parallax);
    }
    ;
    createTilemap() {
        this._tilemap = new ShaderTilemap();
        this._tilemap.tileWidth = $gameMap.tileWidth();
        this._tilemap.tileHeight = $gameMap.tileHeight();
        this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
        this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
        this._tilemap.verticalWrap = $gameMap.isLoopVertical();
        this.loadTileset();
        this._baseSprite.addChild(this._tilemap);
    }
    ;
    loadTileset() {
        this._tileset = $gameMap.tileset();
        if (this._tileset) {
            const tilesetNames = this._tileset.tilesetNames;
            for (let i = 0; i < tilesetNames.length; i++) {
                this._tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
            }
            const newTilesetFlags = $gameMap.tilesetFlags();
            this._tilemap.refreshTileset();
            if (!this._tilemap.flags.equals(newTilesetFlags)) {
                this._tilemap.refresh();
            }
            this._tilemap.flags = newTilesetFlags;
        }
    }
    ;
    createCharacters() {
        this._characterSprites = [];
        $gameMap.events().forEach(function (event) {
            this._characterSprites.push(new Sprite_Character(event));
        }, this);
        $gameMap.vehicles().forEach(function (vehicle) {
            this._characterSprites.push(new Sprite_Character(vehicle));
        }, this);
        $gamePlayer.followers().reverseEach(function (follower) {
            this._characterSprites.push(new Sprite_Character(follower));
        }, this);
        this._characterSprites.push(new Sprite_Character($gamePlayer));
        for (let i = 0; i < this._characterSprites.length; i++) {
            this._tilemap.addChild(this._characterSprites[i]);
        }
    }
    ;
    createShadow() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this._shadowSprite.z = 6;
        this._tilemap.addChild(this._shadowSprite);
    }
    ;
    createDestination() {
        this._destinationSprite = new Sprite_Destination();
        this._destinationSprite.z = 9;
        this._tilemap.addChild(this._destinationSprite);
    }
    ;
    createWeather() {
        this._weather = new Weather();
        this.addChild(this._weather);
    }
    ;
    updateTileset() {
        if (this._tileset !== $gameMap.tileset()) {
            this.loadTileset();
        }
    }
    ;
    updateParallax() {
        if (this._parallaxName !== $gameMap.parallaxName()) {
            this._parallaxName = $gameMap.parallaxName();
            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        }
        if (this._parallax.bitmap) {
            this._parallax.origin.x = $gameMap.parallaxOx();
            this._parallax.origin.y = $gameMap.parallaxOy();
        }
    }
    ;
    updateTilemap() {
        this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    }
    ;
    updateShadow() {
        const airship = $gameMap.airship();
        this._shadowSprite.x = airship.shadowX();
        this._shadowSprite.y = airship.shadowY();
        this._shadowSprite.opacity = airship.shadowOpacity();
    }
    ;
    updateWeather() {
        this._weather.type = $gameScreen.weatherType();
        this._weather.power = $gameScreen.weatherPower();
        this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    }
    ;
}

//-----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.
class Spriteset_Battle extends Spriteset_Base {
    constructor() {
        super(...arguments);
        this._battlebackLocated = false;
    }
    createLowerLayer() {
        super.createLowerLayer();
        this.createBackground();
        this.createBattleField();
        this.createBattleback();
        this.createEnemies();
        this.createActors();
    }
    ;
    createBackground() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._baseSprite.addChild(this._backgroundSprite);
    }
    ;
    update() {
        super.update();
        this.updateActors();
        this.updateBattleback();
    }
    ;
    createBattleField() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._battleField = new Sprite();
        this._battleField.setFrame(x, y, width, height);
        this._battleField.x = x;
        this._battleField.y = y;
        this._baseSprite.addChild(this._battleField);
    }
    ;
    createBattleback() {
        const margin = 32;
        const x = -this._battleField.x - margin;
        const y = -this._battleField.y - margin;
        const width = Graphics.width + margin * 2;
        const height = Graphics.height + margin * 2;
        this._back1Sprite = new TilingSprite();
        this._back2Sprite = new TilingSprite();
        this._back1Sprite.bitmap = this.battleback1Bitmap();
        this._back2Sprite.bitmap = this.battleback2Bitmap();
        this._back1Sprite.move(x, y, width, height);
        this._back2Sprite.move(x, y, width, height);
        this._battleField.addChild(this._back1Sprite);
        this._battleField.addChild(this._back2Sprite);
    }
    ;
    updateBattleback() {
        if (!this._battlebackLocated) {
            this.locateBattleback();
            this._battlebackLocated = true;
        }
    }
    ;
    locateBattleback() {
        const width = this._battleField.width;
        const height = this._battleField.height;
        const sprite1 = this._back1Sprite;
        const sprite2 = this._back2Sprite;
        sprite1.origin.x = sprite1.x + (sprite1.bitmap.width - width) / 2;
        sprite2.origin.x = sprite1.y + (sprite2.bitmap.width - width) / 2;
        if ($gameSystem.isSideView()) {
            sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
            sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
        }
    }
    ;
    battleback1Bitmap() {
        return ImageManager.loadBattleback1(this.battleback1Name());
    }
    ;
    battleback2Bitmap() {
        return ImageManager.loadBattleback2(this.battleback2Name());
    }
    ;
    battleback1Name() {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback1Name;
        }
        else if ($gameMap.battleback1Name()) {
            return $gameMap.battleback1Name();
        }
        else if ($gameMap.isOverworld()) {
            return this.overworldBattleback1Name();
        }
        else {
            return '';
        }
    }
    ;
    battleback2Name() {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback2Name;
        }
        else if ($gameMap.battleback2Name()) {
            return $gameMap.battleback2Name();
        }
        else if ($gameMap.isOverworld()) {
            return this.overworldBattleback2Name();
        }
        else {
            return '';
        }
    }
    ;
    overworldBattleback1Name() {
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback1Name();
        }
        else {
            return this.normalBattleback1Name();
        }
    }
    ;
    overworldBattleback2Name() {
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback2Name();
        }
        else {
            return this.normalBattleback2Name();
        }
    }
    ;
    normalBattleback1Name() {
        return (this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name());
    }
    ;
    normalBattleback2Name() {
        return (this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name());
    }
    ;
    terrainBattleback1Name(type) {
        switch (type) {
            case 24:
            case 25:
                return 'Wasteland';
            case 26:
            case 27:
                return 'DirtField';
            case 32:
            case 33:
                return 'Desert';
            case 34:
                return 'Lava1';
            case 35:
                return 'Lava2';
            case 40:
            case 41:
                return 'Snowfield';
            case 42:
                return 'Clouds';
            case 4:
            case 5:
                return 'PoisonSwamp';
            default:
                return null;
        }
    }
    ;
    terrainBattleback2Name(type) {
        switch (type) {
            case 20:
            case 21:
                return 'Forest';
            case 22:
            case 30:
            case 38:
                return 'Cliff';
            case 24:
            case 25:
            case 26:
            case 27:
                return 'Wasteland';
            case 32:
            case 33:
                return 'Desert';
            case 34:
            case 35:
                return 'Lava';
            case 40:
            case 41:
                return 'Snowfield';
            case 42:
                return 'Clouds';
            case 4:
            case 5:
                return 'PoisonSwamp';
        }
    }
    ;
    defaultBattleback1Name() {
        return 'Grassland';
    }
    ;
    defaultBattleback2Name() {
        return 'Grassland';
    }
    ;
    shipBattleback1Name() {
        return 'Ship';
    }
    ;
    shipBattleback2Name() {
        return 'Ship';
    }
    ;
    autotileType(z) {
        return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
    }
    ;
    createEnemies() {
        const enemies = $gameTroop.members();
        const sprites = [];
        for (let i = 0; i < enemies.length; i++) {
            sprites[i] = new Sprite_Enemy(enemies[i]);
        }
        sprites.sort(this.compareEnemySprite.bind(this));
        for (let j = 0; j < sprites.length; j++) {
            this._battleField.addChild(sprites[j]);
        }
        this._enemySprites = sprites;
    }
    ;
    compareEnemySprite(a, b) {
        if (a.y !== b.y) {
            return a.y - b.y;
        }
        else {
            return b.spriteId - a.spriteId;
        }
    }
    ;
    createActors() {
        this._actorSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            this._actorSprites[i] = new Sprite_Actor();
            this._battleField.addChild(this._actorSprites[i]);
        }
    }
    ;
    updateActors() {
        const members = $gameParty.battleMembers();
        for (let i = 0; i < this._actorSprites.length; i++) {
            this._actorSprites[i].setBattler(members[i]);
        }
    }
    ;
    battlerSprites() {
        const actors = this._actorSprites;
        const enemys = this._enemySprites;
        return enemys.concat(actors);
    }
    ;
    isAnimationPlaying() {
        return this.battlerSprites().some(function (sprite) {
            return sprite.isAnimationPlaying();
        });
    }
    ;
    isEffecting() {
        return this.battlerSprites().some(function (sprite) {
            return sprite.isEffecting();
        });
    }
    ;
    isAnyoneMoving() {
        return this.battlerSprites().some(function (sprite) {
            return sprite.isMoving();
        });
    }
    ;
    isBusy() {
        return this.isAnimationPlaying() || this.isAnyoneMoving();
    }
    ;
}



var index$5 = Object.freeze({
	Sprite_Base: Sprite_Base,
	Sprite_Button: Sprite_Button,
	Sprite_Character: Sprite_Character,
	Sprite_Battler: Sprite_Battler,
	Sprite_Actor: Sprite_Actor,
	Sprite_Enemy: Sprite_Enemy,
	Sprite_Animation: Sprite_Animation,
	Sprite_Damage: Sprite_Damage,
	Sprite_StateIcon: Sprite_StateIcon,
	Sprite_Weapons: Sprite_Weapon,
	Sprite_Balloon: Sprite_Balloon,
	Sprite_Picture: Sprite_Picture,
	Sprite_Timer: Sprite_Timer,
	Sprite_Destination: Sprite_Destination,
	Spriteset_Base: Spriteset_Base,
	Spriteset_Map: Spriteset_Map,
	Spriteset_Battle: Spriteset_Battle
});

//-----------------------------------------------------------------------------
// Window_ShopNumber
//
// The window for inputting quantity of items to buy or sell on the shop
// screen.
class Window_ShopNumber extends Window_Selectable {
    constructor(x, y, height) {
        super(x, y, undefined, height);
        this._item = null;
        this._max = 1;
        this._price = 0;
        this._number = 1;
        this._currencyUnit = TextManager.currencyUnit;
        this.createButtons();
    }
    ;
    windowWidth() {
        return 456;
    }
    ;
    number() {
        return this._number;
    }
    ;
    setup(item, max, price) {
        this._item = item;
        this._max = Math.floor(max);
        this._price = price;
        this._number = 1;
        this.placeButtons();
        this.updateButtonsVisiblity();
        this.refresh();
    }
    ;
    setCurrencyUnit(currencyUnit) {
        this._currencyUnit = currencyUnit;
        this.refresh();
    }
    ;
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
    }
    ;
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
    }
    ;
    updateButtonsVisiblity() {
        if (TouchInput.date > Input.date) {
            this.showButtons();
        }
        else {
            this.hideButtons();
        }
    }
    ;
    showButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = true;
        }
    }
    ;
    hideButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = false;
        }
    }
    ;
    refresh() {
        this.contents.clear();
        this.drawItemName(this._item, 0, this.itemY());
        this.drawMultiplicationSign();
        this.drawNumber();
        this.drawTotalPrice();
    }
    ;
    drawMultiplicationSign() {
        const sign = '\u00d7';
        const width = this.textWidth(sign);
        const x = this.cursorX() - width * 2;
        const y = this.itemY();
        this.resetTextColor();
        this.drawText(sign, x, y, width);
    }
    ;
    drawNumber() {
        const x = this.cursorX();
        const y = this.itemY();
        const width = this.cursorWidth() - this.textPadding();
        this.resetTextColor();
        this.drawText(this._number.toString(), x, y, width, 'right');
    }
    ;
    drawTotalPrice() {
        const total = this._price * this._number;
        const width = this.contentsWidth() - this.textPadding();
        this.drawCurrencyValue(total, this._currencyUnit, 0, this.priceY(), width);
    }
    ;
    itemY() {
        return Math.round(this.contentsHeight() / 2 - Window_Base.lineHeight() * 1.5);
    }
    ;
    priceY() {
        return Math.round(this.contentsHeight() / 2 + Window_Base.lineHeight() / 2);
    }
    ;
    buttonY() {
        return Math.round(this.priceY() + Window_Base.lineHeight() * 2.5);
    }
    ;
    cursorWidth() {
        const digitWidth = this.textWidth('0');
        return this.maxDigits() * digitWidth + this.textPadding() * 2;
    }
    ;
    cursorX() {
        return this.contentsWidth() - this.cursorWidth() - this.textPadding();
    }
    ;
    maxDigits() {
        return 2;
    }
    ;
    update() {
        super.update();
        this.processNumberChange();
    }
    ;
    isOkTriggered() {
        return Input.isTriggered('ok');
    }
    ;
    playOkSound() {
    }
    ;
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
    }
    ;
    changeNumber(amount) {
        const lastNumber = this._number;
        this._number = (this._number + amount).clamp(1, this._max);
        if (this._number !== lastNumber) {
            SoundManager.playCursor();
            this.refresh();
        }
    }
    ;
    updateCursor() {
        this.setCursorRect(this.cursorX(), this.itemY(), this.cursorWidth(), Window_Base.lineHeight());
    }
    ;
    onButtonUp() {
        this.changeNumber(1);
    }
    ;
    onButtonUp2() {
        this.changeNumber(10);
    }
    ;
    onButtonDown() {
        this.changeNumber(-1);
    }
    ;
    onButtonDown2() {
        this.changeNumber(-10);
    }
    ;
    onButtonOk() {
        this.processOk();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ShopStatus
//
// The window for displaying number of items in possession and the actor's
// equipment on the shop screen.
class Window_ShopStatus extends Window_Base {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this._item = null;
        this._pageIndex = 0;
        this.refresh();
    }
    ;
    refresh() {
        this.contents.clear();
        if (this._item) {
            const x = this.textPadding();
            this.drawPossession(x, 0);
            if (this.isEquipItem()) {
                this.drawEquipInfo(x, Window_Base.lineHeight() * 2);
            }
        }
    }
    ;
    setItem(item) {
        this._item = item;
        this.refresh();
    }
    ;
    isEquipItem() {
        return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
    }
    ;
    drawPossession(x, y) {
        const width = this.contents.width - this.textPadding() - x;
        const possessionWidth = this.textWidth('0000');
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.resetTextColor();
        this.drawText($gameParty.numItems(this._item).toString(), x, y, width, 'right');
    }
    ;
    drawEquipInfo(x, y) {
        const members = this.statusMembers();
        for (let i = 0; i < members.length; i++) {
            this.drawActorEquipInfo(x, y + Window_Base.lineHeight() * (i * 2.4), members[i]);
        }
    }
    ;
    statusMembers() {
        const start = this._pageIndex * this.pageSize();
        const end = start + this.pageSize();
        return $gameParty.members().slice(start, end);
    }
    ;
    pageSize() {
        return 4;
    }
    ;
    maxPages() {
        return Math.floor(($gameParty.size() + this.pageSize() - 1) / this.pageSize());
    }
    ;
    drawActorEquipInfo(x, y, actor) {
        const enabled = actor.canEquip(this._item);
        this.changePaintOpacity(enabled);
        this.resetTextColor();
        this.drawText(actor.name(), x, y, 168);
        const item1 = this.currentEquippedItem(actor, this._item.etypeId);
        if (enabled) {
            this.drawActorParamChange(x, y, actor, item1);
        }
        this.drawItemName(item1, x, y + Window_Base.lineHeight());
        this.changePaintOpacity(true);
    }
    ;
    drawActorParamChange(x, y, actor, item1) {
        const width = this.contents.width - this.textPadding() - x;
        const paramId = this.paramId();
        const change = this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
        this.changeTextColor(this.paramchangeTextColor(change));
        this.drawText((change > 0 ? '+' : '') + change, x, y, width, 'right');
    }
    ;
    paramId() {
        return DataManager.isWeapon(this._item) ? 2 : 3;
    }
    ;
    currentEquippedItem(actor, etypeId) {
        const list = [];
        const equips = actor.equips();
        const slots = actor.equipSlots();
        for (let i = 0; i < slots.length; i++) {
            if (slots[i] === etypeId) {
                list.push(equips[i]);
            }
        }
        const paramId = this.paramId();
        let worstParam = Number.MAX_VALUE;
        let worstItem = null;
        for (let j = 0; j < list.length; j++) {
            if (list[j] && list[j].params[paramId] < worstParam) {
                worstParam = list[j].params[paramId];
                worstItem = list[j];
            }
        }
        return worstItem;
    }
    ;
    update() {
        super.update();
        this.updatePage();
    }
    ;
    updatePage() {
        if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
            this.changePage();
        }
    }
    ;
    isPageChangeEnabled() {
        return this.visible && this.maxPages() >= 2;
    }
    ;
    isPageChangeRequested() {
        if (Input.isTriggered('shift')) {
            return true;
        }
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            return true;
        }
        return false;
    }
    ;
    isTouchedInsideFrame() {
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    ;
    changePage() {
        this._pageIndex = (this._pageIndex + 1) % this.maxPages();
        this.refresh();
        SoundManager.playCursor();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.
class Window_NameEdit extends Window_Base {
    constructor(actor, maxLength) {
        super();
        this._actor = actor;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._maxLength = maxLength;
        this._defaultName = this._name;
        this.deactivate();
        this.refresh();
        ImageManager.reserveFace(actor.faceName());
    }
    ;
    windowWidth() {
        return 480;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(4);
    }
    ;
    windowX() {
        return (Graphics.boxWidth - this.windowWidth()) / 2;
    }
    windowY() {
        return (Graphics.boxHeight - (this.windowHeight() + Window_Base.fittingHeight(9) + 8)) / 2;
    }
    get name() {
        return this._name;
    }
    ;
    restoreDefault() {
        this._name = this._defaultName;
        this._index = this._name.length;
        this.refresh();
        return this._name.length > 0;
    }
    ;
    add(ch) {
        if (this._index < this._maxLength) {
            this._name += ch;
            this._index++;
            this.refresh();
            return true;
        }
        else {
            return false;
        }
    }
    ;
    back() {
        if (this._index > 0) {
            this._index--;
            this._name = this._name.slice(0, this._index);
            this.refresh();
            return true;
        }
        else {
            return false;
        }
    }
    ;
    faceWidth() {
        return 144;
    }
    ;
    charWidth() {
        const text = $gameSystem.isJapanese() ? '\uff21' : 'A';
        return this.textWidth(text);
    }
    ;
    left() {
        const nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
        const nameWidth = (this._maxLength + 1) * this.charWidth();
        return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
    }
    ;
    itemRect(index) {
        return {
            x: this.left() + index * this.charWidth(),
            y: 54,
            width: this.charWidth(),
            height: Window_Base.lineHeight()
        };
    }
    ;
    underlineRect(index) {
        const rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    }
    ;
    underlineColor() {
        return this.normalColor();
    }
    ;
    drawUnderline(index) {
        const rect = this.underlineRect(index);
        const color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    }
    ;
    drawChar(index) {
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._name[index] || '', rect.x, rect.y);
    }
    ;
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
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_NameInput
//
// The window for selecting text characters on the name input screen.
class Window_NameInput extends Window_Selectable {
    constructor(editWindow) {
        super(editWindow.x, editWindow.y + editWindow.height + 8, editWindow.width);
        this._editWindow = editWindow;
        this._page = 0;
        this._index = 0;
        this.refresh();
        this.updateCursor();
        this.activate();
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(9);
    }
    ;
    table() {
        if ($gameSystem.isJapanese()) {
            return [Window_NameInput.JAPAN1,
                Window_NameInput.JAPAN2,
                Window_NameInput.JAPAN3];
        }
        else if ($gameSystem.isRussian()) {
            return [Window_NameInput.RUSSIA];
        }
        else {
            return [Window_NameInput.LATIN1,
                Window_NameInput.LATIN2];
        }
    }
    ;
    maxCols() {
        return 10;
    }
    ;
    maxItems() {
        return 90;
    }
    ;
    character() {
        return this._index < 88 ? this.table()[this._page][this._index] : '';
    }
    ;
    isPageChange() {
        return this._index === 88;
    }
    ;
    isOk() {
        return this._index === 89;
    }
    ;
    itemRect(index) {
        /// NOTE (bungcip): changed to make it compile
        const rect = new PIXI.Rectangle(index % 10 * 42 + Math.floor(index % 10 / 5) * 24, Math.floor(index / 10) * Window_Base.lineHeight(), 42, Window_Base.lineHeight());
        return rect;
    }
    ;
    refresh() {
        const table = this.table();
        this.contents.clear();
        this.resetTextColor();
        for (let i = 0; i < 90; i++) {
            const rect = this.itemRect(i);
            rect.x += 3;
            rect.width -= 6;
            this.drawText(table[this._page][i], rect.x, rect.y, rect.width, 'center');
        }
    }
    ;
    updateCursor() {
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    }
    ;
    isCursorMovable() {
        return this.active;
    }
    ;
    cursorDown(wrap) {
        if (this._index < 80 || wrap) {
            this._index = (this._index + 10) % 90;
        }
    }
    ;
    cursorUp(wrap) {
        if (this._index >= 10 || wrap) {
            this._index = (this._index + 80) % 90;
        }
    }
    ;
    cursorRight(wrap) {
        if (this._index % 10 < 9) {
            this._index++;
        }
        else if (wrap) {
            this._index -= 9;
        }
    }
    ;
    cursorLeft(wrap) {
        if (this._index % 10 > 0) {
            this._index--;
        }
        else if (wrap) {
            this._index += 9;
        }
    }
    ;
    cursorPagedown() {
        this._page = (this._page + 1) % this.table().length;
        this.refresh();
    }
    ;
    cursorPageup() {
        this._page = (this._page + this.table().length - 1) % this.table().length;
        this.refresh();
    }
    ;
    processCursorMove() {
        const lastPage = this._page;
        super.processCursorMove();
        this.updateCursor();
        if (this._page !== lastPage) {
            SoundManager.playCursor();
        }
    }
    ;
    processHandling() {
        if (this.isOpen() && this.active) {
            if (Input.isTriggered('shift')) {
                this.processJump();
            }
            if (Input.isRepeated('cancel')) {
                this.processBack();
            }
            if (Input.isRepeated('ok')) {
                this.processOk();
            }
        }
    }
    ;
    isCancelEnabled() {
        return true;
    }
    ;
    processCancel() {
        this.processBack();
    }
    ;
    processJump() {
        if (this._index !== 89) {
            this._index = 89;
            SoundManager.playCursor();
        }
    }
    ;
    processBack() {
        if (this._editWindow.back()) {
            SoundManager.playCancel();
        }
    }
    ;
    processOk() {
        if (this.character()) {
            this.onNameAdd();
        }
        else if (this.isPageChange()) {
            SoundManager.playOk();
            this.cursorPagedown();
        }
        else if (this.isOk()) {
            this.onNameOk();
        }
    }
    ;
    onNameAdd() {
        if (this._editWindow.add(this.character())) {
            SoundManager.playOk();
        }
        else {
            SoundManager.playBuzzer();
        }
    }
    ;
    onNameOk() {
        /// NOTE: changed to property access
        if (this._editWindow.name === '') {
            if (this._editWindow.restoreDefault()) {
                SoundManager.playOk();
            }
            else {
                SoundManager.playBuzzer();
            }
        }
        else {
            SoundManager.playOk();
            this.callOkHandler();
        }
    }
    ;
}
Window_NameInput.LATIN1 = ['A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e',
    'F', 'G', 'H', 'I', 'J', 'f', 'g', 'h', 'i', 'j',
    'K', 'L', 'M', 'N', 'O', 'k', 'l', 'm', 'n', 'o',
    'P', 'Q', 'R', 'S', 'T', 'p', 'q', 'r', 's', 't',
    'U', 'V', 'W', 'X', 'Y', 'u', 'v', 'w', 'x', 'y',
    'Z', '[', ']', '^', '_', 'z', '{', '}', '|', '~',
    '0', '1', '2', '3', '4', '!', '#', '$', '%', '&',
    '5', '6', '7', '8', '9', '(', ')', '*', '+', '-',
    '/', '=', '@', '<', '>', ':', ';', ' ', 'Page', 'OK'];
Window_NameInput.LATIN2 = ['Á', 'É', 'Í', 'Ó', 'Ú', 'á', 'é', 'í', 'ó', 'ú',
    'À', 'È', 'Ì', 'Ò', 'Ù', 'à', 'è', 'ì', 'ò', 'ù',
    'Â', 'Ê', 'Î', 'Ô', 'Û', 'â', 'ê', 'î', 'ô', 'û',
    'Ä', 'Ë', 'Ï', 'Ö', 'Ü', 'ä', 'ë', 'ï', 'ö', 'ü',
    'Ā', 'Ē', 'Ī', 'Ō', 'Ū', 'ā', 'ē', 'ī', 'ō', 'ū',
    'Ã', 'Å', 'Æ', 'Ç', 'Ð', 'ã', 'å', 'æ', 'ç', 'ð',
    'Ñ', 'Õ', 'Ø', 'Š', 'Ŵ', 'ñ', 'õ', 'ø', 'š', 'ŵ',
    'Ý', 'Ŷ', 'Ÿ', 'Ž', 'Þ', 'ý', 'ÿ', 'ŷ', 'ž', 'þ',
    'Ĳ', 'Œ', 'ĳ', 'œ', 'ß', '«', '»', ' ', 'Page', 'OK'];
Window_NameInput.RUSSIA = ['А', 'Б', 'В', 'Г', 'Д', 'а', 'б', 'в', 'г', 'д',
    'Е', 'Ё', 'Ж', 'З', 'И', 'е', 'ё', 'ж', 'з', 'и',
    'Й', 'К', 'Л', 'М', 'Н', 'й', 'к', 'л', 'м', 'н',
    'О', 'П', 'Р', 'С', 'Т', 'о', 'п', 'р', 'с', 'т',
    'У', 'Ф', 'Х', 'Ц', 'Ч', 'у', 'ф', 'х', 'ц', 'ч',
    'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'ш', 'щ', 'ъ', 'ы', 'ь',
    'Э', 'Ю', 'Я', '^', '_', 'э', 'ю', 'я', '%', '&',
    '0', '1', '2', '3', '4', '(', ')', '*', '+', '-',
    '5', '6', '7', '8', '9', ':', ';', ' ', '', 'OK'];
Window_NameInput.JAPAN1 = ['あ', 'い', 'う', 'え', 'お', 'が', 'ぎ', 'ぐ', 'げ', 'ご',
    'か', 'き', 'く', 'け', 'こ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
    'さ', 'し', 'す', 'せ', 'そ', 'だ', 'ぢ', 'づ', 'で', 'ど',
    'た', 'ち', 'つ', 'て', 'と', 'ば', 'び', 'ぶ', 'べ', 'ぼ',
    'な', 'に', 'ぬ', 'ね', 'の', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
    'は', 'ひ', 'ふ', 'へ', 'ほ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ',
    'ま', 'み', 'む', 'め', 'も', 'っ', 'ゃ', 'ゅ', 'ょ', 'ゎ',
    'や', 'ゆ', 'よ', 'わ', 'ん', 'ー', '～', '・', '＝', '☆',
    'ら', 'り', 'る', 'れ', 'ろ', 'ゔ', 'を', '　', 'カナ', '決定'];
Window_NameInput.JAPAN2 = ['ア', 'イ', 'ウ', 'エ', 'オ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
    'カ', 'キ', 'ク', 'ケ', 'コ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
    'サ', 'シ', 'ス', 'セ', 'ソ', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
    'タ', 'チ', 'ツ', 'テ', 'ト', 'バ', 'ビ', 'ブ', 'ベ', 'ボ',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'パ', 'ピ', 'プ', 'ペ', 'ポ',
    'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ',
    'マ', 'ミ', 'ム', 'メ', 'モ', 'ッ', 'ャ', 'ュ', 'ョ', 'ヮ',
    'ヤ', 'ユ', 'ヨ', 'ワ', 'ン', 'ー', '～', '・', '＝', '☆',
    'ラ', 'リ', 'ル', 'レ', 'ロ', 'ヴ', 'ヲ', '　', '英数', '決定'];
Window_NameInput.JAPAN3 = ['Ａ', 'Ｂ', 'Ｃ', 'Ｄ', 'Ｅ', 'ａ', 'ｂ', 'ｃ', 'ｄ', 'ｅ',
    'Ｆ', 'Ｇ', 'Ｈ', 'Ｉ', 'Ｊ', 'ｆ', 'ｇ', 'ｈ', 'ｉ', 'ｊ',
    'Ｋ', 'Ｌ', 'Ｍ', 'Ｎ', 'Ｏ', 'ｋ', 'ｌ', 'ｍ', 'ｎ', 'ｏ',
    'Ｐ', 'Ｑ', 'Ｒ', 'Ｓ', 'Ｔ', 'ｐ', 'ｑ', 'ｒ', 'ｓ', 'ｔ',
    'Ｕ', 'Ｖ', 'Ｗ', 'Ｘ', 'Ｙ', 'ｕ', 'ｖ', 'ｗ', 'ｘ', 'ｙ',
    'Ｚ', '［', '］', '＾', '＿', 'ｚ', '｛', '｝', '｜', '～',
    '０', '１', '２', '３', '４', '！', '＃', '＄', '％', '＆',
    '５', '６', '７', '８', '９', '（', '）', '＊', '＋', '－',
    '／', '＝', '＠', '＜', '＞', '：', '；', '　', 'かな', '決定'];

//-----------------------------------------------------------------------------
// Window_ChoiceList
//
// The window used for the event command [Show Choices].
class Window_ChoiceList extends Window_Command {
    constructor(messageWindow) {
        super(0, 0, function () {
            this._messageWindow = messageWindow;
        });
        this._background = 0;
        this.openness = 0;
        this.deactivate();
        // this._background = 0;
    }
    ;
    start() {
        this.updatePlacement();
        this.updateBackground();
        this.refresh();
        this.selectDefault();
        this.open();
        this.activate();
    }
    ;
    selectDefault() {
        this.select($gameMessage.choiceDefaultType());
    }
    ;
    updatePlacement() {
        const positionType = $gameMessage.choicePositionType();
        const messageY = this._messageWindow.y;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        switch (positionType) {
            case 0:
                this.x = 0;
                break;
            case 1:
                this.x = (Graphics.boxWidth - this.width) / 2;
                break;
            case 2:
                this.x = Graphics.boxWidth - this.width;
                break;
        }
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height;
        }
        else {
            this.y = messageY + this._messageWindow.height;
        }
    }
    ;
    updateBackground() {
        this._background = $gameMessage.choiceBackground();
        this.setBackgroundType(this._background);
    }
    ;
    windowWidth() {
        const width = this.maxChoiceWidth() + this.padding * 2;
        return Math.min(width, Graphics.boxWidth);
    }
    ;
    numVisibleRows() {
        const messageY = this._messageWindow.y;
        const messageHeight = this._messageWindow.height;
        const centerY = Graphics.boxHeight / 2;
        const choices = $gameMessage.choices();
        let numLines = choices.length;
        let maxLines = 8;
        if (messageY < centerY && messageY + messageHeight > centerY) {
            maxLines = 4;
        }
        if (numLines > maxLines) {
            numLines = maxLines;
        }
        return numLines;
    }
    ;
    maxChoiceWidth() {
        let maxWidth = 96;
        const choices = $gameMessage.choices();
        for (let i = 0; i < choices.length; i++) {
            const choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
            if (maxWidth < choiceWidth) {
                maxWidth = choiceWidth;
            }
        }
        return maxWidth;
    }
    ;
    textWidthEx(text) {
        return this.drawTextEx(text, 0, this.contents.height);
    }
    ;
    contentsHeight() {
        return this.maxItems() * this.itemHeight();
    }
    ;
    makeCommandList() {
        const choices = $gameMessage.choices();
        for (let i = 0; i < choices.length; i++) {
            this.addCommand(choices[i], 'choice');
        }
    }
    ;
    drawItem(index) {
        const rect = this.itemRectForText(index);
        this.drawTextEx(this.commandName(index), rect.x, rect.y);
    }
    ;
    isCancelEnabled() {
        return $gameMessage.choiceCancelType() !== -1;
    }
    ;
    isOkTriggered() {
        return Input.isTriggered('ok');
    }
    ;
    callOkHandler() {
        $gameMessage.onChoice(this.index());
        this._messageWindow.terminateMessage();
        this.close();
    }
    ;
    callCancelHandler() {
        $gameMessage.onChoice($gameMessage.choiceCancelType());
        this._messageWindow.terminateMessage();
        this.close();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_NumberInput
//
// The window used for the event command [Input Number].
class Window_NumberInput extends Window_Selectable {
    constructor(messageWindow) {
        super(0, 0, 0, 0, function () {
            this._messageWindow = messageWindow;
        });
        this._number = 0;
        this._maxDigits = 1;
        this.openness = 0;
        this.createButtons();
        this.deactivate();
    }
    ;
    start() {
        this._maxDigits = $gameMessage.numInputMaxDigits();
        this._number = $gameVariables.value($gameMessage.numInputVariableId());
        this._number = this._number.clamp(0, Math.pow(10, this._maxDigits) - 1);
        this.updatePlacement();
        this.placeButtons();
        this.updateButtonsVisiblity();
        this.createContents();
        this.refresh();
        this.open();
        this.activate();
        this.select(0);
    }
    ;
    updatePlacement() {
        const messageY = this._messageWindow.y;
        const spacing = 8;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        this.x = (Graphics.boxWidth - this.width) / 2;
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height - spacing;
        }
        else {
            this.y = messageY + this._messageWindow.height + spacing;
        }
    }
    ;
    windowWidth() {
        return this.maxCols() * this.itemWidth() + this.padding * 2;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(1);
    }
    ;
    maxCols() {
        return this._maxDigits;
    }
    ;
    maxItems() {
        return this._maxDigits;
    }
    ;
    spacing() {
        return 0;
    }
    ;
    itemWidth() {
        return 32;
    }
    ;
    createButtons() {
        const bitmap = ImageManager.loadSystem('ButtonSet');
        const buttonWidth = 48;
        const buttonHeight = 48;
        this._buttons = [];
        for (let i = 0; i < 3; i++) {
            const button = new Sprite_Button();
            const x = buttonWidth * [1, 2, 4][i];
            const w = buttonWidth * (i === 2 ? 2 : 1);
            button.bitmap = bitmap;
            button.setColdFrame(x, 0, w, buttonHeight);
            button.setHotFrame(x, buttonHeight, w, buttonHeight);
            button.visible = false;
            this._buttons.push(button);
            this.addChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
    }
    ;
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
    }
    ;
    updateButtonsVisiblity() {
        if (TouchInput.date > Input.date) {
            this.showButtons();
        }
        else {
            this.hideButtons();
        }
    }
    ;
    showButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = true;
        }
    }
    ;
    hideButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = false;
        }
    }
    ;
    buttonY() {
        const spacing = 8;
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            return 0 - this._buttons[0].height - spacing;
        }
        else {
            return this.height + spacing;
        }
    }
    ;
    update() {
        super.update();
        this.processDigitChange();
    }
    ;
    processDigitChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated('up')) {
                this.changeDigit(true);
            }
            else if (Input.isRepeated('down')) {
                this.changeDigit(false);
            }
        }
    }
    ;
    changeDigit(up) {
        const index = this.index();
        const place = Math.pow(10, this._maxDigits - 1 - index);
        let n = Math.floor(this._number / place) % 10;
        this._number -= n * place;
        if (up) {
            n = (n + 1) % 10;
        }
        else {
            n = (n + 9) % 10;
        }
        this._number += n * place;
        this.refresh();
        SoundManager.playCursor();
    }
    ;
    isTouchOkEnabled() {
        return false;
    }
    ;
    isOkEnabled() {
        return true;
    }
    ;
    isCancelEnabled() {
        return false;
    }
    ;
    isOkTriggered() {
        return Input.isTriggered('ok');
    }
    ;
    processOk() {
        SoundManager.playOk();
        $gameVariables.setValue($gameMessage.numInputVariableId(), this._number);
        this._messageWindow.terminateMessage();
        this.updateInputData();
        this.deactivate();
        this.close();
    }
    ;
    drawItem(index) {
        const rect = this.itemRect(index);
        const align = 'center';
        const s = this._number.padZero(this._maxDigits);
        const c = s.slice(index, index + 1);
        this.resetTextColor();
        this.drawText(c, rect.x, rect.y, rect.width, align);
    }
    ;
    onButtonUp() {
        this.changeDigit(true);
    }
    ;
    onButtonDown() {
        this.changeDigit(false);
    }
    ;
    onButtonOk() {
        this.processOk();
        this.hideButtons();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_EventItem
//
// The window used for the event command [Select Item].
class Window_EventItem extends Window_ItemList {
    constructor(messageWindow) {
        const width = Graphics.boxWidth;
        super(0, 0, width, undefined, function () {
            this._messageWindow = messageWindow;
        });
        this.openness = 0;
        this.deactivate();
        this.setHandler('ok', this.onOk.bind(this));
        this.setHandler('cancel', this.onCancel.bind(this));
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    start() {
        this.refresh();
        this.updatePlacement();
        this.select(0);
        this.open();
        this.activate();
    }
    ;
    updatePlacement() {
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            this.y = 0;
        }
        else {
            this.y = Graphics.boxHeight - this.height;
        }
    }
    ;
    includes(item) {
        const itypeId = $gameMessage.itemChoiceItypeId();
        return DataManager.isItem(item) && item.itypeId === itypeId;
    }
    ;
    isEnabled(item) {
        return true;
    }
    ;
    onOk() {
        const item = this.item();
        const itemId = item ? item.id : 0;
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
        this._messageWindow.terminateMessage();
        this.close();
    }
    ;
    onCancel() {
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
        this._messageWindow.terminateMessage();
        this.close();
    }
    ;
}

class Window_Message extends Window_Base {
    constructor() {
        super();
        this.openness = 0;
        this.initMembers();
        this.createSubWindows();
        this.updatePlacement();
    }
    ;
    initMembers() {
        this._imageReservationId = Utils.generateRuntimeId();
        this._background = 0;
        this._positionType = 2;
        this._waitCount = 0;
        this._faceBitmap = null;
        this._textState = null;
        this.clearFlags();
    }
    ;
    subWindows() {
        return [this._goldWindow, this._choiceWindow,
            this._numberWindow, this._itemWindow];
    }
    ;
    createSubWindows() {
        this._goldWindow = new Window_Gold(0, 0);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this._goldWindow.openness = 0;
        this._choiceWindow = new Window_ChoiceList(this);
        this._numberWindow = new Window_NumberInput(this);
        this._itemWindow = new Window_EventItem(this);
    }
    ;
    windowWidth() {
        return Graphics.boxWidth;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    }
    ;
    windowX() {
        return (Graphics.boxWidth - this.windowWidth()) / 2;
    }
    clearFlags() {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    update() {
        this.checkToNotClose();
        super.update();
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return;
            }
            else if (this.updateLoading()) {
                return;
            }
            else if (this.updateInput()) {
                return;
            }
            else if (this.updateMessage()) {
                return;
            }
            else if (this.canStart()) {
                this.startMessage();
            }
            else {
                this.startInput();
                return;
            }
        }
    }
    ;
    checkToNotClose() {
        if (this.isClosing() && this.isOpen()) {
            if (this.doesContinue()) {
                this.open();
            }
        }
    }
    ;
    canStart() {
        return $gameMessage.hasText() && !$gameMessage.scrollMode();
    }
    ;
    startMessage() {
        this._textState = {
            index: 0,
            text: this.convertEscapeCharacters($gameMessage.allText())
        };
        this.newPage(this._textState);
        this.updatePlacement();
        this.updateBackground();
        this.open();
    }
    ;
    updatePlacement() {
        this._positionType = $gameMessage.positionType();
        this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
        this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
    }
    ;
    updateBackground() {
        this._background = $gameMessage.background();
        this.setBackgroundType(this._background);
    }
    ;
    terminateMessage() {
        this.close();
        this._goldWindow.close();
        $gameMessage.clear();
    }
    ;
    updateWait() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        else {
            return false;
        }
    }
    ;
    updateLoading() {
        if (this._faceBitmap) {
            if (this._faceBitmap.isReady()) {
                this.drawMessageFace();
                this._faceBitmap = null;
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    ;
    updateInput() {
        if (this.isAnySubWindowActive()) {
            return true;
        }
        if (this.pause) {
            if (this.isTriggered()) {
                Input.update();
                this.pause = false;
                if (!this._textState) {
                    this.terminateMessage();
                }
            }
            return true;
        }
        return false;
    }
    ;
    isAnySubWindowActive() {
        return (this._choiceWindow.active ||
            this._numberWindow.active ||
            this._itemWindow.active);
    }
    ;
    updateMessage() {
        if (this._textState) {
            while (!this.isEndOfText(this._textState)) {
                if (this.needsNewPage(this._textState)) {
                    this.newPage(this._textState);
                }
                this.updateShowFast();
                this.processCharacter(this._textState);
                if (!this._showFast && !this._lineShowFast) {
                    break;
                }
                if (this.pause || this._waitCount > 0) {
                    break;
                }
            }
            if (this.isEndOfText(this._textState)) {
                this.onEndOfText();
            }
            return true;
        }
        else {
            return false;
        }
    }
    ;
    onEndOfText() {
        if (!this.startInput()) {
            if (!this._pauseSkip) {
                this.startPause();
            }
            else {
                this.terminateMessage();
            }
        }
        this._textState = null;
    }
    ;
    startInput() {
        if ($gameMessage.isChoice()) {
            this._choiceWindow.start();
            return true;
        }
        else if ($gameMessage.isNumberInput()) {
            this._numberWindow.start();
            return true;
        }
        else if ($gameMessage.isItemChoice()) {
            this._itemWindow.start();
            return true;
        }
        else {
            return false;
        }
    }
    ;
    isTriggered() {
        return (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
            TouchInput.isRepeated());
    }
    ;
    doesContinue() {
        return ($gameMessage.hasText() && !$gameMessage.scrollMode() &&
            !this.areSettingsChanged());
    }
    ;
    areSettingsChanged() {
        return (this._background !== $gameMessage.background() ||
            this._positionType !== $gameMessage.positionType());
    }
    ;
    updateShowFast() {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    }
    ;
    newPage(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        this.loadMessageFace();
        textState.x = this.newLineX();
        textState.y = 0;
        textState.left = this.newLineX();
        textState.height = this.calcTextHeight(textState, false);
    }
    ;
    loadMessageFace() {
        this._faceBitmap = ImageManager.reserveFace($gameMessage.faceName(), 0, this._imageReservationId);
    }
    ;
    drawMessageFace() {
        this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0);
        ImageManager.releaseReservation(this._imageReservationId);
    }
    ;
    newLineX() {
        return $gameMessage.faceName() === '' ? 0 : 168;
    }
    ;
    processNewLine(textState) {
        this._lineShowFast = false;
        super.processNewLine(textState);
        if (this.needsNewPage(textState)) {
            this.startPause();
        }
    }
    ;
    processNewPage(textState) {
        super.processNewPage(textState);
        if (textState.text[textState.index] === '\n') {
            textState.index++;
        }
        textState.y = this.contents.height;
        this.startPause();
    }
    ;
    isEndOfText(textState) {
        return textState.index >= textState.text.length;
    }
    ;
    needsNewPage(textState) {
        return (!this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height);
    }
    ;
    processEscapeCharacter(code, textState) {
        switch (code) {
            case '$':
                this._goldWindow.open();
                break;
            case '.':
                this.startWait(15);
                break;
            case '|':
                this.startWait(60);
                break;
            case '!':
                this.startPause();
                break;
            case '>':
                this._lineShowFast = true;
                break;
            case '<':
                this._lineShowFast = false;
                break;
            case '^':
                this._pauseSkip = true;
                break;
            default:
                super.processEscapeCharacter(code, textState);
                break;
        }
    }
    ;
    startWait(count) {
        this._waitCount = count;
    }
    ;
    startPause() {
        this.startWait(10);
        this.pause = true;
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ScrollText
//
// The window for displaying scrolling text. No frame is displayed, but it
// is handled as a window for convenience.
class Window_ScrollText extends Window_Base {
    constructor() {
        super(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._text = '';
        this._allTextHeight = 0;
        this.opacity = 0;
        this.hide();
        // this._text = '';
        // this._allTextHeight = 0;
    }
    ;
    update() {
        super.update();
        if ($gameMessage.scrollMode()) {
            if (this._text) {
                this.updateMessage();
            }
            if (!this._text && $gameMessage.hasText()) {
                this.startMessage();
            }
        }
    }
    ;
    startMessage() {
        this._text = $gameMessage.allText();
        this.refresh();
        this.show();
    }
    ;
    refresh() {
        const textState = {
            index: 0,
            text: this.convertEscapeCharacters(this._text)
        };
        this.resetFontSettings();
        this._allTextHeight = this.calcTextHeight(textState, true);
        this.createContents();
        this.origin.y = -this.height;
        this.drawTextEx(this._text, this.textPadding(), 1);
    }
    ;
    contentsHeight() {
        return Math.max(this._allTextHeight, 1);
    }
    ;
    updateMessage() {
        this.origin.y += this.scrollSpeed();
        if (this.origin.y >= this.contents.height) {
            this.terminateMessage();
        }
    }
    ;
    scrollSpeed() {
        let speed = $gameMessage.scrollSpeed() / 2;
        if (this.isFastForward()) {
            speed *= this.fastForwardRate();
        }
        return speed;
    }
    ;
    isFastForward() {
        if ($gameMessage.scrollNoFast()) {
            return false;
        }
        else {
            return (Input.isPressed('ok') || Input.isPressed('shift') ||
                TouchInput.isPressed());
        }
    }
    ;
    fastForwardRate() {
        return 3;
    }
    ;
    terminateMessage() {
        this._text = null;
        $gameMessage.clear();
        this.hide();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.
class Window_MapName extends Window_Base {
    constructor() {
        super(0, 0);
        this._showCount = 0;
        this.opacity = 0;
        this.contentsOpacity = 0;
        this.refresh();
    }
    ;
    windowWidth() {
        return 360;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(1);
    }
    ;
    update() {
        super.update();
        if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();
            this._showCount--;
        }
        else {
            this.updateFadeOut();
        }
    }
    ;
    updateFadeIn() {
        this.contentsOpacity += 16;
    }
    ;
    updateFadeOut() {
        this.contentsOpacity -= 16;
    }
    ;
    open() {
        this.refresh();
        this._showCount = 150;
    }
    ;
    close() {
        this._showCount = 0;
    }
    ;
    refresh() {
        this.contents.clear();
        if ($gameMap.displayName()) {
            const width = this.contentsWidth();
            this.drawBackground(0, 0, width, Window_Base.lineHeight());
            this.drawText($gameMap.displayName(), 0, 0, width, 'center');
        }
    }
    ;
    drawBackground(x, y, width, height) {
        const color1 = this.dimColor1();
        const color2 = this.dimColor2();
        this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
        this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_BattleLog
//
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
class Window_BattleLog extends Window_Selectable {
    constructor() {
        super(0, 0);
        this._lines = [];
        this._methods = [];
        this._waitCount = 0;
        this._waitMode = '';
        this._baseLineStack = [];
        this._spriteset = null;
        this.opacity = 0;
        // this._lines = [];
        // this._methods = [];
        // this._waitCount = 0;
        // this._waitMode = '';
        // this._baseLineStack = [];
        // this._spriteset = null;
        this.createBackBitmap();
        this.createBackSprite();
        this.refresh();
    }
    ;
    setSpriteset(spriteset) {
        this._spriteset = spriteset;
    }
    ;
    windowWidth() {
        return Graphics.boxWidth;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(this.maxLines());
    }
    ;
    maxLines() {
        return 10;
    }
    ;
    createBackBitmap() {
        this._backBitmap = new Bitmap(this.width, this.height);
    }
    ;
    createBackSprite() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = this._backBitmap;
        this._backSprite.y = this.y;
        this.addChildToBack(this._backSprite);
    }
    ;
    numLines() {
        return this._lines.length;
    }
    ;
    messageSpeed() {
        return 16;
    }
    ;
    isBusy() {
        return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
    }
    ;
    update() {
        if (!this.updateWait()) {
            this.callNextMethod();
        }
    }
    ;
    updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }
    ;
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount -= this.isFastForward() ? 3 : 1;
            if (this._waitCount < 0) {
                this._waitCount = 0;
            }
            return true;
        }
        return false;
    }
    ;
    updateWaitMode() {
        let waiting = false;
        switch (this._waitMode) {
            case 'effect':
                waiting = this._spriteset.isEffecting();
                break;
            case 'movement':
                waiting = this._spriteset.isAnyoneMoving();
                break;
        }
        if (!waiting) {
            this._waitMode = '';
        }
        return waiting;
    }
    ;
    setWaitMode(waitMode) {
        this._waitMode = waitMode;
    }
    ;
    callNextMethod() {
        if (this._methods.length > 0) {
            const method = this._methods.shift();
            if (method.name && this[method.name]) {
                this[method.name].apply(this, method.params);
            }
            else {
                throw new Error('Method not found: ' + method.name);
            }
        }
    }
    ;
    isFastForward() {
        return (Input.isLongPressed('ok') || Input.isPressed('shift') ||
            TouchInput.isLongPressed());
    }
    ;
    push(methodName, ...methodArgs) {
        this._methods.push({ name: methodName, params: methodArgs });
    }
    ;
    clear() {
        this._lines = [];
        this._baseLineStack = [];
        this.refresh();
    }
    ;
    wait() {
        this._waitCount = this.messageSpeed();
    }
    ;
    waitForEffect() {
        this.setWaitMode('effect');
    }
    ;
    waitForMovement() {
        this.setWaitMode('movement');
    }
    ;
    addText(text) {
        this._lines.push(text);
        this.refresh();
        this.wait();
    }
    ;
    pushBaseLine() {
        this._baseLineStack.push(this._lines.length);
    }
    ;
    popBaseLine() {
        const baseLine = this._baseLineStack.pop();
        while (this._lines.length > baseLine) {
            this._lines.pop();
        }
    }
    ;
    waitForNewLine() {
        let baseLine = 0;
        if (this._baseLineStack.length > 0) {
            baseLine = this._baseLineStack[this._baseLineStack.length - 1];
        }
        if (this._lines.length > baseLine) {
            this.wait();
        }
    }
    ;
    popupDamage(target) {
        target.startDamagePopup();
    }
    ;
    performActionStart(subject, action) {
        subject.performActionStart(action);
    }
    ;
    performAction(subject, action) {
        subject.performAction(action);
    }
    ;
    performActionEnd(subject) {
        subject.performActionEnd();
    }
    ;
    performDamage(target) {
        target.performDamage();
    }
    ;
    performMiss(target) {
        target.performMiss();
    }
    ;
    performRecovery(target) {
        target.performRecovery();
    }
    ;
    performEvasion(target) {
        target.performEvasion();
    }
    ;
    performMagicEvasion(target) {
        target.performMagicEvasion();
    }
    ;
    performCounter(target) {
        target.performCounter();
    }
    ;
    performReflection(target) {
        target.performReflection();
    }
    ;
    performSubstitute(substitute, target) {
        substitute.performSubstitute(target);
    }
    ;
    performCollapse(target) {
        target.performCollapse();
    }
    ;
    showAnimation(subject, targets, animationId) {
        if (animationId < 0) {
            this.showAttackAnimation(subject, targets);
        }
        else {
            this.showNormalAnimation(targets, animationId);
        }
    }
    ;
    showAttackAnimation(subject, targets) {
        if (subject.isActor()) {
            this.showActorAttackAnimation(subject, targets);
        }
        else {
            this.showEnemyAttackAnimation(subject, targets);
        }
    }
    ;
    showActorAttackAnimation(subject, targets) {
        this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
    }
    ;
    showEnemyAttackAnimation(subject, targets) {
        SoundManager.playEnemyAttack();
    }
    ;
    showNormalAnimation(targets, animationId, mirror) {
        const animation = $dataAnimations[animationId];
        if (animation) {
            let delay = this.animationBaseDelay();
            const nextDelay = this.animationNextDelay();
            targets.forEach(function (target) {
                target.startAnimation(animationId, mirror, delay);
                delay += nextDelay;
            });
        }
    }
    ;
    animationBaseDelay() {
        return 8;
    }
    ;
    animationNextDelay() {
        return 12;
    }
    ;
    refresh() {
        this.drawBackground();
        this.contents.clear();
        for (let i = 0; i < this._lines.length; i++) {
            this.drawLineText(i);
        }
    }
    ;
    drawBackground() {
        const rect = this.backRect();
        const color = this.backColor();
        this._backBitmap.clear();
        this._backBitmap.paintOpacity = this.backPaintOpacity();
        this._backBitmap.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this._backBitmap.paintOpacity = 255;
    }
    ;
    backRect() {
        return {
            x: 0,
            y: this.padding,
            width: this.width,
            height: this.numLines() * Window_Base.lineHeight()
        };
    }
    ;
    backColor() {
        return '#000000';
    }
    ;
    backPaintOpacity() {
        return 64;
    }
    ;
    drawLineText(index) {
        const rect = this.itemRectForText(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        /// NOTE: changed to make it compiled
        // this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
        this.drawTextEx(this._lines[index], rect.x, rect.y);
    }
    ;
    startTurn() {
        this.push('wait');
    }
    ;
    startAction(subject, action, targets) {
        const item = action.item();
        this.push('performActionStart', subject, action);
        this.push('waitForMovement');
        this.push('performAction', subject, action);
        this.push('showAnimation', subject, targets.clone(), item.animationId);
        this.displayAction(subject, item);
    }
    ;
    endAction(subject) {
        this.push('waitForNewLine');
        this.push('clear');
        this.push('performActionEnd', subject);
    }
    ;
    displayCurrentState(subject) {
        const stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push('addText', subject.name() + stateText);
            this.push('wait');
            this.push('clear');
        }
    }
    ;
    displayRegeneration(subject) {
        this.push('popupDamage', subject);
    }
    ;
    displayAction(subject, item) {
        const numMethods = this._methods.length;
        if (DataManager.isSkill(item)) {
            if (item.message1) {
                this.push('addText', subject.name() + item.message1.format(item.name));
            }
            if (item.message2) {
                this.push('addText', item.message2.format(item.name));
            }
        }
        else {
            this.push('addText', TextManager.useItem.format(subject.name(), item.name));
        }
        if (this._methods.length === numMethods) {
            this.push('wait');
        }
    }
    ;
    displayCounter(target) {
        this.push('performCounter', target);
        this.push('addText', TextManager.counterAttack.format(target.name()));
    }
    ;
    displayReflection(target) {
        this.push('performReflection', target);
        this.push('addText', TextManager.magicReflection.format(target.name()));
    }
    ;
    displaySubstitute(substitute, target) {
        const substName = substitute.name();
        this.push('performSubstitute', substitute, target);
        this.push('addText', TextManager.substitute.format(substName, target.name()));
    }
    ;
    displayActionResults(subject, target) {
        if (target.result().used) {
            this.push('pushBaseLine');
            this.displayCritical(target);
            this.push('popupDamage', target);
            this.push('popupDamage', subject);
            this.displayDamage(target);
            this.displayAffectedStatus(target);
            this.displayFailure(target);
            this.push('waitForNewLine');
            this.push('popBaseLine');
        }
    }
    ;
    displayFailure(target) {
        if (target.result().isHit() && !target.result().success) {
            this.push('addText', TextManager.actionFailure.format(target.name()));
        }
    }
    ;
    displayCritical(target) {
        if (target.result().critical) {
            if (target.isActor()) {
                this.push('addText', TextManager.criticalToActor);
            }
            else {
                this.push('addText', TextManager.criticalToEnemy);
            }
        }
    }
    ;
    displayDamage(target) {
        if (target.result().missed) {
            this.displayMiss(target);
        }
        else if (target.result().evaded) {
            this.displayEvasion(target);
        }
        else {
            this.displayHpDamage(target);
            this.displayMpDamage(target);
            this.displayTpDamage(target);
        }
    }
    ;
    displayMiss(target) {
        let fmt;
        if (target.result().physical) {
            fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
            this.push('performMiss', target);
        }
        else {
            fmt = TextManager.actionFailure;
        }
        this.push('addText', fmt.format(target.name()));
    }
    ;
    displayEvasion(target) {
        let fmt;
        if (target.result().physical) {
            fmt = TextManager.evasion;
            this.push('performEvasion', target);
        }
        else {
            fmt = TextManager.magicEvasion;
            this.push('performMagicEvasion', target);
        }
        this.push('addText', fmt.format(target.name()));
    }
    ;
    displayHpDamage(target) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.push('performDamage', target);
            }
            if (target.result().hpDamage < 0) {
                this.push('performRecovery', target);
            }
            this.push('addText', this.makeHpDamageText(target));
        }
    }
    ;
    displayMpDamage(target) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push('performRecovery', target);
            }
            this.push('addText', this.makeMpDamageText(target));
        }
    }
    ;
    displayTpDamage(target) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push('performRecovery', target);
            }
            this.push('addText', this.makeTpDamageText(target));
        }
    }
    ;
    displayAffectedStatus(target) {
        if (target.result().isStatusAffected()) {
            this.push('pushBaseLine');
            this.displayChangedStates(target);
            this.displayChangedBuffs(target);
            this.push('waitForNewLine');
            this.push('popBaseLine');
        }
    }
    ;
    displayAutoAffectedStatus(target) {
        if (target.result().isStatusAffected()) {
            /// NOTE (bungcip): changed to make it compiled
            this.displayAffectedStatus(target);
            this.push('clear');
        }
    }
    ;
    displayChangedStates(target) {
        this.displayAddedStates(target);
        this.displayRemovedStates(target);
    }
    ;
    displayAddedStates(target) {
        target.result().addedStateObjects().forEach(function (state) {
            const stateMsg = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push('performCollapse', target);
            }
            if (stateMsg) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                this.push('addText', target.name() + stateMsg);
                this.push('waitForEffect');
            }
        }, this);
    }
    ;
    displayRemovedStates(target) {
        target.result().removedStateObjects().forEach(function (state) {
            if (state.message4) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                this.push('addText', target.name() + state.message4);
            }
        }, this);
    }
    ;
    displayChangedBuffs(target) {
        const result = target.result();
        this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
    }
    ;
    displayBuffs(target, buffs, fmt) {
        buffs.forEach(function (paramId) {
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', fmt.format(target.name(), TextManager.param(paramId)));
        }, this);
    }
    ;
    makeHpDamageText(target) {
        const result = target.result();
        const damage = result.hpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.hp, damage);
        }
        else if (damage > 0) {
            fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
            return fmt.format(target.name(), damage);
        }
        else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.hp, -damage);
        }
        else {
            fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
            return fmt.format(target.name());
        }
    }
    ;
    makeMpDamageText(target) {
        const result = target.result();
        const damage = result.mpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.mp, damage);
        }
        else if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.mp, damage);
        }
        else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.mp, -damage);
        }
        else {
            return '';
        }
    }
    ;
    makeTpDamageText(target) {
        const result = target.result();
        const damage = result.tpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.tp, damage);
        }
        else if (damage < 0) {
            fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
            return fmt.format(target.name(), TextManager.tp, -damage);
        }
        else {
            return '';
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.
class Window_PartyCommand extends Window_Command {
    constructor() {
        super(0);
        this.openness = 0;
        this.deactivate();
    }
    ;
    windowWidth() {
        return 192;
    }
    ;
    windowY() {
        return Graphics.boxHeight - this.windowHeight();
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.fight, 'fight');
        this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
    }
    ;
    setup() {
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.select(0);
        this.activate();
        this.open();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.
class Window_ActorCommand extends Window_Command {
    constructor() {
        super(0);
        this._actor = null;
        this.openness = 0;
        this.deactivate();
        // this._actor = null;
    }
    ;
    windowWidth() {
        return 192;
    }
    ;
    windowY() {
        return Graphics.boxHeight - this.windowHeight();
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    makeCommandList() {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addGuardCommand();
            this.addItemCommand();
        }
    }
    ;
    addAttackCommand() {
        this.addCommand(TextManager.attack, 'attack', this._actor.canAttack());
    }
    ;
    addSkillCommands() {
        const skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function (a, b) {
            return a - b;
        });
        skillTypes.forEach(function (stypeId) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, 'skill', true, stypeId);
        }, this);
    }
    ;
    addGuardCommand() {
        this.addCommand(TextManager.guard, 'guard', this._actor.canGuard());
    }
    ;
    addItemCommand() {
        this.addCommand(TextManager.item, 'item');
    }
    ;
    setup(actor) {
        this._actor = actor;
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    }
    ;
    processOk() {
        if (this._actor) {
            if (ConfigManager.commandRemember) {
                this._actor.setLastCommandSymbol(this.currentSymbol());
            }
            else {
                this._actor.setLastCommandSymbol('');
            }
        }
        super.processOk();
    }
    ;
    selectLast() {
        this.select(0);
        if (this._actor && ConfigManager.commandRemember) {
            const symbol = this._actor.lastCommandSymbol();
            this.selectSymbol(symbol);
            if (symbol === 'skill') {
                const skill = this._actor.lastBattleSkill();
                if (skill) {
                    this.selectExt(skill.stypeId);
                }
            }
        }
    }
    ;
}

// import * as PIXI from 'pixi.js';
//-----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.
class Window_BattleStatus extends Window_Selectable {
    constructor() {
        super();
        this.refresh();
        this.openness = 0;
    }
    ;
    windowWidth() {
        return Graphics.boxWidth - 192;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    }
    ;
    windowX() {
        return Graphics.boxWidth - this.windowWidth();
    }
    ;
    windowY() {
        return Graphics.boxHeight - this.windowHeight();
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    maxItems() {
        return $gameParty.battleMembers().length;
    }
    ;
    refresh() {
        this.contents.clear();
        this.drawAllItems();
    }
    ;
    drawItem(index) {
        const actor = $gameParty.battleMembers()[index];
        this.drawBasicArea(this.basicAreaRect(index), actor);
        this.drawGaugeArea(this.gaugeAreaRect(index), actor);
    }
    ;
    basicAreaRect(index) {
        const rect = this.itemRectForText(index);
        rect.width -= this.gaugeAreaWidth() + 15;
        return rect;
    }
    ;
    gaugeAreaRect(index) {
        const rect = this.itemRectForText(index);
        rect.x += rect.width - this.gaugeAreaWidth();
        rect.width = this.gaugeAreaWidth();
        return rect;
    }
    ;
    gaugeAreaWidth() {
        return 330;
    }
    ;
    drawBasicArea(rect, actor) {
        this.drawActorName(actor, rect.x + 0, rect.y, 150);
        this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
    }
    ;
    drawGaugeArea(rect, actor) {
        if ($dataSystem.optDisplayTp) {
            this.drawGaugeAreaWithTp(rect, actor);
        }
        else {
            this.drawGaugeAreaWithoutTp(rect, actor);
        }
    }
    ;
    drawGaugeAreaWithTp(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        this.drawActorMp(actor, rect.x + 123, rect.y, 96);
        this.drawActorTp(actor, rect.x + 234, rect.y, 96);
    }
    ;
    drawGaugeAreaWithoutTp(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 201);
        this.drawActorMp(actor, rect.x + 216, rect.y, 114);
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.
class Window_BattleActor extends Window_BattleStatus {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.openness = 255;
        this.hide();
    }
    ;
    show() {
        this.select(0);
        super.show();
    }
    ;
    hide() {
        super.hide();
        $gameParty.select(null);
    }
    ;
    select(index) {
        super.select(index);
        $gameParty.select(this.actor());
    }
    ;
    actor() {
        return $gameParty.members()[this.index()];
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.
class Window_BattleEnemy extends Window_Selectable {
    constructor(x, y) {
        super(x, y, undefined, undefined, function () {
            this._enemies = [];
        });
        this.refresh();
        this.hide();
    }
    ;
    windowWidth() {
        return Graphics.boxWidth - 192;
    }
    ;
    windowHeight() {
        return Window_Base.fittingHeight(this.numVisibleRows());
    }
    ;
    numVisibleRows() {
        return 4;
    }
    ;
    maxCols() {
        return 2;
    }
    ;
    maxItems() {
        return this._enemies.length;
    }
    ;
    enemy() {
        return this._enemies[this.index()];
    }
    ;
    enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    }
    ;
    drawItem(index) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemRectForText(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    }
    ;
    show() {
        this.refresh();
        this.select(0);
        super.show();
    }
    ;
    hide() {
        super.hide();
        $gameTroop.select(null);
    }
    ;
    refresh() {
        this._enemies = $gameTroop.aliveMembers();
        super.refresh();
    }
    ;
    select(index) {
        super.select(index);
        $gameTroop.select(this.enemy());
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.
class Window_BattleSkill extends Window_SkillList {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.hide();
    }
    ;
    show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }
    ;
    hide() {
        this.hideHelpWindow();
        super.hide();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.
class Window_BattleItem extends Window_ItemList {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.hide();
    }
    ;
    includes(item) {
        return $gameParty.canUse(item);
    }
    ;
    show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }
    ;
    hide() {
        this.hideHelpWindow();
        super.hide();
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.
class Window_TitleCommand extends Window_Command {
    constructor() {
        super(0, 0);
        this.updatePlacement();
        this.openness = 0;
        this.selectLast();
    }
    ;
    windowWidth() {
        return 240;
    }
    ;
    updatePlacement() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Graphics.boxHeight - this.height - 96;
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.newGame, 'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        this.addCommand(TextManager.options, 'options');
    }
    ;
    isContinueEnabled() {
        return DataManager.isAnySavefileExists();
    }
    ;
    processOk() {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }
    ;
    selectLast() {
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        }
        else if (this.isContinueEnabled()) {
            this.selectSymbol('continue');
        }
    }
    ;
}
Window_TitleCommand._lastCommandSymbol = null;
Window_TitleCommand.initCommandPosition = function () {
    this._lastCommandSymbol = null;
};

//-----------------------------------------------------------------------------
// Window_GameEnd
//
// The window for selecting "Go to Title" on the game end screen.
class Window_GameEnd extends Window_Command {
    constructor() {
        super(0, 0);
        this.updatePlacement();
        this.openness = 0;
        this.open();
    }
    ;
    windowWidth() {
        return 240;
    }
    ;
    updatePlacement() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = (Graphics.boxHeight - this.height) / 2;
    }
    ;
    makeCommandList() {
        this.addCommand(TextManager.toTitle, 'toTitle');
        this.addCommand(TextManager.cancel, 'cancel');
    }
    ;
}

//-----------------------------------------------------------------------------
// Window_DebugRange
//
// The window for selecting a block of switches/variables on the debug screen.
class Window_DebugRange extends Window_Selectable {
    constructor(x, y) {
        super(x, y, undefined, undefined, function () {
            this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);
            this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);
        });
        this.refresh();
        this.setTopRow(Window_DebugRange.lastTopRow);
        this.select(Window_DebugRange.lastIndex);
        this.activate();
    }
    ;
    windowWidth() {
        return 246;
    }
    ;
    windowHeight() {
        return Graphics.boxHeight;
    }
    ;
    maxItems() {
        return this._maxSwitches + this._maxVariables;
    }
    ;
    update() {
        super.update();
        if (this._editWindow) {
            this._editWindow.setMode(this.mode());
            this._editWindow.setTopId(this.topId());
        }
    }
    ;
    mode() {
        return this.index() < this._maxSwitches ? 'switch' : 'variable';
    }
    ;
    topId() {
        const index = this.index();
        if (index < this._maxSwitches) {
            return index * 10 + 1;
        }
        else {
            return (index - this._maxSwitches) * 10 + 1;
        }
    }
    ;
    refresh() {
        this.createContents();
        this.drawAllItems();
    }
    ;
    drawItem(index) {
        const rect = this.itemRectForText(index);
        let start;
        let text;
        if (index < this._maxSwitches) {
            start = index * 10 + 1;
            text = 'S';
        }
        else {
            start = (index - this._maxSwitches) * 10 + 1;
            text = 'V';
        }
        const end = start + 9;
        text += ' [' + start.padZero(4) + '-' + end.padZero(4) + ']';
        this.drawText(text, rect.x, rect.y, rect.width);
    }
    ;
    isCancelTriggered() {
        return (super.isCancelTriggered() ||
            Input.isTriggered('debug'));
    }
    ;
    processCancel() {
        super.processCancel();
        Window_DebugRange.lastTopRow = this.topRow();
        Window_DebugRange.lastIndex = this.index();
    }
    ;
    setEditWindow(editWindow) {
        this._editWindow = editWindow;
        this.update();
    }
    ;
}
Window_DebugRange.lastTopRow = 0;
Window_DebugRange.lastIndex = 0;

//-----------------------------------------------------------------------------
// Window_DebugEdit
//
// The window for displaying switches and variables on the debug screen.
class Window_DebugEdit extends Window_Selectable {
    constructor(x, y, width) {
        super(x, y, width, Window_Base.fittingHeight(10));
        this._mode = 'switch';
        this._topId = 1;
        this.refresh();
    }
    ;
    maxItems() {
        return 10;
    }
    ;
    refresh() {
        this.contents.clear();
        this.drawAllItems();
    }
    ;
    drawItem(index) {
        const dataId = this._topId + index;
        const idText = dataId.padZero(4) + ':';
        const idWidth = this.textWidth(idText);
        const statusWidth = this.textWidth('-00000000');
        const name = this.itemName(dataId);
        const status = this.itemStatus(dataId);
        const rect = this.itemRectForText(index);
        this.resetTextColor();
        this.drawText(idText, rect.x, rect.y, rect.width);
        rect.x += idWidth;
        rect.width -= idWidth + statusWidth;
        this.drawText(name, rect.x, rect.y, rect.width);
        this.drawText(status, rect.x + rect.width, rect.y, statusWidth, 'right');
    }
    ;
    itemName(dataId) {
        if (this._mode === 'switch') {
            return $dataSystem.switches[dataId];
        }
        else {
            return $dataSystem.variables[dataId];
        }
    }
    ;
    itemStatus(dataId) {
        if (this._mode === 'switch') {
            return $gameSwitches.value(dataId) ? '[ON]' : '[OFF]';
        }
        else {
            return String($gameVariables.value(dataId));
        }
    }
    ;
    setMode(mode) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    }
    ;
    setTopId(id) {
        if (this._topId !== id) {
            this._topId = id;
            this.refresh();
        }
    }
    ;
    currentId() {
        return this._topId + this.index();
    }
    ;
    update() {
        super.update();
        if (this.active) {
            if (this._mode === 'switch') {
                this.updateSwitch();
            }
            else {
                this.updateVariable();
            }
        }
    }
    ;
    updateSwitch() {
        if (Input.isRepeated('ok')) {
            const switchId = this.currentId();
            SoundManager.playCursor();
            $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
            this.redrawCurrentItem();
        }
    }
    ;
    updateVariable() {
        const variableId = this.currentId();
        let value = $gameVariables.value(variableId);
        if (typeof value === 'number') {
            if (Input.isRepeated('right')) {
                value++;
            }
            if (Input.isRepeated('left')) {
                value--;
            }
            if (Input.isRepeated('pagedown')) {
                value += 10;
            }
            if (Input.isRepeated('pageup')) {
                value -= 10;
            }
            if ($gameVariables.value(variableId) !== value) {
                $gameVariables.setValue(variableId, value);
                SoundManager.playCursor();
                this.redrawCurrentItem();
            }
        }
    }
    ;
}



var index$3 = Object.freeze({
	Window_ActorCommand: Window_ActorCommand,
	Window_Base: Window_Base,
	Window_BattleActor: Window_BattleActor,
	Window_BattleEnemy: Window_BattleEnemy,
	Window_BattleItem: Window_BattleItem,
	Window_BattleLog: Window_BattleLog,
	Window_BattleSkill: Window_BattleSkill,
	Window_BattleStatus: Window_BattleStatus,
	Window_ChoiceList: Window_ChoiceList,
	Window_Command: Window_Command,
	Window_DebugEdit: Window_DebugEdit,
	Window_DebugRange: Window_DebugRange,
	Window_EquipCommand: Window_EquipCommand,
	Window_EquipItem: Window_EquipItem,
	Window_EquipSlot: Window_EquipSlot,
	Window_EquipStatus: Window_EquipStatus,
	Window_GameEnd: Window_GameEnd,
	Window_Gold: Window_Gold,
	Window_Help: Window_Help,
	Window_HorzCommand: Window_HorzCommand,
	Window_ItemCategory: Window_ItemCategory,
	Window_ItemList: Window_ItemList,
	Window_MapName: Window_MapName,
	Window_MenuActor: Window_MenuActor,
	Window_MenuCommand: Window_MenuCommand,
	Window_MenuStatus: Window_MenuStatus,
	Window_Message: Window_Message,
	Window_NameEdit: Window_NameEdit,
	Window_NameInput: Window_NameInput,
	Window_NumberInput: Window_NumberInput,
	Window_Options: Window_Options,
	Window_PartyCommand: Window_PartyCommand,
	Window_SavefileList: Window_SavefileList,
	Window_ScrollText: Window_ScrollText,
	Window_Selectable: Window_Selectable,
	Window_ShopBuy: Window_ShopBuy,
	Window_ShopCommand: Window_ShopCommand,
	Window_ShopNumber: Window_ShopNumber,
	Window_ShopSell: Window_ShopSell,
	Window_ShopStatus: Window_ShopStatus,
	Window_SkillList: Window_SkillList,
	Window_SkillStatus: Window_SkillStatus,
	Window_SkillType: Window_SkillType,
	Window_Status: Window_Status,
	Window_TitleCommand: Window_TitleCommand
});

//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.
class Scene_MenuBase extends Scene_Base {
    create() {
        super.create();
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
    }
    ;
    actor() {
        return this._actor;
    }
    ;
    updateActor() {
        this._actor = $gameParty.menuActor();
    }
    ;
    createBackground() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);
    }
    ;
    setBackgroundOpacity(opacity) {
        this._backgroundSprite.opacity = opacity;
    }
    ;
    createHelpWindow() {
        this._helpWindow = new Window_Help();
        this.addWindow(this._helpWindow);
    }
    ;
    nextActor() {
        $gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    }
    ;
    previousActor() {
        $gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    }
    ;
    onActorChange() {
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_File
//
// The superclass of Scene_Save and Scene_Load.
class Scene_File extends Scene_MenuBase {
    create() {
        super.create();
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createListWindow();
    }
    ;
    start() {
        super.start();
        this._listWindow.refresh();
    }
    ;
    savefileId() {
        return this._listWindow.index() + 1;
    }
    ;
    createHelpWindow() {
        this._helpWindow = new Window_Help(1);
        this._helpWindow.setText(this.helpWindowText());
        this.addWindow(this._helpWindow);
    }
    ;
    createListWindow() {
        const x = 0;
        const y = this._helpWindow.height;
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight - y;
        this._listWindow = new Window_SavefileList(x, y, width, height);
        this._listWindow.setHandler('ok', this.onSavefileOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this._listWindow.select(this.firstSavefileIndex());
        this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
        this._listWindow.setMode(this.mode());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
    }
    ;
    mode() {
        return null;
    }
    ;
    activateListWindow() {
        this._listWindow.activate();
    }
    ;
    helpWindowText() {
        return '';
    }
    ;
    firstSavefileIndex() {
        return 0;
    }
    ;
    onSavefileOk() {
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Debug
//
// The scene class of the debug screen.
class Scene_Debug extends Scene_MenuBase {
    create() {
        super.create();
        this.createRangeWindow();
        this.createEditWindow();
        this.createDebugHelpWindow();
    }
    ;
    createRangeWindow() {
        this._rangeWindow = new Window_DebugRange(0, 0);
        this._rangeWindow.setHandler('ok', this.onRangeOk.bind(this));
        this._rangeWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._rangeWindow);
    }
    ;
    createEditWindow() {
        const wx = this._rangeWindow.width;
        const ww = Graphics.boxWidth - wx;
        this._editWindow = new Window_DebugEdit(wx, 0, ww);
        this._editWindow.setHandler('cancel', this.onEditCancel.bind(this));
        this._rangeWindow.setEditWindow(this._editWindow);
        this.addWindow(this._editWindow);
    }
    ;
    createDebugHelpWindow() {
        const wx = this._editWindow.x;
        const wy = this._editWindow.height;
        const ww = this._editWindow.width;
        const wh = Graphics.boxHeight - wy;
        this._debugHelpWindow = new Window_Base(wx, wy, ww, wh);
        this.addWindow(this._debugHelpWindow);
    }
    ;
    onRangeOk() {
        this._editWindow.activate();
        this._editWindow.select(0);
        this.refreshHelpWindow();
    }
    ;
    onEditCancel() {
        this._rangeWindow.activate();
        this._editWindow.deselect();
        this.refreshHelpWindow();
    }
    ;
    refreshHelpWindow() {
        this._debugHelpWindow.contents.clear();
        if (this._editWindow.active) {
            this._debugHelpWindow.drawTextEx(this.helpText(), 4, 0);
        }
    }
    ;
    helpText() {
        if (this._rangeWindow.mode() === 'switch') {
            return 'Enter : ON / OFF';
        }
        else {
            return ('Left     :  -1\n' +
                'Right    :  +1\n' +
                'Pageup   : -10\n' +
                'Pagedown : +10');
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Equip
//
// The scene class of the equipment screen.
class Scene_Equip extends Scene_MenuBase {
    create() {
        super.create();
        this.createHelpWindow();
        this.createStatusWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createItemWindow();
        this.refreshActor();
    }
    ;
    createStatusWindow() {
        this._statusWindow = new Window_EquipStatus(0, this._helpWindow.height);
        this.addWindow(this._statusWindow);
    }
    ;
    createCommandWindow() {
        const wx = this._statusWindow.width;
        const wy = this._helpWindow.height;
        const ww = Graphics.boxWidth - this._statusWindow.width;
        this._commandWindow = new Window_EquipCommand(wx, wy, ww);
        this._commandWindow.setHelpWindow(this._helpWindow);
        this._commandWindow.setHandler('equip', this.commandEquip.bind(this));
        this._commandWindow.setHandler('optimize', this.commandOptimize.bind(this));
        this._commandWindow.setHandler('clear', this.commandClear.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._commandWindow.setHandler('pageup', this.previousActor.bind(this));
        this.addWindow(this._commandWindow);
    }
    ;
    createSlotWindow() {
        const wx = this._statusWindow.width;
        const wy = this._commandWindow.y + this._commandWindow.height;
        const ww = Graphics.boxWidth - this._statusWindow.width;
        const wh = this._statusWindow.height - this._commandWindow.height;
        this._slotWindow = new Window_EquipSlot(wx, wy, ww, wh);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._slotWindow.setStatusWindow(this._statusWindow);
        this._slotWindow.setHandler('ok', this.onSlotOk.bind(this));
        this._slotWindow.setHandler('cancel', this.onSlotCancel.bind(this));
        this.addWindow(this._slotWindow);
    }
    ;
    createItemWindow() {
        const wx = 0;
        const wy = this._statusWindow.y + this._statusWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_EquipItem(wx, wy, ww, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setStatusWindow(this._statusWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._slotWindow.setItemWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    }
    ;
    refreshActor() {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
        this._slotWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    }
    ;
    commandEquip() {
        this._slotWindow.activate();
        this._slotWindow.select(0);
    }
    ;
    commandOptimize() {
        SoundManager.playEquip();
        this.actor().optimizeEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    }
    ;
    commandClear() {
        SoundManager.playEquip();
        this.actor().clearEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    }
    ;
    onSlotOk() {
        this._itemWindow.activate();
        this._itemWindow.select(0);
    }
    ;
    onSlotCancel() {
        this._slotWindow.deselect();
        this._commandWindow.activate();
    }
    ;
    onItemOk() {
        SoundManager.playEquip();
        this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
        this._slotWindow.activate();
        this._slotWindow.refresh();
        this._itemWindow.deselect();
        this._itemWindow.refresh();
        this._statusWindow.refresh();
    }
    ;
    onItemCancel() {
        this._slotWindow.activate();
        this._itemWindow.deselect();
    }
    ;
    onActorChange() {
        this.refreshActor();
        this._commandWindow.activate();
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Gameover
//
// The scene class of the game over screen.
class Scene_Gameover extends Scene_Base {
    create() {
        super.create();
        this.playGameoverMusic();
        this.createBackground();
    }
    ;
    start() {
        super.start();
        this.startFadeIn(this.slowFadeSpeed(), false);
    }
    ;
    update() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        super.update();
    }
    ;
    stop() {
        super.stop();
        this.fadeOutAll();
    }
    ;
    terminate() {
        super.terminate();
        AudioManager.stopAll();
    }
    ;
    playGameoverMusic() {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.playMe($dataSystem.gameoverMe);
    }
    ;
    createBackground() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem('GameOver');
        this.addChild(this._backSprite);
    }
    ;
    isTriggered() {
        return Input.isTriggered('ok') || TouchInput.isTriggered();
    }
    ;
    gotoTitle() {
        SceneManager.goto(Scene_Title);
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_ItemBase
//
// The superclass of Scene_Item and Scene_Skill.
class Scene_ItemBase extends Scene_MenuBase {
    createActorWindow() {
        this._actorWindow = new Window_MenuActor();
        this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
        this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }
    ;
    /**
     * Check whether the game should be triggering a gameover.
     *
     * @method checkGameover
     * @instance
     * @memberof Scene_Base
     */
    checkGameover() {
        if ($gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    }
    ;
    item() {
        return this._itemWindow.item();
    }
    ;
    isCursorLeft() {
        return this._itemWindow.index() % 2 === 0;
    }
    ;
    showSubWindow(window) {
        window.x = this.isCursorLeft() ? Graphics.boxWidth - window.width : 0;
        window.show();
        window.activate();
    }
    ;
    hideSubWindow(window) {
        window.hide();
        window.deactivate();
        this.activateItemWindow();
    }
    ;
    onActorOk() {
        if (this.canUse()) {
            this.useItem();
        }
        else {
            SoundManager.playBuzzer();
        }
    }
    ;
    onActorCancel() {
        this.hideSubWindow(this._actorWindow);
    }
    ;
    determineItem() {
        const action = new Game_Action(this.user());
        const item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showSubWindow(this._actorWindow);
            this._actorWindow.selectForItem(this.item());
        }
        else {
            this.useItem();
            this.activateItemWindow();
        }
    }
    ;
    useItem() {
        this.playSeForItem();
        this.user().useItem(this.item());
        this.applyItem();
        this.checkCommonEvent();
        this.checkGameover();
        this._actorWindow.refresh();
    }
    ;
    activateItemWindow() {
        this._itemWindow.refresh();
        this._itemWindow.activate();
    }
    ;
    itemTargetActors() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        if (!action.isForFriend()) {
            return [];
        }
        else if (action.isForAll()) {
            return $gameParty.members();
        }
        else {
            return [$gameParty.members()[this._actorWindow.index()]];
        }
    }
    ;
    canUse() {
        return this.user().canUse(this.item()) && this.isItemEffectsValid();
    }
    ;
    isItemEffectsValid() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        return this.itemTargetActors().some(function (target) {
            return action.testApply(target);
        }, this);
    }
    ;
    applyItem() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        this.itemTargetActors().forEach(function (target) {
            for (let i = 0; i < action.numRepeats(); i++) {
                action.apply(target);
            }
        }, this);
        action.applyGlobal();
    }
    ;
    checkCommonEvent() {
        if ($gameTemp.isCommonEventReserved()) {
            SceneManager.goto(Scene_Map);
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Item
//
// The scene class of the item screen.
class Scene_Item extends Scene_ItemBase {
    create() {
        super.create();
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
    }
    ;
    createCategoryWindow() {
        this._categoryWindow = new Window_ItemCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._helpWindow.height;
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    }
    ;
    createItemWindow() {
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
    }
    ;
    user() {
        const members = $gameParty.movableMembers();
        let bestActor = members[0];
        let bestPha = 0;
        for (let i = 0; i < members.length; i++) {
            if (members[i].pha > bestPha) {
                bestPha = members[i].pha;
                bestActor = members[i];
            }
        }
        return bestActor;
    }
    ;
    onCategoryOk() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }
    ;
    onItemOk() {
        $gameParty.setLastItem(this.item());
        this.determineItem();
    }
    ;
    onItemCancel() {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    }
    ;
    playSeForItem() {
        SoundManager.playUseItem();
    }
    ;
    useItem() {
        super.useItem();
        this._itemWindow.redrawCurrentItem();
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_GameEnd
//
// The scene class of the game end screen.
class Scene_GameEnd extends Scene_MenuBase {
    create() {
        super.create();
        this.createCommandWindow();
    }
    ;
    stop() {
        super.stop();
        this._commandWindow.close();
    }
    ;
    createBackground() {
        super.createBackground();
        this.setBackgroundOpacity(128);
    }
    ;
    createCommandWindow() {
        this._commandWindow = new Window_GameEnd();
        this._commandWindow.setHandler('toTitle', this.commandToTitle.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }
    ;
    commandToTitle() {
        this.fadeOutAll();
        SceneManager.goto(Scene_Title);
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.
class Scene_Options extends Scene_MenuBase {
    create() {
        super.create();
        this.createOptionsWindow();
    }
    ;
    terminate() {
        super.terminate();
        ConfigManager.save();
    }
    ;
    createOptionsWindow() {
        this._optionsWindow = new Window_Options();
        this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.
class Scene_Save extends Scene_File {
    mode() {
        return 'save';
    }
    ;
    helpWindowText() {
        return TextManager.saveMessage;
    }
    ;
    firstSavefileIndex() {
        return DataManager.lastAccessedSavefileId() - 1;
    }
    ;
    onSavefileOk() {
        super.onSavefileOk();
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(this.savefileId())) {
            this.onSaveSuccess();
        }
        else {
            this.onSaveFailure();
        }
    }
    ;
    onSaveSuccess() {
        SoundManager.playSave();
        StorageManager.cleanBackup(this.savefileId());
        this.popScene();
    }
    ;
    onSaveFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.
class Scene_Skill extends Scene_ItemBase {
    create() {
        super.create();
        this.createHelpWindow();
        this.createSkillTypeWindow();
        this.createStatusWindow();
        this.createItemWindow();
        this.createActorWindow();
    }
    ;
    start() {
        super.start();
        this.refreshActor();
    }
    ;
    createSkillTypeWindow() {
        const wy = this._helpWindow.height;
        this._skillTypeWindow = new Window_SkillType(0, wy);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler('skill', this.commandSkill.bind(this));
        this._skillTypeWindow.setHandler('cancel', this.popScene.bind(this));
        this._skillTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._skillTypeWindow.setHandler('pageup', this.previousActor.bind(this));
        this.addWindow(this._skillTypeWindow);
    }
    ;
    createStatusWindow() {
        const wx = this._skillTypeWindow.width;
        const wy = this._helpWindow.height;
        const ww = Graphics.boxWidth - wx;
        const wh = this._skillTypeWindow.height;
        this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    }
    ;
    createItemWindow() {
        const wx = 0;
        const wy = this._statusWindow.y + this._statusWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._skillTypeWindow.setSkillWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    }
    ;
    refreshActor() {
        const actor = this.actor();
        this._skillTypeWindow.setActor(actor);
        this._statusWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    }
    ;
    user() {
        return this.actor();
    }
    ;
    commandSkill() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }
    ;
    onItemOk() {
        this.actor().setLastMenuSkill(this.item());
        this.determineItem();
    }
    ;
    onItemCancel() {
        this._itemWindow.deselect();
        this._skillTypeWindow.activate();
    }
    ;
    playSeForItem() {
        SoundManager.playUseSkill();
    }
    ;
    useItem() {
        super.useItem();
        this._statusWindow.refresh();
        this._itemWindow.refresh();
    }
    ;
    onActorChange() {
        this.refreshActor();
        this._skillTypeWindow.activate();
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Status
//
// The scene class of the status screen.
class Scene_Status extends Scene_MenuBase {
    create() {
        super.create();
        this._statusWindow = new Window_Status();
        this._statusWindow.setHandler('cancel', this.popScene.bind(this));
        this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._statusWindow.setHandler('pageup', this.previousActor.bind(this));
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    }
    ;
    start() {
        super.start();
        this.refreshActor();
    }
    ;
    refreshActor() {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
    }
    ;
    onActorChange() {
        this.refreshActor();
        this._statusWindow.activate();
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.
class Scene_Menu extends Scene_MenuBase {
    create() {
        super.create();
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    }
    ;
    start() {
        super.start();
        this._statusWindow.refresh();
    }
    ;
    createCommandWindow() {
        this._commandWindow = new Window_MenuCommand(0, 0);
        this._commandWindow.setHandler('item', this.commandItem.bind(this));
        this._commandWindow.setHandler('skill', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this._commandWindow.setHandler('save', this.commandSave.bind(this));
        this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }
    ;
    createGoldWindow() {
        this._goldWindow = new Window_Gold(0, 0);
        this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
        this.addWindow(this._goldWindow);
    }
    ;
    createStatusWindow() {
        this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    }
    ;
    commandItem() {
        SceneManager.push(Scene_Item);
    }
    ;
    commandPersonal() {
        this._statusWindow.setFormationMode(false);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler('ok', this.onPersonalOk.bind(this));
        this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
    }
    ;
    commandFormation() {
        this._statusWindow.setFormationMode(true);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler('ok', this.onFormationOk.bind(this));
        this._statusWindow.setHandler('cancel', this.onFormationCancel.bind(this));
    }
    ;
    commandOptions() {
        SceneManager.push(Scene_Options);
    }
    ;
    commandSave() {
        SceneManager.push(Scene_Save);
    }
    ;
    commandGameEnd() {
        SceneManager.push(Scene_GameEnd);
    }
    ;
    onPersonalOk() {
        switch (this._commandWindow.currentSymbol()) {
            case 'skill':
                SceneManager.push(Scene_Skill);
                break;
            case 'equip':
                SceneManager.push(Scene_Equip);
                break;
            case 'status':
                SceneManager.push(Scene_Status);
                break;
        }
    }
    ;
    onPersonalCancel() {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
    ;
    onFormationOk() {
        const index = this._statusWindow.index();
        const actor = $gameParty.members()[index];
        const pendingIndex = this._statusWindow.pendingIndex();
        if (pendingIndex >= 0) {
            $gameParty.swapOrder(index, pendingIndex);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
        }
        else {
            this._statusWindow.setPendingIndex(index);
        }
        this._statusWindow.activate();
    }
    ;
    onFormationCancel() {
        if (this._statusWindow.pendingIndex() >= 0) {
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.activate();
        }
        else {
            this._statusWindow.deselect();
            this._commandWindow.activate();
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.
class Scene_Map extends Scene_Base {
    constructor() {
        super(...arguments);
        this._waitCount = 0;
        this._encounterEffectDuration = 0;
        this._mapLoaded = false;
        this._touchCount = 0;
    }
    create() {
        super.create();
        this._transfer = $gamePlayer.isTransferring();
        const mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
        DataManager.loadMapData(mapId);
    }
    ;
    /**
     * Check whether the game should be triggering a gameover.
     *
     * @method checkGameover
     * @instance
     * @memberof Scene_Base
     */
    checkGameover() {
        if ($gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    }
    ;
    isReady() {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this.onMapLoaded();
            this._mapLoaded = true;
        }
        return this._mapLoaded && super.isReady();
    }
    ;
    onMapLoaded() {
        if (this._transfer) {
            $gamePlayer.performTransfer();
        }
        this.createDisplayObjects();
    }
    ;
    start() {
        super.start();
        SceneManager.clearStack();
        if (this._transfer) {
            this.fadeInForTransfer();
            this._mapNameWindow.open();
            $gameMap.autoplay();
        }
        else if (this.needsFadeIn()) {
            this.startFadeIn(this.fadeSpeed(), false);
        }
        this.menuCalling = false;
    }
    ;
    update() {
        this.updateDestination();
        this.updateMainMultiply();
        if (this.isSceneChangeOk()) {
            this.updateScene();
        }
        else if (SceneManager.isNextScene(Scene_Battle)) {
            this.updateEncounterEffect();
        }
        this.updateWaitCount();
        super.update();
    }
    ;
    updateMainMultiply() {
        this.updateMain();
        if (this.isFastForward()) {
            this.updateMain();
        }
    }
    ;
    updateMain() {
        const active = this.isActive();
        $gameMap.update(active);
        $gamePlayer.update(active);
        $gameTimer.update(active);
        $gameScreen.update();
    }
    ;
    isFastForward() {
        return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
            (Input.isLongPressed('ok') || TouchInput.isLongPressed()));
    }
    ;
    stop() {
        super.stop();
        $gamePlayer.straighten();
        this._mapNameWindow.close();
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        }
        else if (SceneManager.isNextScene(Scene_Map)) {
            this.fadeOutForTransfer();
        }
        else if (SceneManager.isNextScene(Scene_Battle)) {
            this.launchBattle();
        }
    }
    ;
    isBusy() {
        return ((this._messageWindow && this._messageWindow.isClosing()) ||
            this._waitCount > 0 || this._encounterEffectDuration > 0 ||
            super.isBusy());
    }
    ;
    terminate() {
        super.terminate();
        if (!SceneManager.isNextScene(Scene_Battle)) {
            this._spriteset.update();
            this._mapNameWindow.hide();
            SceneManager.snapForBackground();
        }
        else {
            ImageManager.clearRequest();
        }
        if (SceneManager.isNextScene(Scene_Map)) {
            ImageManager.clearRequest();
        }
        $gameScreen.clearZoom();
        this.removeChild(this._fadeSprite);
        this.removeChild(this._mapNameWindow);
        this.removeChild(this._windowLayer);
        this.removeChild(this._spriteset);
    }
    ;
    needsFadeIn() {
        return (SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_Load));
    }
    ;
    needsSlowFadeOut() {
        return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover));
    }
    ;
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }
    ;
    updateDestination() {
        if (this.isMapTouchOk()) {
            this.processMapTouch();
        }
        else {
            $gameTemp.clearDestination();
            this._touchCount = 0;
        }
    }
    ;
    isMapTouchOk() {
        return this.isActive() && $gamePlayer.canMove();
    }
    ;
    processMapTouch() {
        if (TouchInput.isTriggered() || this._touchCount > 0) {
            if (TouchInput.isPressed()) {
                if (this._touchCount === 0 || this._touchCount >= 15) {
                    const x = $gameMap.canvasToMapX(TouchInput.x);
                    const y = $gameMap.canvasToMapY(TouchInput.y);
                    $gameTemp.setDestination(x, y);
                }
                this._touchCount++;
            }
            else {
                this._touchCount = 0;
            }
        }
    }
    ;
    isSceneChangeOk() {
        return this.isActive() && !$gameMessage.isBusy();
    }
    ;
    updateScene() {
        this.checkGameover();
        if (!SceneManager.isSceneChanging()) {
            this.updateTransferPlayer();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateEncounter();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallMenu();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallDebug();
        }
    }
    ;
    createDisplayObjects() {
        this.createSpriteset();
        this.createMapNameWindow();
        this.createWindowLayer();
        this.createAllWindows();
    }
    ;
    createSpriteset() {
        this._spriteset = new Spriteset_Map();
        this.addChild(this._spriteset);
    }
    ;
    createAllWindows() {
        this.createMessageWindow();
        this.createScrollTextWindow();
    }
    ;
    createMapNameWindow() {
        this._mapNameWindow = new Window_MapName();
        this.addChild(this._mapNameWindow);
    }
    ;
    createMessageWindow() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function (window) {
            this.addWindow(window);
        }, this);
    }
    ;
    createScrollTextWindow() {
        this._scrollTextWindow = new Window_ScrollText();
        this.addWindow(this._scrollTextWindow);
    }
    ;
    updateTransferPlayer() {
        if ($gamePlayer.isTransferring()) {
            SceneManager.goto(Scene_Map);
        }
    }
    ;
    updateEncounter() {
        if ($gamePlayer.executeEncounter()) {
            SceneManager.push(Scene_Battle);
        }
    }
    ;
    updateCallMenu() {
        if (this.isMenuEnabled()) {
            if (this.isMenuCalled()) {
                this.menuCalling = true;
            }
            if (this.menuCalling && !$gamePlayer.isMoving()) {
                this.callMenu();
            }
        }
        else {
            this.menuCalling = false;
        }
    }
    ;
    isMenuEnabled() {
        return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
    }
    ;
    isMenuCalled() {
        return Input.isTriggered('menu') || TouchInput.isCancelled();
    }
    ;
    callMenu() {
        SoundManager.playOk();
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
        $gameTemp.clearDestination();
        this._mapNameWindow.hide();
        this._waitCount = 2;
    }
    ;
    updateCallDebug() {
        if (this.isDebugCalled()) {
            SceneManager.push(Scene_Debug);
        }
    }
    ;
    isDebugCalled() {
        return Input.isTriggered('debug') && $gameTemp.isPlaytest();
    }
    ;
    fadeInForTransfer() {
        const fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeIn(this.fadeSpeed(), fadeType === 1);
                break;
        }
    }
    ;
    fadeOutForTransfer() {
        const fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeOut(this.fadeSpeed(), fadeType === 1);
                break;
        }
    }
    ;
    launchBattle() {
        BattleManager.saveBgmAndBgs();
        this.stopAudioOnBattleStart();
        SoundManager.playBattleStart();
        this.startEncounterEffect();
        this._mapNameWindow.hide();
    }
    ;
    stopAudioOnBattleStart() {
        if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
            AudioManager.stopBgm();
        }
        AudioManager.stopBgs();
        AudioManager.stopMe();
        AudioManager.stopSe();
    }
    ;
    startEncounterEffect() {
        this._spriteset.hideCharacters();
        this._encounterEffectDuration = this.encounterEffectSpeed();
    }
    ;
    updateEncounterEffect() {
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            const speed = this.encounterEffectSpeed();
            const n = speed - this._encounterEffectDuration;
            const p = n / speed;
            const q = ((p - 1) * 20 * p + 5) * p + 1;
            const zoomX = $gamePlayer.screenX();
            const zoomY = $gamePlayer.screenY() - 24;
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, 1);
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    }
    ;
    snapForBattleBackground() {
        this._windowLayer.visible = false;
        SceneManager.snapForBackground();
        this._windowLayer.visible = true;
    }
    ;
    startFlashForEncounter(duration) {
        const color = [255, 255, 255, 255];
        $gameScreen.startFlash(color, duration);
    }
    ;
    encounterEffectSpeed() {
        return 60;
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.
class Scene_Load extends Scene_File {
    constructor() {
        super(...arguments);
        this._loadSuccess = false;
    }
    terminate() {
        super.terminate();
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    }
    ;
    mode() {
        return 'load';
    }
    ;
    helpWindowText() {
        return TextManager.loadMessage;
    }
    ;
    firstSavefileIndex() {
        return DataManager.latestSavefileId() - 1;
    }
    ;
    onSavefileOk() {
        super.onSavefileOk();
        if (DataManager.loadGame(this.savefileId())) {
            this.onLoadSuccess();
        }
        else {
            this.onLoadFailure();
        }
    }
    ;
    onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    }
    ;
    onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
    ;
    reloadMapIfUpdated() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
            $gamePlayer.requestMapReload();
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.
class Scene_Title extends Scene_Base {
    create() {
        super.create();
        this.createBackground();
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    }
    ;
    start() {
        super.start();
        SceneManager.clearStack();
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    }
    ;
    update() {
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        super.update();
    }
    ;
    isBusy() {
        return this._commandWindow.isClosing() || super.isBusy();
    }
    ;
    terminate() {
        super.terminate();
        SceneManager.snapForBackground();
    }
    ;
    createBackground() {
        this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
        this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    }
    ;
    createForeground() {
        this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameTitleSprite);
        if ($dataSystem.optDrawTitle) {
            this.drawGameTitle();
        }
    }
    ;
    drawGameTitle() {
        const x = 20;
        const y = Graphics.height / 4;
        const maxWidth = Graphics.width - x * 2;
        const text = $dataSystem.gameTitle;
        this._gameTitleSprite.bitmap.outlineColor = 'black';
        this._gameTitleSprite.bitmap.outlineWidth = 8;
        this._gameTitleSprite.bitmap.fontSize = 72;
        this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
    }
    ;
    centerSprite(sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    }
    ;
    createCommandWindow() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this));
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    }
    ;
    commandNewGame() {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    }
    ;
    commandContinue() {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    }
    ;
    commandOptions() {
        this._commandWindow.close();
        SceneManager.push(Scene_Options);
    }
    ;
    playTitleMusic() {
        AudioManager.playBgm($dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Battle
//
// The scene class of the battle screen.
class Scene_Battle extends Scene_Base {
    create() {
        super.create();
        this.createDisplayObjects();
    }
    ;
    start() {
        super.start();
        this.startFadeIn(this.fadeSpeed(), false);
        BattleManager.playBattleBgm();
        BattleManager.startBattle();
    }
    ;
    update() {
        const active = this.isActive();
        $gameTimer.update(active);
        $gameScreen.update();
        this.updateStatusWindow();
        this.updateWindowPositions();
        if (active && !this.isBusy()) {
            this.updateBattleProcess();
        }
        super.update();
    }
    ;
    updateBattleProcess() {
        if (!this.isAnyInputWindowActive() || BattleManager.isAborting() ||
            BattleManager.isBattleEnd()) {
            BattleManager.update();
            this.changeInputWindow();
        }
    }
    ;
    isAnyInputWindowActive() {
        return (this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active);
    }
    ;
    changeInputWindow() {
        if (BattleManager.isInputting()) {
            if (BattleManager.actor()) {
                this.startActorCommandSelection();
            }
            else {
                this.startPartyCommandSelection();
            }
        }
        else {
            this.endCommandSelection();
        }
    }
    ;
    stop() {
        super.stop();
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        }
        else {
            this.startFadeOut(this.fadeSpeed(), false);
        }
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    }
    ;
    terminate() {
        super.terminate();
        $gameParty.onBattleEnd();
        $gameTroop.onBattleEnd();
        AudioManager.stopMe();
        ImageManager.clearRequest();
    }
    ;
    needsSlowFadeOut() {
        return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover));
    }
    ;
    updateStatusWindow() {
        if ($gameMessage.isBusy()) {
            this._statusWindow.close();
            this._partyCommandWindow.close();
            this._actorCommandWindow.close();
        }
        else if (this.isActive() && !this._messageWindow.isClosing()) {
            this._statusWindow.open();
        }
    }
    ;
    updateWindowPositions() {
        let statusX = 0;
        if (BattleManager.isInputting()) {
            statusX = this._partyCommandWindow.width;
        }
        else {
            statusX = this._partyCommandWindow.width / 2;
        }
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x += 16;
            if (this._statusWindow.x > statusX) {
                this._statusWindow.x = statusX;
            }
        }
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x -= 16;
            if (this._statusWindow.x < statusX) {
                this._statusWindow.x = statusX;
            }
        }
    }
    ;
    createDisplayObjects() {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        BattleManager.setLogWindow(this._logWindow);
        BattleManager.setStatusWindow(this._statusWindow);
        BattleManager.setSpriteset(this._spriteset);
        this._logWindow.setSpriteset(this._spriteset);
    }
    ;
    createSpriteset() {
        this._spriteset = new Spriteset_Battle();
        this.addChild(this._spriteset);
    }
    ;
    createAllWindows() {
        this.createLogWindow();
        this.createStatusWindow();
        this.createPartyCommandWindow();
        this.createActorCommandWindow();
        this.createHelpWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createEnemyWindow();
        this.createMessageWindow();
        this.createScrollTextWindow();
    }
    ;
    createLogWindow() {
        this._logWindow = new Window_BattleLog();
        this.addWindow(this._logWindow);
    }
    ;
    createStatusWindow() {
        this._statusWindow = new Window_BattleStatus();
        this.addWindow(this._statusWindow);
    }
    ;
    createPartyCommandWindow() {
        this._partyCommandWindow = new Window_PartyCommand();
        this._partyCommandWindow.setHandler('fight', this.commandFight.bind(this));
        this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
        this._partyCommandWindow.deselect();
        this.addWindow(this._partyCommandWindow);
    }
    ;
    createActorCommandWindow() {
        this._actorCommandWindow = new Window_ActorCommand();
        this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
        this._actorCommandWindow.setHandler('skill', this.commandSkill.bind(this));
        this._actorCommandWindow.setHandler('guard', this.commandGuard.bind(this));
        this._actorCommandWindow.setHandler('item', this.commandItem.bind(this));
        this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
        this.addWindow(this._actorCommandWindow);
    }
    ;
    createHelpWindow() {
        this._helpWindow = new Window_Help();
        this._helpWindow.visible = false;
        this.addWindow(this._helpWindow);
    }
    ;
    createSkillWindow() {
        const wy = this._helpWindow.y + this._helpWindow.height;
        const wh = this._statusWindow.y - wy;
        this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
        this._skillWindow.setHelpWindow(this._helpWindow);
        this._skillWindow.setHandler('ok', this.onSkillOk.bind(this));
        this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
        this.addWindow(this._skillWindow);
    }
    ;
    createItemWindow() {
        const wy = this._helpWindow.y + this._helpWindow.height;
        const wh = this._statusWindow.y - wy;
        this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
    }
    ;
    createActorWindow() {
        this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
        this._actorWindow.setHandler('ok', this.onActorOk.bind(this));
        this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }
    ;
    createEnemyWindow() {
        this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
        this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
        this._enemyWindow.setHandler('ok', this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
        this.addWindow(this._enemyWindow);
    }
    ;
    createMessageWindow() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function (window) {
            this.addWindow(window);
        }, this);
    }
    ;
    createScrollTextWindow() {
        this._scrollTextWindow = new Window_ScrollText();
        this.addWindow(this._scrollTextWindow);
    }
    ;
    refreshStatus() {
        this._statusWindow.refresh();
    }
    ;
    startPartyCommandSelection() {
        this.refreshStatus();
        this._statusWindow.deselect();
        this._statusWindow.open();
        this._actorCommandWindow.close();
        this._partyCommandWindow.setup();
    }
    ;
    commandFight() {
        this.selectNextCommand();
    }
    ;
    commandEscape() {
        BattleManager.processEscape();
        this.changeInputWindow();
    }
    ;
    startActorCommandSelection() {
        this._statusWindow.select(BattleManager.actor().index());
        this._partyCommandWindow.close();
        this._actorCommandWindow.setup(BattleManager.actor());
    }
    ;
    commandAttack() {
        BattleManager.inputtingAction().setAttack();
        this.selectEnemySelection();
    }
    ;
    commandSkill() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
    }
    ;
    commandGuard() {
        BattleManager.inputtingAction().setGuard();
        this.selectNextCommand();
    }
    ;
    commandItem() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
    }
    ;
    selectNextCommand() {
        BattleManager.selectNextCommand();
        this.changeInputWindow();
    }
    ;
    selectPreviousCommand() {
        BattleManager.selectPreviousCommand();
        this.changeInputWindow();
    }
    ;
    selectActorSelection() {
        this._actorWindow.refresh();
        this._actorWindow.show();
        this._actorWindow.activate();
    }
    ;
    onActorOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._actorWindow.index());
        this._actorWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
        this.selectNextCommand();
    }
    ;
    onActorCancel() {
        this._actorWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'skill':
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case 'item':
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    }
    ;
    selectEnemySelection() {
        this._enemyWindow.refresh();
        this._enemyWindow.show();
        this._enemyWindow.select(0);
        this._enemyWindow.activate();
    }
    ;
    onEnemyOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._enemyWindow.enemyIndex());
        this._enemyWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
        this.selectNextCommand();
    }
    ;
    onEnemyCancel() {
        this._enemyWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case 'attack':
                this._actorCommandWindow.activate();
                break;
            case 'skill':
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case 'item':
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    }
    ;
    onSkillOk() {
        const skill = this._skillWindow.item();
        const action = BattleManager.inputtingAction();
        action.setSkill(skill.id);
        BattleManager.actor().setLastBattleSkill(skill);
        this.onSelectAction();
    }
    ;
    onSkillCancel() {
        this._skillWindow.hide();
        this._actorCommandWindow.activate();
    }
    ;
    onItemOk() {
        const item = this._itemWindow.item();
        const action = BattleManager.inputtingAction();
        action.setItem(item.id);
        $gameParty.setLastItem(item);
        this.onSelectAction();
    }
    ;
    onItemCancel() {
        this._itemWindow.hide();
        this._actorCommandWindow.activate();
    }
    ;
    onSelectAction() {
        const action = BattleManager.inputtingAction();
        this._skillWindow.hide();
        this._itemWindow.hide();
        if (!action.needsSelection()) {
            this.selectNextCommand();
        }
        else if (action.isForOpponent()) {
            this.selectEnemySelection();
        }
        else {
            this.selectActorSelection();
        }
    }
    ;
    endCommandSelection() {
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
        this._statusWindow.deselect();
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Boot
//
// The scene class for initializing the entire game.
class Scene_Boot extends Scene_Base {
    constructor() {
        super(...arguments);
        this._startDate = Date.now();
    }
    create() {
        super.create();
        DataManager.loadDatabase();
        ConfigManager.load();
        this.loadSystemWindowImage();
    }
    ;
    loadSystemWindowImage() {
        ImageManager.reserveSystem('Window');
    }
    ;
    static loadSystemImages() {
        ImageManager.reserveSystem('IconSet');
        ImageManager.reserveSystem('Balloon');
        ImageManager.reserveSystem('Shadow1');
        ImageManager.reserveSystem('Shadow2');
        ImageManager.reserveSystem('Damage');
        ImageManager.reserveSystem('States');
        ImageManager.reserveSystem('Weapons1');
        ImageManager.reserveSystem('Weapons2');
        ImageManager.reserveSystem('Weapons3');
        ImageManager.reserveSystem('ButtonSet');
    }
    ;
    isReady() {
        if (super.isReady()) {
            return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
        }
        else {
            return false;
        }
    }
    ;
    isGameFontLoaded() {
        if (Graphics.isFontLoaded('GameFont')) {
            return true;
        }
        else if (!Graphics.canUseCssFontLoading()) {
            const elapsed = Date.now() - this._startDate;
            if (elapsed >= 60000) {
                throw new Error('Failed to load GameFont');
            }
        }
    }
    ;
    start() {
        super.start();
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        }
        else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            SceneManager.goto(Scene_Map);
        }
        else {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Title);
            Window_TitleCommand.initCommandPosition();
        }
        this.updateDocumentTitle();
    }
    ;
    updateDocumentTitle() {
        document.title = $dataSystem.gameTitle;
    }
    ;
    checkPlayerLocation() {
        if ($dataSystem.startMapId === 0) {
            throw new Error('Player\'s starting position is not set');
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Shop
//
// The scene class of the shop screen.
class Scene_Shop extends Scene_MenuBase {
    prepare(goods, purchaseOnly) {
        this._goods = goods;
        this._purchaseOnly = purchaseOnly;
        this._item = null;
    }
    ;
    create() {
        super.create();
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createNumberWindow();
        this.createStatusWindow();
        this.createBuyWindow();
        this.createCategoryWindow();
        this.createSellWindow();
    }
    ;
    createGoldWindow() {
        this._goldWindow = new Window_Gold(0, this._helpWindow.height);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    }
    ;
    createCommandWindow() {
        this._commandWindow = new Window_ShopCommand(this._goldWindow.x, this._purchaseOnly);
        this._commandWindow.y = this._helpWindow.height;
        this._commandWindow.setHandler('buy', this.commandBuy.bind(this));
        this._commandWindow.setHandler('sell', this.commandSell.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }
    ;
    createDummyWindow() {
        const wy = this._commandWindow.y + this._commandWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
        this.addWindow(this._dummyWindow);
    }
    ;
    createNumberWindow() {
        const wy = this._dummyWindow.y;
        const wh = this._dummyWindow.height;
        this._numberWindow = new Window_ShopNumber(0, wy, wh);
        this._numberWindow.hide();
        this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
        this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    }
    ;
    createStatusWindow() {
        const wx = this._numberWindow.width;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - wx;
        const wh = this._dummyWindow.height;
        this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);
    }
    ;
    createBuyWindow() {
        const wy = this._dummyWindow.y;
        const wh = this._dummyWindow.height;
        this._buyWindow = new Window_ShopBuy(0, wy, wh, this._goods);
        this._buyWindow.setHelpWindow(this._helpWindow);
        this._buyWindow.setStatusWindow(this._statusWindow);
        this._buyWindow.hide();
        this._buyWindow.setHandler('ok', this.onBuyOk.bind(this));
        this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);
    }
    ;
    createCategoryWindow() {
        this._categoryWindow = new Window_ItemCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._dummyWindow.y;
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    }
    ;
    createSellWindow() {
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._sellWindow = new Window_ShopSell(0, wy, Graphics.boxWidth, wh);
        this._sellWindow.setHelpWindow(this._helpWindow);
        this._sellWindow.hide();
        this._sellWindow.setHandler('ok', this.onSellOk.bind(this));
        this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
        this._categoryWindow.setItemWindow(this._sellWindow);
        this.addWindow(this._sellWindow);
    }
    ;
    activateBuyWindow() {
        this._buyWindow.setMoney(this.money());
        this._buyWindow.show();
        this._buyWindow.activate();
        this._statusWindow.show();
    }
    ;
    activateSellWindow() {
        this._categoryWindow.show();
        this._sellWindow.refresh();
        this._sellWindow.show();
        this._sellWindow.activate();
        this._statusWindow.hide();
    }
    ;
    commandBuy() {
        this._dummyWindow.hide();
        this.activateBuyWindow();
    }
    ;
    commandSell() {
        this._dummyWindow.hide();
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this._sellWindow.show();
        this._sellWindow.deselect();
        this._sellWindow.refresh();
    }
    ;
    onBuyOk() {
        this._item = this._buyWindow.item();
        this._buyWindow.hide();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
    }
    ;
    onBuyCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._buyWindow.hide();
        this._statusWindow.hide();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    }
    ;
    onCategoryOk() {
        this.activateSellWindow();
        this._sellWindow.select(0);
    }
    ;
    onCategoryCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._categoryWindow.hide();
        this._sellWindow.hide();
    }
    ;
    onSellOk() {
        this._item = this._sellWindow.item();
        this._categoryWindow.hide();
        this._sellWindow.hide();
        this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
        this._statusWindow.show();
    }
    ;
    onSellCancel() {
        this._sellWindow.deselect();
        this._categoryWindow.activate();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    }
    ;
    onNumberOk() {
        SoundManager.playShop();
        switch (this._commandWindow.currentSymbol()) {
            case 'buy':
                this.doBuy(this._numberWindow.number());
                break;
            case 'sell':
                this.doSell(this._numberWindow.number());
                break;
        }
        this.endNumberInput();
        this._goldWindow.refresh();
        this._statusWindow.refresh();
    }
    ;
    onNumberCancel() {
        SoundManager.playCancel();
        this.endNumberInput();
    }
    ;
    doBuy(number) {
        $gameParty.loseGold(number * this.buyingPrice());
        $gameParty.gainItem(this._item, number);
    }
    ;
    doSell(number) {
        $gameParty.gainGold(number * this.sellingPrice());
        $gameParty.loseItem(this._item, number);
    }
    ;
    endNumberInput() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
            case 'buy':
                this.activateBuyWindow();
                break;
            case 'sell':
                this.activateSellWindow();
                break;
        }
    }
    ;
    maxBuy() {
        const max = $gameParty.maxItems(this._item) - $gameParty.numItems(this._item);
        const price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        }
        else {
            return max;
        }
    }
    ;
    maxSell() {
        return $gameParty.numItems(this._item);
    }
    ;
    money() {
        return this._goldWindow.value();
    }
    ;
    currencyUnit() {
        return this._goldWindow.currencyUnit();
    }
    ;
    buyingPrice() {
        return this._buyWindow.price(this._item);
    }
    ;
    sellingPrice() {
        return Math.floor(this._item.price / 2);
    }
    ;
}

//-----------------------------------------------------------------------------
// Scene_Name
//
// The scene class of the name input screen.
class Scene_Name extends Scene_MenuBase {
    prepare(actorId, maxLength) {
        this._actorId = actorId;
        this._maxLength = maxLength;
    }
    ;
    create() {
        super.create();
        this._actor = $gameActors.actor(this._actorId);
        this.createEditWindow();
        this.createInputWindow();
    }
    ;
    start() {
        super.start();
        this._editWindow.refresh();
    }
    ;
    createEditWindow() {
        this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
    }
    ;
    createInputWindow() {
        this._inputWindow = new Window_NameInput(this._editWindow);
        this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
        this.addWindow(this._inputWindow);
    }
    ;
    onInputOk() {
        this._actor.setName(this._editWindow.name);
        this.popScene();
    }
    ;
}



var index$2 = Object.freeze({
	Scene_Base: Scene_Base,
	Scene_Battle: Scene_Base,
	Scene_Boot: Scene_Boot,
	Scene_Debug: Scene_Debug,
	Scene_Equip: Scene_Equip,
	Scene_File: Scene_File,
	Scene_GameEnd: Scene_GameEnd,
	Scene_Gameover: Scene_Gameover,
	Scene_Item: Scene_Item,
	Scene_ItemBase: Scene_ItemBase,
	Scene_Load: Scene_Load,
	Scene_Map: Scene_Map,
	Scene_Menu: Scene_Menu,
	Scene_MenuBase: Scene_MenuBase,
	Scene_Name: Scene_Name,
	Scene_Save: Scene_Save,
	Scene_Shop: Scene_Shop,
	Scene_Skill: Scene_Skill,
	Scene_Status: Scene_Status,
	Scene_Title: Scene_Title
});

class AudioManager {
    static get masterVolume() {
        return this._masterVolume;
    }
    static set masterVolume(value) {
        this._masterVolume = value;
        WebAudio.setMasterVolume(this._masterVolume);
        Graphics.setVideoVolume(this._masterVolume);
    }
    static get bgmVolume() {
        return this._bgmVolume;
    }
    static set bgmVolume(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    }
    static get bgsVolume() {
        return this._bgsVolume;
    }
    static set bgsVolume(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    }
    static get meVolume() {
        return this._meVolume;
    }
    static set meVolume(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    }
    static get seVolume() {
        return this._seVolume;
    }
    static set seVolume(value) {
        this._seVolume = value;
    }
    static playBgm(bgm, pos) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        }
        else {
            this.stopBgm();
            if (bgm.name) {
                this._bgmBuffer = this.createBuffer('bgm', bgm.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
        this.updateCurrentBgm(bgm, pos);
    }
    ;
    static replayBgm(bgm) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        }
        else {
            this.playBgm(bgm, bgm.pos);
            if (this._bgmBuffer) {
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }
    ;
    static isCurrentBgm(bgm) {
        return (this._currentBgm && this._bgmBuffer &&
            this._currentBgm.name === bgm.name);
    }
    ;
    static updateBgmParameters(bgm) {
        this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
    }
    ;
    static updateCurrentBgm(bgm, pos) {
        this._currentBgm = {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: pos
        };
    }
    ;
    static stopBgm() {
        if (this._bgmBuffer) {
            this._bgmBuffer.stop();
            this._bgmBuffer = null;
            this._currentBgm = null;
        }
    }
    ;
    static fadeOutBgm(duration) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeOut(duration);
            this._currentBgm = null;
        }
    }
    ;
    static fadeInBgm(duration) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeIn(duration);
        }
    }
    ;
    static playBgs(bgs, pos) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        }
        else {
            this.stopBgs();
            if (bgs.name) {
                this._bgsBuffer = this.createBuffer('bgs', bgs.name);
                this.updateBgsParameters(bgs);
                this._bgsBuffer.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs(bgs, pos);
    }
    ;
    static replayBgs(bgs) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        }
        else {
            this.playBgs(bgs, bgs.pos);
            if (this._bgsBuffer) {
                this._bgsBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }
    ;
    static isCurrentBgs(bgs) {
        return (this._currentBgs && this._bgsBuffer &&
            this._currentBgs.name === bgs.name);
    }
    ;
    static updateBgsParameters(bgs) {
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
    }
    ;
    static updateCurrentBgs(bgs, pos) {
        this._currentBgs = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        };
    }
    ;
    static stopBgs() {
        if (this._bgsBuffer) {
            this._bgsBuffer.stop();
            this._bgsBuffer = null;
            this._currentBgs = null;
        }
    }
    ;
    static fadeOutBgs(duration) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeOut(duration);
            this._currentBgs = null;
        }
    }
    ;
    static fadeInBgs(duration) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeIn(duration);
        }
    }
    ;
    static playMe(me) {
        this.stopMe();
        if (me.name) {
            if (this._bgmBuffer && this._currentBgm) {
                this._currentBgm.pos = this._bgmBuffer.seek();
                this._bgmBuffer.stop();
            }
            this._meBuffer = this.createBuffer('me', me.name);
            this.updateMeParameters(me);
            this._meBuffer.play(false);
            this._meBuffer.addStopListener(this.stopMe.bind(this));
        }
    }
    ;
    static updateMeParameters(me) {
        this.updateBufferParameters(this._meBuffer, this._meVolume, me);
    }
    ;
    static fadeOutMe(duration) {
        if (this._meBuffer) {
            this._meBuffer.fadeOut(duration);
        }
    }
    ;
    static stopMe() {
        if (this._meBuffer) {
            this._meBuffer.stop();
            this._meBuffer = null;
            if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
                this._bgmBuffer.play(true, this._currentBgm.pos);
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }
    ;
    static playSe(se) {
        if (se.name) {
            this._seBuffers = this._seBuffers.filter(function (audio) {
                return audio.isPlaying();
            });
            const buffer = this.createBuffer('se', se.name);
            this.updateSeParameters(buffer, se);
            buffer.play(false, 0); /// bungcip: edited to make it compile
            this._seBuffers.push(buffer);
        }
    }
    ;
    static updateSeParameters(buffer, se) {
        this.updateBufferParameters(buffer, this._seVolume, se);
    }
    ;
    static stopSe() {
        this._seBuffers.forEach(function (buffer) {
            buffer.stop();
        });
        this._seBuffers = [];
    }
    ;
    static playStaticSe(se) {
        if (se.name) {
            this.loadStaticSe(se);
            for (let i = 0; i < this._staticBuffers.length; i++) {
                const buffer = this._staticBuffers[i];
                if (buffer['_reservedSeName'] === se.name) {
                    buffer.stop();
                    this.updateSeParameters(buffer, se);
                    buffer.play(false);
                    break;
                }
            }
        }
    }
    ;
    static loadStaticSe(se) {
        if (se.name && !this.isStaticSe(se)) {
            const buffer = this.createBuffer('se', se.name);
            buffer['_reservedSeName'] = se.name;
            this._staticBuffers.push(buffer);
            if (this.shouldUseHtml5Audio()) {
                Html5Audio.setStaticSe(buffer.url);
            }
        }
    }
    ;
    static isStaticSe(se) {
        for (let i = 0; i < this._staticBuffers.length; i++) {
            const buffer = this._staticBuffers[i];
            if (buffer['_reservedSeName'] === se.name) {
                return true;
            }
        }
        return false;
    }
    ;
    static stopAll() {
        this.stopMe();
        this.stopBgm();
        this.stopBgs();
        this.stopSe();
    }
    ;
    static saveBgm() {
        if (this._currentBgm) {
            const bgm = this._currentBgm;
            return {
                name: bgm.name,
                volume: bgm.volume,
                pitch: bgm.pitch,
                pan: bgm.pan,
                pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
            };
        }
        else {
            return this.makeEmptyAudioObject();
        }
    }
    ;
    static saveBgs() {
        if (this._currentBgs) {
            const bgs = this._currentBgs;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
            };
        }
        else {
            return this.makeEmptyAudioObject();
        }
    }
    ;
    static makeEmptyAudioObject() {
        return { name: '', volume: 0, pitch: 0 };
    }
    ;
    static createBuffer(folder, name) {
        const ext = this.audioFileExt();
        const url = this._path + folder + '/' + encodeURIComponent(name) + ext;
        if (this.shouldUseHtml5Audio() && folder === 'bgm') {
            if (this._blobUrl)
                Html5Audio.setup(this._blobUrl);
            else
                Html5Audio.setup(url);
            return Html5Audio;
        }
        else {
            return new WebAudio(url);
        }
    }
    ;
    static updateBufferParameters(buffer, configVolume, audio) {
        if (buffer && audio) {
            buffer.volume = configVolume * (audio.volume || 0) / 10000;
            buffer.pitch = (audio.pitch || 0) / 100;
            buffer.pan = (audio.pan || 0) / 100;
        }
    }
    ;
    static audioFileExt() {
        if (WebAudio.canPlayOgg()) {
            return '.ogg';
        }
        else {
            return '.m4a';
        }
    }
    ;
    static shouldUseHtml5Audio() {
        // The only case where we wanted html5audio was android/ no encrypt
        // Atsuma-ru asked to force webaudio there too, so just return false for ALL 
        return false;
    }
    ;
    static checkErrors() {
        this.checkWebAudioError(this._bgmBuffer);
        this.checkWebAudioError(this._bgsBuffer);
        this.checkWebAudioError(this._meBuffer);
        this._seBuffers.forEach(function (buffer) {
            this.checkWebAudioError(buffer);
        }.bind(this));
        this._staticBuffers.forEach(function (buffer) {
            this.checkWebAudioError(buffer);
        }.bind(this));
    }
    ;
    static checkWebAudioError(webAudio) {
        if (webAudio && webAudio.isError()) {
            throw new Error('Failed to load: ' + webAudio.url);
        }
    }
    ;
}
AudioManager._masterVolume = 1; // (min: 0, max: 1)
AudioManager._bgmVolume = 100;
AudioManager._bgsVolume = 100;
AudioManager._meVolume = 100;
AudioManager._seVolume = 100;
AudioManager._currentBgm = null;
AudioManager._currentBgs = null;
AudioManager._bgmBuffer = null;
AudioManager._bgsBuffer = null;
AudioManager._meBuffer = null;
AudioManager._seBuffers = [];
AudioManager._staticBuffers = [];
AudioManager._replayFadeTime = 0.5;
AudioManager._path = 'audio/';
AudioManager._blobUrl = null;

//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.
class ImageManager {
    static _generateCacheKey(path, hue) {
        return path + ':' + hue;
    }
    ;
    static loadAnimation(filename, hue) {
        return this.loadBitmap('img/animations/', filename, hue, true);
    }
    ;
    static loadBattleback1(filename, hue) {
        return this.loadBitmap('img/battlebacks1/', filename, hue, true);
    }
    ;
    static loadBattleback2(filename, hue) {
        return this.loadBitmap('img/battlebacks2/', filename, hue, true);
    }
    ;
    static loadEnemy(filename, hue) {
        return this.loadBitmap('img/enemies/', filename, hue, true);
    }
    ;
    static loadCharacter(filename, hue) {
        return this.loadBitmap('img/characters/', filename, hue, false);
    }
    ;
    static loadFace(filename, hue) {
        return this.loadBitmap('img/faces/', filename, hue, true);
    }
    ;
    static loadParallax(filename, hue) {
        return this.loadBitmap('img/parallaxes/', filename, hue, true);
    }
    ;
    static loadPicture(filename, hue) {
        return this.loadBitmap('img/pictures/', filename, hue, true);
    }
    ;
    static loadSvActor(filename, hue) {
        return this.loadBitmap('img/sv_actors/', filename, hue, false);
    }
    ;
    static loadSvEnemy(filename, hue) {
        return this.loadBitmap('img/sv_enemies/', filename, hue, true);
    }
    ;
    static loadSystem(filename, hue) {
        return this.loadBitmap('img/system/', filename, hue, false);
    }
    ;
    static loadTileset(filename, hue) {
        return this.loadBitmap('img/tilesets/', filename, hue, false);
    }
    ;
    static loadTitle1(filename, hue) {
        return this.loadBitmap('img/titles1/', filename, hue, true);
    }
    ;
    static loadTitle2(filename, hue) {
        return this.loadBitmap('img/titles2/', filename, hue, true);
    }
    ;
    static loadBitmap(folder, filename, hue = 0, smooth) {
        if (filename) {
            const path = folder + encodeURIComponent(filename) + '.png';
            const bitmap = this.loadNormalBitmap(path, hue);
            bitmap.smooth = smooth;
            return bitmap;
        }
        else {
            return this.loadEmptyBitmap();
        }
    }
    ;
    static loadEmptyBitmap() {
        let empty = this._imageCache.get('empty');
        if (!empty) {
            empty = new Bitmap();
            this._imageCache.add('empty', empty);
            this._imageCache.reserve('empty', empty, this._systemReservationId);
        }
        return empty;
    }
    ;
    static loadNormalBitmap(path, hue) {
        const key = this._generateCacheKey(path, hue);
        let bitmap = this._imageCache.get(key);
        if (!bitmap) {
            bitmap = Bitmap.load(path);
            bitmap.addLoadListener(function () {
                bitmap.rotateHue(hue);
            });
            this._imageCache.add(key, bitmap);
        }
        else if (!bitmap.isReady()) {
            bitmap.decode();
        }
        return bitmap;
    }
    ;
    static clear() {
        this._imageCache = new ImageCache();
    }
    ;
    static isReady() {
        return this._imageCache.isReady();
    }
    ;
    static isObjectCharacter(filename) {
        const sign = filename.match(/^[\!\$]+/);
        return sign && sign[0].contains('!');
    }
    ;
    static isBigCharacter(filename) {
        const sign = filename.match(/^[\!\$]+/);
        return sign && sign[0].contains('$');
    }
    ;
    static isZeroParallax(filename) {
        return filename.charAt(0) === '!';
    }
    ;
    static reserveAnimation(filename, hue, reservationId) {
        return this.reserveBitmap('img/animations/', filename, hue, true, reservationId);
    }
    ;
    static reserveBattleback1(filename, hue, reservationId) {
        return this.reserveBitmap('img/battlebacks1/', filename, hue, true, reservationId);
    }
    ;
    static reserveBattleback2(filename, hue, reservationId) {
        return this.reserveBitmap('img/battlebacks2/', filename, hue, true, reservationId);
    }
    ;
    static reserveEnemy(filename, hue, reservationId) {
        return this.reserveBitmap('img/enemies/', filename, hue, true, reservationId);
    }
    ;
    static reserveCharacter(filename, hue, reservationId) {
        return this.reserveBitmap('img/characters/', filename, hue, false, reservationId);
    }
    ;
    static reserveFace(filename, hue, reservationId) {
        return this.reserveBitmap('img/faces/', filename, hue, true, reservationId);
    }
    ;
    static reserveParallax(filename, hue, reservationId) {
        return this.reserveBitmap('img/parallaxes/', filename, hue, true, reservationId);
    }
    ;
    static reservePicture(filename, hue, reservationId) {
        return this.reserveBitmap('img/pictures/', filename, hue, true, reservationId);
    }
    ;
    static reserveSvActor(filename, hue, reservationId) {
        return this.reserveBitmap('img/sv_actors/', filename, hue, false, reservationId);
    }
    ;
    static reserveSvEnemy(filename, hue, reservationId) {
        return this.reserveBitmap('img/sv_enemies/', filename, hue, true, reservationId);
    }
    ;
    static reserveSystem(filename, hue, reservationId) {
        return this.reserveBitmap('img/system/', filename, hue, false, reservationId || this._systemReservationId);
    }
    ;
    static reserveTileset(filename, hue, reservationId) {
        return this.reserveBitmap('img/tilesets/', filename, hue, false, reservationId);
    }
    ;
    static reserveTitle1(filename, hue, reservationId) {
        return this.reserveBitmap('img/titles1/', filename, hue, true, reservationId);
    }
    ;
    static reserveTitle2(filename, hue, reservationId) {
        return this.reserveBitmap('img/titles2/', filename, hue, true, reservationId);
    }
    ;
    static reserveBitmap(folder, filename, hue = 0, smooth, reservationId = ImageManager._defaultReservationId) {
        if (filename) {
            const path = folder + encodeURIComponent(filename) + '.png';
            const bitmap = this.reserveNormalBitmap(path, hue, reservationId || this._defaultReservationId);
            bitmap.smooth = smooth;
            return bitmap;
        }
        else {
            return this.loadEmptyBitmap();
        }
    }
    ;
    static reserveNormalBitmap(path, hue, reservationId) {
        const bitmap = this.loadNormalBitmap(path, hue);
        this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);
        return bitmap;
    }
    ;
    static releaseReservation(reservationId) {
        this._imageCache.releaseReservation(reservationId);
    }
    ;
    static setDefaultReservationId(reservationId) {
        this._defaultReservationId = reservationId;
    }
    ;
    static requestAnimation(filename, hue) {
        return this.requestBitmap('img/animations/', filename, hue, true);
    }
    ;
    static requestBattleback1(filename, hue) {
        return this.requestBitmap('img/battlebacks1/', filename, hue, true);
    }
    ;
    static requestBattleback2(filename, hue) {
        return this.requestBitmap('img/battlebacks2/', filename, hue, true);
    }
    ;
    static requestEnemy(filename, hue) {
        return this.requestBitmap('img/enemies/', filename, hue, true);
    }
    ;
    static requestCharacter(filename, hue) {
        return this.requestBitmap('img/characters/', filename, hue, false);
    }
    ;
    static requestFace(filename, hue) {
        return this.requestBitmap('img/faces/', filename, hue, true);
    }
    ;
    static requestParallax(filename, hue) {
        return this.requestBitmap('img/parallaxes/', filename, hue, true);
    }
    ;
    static requestPicture(filename, hue) {
        return this.requestBitmap('img/pictures/', filename, hue, true);
    }
    ;
    static requestSvActor(filename, hue) {
        return this.requestBitmap('img/sv_actors/', filename, hue, false);
    }
    ;
    static requestSvEnemy(filename, hue) {
        return this.requestBitmap('img/sv_enemies/', filename, hue, true);
    }
    ;
    static requestSystem(filename, hue) {
        return this.requestBitmap('img/system/', filename, hue, false);
    }
    ;
    static requestTileset(filename, hue) {
        return this.requestBitmap('img/tilesets/', filename, hue, false);
    }
    ;
    static requestTitle1(filename, hue) {
        return this.requestBitmap('img/titles1/', filename, hue, true);
    }
    ;
    static requestTitle2(filename, hue) {
        return this.requestBitmap('img/titles2/', filename, hue, true);
    }
    ;
    static requestBitmap(folder, filename, hue, smooth) {
        if (filename) {
            const path = folder + encodeURIComponent(filename) + '.png';
            const bitmap = this.requestNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        }
        else {
            return this.loadEmptyBitmap();
        }
    }
    ;
    static requestNormalBitmap(path, hue) {
        const key = this._generateCacheKey(path, hue);
        let bitmap = this._imageCache.get(key);
        if (!bitmap) {
            bitmap = Bitmap.request(path);
            bitmap.addLoadListener(function () {
                bitmap.rotateHue(hue);
            });
            this._imageCache.add(key, bitmap);
            this._requestQueue.enqueue(key, bitmap);
        }
        else {
            this._requestQueue.raisePriority(key);
        }
        return bitmap;
    }
    ;
    static update() {
        this._requestQueue.update();
    }
    ;
    static clearRequest() {
        this._requestQueue.clear();
    }
    ;
}
ImageManager.cache = new CacheMap(ImageManager);
ImageManager._imageCache = new ImageCache();
ImageManager._requestQueue = new RequestQueue();
ImageManager._systemReservationId = Utils.generateRuntimeId();

//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.
class PluginManager {
    static setup(plugins) {
        plugins.forEach(function (plugin) {
            if (plugin.status && !this._scripts.contains(plugin.name)) {
                this.setParameters(plugin.name, plugin.parameters);
                this.loadScript(plugin.name + '.js');
                this._scripts.push(plugin.name);
            }
        }, this);
    }
    ;
    static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            throw new Error('Failed to load: ' + url);
        }
    }
    ;
    static parameters(name) {
        return this._parameters[name.toLowerCase()] || {};
    }
    ;
    static setParameters(name, parameters) {
        this._parameters[name.toLowerCase()] = parameters;
    }
    ;
    static loadScript(name) {
        const url = `${this._path + name}`;
        // import(`/plugins/${ name }`).catch(e => console.info(e));
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        script['_url'] = url;
        document.body.appendChild(script);
    }
    ;
    static onError(e) {
        this._errorUrls.push(e.target['_url']);
    }
    ;
}
PluginManager._path = 'js/plugins/';
PluginManager._scripts = [];
PluginManager._errorUrls = [];
PluginManager._parameters = {};

//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.
class SceneManager {
    static get screenWidth() {
        return this._screenWidth;
    }
    static get screenHeight() {
        return this._screenWidth;
    }
    static set screenWidth(val) {
        this._screenWidth = val;
    }
    static set screenHeight(val) {
        this._screenWidth = val;
    }
    static get boxWidth() {
        return this.boxWidth;
    }
    static get boxHeight() {
        return this._boxWidth;
    }
    static set boxWidth(val) {
        this._boxWidth = val;
    }
    static set boxHeight(val) {
        this.boxWidth = val;
    }
    static run(sceneClass) {
        try {
            this.initialize();
            this.goto(sceneClass);
            this.requestUpdate();
        }
        catch (e) {
            this.catchException(e);
        }
    }
    ;
    static initialize() {
        this.initGraphics();
        this.checkFileAccess();
        this.initAudio();
        this.initInput();
        this.initNwjs();
        this.checkPluginErrors();
        this.setupErrorHandlers();
    }
    ;
    static initGraphics() {
        try {
            Graphics.initialize(this._screenWidth, this._screenHeight);
        }
        catch (e) {
            this.onError(e);
        }
        Graphics.boxWidth = this._boxWidth;
        Graphics.boxHeight = this._boxHeight;
        Graphics.setLoadingImage('img/system/Loading.png');
        if (Utils.isOptionValid('showfps')) {
            Graphics.showFps();
        }
        this.checkWebGL();
    }
    ;
    static shouldUseCanvasRenderer() {
        return false;
    }
    ;
    static checkWebGL() {
        if (!Graphics.hasWebGL()) {
            throw new Error('Your browser does not support WebGL.');
        }
    }
    ;
    static checkFileAccess() {
        if (!Utils.canReadGameFiles()) {
            throw new Error('Your browser does not allow to read local files.');
        }
    }
    ;
    static initAudio() {
        const noAudio = Utils.isOptionValid('noaudio');
        if (!WebAudio.initialize(noAudio) && !noAudio) {
            throw new Error('Your browser does not support Web Audio API.');
        }
    }
    ;
    static initInput() {
        Input.initialize();
        TouchInput.initialize();
    }
    ;
    static initNwjs() {
        if (Utils.isNwjs()) {
            let require = window['require']; // bungcip: changed to make it compile
            let process = window['process']; // bungcip: changed to make it compile
            const gui = require('nw.gui');
            const win = gui.Window.get();
            if (process.platform === 'darwin' && !win.menu) {
                const menubar = new gui.Menu({ type: 'menubar' });
                const option = { hideEdit: true, hideWindow: true };
                menubar.createMacBuiltin('Game', option);
                win.menu = menubar;
            }
        }
    }
    ;
    static checkPluginErrors() {
        PluginManager.checkErrors();
    }
    ;
    static setupErrorHandlers() {
        window.addEventListener('error', this.onError.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    ;
    static requestUpdate() {
        if (!this._stopped) {
            requestAnimationFrame(this.update.bind(this));
        }
    }
    ;
    static update() {
        try {
            this.tickStart();
            this.updateManagers();
            this.updateMain();
            this.tickEnd();
        }
        catch (e) {
            this.catchException(e);
        }
    }
    ;
    static terminate() {
        window.close();
    }
    ;
    static onError(e) {
        console.error(e.message);
        console.error(e.filename, e.lineno);
        try {
            this.stop();
            Graphics.printError('Error', e.message);
            AudioManager.stopAll();
        }
        catch (e2) {
        }
    }
    ;
    static onKeyDown(event) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 116:// F5
                    if (Utils.isNwjs()) {
                        location.reload();
                    }
                    break;
                case 119:// F8
                    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                        let require = window['require']; // bungcip: changed to make it compile
                        require('nw.gui').Window.get().showDevTools();
                    }
                    break;
            }
        }
    }
    ;
    static catchException(e) {
        if (e instanceof Error) {
            Graphics.printError(e.name, e.message);
            console.error(e.stack);
        }
        else {
            Graphics.printError('UnknownError', e);
        }
        AudioManager.stopAll();
        this.stop();
    }
    ;
    static tickStart() {
        Graphics.tickStart();
    }
    ;
    static tickEnd() {
        Graphics.tickEnd();
    }
    ;
    static updateInputData() {
        Input.update();
        TouchInput.update();
    }
    ;
    static updateMain() {
        const newTime = this._getTimeInMsWithoutMobileSafari();
        let fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25) {
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
    }
    ;
    static updateManagers() {
        ImageManager.update();
    }
    ;
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
    }
    ;
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
    }
    ;
    static renderScene() {
        if (this.isCurrentSceneStarted()) {
            Graphics.render(this._scene);
        }
        else if (this._scene) {
            this.onSceneLoading();
        }
    }
    ;
    static onSceneCreate() {
        Graphics.startLoading();
    }
    ;
    static onSceneStart() {
        Graphics.endLoading();
    }
    ;
    static onSceneLoading() {
        Graphics.updateLoading();
    }
    ;
    static isSceneChanging() {
        return this._exiting || !!this._nextScene;
    }
    ;
    static isCurrentSceneBusy() {
        return this._scene && this._scene.isBusy();
    }
    ;
    static isCurrentSceneStarted() {
        return this._scene && this._sceneStarted;
    }
    ;
    static isNextScene(sceneClass) {
        return this._nextScene && this._nextScene.constructor === sceneClass;
    }
    ;
    static isPreviousScene(sceneClass) {
        return this._previousClass === sceneClass;
    }
    ;
    static goto(sceneClass) {
        if (sceneClass) {
            this._nextScene = new sceneClass();
        }
        if (this._scene) {
            this._scene.stop();
        }
    }
    ;
    static push(sceneClass) {
        this._stack.push(this._scene.constructor);
        this.goto(sceneClass);
    }
    ;
    static pop() {
        if (this._stack.length > 0) {
            this.goto(this._stack.pop());
        }
        else {
            this.exit();
        }
    }
    ;
    static exit() {
        this.goto(null);
        this._exiting = true;
    }
    ;
    static clearStack() {
        this._stack = [];
    }
    ;
    static stop() {
        this._stopped = true;
    }
    ;
    static prepareNextScene(...arg) {
        /// bungcip: prepare() only exist in Shop/NameInput
        this._nextScene.prepare.apply(this._nextScene, arg);
    }
    ;
    static snap() {
        return Bitmap.snap(this._scene);
    }
    ;
    static snapForBackground() {
        this._backgroundBitmap = this.snap();
        this._backgroundBitmap.blur();
    }
    ;
    static backgroundBitmap() {
        return this._backgroundBitmap;
    }
    ;
    static resume() {
        this._stopped = false;
        this.requestUpdate();
        this._currentTime = this._getTimeInMsWithoutMobileSafari();
        this._accumulator = 0;
    }
    ;
}
/*
* Gets the current time in ms without on iOS Safari.
* @private
*/
SceneManager._getTimeInMsWithoutMobileSafari = function () {
    return performance.now();
};
SceneManager._scene = null;
SceneManager._nextScene = null;
SceneManager._stack = [];
SceneManager._stopped = false;
SceneManager._sceneStarted = false;
SceneManager._exiting = false;
SceneManager._previousClass = null;
SceneManager._backgroundBitmap = null;
SceneManager._screenWidth = 816;
SceneManager._screenHeight = 624;
SceneManager._boxWidth = 816;
SceneManager._boxHeight = 624;
SceneManager._deltaTime = 1.0 / 60.0;
SceneManager._currentTime = SceneManager._getTimeInMsWithoutMobileSafari();
SceneManager._accumulator = 0.0;

//-----------------------------------------------------------------------------
// SoundManager
//
// The static class that plays sound effects defined in the database.
class SoundManager {
    static preloadImportantSounds() {
        this.loadSystemSound(0);
        this.loadSystemSound(1);
        this.loadSystemSound(2);
        this.loadSystemSound(3);
    }
    ;
    static loadSystemSound(n) {
        if ($dataSystem) {
            AudioManager.loadStaticSe($dataSystem.sounds[n]);
        }
    }
    ;
    static playSystemSound(n) {
        if ($dataSystem) {
            AudioManager.playStaticSe($dataSystem.sounds[n]);
        }
    }
    ;
    static playCursor() {
        this.playSystemSound(0);
    }
    ;
    static playOk() {
        this.playSystemSound(1);
    }
    ;
    static playCancel() {
        this.playSystemSound(2);
    }
    ;
    static playBuzzer() {
        this.playSystemSound(3);
    }
    ;
    static playEquip() {
        this.playSystemSound(4);
    }
    ;
    static playSave() {
        this.playSystemSound(5);
    }
    ;
    static playLoad() {
        this.playSystemSound(6);
    }
    ;
    static playBattleStart() {
        this.playSystemSound(7);
    }
    ;
    static playEscape() {
        this.playSystemSound(8);
    }
    ;
    static playEnemyAttack() {
        this.playSystemSound(9);
    }
    ;
    static playEnemyDamage() {
        this.playSystemSound(10);
    }
    ;
    static playEnemyCollapse() {
        this.playSystemSound(11);
    }
    ;
    static playBossCollapse1() {
        this.playSystemSound(12);
    }
    ;
    static playBossCollapse2() {
        this.playSystemSound(13);
    }
    ;
    static playActorDamage() {
        this.playSystemSound(14);
    }
    ;
    static playActorCollapse() {
        this.playSystemSound(15);
    }
    ;
    static playRecovery() {
        this.playSystemSound(16);
    }
    ;
    static playMiss() {
        this.playSystemSound(17);
    }
    ;
    static playEvasion() {
        this.playSystemSound(18);
    }
    ;
    static playMagicEvasion() {
        this.playSystemSound(19);
    }
    ;
    static playReflection() {
        this.playSystemSound(20);
    }
    ;
    static playShop() {
        this.playSystemSound(21);
    }
    ;
    static playUseItem() {
        this.playSystemSound(22);
    }
    ;
    static playUseSkill() {
        this.playSystemSound(23);
    }
    ;
}

//-----------------------------------------------------------------------------
// TextManager
//
// The static class that handles terms and messages.
class TextManager {
    static basic(basicId) {
        return $dataSystem.terms.basic[basicId] || '';
    }
    ;
    static param(paramId) {
        return $dataSystem.terms.params[paramId] || '';
    }
    ;
    static command(commandId) {
        return $dataSystem.terms.commands[commandId] || '';
    }
    ;
    static message(messageId) {
        return $dataSystem.terms.messages[messageId] || '';
    }
    ;
    static get currencyUnit() { return $dataSystem.currencyUnit; }
    static get level() { return this.basic(0); }
    static get levelA() { return this.basic(1); }
    static get hp() { return this.basic(2); }
    static get hpA() { return this.basic(3); }
    static get mp() { return this.basic(4); }
    static get mpA() { return this.basic(5); }
    static get tp() { return this.basic(6); }
    static get tpA() { return this.basic(7); }
    static get exp() { return this.basic(8); }
    static get expA() { return this.basic(9); }
    static get fight() { return this.command(0); }
    static get escape() { return this.command(1); }
    static get attack() { return this.command(2); }
    static get guard() { return this.command(3); }
    static get item() { return this.command(4); }
    static get skill() { return this.command(5); }
    static get equip() { return this.command(6); }
    static get status() { return this.command(7); }
    static get formation() { return this.command(8); }
    static get save() { return this.command(9); }
    static get gameEnd() { return this.command(10); }
    static get options() { return this.command(11); }
    static get weapon() { return this.command(12); }
    static get armor() { return this.command(13); }
    static get keyItem() { return this.command(14); }
    static get equip2() { return this.command(15); }
    static get optimize() { return this.command(16); }
    static get clear() { return this.command(17); }
    static get newGame() { return this.command(18); }
    static get continue_() { return this.command(19); }
    static get toTitle() { return this.command(21); }
    static get cancel() { return this.command(22); }
    static get buy() { return this.command(24); }
    static get sell() { return this.command(25); }
    static get alwaysDash() { return this.message('alwaysDash'); }
    static get commandRemember() { return this.message('commandRemember'); }
    static get bgmVolume() { return this.message('bgmVolume'); }
    static get bgsVolume() { return this.message('bgsVolume'); }
    static get meVolume() { return this.message('meVolume'); }
    static get seVolume() { return this.message('seVolume'); }
    static get possession() { return this.message('possession'); }
    static get expTotal() { return this.message('expTotal'); }
    static get expNext() { return this.message('expNext'); }
    static get saveMessage() { return this.message('saveMessage'); }
    static get loadMessage() { return this.message('loadMessage'); }
    static get file() { return this.message('file'); }
    static get partyName() { return this.message('partyName'); }
    static get emerge() { return this.message('emerge'); }
    static get preemptive() { return this.message('preemptive'); }
    static get surprise() { return this.message('surprise'); }
    static get escapeStart() { return this.message('escapeStart'); }
    static get escapeFailure() { return this.message('escapeFailure'); }
    static get victory() { return this.message('victory'); }
    static get defeat() { return this.message('defeat'); }
    static get obtainExp() { return this.message('obtainExp'); }
    static get obtainGold() { return this.message('obtainGold'); }
    static get obtainItem() { return this.message('obtainItem'); }
    static get levelUp() { return this.message('levelUp'); }
    static get obtainSkill() { return this.message('obtainSkill'); }
    static get useItem() { return this.message('useItem'); }
    static get criticalToEnemy() { return this.message('criticalToEnemy'); }
    static get criticalToActor() { return this.message('criticalToActor'); }
    static get actorDamage() { return this.message('actorDamage'); }
    static get actorRecovery() { return this.message('actorRecovery'); }
    static get actorGain() { return this.message('actorGain'); }
    static get actorLoss() { return this.message('actorLoss'); }
    static get actorDrain() { return this.message('actorDrain'); }
    static get actorNoDamage() { return this.message('actorNoDamage'); }
    static get actorNoHit() { return this.message('actorNoHit'); }
    static get enemyDamage() { return this.message('enemyDamage'); }
    static get enemyRecovery() { return this.message('enemyRecovery'); }
    static get enemyGain() { return this.message('enemyGain'); }
    static get enemyLoss() { return this.message('enemyLoss'); }
    static get enemyDrain() { return this.message('enemyDrain'); }
    static get enemyNoDamage() { return this.message('enemyNoDamage'); }
    static get enemyNoHit() { return this.message('enemyNoHit'); }
    static get evasion() { return this.message('evasion'); }
    static get magicEvasion() { return this.message('magicEvasion'); }
    static get magicReflection() { return this.message('magicReflection'); }
    static get counterAttack() { return this.message('counterAttack'); }
    static get substitute() { return this.message('substitute'); }
    static get buffAdd() { return this.message('buffAdd'); }
    static get debuffAdd() { return this.message('debuffAdd'); }
    static get buffRemove() { return this.message('buffRemove'); }
    static get actionFailure() { return this.message('actionFailure'); }
}

class BattleManager {
    static setup(troopId, canEscape, canLose) {
        this.initMembers();
        this._canEscape = canEscape;
        this._canLose = canLose;
        $gameTroop.setup(troopId);
        $gameScreen.onBattleStart();
        this.makeEscapeRatio();
    }
    ;
    static initMembers() {
        this._phase = 'init';
        this._canEscape = false;
        this._canLose = false;
        this._battleTest = false;
        this._eventCallback = null;
        this._preemptive = false;
        this._surprise = false;
        this._actorIndex = -1;
        this._actionForcedBattler = null;
        this._mapBgm = null;
        this._mapBgs = null;
        this._actionBattlers = [];
        this._subject = null;
        this._action = null;
        this._targets = [];
        this._logWindow = null;
        this._statusWindow = null;
        this._spriteset = null;
        this._escapeRatio = 0;
        this._escaped = false;
        this._rewards = {};
    }
    ;
    static isBattleTest() {
        return this._battleTest;
    }
    ;
    static setBattleTest(battleTest) {
        this._battleTest = battleTest;
    }
    ;
    static setEventCallback(callback) {
        this._eventCallback = callback;
    }
    ;
    static setLogWindow(logWindow) {
        this._logWindow = logWindow;
    }
    ;
    static setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
    }
    ;
    static setSpriteset(spriteset) {
        this._spriteset = spriteset;
    }
    ;
    static onEncounter() {
        this._preemptive = (Math.random() < this.ratePreemptive());
        this._surprise = (Math.random() < this.rateSurprise() && !this._preemptive);
    }
    ;
    static ratePreemptive() {
        return $gameParty.ratePreemptive($gameTroop.agility());
    }
    ;
    static rateSurprise() {
        return $gameParty.rateSurprise($gameTroop.agility());
    }
    ;
    static saveBgmAndBgs() {
        this._mapBgm = AudioManager.saveBgm();
        this._mapBgs = AudioManager.saveBgs();
    }
    ;
    static playBattleBgm() {
        AudioManager.playBgm($gameSystem.battleBgm());
        AudioManager.stopBgs();
    }
    ;
    static playVictoryMe() {
        AudioManager.playMe($gameSystem.victoryMe());
    }
    ;
    static playDefeatMe() {
        AudioManager.playMe($gameSystem.defeatMe());
    }
    ;
    static replayBgmAndBgs() {
        if (this._mapBgm) {
            AudioManager.replayBgm(this._mapBgm);
        }
        else {
            AudioManager.stopBgm();
        }
        if (this._mapBgs) {
            AudioManager.replayBgs(this._mapBgs);
        }
    }
    ;
    static makeEscapeRatio() {
        this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
    }
    ;
    static update() {
        if (!this.isBusy() && !this.updateEvent()) {
            switch (this._phase) {
                case 'start':
                    this.startInput();
                    break;
                case 'turn':
                    this.updateTurn();
                    break;
                case 'action':
                    this.updateAction();
                    break;
                case 'turnEnd':
                    this.updateTurnEnd();
                    break;
                case 'battleEnd':
                    this.updateBattleEnd();
                    break;
            }
        }
    }
    ;
    static updateEvent() {
        switch (this._phase) {
            case 'start':
            case 'turn':
            case 'turnEnd':
                if (this.isActionForced()) {
                    this.processForcedAction();
                    return true;
                }
                else {
                    return this.updateEventMain();
                }
        }
        return this.checkAbort2();
    }
    ;
    static updateEventMain() {
        $gameTroop.updateInterpreter();
        $gameParty.requestMotionRefresh();
        if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
            return true;
        }
        $gameTroop.setupBattleEvent();
        if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
            return true;
        }
        return false;
    }
    ;
    static isBusy() {
        return ($gameMessage.isBusy() || this._spriteset.isBusy() ||
            this._logWindow.isBusy());
    }
    ;
    static isInputting() {
        return this._phase === 'input';
    }
    ;
    static isInTurn() {
        return this._phase === 'turn';
    }
    ;
    static isTurnEnd() {
        return this._phase === 'turnEnd';
    }
    ;
    static isAborting() {
        return this._phase === 'aborting';
    }
    ;
    static isBattleEnd() {
        return this._phase === 'battleEnd';
    }
    ;
    static canEscape() {
        return this._canEscape;
    }
    ;
    static canLose() {
        return this._canLose;
    }
    ;
    static isEscaped() {
        return this._escaped;
    }
    ;
    static actor() {
        return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
    }
    ;
    static clearActor() {
        this.changeActor(-1, '');
    }
    ;
    static changeActor(newActorIndex, lastActorActionState) {
        const lastActor = this.actor();
        this._actorIndex = newActorIndex;
        const newActor = this.actor();
        if (lastActor) {
            lastActor.setActionState(lastActorActionState);
        }
        if (newActor) {
            newActor.setActionState('inputting');
        }
    }
    ;
    static startBattle() {
        this._phase = 'start';
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart();
        $gameTroop.onBattleStart();
        this.displayStartMessages();
    }
    ;
    static displayStartMessages() {
        $gameTroop.enemyNames().forEach(function (name) {
            $gameMessage.add(TextManager.emerge.format(name));
        });
        if (this._preemptive) {
            $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
        }
        else if (this._surprise) {
            $gameMessage.add(TextManager.surprise.format($gameParty.name()));
        }
    }
    ;
    static startInput() {
        this._phase = 'input';
        $gameParty.makeActions();
        $gameTroop.makeActions();
        this.clearActor();
        if (this._surprise || !$gameParty.canInput()) {
            this.startTurn();
        }
    }
    ;
    static inputtingAction() {
        return this.actor() ? this.actor().inputtingAction() : null;
    }
    ;
    static selectNextCommand() {
        do {
            if (!this.actor() || !this.actor().selectNextCommand()) {
                this.changeActor(this._actorIndex + 1, 'waiting');
                if (this._actorIndex >= $gameParty.size()) {
                    this.startTurn();
                    break;
                }
            }
        } while (!this.actor().canInput());
    }
    ;
    static selectPreviousCommand() {
        do {
            if (!this.actor() || !this.actor().selectPreviousCommand()) {
                this.changeActor(this._actorIndex - 1, 'undecided');
                if (this._actorIndex < 0) {
                    return;
                }
            }
        } while (!this.actor().canInput());
    }
    ;
    static refreshStatus() {
        this._statusWindow.refresh();
    }
    ;
    static startTurn() {
        this._phase = 'turn';
        this.clearActor();
        $gameTroop.increaseTurn();
        this.makeActionOrders();
        $gameParty.requestMotionRefresh();
        this._logWindow.startTurn();
    }
    ;
    static updateTurn() {
        $gameParty.requestMotionRefresh();
        if (!this._subject) {
            this._subject = this.getNextSubject();
        }
        if (this._subject) {
            this.processTurn();
        }
        else {
            this.endTurn();
        }
    }
    ;
    static processTurn() {
        const subject = this._subject;
        const action = subject.currentAction();
        if (action) {
            action.prepare();
            if (action.isValid()) {
                this.startAction();
            }
            subject.removeCurrentAction();
        }
        else {
            subject.onAllActionsEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(subject);
            this._logWindow.displayCurrentState(subject);
            this._logWindow.displayRegeneration(subject);
            this._subject = this.getNextSubject();
        }
    }
    ;
    static endTurn() {
        this._phase = 'turnEnd';
        this._preemptive = false;
        this._surprise = false;
        this.allBattleMembers().forEach(function (battler) {
            battler.onTurnEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(battler);
            this._logWindow.displayRegeneration(battler);
        }, this);
    }
    ;
    static updateTurnEnd() {
        this.startInput();
    }
    ;
    static getNextSubject() {
        for (;;) {
            const battler = this._actionBattlers.shift();
            if (!battler) {
                return null;
            }
            if (battler.isBattleMember() && battler.isAlive()) {
                return battler;
            }
        }
    }
    ;
    static allBattleMembers() {
        const enemies = $gameTroop.members();
        const parties = $gameParty.members();
        return parties.concat(enemies);
    }
    ;
    static makeActionOrders() {
        let battlers = [];
        if (!this._surprise) {
            battlers = battlers.concat($gameParty.members());
        }
        if (!this._preemptive) {
            battlers = battlers.concat($gameTroop.members());
        }
        battlers.forEach(function (battler) {
            battler.makeSpeed();
        });
        battlers.sort(function (a, b) {
            return b.speed() - a.speed();
        });
        this._actionBattlers = battlers;
    }
    ;
    static startAction() {
        const subject = this._subject;
        const action = subject.currentAction();
        const targets = action.makeTargets();
        this._phase = 'action';
        this._action = action;
        this._targets = targets;
        subject.useItem(action.item());
        this._action.applyGlobal();
        this.refreshStatus();
        this._logWindow.startAction(subject, action, targets);
    }
    ;
    static updateAction() {
        const target = this._targets.shift();
        if (target) {
            this.invokeAction(this._subject, target);
        }
        else {
            this.endAction();
        }
    }
    ;
    static endAction() {
        this._logWindow.endAction(this._subject);
        this._phase = 'turn';
    }
    ;
    static invokeAction(subject, target) {
        this._logWindow.push('pushBaseLine');
        if (Math.random() < this._action.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        }
        else if (Math.random() < this._action.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        }
        else {
            this.invokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        this._logWindow.push('popBaseLine');
        this.refreshStatus();
    }
    ;
    static invokeNormalAction(subject, target) {
        /// bungcip: changed to make it compiled
        // const realTarget = this.applySubstitute(target);
        const realTarget = this.applySubstitute(subject, target);
        this._action.apply(realTarget);
        this._logWindow.displayActionResults(subject, realTarget);
    }
    ;
    static invokeCounterAttack(subject, target) {
        const action = new Game_Action(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow.displayCounter(target);
        this._logWindow.displayActionResults(target, subject);
    }
    ;
    static invokeMagicReflection(subject, target) {
        this._action._reflectionTarget = target;
        this._logWindow.displayReflection(target);
        this._action.apply(subject);
        this._logWindow.displayActionResults(target, subject);
    }
    ;
    static applySubstitute(subject, target) {
        if (this.checkSubstitute(target)) {
            const substitute = target.friendsUnit().substituteBattler();
            if (substitute && target !== substitute) {
                this._logWindow.displaySubstitute(substitute, target);
                return substitute;
            }
        }
        return target;
    }
    ;
    static checkSubstitute(target) {
        return target.isDying() && !this._action.isCertainHit();
    }
    ;
    static isActionForced() {
        return !!this._actionForcedBattler;
    }
    ;
    static forceAction(battler) {
        this._actionForcedBattler = battler;
        const index = this._actionBattlers.indexOf(battler);
        if (index >= 0) {
            this._actionBattlers.splice(index, 1);
        }
    }
    ;
    static processForcedAction() {
        if (this._actionForcedBattler) {
            this._subject = this._actionForcedBattler;
            this._actionForcedBattler = null;
            this.startAction();
            this._subject.removeCurrentAction();
        }
    }
    ;
    static abort() {
        this._phase = 'aborting';
    }
    ;
    static checkBattleEnd() {
        if (this._phase) {
            if (this.checkAbort()) {
                return true;
            }
            else if ($gameParty.isAllDead()) {
                this.processDefeat();
                return true;
            }
            else if ($gameTroop.isAllDead()) {
                this.processVictory();
                return true;
            }
        }
        return false;
    }
    ;
    static checkAbort() {
        if ($gameParty.isEmpty() || this.isAborting()) {
            this.processAbort();
            return true;
        }
        return false;
    }
    ;
    static checkAbort2() {
        if ($gameParty.isEmpty() || this.isAborting()) {
            SoundManager.playEscape();
            this._escaped = true;
            this.processAbort();
        }
        return false;
    }
    ;
    static processVictory() {
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        this.displayVictoryMessage();
        this.displayRewards();
        this.gainRewards();
        this.endBattle(0);
    }
    ;
    static processEscape() {
        $gameParty.performEscape();
        SoundManager.playEscape();
        const success = this._preemptive ? true : (Math.random() < this._escapeRatio);
        if (success) {
            this.displayEscapeSuccessMessage();
            this._escaped = true;
            this.processAbort();
        }
        else {
            this.displayEscapeFailureMessage();
            this._escapeRatio += 0.1;
            $gameParty.clearActions();
            this.startTurn();
        }
        return success;
    }
    ;
    static processAbort() {
        $gameParty.removeBattleStates();
        this.replayBgmAndBgs();
        this.endBattle(1);
    }
    ;
    static processDefeat() {
        this.displayDefeatMessage();
        this.playDefeatMe();
        if (this._canLose) {
            this.replayBgmAndBgs();
        }
        else {
            AudioManager.stopBgm();
        }
        this.endBattle(2);
    }
    ;
    static endBattle(result) {
        this._phase = 'battleEnd';
        if (this._eventCallback) {
            this._eventCallback(result);
        }
        if (result === 0) {
            $gameSystem.onBattleWin();
        }
        else if (this._escaped) {
            $gameSystem.onBattleEscape();
        }
    }
    ;
    static updateBattleEnd() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        }
        else if (!this._escaped && $gameParty.isAllDead()) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            }
            else {
                SceneManager.goto(Scene_Gameover);
            }
        }
        else {
            SceneManager.pop();
        }
        this._phase = null;
    }
    ;
    static makeRewards() {
        this._rewards = {
            gold: $gameTroop.goldTotal(),
            exp: $gameTroop.expTotal(),
            items: $gameTroop.makeDropItems()
        };
    }
    ;
    static displayVictoryMessage() {
        $gameMessage.add(TextManager.victory.format($gameParty.name()));
    }
    ;
    static displayDefeatMessage() {
        $gameMessage.add(TextManager.defeat.format($gameParty.name()));
    }
    ;
    static displayEscapeSuccessMessage() {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    }
    ;
    static displayEscapeFailureMessage() {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
        $gameMessage.add('\\.' + TextManager.escapeFailure);
    }
    ;
    static displayRewards() {
        this.displayExp();
        this.displayGold();
        this.displayDropItems();
    }
    ;
    static displayExp() {
        const exp = this._rewards.exp;
        if (exp > 0) {
            const text = TextManager.obtainExp.format(exp, TextManager.exp);
            $gameMessage.add('\\.' + text);
        }
    }
    ;
    static displayGold() {
        const gold = this._rewards.gold;
        if (gold > 0) {
            $gameMessage.add('\\.' + TextManager.obtainGold.format(gold));
        }
    }
    ;
    static displayDropItems() {
        const items = this._rewards.items;
        if (items.length > 0) {
            $gameMessage.newPage();
            items.forEach(function (item) {
                $gameMessage.add(TextManager.obtainItem.format(item.name));
            });
        }
    }
    ;
    static gainRewards() {
        this.gainExp();
        this.gainGold();
        this.gainDropItems();
    }
    ;
    static gainExp() {
        const exp = this._rewards.exp;
        $gameParty.allMembers().forEach(function (actor) {
            actor.gainExp(exp);
        });
    }
    ;
    static gainGold() {
        $gameParty.gainGold(this._rewards.gold);
    }
    ;
    static gainDropItems() {
        const items = this._rewards.items;
        items.forEach(function (item) {
            $gameParty.gainItem(item, 1);
        });
    }
    ;
}

//-----------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.
class StorageManager {
    static save(savefileId, json) {
        if (this.isLocalMode()) {
            this.saveToLocalFile(savefileId, json);
        }
        else {
            this.saveToWebStorage(savefileId, json);
        }
    }
    ;
    static load(savefileId) {
        if (this.isLocalMode()) {
            return this.loadFromLocalFile(savefileId);
        }
        else {
            return this.loadFromWebStorage(savefileId);
        }
    }
    ;
    static exists(savefileId) {
        if (this.isLocalMode()) {
            return this.localFileExists(savefileId);
        }
        else {
            return this.webStorageExists(savefileId);
        }
    }
    ;
    static remove(savefileId) {
        if (this.isLocalMode()) {
            this.removeLocalFile(savefileId);
        }
        else {
            this.removeWebStorage(savefileId);
        }
    }
    ;
    static backup(savefileId) {
        if (this.exists(savefileId)) {
            if (this.isLocalMode()) {
                const data = this.loadFromLocalFile(savefileId);
                const compressed = LZString.compressToBase64(data);
                let require = window['require']; // bungcip: changed to make it compile
                const fs = require('fs');
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId) + ".bak";
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
            }
            else {
                const data = this.loadFromWebStorage(savefileId);
                const compressed = LZString.compressToBase64(data);
                const key = this.webStorageKey(savefileId) + "bak";
                localStorage.setItem(key, compressed);
            }
        }
    }
    ;
    static backupExists(savefileId) {
        if (this.isLocalMode()) {
            return this.localFileBackupExists(savefileId);
        }
        else {
            return this.webStorageBackupExists(savefileId);
        }
    }
    ;
    static cleanBackup(savefileId) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                let require = window['require']; // bungcip: changed to make it compile
                const fs = require('fs');
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId);
                fs.unlinkSync(filePath + ".bak");
            }
            else {
                const key = this.webStorageKey(savefileId);
                localStorage.removeItem(key + "bak");
            }
        }
    }
    ;
    static restoreBackup(savefileId) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                const data = this.loadFromLocalBackupFile(savefileId);
                const compressed = LZString.compressToBase64(data);
                let require = window['require']; // bungcip: changed to make it compile
                const fs = require('fs');
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
                fs.unlinkSync(filePath + ".bak");
            }
            else {
                const data = this.loadFromWebStorageBackup(savefileId);
                const compressed = LZString.compressToBase64(data);
                const key = this.webStorageKey(savefileId);
                localStorage.setItem(key, compressed);
                localStorage.removeItem(key + "bak");
            }
        }
    }
    ;
    static isLocalMode() {
        return Utils.isNwjs();
    }
    ;
    static saveToLocalFile(savefileId, json) {
        const data = LZString.compressToBase64(json);
        let require = window['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        const dirPath = this.localFileDirectoryPath();
        const filePath = this.localFilePath(savefileId);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    }
    ;
    static loadFromLocalFile(savefileId) {
        let data = null;
        const require = window['process']; // bungcip: changed to make it compile
        const fs = require('fs');
        const filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    }
    ;
    static loadFromLocalBackupFile(savefileId) {
        let data = null;
        let require = window['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        const filePath = this.localFilePath(savefileId) + ".bak";
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    }
    ;
    static localFileBackupExists(savefileId) {
        let require = window['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        return fs.existsSync(this.localFilePath(savefileId) + ".bak");
    }
    ;
    static localFileExists(savefileId) {
        let require = window['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        return fs.existsSync(this.localFilePath(savefileId));
    }
    ;
    static removeLocalFile(savefileId) {
        let require = window['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        const filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    ;
    static saveToWebStorage(savefileId, json) {
        const key = this.webStorageKey(savefileId);
        const data = LZString.compressToBase64(json);
        localStorage.setItem(key, data);
    }
    ;
    static loadFromWebStorage(savefileId) {
        const key = this.webStorageKey(savefileId);
        const data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    }
    ;
    static loadFromWebStorageBackup(savefileId) {
        const key = this.webStorageKey(savefileId) + "bak";
        const data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    }
    ;
    static webStorageBackupExists(savefileId) {
        const key = this.webStorageKey(savefileId) + "bak";
        return !!localStorage.getItem(key);
    }
    ;
    static webStorageExists(savefileId) {
        const key = this.webStorageKey(savefileId);
        return !!localStorage.getItem(key);
    }
    ;
    static removeWebStorage(savefileId) {
        const key = this.webStorageKey(savefileId);
        localStorage.removeItem(key);
    }
    ;
    static localFileDirectoryPath() {
        let require = window['require']; // bungcip: changed to make it compile
        let process = window['process']; // bungcip: changed to make it compile
        const path = require('path');
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, 'save/');
    }
    ;
    static localFilePath(savefileId) {
        let name;
        if (savefileId < 0) {
            name = 'config.rpgsave';
        }
        else if (savefileId === 0) {
            name = 'global.rpgsave';
        }
        else {
            name = 'file%1.rpgsave'.format(savefileId);
        }
        return this.localFileDirectoryPath() + name;
    }
    ;
    static webStorageKey(savefileId) {
        if (savefileId < 0) {
            return 'RPG Config';
        }
        else if (savefileId === 0) {
            return 'RPG Global';
        }
        else {
            return 'RPG File%1'.format(savefileId);
        }
    }
    ;
}

//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.
class DataManager {
    static loadDatabase() {
        const test = this.isBattleTest() || this.isEventTest();
        const prefix = test ? 'Test_' : '';
        for (let i = 0; i < this._databaseFiles.length; i++) {
            const name = this._databaseFiles[i].name;
            const src = this._databaseFiles[i].src;
            this.loadDataFile(name, prefix + src);
        }
        if (this.isEventTest()) {
            this.loadDataFile('$testEvent', prefix + 'Event.json');
        }
    }
    ;
    static loadDataFile(name, src) {
        const xhr = new XMLHttpRequest();
        const url = 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
        xhr.onerror = this._mapLoader || function () {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        window[name] = null;
        xhr.send();
    }
    ;
    static isDatabaseLoaded() {
        this.checkError();
        for (let i = 0; i < this._databaseFiles.length; i++) {
            if (!window[this._databaseFiles[i].name]) {
                return false;
            }
        }
        return true;
    }
    ;
    static loadMapData(mapId) {
        if (mapId > 0) {
            const filename = 'Map%1.json'.format(mapId.padZero(3));
            this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
            this.loadDataFile('$dataMap', filename);
        }
        else {
            this.makeEmptyMap();
        }
    }
    ;
    static makeEmptyMap() {
        $dataMap = {
            data: [],
            events: [],
            width: 100,
            height: 100,
            scrollType: 3,
            /// (bungcip): empty Data, added to make it compile
            autoplayBgm: false,
            autoplayBgs: false,
            battleback1Name: '',
            battleback2Name: '',
            bgm: null,
            bgs: null,
            disableDashing: false,
            displayName: '',
            encounterList: [],
            encounterStep: 0,
            note: '',
            parallaxLoopX: false,
            parallaxLoopY: false,
            parallaxName: '',
            parallaxShow: false,
            parallaxSx: 0,
            parallaxSy: 0,
            specifyBattleback: false,
            tilesetId: 0,
        };
    }
    ;
    static isMapLoaded() {
        this.checkError();
        return !!$dataMap;
    }
    ;
    static onLoad(object) {
        let array;
        if (object === $dataMap) {
            this.extractMetadata(object);
            array = $dataMap.events;
        }
        else {
            array = object;
        }
        if (Array.isArray(array)) {
            for (let i = 0; i < array.length; i++) {
                const data = array[i];
                if (data && data.note !== undefined) {
                    this.extractMetadata(data);
                }
            }
        }
        if (object === $dataSystem) {
            Scene_Boot.loadSystemImages();
        }
    }
    ;
    static extractMetadata(data) {
        const re = /<([^<>:]+)(:?)([^>]*)>/g;
        data.meta = {};
        for (;;) {
            const match = re.exec(data.note);
            if (match) {
                if (match[2] === ':') {
                    data.meta[match[1]] = match[3];
                }
                else {
                    data.meta[match[1]] = true;
                }
            }
            else {
                break;
            }
        }
    }
    ;
    static checkError() {
        if (DataManager._errorUrl) {
            throw new Error('Failed to load: ' + DataManager._errorUrl);
        }
    }
    ;
    static isBattleTest() {
        return Utils.isOptionValid('btest');
    }
    ;
    static isEventTest() {
        return Utils.isOptionValid('etest');
    }
    ;
    static isSkill(item) {
        return item && $dataSkills.contains(item);
    }
    ;
    static isItem(item) {
        return item && $dataItems.contains(item);
    }
    ;
    static isWeapon(item) {
        return item && $dataWeapons.contains(item);
    }
    ;
    static isArmor(item) {
        return item && $dataArmors.contains(item);
    }
    ;
    static createGameObjects() {
        $gameTemp = new Game_Temp();
        $gameSystem = new Game_System();
        $gameScreen = new Game_Screen();
        $gameTimer = new Game_Timer();
        $gameMessage = new Game_Message();
        $gameSwitches = new Game_Switches();
        $gameVariables = new Game_Variables();
        $gameSelfSwitches = new Game_SelfSwitches();
        $gameActors = new Game_Actors();
        $gameParty = new Game_Party();
        $gameTroop = new Game_Troop();
        $gameMap = new Game_Map();
        $gamePlayer = new Game_Player();
    }
    ;
    static setupNewGame() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer($dataSystem.startMapId, $dataSystem.startX, $dataSystem.startY);
        Graphics.frameCount = 0;
    }
    ;
    static setupBattleTest() {
        this.createGameObjects();
        $gameParty.setupBattleTest();
        BattleManager.setup($dataSystem.testTroopId, true, false);
        BattleManager.setBattleTest(true);
        BattleManager.playBattleBgm();
    }
    ;
    static setupEventTest() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(-1, 8, 6);
        $gamePlayer.setTransparent(false);
    }
    ;
    static loadGlobalInfo() {
        let json;
        try {
            json = StorageManager.load(0);
        }
        catch (e) {
            console.error(e);
            return [];
        }
        if (json) {
            const globalInfo = JSON.parse(json);
            for (let i = 1; i <= this.maxSavefiles(); i++) {
                if (!StorageManager.exists(i)) {
                    delete globalInfo[i];
                }
            }
            return globalInfo;
        }
        else {
            return [];
        }
    }
    ;
    static saveGlobalInfo(info) {
        StorageManager.save(0, JSON.stringify(info));
    }
    ;
    static isThisGameFile(savefileId) {
        const globalInfo = this.loadGlobalInfo();
        if (globalInfo && globalInfo[savefileId]) {
            if (StorageManager.isLocalMode()) {
                return true;
            }
            else {
                const savefile = globalInfo[savefileId];
                return (savefile.globalId === this._globalId &&
                    savefile.title === $dataSystem.gameTitle);
            }
        }
        else {
            return false;
        }
    }
    ;
    static isAnySavefileExists() {
        const globalInfo = this.loadGlobalInfo();
        if (globalInfo) {
            for (let i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i)) {
                    return true;
                }
            }
        }
        return false;
    }
    ;
    static latestSavefileId() {
        const globalInfo = this.loadGlobalInfo();
        let savefileId = 1;
        let timestamp = 0;
        if (globalInfo) {
            for (let i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    savefileId = i;
                }
            }
        }
        return savefileId;
    }
    ;
    static loadAllSavefileImages() {
        const globalInfo = this.loadGlobalInfo();
        if (globalInfo) {
            for (let i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i)) {
                    const info = globalInfo[i];
                    this.loadSavefileImages(info);
                }
            }
        }
    }
    ;
    static loadSavefileImages(info) {
        if (info.characters) {
            for (let i = 0; i < info.characters.length; i++) {
                ImageManager.reserveCharacter(info.characters[i][0]);
            }
        }
        if (info.faces) {
            for (let j = 0; j < info.faces.length; j++) {
                ImageManager.reserveFace(info.faces[j][0]);
            }
        }
    }
    ;
    static maxSavefiles() {
        return 20;
    }
    ;
    static saveGame(savefileId) {
        try {
            StorageManager.backup(savefileId);
            return this.saveGameWithoutRescue(savefileId);
        }
        catch (e) {
            console.error(e);
            try {
                StorageManager.remove(savefileId);
                StorageManager.restoreBackup(savefileId);
            }
            catch (e2) {
            }
            return false;
        }
    }
    ;
    static loadGame(savefileId) {
        try {
            return this.loadGameWithoutRescue(savefileId);
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    ;
    static loadSavefileInfo(savefileId) {
        const globalInfo = this.loadGlobalInfo();
        return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
    }
    ;
    static lastAccessedSavefileId() {
        return this._lastAccessedId;
    }
    ;
    static saveGameWithoutRescue(savefileId) {
        const json = JsonEx.stringify(this.makeSaveContents());
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        StorageManager.save(savefileId, json);
        this._lastAccessedId = savefileId;
        const globalInfo = this.loadGlobalInfo() || [];
        globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo(globalInfo);
        return true;
    }
    ;
    static loadGameWithoutRescue(savefileId) {
        const globalInfo = this.loadGlobalInfo();
        if (this.isThisGameFile(savefileId)) {
            const json = StorageManager.load(savefileId);
            this.createGameObjects();
            this.extractSaveContents(JsonEx.parse(json));
            this._lastAccessedId = savefileId;
            return true;
        }
        else {
            return false;
        }
    }
    ;
    static selectSavefileForNewGame() {
        const globalInfo = this.loadGlobalInfo();
        this._lastAccessedId = 1;
        if (globalInfo) {
            const numSavefiles = Math.max(0, globalInfo.length - 1);
            if (numSavefiles < this.maxSavefiles()) {
                this._lastAccessedId = numSavefiles + 1;
            }
            else {
                let timestamp = Number.MAX_VALUE;
                for (let i = 1; i < globalInfo.length; i++) {
                    if (!globalInfo[i]) {
                        this._lastAccessedId = i;
                        break;
                    }
                    if (globalInfo[i].timestamp < timestamp) {
                        timestamp = globalInfo[i].timestamp;
                        this._lastAccessedId = i;
                    }
                }
            }
        }
    }
    ;
    static makeSavefileInfo() {
        return {
            globalId: this._globalId,
            title: $dataSystem.gameTitle,
            characters: $gameParty.charactersForSavefile(),
            faces: $gameParty.facesForSavefile(),
            playtime: $gameSystem.playtimeText(),
            timestamp: Date.now(),
        };
    }
    ;
    static makeSaveContents() {
        // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
        return {
            system: $gameSystem,
            screen: $gameScreen,
            timer: $gameTimer,
            switches: $gameSwitches,
            variables: $gameVariables,
            selfSwitches: $gameSelfSwitches,
            actors: $gameActors,
            party: $gameParty,
            map: $gameMap,
            player: $gamePlayer,
        };
    }
    ;
    static extractSaveContents(contents) {
        $gameSystem = contents.system;
        $gameScreen = contents.screen;
        $gameTimer = contents.timer;
        $gameSwitches = contents.switches;
        $gameVariables = contents.variables;
        $gameSelfSwitches = contents.selfSwitches;
        $gameActors = contents.actors;
        $gameParty = contents.party;
        $gameMap = contents.map;
        $gamePlayer = contents.player;
    }
    ;
}
DataManager._globalId = 'RPGMV';
DataManager._lastAccessedId = 1;
DataManager._errorUrl = null;
DataManager._databaseFiles = [
    { name: '$dataActors', src: 'Actors.json' },
    { name: '$dataClasses', src: 'Classes.json' },
    { name: '$dataSkills', src: 'Skills.json' },
    { name: '$dataItems', src: 'Items.json' },
    { name: '$dataWeapons', src: 'Weapons.json' },
    { name: '$dataArmors', src: 'Armors.json' },
    { name: '$dataEnemies', src: 'Enemies.json' },
    { name: '$dataTroops', src: 'Troops.json' },
    { name: '$dataStates', src: 'States.json' },
    { name: '$dataAnimations', src: 'Animations.json' },
    { name: '$dataTilesets', src: 'Tilesets.json' },
    { name: '$dataCommonEvents', src: 'CommonEvents.json' },
    { name: '$dataSystem', src: 'System.json' },
    { name: '$dataMapInfos', src: 'MapInfos.json' }
];
window.$dataActors = null;
window.$dataClasses = null;
window.$dataSkills = null;
window.$dataItems = null;
window.$dataWeapons = null;
window.$dataArmors = null;
window.$dataEnemies = null;
window.$dataTroops = null;
window.$dataStates = null;
window.$dataAnimations = null;
window.$dataTilesets = null;
window.$dataCommonEvents = null;
window.$dataSystem = null;
window.$dataMapInfos = null;
window.$dataMap = null;
window.$gameTemp = null;
window.$gameSystem = null;
window.$gameScreen = null;
window.$gameTimer = null;
window.$gameMessage = null;
window.$gameSwitches = null;
window.$gameVariables = null;
window.$gameSelfSwitches = null;
window.$gameActors = null;
window.$gameParty = null;
window.$gameTroop = null;
window.$gameMap = null;
window.$gamePlayer = null;
window.$testEvent = null;

class ConfigManager {
    static get bgmVolume() {
        return AudioManager.bgmVolume;
    }
    static set bgmVolume(value) {
        AudioManager.bgmVolume = value;
    }
    static get bgsVolume() {
        return AudioManager.bgsVolume;
    }
    static set bgsVolume(value) {
        AudioManager.bgsVolume = value;
    }
    static get meVolume() {
        return AudioManager.meVolume;
    }
    static set meVolume(value) {
        AudioManager.meVolume = value;
    }
    static get seVolume() {
        return AudioManager.seVolume;
    }
    static set seVolume(value) {
        AudioManager.seVolume = value;
    }
    static load() {
        let json;
        let config = {};
        try {
            json = StorageManager.load(-1);
        }
        catch (e) {
            console.error(e);
        }
        if (json) {
            config = JSON.parse(json);
        }
        this.applyData(config);
    }
    ;
    static save() {
        StorageManager.save(-1, JSON.stringify(this.makeData()));
    }
    ;
    static makeData() {
        const config = {
            alwaysDash: this.alwaysDash,
            commandRemember: this.commandRemember,
            bgmVolume: this.bgmVolume,
            bgsVolume: this.bgsVolume,
            meVolume: this.meVolume,
            seVolume: this.seVolume,
        };
        return config;
    }
    ;
    static applyData(config) {
        this.alwaysDash = this.readFlag(config, 'alwaysDash');
        this.commandRemember = this.readFlag(config, 'commandRemember');
        this.bgmVolume = this.readVolume(config, 'bgmVolume');
        this.bgsVolume = this.readVolume(config, 'bgsVolume');
        this.meVolume = this.readVolume(config, 'meVolume');
        this.seVolume = this.readVolume(config, 'seVolume');
    }
    ;
    static readFlag(config, name) {
        return !!config[name];
    }
    ;
    static readVolume(config, name) {
        const value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(0, 100);
        }
        else {
            return 100;
        }
    }
    ;
}
ConfigManager.alwaysDash = false;
ConfigManager.commandRemember = false;



var index$1 = Object.freeze({
	AudioManager: AudioManager,
	BattleManager: BattleManager,
	ConfigManager: ConfigManager,
	DataManager: DataManager,
	ImageManager: ImageManager,
	PluginManager: PluginManager,
	SceneManager: SceneManager,
	SoundManager: SoundManager,
	StorageManager: StorageManager,
	TextManager: TextManager
});

//-----------------------------------------------------------------------------
// we need this constant for some platforms (Samsung S4, S5, Tab4, HTC One H8)
PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO; //btw, this is default setting
PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.tilemap.TileRenderer.DO_CLEAR = true;
/**
 * The tilemap which displays 2D tile-based game map using shaders
 *
 * @class Tilemap
 * @constructor
 */
class ShaderTilemap extends Tilemap {
    constructor() {
        super(...arguments);
        this.roundPixels = true;
    }
    /**
     * Uploads animation state in renderer
     *
     * @method _hackRenderer
     * @private
     */
    _hackRenderer(renderer) {
        let af = this.animationFrame % 4;
        if (af == 3)
            af = 1;
        renderer.plugins.tilemap.tileAnim[0] = af * this._tileWidth;
        renderer.plugins.tilemap.tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;
        return renderer;
    }
    ;
    /**
     * PIXI render method
     *
     * @method renderWebGL
     * @param {Object} pixi renderer
     */
    renderWebGL(renderer) {
        this._hackRenderer(renderer);
        super.renderWebGL(renderer);
    }
    ;
    refresh() {
        if (this._lastBitmapLength !== this.bitmaps.length) {
            this._lastBitmapLength = this.bitmaps.length;
            this.refreshTileset();
        }
        
        this._needsRepaint = true;
    }
    ;
    /**
     * Call after you update tileset
     *
     * @method updateBitmaps
     */
    refreshTileset() {
        const bitmaps = this.bitmaps.map(function (x) {
            return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x;
        });
        this.lowerLayer.setBitmaps(bitmaps);
        this.upperLayer.setBitmaps(bitmaps);
    }
    ;
    /**
     * @method updateTransform
     * @private
     */
    updateTransform() {
        let ox, oy;
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        }
        else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        const startX = Math.floor((ox - this._margin) / this._tileWidth);
        const startY = Math.floor((oy - this._margin) / this._tileHeight);
        this._updateLayerPositions(startX, startY);
        if (this._needsRepaint ||
            this._lastStartX !== startX || this._lastStartY !== startY) {
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._paintAllTiles(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
        super.updateTransform();
    }
    ;
    _createLayers() {
        const width = this._width;
        const height = this._height;
        const margin = this._margin;
        const tileCols = Math.ceil(width / this._tileWidth) + 1;
        const tileRows = Math.ceil(height / this._tileHeight) + 1;
        const layerWidth = this._layerWidth = tileCols * this._tileWidth;
        const layerHeight = this._layerHeight = tileRows * this._tileHeight;
        this._needsRepaint = true;
        if (!this.lowerZLayer) {
            //@hackerham: create layers only in initialization. Doesn't depend on width/height
            this.addChild(this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0));
            this.addChild(this.upperZLayer = new PIXI.tilemap.ZLayer(this, 4));
            const parameters = PluginManager.parameters('ShaderTilemap');
            const useSquareShader = Number(parameters.hasOwnProperty('squareShader') ? parameters['squareShader'] : 0);
            this.lowerZLayer.addChild(this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader));
            this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
            this.upperZLayer.addChild(this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(4, [], useSquareShader));
        }
    }
    ;
    /**
     * @method _updateLayerPositions
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    _updateLayerPositions(startX, startY) {
        let ox, oy;
        if (this.roundPixels) {
            ox = Math.floor(this.origin.x);
            oy = Math.floor(this.origin.y);
        }
        else {
            ox = this.origin.x;
            oy = this.origin.y;
        }
        this.lowerZLayer.position.x = startX * this._tileWidth - ox;
        this.lowerZLayer.position.y = startY * this._tileHeight - oy;
        this.upperZLayer.position.x = startX * this._tileWidth - ox;
        this.upperZLayer.position.y = startY * this._tileHeight - oy;
    }
    ;
    /**
     * @method _paintAllTiles
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
    _paintAllTiles(startX, startY) {
        this.lowerZLayer.clear();
        this.upperZLayer.clear();
        const tileCols = Math.ceil(this._width / this._tileWidth) + 1;
        const tileRows = Math.ceil(this._height / this._tileHeight) + 1;
        for (let y = 0; y < tileRows; y++) {
            for (let x = 0; x < tileCols; x++) {
                this._paintTiles(startX, startY, x, y);
            }
        }
    }
    ;
    /**
     * @method _paintTiles
     * @param {Number} startX
     * @param {Number} startY
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    _paintTiles(startX, startY, x, y) {
        const mx = startX + x;
        const my = startY + y;
        const dx = x * this._tileWidth, dy = y * this._tileHeight;
        const tileId0 = this._readMapData(mx, my, 0);
        const tileId1 = this._readMapData(mx, my, 1);
        const tileId2 = this._readMapData(mx, my, 2);
        const tileId3 = this._readMapData(mx, my, 3);
        const shadowBits = this._readMapData(mx, my, 4);
        const upperTileId1 = this._readMapData(mx, my - 1, 1);
        const lowerLayer = this.lowerLayer.children[0];
        const upperLayer = this.upperLayer.children[0];
        if (this._isHigherTile(tileId0)) {
            this._drawTile(upperLayer, tileId0, dx, dy);
        }
        else {
            this._drawTile(lowerLayer, tileId0, dx, dy);
        }
        if (this._isHigherTile(tileId1)) {
            this._drawTile(upperLayer, tileId1, dx, dy);
        }
        else {
            this._drawTile(lowerLayer, tileId1, dx, dy);
        }
        this._drawShadow(lowerLayer, shadowBits, dx, dy);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
            }
        }
        if (this._isOverpassPosition(mx, my)) {
            this._drawTile(upperLayer, tileId2, dx, dy);
            this._drawTile(upperLayer, tileId3, dx, dy);
        }
        else {
            if (this._isHigherTile(tileId2)) {
                this._drawTile(upperLayer, tileId2, dx, dy);
            }
            else {
                this._drawTile(lowerLayer, tileId2, dx, dy);
            }
            if (this._isHigherTile(tileId3)) {
                this._drawTile(upperLayer, tileId3, dx, dy);
            }
            else {
                this._drawTile(lowerLayer, tileId3, dx, dy);
            }
        }
    }
    ;
    /**
     * @method _drawTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawTile(layer, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._drawAutotile(layer, tileId, dx, dy);
            }
            else {
                this._drawNormalTile(layer, tileId, dx, dy);
            }
        }
    }
    ;
    /**
     * @method _drawNormalTile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawNormalTile(layer, tileId, dx, dy) {
        let setNumber = 0;
        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        }
        else {
            setNumber = 5 + Math.floor(tileId / 256);
        }
        const w = this._tileWidth;
        const h = this._tileHeight;
        const sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
        const sy = (Math.floor(tileId % 256 / 8) % 16) * h;
        layer.addRect(setNumber, sx, sy, dx, dy, w, h);
    }
    ;
    /**
     * @method _drawAutotile
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawAutotile(layer, tileId, dx, dy) {
        let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        const kind = Tilemap.getAutotileKind(tileId);
        const shape = Tilemap.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        let bx = 0;
        let by = 0;
        let setNumber = 0;
        let isTable = false;
        let animX = 0, animY = 0;
        if (Tilemap.isTileA1(tileId)) {
            setNumber = 0;
            if (kind === 0) {
                animX = 2;
                by = 0;
            }
            else if (kind === 1) {
                animX = 2;
                by = 3;
            }
            else if (kind === 2) {
                bx = 6;
                by = 0;
            }
            else if (kind === 3) {
                bx = 6;
                by = 3;
            }
            else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
                if (kind % 2 === 0) {
                    animX = 2;
                }
                else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    animY = 1;
                }
            }
        }
        else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        }
        else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
        else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }
        const table = autotileTable[shape];
        const w1 = this._tileWidth / 2;
        const h1 = this._tileHeight / 2;
        for (let i = 0; i < 4; i++) {
            const qsx = table[i][0];
            const qsy = table[i][1];
            const sx1 = (bx * 2 + qsx) * w1;
            const sy1 = (by * 2 + qsy) * h1;
            const dx1 = dx + (i % 2) * w1;
            const dy1 = dy + Math.floor(i / 2) * h1;
            if (isTable && (qsy === 1 || qsy === 5)) {
                let qsx2 = qsx;
                const qsy2 = 3;
                if (qsy === 1) {
                    //qsx2 = [0, 3, 2, 1][qsx];
                    qsx2 = (4 - qsx) % 4;
                }
                const sx2 = (bx * 2 + qsx2) * w1;
                const sy2 = (by * 2 + qsy2) * h1;
                layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1, animX, animY);
                layer.addRect(setNumber, sx1, sy1, dx1, dy1 + h1 / 2, w1, h1 / 2, animX, animY);
            }
            else {
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
            }
        }
    }
    ;
    /**
     * @method _drawTableEdge
     * @param {Array} layers
     * @param {Number} tileId
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawTableEdge(layer, tileId, dx, dy) {
        if (Tilemap.isTileA2(tileId)) {
            const autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            const kind = Tilemap.getAutotileKind(tileId);
            const shape = Tilemap.getAutotileShape(tileId);
            const tx = kind % 8;
            const ty = Math.floor(kind / 8);
            const setNumber = 1;
            const bx = tx * 2;
            const by = (ty - 2) * 3;
            const table = autotileTable[shape];
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            for (let i = 0; i < 2; i++) {
                const qsx = table[2 + i][0];
                const qsy = table[2 + i][1];
                const sx1 = (bx * 2 + qsx) * w1;
                const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                const dx1 = dx + (i % 2) * w1;
                const dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1 / 2);
            }
        }
    }
    ;
    /**
     * @method _drawShadow
     * @param {Number} shadowBits
     * @param {Number} dx
     * @param {Number} dy
     * @private
     */
    _drawShadow(layer, shadowBits, dx, dy) {
        if (shadowBits & 0x0f) {
            const w1 = this._tileWidth / 2;
            const h1 = this._tileHeight / 2;
            for (let i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    const dx1 = dx + (i % 2) * w1;
                    const dy1 = dy + Math.floor(i / 2) * h1;
                    layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
                }
            }
        }
    }
    ;
}

//-----------------------------------------------------------------------------
/**
 * The sprite object for a tiling image.
 *
 * @class TilingSprite
 * @constructor
 * @param {Bitmap} bitmap The image for the tiling sprite
 */
class TilingSprite extends PIXI.extras.PictureTilingSprite {
    constructor(bitmap) {
        super(new PIXI.Texture(new PIXI.BaseTexture()));
        this._bitmap = null;
        this._frame = new PIXI.Rectangle();
        this._renderWebGL_PIXI = super._renderWebGL;
        this._speedUpCustomBlendModes = Sprite.prototype._speedUpCustomBlendModes;
        this._width = 0;
        this._height = 0;
        this.spriteId = Sprite._counter++;
        this.origin = new PIXI.Point();
        this.bitmap = bitmap;
    }
    ;
    /**
     * The image for the tiling sprite.
     *
     * @property bitmap
     * @type Bitmap
     */
    get bitmap() {
        return this._bitmap;
    }
    set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            if (this._bitmap) {
                this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
            }
            else {
                this.texture.frame = PIXI.Rectangle.EMPTY;
            }
        }
    }
    /**
     * The opacity of the tiling sprite (0 to 255).
     *
     * @property opacity
     * @type Number
     */
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    /**
     * Updates the tiling sprite for each frame.
     *
     * @method update
     */
    update() {
        this.children.forEach(function (child) {
            if (child['update']) {
                child.update();
            }
        });
    }
    ;
    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the tiling sprite
     * @param {Number} y The y coordinate of the tiling sprite
     * @param {Number} width The width of the tiling sprite
     * @param {Number} height The height of the tiling sprite
     */
    move(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
    }
    ;
    /**
     * Specifies the region of the image that the tiling sprite will use.
     *
     * @method setFrame
     * @param {Number} x The x coordinate of the frame
     * @param {Number} y The y coordinate of the frame
     * @param {Number} width The width of the frame
     * @param {Number} height The height of the frame
     */
    setFrame(x, y, width, height) {
        this._frame.x = x;
        this._frame.y = y;
        this._frame.width = width;
        this._frame.height = height;
        this._refresh();
    }
    ;
    /**
     * @method updateTransform
     * @private
     */
    updateTransform() {
        this.tilePosition.x = Math.round(-this.origin.x);
        this.tilePosition.y = Math.round(-this.origin.y);
        super.updateTransform();
    }
    ;
    /**
     * @method _onBitmapLoad
     * @private
     */
    _onBitmapLoad() {
        this.texture.baseTexture = this._bitmap.baseTexture;
        this._refresh();
    }
    ;
    /**
     * @method _refresh
     * @private
     */
    _refresh() {
        const frame = this._frame.clone();
        if (frame.width === 0 && frame.height === 0 && this._bitmap) {
            frame.width = this._bitmap.width;
            frame.height = this._bitmap.height;
        }
        this.texture.frame = frame;
        /// bungcip: harus diberi any agar tidak error...
        this.texture._updateID++;
        this.tilingTexture = null;
    }
    ;
    /**
     * @method _renderWebGL
     * @param {Object} renderer
     * @private
     */
    _renderWebGL(renderer) {
        if (this._bitmap) {
            this._bitmap.touch();
            this._bitmap.checkDirty();
        }
        this._speedUpCustomBlendModes(renderer);
        this._renderWebGL_PIXI(renderer);
    }
    ;
}

//-----------------------------------------------------------------------------
/**
 * The sprite which covers the entire game screen.
 *
 * @class ScreenSprite
 * @constructor
 */
class ScreenSprite extends PIXI.Container {
    constructor() {
        super();
        this._red = -1;
        this._green = -1;
        this._blue = -1;
        this._colorText = '';
        this._graphics = new PIXI.Graphics();
        this.addChild(this._graphics);
        this.opacity = 0;
        this.setBlack();
    }
    ;
    /**
     * The opacity of the sprite (0 to 255).
     *
     * @property opacity
     * @type Number
     */
    get opacity() {
        return this.alpha * 255;
    }
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    static warnYep() {
        if (!ScreenSprite.YEPWarned) {
            console.log("Deprecation warning. Please update YEP_CoreEngine. ScreenSprite is not a sprite, it has graphics inside.");
            ScreenSprite.YEPWarned = true;
        }
    }
    ;
    get anchor() {
        ScreenSprite.warnYep();
        this.scale.x = 1;
        this.scale.y = 1;
        return { x: 0, y: 0 };
    }
    set anchor(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }
    get blendMode() {
        return this._graphics.blendMode;
    }
    set blendMode(value) {
        this._graphics.blendMode = value;
    }
    /**
     * Sets black to the color of the screen sprite.
     *
     * @method setBlack
     */
    setBlack() {
        this.setColor(0, 0, 0);
    }
    ;
    /**
     * Sets white to the color of the screen sprite.
     *
     * @method setWhite
     */
    setWhite() {
        this.setColor(255, 255, 255);
    }
    ;
    /**
     * Sets the color of the screen sprite by values.
     *
     * @method setColor
     * @param {Number} r The red value in the range (0, 255)
     * @param {Number} g The green value in the range (0, 255)
     * @param {Number} b The blue value in the range (0, 255)
     */
    setColor(r, g, b) {
        if (this._red !== r || this._green !== g || this._blue !== b) {
            r = Math.round(r || 0).clamp(0, 255);
            g = Math.round(g || 0).clamp(0, 255);
            b = Math.round(b || 0).clamp(0, 255);
            this._red = r;
            this._green = g;
            this._blue = b;
            this._colorText = Utils.rgbToCssColor(r, g, b);
            const graphics = this._graphics;
            graphics.clear();
            const intColor = (r << 16) | (g << 8) | b;
            graphics.beginFill(intColor, 1);
            //whole screen with zoom. BWAHAHAHAHA
            graphics.drawRect(-Graphics.width * 5, -Graphics.height * 5, Graphics.width * 10, Graphics.height * 10);
        }
    }
    ;
}
ScreenSprite.YEPWarned = false;

//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class WindowLayer
 * @constructor
 */
class WindowLayer extends PIXI.Container {
    constructor() {
        super();
        this._width = 0;
        this._height = 0;
        this._tempCanvas = null;
        this._translationMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        this._windowMask = new PIXI.Graphics();
        this._windowMask.beginFill(0xffffff, 1);
        this._windowMask.drawRect(0, 0, 0, 0);
        this._windowMask.endFill();
        /// bungcip: jadi any agar tidak error
        this._windowRect = this._windowMask.graphicsData[0].shape;
        this._renderSprite = null;
        this.filterArea = new PIXI.Rectangle();
        this.filters = [WindowLayer.voidFilter];
        //temporary fix for memory leak bug
        this.on('removed', this.onRemoveAsAChild);
    }
    ;
    onRemoveAsAChild() {
        this.removeChildren();
    }
    /**
     * The width of the window layer in pixels.
     *
     * @property width
     * @type Number
     */
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    /**
     * The height of the window layer in pixels.
     *
     * @property height
     * @type Number
     */
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the window layer
     * @param {Number} y The y coordinate of the window layer
     * @param {Number} width The width of the window layer
     * @param {Number} height The height of the window layer
     */
    move(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    ;
    /**
     * Updates the window layer for each frame.
     *
     * @method update
     */
    update() {
        this.children.forEach(function (child) {
            if (child['update']) {
                /// bungcip: jadi any agar bisa dipanggil
                child.update();
            }
        });
    }
    ;
    /**
     * @method _renderWebGL
     * @param {Object} renderSession
     * @private
     */
    renderWebGL(renderer) {
        if (!this.visible || !this.renderable) {
            return;
        }
        if (this.children.length == 0) {
            return;
        }
        renderer.flush();
        this.filterArea.copy(this);
        renderer.filterManager.pushFilter(this, this.filters);
        renderer.currentRenderer.start();
        const shift = new PIXI.Point();
        const rt = renderer._activeRenderTarget;
        const projectionMatrix = rt.projectionMatrix;
        shift.x = Math.round((projectionMatrix.tx + 1) / 2 * rt.sourceFrame.width);
        shift.y = Math.round((projectionMatrix.ty + 1) / 2 * rt.sourceFrame.height);
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            /// bungcip: ada any agar bisa dicompile
            if (child._isWindow && child.visible && child.openness > 0) {
                this._maskWindow(child, shift);
                renderer.maskManager.pushScissorMask(this, this._windowMask);
                renderer.clear();
                renderer.maskManager.popScissorMask();
                renderer.currentRenderer.start();
                child.renderWebGL(renderer);
                renderer.currentRenderer.flush();
            }
        }
        renderer.flush();
        renderer.filterManager.popFilter();
        renderer.maskManager.popScissorMask();
        for (let j = 0; j < this.children.length; j++) {
            /// bungcip: ada any agar bisa dicompile
            if (!this.children[j]._isWindow) {
                this.children[j].renderWebGL(renderer);
            }
        }
    }
    ;
    /**
     * @method _maskWindow
     * @param {Window} window
     * @private
     */
    _maskWindow(window, shift) {
        this._windowMask['_currentBounds'] = null; // bungcip: edited to compile
        this._windowMask['boundsDirty'] = true; // bungcip: edited to compile
        const rect = this._windowRect;
        rect.x = this.x + shift.x + window.x;
        rect.y = this.x + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
        rect.width = window.width;
        rect.height = window.height * window._openness / 255;
    }
    ;
}
WindowLayer.voidFilter = new PIXI.filters.AlphaFilter();

//-----------------------------------------------------------------------------
/**
 * The weather effect which displays rain, storm, or snow.
 *
 * @class Weather
 * @constructor
 */
class Weather extends PIXI.Container {
    /// bungcip: viewport itu tidak ada? sementara didefinisikan dulu....
    // public viewport;
    constructor() {
        super();
        this._width = Graphics.width;
        this._height = Graphics.height;
        this._sprites = [];
        /**
         * The type of the weather in ['none', 'rain', 'storm', 'snow'].
         *
         * @property type
         * @type String
         */
        this.type = 'none';
        /**
         * The power of the weather in the range (0, 9).
         *
         * @property power
         * @type Number
         */
        this.power = 0;
        /**
         * The origin point of the weather for scrolling.
         *
         * @property origin
         * @type Point
         */
        this.origin = new PIXI.Point();
        this._createBitmaps();
        this._createDimmer();
    }
    ;
    /**
     * Updates the weather for each frame.
     *
     * @method update
     */
    update() {
        this._updateDimmer();
        this._updateAllSprites();
    }
    ;
    /**
     * @method _createBitmaps
     * @private
     */
    _createBitmaps() {
        this._rainBitmap = new Bitmap(1, 60);
        this._rainBitmap.fillAll('white');
        this._stormBitmap = new Bitmap(2, 100);
        this._stormBitmap.fillAll('white');
        this._snowBitmap = new Bitmap(9, 9);
        this._snowBitmap.drawCircle(4, 4, 4, 'white');
    }
    ;
    /**
     * @method _createDimmer
     * @private
     */
    _createDimmer() {
        this._dimmerSprite = new ScreenSprite();
        this._dimmerSprite.setColor(80, 80, 80);
        this.addChild(this._dimmerSprite);
    }
    ;
    /**
     * @method _updateDimmer
     * @private
     */
    _updateDimmer() {
        this._dimmerSprite.opacity = Math.floor(this.power * 6);
    }
    ;
    /**
     * @method _updateAllSprites
     * @private
     */
    _updateAllSprites() {
        const maxSprites = Math.floor(this.power * 10);
        while (this._sprites.length < maxSprites) {
            this._addSprite();
        }
        while (this._sprites.length > maxSprites) {
            this._removeSprite();
        }
        this._sprites.forEach(function (sprite) {
            this._updateSprite(sprite);
            sprite.x = sprite.ax - this.origin.x;
            sprite.y = sprite.ay - this.origin.y;
        }, this);
    }
    ;
    /**
     * @method _addSprite
     * @private
     */
    _addSprite() {
        /// bungcip: viewport itu tidak ada? sementara didefinisikan dulu....
        // const sprite = new Sprite(this.viewport);
        const sprite = new Sprite();
        sprite.opacity = 0;
        this._sprites.push(sprite);
        this.addChild(sprite);
    }
    ;
    /**
     * @method _removeSprite
     * @private
     */
    _removeSprite() {
        this.removeChild(this._sprites.pop());
    }
    ;
    /**
     * @method _updateSprite
     * @param {Sprite} sprite
     * @private
     */
    _updateSprite(sprite) {
        switch (this.type) {
            case 'rain':
                this._updateRainSprite(sprite);
                break;
            case 'storm':
                this._updateStormSprite(sprite);
                break;
            case 'snow':
                this._updateSnowSprite(sprite);
                break;
        }
        if (sprite.opacity < 40) {
            this._rebornSprite(sprite);
        }
    }
    ;
    /**
     * @method _updateRainSprite
     * @param {Sprite} sprite
     * @private
     */
    _updateRainSprite(sprite) {
        sprite.bitmap = this._rainBitmap;
        sprite.rotation = Math.PI / 16;
        sprite['ax'] -= 6 * Math.sin(sprite.rotation);
        sprite['ay'] += 6 * Math.cos(sprite.rotation);
        sprite.opacity -= 6;
    }
    ;
    /**
     * @method _updateStormSprite
     * @param {Sprite} sprite
     * @private
     */
    _updateStormSprite(sprite) {
        sprite.bitmap = this._stormBitmap;
        sprite.rotation = Math.PI / 8;
        sprite['ax'] -= 8 * Math.sin(sprite.rotation);
        sprite['ay'] += 8 * Math.cos(sprite.rotation);
        sprite.opacity -= 8;
    }
    ;
    /**
     * @method _updateSnowSprite
     * @param {Sprite} sprite
     * @private
     */
    _updateSnowSprite(sprite) {
        sprite.bitmap = this._snowBitmap;
        sprite.rotation = Math.PI / 16;
        sprite['ax'] -= 3 * Math.sin(sprite.rotation);
        sprite['ay'] += 3 * Math.cos(sprite.rotation);
        sprite.opacity -= 3;
    }
    ;
    /**
     * @method _rebornSprite
     * @param {Sprite} sprite
     * @private
     */
    _rebornSprite(sprite) {
        sprite['ax'] = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
        sprite['ay'] = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
        sprite.opacity = 160 + Math.randomInt(60);
    }
    ;
}

//-----------------------------------------------------------------------------
/**
 * The color matrix filter for WebGL.
 *
 * @class ToneFilter
 * @extends PIXI.Filter
 * @constructor
 */
class ToneFilter extends PIXI.filters.ColorMatrixFilter {
    /**
     * Changes the hue.
     *
     * @method adjustHue
     * @param {Number} value The hue value in the range (-360, 360)
     */
    adjustHue(value) {
        this.hue(value, true);
    }
    ;
    /**
     * Changes the saturation.
     *
     * @method adjustSaturation
     * @param {Number} value The saturation value in the range (-255, 255)
     */
    adjustSaturation(value) {
        value = (value || 0).clamp(-255, 255) / 255;
        this.saturate(value, true);
    }
    ;
    /**
     * Changes the tone.
     *
     * @method adjustTone
     * @param {Number} r The red strength in the range (-255, 255)
     * @param {Number} g The green strength in the range (-255, 255)
     * @param {Number} b The blue strength in the range (-255, 255)
     */
    adjustTone(r, g, b) {
        r = (r || 0).clamp(-255, 255) / 255;
        g = (g || 0).clamp(-255, 255) / 255;
        b = (b || 0).clamp(-255, 255) / 255;
        if (r !== 0 || g !== 0 || b !== 0) {
            const matrix = [
                1, 0, 0, r, 0,
                0, 1, 0, g, 0,
                0, 0, 1, b, 0,
                0, 0, 0, 1, 0
            ];
            this._loadMatrix(matrix, true);
        }
    }
    ;
}

//-----------------------------------------------------------------------------
/**
 * The audio object of Web Audio API.
 *
 * @class WebAudio
 * @constructor
 * @param {String} url The url of the audio file
 */
class WebAudio {
    constructor(url) {
        if (!WebAudio._initialized) {
            WebAudio.initialize();
        }
        this.clear();
        if (!WebAudio._standAlone) {
            this._loader = ResourceHandler.createLoader(url, this._load.bind(this, url), function () {
                this._hasError = true;
            }.bind(this));
        }
        this._load(url);
        this._url = url;
    }
    ;
    /**
     * Initializes the audio system.
     *
     * @static
     * @method initialize
     * @param {Boolean} noAudio Flag for the no-audio mode
     * @return {Boolean} True if the audio system is available
     */
    static initialize(noAudio) {
        if (!this._initialized) {
            if (!noAudio) {
                this._createContext();
                this._detectCodecs();
                this._createMasterGainNode();
                this._setupEventHandlers();
            }
            this._initialized = true;
        }
        return !!this._context;
    }
    ;
    /**
     * Checks whether the browser can play ogg files.
     *
     * @static
     * @method canPlayOgg
     * @return {Boolean} True if the browser can play ogg files
     */
    static canPlayOgg() {
        if (!this._initialized) {
            this.initialize();
        }
        return !!this._canPlayOgg;
    }
    ;
    /**
     * Checks whether the browser can play m4a files.
     *
     * @static
     * @method canPlayM4a
     * @return {Boolean} True if the browser can play m4a files
     */
    static canPlayM4a() {
        if (!this._initialized) {
            this.initialize();
        }
        return !!this._canPlayM4a;
    }
    ;
    /**
     * Sets the master volume of the all audio.
     *
     * @static
     * @method setMasterVolume
     * @param {Number} value Master volume (min: 0, max: 1)
     */
    static setMasterVolume(value) {
        this._masterVolume = value;
        if (this._masterGainNode) {
            this._masterGainNode.gain.setValueAtTime(this._masterVolume, this._context.currentTime);
        }
    }
    ;
    /**
     * @static
     * @method _createContext
     * @private
     */
    static _createContext() {
        try {
            if (typeof AudioContext !== 'undefined') {
                this._context = new AudioContext();
            }
            else if (typeof webkitAudioContext !== 'undefined') {
                this._context = new webkitAudioContext();
            }
        }
        catch (e) {
            this._context = null;
        }
    }
    ;
    /**
     * @static
     * @method _detectCodecs
     * @private
     */
    static _detectCodecs() {
        const audio = document.createElement('audio');
        if (audio.canPlayType) {
            this._canPlayOgg = audio.canPlayType('audio/ogg');
            this._canPlayM4a = audio.canPlayType('audio/mp4');
        }
    }
    ;
    /**
     * @static
     * @method _createMasterGainNode
     * @private
     */
    static _createMasterGainNode() {
        const context = this._context;
        if (context) {
            this._masterGainNode = context.createGain();
            this._masterGainNode.gain.setValueAtTime(this._masterVolume, context.currentTime);
            this._masterGainNode.connect(context.destination);
        }
    }
    ;
    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    static _setupEventHandlers() {
        document.addEventListener("touchend", () => {
            const context = this._context;
            if (context && context.state === "suspended" && typeof context.resume === "function") {
                context.resume().then(function () {
                    this._onTouchStart();
                });
            }
            else {
                this._onTouchStart();
            }
        });
        document.addEventListener('touchstart', this._onTouchStart.bind(this));
        document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
    }
    ;
    /**
     * @static
     * @method _onTouchStart
     * @private
     */
    static _onTouchStart() {
        const context = this._context;
        if (context && !this._unlocked) {
            // Unlock Web Audio on iOS
            const node = context.createBufferSource();
            node.start(0);
            this._unlocked = true;
        }
    }
    ;
    /**
     * @static
     * @method _onVisibilityChange
     * @private
     */
    static _onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this._onHide();
        }
        else {
            this._onShow();
        }
    }
    ;
    /**
     * @static
     * @method _onHide
     * @private
     */
    static _onHide() {
        if (this._shouldMuteOnHide()) {
            this._fadeOut(1);
        }
    }
    ;
    /**
     * @static
     * @method _onShow
     * @private
     */
    static _onShow() {
        if (this._shouldMuteOnHide()) {
            this._fadeIn(0.5);
        }
    }
    ;
    /**
     * @static
     * @method _shouldMuteOnHide
     * @private
     */
    static _shouldMuteOnHide() {
        return false;
    }
    ;
    /**
     * @static
     * @method _fadeIn
     * @param {Number} duration
     * @private
     */
    static _fadeIn(duration) {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const currentTime = this._context.currentTime;
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(this._masterVolume, currentTime + duration);
        }
    }
    ;
    /**
     * @static
     * @method _fadeOut
     * @param {Number} duration
     * @private
     */
    static _fadeOut(duration) {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const currentTime = this._context.currentTime;
            gain.setValueAtTime(this._masterVolume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
    }
    ;
    /**
     * Clears the audio data.
     *
     * @method clear
     */
    clear() {
        this.stop();
        this._buffer = null;
        this._sourceNode = null;
        this._gainNode = null;
        this._pannerNode = null;
        this._totalTime = 0;
        this._sampleRate = 0;
        this._loopStart = 0;
        this._loopLength = 0;
        this._startTime = 0;
        this._volume = 1;
        this._pitch = 1;
        this._pan = 0;
        this._endTimer = null;
        this._loadListeners = [];
        this._stopListeners = [];
        this._hasError = false;
        this._autoPlay = false;
    }
    ;
    /**
     * [read-only] The url of the audio file.
     *
     * @property url
     * @type String
     */
    get url() {
        return this._url;
    }
    /**
     * The volume of the audio.
     *
     * @property volume
     * @type Number
     */
    get volume() {
        return this._volume;
    }
    set volume(value) {
        this._volume = value;
        if (this._gainNode) {
            this._gainNode.gain.setValueAtTime(this._volume, WebAudio._context.currentTime);
        }
    }
    /**
     * The pitch of the audio.
     *
     * @property pitch
     * @type Number
     */
    get pitch() {
        return this._pitch;
    }
    set pitch(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._sourceNode.loop, 0);
            }
        }
    }
    /**
     * The pan of the audio.
     *
     * @property pan
     * @type Number
     */
    get pan() {
        return this._pan;
    }
    set pan(value) {
        this._pan = value;
        this._updatePanner();
    }
    /**
     * Checks whether the audio data is ready to play.
     *
     * @method isReady
     * @return {Boolean} True if the audio data is ready to play
     */
    isReady() {
        return !!this._buffer;
    }
    ;
    /**
     * Checks whether a loading error has occurred.
     *
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    isError() {
        return this._hasError;
    }
    ;
    /**
     * Checks whether the audio is playing.
     *
     * @method isPlaying
     * @return {Boolean} True if the audio is playing
     */
    isPlaying() {
        return !!this._sourceNode;
    }
    ;
    /**
     * Plays the audio.
     *
     * @method play
     * @param {Boolean} loop Whether the audio data play in a loop
     * @param {Number} offset The start position to play in seconds
     */
    play(loop, offset) {
        if (this.isReady()) {
            offset = offset || 0;
            this._startPlaying(loop, offset);
        }
        else if (WebAudio._context) {
            this._autoPlay = true;
            this.addLoadListener(function () {
                if (this._autoPlay) {
                    this.play(loop, offset);
                }
            }.bind(this));
        }
    }
    ;
    /**
     * Stops the audio.
     *
     * @method stop
     */
    stop() {
        this._autoPlay = false;
        this._removeEndTimer();
        this._removeNodes();
        if (this._stopListeners) {
            while (this._stopListeners.length > 0) {
                const listner = this._stopListeners.shift();
                listner();
            }
        }
    }
    ;
    /**
     * Performs the audio fade-in.
     *
     * @method fadeIn
     * @param {Number} duration Fade-in time in seconds
     */
    fadeIn(duration) {
        if (this.isReady()) {
            if (this._gainNode) {
                const gain = this._gainNode.gain;
                const currentTime = WebAudio._context.currentTime;
                gain.setValueAtTime(0, currentTime);
                gain.linearRampToValueAtTime(this._volume, currentTime + duration);
            }
        }
        else if (this._autoPlay) {
            this.addLoadListener(function () {
                this.fadeIn(duration);
            }.bind(this));
        }
    }
    ;
    /**
     * Performs the audio fade-out.
     *
     * @method fadeOut
     * @param {Number} duration Fade-out time in seconds
     */
    fadeOut(duration) {
        if (this._gainNode) {
            const gain = this._gainNode.gain;
            const currentTime = WebAudio._context.currentTime;
            gain.setValueAtTime(this._volume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
        this._autoPlay = false;
    }
    ;
    /**
     * Gets the seek position of the audio.
     *
     * @method seek
     */
    seek() {
        if (WebAudio._context) {
            let pos = (WebAudio._context.currentTime - this._startTime) * this._pitch;
            if (this._loopLength > 0) {
                while (pos >= this._loopStart + this._loopLength) {
                    pos -= this._loopLength;
                }
            }
            return pos;
        }
        else {
            return 0;
        }
    }
    ;
    /**
     * Add a callback function that will be called when the audio data is loaded.
     *
     * @method addLoadListener
     * @param {Function} listner The callback function
     */
    addLoadListener(listner) {
        this._loadListeners.push(listner);
    }
    ;
    /**
     * Add a callback function that will be called when the playback is stopped.
     *
     * @method addStopListener
     * @param {Function} listner The callback function
     */
    addStopListener(listner) {
        this._stopListeners.push(listner);
    }
    ;
    /**
     * @method _load
     * @param {String} url
     * @private
     */
    _load(url) {
        if (WebAudio._context) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (xhr.status < 400) {
                    this._onXhrLoad(xhr);
                }
            }.bind(this);
            xhr.onerror = this._loader || function () { this._hasError = true; }.bind(this);
            xhr.send();
        }
    }
    ;
    /**
     * @method _onXhrLoad
     * @param {XMLHttpRequest} xhr
     * @private
     */
    _onXhrLoad(xhr) {
        const array = xhr.response;
        this._readLoopComments(new Uint8Array(array));
        WebAudio._context.decodeAudioData(array, function (buffer) {
            this._buffer = buffer;
            this._totalTime = buffer.duration;
            if (this._loopLength > 0 && this._sampleRate > 0) {
                this._loopStart /= this._sampleRate;
                this._loopLength /= this._sampleRate;
            }
            else {
                this._loopStart = 0;
                this._loopLength = this._totalTime;
            }
            this._onLoad();
        }.bind(this));
    }
    ;
    /**
     * @method _startPlaying
     * @param {Boolean} loop
     * @param {Number} offset
     * @private
     */
    _startPlaying(loop, offset) {
        this._removeEndTimer();
        this._removeNodes();
        this._createNodes();
        this._connectNodes();
        this._sourceNode.loop = loop;
        this._sourceNode.start(0, offset);
        this._startTime = WebAudio._context.currentTime - offset / this._pitch;
        this._createEndTimer();
    }
    ;
    /**
     * @method _createNodes
     * @private
     */
    _createNodes() {
        const context = WebAudio._context;
        this._sourceNode = context.createBufferSource();
        this._sourceNode.buffer = this._buffer;
        this._sourceNode.loopStart = this._loopStart;
        this._sourceNode.loopEnd = this._loopStart + this._loopLength;
        this._sourceNode.playbackRate.setValueAtTime(this._pitch, context.currentTime);
        this._gainNode = context.createGain();
        this._gainNode.gain.setValueAtTime(this._volume, context.currentTime);
        this._pannerNode = context.createPanner();
        this._pannerNode.panningModel = 'equalpower';
        this._updatePanner();
    }
    ;
    /**
     * @method _connectNodes
     * @private
     */
    _connectNodes() {
        this._sourceNode.connect(this._gainNode);
        this._gainNode.connect(this._pannerNode);
        this._pannerNode.connect(WebAudio._masterGainNode);
    }
    ;
    /**
     * @method _removeNodes
     * @private
     */
    _removeNodes() {
        if (this._sourceNode) {
            this._sourceNode.stop(0);
            this._sourceNode = null;
            this._gainNode = null;
            this._pannerNode = null;
        }
    }
    ;
    /**
     * @method _createEndTimer
     * @private
     */
    _createEndTimer() {
        if (this._sourceNode && !this._sourceNode.loop) {
            const endTime = this._startTime + this._totalTime / this._pitch;
            const delay = endTime - WebAudio._context.currentTime;
            this._endTimer = setTimeout(function () {
                this.stop();
            }.bind(this), delay * 1000);
        }
    }
    ;
    /**
     * @method _removeEndTimer
     * @private
     */
    _removeEndTimer() {
        if (this._endTimer) {
            clearTimeout(this._endTimer);
            this._endTimer = null;
        }
    }
    ;
    /**
     * @method _updatePanner
     * @private
     */
    _updatePanner() {
        if (this._pannerNode) {
            const x = this._pan;
            const z = 1 - Math.abs(x);
            this._pannerNode.setPosition(x, 0, z);
        }
    }
    ;
    /**
     * @method _onLoad
     * @private
     */
    _onLoad() {
        while (this._loadListeners.length > 0) {
            const listner = this._loadListeners.shift();
            listner();
        }
    }
    ;
    /**
     * @method _readLoopComments
     * @param {Uint8Array} array
     * @private
     */
    _readLoopComments(array) {
        this._readOgg(array);
        this._readMp4(array);
    }
    ;
    /**
     * @method _readOgg
     * @param {Uint8Array} array
     * @private
     */
    _readOgg(array) {
        let index = 0;
        while (index < array.length) {
            if (this._readFourCharacters(array, index) === 'OggS') {
                index += 26;
                let vorbisHeaderFound = false;
                const numSegments = array[index++];
                const segments = [];
                for (let i = 0; i < numSegments; i++) {
                    segments.push(array[index++]);
                }
                for (let i = 0; i < numSegments; i++) {
                    if (this._readFourCharacters(array, index + 1) === 'vorb') {
                        const headerType = array[index];
                        if (headerType === 1) {
                            this._sampleRate = this._readLittleEndian(array, index + 12);
                        }
                        else if (headerType === 3) {
                            this._readMetaData(array, index, segments[i]);
                        }
                        vorbisHeaderFound = true;
                    }
                    index += segments[i];
                }
                if (!vorbisHeaderFound) {
                    break;
                }
            }
            else {
                break;
            }
        }
    }
    ;
    /**
     * @method _readMp4
     * @param {Uint8Array} array
     * @private
     */
    _readMp4(array) {
        if (this._readFourCharacters(array, 4) === 'ftyp') {
            let index = 0;
            while (index < array.length) {
                const size = this._readBigEndian(array, index);
                const name = this._readFourCharacters(array, index + 4);
                if (name === 'moov') {
                    index += 8;
                }
                else {
                    if (name === 'mvhd') {
                        this._sampleRate = this._readBigEndian(array, index + 20);
                    }
                    if (name === 'udta' || name === 'meta') {
                        this._readMetaData(array, index, size);
                    }
                    index += size;
                    if (size <= 1) {
                        break;
                    }
                }
            }
        }
    }
    ;
    /**
     * @method _readMetaData
     * @param {Uint8Array} array
     * @param {Number} index
     * @param {Number} size
     * @private
     */
    _readMetaData(array, index, size) {
        for (let i = index; i < index + size - 10; i++) {
            if (this._readFourCharacters(array, i) === 'LOOP') {
                let text = '';
                while (array[i] > 0) {
                    text += String.fromCharCode(array[i++]);
                }
                if (text.match(/LOOPSTART=([0-9]+)/)) {
                    this._loopStart = parseInt(RegExp.$1);
                }
                if (text.match(/LOOPLENGTH=([0-9]+)/)) {
                    this._loopLength = parseInt(RegExp.$1);
                }
                if (text == 'LOOPSTART' || text == 'LOOPLENGTH') {
                    let text2 = '';
                    i += 16;
                    while (array[i] > 0) {
                        text2 += String.fromCharCode(array[i++]);
                    }
                    if (text == 'LOOPSTART') {
                        this._loopStart = parseInt(text2);
                    }
                    else {
                        this._loopLength = parseInt(text2);
                    }
                }
            }
        }
    }
    ;
    /**
     * @method _readLittleEndian
     * @param {Uint8Array} array
     * @param {Number} index
     * @private
     */
    _readLittleEndian(array, index) {
        return (array[index + 3] * 0x1000000 + array[index + 2] * 0x10000 +
            array[index + 1] * 0x100 + array[index + 0]);
    }
    ;
    /**
     * @method _readBigEndian
     * @param {Uint8Array} array
     * @param {Number} index
     * @private
     */
    _readBigEndian(array, index) {
        return (array[index + 0] * 0x1000000 + array[index + 1] * 0x10000 +
            array[index + 2] * 0x100 + array[index + 3]);
    }
    ;
    /**
     * @method _readFourCharacters
     * @param {Uint8Array} array
     * @param {Number} index
     * @private
     */
    _readFourCharacters(array, index) {
        let string = '';
        for (let i = 0; i < 4; i++) {
            string += String.fromCharCode(array[index + i]);
        }
        return string;
    }
    ;
}
WebAudio._masterVolume = 1;
WebAudio._context = null;
WebAudio._masterGainNode = null;
WebAudio._initialized = false;
WebAudio._unlocked = false;
WebAudio._standAlone = (function (top) {
    return !top['ResourceHandler'];
})(window);

//-----------------------------------------------------------------------------
/**
 * The static class that handles HTML5 Audio.
 *
 * @class Html5Audio
 * @constructor
 */
class Html5Audio {
    /**
     * Sets up the Html5 Audio.
     *
     * @static
     * @method setup
     * @param {String} url The url of the audio file
     */
    static setup(url) {
        if (!this._initialized) {
            this.initialize();
        }
        this.clear();
        this._url = url;
    }
    ;
    /**
     * Initializes the audio system.
     *
     * @static
     * @method initialize
     * @return {Boolean} True if the audio system is available
     */
    static initialize() {
        if (!this._initialized) {
            if (!this._audioElement) {
                try {
                    this._audioElement = new Audio();
                }
                catch (e) {
                    this._audioElement = null;
                }
            }
            if (!!this._audioElement)
                this._setupEventHandlers();
            this._initialized = true;
        }
        return !!this._audioElement;
    }
    ;
    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    static _setupEventHandlers() {
        document.addEventListener('touchstart', this._onTouchStart.bind(this));
        document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
        this._audioElement.addEventListener("loadeddata", this._onLoadedData.bind(this));
        this._audioElement.addEventListener("error", this._onError.bind(this));
        this._audioElement.addEventListener("ended", this._onEnded.bind(this));
    }
    ;
    /**
     * @static
     * @method _onTouchStart
     * @private
     */
    static _onTouchStart() {
        if (this._audioElement && !this._unlocked) {
            if (this._isLoading) {
                this._load(this._url);
                this._unlocked = true;
            }
            else {
                if (this._staticSePath) {
                    this._audioElement.src = this._staticSePath;
                    this._audioElement.volume = 0;
                    this._audioElement.loop = false;
                    this._audioElement.play();
                    this._unlocked = true;
                }
            }
        }
    }
    ;
    /**
     * @static
     * @method _onVisibilityChange
     * @private
     */
    static _onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this._onHide();
        }
        else {
            this._onShow();
        }
    }
    ;
    /**
     * @static
     * @method _onLoadedData
     * @private
     */
    static _onLoadedData() {
        this._buffered = true;
        if (this._unlocked)
            this._onLoad();
    }
    ;
    /**
     * @static
     * @method _onError
     * @private
     */
    static _onError() {
        this._hasError = true;
    }
    ;
    /**
     * @static
     * @method _onEnded
     * @private
     */
    static _onEnded() {
        if (!this._audioElement.loop) {
            this.stop();
        }
    }
    ;
    /**
     * @static
     * @method _onHide
     * @private
     */
    static _onHide() {
        this._audioElement.volume = 0;
        this._tweenGain = 0;
    }
    ;
    /**
     * @static
     * @method _onShow
     * @private
     */
    static _onShow() {
        this.fadeIn(0.5);
    }
    ;
    /**
     * Clears the audio data.
     *
     * @static
     * @method clear
     */
    static clear() {
        this.stop();
        this._volume = 1;
        this._loadListeners = [];
        this._hasError = false;
        this._autoPlay = false;
        this._isLoading = false;
        this._buffered = false;
    }
    ;
    /**
     * Set the URL of static se.
     *
     * @static
     * @param {String} url
     */
    static setStaticSe(url) {
        if (!this._initialized) {
            this.initialize();
            this.clear();
        }
        this._staticSePath = url;
    }
    ;
    /**
     * [read-only] The url of the audio file.
     *
     * @property url
     * @type String
     */
    static get url() {
        return this._url;
    }
    /**
     * The volume of the audio.
     *
     * @property volume
     * @type Number
     */
    static get volume() {
        return this._volume;
    }
    static set volumne(value) {
        this._volume = value;
        if (this._audioElement) {
            this._audioElement.volume = this._volume;
        }
    }
    /**
     * Checks whether the audio data is ready to play.
     *
     * @static
     * @method isReady
     * @return {Boolean} True if the audio data is ready to play
     */
    static isReady() {
        return this._buffered;
    }
    ;
    /**
     * Checks whether a loading error has occurred.
     *
     * @static
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    static isError() {
        return this._hasError;
    }
    ;
    /**
     * Checks whether the audio is playing.
     *
     * @static
     * @method isPlaying
     * @return {Boolean} True if the audio is playing
     */
    static isPlaying() {
        return !this._audioElement.paused;
    }
    ;
    /**
     * Plays the audio.
     *
     * @static
     * @method play
     * @param {Boolean} loop Whether the audio data play in a loop
     * @param {Number} offset The start position to play in seconds
     */
    static play(loop, offset = 0) {
        if (this.isReady()) {
            offset = offset;
            this._startPlaying(loop, offset);
        }
        else if (this._audioElement) {
            this._autoPlay = true;
            this.addLoadListener(function () {
                if (this._autoPlay) {
                    this.play(loop, offset);
                    if (this._gainTweenInterval) {
                        clearInterval(this._gainTweenInterval);
                        this._gainTweenInterval = null;
                    }
                }
            }.bind(this));
            if (!this._isLoading)
                this._load(this._url);
        }
    }
    ;
    static stop() {
        if (this._audioElement)
            this._audioElement.pause();
        this._autoPlay = false;
        if (this._tweenInterval) {
            clearInterval(this._tweenInterval);
            this._tweenInterval = null;
            this._audioElement.volume = 0;
        }
    }
    ;
    /**
     * Performs the audio fade-in.
     *
     * @static
     * @method fadeIn
     * @param {Number} duration Fade-in time in seconds
     */
    static fadeIn(duration) {
        if (this.isReady()) {
            if (this._audioElement) {
                this._tweenTargetGain = this._volume;
                this._tweenGain = 0;
                this._startGainTween(duration);
            }
        }
        else if (this._autoPlay) {
            this.addLoadListener(function () {
                this.fadeIn(duration);
            }.bind(this));
        }
    }
    ;
    /**
     * Performs the audio fade-out.
     *
     * @static
     * @method fadeOut
     * @param {Number} duration Fade-out time in seconds
     */
    static fadeOut(duration) {
        if (this._audioElement) {
            this._tweenTargetGain = 0;
            this._tweenGain = this._volume;
            this._startGainTween(duration);
        }
    }
    ;
    /**
     * Gets the seek position of the audio.
     *
     * @static
     * @method seek
     */
    static seek() {
        if (this._audioElement) {
            return this._audioElement.currentTime;
        }
        else {
            return 0;
        }
    }
    ;
    /**
     * Add a callback function that will be called when the audio data is loaded.
     *
     * @static
     * @method addLoadListener
     * @param {Function} listner The callback function
     */
    static addLoadListener(listner) {
        this._loadListeners.push(listner);
    }
    ;
    /**
     * @static
     * @method _load
     * @param {String} url
     * @private
     */
    static _load(url) {
        if (this._audioElement) {
            this._isLoading = true;
            this._audioElement.src = url;
            this._audioElement.load();
        }
    }
    ;
    /**
     * @static
     * @method _startPlaying
     * @param {Boolean} loop
     * @param {Number} offset
     * @private
     */
    static _startPlaying(loop, offset) {
        this._audioElement.loop = loop;
        if (this._gainTweenInterval) {
            clearInterval(this._gainTweenInterval);
            this._gainTweenInterval = null;
        }
        if (this._audioElement) {
            this._audioElement.volume = this._volume;
            this._audioElement.currentTime = offset;
            this._audioElement.play();
        }
    }
    ;
    /**
     * @static
     * @method _onLoad
     * @private
     */
    static _onLoad() {
        this._isLoading = false;
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener();
        }
    }
    ;
    /**
     * @static
     * @method _startGainTween
     * @param {Number} duration
     * @private
     */
    static _startGainTween(duration) {
        this._audioElement.volume = this._tweenGain;
        if (this._gainTweenInterval) {
            clearInterval(this._gainTweenInterval);
            this._gainTweenInterval = null;
        }
        this._tweenGainStep = (this._tweenTargetGain - this._tweenGain) / (60 * duration);
        this._gainTweenInterval = setInterval(function () {
            this._applyTweenValue(this._tweenTargetGain);
        }, 1000 / 60);
    }
    ;
    /**
     * @static
     * @method _applyTweenValue
     * @param {Number} volume
     * @private
     */
    static applyTweenValue(volume) {
        this._tweenGain += this._tweenGainStep;
        if (this._tweenGain < 0 && this._tweenGainStep < 0) {
            this._tweenGain = 0;
        }
        else if (this._tweenGain > volume && this._tweenGainStep > 0) {
            this._tweenGain = volume;
        }
        if (Math.abs(this._tweenTargetGain - this._tweenGain) < 0.01) {
            this._tweenGain = this._tweenTargetGain;
            clearInterval(this._gainTweenInterval);
            this._gainTweenInterval = null;
        }
        this._audioElement.volume = this._tweenGain;
    }
    ;
}
Html5Audio._initialized = false;
Html5Audio._unlocked = false;
Html5Audio._audioElement = null;
Html5Audio._gainTweenInterval = null;
Html5Audio._tweenGain = 0;
Html5Audio._tweenTargetGain = 0;
Html5Audio._tweenGainStep = 0;
Html5Audio._staticSePath = null;

//-----------------------------------------------------------------------------
/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
class JsonEx {
    static _generateId() {
        return JsonEx._id++;
    }
    ;
    /**
     * Converts an object to a JSON string with object information.
     *
     * @static
     * @method stringify
     * @param {Object} object The object to be converted
     * @return {String} The JSON string
     */
    static stringify(object) {
        const circular = [];
        JsonEx._id = 1;
        const json = JSON.stringify(this._encode(object, circular, 0));
        this._cleanMetadata(object);
        this._restoreCircularReference(circular);
        return json;
    }
    ;
    static _restoreCircularReference(circulars) {
        circulars.forEach(function (circular) {
            const key = circular[0];
            const value = circular[1];
            const content = circular[2];
            value[key] = content;
        });
    }
    ;
    /**
     * Parses a JSON string and reconstructs the corresponding object.
     *
     * @static
     * @method parse
     * @param {String} json The JSON string
     * @return {Object} The reconstructed object
     */
    static parse(json) {
        const circular = [];
        const registry = {};
        const contents = this._decode(JSON.parse(json), circular, registry);
        this._cleanMetadata(contents);
        this._linkCircularReference(contents, circular, registry);
        return contents;
    }
    ;
    static _linkCircularReference(contents, circulars, registry) {
        circulars.forEach(function (circular) {
            const key = circular[0];
            const value = circular[1];
            const id = circular[2];
            value[key] = registry[id];
        });
    }
    ;
    static _cleanMetadata(object) {
        if (!object)
            return;
        delete object['@'];
        delete object['@c'];
        if (typeof object === 'object') {
            Object.keys(object).forEach((key) => {
                const value = object[key];
                if (typeof value === 'object') {
                    JsonEx._cleanMetadata(value);
                }
            });
        }
    }
    ;
    /**
     * Makes a deep copy of the specified object.
     *
     * @static
     * @method makeDeepCopy
     * @param {Object} object The object to be copied
     * @return {Object} The copied object
     */
    static makeDeepCopy(object) {
        return this.parse(this.stringify(object));
    }
    ;
    /**
     * @static
     * @method _encode
     * @param {Object} value
     * @param {Array} circular
     * @param {Number} depth
     * @return {Object}
     * @private
     */
    static _encode(value, circular, depth) {
        depth = depth || 0;
        if (++depth >= this.maxDepth) {
            throw new Error('Object too deep');
        }
        const type = Object.prototype.toString.call(value);
        if (type === '[object Object]' || type === '[object Array]') {
            value['@c'] = JsonEx._generateId();
            const constructorName = this._getConstructorName(value);
            if (constructorName !== 'Object' && constructorName !== 'Array') {
                value['@'] = constructorName;
            }
            for (let key in value) {
                if (value.hasOwnProperty(key) && !key.match(/^@./)) {
                    if (value[key] && typeof value[key] === 'object') {
                        if (value[key]['@c']) {
                            circular.push([key, value, value[key]]);
                            value[key] = { '@r': value[key]['@c'] };
                        }
                        else {
                            value[key] = this._encode(value[key], circular, depth + 1);
                            if (value[key] instanceof Array) {
                                //wrap array
                                circular.push([key, value, value[key]]);
                                value[key] = {
                                    '@c': value[key]['@c'],
                                    '@a': value[key]
                                };
                            }
                        }
                    }
                    else {
                        value[key] = this._encode(value[key], circular, depth + 1);
                    }
                }
            }
        }
        depth--;
        return value;
    }
    ;
    /**
     * @static
     * @method _decode
     * @param {Object} value
     * @param {Array} circular
     * @param {Object} registry
     * @return {Object}
     * @private
     */
    static _decode(value, circular, registry) {
        const type = Object.prototype.toString.call(value);
        if (type === '[object Object]' || type === '[object Array]') {
            registry[value['@c']] = value;
            if (value['@']) {
                const constructor = window[value['@']];
                if (constructor) {
                    value = this._resetPrototype(value, constructor.prototype);
                }
            }
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    if (value[key] && value[key]['@a']) {
                        //object is array wrapper
                        const body = value[key]['@a'];
                        body['@c'] = value[key]['@c'];
                        value[key] = body;
                    }
                    if (value[key] && value[key]['@r']) {
                        //object is reference
                        circular.push([key, value, value[key]['@r']]);
                    }
                    value[key] = this._decode(value[key], circular, registry);
                }
            }
        }
        return value;
    }
    ;
    /**
     * @static
     * @method _getConstructorName
     * @param {Object} value
     * @return {String}
     * @private
     */
    static _getConstructorName(value) {
        let name = value.constructor.name;
        if (name === undefined) {
            const func = /^\s*function\s*([A-Za-z0-9_$]*)/;
            name = func.exec(value.constructor)[1];
        }
        return name;
    }
    ;
    /**
     * @static
     * @method _resetPrototype
     * @param {Object} value
     * @param {Object} prototype
     * @return {Object}
     * @private
     */
    static _resetPrototype(value, prototype) {
        if (Object.setPrototypeOf !== undefined) {
            Object.setPrototypeOf(value, prototype);
        }
        else if ('__proto__' in value) {
            value.__proto__ = prototype;
        }
        else {
            const newValue = Object.create(prototype);
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    newValue[key] = value[key];
                }
            }
            value = newValue;
        }
        return value;
    }
    ;
}
/**
 * The maximum depth of objects.
 *
 * @static
 * @property maxDepth
 * @type Number
 * @default 100
 */
JsonEx.maxDepth = 100;
JsonEx._id = 1;

// STAGE



var index = Object.freeze({
	Bitmap: Bitmap,
	CacheEntry: CacheEntry,
	CacheMap: CacheMap,
	CoreWindow: CoreWindow,
	Graphics: Graphics,
	Html5Audio: Html5Audio,
	ImageCache: ImageCache,
	Input: Input,
	JsonEx: JsonEx,
	RequestQueue: RequestQueue,
	ResourceHandler: ResourceHandler,
	ScreenSprite: ScreenSprite,
	ShaderTilemap: ShaderTilemap,
	Sprite: Sprite,
	Stage: Stage,
	Tilemap: Tilemap,
	TilingSprite: TilingSprite,
	ToneFilter: ToneFilter,
	TouchInput: TouchInput,
	Utils: Utils,
	Weather: Weather,
	WebAudio: WebAudio,
	WindowLayer: WindowLayer
});

exports.Core = index;
exports.Managers = index$1;
exports.Objects = index$4;
exports.Scenes = index$2;
exports.Sprites = index$5;
exports.Windows = index$3;

Object.defineProperty(exports, '__esModule', { value: true });

})));
