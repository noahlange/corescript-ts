//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */
class Graphics {
    protected static _cssFontLoading = document.fonts && document.fonts.ready;
    protected static _fontLoaded = null;
    protected static _videoVolume = 1;


    protected static _width: number;
    protected static _height: number;
    protected static _rendererType: string;
    protected static _boxWidth: number;
    protected static _boxHeight: number;
    protected static _scale: number;
    protected static _realScale: number;
    protected static _errorShowed: boolean;
    protected static _errorPrinter: any;
    protected static _canvas: any;
    protected static _video: any;
    protected static _videoUnlocked: boolean;
    protected static _videoLoading: boolean;
    protected static _upperCanvas: any;

    /// bungcip: mesti public karena diakses oleh kelas Bitmap, nantinya harus dibetulkan itu
    public static _renderer: any;

    protected static _fpsMeter: any;
    protected static _modeBox: any;
    protected static _skipCount: number;
    protected static _maxSkip: number;
    protected static _rendered: boolean;
    protected static _loadingImage: any;
    protected static _loadingCount: number;
    protected static _fpsMeterToggled: boolean;
    protected static _stretchEnabled: boolean;

    protected static _canUseDifferenceBlend: boolean;
    protected static _canUseSaturationBlend: boolean;
    protected static _hiddenCanvas: any;

    /**
     * Initializes the graphics system.
     *
     * @static
     * @method initialize
     * @param {Number} width The width of the game screen
     * @param {Number} height The height of the game screen
     * @param {String} type The type of the renderer.
     *                 'canvas', 'webgl', or 'auto'.
     */
    static initialize(width, height, type) {
        this._width = width || 800;
        this._height = height || 600;
        this._rendererType = type || 'auto';
        this._boxWidth = this._width;
        this._boxHeight = this._height;

        this._scale = 1;
        this._realScale = 1;

        this._errorShowed = false;
        this._errorPrinter = null;
        this._canvas = null;
        this._video = null;
        this._videoUnlocked = !Utils.isMobileDevice();
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
    };

    protected static _setupCssFontLoading() {
        if (Graphics._cssFontLoading) {
            document.fonts.ready.then(function (fonts) {
                Graphics._fontLoaded = fonts;
            }).catch(function (error) {
                SceneManager.onError(error);
            });
        }
    };

    static canUseCssFontLoading() {
        return !!this._cssFontLoading;
    };

    /**
     * The total frame count of the game screen.
     *
     * @static
     * @property frameCount
     * @type Number
     */
    static frameCount = 0;

    /**
     * The alias of PIXI.blendModes.NORMAL.
     *
     * @static
     * @property BLEND_NORMAL
     * @type Number
     * @final
     */
    static BLEND_NORMAL = 0;

    /**
     * The alias of PIXI.blendModes.ADD.
     *
     * @static
     * @property BLEND_ADD
     * @type Number
     * @final
     */
    static BLEND_ADD = 1;

    /**
     * The alias of PIXI.blendModes.MULTIPLY.
     *
     * @static
     * @property BLEND_MULTIPLY
     * @type Number
     * @final
     */
    static BLEND_MULTIPLY = 2;

