//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class Stage
 * @constructor
 */
class Stage extends PIXI.Container {
    constructor() {
        super();
    
        // The interactive flag causes a memory leak.
        this.interactive = false;
    };
    
}
