//-----------------------------------------------------------------------------
/**
 * The rectangle class.
 *
 * @class Rectangle
 * @constructor
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 */
class Rectangle extends PIXI.Rectangle {
    /**
     * @static
     * @property emptyRectangle
     * @type Rectangle
     * @private
     */
    static emptyRectangle = new Rectangle(0, 0, 0, 0);

}
