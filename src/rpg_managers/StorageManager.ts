import { Utils } from 'rpg_core';

//-----------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.

export default class StorageManager {
    static save(savefileId: number, json: Object) {
        if (this.isLocalMode()) {
            this.saveToLocalFile(savefileId, json);
        } else {
            this.saveToWebStorage(savefileId, json);
        }
    };
    
    static load(savefileId: number) {
        if (this.isLocalMode()) {
            return this.loadFromLocalFile(savefileId);
        } else {
            return this.loadFromWebStorage(savefileId);
        }
    };
    
    static exists(savefileId: number) {
        if (this.isLocalMode()) {
            return this.localFileExists(savefileId);
        } else {
            return this.webStorageExists(savefileId);
        }
    };
    
    static remove(savefileId: number) {
        if (this.isLocalMode()) {
            this.removeLocalFile(savefileId);
        } else {
            this.removeWebStorage(savefileId);
        }
    };
    
    static backup(savefileId: number) {
        if (this.exists(savefileId)) {
            if (this.isLocalMode()) {
                const data = this.loadFromLocalFile(savefileId);
                const compressed = LZString.compressToBase64(data);
                let require = (window as any)['require']; // bungcip: changed to make it compile
                const fs = require('fs');
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId) + ".bak";
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
            } else {
                const data = this.loadFromWebStorage(savefileId);
                const compressed = LZString.compressToBase64(data);
                const key = this.webStorageKey(savefileId) + "bak";
                localStorage.setItem(key, compressed);
            }
        }
    };
    
    static backupExists(savefileId: number) {
        if (this.isLocalMode()) {
            return this.localFileBackupExists(savefileId);
        } else {
            return this.webStorageBackupExists(savefileId);
        }
    };
    
    static cleanBackup(savefileId: number) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                let require = (window as any)['require']; // bungcip: changed to make it compile
                const fs = require('fs');
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId);
                fs.unlinkSync(filePath + ".bak");
            } else {
                const key = this.webStorageKey(savefileId);
                localStorage.removeItem(key + "bak");
            }
        }
    };
    
    static restoreBackup(savefileId: number) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                const data = this.loadFromLocalBackupFile(savefileId);
                const compressed = LZString.compressToBase64(data);
                let require = (window as any)['require']; // bungcip: changed to make it compile
                const fs = require('fs');
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
                fs.unlinkSync(filePath + ".bak");
            } else {
                const data = this.loadFromWebStorageBackup(savefileId);
                const compressed = LZString.compressToBase64(data);
                const key = this.webStorageKey(savefileId);
                localStorage.setItem(key, compressed);
                localStorage.removeItem(key + "bak");
            }
        }
    };
    
    static isLocalMode() {
        return Utils.isNwjs();
    };
    
    static saveToLocalFile(savefileId: number, json: Object) {
        const data = LZString.compressToBase64(json);
        let require = (window as any)['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        const dirPath = this.localFileDirectoryPath();
        const filePath = this.localFilePath(savefileId);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    };
    
    static loadFromLocalFile(savefileId: number) {
        let data = null;
        const require = (window as any)['process']; // bungcip: changed to make it compile
        const fs = require('fs');
        const filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    };
    
    static loadFromLocalBackupFile(savefileId: number) {
        let data = null;
        let require = (window as any)['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        const filePath = this.localFilePath(savefileId) + ".bak";
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    };
    
    static localFileBackupExists(savefileId: number) {
        let require = (window as any)['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        return fs.existsSync(this.localFilePath(savefileId) + ".bak");
    };
    
    static localFileExists(savefileId: number) {
        let require = (window as any)['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        return fs.existsSync(this.localFilePath(savefileId));
    };
    
    static removeLocalFile(savefileId: number) {
        let require = (window as any)['require']; // bungcip: changed to make it compile
        const fs = require('fs');
        const filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };
    
    static saveToWebStorage(savefileId: number, json: Object) {
        const key = this.webStorageKey(savefileId);
        const data = LZString.compressToBase64(json);
        localStorage.setItem(key, data);
    };
    
    static loadFromWebStorage(savefileId: number) {
        const key = this.webStorageKey(savefileId);
        const data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    };
    
    static loadFromWebStorageBackup(savefileId: number) {
        const key = this.webStorageKey(savefileId) + "bak";
        const data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    };
    
    static webStorageBackupExists(savefileId: number) {
        const key = this.webStorageKey(savefileId) + "bak";
        return !!localStorage.getItem(key);
    };
    
    static webStorageExists(savefileId: number) {
        const key = this.webStorageKey(savefileId);
        return !!localStorage.getItem(key);
    };
    
    static removeWebStorage(savefileId: number) {
        const key = this.webStorageKey(savefileId);
        localStorage.removeItem(key);
    };
    
    static localFileDirectoryPath() {
        let require = (window as any)['require']; // bungcip: changed to make it compile
        let process = (window as any)['process']; // bungcip: changed to make it compile
        const path = require('path');
    
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, 'save/');
    };
    
    static localFilePath(savefileId: number) {
        let name;
        if (savefileId < 0) {
            name = 'config.rpgsave';
        } else if (savefileId === 0) {
            name = 'global.rpgsave';
        } else {
            name = 'file%1.rpgsave'.format(savefileId);
        }
        return this.localFileDirectoryPath() + name;
    };
    
    static webStorageKey(savefileId: number) {
        if (savefileId < 0) {
            return 'RPG Config';
        } else if (savefileId === 0) {
            return 'RPG Global';
        } else {
            return 'RPG File%1'.format(savefileId);
        }
    };
        
}

