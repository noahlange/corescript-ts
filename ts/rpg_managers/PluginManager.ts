//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

interface PluginParamMap {
    [key: string]: Object;
}

class PluginManager {
    protected static _path = 'js/plugins/';
    protected static _scripts: HTMLScriptElement[] = [];
    protected static _errorUrls: string[] = [];
    protected static _parameters: PluginParamMap = {};

    static setup(plugins: any[]) {
        plugins.forEach(function (plugin) {
            if (plugin.status && !this._scripts.contains(plugin.name)) {
                this.setParameters(plugin.name, plugin.parameters);
                this.loadScript(plugin.name + '.js');
                this._scripts.push(plugin.name);
            }
        }, this);
    };

    static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            throw new Error('Failed to load: ' + url);
        }
    };

    static parameters(name: string) {
        return this._parameters[name.toLowerCase()] || {};
    };

    static setParameters(name: string, parameters: Object) {
        this._parameters[name.toLowerCase()] = parameters;
    };

    static loadScript(name: string) {
        const url = this._path + name;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        (script as any)['_url'] = url;
        document.body.appendChild(script);
    };

    static onError(e: ErrorEvent) {
        this._errorUrls.push((e.target as any)['_url']);
    };

}