    /**
     * The alias of PIXI.blendModes.SCREEN.
     *
     * @static
     * @property BLEND_SCREEN
     * @type Number
     * @final
     */
    static BLEND_SCREEN = 3;

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
    };

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
    };

    /**
     * Renders the stage to the game screen.
     *
     * @static
     * @method render
     * @param {Stage} stage The stage object to be rendered
     */
    static render(stage: Stage) {
        if (this._skipCount === 0) {
            var startTime = Date.now();
            if (stage) {
                this._renderer.render(stage);
                if (this._renderer.gl && this._renderer.gl.flush) {
                    this._renderer.gl.flush();
                }
            }
            var endTime = Date.now();
            var elapsed = endTime - startTime;
            this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
            this._rendered = true;
        } else {
            this._skipCount--;
            this._rendered = false;
        }
        this.frameCount++;
    };

    /**
     * Checks whether the renderer type is WebGL.
     *
     * @static
     * @method isWebGL
     * @return {Boolean} True if the renderer type is WebGL
     */
    static isWebGL() {
        return this._renderer && this._renderer.type === PIXI.RENDERER_TYPE.WEBGL;
    };

    /**
     * Checks whether the current browser supports WebGL.
     *
     * @static
     * @method hasWebGL
     * @return {Boolean} True if the current browser supports WebGL.
     */
    static hasWebGL() {
        try {
            var canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    };

    /**
     * Checks whether the canvas blend mode 'difference' is supported.
     *
     * @static
     * @method canUseDifferenceBlend
     * @return {Boolean} True if the canvas blend mode 'difference' is supported
     */
    static canUseDifferenceBlend() {
        return this._canUseDifferenceBlend;
    };

    /**
     * Checks whether the canvas blend mode 'saturation' is supported.
     *
     * @static
     * @method canUseSaturationBlend
     * @return {Boolean} True if the canvas blend mode 'saturation' is supported
     */
    static canUseSaturationBlend() {
        return this._canUseSaturationBlend;
    };

    /**
     * Sets the source of the "Now Loading" image.
     *
     * @static
     * @method setLoadingImage
     */
    static setLoadingImage(src: string) {
        this._loadingImage = new Image();
        this._loadingImage.src = src;
    };

    /**
     * Initializes the counter for displaying the "Now Loading" image.
     *
     * @static
     * @method startLoading
     */
    static startLoading() {
        this._loadingCount = 0;
    };

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
    };

    /**
     * Erases the "Now Loading" image.
     *
     * @static
     * @method endLoading
     */
    static endLoading() {
        this._clearUpperCanvas();
        this._upperCanvas.style.opacity = 0;
    };

    /**
     * Displays the loading error text to the screen.
     *
     * @static
     * @method printLoadingError
     * @param {String} url The url of the resource failed to load
     */
    static printLoadingError(url: string) {
        if (this._errorPrinter && !this._errorShowed) {
            this._errorPrinter.innerHTML = this._makeErrorHtml('Loading Error', 'Failed to load: ' + url);
            var button = document.createElement('button');
            button.innerHTML = 'Retry';
            button.style.fontSize = '24px';
            button.style.color = '#ffffff';
            button.style.backgroundColor = '#000000';
            button.onmousedown = button.ontouchstart = function (event: TouchEvent | Event) {
                ResourceHandler.retry();
                event.stopPropagation();
            };
            this._errorPrinter.appendChild(button);
            this._loadingCount = -Infinity;
        }
    };

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
    };

    /**
     * Displays the error text to the screen.
     *
     * @static
     * @method printError
     * @param {String} name The name of the error
     * @param {String} message The message of the error
     */
    static printError(name: string, message: string) {
        this._errorShowed = true;
        if (this._errorPrinter) {
            this._errorPrinter.innerHTML = this._makeErrorHtml(name, message);
        }
        this._applyCanvasFilter();
        this._clearUpperCanvas();
    };

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
    };

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
    };

    /**
     * Loads a font file.
     *
     * @static
     * @method loadFont
     * @param {String} name The face name of the font
     * @param {String} url The url of the font file
     */
    static loadFont(name: string, url: string) {
        var style = document.createElement('style');
        var head = document.getElementsByTagName('head');
        var rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
        style.type = 'text/css';
        head.item(0).appendChild(style);
        style.sheet.insertRule(rule, 0);
        this._createFontLoader(name);
    };

    /**
     * Checks whether the font file is loaded.
     *
     * @static
     * @method isFontLoaded
     * @param {String} name The face name of the font
     * @return {Boolean} True if the font file is loaded
     */
    static isFontLoaded(name: string): boolean {
        if (Graphics._cssFontLoading) {
            if (Graphics._fontLoaded) {
                return Graphics._fontLoaded.check('10px "' + name + '"');
            }

            return false;
        } else {
            if (!this._hiddenCanvas) {
                this._hiddenCanvas = document.createElement('canvas');
            }
            var context = this._hiddenCanvas.getContext('2d');
            var text = 'abcdefghijklmnopqrstuvwxyz';
            var width1, width2;
            context.font = '40px ' + name + ', sans-serif';
            width1 = context.measureText(text).width;
            context.font = '40px sans-serif';
            width2 = context.measureText(text).width;
            return width1 !== width2;
        }
    };

    /**
     * Starts playback of a video.
     *
     * @static
     * @method playVideo
     * @param {String} src
     */
    static _videoLoader = null;
    static playVideo(src: string) {
        this._videoLoader = ResourceHandler.createLoader(null, this._playVideo.bind(this, src), this._onVideoError.bind(this));
        this._playVideo(src);
    };

    /**
     * @static
     * @method _playVideo
     * @param {String} src
     * @private
     */
    protected static _playVideo(src: string) {
        this._video.src = src;
        this._video.onloadeddata = this._onVideoLoad.bind(this);
        this._video.onerror = this._videoLoader;
        this._video.onended = this._onVideoEnd.bind(this);
        this._video.load();
        this._videoLoading = true;
    };

    /**
     * Checks whether the video is playing.
     *
     * @static
     * @method isVideoPlaying
     * @return {Boolean} True if the video is playing
     */
    static isVideoPlaying(): boolean {
        return this._videoLoading || this._isVideoVisible();
    };

    /**
     * Checks whether the browser can play the specified video type.
     *
     * @static
     * @method canPlayVideoType
     * @param {String} type The video type to test support for
     * @return {Boolean} True if the browser can play the specified video type
     */
    static canPlayVideoType(type: string) {
        return this._video && this._video.canPlayType(type);
    };

    /**
     * Sets volume of a video.
     *
     * @static
     * @method setVideoVolume
     * @param {Number} value
     */
    static setVideoVolume(value: number) {
        this._videoVolume = value;
        if (this._video) {
            this._video.volume = this._videoVolume;
        }
    };

    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasX
     * @param {Number} x The x coordinate on the page to be converted
     * @return {Number} The x coordinate on the canvas area
     */
    static pageToCanvasX(x: number): number {
        if (this._canvas) {
            var left = this._canvas.offsetLeft;
            return Math.round((x - left) / this._realScale);
        } else {
            return 0;
        }
    };

    /**
     * Converts a y coordinate on the page to the corresponding
     * y coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasY
     * @param {Number} y The y coordinate on the page to be converted
     * @return {Number} The y coordinate on the canvas area
     */
    static pageToCanvasY(y: number): number {
        if (this._canvas) {
            var top = this._canvas.offsetTop;
            return Math.round((y - top) / this._realScale);
        } else {
            return 0;
        }
    };

    /**
     * Checks whether the specified point is inside the game canvas area.
     *
     * @static
     * @method isInsideCanvas
     * @param {Number} x The x coordinate on the canvas area
     * @param {Number} y The y coordinate on the canvas area
     * @return {Boolean} True if the specified point is inside the game canvas area
     */
    static isInsideCanvas(x: number, y: number): boolean {
        return (x >= 0 && x < this._width && y >= 0 && y < this._height);
    };

    /**
     * Calls pixi.js garbage collector
     */
    static callGC() {
        if (this.isWebGL()) {
            Graphics._renderer.textureGC.run();
        }
    };


    /**
     * The width of the game screen.
     *
     * @static
     * @property width
     * @type Number
     */
    static get width(): number {
        return this._width;
    }
    static set width(value: number) {
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
    static get height(): number {
        return this._height;
    }
    static set height(value: number) {
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
    static get boxWidth() : number{
        return this._boxWidth;
    }
    static set boxWidth(value: number) {
        this._boxWidth = value;
    }

    /**
     * The height of the window display area.
     *
     * @static
     * @property boxHeight
     * @type Number
     */
    static get boxHeight() : number{
        return this._boxHeight;
    }
    static set boxHeight(value: number) {
        this._boxHeight = value;
    }

    /**
     * The zoom scale of the game screen.
     *
     * @static
     * @property scale
     * @type Number
     */
    static get scale() : number{
        return this._scale;
    }
    static set scale(value: number) {
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
    protected static _createAllElements() {
        this._createErrorPrinter();
        this._createCanvas();
        this._createVideo();
        this._createUpperCanvas();
        this._createRenderer();
        this._createFPSMeter();
        this._createModeBox();
        this._createGameFontLoader();
    };

    /**
     * @static
     * @method _updateAllElements
     * @private
     */
    protected static _updateAllElements() {
        this._updateRealScale();
        this._updateErrorPrinter();
        this._updateCanvas();
        this._updateVideo();
        this._updateUpperCanvas();
        this._updateRenderer();
        this._paintUpperCanvas();
    };

    /**
     * @static
     * @method _updateRealScale
     * @private
     */
    protected static _updateRealScale() {
        if (this._stretchEnabled) {
            var h = window.innerWidth / this._width;
            var v = window.innerHeight / this._height;
            this._realScale = Math.min(h, v);
        } else {
            this._realScale = this._scale;
        }
    };

    /**
     * @static
     * @method _makeErrorHtml
     * @param {String} name
     * @param {String} message
     * @return {String}
     * @private
     */
    protected static _makeErrorHtml(name: string, message: string): string {
        return ('<font color="yellow"><b>' + name + '</b></font><br>' +
            '<font color="white">' + message + '</font><br>');
    };

    /**
     * @static
     * @method _defaultStretchMode
     * @private
     */
    protected static _defaultStretchMode() {
        return Utils.isNwjs() || Utils.isMobileDevice();
    };

    /**
     * @static
     * @method _testCanvasBlendModes
     * @private
     */
    protected static _testCanvasBlendModes() {
        var canvas, context, imageData1, imageData2;
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
    };

    /**
     * @static
     * @method _modifyExistingElements
     * @private
     */
    protected static _modifyExistingElements() {
        var elements = document.getElementsByTagName('*');
        for (var i = 0; i < elements.length; i++) {
            /// bungcip: diubah agar bisa dicompile
            if ((elements[i] as any).style.zIndex > 0) {
                (elements[i] as any).style.zIndex = 0;
            }
        }
    };

    /**
     * @static
     * @method _createErrorPrinter
     * @private
     */
    protected static _createErrorPrinter() {
        this._errorPrinter = document.createElement('p');
        this._errorPrinter.id = 'ErrorPrinter';
        this._updateErrorPrinter();
        document.body.appendChild(this._errorPrinter);
    };

    /**
     * @static
     * @method _updateErrorPrinter
     * @private
     */
    protected static _updateErrorPrinter() {
        this._errorPrinter.width = this._width * 0.9;
        this._errorPrinter.height = 40;
        this._errorPrinter.style.textAlign = 'center';
        this._errorPrinter.style.textShadow = '1px 1px 3px #000';
        this._errorPrinter.style.fontSize = '20px';
        this._errorPrinter.style.zIndex = 99;
        this._centerElement(this._errorPrinter);
    };

    /**
     * @static
     * @method _createCanvas
     * @private
     */
    protected static _createCanvas() {
        this._canvas = document.createElement('canvas');
        this._canvas.id = 'GameCanvas';
        this._updateCanvas();
        document.body.appendChild(this._canvas);
    };

    /**
     * @static
     * @method _updateCanvas
     * @private
     */
    protected static _updateCanvas() {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.zIndex = 1;
        this._centerElement(this._canvas);
    };

    /**
     * @static
     * @method _createVideo
     * @private
     */
    protected static _createVideo() {
        this._video = document.createElement('video');
        this._video.id = 'GameVideo';
        this._video.style.opacity = 0;
        this._video.setAttribute('playsinline', '');
        this._video.volume = this._videoVolume;
        this._updateVideo();
        makeVideoPlayableInline(this._video);
        document.body.appendChild(this._video);
    };

    /**
     * @static
     * @method _updateVideo
     * @private
     */
    protected static _updateVideo() {
        this._video.width = this._width;
        this._video.height = this._height;
        this._video.style.zIndex = 2;
        this._centerElement(this._video);
    };

    /**
     * @static
     * @method _createUpperCanvas
     * @private
     */
    protected static _createUpperCanvas() {
        this._upperCanvas = document.createElement('canvas');
        this._upperCanvas.id = 'UpperCanvas';
        this._updateUpperCanvas();
        document.body.appendChild(this._upperCanvas);
    };

    /**
     * @static
     * @method _updateUpperCanvas
     * @private
     */
    protected static _updateUpperCanvas() {
        this._upperCanvas.width = this._width;
        this._upperCanvas.height = this._height;
        this._upperCanvas.style.zIndex = 3;
        this._centerElement(this._upperCanvas);
    };

    /**
     * @static
     * @method _clearUpperCanvas
     * @private
     */
    protected static _clearUpperCanvas() {
        var context = this._upperCanvas.getContext('2d');
        context.clearRect(0, 0, this._width, this._height);
    };

    /**
     * @static
     * @method _paintUpperCanvas
     * @private
     */
    protected static _paintUpperCanvas() {
        this._clearUpperCanvas();
        if (this._loadingImage && this._loadingCount >= 20) {
            var context = this._upperCanvas.getContext('2d');
            var dx = (this._width - this._loadingImage.width) / 2;
            var dy = (this._height - this._loadingImage.height) / 2;
            var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
            context.save();
            context.globalAlpha = alpha;
            context.drawImage(this._loadingImage, dx, dy);
            context.restore();
        }
    };

    /**
     * @static
     * @method _createRenderer
     * @private
     */
    protected static _createRenderer() {
        // PIXI.dontSayHello = true;
        var width = this._width;
        var height = this._height;
        var options = { view: this._canvas };
        try {
            switch (this._rendererType) {
                case 'canvas':
                    this._renderer = new PIXI.CanvasRenderer(width, height, options);
                    break;
                case 'webgl':
                    this._renderer = new PIXI.WebGLRenderer(width, height, options);
                    break;
                default:
                    this._renderer = PIXI.autoDetectRenderer(width, height, options);
                    break;
            }

            if (this._renderer && this._renderer.textureGC)
                this._renderer.textureGC.maxIdle = 1;

        } catch (e) {
            this._renderer = null;
        }
    };

    /**
     * @static
     * @method _updateRenderer
     * @private
     */
    protected static _updateRenderer() {
        if (this._renderer) {
            this._renderer.resize(this._width, this._height);
        }
    };

    /**
     * @static
     * @method _createFPSMeter
     * @private
     */
    protected static _createFPSMeter() {
        var options = { graph: 1, decimals: 0, theme: 'transparent', toggleOn: null };
        this._fpsMeter = new FPSMeter(options);
        this._fpsMeter.hide();
    };

    /**
     * @static
     * @method _createModeBox
     * @private
     */
    protected static _createModeBox() {
        var box = document.createElement('div');
        box.id = 'modeTextBack';
        box.style.position = 'absolute';
        box.style.left = '5px';
        box.style.top = '5px';
        box.style.width = '119px';
        box.style.height = '58px';
        box.style.background = 'rgba(0,0,0,0.2)';
        box.style.zIndex = '9';
        box.style.opacity = '0';

        var text = document.createElement('div');
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
        text.innerHTML = this.isWebGL() ? 'WebGL mode' : 'Canvas mode';

        document.body.appendChild(box);
        box.appendChild(text);

        this._modeBox = box;
    };

    /**
     * @static
     * @method _createGameFontLoader
     * @private
     */
    protected static _createGameFontLoader() {
        this._createFontLoader('GameFont');
    };

    /**
     * @static
     * @method _createFontLoader
     * @param {String} name
     * @private
     */
    protected static _createFontLoader(name) {
        var div = document.createElement('div');
        var text = document.createTextNode('.');
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
    };

    /**
     * @static
     * @method _centerElement
     * @param {HTMLElement} element
     * @private
     */
    protected static _centerElement(element) {
        var width = element.width * this._realScale;
        var height = element.height * this._realScale;
        element.style.position = 'absolute';
        element.style.margin = 'auto';
        element.style.top = 0;
        element.style.left = 0;
        element.style.right = 0;
        element.style.bottom = 0;
        element.style.width = width + 'px';
        element.style.height = height + 'px';
    };

    /**
     * @static
     * @method _disableTextSelection
     * @private
     */
    protected static _disableTextSelection() {
        var body = document.body;
        body.style.userSelect = 'none';
        body.style.webkitUserSelect = 'none';
        body.style.msUserSelect = 'none';
        // body.style.mozUserSelect = 'none';
    };

    /**
     * @static
     * @method _disableContextMenu
     * @private
     */
    protected static _disableContextMenu() {
        var elements = document.body.getElementsByTagName('*');
        var oncontextmenu = () => false;
        for (var i = 0; i < elements.length; i++) {
            elements[i]['oncontextmenu'] = oncontextmenu;
        }
    };

    /**
     * @static
     * @method _applyCanvasFilter
     * @private
     */
    protected static _applyCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = 0.5;
            this._canvas.style.filter = 'blur(8px)';
            this._canvas.style.webkitFilter = 'blur(8px)';
        }
    };

    /**
     * @static
     * @method _onVideoLoad
     * @private
     */
    protected static _onVideoLoad() {
        this._video.play();
        this._updateVisibility(true);
        this._videoLoading = false;
    };

    /**
     * @static
     * @method _onVideoError
     * @private
     */
    protected static _onVideoError() {
        this._updateVisibility(false);
        this._videoLoading = false;
    };

    /**
     * @static
     * @method _onVideoEnd
     * @private
     */
    protected static _onVideoEnd() {
        this._updateVisibility(false);
    };

    /**
     * @static
     * @method _updateVisibility
     * @param {Boolean} videoVisible
     * @private
     */
    protected static _updateVisibility(videoVisible) {
        this._video.style.opacity = videoVisible ? 1 : 0;
        this._canvas.style.opacity = videoVisible ? 0 : 1;
    };

    /**
     * @static
     * @method _isVideoVisible
     * @return {Boolean}
     * @private
     */
    protected static _isVideoVisible() {
        return this._video.style.opacity > 0;
    };

    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    protected static _setupEventHandlers() {
        window.addEventListener('resize', this._onWindowResize.bind(this));
        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('touchend', this._onTouchEnd.bind(this));
    };

    /**
     * @static
     * @method _onWindowResize
     * @private
     */
    protected static _onWindowResize() {
        this._updateAllElements();
    };

    /**
     * @static
     * @method _onKeyDown
     * @param {KeyboardEvent} event
     * @private
     */
    protected static _onKeyDown(event) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 113:   // F2
                    event.preventDefault();
                    this._switchFPSMeter();
                    break;
                case 114:   // F3
                    event.preventDefault();
                    this._switchStretchMode();
                    break;
                case 115:   // F4
                    event.preventDefault();
                    this._switchFullScreen();
                    break;
            }
        }
    };

    /**
     * @static
     * @method _onTouchEnd
     * @param {TouchEvent} event
     * @private
     */
    protected static _onTouchEnd(event) {
        if (!this._videoUnlocked) {
            this._video.play();
            this._videoUnlocked = true;
        }
        if (this._isVideoVisible() && this._video.paused) {
            this._video.play();
        }
    };

    /**
     * @static
     * @method _switchFPSMeter
     * @private
     */
    protected static _switchFPSMeter() {
        if (this._fpsMeter.isPaused) {
            this.showFps();
            this._fpsMeter.showFps();
            this._fpsMeterToggled = false;
        } else if (!this._fpsMeterToggled) {
            this._fpsMeter.showDuration();
            this._fpsMeterToggled = true;
        } else {
            this.hideFps();
        }
    };

    /**
     * @static
     * @method _switchStretchMode
     * @return {Boolean}
     * @private
     */
    protected static _switchStretchMode() {
        this._stretchEnabled = !this._stretchEnabled;
        this._updateAllElements();
    };

    /**
     * @static
     * @method _switchFullScreen
     * @private
     */
    protected static _switchFullScreen() {
        if (this._isFullScreen()) {
            this._requestFullScreen();
        } else {
            this._cancelFullScreen();
        }
    };

    /**
     * @static
     * @method _isFullScreen
     * @return {Boolean}
     * @private
     */
    protected static _isFullScreen() {
        /// bungcip: edited for compile
        return (document.fullscreenElement && document.fullscreenElement !== null);
    };

    /**
     * @static
     * @method _requestFullScreen
     * @private
     */
    protected static _requestFullScreen() {
        /// bungcip: edited for compile
        var element = document.body;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    };

    /**
     * @static
     * @method _cancelFullScreen
     * @private
     */
    protected static _cancelFullScreen() {
        /// bungcip: edited for compile
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };


}
