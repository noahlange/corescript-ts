//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

class PluginManager {
    protected static _path = 'js/plugins/';
    protected static _scripts: HTMLScriptElement[] = [];
    protected static _errorUrls: string[] = [];
    protected static _parameters = {};

    static setup(plugins) {
        plugins.forEach(function (plugin) {
            if (plugin.status && !this._scripts.contains(plugin.name)) {
                this.setParameters(plugin.name, plugin.parameters);
                this.loadScript(plugin.name + '.js');
                this._scripts.push(plugin.name);
            }
        }, this);
    };

    static checkErrors() {
        var url = this._errorUrls.shift();
        if (url) {
            throw new Error('Failed to load: ' + url);
        }
    };

    static parameters(name: string) {
        return this._parameters[name.toLowerCase()] || {};
    };

    static setParameters(name: string, parameters) {
        this._parameters[name.toLowerCase()] = parameters;
    };

    static loadScript(name: string) {
        var url = this._path + name;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        script['_url'] = url;
        document.body.appendChild(script);
    };

    static onError(e) {
        this._errorUrls.push(e.target._url);
    };

}
