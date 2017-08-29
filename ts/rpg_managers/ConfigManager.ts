//-----------------------------------------------------------------------------
// ConfigManager
//
// The static class that manages the configuration data.

class ConfigManager {
    static alwaysDash = false;
    static commandRemember = false;

    static get bgmVolume() {
        return AudioManager._bgmVolume;
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
        var json;
        var config = {};
        try {
            json = StorageManager.load(-1);
        } catch (e) {
            console.error(e);
        }
        if (json) {
            config = JSON.parse(json);
        }
        this.applyData(config);
    };

    static save() {
        StorageManager.save(-1, JSON.stringify(this.makeData()));
    };

    static makeData() {
        var config = {};
        config['alwaysDash'] = this.alwaysDash;
        config['commandRemember'] = this.commandRemember;
        config['bgmVolume'] = this.bgmVolume;
        config['bgsVolume'] = this.bgsVolume;
        config['meVolume'] = this.meVolume;
        config['seVolume'] = this.seVolume;
        return config;
    };

    static applyData(config) {
        this.alwaysDash = this.readFlag(config, 'alwaysDash');
        this.commandRemember = this.readFlag(config, 'commandRemember');
        this.bgmVolume = this.readVolume(config, 'bgmVolume');
        this.bgsVolume = this.readVolume(config, 'bgsVolume');
        this.meVolume = this.readVolume(config, 'meVolume');
        this.seVolume = this.readVolume(config, 'seVolume');
    };

    static readFlag(config, name) {
        return !!config[name];
    };

    static readVolume(config, name) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(0, 100);
        } else {
            return 100;
        }
    };

}


