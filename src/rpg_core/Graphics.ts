import ResourceHandler from './ResourceHandler';
import Stage from './Stage';
import Utils from './Utils';

/**
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 */
export default class Graphics {

  /// bungcip: must be public because it is accessed by the Bitmap class; this should be fixed
  public static _renderer: any;

  /**
   * The total frame count of the game screen.
   *
   * @static
   * @property frameCount
   * @type Number
   */
  public static frameCount = 0;

  /**
   * The alias of PIXI.blendModes.ADD.
   *
   * @static
   * @property BLEND_ADD
   * @type Number
   * @final
   */
  public static BLEND_ADD = 1;
  public static _videoLoader: ResourceHandler | null = null;

  /**
   * Initializes the graphics system.
   */
  public static initialize(
    /** The with of the game screen. */
    width = 800,
    /** The height of the game screen. */
    height = 800
  ): void {
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

  public static canUseCssFontLoading(): boolean {
    return !!this._cssFontLoading;
  }

  /**
   * Marks the beginning of each frame for FPSMeter.
   *
   * @static
   * @method tickStart
   */
  public static tickStart(): void {
    if (this._fpsMeter) {
      this._fpsMeter.tickStart();
    }
  }

  /**
   * Marks the end of each frame for FPSMeter.
   *
   * @static
   * @method tickEnd
   */
  public static tickEnd(): void {
    if (this._fpsMeter && this._rendered) {
      this._fpsMeter.tick();
    }
  }

  /**
   * Renders the stage to the game screen.
   *
   * @static
   * @method render
   * @param {Stage} stage The stage object to be rendered
   */
  public static render(stage: Stage): void {
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
    } else {
      this._skipCount--;
      this._rendered = false;
    }
    this.frameCount++;
  }

  /**
   * Checks whether the current browser supports WebGL.
   */
  public static hasWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks whether the canvas blend mode 'difference' is supported.
   */
  public static canUseDifferenceBlend(): boolean {
    return this._canUseDifferenceBlend;
  }

  /**
   * Checks whether the canvas blend mode 'saturation' is supported.
   */
  public static canUseSaturationBlend(): boolean {
    return this._canUseSaturationBlend;
  }

  /**
   * Sets the source of the "Now Loading" image.
   */
  public static setLoadingImage(src: string): void {
    this._loadingImage = new Image();
    this._loadingImage.src = src;
  }

  /**
   * Initializes the counter for displaying the "Now Loading" image.
   */
  public static startLoading(): void {
    this._loadingCount = 0;
  }

  /**
   * Increments the loading counter and displays the "Now Loading" image if necessary.
   */
  public static updateLoading(): void {
    this._loadingCount++;
    this._paintUpperCanvas();
    this._upperCanvas.style.opacity = 1;
  }

  /**
   * Erases the "Now Loading" image.
   *
   * @static
   * @method endLoading
   */
  public static endLoading(): void {
    this._clearUpperCanvas();
    this._upperCanvas.style.opacity = 0;
  }

  /**
   * Displays the loading error text to the screen.
   */
  public static printLoadingError(url: string): void {
    if (this._errorPrinter && !this._errorShowed) {
      this._errorPrinter.innerHTML = this._makeErrorHtml(
        'Loading Error',
        'Failed to load: ' + url
      );
      const button = document.createElement('button');
      button.innerHTML = 'Retry';
      button.style.fontSize = '24px';
      button.style.color = '#ffffff';
      button.style.backgroundColor = '#000000';
      const clickhandler = (event: TouchEvent | Event) => {
        ResourceHandler.retry();
        event.stopPropagation();
      };
      button.onmousedown = button.ontouchstart = clickhandler;
      this._errorPrinter.appendChild(button);
      this._loadingCount = -Infinity;
    }
  }

  /**
   * Erases the loading error text.
   *
   * @static
   * @method eraseLoadingError
   */
  public static eraseLoadingError(): void {
    if (this._errorPrinter && !this._errorShowed) {
      this._errorPrinter.innerHTML = '';
      this.startLoading();
    }
  }

  /**
   * Displays the error text to the screen.
   *
   * @static
   * @method printError
   * @param {String} name The name of the error
   * @param {String} message The message of the error
   */
  public static printError(name: string, message: string): void {
    this._errorShowed = true;
    if (this._errorPrinter) {
      this._errorPrinter.innerHTML = this._makeErrorHtml(name, message);
    }
    this._applyCanvasFilter();
    this._clearUpperCanvas();
  }

