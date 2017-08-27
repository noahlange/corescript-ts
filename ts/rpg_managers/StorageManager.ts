//-----------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.

class StorageManager {
    static save(savefileId, json) {
        if (this.isLocalMode()) {
            this.saveToLocalFile(savefileId, json);
        } else {
            this.saveToWebStorage(savefileId, json);
        }
    };
    
    static load(savefileId) {
        if (this.isLocalMode()) {
            return this.loadFromLocalFile(savefileId);
        } else {
            return this.loadFromWebStorage(savefileId);
        }
    };
    
    static exists(savefileId) {
        if (this.isLocalMode()) {
            return this.localFileExists(savefileId);
        } else {
            return this.webStorageExists(savefileId);
        }
    };
    
    static remove(savefileId) {
        if (this.isLocalMode()) {
            this.removeLocalFile(savefileId);
        } else {
            this.removeWebStorage(savefileId);
        }
    };
    
    static backup(savefileId) {
        if (this.exists(savefileId)) {
            if (this.isLocalMode()) {
                var data = this.loadFromLocalFile(savefileId);
                var compressed = LZString.compressToBase64(data);
                let require = window['require']; // bungcip: changed to make it compile
                var fs = require('fs');
                var dirPath = this.localFileDirectoryPath();
                var filePath = this.localFilePath(savefileId) + ".bak";
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
            } else {
                var data = this.loadFromWebStorage(savefileId);
                var compressed = LZString.compressToBase64(data);
                var key = this.webStorageKey(savefileId) + "bak";
                localStorage.setItem(key, compressed);
            }
        }
    };
    
    static backupExists(savefileId) {
        if (this.isLocalMode()) {
            return this.localFileBackupExists(savefileId);
        } else {
            return this.webStorageBackupExists(savefileId);
        }
    };
    
    static cleanBackup(savefileId) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                let require = window['require']; // bungcip: changed to make it compile
                var fs = require('fs');
                var dirPath = this.localFileDirectoryPath();
                var filePath = this.localFilePath(savefileId);
                fs.unlinkSync(filePath + ".bak");
            } else {
                var key = this.webStorageKey(savefileId);
                localStorage.removeItem(key + "bak");
            }
        }
    };
    
    static restoreBackup(savefileId) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                var data = this.loadFromLocalBackupFile(savefileId);
                var compressed = LZString.compressToBase64(data);
                let require = window['require']; // bungcip: changed to make it compile
                var fs = require('fs');
                var dirPath = this.localFileDirectoryPath();
                var filePath = this.localFilePath(savefileId);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
                fs.unlinkSync(filePath + ".bak");
            } else {
                var data = this.loadFromWebStorageBackup(savefileId);
                var compressed = LZString.compressToBase64(data);
                var key = this.webStorageKey(savefileId);
                localStorage.setItem(key, compressed);
                localStorage.removeItem(key + "bak");
            }
        }
    };
    
    static isLocalMode() {
        return Utils.isNwjs();
    };
    
    static saveToLocalFile(savefileId, json) {
        var data = LZString.compressToBase64(json);
        let require = window['require']; // bungcip: changed to make it compile
        var fs = require('fs');
        var dirPath = this.localFileDirectoryPath();
        var filePath = this.localFilePath(savefileId);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    };
    
    static loadFromLocalFile(savefileId) {
        var data = null;
        var require = window['process']; // bungcip: changed to make it compile
        var fs = require('fs');
        var filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    };
    
    static loadFromLocalBackupFile(savefileId) {
        var data = null;
        let require = window['require']; // bungcip: changed to make it compile
        var fs = require('fs');
        var filePath = this.localFilePath(savefileId) + ".bak";
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    };
    
    static localFileBackupExists(savefileId) {
        let require = window['require']; // bungcip: changed to make it compile
        var fs = require('fs');
        return fs.existsSync(this.localFilePath(savefileId) + ".bak");
    };
    
    static localFileExists(savefileId) {
        let require = window['require']; // bungcip: changed to make it compile
        var fs = require('fs');
        return fs.existsSync(this.localFilePath(savefileId));
    };
    
    static removeLocalFile(savefileId) {
        let require = window['require']; // bungcip: changed to make it compile
        var fs = require('fs');
        var filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };
    
    static saveToWebStorage(savefileId, json) {
        var key = this.webStorageKey(savefileId);
        var data = LZString.compressToBase64(json);
        localStorage.setItem(key, data);
    };
    
    static loadFromWebStorage(savefileId) {
        var key = this.webStorageKey(savefileId);
        var data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    };
    
    static loadFromWebStorageBackup(savefileId) {
        var key = this.webStorageKey(savefileId) + "bak";
        var data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    };
    
    static webStorageBackupExists(savefileId) {
        var key = this.webStorageKey(savefileId) + "bak";
        return !!localStorage.getItem(key);
    };
    
    static webStorageExists(savefileId) {
        var key = this.webStorageKey(savefileId);
        return !!localStorage.getItem(key);
    };
    
    static removeWebStorage(savefileId) {
        var key = this.webStorageKey(savefileId);
        localStorage.removeItem(key);
    };
    
    static localFileDirectoryPath() {
        let require = window['require']; // bungcip: changed to make it compile
        let process = window['process']; // bungcip: changed to make it compile
        var path = require('path');
    
        var base = path.dirname(process.mainModule.filename);
        return path.join(base, 'save/');
    };
    
    static localFilePath(savefileId) {
        var name;
        if (savefileId < 0) {
            name = 'config.rpgsave';
        } else if (savefileId === 0) {
            name = 'global.rpgsave';
        } else {
            name = 'file%1.rpgsave'.format(savefileId);
        }
        return this.localFileDirectoryPath() + name;
    };
    
    static webStorageKey(savefileId) {
        if (savefileId < 0) {
            return 'RPG Config';
        } else if (savefileId === 0) {
            return 'RPG Global';
        } else {
            return 'RPG File%1'.format(savefileId);
        }
    };
        
}

