/**
 * The static class that defines utility methods.
 */
export default class Utils {
  /**
   * The name of the RPG Maker. 'MV' in the current version.
   */
  public static RPGMAKER_NAME = 'MV';

  /**
   * The version of the RPG Maker.
   */
  public static RPGMAKER_VERSION = '1.4.1';
  public static RPGMAKER_ENGINE = 'community-1.2c';

  /**
   * Checks whether the option is in the query string.
   */
  public static isOptionValid(
    /** Option name */
    name: string
  ): boolean {
    return location.search
      .slice(1)
      .split('&')
      .contains(name);
  }

  /**
   * Checks whether the platform is NW.js.
   *
   * @static
   * @method isNwjs
   * @return {Boolean} True if the platform is NW.js
   */
  public static isNwjs(): boolean {
    return (
      !this.isElectron() &&
      typeof (window as any).require === 'function' &&
      typeof (window as any).process === 'object'
    );
  }

  public static isElectron(): boolean {
    const processOne = (window as any).Process;
    const processTwo = (window as any).process;
    if (
      typeof window !== 'undefined' &&
      processOne &&
      processOne.type === 'renderer'
    ) {
      return true;
    }
    if (
      typeof processTwo !== 'undefined' &&
      processTwo.versions &&
      !!processTwo.versions.electron
    ) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether the browser can read files in the game folder.
   *
   * @static
   * @method canReadGameFiles
   * @return {Boolean} True if the browser can read files in the game folder
   */
  public static canReadGameFiles(): boolean {
    const scripts = document.getElementsByTagName('script');
    const lastScript = scripts[scripts.length - 1];
    const xhr = new XMLHttpRequest();
    try {
      xhr.open('GET', lastScript.src);
      xhr.overrideMimeType('text/javascript');
      xhr.send();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Makes a CSS color string from RGB values.
   *
   * @static
   * @method rgbToCssColor
   * @param {Number} r The red value in the range (0, 255)
   * @param {Number} g The green value in the range (0, 255)
   * @param {Number} b The blue value in the range (0, 255)
   * @return {String} CSS color string
   */
  public static rgbToCssColor(r: number, g: number, b: number): string {
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return `rgb(${r}, ${g}, ${b})`;
  }

  public static generateRuntimeId(): number {
    return Utils._id++;
  }

  /**
   * Test this browser support passive event feature
   *
   * @static
   * @method isSupportPassiveEvent
   * @return {Boolean} this browser support passive event or not
   */
  public static isSupportPassiveEvent(): boolean {
    if (typeof Utils._supportPassiveEvent === 'boolean') {
      return Utils._supportPassiveEvent;
    }
    // test support passive event
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
    let passive = false;
    const options = Object.defineProperty({}, 'passive', {
      get() {
        passive = true;
      }
    });
    window.addEventListener('test', null, options);
    Utils._supportPassiveEvent = passive;
    return passive;
  }

  protected static _id = 1;
  protected static _supportPassiveEvent: boolean | null = null;
}
