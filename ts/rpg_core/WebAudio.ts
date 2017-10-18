//-----------------------------------------------------------------------------
/**
 * The audio object of Web Audio API.
 *
 * @class WebAudio
 * @constructor
 * @param {String} url The url of the audio file
 */
class WebAudio {
    protected _loader: () => void;
    protected _url: string;
    // protected _load;
    protected _buffer: AudioBuffer;
    protected _sourceNode: AudioBufferSourceNode;
    protected _gainNode: GainNode;
    protected _pannerNode: PannerNode;
    protected _totalTime: number;
    protected _sampleRate: number;
    protected _loopStart: number;
    protected _loopLength: number;
    protected _startTime: number;
    protected _volume: number;
    protected _pitch: number;
    protected _pan: number;
    protected _endTimer: number;
    protected _loadListeners: Function[];
    protected _stopListeners: Function[];
    protected _hasError: boolean;
    protected _autoPlay: boolean;
    protected static _masterVolume = 1;
    protected static _context: AudioContext | null = null;
    protected static _masterGainNode: GainNode | null = null;
    protected static _initialized = false;
    protected static _unlocked = false;


    protected static _standAlone = (function (top) {
        return !(top as any)['ResourceHandler'];
    })(window);


    constructor(url: string) {
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
    };

    /**
     * Initializes the audio system.
     *
     * @static
     * @method initialize
     * @param {Boolean} noAudio Flag for the no-audio mode
     * @return {Boolean} True if the audio system is available
     */
    static initialize(noAudio?: boolean): boolean {
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
    };

    static _canPlayOgg: string;
    static _canPlayM4a: string;

    /**
     * Checks whether the browser can play ogg files.
     *
     * @static
     * @method canPlayOgg
     * @return {Boolean} True if the browser can play ogg files
     */
    static canPlayOgg(): boolean {
        if (!this._initialized) {
            this.initialize();
        }
        return !!this._canPlayOgg;
    };

    /**
     * Checks whether the browser can play m4a files.
     *
     * @static
     * @method canPlayM4a
     * @return {Boolean} True if the browser can play m4a files
     */
    static canPlayM4a(): boolean {
        if (!this._initialized) {
            this.initialize();
        }
        return !!this._canPlayM4a;
    };

    /**
     * Sets the master volume of the all audio.
     *
     * @static
     * @method setMasterVolume
     * @param {Number} value Master volume (min: 0, max: 1)
     */
    static setMasterVolume(value: number) {
        this._masterVolume = value;
        if (this._masterGainNode) {
            this._masterGainNode.gain.setValueAtTime(this._masterVolume, this._context.currentTime);
        }
    };

    /**
     * @static
     * @method _createContext
     * @private
     */
    protected static _createContext() {
        try {
            if (typeof AudioContext !== 'undefined') {
                this._context = new AudioContext();
            } else if (typeof webkitAudioContext !== 'undefined') {
                this._context = new webkitAudioContext() as any;
            }
        } catch (e) {
            this._context = null;
        }
    };

    /**
     * @static
     * @method _detectCodecs
     * @private
     */
    protected static _detectCodecs() {
        const audio = document.createElement('audio');
        if (audio.canPlayType) {
            this._canPlayOgg = audio.canPlayType('audio/ogg');
            this._canPlayM4a = audio.canPlayType('audio/mp4');
        }
    };

    /**
     * @static
     * @method _createMasterGainNode
     * @private
     */
    protected static _createMasterGainNode() {
        const context = this._context;
        if (context) {
            this._masterGainNode = context.createGain();
            this._masterGainNode.gain.setValueAtTime(this._masterVolume, context.currentTime);
            this._masterGainNode.connect(context.destination);
        }
    };

    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    protected static _setupEventHandlers() {
        document.addEventListener("touchend", () => {
            const context = this._context;
            if (context && context.state === "suspended" && typeof context.resume === "function") {
                context.resume().then(function () {
                    this._onTouchStart();
                })
            } else {
                this._onTouchStart();
            }
        });
        document.addEventListener('touchstart', this._onTouchStart.bind(this));
        document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
    };

    /**
     * @static
     * @method _onTouchStart
     * @private
     */
    protected static _onTouchStart() {
        const context = this._context;
        if (context && !this._unlocked) {
            // Unlock Web Audio on iOS
            const node = context.createBufferSource();
            node.start(0);
            this._unlocked = true;
        }
    };

