/*:
 * @plugindesc Basic plugin for manipulating important parameters..
 * @author RM CoreScript team
 *
 * @help
 * Basic plugin for manipulating important parameters..
 * There is no plugin command.
 *
 * @param cacheLimit
 * @desc The upper limit of images' cached size (MPixel)
 * @default 10
 *
 * @param screenWidth
 * @desc The resolution of screen width
 * @default 816
 *
 * @param screenHeight
 * @desc The resolution of screen height
 * @default 624
 *
 * @param changeWindowWidthTo
 * @desc If set, change window width to this value
 *
 * @param changeWindowHeightTo
 * @desc If set, change window height to this value
 *
 * @param renderingMode
 * @desc The rendering mode (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @desc The initial value whether the player always dashes (on/off)
 * @default off
 */

/*:ja
 * @plugindesc 基本的なパラメーターを設定するプラグインです。
 * @author RM CoreScript team
 *
 * @help
 * 基本的なパラメーターを設定するプラグインです。
 * このプラグインにはプラグインコマンドはありません。
 *
 * @param cacheLimit
 * @desc 画像のメモリへのキャッシュの上限値 (MPix)
 * @default 10
 *
 * @param screenWidth
 * @desc 画面サイズの幅
 * @default 816
 *
 * @param screenHeight
 * @desc 画面サイズの高さ
 * @default 624
 *
 * @param changeWindowWidthTo
 * @desc 値が設定された場合、ウインドウの幅を指定した値に変更
 *
 * @param changeWindowHeightTo
 * @desc 値が設定された場合、ウインドウの高さを指定した値に変更
 *
 * @param renderingMode
 * @desc レンダリングモード (canvas/webgl/auto)
 * @default auto
 *
 * @param alwaysDash
 * @desc プレイヤーが常時ダッシュするかどうかの初期値 (on/off)
 * @default off
 */

import * as cs from 'corescript';

interface ICommunityBasicParams {
  cacheLimit: string;
  screenWidth: string;
  screenHeight: string;
  renderingMode: string;
  alwaysDash: 'on' | 'off';
  changeWindowWidthTo: string;
  changeWindowHeightTo: string;
}

(() => {

  const { ImageCache, Utils } = cs.Core;
  const { ConfigManager, PluginManager, SceneManager } = cs.Managers;

  const toNumber = (str: string, def: number) => isNaN(parseFloat(str)) ? def : +(str || def);

  const parameters = PluginManager.parameters('Community_Basic') as ICommunityBasicParams;
  const cacheLimit = toNumber(parameters.cacheLimit, 10);
  const screenWidth = toNumber(parameters.screenWidth, 816);
  const screenHeight = toNumber(parameters.screenHeight, 624);
  const renderingMode = parameters.renderingMode.toLowerCase();
  const alwaysDash = parameters.alwaysDash.toLowerCase() === 'on';
  const windowWidthTo = toNumber(parameters.changeWindowWidthTo, 0);
  const windowHeightTo = toNumber(parameters.changeWindowHeightTo, 0);

  let windowWidth: number;
  let windowHeight: number;

  if (windowWidthTo){
    windowWidth = windowWidthTo;
  } else if (screenWidth !== SceneManager.screenWidth) {
    windowWidth = screenWidth;
  }

  if (windowHeightTo){
    windowHeight = windowHeightTo;
  } else if (screenHeight !== SceneManager.screenHeight) {
    windowHeight = screenHeight;
  }

  ImageCache.limit = cacheLimit * 1000 * 1000;
  SceneManager.screenWidth = screenWidth;
  SceneManager.screenHeight = screenHeight;
  SceneManager.boxWidth = screenWidth;
  SceneManager.boxHeight = screenHeight;

  Object.defineProperty(SceneManager.prototype, 'referableRendererType', {
    value() {
      if (Utils.isOptionValid('canvas')) {
        return 'canvas';
      } else if (Utils.isOptionValid('webgl')) {
        return 'webgl';
      } else if (renderingMode === 'canvas') {
        return 'canvas';
      } else if (renderingMode === 'webgl') {
        return 'webgl';
      } else {
        return 'auto';
      }
    }
  });

  const ConfigManagerApplyData = ConfigManager.applyData;
  ConfigManager.applyData = function(config) {
    ConfigManagerApplyData.apply(this, arguments);
    if (config.alwaysDash === undefined) {
      this.alwaysDash = alwaysDash;
    }
  };

  const SceneManagerInitNwjs = SceneManager.initNwjs;
  SceneManager.initNwjs = function(...args: any[]) {
    SceneManagerInitNwjs.apply(this, args);
    if ((Utils.isNwjs() || Utils.isElectron() && windowWidth && windowHeight)) {
      const dw = windowWidth - window.innerWidth;
      const dh = windowHeight - window.innerHeight;
      window.moveBy(-dw / 2, -dh / 2);
      window.resizeBy(dw, dh);
    }
  };
})();