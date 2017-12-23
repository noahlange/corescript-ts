import Graphics from './Graphics';
// import { SceneManager } from 'rpg_managers';

/**
 * The static class that handles resource loading.
 */
export default class ResourceHandler {
  public static createLoader(
    url: string,
    retryMethod: () => void,
    resignMethod?: () => void,
    retryInterval?: number[]
  ): () => void {
    retryInterval = retryInterval || this._defaultRetryInterval;
    const reloaders = this._reloaders;
    let retryCount = 0;
    return () => {
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
            // SceneManager.stop();
          }
          reloaders.push(() => {
            retryCount = 0;
            retryMethod();
          });
        }
      }
    };
  }

  public static exists(): boolean {
    return this._reloaders.length > 0;
  }

  public static retry() {
    if (this._reloaders.length > 0) {
      Graphics.eraseLoadingError();
      // SceneManager.resume();
      this._reloaders.forEach(reloader => reloader());
      this._reloaders.length = 0;
    }
  }
  protected static _reloaders: Array<() => void> = [];
  protected static _defaultRetryInterval = [500, 1000, 3000];
}
