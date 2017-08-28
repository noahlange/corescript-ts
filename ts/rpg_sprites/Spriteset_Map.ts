//-----------------------------------------------------------------------------
// Spriteset_Map
//
// The set of sprites on the map screen.

class Spriteset_Map extends Spriteset_Base {
    protected _characterSprites;
    protected _parallax;
    protected _tilemap;
    protected _tileset;
    protected _shadowSprite;
    protected _destinationSprite;
    protected _parallaxName;
    protected _weather;

    // initialize() {
    //     Spriteset_Base.prototype.initialize.call(this);
    // };

    createLowerLayer() {
        Spriteset_Base.prototype.createLowerLayer.call(this);
        this.createParallax();
        this.createTilemap();
        this.createCharacters();
        this.createShadow();
        this.createDestination();
        this.createWeather();
    };

    update() {
        Spriteset_Base.prototype.update.call(this);
        this.updateTileset();
        this.updateParallax();
        this.updateTilemap();
        this.updateShadow();
        this.updateWeather();
    };

    hideCharacters() {
        for (var i = 0; i < this._characterSprites.length; i++) {
            var sprite = this._characterSprites[i];
            if (!sprite.isTile()) {
                sprite.hide();
            }
        }
    };

    createParallax() {
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._baseSprite.addChild(this._parallax);
    };

    createTilemap() {
        if (Graphics.isWebGL()) {
            this._tilemap = new ShaderTilemap();
        } else {
            this._tilemap = new Tilemap();
        }
        this._tilemap.tileWidth = $gameMap.tileWidth();
        this._tilemap.tileHeight = $gameMap.tileHeight();
        this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
        this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
        this._tilemap.verticalWrap = $gameMap.isLoopVertical();
        this.loadTileset();
        this._baseSprite.addChild(this._tilemap);
    };

    loadTileset() {
        this._tileset = $gameMap.tileset();
        if (this._tileset) {
            var tilesetNames = this._tileset.tilesetNames;
            for (var i = 0; i < tilesetNames.length; i++) {
                this._tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
            }
            var newTilesetFlags = $gameMap.tilesetFlags();
            this._tilemap.refreshTileset();
            if (!this._tilemap.flags.equals(newTilesetFlags)) {
                this._tilemap.refresh();
            }
            this._tilemap.flags = newTilesetFlags;
        }
    };

    createCharacters() {
        this._characterSprites = [];
        $gameMap.events().forEach(function (event) {
            this._characterSprites.push(new Sprite_Character(event));
        }, this);
        $gameMap.vehicles().forEach(function (vehicle) {
            this._characterSprites.push(new Sprite_Character(vehicle));
        }, this);
        $gamePlayer.followers().reverseEach(function (follower) {
            this._characterSprites.push(new Sprite_Character(follower));
        }, this);
        this._characterSprites.push(new Sprite_Character($gamePlayer));
        for (var i = 0; i < this._characterSprites.length; i++) {
            this._tilemap.addChild(this._characterSprites[i]);
        }
    };

    createShadow() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this._shadowSprite.z = 6;
        this._tilemap.addChild(this._shadowSprite);
    };

    createDestination() {
        this._destinationSprite = new Sprite_Destination();
        this._destinationSprite.z = 9;
        this._tilemap.addChild(this._destinationSprite);
    };

    createWeather() {
        this._weather = new Weather();
        this.addChild(this._weather);
    };

    updateTileset() {
        if (this._tileset !== $gameMap.tileset()) {
            this.loadTileset();
        }
    };

    /*
     * Simple fix for canvas parallax issue, destroy old parallax and readd to  the tree.
     */
    _canvasReAddParallax() {
        var index = this._baseSprite.children.indexOf(this._parallax);
        this._baseSprite.removeChild(this._parallax);
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        this._baseSprite.addChildAt(this._parallax, index);
    };

    updateParallax() {
        if (this._parallaxName !== $gameMap.parallaxName()) {
            this._parallaxName = $gameMap.parallaxName();

            if (this._parallax.bitmap && Graphics.isWebGL() != true) {
                this._canvasReAddParallax();
            } else {
                this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
            }
        }
        if (this._parallax.bitmap) {
            this._parallax.origin.x = $gameMap.parallaxOx();
            this._parallax.origin.y = $gameMap.parallaxOy();
        }
    };

    updateTilemap() {
        this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    };

    updateShadow() {
        var airship = $gameMap.airship();
        this._shadowSprite.x = airship.shadowX();
        this._shadowSprite.y = airship.shadowY();
        this._shadowSprite.opacity = airship.shadowOpacity();
    };

    updateWeather() {
        this._weather.type = $gameScreen.weatherType();
        this._weather.power = $gameScreen.weatherPower();
        this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    };

}