    /**
     * @static
     * @method _onVisibilityChange
     * @private
     */
    protected static _onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            this._onHide();
        } else {
            this._onShow();
        }
    };

    /**
     * @static
     * @method _onHide
     * @private
     */
    protected static _onHide() {
        if (this._shouldMuteOnHide()) {
            this._fadeOut(1);
        }
    };

    /**
     * @static
     * @method _onShow
     * @private
     */
    protected static _onShow() {
        if (this._shouldMuteOnHide()) {
            this._fadeIn(0.5);
        }
    };

    /**
     * @static
     * @method _shouldMuteOnHide
     * @private
     */
    protected static _shouldMuteOnHide() {
        return false;
    };

    /**
     * @static
     * @method _fadeIn
     * @param {Number} duration
     * @private
     */
    protected static _fadeIn(duration: number) {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const currentTime = this._context.currentTime;
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(this._masterVolume, currentTime + duration);
        }
    };

    /**
     * @static
     * @method _fadeOut
     * @param {Number} duration
     * @private
     */
    protected static _fadeOut(duration: number) {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const currentTime = this._context.currentTime;
            gain.setValueAtTime(this._masterVolume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
    };

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
    };

    /**
     * [read-only] The url of the audio file.
     *
     * @property url
     * @type String
     */
    get url(): string {
        return this._url;
    }

    /**
     * The volume of the audio.
     *
     * @property volume
     * @type Number
     */
    get volume(): number {
        return this._volume;
    }
    set volume(value: number) {
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
    get pitch(): number {
        return this._pitch;
    }
    set pitch(value: number) {
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
    get pan(): number {
        return this._pan;
    }
    set pan(value: number) {
        this._pan = value;
        this._updatePanner();
    }

    /**
     * Checks whether the audio data is ready to play.
     *
     * @method isReady
     * @return {Boolean} True if the audio data is ready to play
     */
    isReady(): boolean {
        return !!this._buffer;
    };

    /**
     * Checks whether a loading error has occurred.
     *
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    isError(): boolean {
        return this._hasError;
    };

    /**
     * Checks whether the audio is playing.
     *
     * @method isPlaying
     * @return {Boolean} True if the audio is playing
     */
    isPlaying(): boolean {
        return !!this._sourceNode;
    };

    /**
     * Plays the audio.
     *
     * @method play
     * @param {Boolean} loop Whether the audio data play in a loop
     * @param {Number} offset The start position to play in seconds
     */
    play(loop: boolean, offset: number) {
        if (this.isReady()) {
            offset = offset || 0;
            this._startPlaying(loop, offset);
        } else if (WebAudio._context) {
            this._autoPlay = true;
            this.addLoadListener(function () {
                if (this._autoPlay) {
                    this.play(loop, offset);
                }
            }.bind(this));
        }
    };

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
    };

    /**
     * Performs the audio fade-in.
     *
     * @method fadeIn
     * @param {Number} duration Fade-in time in seconds
     */
    fadeIn(duration: number) {
        if (this.isReady()) {
            if (this._gainNode) {
                const gain = this._gainNode.gain;
                const currentTime = WebAudio._context.currentTime;
                gain.setValueAtTime(0, currentTime);
                gain.linearRampToValueAtTime(this._volume, currentTime + duration);
            }
        } else if (this._autoPlay) {
            this.addLoadListener(function () {
                this.fadeIn(duration);
            }.bind(this));
        }
    };

    /**
     * Performs the audio fade-out.
     *
     * @method fadeOut
     * @param {Number} duration Fade-out time in seconds
     */
    fadeOut(duration: number) {
        if (this._gainNode) {
            const gain = this._gainNode.gain;
            const currentTime = WebAudio._context.currentTime;
            gain.setValueAtTime(this._volume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
        this._autoPlay = false;
    };

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
        } else {
            return 0;
        }
    };

    /**
     * Add a callback function that will be called when the audio data is loaded.
     *
     * @method addLoadListener
     * @param {Function} listner The callback function
     */
    addLoadListener(listner: Function) {
        this._loadListeners.push(listner);
    };

    /**
     * Add a callback function that will be called when the playback is stopped.
     *
     * @method addStopListener
     * @param {Function} listner The callback function
     */
    addStopListener(listner: Function) {
        this._stopListeners.push(listner);
    };

    /**
     * @method _load
     * @param {String} url
     * @private
     */
    protected _load(url: string) {
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
    };

    /**
     * @method _onXhrLoad
     * @param {XMLHttpRequest} xhr
     * @private
     */
    protected _onXhrLoad(xhr: XMLHttpRequest) {
        const array = xhr.response;
        this._readLoopComments(new Uint8Array(array));
        WebAudio._context.decodeAudioData(array, function (buffer: AudioBuffer) {
            this._buffer = buffer;
            this._totalTime = buffer.duration;
            if (this._loopLength > 0 && this._sampleRate > 0) {
                this._loopStart /= this._sampleRate;
                this._loopLength /= this._sampleRate;
            } else {
                this._loopStart = 0;
                this._loopLength = this._totalTime;
            }
            this._onLoad();
        }.bind(this));
    };

    /**
     * @method _startPlaying
     * @param {Boolean} loop
     * @param {Number} offset
     * @private
     */
    protected _startPlaying(loop: boolean, offset: number) {
        this._removeEndTimer();
        this._removeNodes();
        this._createNodes();
        this._connectNodes();
        this._sourceNode.loop = loop;
        this._sourceNode.start(0, offset);
        this._startTime = WebAudio._context.currentTime - offset / this._pitch;
        this._createEndTimer();
    };

    /**
     * @method _createNodes
     * @private
     */
    protected _createNodes() {
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
    };

    /**
     * @method _connectNodes
     * @private
     */
    protected _connectNodes() {
        this._sourceNode.connect(this._gainNode);
        this._gainNode.connect(this._pannerNode);
        this._pannerNode.connect(WebAudio._masterGainNode);
    };

    /**
     * @method _removeNodes
     * @private
     */
    protected _removeNodes() {
        if (this._sourceNode) {
            this._sourceNode.stop(0);
            this._sourceNode = null;
            this._gainNode = null;
            this._pannerNode = null;
        }
    };

    /**
     * @method _createEndTimer
     * @private
     */
    protected _createEndTimer() {
        if (this._sourceNode && !this._sourceNode.loop) {
            const endTime = this._startTime + this._totalTime / this._pitch;
            const delay = endTime - WebAudio._context.currentTime;
            this._endTimer = setTimeout(function () {
                this.stop();
            }.bind(this), delay * 1000);
        }
    };

    /**
     * @method _removeEndTimer
     * @private
     */
    protected _removeEndTimer() {
        if (this._endTimer) {
            clearTimeout(this._endTimer);
            this._endTimer = null;
        }
    };

    /**
     * @method _updatePanner
     * @private
     */
    protected _updatePanner() {
        if (this._pannerNode) {
            const x = this._pan;
            const z = 1 - Math.abs(x);
            this._pannerNode.setPosition(x, 0, z);
        }
    };

    /**
     * @method _onLoad
     * @private
     */
    protected _onLoad() {
        while (this._loadListeners.length > 0) {
            const listner = this._loadListeners.shift();
            listner();
        }
    };

    /**
     * @method _readLoopComments
     * @param {Uint8Array} array
     * @private
     */
    protected _readLoopComments(array: Uint8Array) {
        this._readOgg(array);
        this._readMp4(array);
    };

    /**
     * @method _readOgg
     * @param {Uint8Array} array
     * @private
     */
    protected _readOgg(array: Uint8Array) {
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
                        } else if (headerType === 3) {
                            this._readMetaData(array, index, segments[i]);
                        }
                        vorbisHeaderFound = true;
                    }
                    index += segments[i];
                }
                if (!vorbisHeaderFound) {
                    break;
                }
            } else {
                break;
            }
        }
    };

    /**
     * @method _readMp4
     * @param {Uint8Array} array
     * @private
     */
    protected _readMp4(array: Uint8Array) {
        if (this._readFourCharacters(array, 4) === 'ftyp') {
            let index = 0;
            while (index < array.length) {
                const size = this._readBigEndian(array, index);
                const name = this._readFourCharacters(array, index + 4);
                if (name === 'moov') {
                    index += 8;
                } else {
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
    };

    /**
     * @method _readMetaData
     * @param {Uint8Array} array
     * @param {Number} index
     * @param {Number} size
     * @private
     */
    protected _readMetaData(array: Uint8Array, index: number, size: number) {
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
                    } else {
                        this._loopLength = parseInt(text2);
                    }
                }
            }
        }
    };

    /**
     * @method _readLittleEndian
     * @param {Uint8Array} array
     * @param {Number} index
     * @private
     */
    protected _readLittleEndian(array: Uint8Array, index: number) {
        return (array[index + 3] * 0x1000000 + array[index + 2] * 0x10000 +
            array[index + 1] * 0x100 + array[index + 0]);
    };

    /**
     * @method _readBigEndian
     * @param {Uint8Array} array
     * @param {Number} index
     * @private
     */
    protected _readBigEndian(array: Uint8Array, index: number) {
        return (array[index + 0] * 0x1000000 + array[index + 1] * 0x10000 +
            array[index + 2] * 0x100 + array[index + 3]);
    };

    /**
     * @method _readFourCharacters
     * @param {Uint8Array} array
     * @param {Number} index
     * @private
     */
    protected _readFourCharacters(array: Uint8Array, index: number) {
        let string = '';
        for (let i = 0; i < 4; i++) {
            string += String.fromCharCode(array[index + i]);
        }
        return string;
    };

}