  /**
   * Shows the FPSMeter element.
   *
   * @static
   * @method showFps
   */
  public static showFps(): void {
    if (this._fpsMeter) {
      this._fpsMeter.show();
      this._modeBox.style.opacity = 1;
    }
  }

  /**
   * Hides the FPSMeter element.
   *
   * @static
   * @method hideFps
   */
  public static hideFps() {
    if (this._fpsMeter) {
      this._fpsMeter.hide();
      this._modeBox.style.opacity = 0;
    }
  }

  /**
   * Loads a font file.
   *
   * @static
   * @method loadFont
   * @param {String} name The face name of the font
   * @param {String} url The url of the font file
   */
  public static loadFont(name: string, url: string) {
    const style = document.createElement('style');
    const head = document.getElementsByTagName('head');
    const rule =
      '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
    style.type = 'text/css';
    head.item(0).appendChild(style);
    style.sheet.insertRule(rule, 0);
    this._createFontLoader(name);
  }

  /**
   * Checks whether the font file is loaded.
   *
   * @static
   * @method isFontLoaded
   * @param {String} name The face name of the font
   * @return {Boolean} True if the font file is loaded
   */
  public static isFontLoaded(name: string): boolean {
    if (Graphics._cssFontLoading) {
      if (Graphics._fontLoaded) {
        return Graphics._fontLoaded.check('10px "' + name + '"');
      }
      return false;
    } else {
      if (!this._hiddenCanvas) {
        this._hiddenCanvas = document.createElement('canvas');
      }
      const context = this._hiddenCanvas.getContext('2d');
      const text = 'abcdefghijklmnopqrstuvwxyz';
      let width1;
      let width2;
      context.font = '40px ' + name + ', sans-serif';
      width1 = context.measureText(text).width;
      context.font = '40px sans-serif';
      width2 = context.measureText(text).width;
      return width1 !== width2;
    }
  }

  /**
   * Starts playback of a video.
   */
  public static playVideo(src: string): void {
    this._videoLoader = ResourceHandler.createLoader(
      null,
      this._playVideo.bind(this, src),
      this._onVideoError.bind(this)
    );
    this._playVideo(src);
  }

  /**
   * Checks whether a video is playing.
   */
  public static isVideoPlaying(): boolean {
    return this._videoLoading || this._isVideoVisible();
  }

  /**
   * Checks whether the browser can play the specified video type.
   */
  public static canPlayVideoType(type: string) {
    return this._video && this._video.canPlayType(type);
  }

  /**
   * Sets volume of a video.
   */
  public static setVideoVolume(value: number) {
    this._videoVolume = value;
    if (this._video) {
      this._video.volume = this._videoVolume;
    }
  }

  /**
   * Converts an x coordinate on the page to the corresponding
   * x coordinate on the canvas area.
   */
  public static pageToCanvasX(
    /** The x coordinate on the page to be converted  */
    x: number
  ): number {
    if (this._canvas) {
      const left = this._canvas.offsetLeft;
      return Math.round((x - left) / this._realScale);
    } else {
      return 0;
    }
  }

  /**
   * Converts a y coordinate on the page to the corresponding
   * y coordinate on the canvas area.
   */
  public static pageToCanvasY(
    /** The y coordinate on the page to be converted */
    y: number
  ): number {
    return this._canvas
      ? Math.round(y - this._canvas.offsetTop) / this._realScale
      : 0;
  }

  /**
   * Checks whether the specified point is inside the game canvas area.
   */
  public static isInsideCanvas(
    /** The x coordinate on the canvas area */
    x: number,
    /** The y coordinate on the canvas area */
    y: number
  ): boolean {
    return x >= 0 && x < this._width && y >= 0 && y < this._height;
  }

  /**
   * Calls pixi.js garbage collector
   */
  public static callGC(): void {
    Graphics._renderer.textureGC.run();
  }

