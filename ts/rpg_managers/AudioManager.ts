//-----------------------------------------------------------------------------
// AudioManager
//
// The static class that handles BGM, BGS, ME and SE.

interface CoreAudioBuffer {
    play: (loop: boolean, offset?: number) => void;
    fadeIn: (duration: number) => void;
    fadeOut: (duration: number) => void;
    seek: () => number;
    stop: () => void;
    isError: () => boolean;
    isPlaying: () => boolean;
    addLoadListener: (listener: Function) => void;
    addStopListener?: (listener: Function) => void;

    url: string;
    volume: number;
    pitch: number;
    pan: number;
}

class AudioManager {
    protected static _masterVolume = 1;   // (min: 0, max: 1)
    protected static _bgmVolume = 100;
    protected static _bgsVolume = 100;
    protected static _meVolume = 100;
    protected static _seVolume = 100;
    
    protected static _currentBgm: DB.Audio | null = null;
    protected static _currentBgs: DB.Audio | null = null;
    protected static _currentMe: DB.Audio | null;

    protected static _bgmBuffer: CoreAudioBuffer | null = null;
    protected static _bgsBuffer: CoreAudioBuffer | null = null;
    protected static _meBuffer: CoreAudioBuffer | null = null;
    protected static _seBuffers: CoreAudioBuffer[] = [];
    protected static _staticBuffers: CoreAudioBuffer[] = [];
    protected static _replayFadeTime = 0.5;
    protected static _path = 'audio/';
    protected static _blobUrl: string | null = null;


    static get masterVolume(): number {
        return this._masterVolume;
    }
    static set masterVolume(value: number) {
        this._masterVolume = value;
        WebAudio.setMasterVolume(this._masterVolume);
        Graphics.setVideoVolume(this._masterVolume);
    }

