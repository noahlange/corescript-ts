/**
 * The color matrix filter for WebGL.
 */
export default class ToneFilter extends PIXI.filters.ColorMatrixFilter {
  /**
   * Changes the hue.
   */
  public adjustHue(
    /** The hue value in the range (-360, 360) */
    value: number
  ) {
    this.hue(value, true);
  }

  /**
   * Changes the saturation.
   */
  public adjustSaturation(
    /** The saturation value in the range (-255, 255) */
    value: number
  ) {
    value = (value || 0).clamp(-255, 255) / 255;
    this.saturate(value, true);
  }

  public adjustTone(
    /** The red strength in the range (-255, 255) */
    r: number,
    /** The green strength in the range (-255, 255) */
    g: number,
    /** The blue strength in the range (-255, 255) */
    b: number
  ) {
    r = (r || 0).clamp(-255, 255) / 255;
    g = (g || 0).clamp(-255, 255) / 255;
    b = (b || 0).clamp(-255, 255) / 255;

    if (r !== 0 || g !== 0 || b !== 0) {
      const matrix = [
        1,
        0,
        0,
        r,
        0,
        0,
        1,
        0,
        g,
        0,
        0,
        0,
        1,
        b,
        0,
        0,
        0,
        0,
        1,
        0
      ];

      this._loadMatrix(matrix, true);
    }
  }
}