  /**
   * The width of the game screen.
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
  static get boxWidth(): number {
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
  static get boxHeight(): number {
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
  public static get scale(): number {
    return this._scale;
  }
  public static set scale(value: number) {
    if (this._scale !== value) {
      this._scale = value;
      this._updateAllElements();
    }
  }
  
  protected static _cssFontLoading = document.fonts && document.fonts.ready;
  protected static _fontLoaded: FontFaceSet | null = null;
  protected static _videoVolume = 1;

  protected static _width: number;
  protected static _height: number;
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
  protected static _hiddenCanvas: HTMLCanvasElement | null;

  protected static _setupCssFontLoading(): void {
    if (Graphics._cssFontLoading) {
      document.fonts.ready
        .then(fonts => (Graphics._fontLoaded = fonts));
    }
  }
  
  protected static _playVideo(src: string): void {
    this._video.src = src;
    this._video.onloadeddata = this._onVideoLoad.bind(this);
    this._video.onerror = this._videoLoader;
    this._video.onended = this._onVideoEnd.bind(this);
    this._video.load();
    this._videoLoading = true;
  }
  
  protected static _createAllElements(): void {
    this._createErrorPrinter();
    this._createCanvas();
    this._createVideo();
    this._createUpperCanvas();
    this._createRenderer();
    this._createFPSMeter();
    this._createModeBox();
    this._createGameFontLoader();
  }

  /**
   * @static
   * @method _updateAllElements
   * @private
   */
  protected static _updateAllElements(): void {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
    this._updateUpperCanvas();
    this._updateRenderer();
    this._paintUpperCanvas();
  }

  /**
   * @static
   * @method _updateRealScale
   * @private
   */
  protected static _updateRealScale(): void {
    if (this._stretchEnabled) {
      const h = window.innerWidth / this._width;
      const v = window.innerHeight / this._height;
      this._realScale = Math.min(h, v);
    } else {
      this._realScale = this._scale;
    }
  }

  /**
   * @static
   * @method _makeErrorHtml
   * @param {String} name
   * @param {String} message
   * @return {String}
   * @private
   */
  protected static _makeErrorHtml(name: string, message: string): string {
    return (
      '<font color="yellow"><b>' +
      name +
      '</b></font><br>' +
      '<font color="white">' +
      message +
      '</font><br>'
    );
  }
  
  protected static _defaultStretchMode(): boolean {
    return Utils.isNwjs();
  }
  
