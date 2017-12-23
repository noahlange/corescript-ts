/**
 * The root object of the display tree.
 */
export default class Stage extends PIXI.Container {
  // The interactive flag causes a memory leak.
  public interative = false;
}
