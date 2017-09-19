//-----------------------------------------------------------------------------
// ConfigManager
//
// The static class that manages the configuration data.


interface ConfigOption {
    alwaysDash: boolean;
    commandRemember: boolean;
    bgmVolume: number;
    bgsVolume: number;
    meVolume: number;
    seVolume: number;

    [key: string]: number | boolean;
}

class ConfigManager {
    static alwaysDash = false;
    static commandRemember = false;

    static get bgmVolume(): number {
        return AudioManager._bgmVolume;
    }
    static set bgmVolume(value: number) {
        AudioManager.bgmVolume = value;
    }

    static get bgsVolume(): number {
        return AudioManager.bgsVolume;
    }

    static set bgsVolume(value: number) {
        AudioManager.bgsVolume = value;
    }

    static get meVolume(): number {
        return AudioManager.meVolume;
    }
    static set meVolume(value: number) {
        AudioManager.meVolume = value;
    }

    static get seVolume(): number {
        return AudioManager.seVolume;
    }
    static set seVolume(value: number) {
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
        this.applyData(config as ConfigOption);
    };

    static save() {
        StorageManager.save(-1, JSON.stringify(this.makeData()));
    };

    static makeData(): ConfigOption {
        var config = {
            alwaysDash:this.alwaysDash,
            commandRemember:this.commandRemember,
            bgmVolume:this.bgmVolume,
            bgsVolume:this.bgsVolume,
            meVolume:this.meVolume,
            seVolume:this.seVolume,
        };
        return config;
    };

    static applyData(config: ConfigOption) {
        this.alwaysDash = this.readFlag(config, 'alwaysDash');
        this.commandRemember = this.readFlag(config, 'commandRemember');
        this.bgmVolume = this.readVolume(config, 'bgmVolume');
        this.bgsVolume = this.readVolume(config, 'bgsVolume');
        this.meVolume = this.readVolume(config, 'meVolume');
        this.seVolume = this.readVolume(config, 'seVolume');
    };

    static readFlag(config: ConfigOption, name: string): boolean {
        return !!config[name];
    };

    static readVolume(config: ConfigOption, name: string): number {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(0, 100);
        } else {
            return 100;
        }
    };

}


