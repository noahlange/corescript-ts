import Graphics from './Graphics';
import { SceneManager } from 'rpg_managers';

//-----------------------------------------------------------------------------
/**
 * The static class that handles resource loading.
 *
 * @class ResourceHandler
 */

export default class ResourceHandler {
    static _reloaders: Function[] = [];
    static _defaultRetryInterval = [500, 1000, 3000];

    static createLoader(url: string, retryMethod: Function, resignMethod?: Function, retryInterval?: number[]): () => void {
        retryInterval = retryInterval || this._defaultRetryInterval;
        const reloaders = this._reloaders;
        let retryCount = 0;
        return function () {
            if (retryCount < retryInterval.length) {
                setTimeout(retryMethod, retryInterval[retryCount]);
                retryCount++;
            } else {
                if (resignMethod) {
                    resignMethod();
                }
                if (url) {
                    if (reloaders.length === 0) {
                        Graphics.printLoadingError(url);
                        SceneManager.stop();
                    }
                    reloaders.push(function () {
                        retryCount = 0;
                        retryMethod();
                    });
                }
            }
        };
    };

    static exists(): boolean {
        return this._reloaders.length > 0;
    };

    static retry() {
        if (this._reloaders.length > 0) {
            Graphics.eraseLoadingError();
            SceneManager.resume();
            this._reloaders.forEach(function (reloader) {
                reloader();
            });
            this._reloaders.length = 0;
        }
    };
}

