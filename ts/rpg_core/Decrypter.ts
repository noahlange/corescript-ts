class Decrypter {
    static hasEncryptedImages = false;
    static hasEncryptedAudio = false;

    static _requestImgFile: any[] = [];
    static _headerlength = 16;
    static _xhrOk = 400;
    static _encryptionKey = "";
    static _ignoreList = [
        "img/system/Window.png"
    ];

    static SIGNATURE = "5250474d56000000";
    static VER = "000301";
    static REMAIN = "0000000000";
    
    static checkImgIgnore(url: string){
        for(var cnt = 0; cnt < this._ignoreList.length; cnt++) {
            if(url === this._ignoreList[cnt]) return true;
        }
        return false;
    };
    
    static decryptImg(url: string, bitmap: Bitmap) {
        url = this.extToEncryptExt(url);
    
        var requestFile = new XMLHttpRequest();
        requestFile.open("GET", url);
        requestFile.responseType = "arraybuffer";
        requestFile.send();
    
        requestFile.onload = function () {
            if((this as any)['status'] < Decrypter._xhrOk) {
                var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
                /// NOTE(bungcip): _image is protected, but accessed by Decripter
                bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
                bitmap._image.addEventListener('load', bitmap._loadListener = Bitmap.prototype._onLoad.bind(bitmap));
                bitmap._image.addEventListener('error', bitmap._errorListener = bitmap._loader || Bitmap.prototype._onError.bind(bitmap));
            }
        };
    
        requestFile.onerror = function () {
            if (bitmap._loader) {
                bitmap._loader();
            } else {
                bitmap._onError();
            }
        };
    };
    
    static decryptHTML5Audio = function(url: string, bgm: DB.Audio, pos: number) {
        var requestFile = new XMLHttpRequest();
        requestFile.open("GET", url);
        requestFile.responseType = "arraybuffer";
        requestFile.send();
    
        requestFile.onload = function () {
            if((this as any)['status'] < Decrypter._xhrOk) {
                var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
                var url = Decrypter.createBlobUrl(arrayBuffer);
                AudioManager.createDecryptBuffer(url, bgm, pos);
            }
        };
    };
    
    static cutArrayHeader = function(arrayBuffer: ArrayBuffer, length: number) {
        return arrayBuffer.slice(length);
    };
    
    static decryptArrayBuffer = function(arrayBuffer: ArrayBuffer) {
        if (!arrayBuffer) return null;
        var header = new Uint8Array(arrayBuffer, 0, this._headerlength);
    
        var i;
        var ref = this.SIGNATURE + this.VER + this.REMAIN;
        var refBytes = new Uint8Array(16);
        for (i = 0; i < this._headerlength; i++) {
            refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
        }
        for (i = 0; i < this._headerlength; i++) {
            if (header[i] !== refBytes[i]) {
                throw new Error("Header is wrong");
            }
        }
    
        arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
        var view = new DataView(arrayBuffer);
        this.readEncryptionkey();
        if (arrayBuffer) {
            var byteArray = new Uint8Array(arrayBuffer);
            for (i = 0; i < this._headerlength; i++) {
                byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
                view.setUint8(i, byteArray[i]);
            }
        }
    
        return arrayBuffer;
    };
    
    static createBlobUrl = function(arrayBuffer: ArrayBuffer){
        var blob = new Blob([arrayBuffer]);
        return window.URL.createObjectURL(blob);
    };
    
    static extToEncryptExt = function(url: string) {
        var ext = url.split('.').pop();
        var encryptedExt = ext;
    
        if(ext === "ogg") encryptedExt = ".rpgmvo";
        else if(ext === "m4a") encryptedExt = ".rpgmvm";
        else if(ext === "png") encryptedExt = ".rpgmvp";
        else encryptedExt = ext;
    
        return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
    };
    
    static readEncryptionkey = function(){
        this._encryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
    };
    
}

