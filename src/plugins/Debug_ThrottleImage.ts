/*:
 * @plugindesc Throttle loading images.
 * @author RM CoreScript team
 *
 * @help
 * This plugin throttle loading.
 * Loading image is delayed by Delay parameter(in ms)
 *
 * @param Delay
 * @default 2000
 */

/*:ja
 * @plugindesc 画像読み込みを遅くします
 * @author RM CoreScript team
 *
 * @help
 * デバッグ用途で、画像読み込みを遅くします。
 *
 * @param Delay
 * @default 2000
 */

import { Core, Managers } from 'corescript';

(() => {
  const parameters = Managers.PluginManager.parameters(
    'Debug_ThrottleImage'
  ) as any;
  const delay = +parameters.Delay || 2000;
  const BitmapPrototypeOnLoad = Core.Bitmap.prototype._onLoad;
  Core.Bitmap.prototype._onLoad = function() {
    setTimeout(BitmapPrototypeOnLoad.bind(this), delay);
  };
})();