  protected static _testCanvasBlendModes(): void {
    let canvas;
    let context;
    let imageData1;
    let imageData2;
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

  /**
   * @static
   * @method _modifyExistingElements
   * @private
   */
  protected static _modifyExistingElements(): void {
    const elements = document.querySelectorAll('*');
    // works in most envs supporting for-of iteration
    for (const element of elements as any) {
      if (element.style.zIndex > 0) {
        element.style.zIndex = 0;
      }
    }
  }

  protected static _createErrorPrinter(): void {
    this._errorPrinter = document.createElement('p');
    this._errorPrinter.id = 'ErrorPrinter';
    this._updateErrorPrinter();
    document.body.appendChild(this._errorPrinter);
  }
  
  protected static _updateErrorPrinter(): void {
    this._errorPrinter.width = this._width * 0.9;
    this._errorPrinter.height = 40;
    this._errorPrinter.style.textAlign = 'center';
    this._errorPrinter.style.textShadow = '1px 1px 3px #000';
    this._errorPrinter.style.fontSize = '20px';
    this._errorPrinter.style.zIndex = 99;
    this._centerElement(this._errorPrinter);
  }

  protected static _createCanvas(): void {
    this._canvas = document.createElement('canvas');
    this._canvas.id = 'GameCanvas';
    this._updateCanvas();
    document.body.appendChild(this._canvas);
  }

  protected static _updateCanvas(): void {
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.style.zIndex = 1;
    this._centerElement(this._canvas);
  }

  protected static _createVideo(): void {
    this._video = document.createElement('video');
    this._video.id = 'GameVideo';
    this._video.style.opacity = 0;
    this._video.setAttribute('playsinline', '');
    this._video.volume = this._videoVolume;
    this._updateVideo();
    makeVideoPlayableInline(this._video);
    document.body.appendChild(this._video);
  }

  protected static _updateVideo(): void {
    this._video.width = this._width;
    this._video.height = this._height;
    this._video.style.zIndex = 2;
    this._centerElement(this._video);
  }

  protected static _createUpperCanvas(): void {
    this._upperCanvas = document.createElement('canvas');
    this._upperCanvas.id = 'UpperCanvas';
    this._updateUpperCanvas();
    document.body.appendChild(this._upperCanvas);
  }

  protected static _updateUpperCanvas(): void {
    this._upperCanvas.width = this._width;
    this._upperCanvas.height = this._height;
    this._upperCanvas.style.zIndex = 3;
    this._centerElement(this._upperCanvas);
  }
  
  protected static _clearUpperCanvas(): void {
    const context = this._upperCanvas.getContext('2d');
    context.clearRect(0, 0, this._width, this._height);
  }

  protected static _paintUpperCanvas(): void {
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

  protected static _createRenderer(): void {
    const width = this._width;
    const height = this._height;
    const options = { view: this._canvas };
    try {
      this._renderer = new PIXI.WebGLRenderer(width, height, options);

      if (this._renderer && this._renderer.textureGC) {
        this._renderer.textureGC.maxIdle = 1;
      }
    } catch (e) {
      this._renderer = null;
    }
  }

  protected static _updateRenderer(): void {
    if (this._renderer) {
      this._renderer.resize(this._width, this._height);
    }
  }

  protected static _createFPSMeter(): void {
    const options = {
      graph: 1,
      decimals: 0,
      theme: 'transparent',
      toggleOn: null as any
    };
    this._fpsMeter = new FPSMeter(options);
    this._fpsMeter.hide();
  }

  protected static _createModeBox(): void {
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

  protected static _createGameFontLoader(): void {
    this._createFontLoader('GameFont');
  }

  protected static _createFontLoader(name: string): void {
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

  protected static _centerElement(element: HTMLElement): void {
    const width = element.clientWidth * this._realScale;
    const height = element.clientHeight * this._realScale;
    element.style.position = 'absolute';
    element.style.margin = 'auto';
    element.style.top = '0';
    element.style.left = '0';
    element.style.right = '0';
    element.style.bottom = '0';
    element.style.width = width + 'px';
    element.style.height = height + 'px';
  }

  protected static _disableTextSelection(): void {
    const body = document.body;
    body.style.userSelect = 'none';
    body.style.webkitUserSelect = 'none';
    body.style.msUserSelect = 'none';
  }

  protected static _disableContextMenu(): void {
    const elements = document.body.getElementsByTagName('*');
    const oncontextmenu = () => false;
    for (const element of elements as any) {
      element.oncontextmenu = oncontextmenu;
    }
  }

  protected static _applyCanvasFilter(): void {
    if (this._canvas) {
      this._canvas.style.opacity = 0.5;
      this._canvas.style.filter = 'blur(8px)';
      this._canvas.style.webkitFilter = 'blur(8px)';
    }
  }

  protected static _onVideoLoad(): void {
    this._video.play();
    this._updateVisibility(true);
    this._videoLoading = false;
  }

  protected static _onVideoError(): void {
    this._updateVisibility(false);
    this._videoLoading = false;
  }

  protected static _onVideoEnd(): void {
    this._updateVisibility(false);
  }

  protected static _updateVisibility(videoVisible: boolean): void {
    this._video.style.opacity = videoVisible ? 1 : 0;
    this._canvas.style.opacity = videoVisible ? 0 : 1;
  }

  protected static _isVideoVisible(): boolean {
    return this._video.style.opacity > 0;
  }

  protected static _setupEventHandlers(): void {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
  }

  protected static _onWindowResize(): void {
    this._updateAllElements();
  }

  protected static _onKeyDown(event: KeyboardEvent): void {
    if (!event.ctrlKey && !event.altKey) {
      switch (event.keyCode) {
        case 113: // F2
          event.preventDefault();
          this._switchFPSMeter();
          break;
        case 114: // F3
          event.preventDefault();
          this._switchStretchMode();
          break;
        case 115: // F4
          event.preventDefault();
          this._switchFullScreen();
          break;
      }
    }
  }

  protected static _onTouchEnd(event: TouchEvent): void {
    if (!this._videoUnlocked) {
      this._video.play();
      this._videoUnlocked = true;
    }
    if (this._isVideoVisible() && this._video.paused) {
      this._video.play();
    }
  }

  protected static _switchFPSMeter(): void {
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
  }

  protected static _switchStretchMode(): void {
    this._stretchEnabled = !this._stretchEnabled;
    this._updateAllElements();
  }

  protected static _switchFullScreen(): void {
    if (this._isFullScreen()) {
      this._cancelFullScreen();
    } else {
      this._requestFullScreen();
    }
  }

  protected static _isFullScreen(): boolean {
    return (
      (document.fullscreenElement ||
        document.mozFullScreen ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement) !== null
    );
  }

  protected static _requestFullScreen() {
    const element = document.body;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }

  protected static _cancelFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }  
}
