//-----------------------------------------------------------------------------
// Sprite_Picture
//
// The sprite for displaying a picture.

class Sprite_Picture extends Sprite {
    protected _pictureId;
    protected _pictureName;
    
    constructor(pictureId) {
        super();
        this._pictureId = pictureId;
        this._pictureName = '';
        this._isPicture = true;
        this.update();
    };
    
    picture() {
        return $gameScreen.picture(this._pictureId);
    };
    
    update() {
        super.update();
        this.updateBitmap();
        if (this.visible) {
            this.updateOrigin();
            this.updatePosition();
            this.updateScale();
            this.updateTone();
            this.updateOther();
        }
    };
    
    updateBitmap() {
        var picture = this.picture();
        if (picture) {
            var pictureName = picture.name();
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.loadBitmap();
            }
            this.visible = true;
        } else {
            this._pictureName = '';
            this.bitmap = null;
            this.visible = false;
        }
    };
    
    updateOrigin() {
        var picture = this.picture();
        if (picture.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    };
    
    updatePosition() {
        var picture = this.picture();
        this.x = Math.floor(picture.x());
        this.y = Math.floor(picture.y());
    };
    
    updateScale() {
        var picture = this.picture();
        this.scale.x = picture.scaleX() / 100;
        this.scale.y = picture.scaleY() / 100;
    };
    
    updateTone() {
        var picture = this.picture();
        if (picture.tone()) {
            this.setColorTone(picture.tone());
        } else {
            this.setColorTone([0, 0, 0, 0]);
        }
    };
    
    updateOther() {
        var picture = this.picture();
        this.opacity = picture.opacity();
        this.blendMode = picture.blendMode();
        this.rotation = picture.angle() * Math.PI / 180;
    };
    
    loadBitmap() {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    };
        
}