    static get bgmVolume(): number {
        return this._bgmVolume;
    }
    static set bgmVolume(value: number) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    }

    static get bgsVolume(): number {
        return this._bgsVolume;
    }
    static set bgsVolume(value: number) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    }

    static get meVolume(): number {
        return this._meVolume;
    }
    static set meVolume(value: number) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    }

    static get seVolume(): number {
        return this._seVolume;
    }
    static set seVolume(value: number) {
        this._seVolume = value;
    }

    static playBgm(bgm: DB.Audio, pos?: number) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
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
    };

    static replayBgm(bgm: DB.Audio) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.playBgm(bgm, bgm.pos);
            if (this._bgmBuffer) {
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    };

    static isCurrentBgm(bgm: DB.Audio) {
        return (this._currentBgm && this._bgmBuffer &&
            this._currentBgm.name === bgm.name);
    };

    static updateBgmParameters(bgm: DB.Audio) {
        this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
    };

    static updateCurrentBgm(bgm: DB.Audio, pos: number) {
        this._currentBgm = {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: pos
        };
    };

    static stopBgm() {
        if (this._bgmBuffer) {
            this._bgmBuffer.stop();
            this._bgmBuffer = null;
            this._currentBgm = null;
        }
    };

    static fadeOutBgm(duration: number) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeOut(duration);
            this._currentBgm = null;
        }
    };

    static fadeInBgm(duration: number) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeIn(duration);
        }
    };

    static playBgs(bgs: DB.Audio, pos?: number) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.stopBgs();
            if (bgs.name) {
                this._bgsBuffer = this.createBuffer('bgs', bgs.name);
                this.updateBgsParameters(bgs);
                this._bgsBuffer.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs(bgs, pos);
    };

    static replayBgs(bgs: DB.Audio) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.playBgs(bgs, bgs.pos);
            if (this._bgsBuffer) {
                this._bgsBuffer.fadeIn(this._replayFadeTime);
            }
        }
    };

    static isCurrentBgs(bgs: DB.Audio) {
        return (this._currentBgs && this._bgsBuffer &&
            this._currentBgs.name === bgs.name);
    };

    static updateBgsParameters(bgs: DB.Audio) {
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
    };

    static updateCurrentBgs(bgs: DB.Audio, pos: number) {
        this._currentBgs = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        };
    };

    static stopBgs() {
        if (this._bgsBuffer) {
            this._bgsBuffer.stop();
            this._bgsBuffer = null;
            this._currentBgs = null;
        }
    };

    static fadeOutBgs(duration: number) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeOut(duration);
            this._currentBgs = null;
        }
    };

    static fadeInBgs(duration: number) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeIn(duration);
        }
    };

    static playMe(me: DB.Audio) {
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
    };

    static updateMeParameters(me: DB.Audio) {
        this.updateBufferParameters(this._meBuffer, this._meVolume, me);
    };

    static fadeOutMe(duration: number) {
        if (this._meBuffer) {
            this._meBuffer.fadeOut(duration);
        }
    };

    static stopMe() {
        if (this._meBuffer) {
            this._meBuffer.stop();
            this._meBuffer = null;
            if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
                this._bgmBuffer.play(true, this._currentBgm.pos);
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    };

    static playSe(se: DB.Audio) {
        if (se.name) {
            this._seBuffers = this._seBuffers.filter(function (audio) {
                return audio.isPlaying();
            });
            const buffer = this.createBuffer('se', se.name);
            this.updateSeParameters(buffer, se);
            buffer.play(false, 0); /// bungcip: edited to make it compile
            this._seBuffers.push(buffer);
        }
    };

    static updateSeParameters(buffer: CoreAudioBuffer, se: DB.Audio) {
        this.updateBufferParameters(buffer, this._seVolume, se);
    };

    static stopSe() {
        this._seBuffers.forEach(function (buffer) {
            buffer.stop();
        });
        this._seBuffers = [];
    };

    static playStaticSe(se: DB.Audio) {
        if (se.name) {
            this.loadStaticSe(se);
            for (let i = 0; i < this._staticBuffers.length; i++) {
                const buffer = this._staticBuffers[i];
                if ( (buffer as any)['_reservedSeName'] === se.name) {
                    buffer.stop();
                    this.updateSeParameters(buffer, se);
                    buffer.play(false);
                    break;
                }
            }
        }
    };

    static loadStaticSe(se: DB.Audio) {
        if (se.name && !this.isStaticSe(se)) {
            const buffer = this.createBuffer('se', se.name);
            (buffer as any)['_reservedSeName'] = se.name;
            this._staticBuffers.push(buffer);
            if (this.shouldUseHtml5Audio()) {
                Html5Audio.setStaticSe(buffer.url);
            }
        }
    };

    static isStaticSe(se: DB.Audio) {
        for (let i = 0; i < this._staticBuffers.length; i++) {
            const buffer = this._staticBuffers[i];
            if ((buffer as any)['_reservedSeName'] === se.name) {
                return true;
            }
        }
        return false;
    };

    static stopAll() {
        this.stopMe();
        this.stopBgm();
        this.stopBgs();
        this.stopSe();
    };

    static saveBgm(): DB.Audio {
        if (this._currentBgm) {
            const bgm = this._currentBgm;
            return {
                name: bgm.name,
                volume: bgm.volume,
                pitch: bgm.pitch,
                pan: bgm.pan,
                pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    };

    static saveBgs(): DB.Audio {
        if (this._currentBgs) {
            const bgs = this._currentBgs;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    };

    static makeEmptyAudioObject(): DB.Audio {
        return { name: '', volume: 0, pitch: 0 };
    };

    static createBuffer(folder: string, name: string): CoreAudioBuffer {
        const ext = this.audioFileExt();
        const url = this._path + folder + '/' + encodeURIComponent(name) + ext;
        if (this.shouldUseHtml5Audio() && folder === 'bgm') {
            if (this._blobUrl) Html5Audio.setup(this._blobUrl);
            else Html5Audio.setup(url);
            return Html5Audio;
        } else {
            return new WebAudio(url);
        }
    };

    static updateBufferParameters(buffer: CoreAudioBuffer, configVolume: number, audio: DB.Audio) {
        if (buffer && audio) {
            buffer.volume = configVolume * (audio.volume || 0) / 10000;
            buffer.pitch = (audio.pitch || 0) / 100;
            buffer.pan = (audio.pan || 0) / 100;
        }
    };

    static audioFileExt(): string {
        if (WebAudio.canPlayOgg()) {
            return '.ogg';
        } else {
            return '.m4a';
        }
    };

    static shouldUseHtml5Audio(): boolean {
        // The only case where we wanted html5audio was android/ no encrypt
        // Atsuma-ru asked to force webaudio there too, so just return false for ALL 
        return false;
    };

    static checkErrors() {
        this.checkWebAudioError(this._bgmBuffer);
        this.checkWebAudioError(this._bgsBuffer);
        this.checkWebAudioError(this._meBuffer);
        this._seBuffers.forEach(function (buffer: CoreAudioBuffer) {
            this.checkWebAudioError(buffer);
        }.bind(this));
        this._staticBuffers.forEach(function (buffer: CoreAudioBuffer) {
            this.checkWebAudioError(buffer);
        }.bind(this));
    };

    static checkWebAudioError(webAudio: CoreAudioBuffer | null) {
        if (webAudio && webAudio.isError()) {
            throw new Error('Failed to load: ' + webAudio.url);
        }
    };

}


