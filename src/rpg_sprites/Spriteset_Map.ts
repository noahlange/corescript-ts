import $ from '$';
import { Graphics, ShaderTilemap, Sprite, TilingSprite, Weather } from 'rpg_core';
import { ImageManager } from 'rpg_managers';

import Sprite_Character from './Sprite_Character';
import Sprite_Destination from './Sprite_Destination';
import Spriteset_Base from './Spriteset_Base';

/**
 * The set of sprites on the map screen.
 */
export default class Spriteset_Map extends Spriteset_Base {
    protected _characterSprites: Sprite_Character[];
    protected _parallax: TilingSprite;
    protected _tilemap: ShaderTilemap;
    protected _tileset: DB.Tileset;
    protected _shadowSprite: Sprite;
    protected _destinationSprite: Sprite_Destination;
    protected _parallaxName: string;
    protected _weather: Weather;

    createLowerLayer() {
        super.createLowerLayer();
        this.createParallax();
        this.createTilemap();
        this.createCharacters();
        this.createShadow();
        this.createDestination();
        this.createWeather();
    };

    update() {
        super.update();
        this.updateTileset();
        this.updateParallax();
        this.updateTilemap();
        this.updateShadow();
        this.updateWeather();
    };

    hideCharacters() {
        for (const sprite of this._characterSprites) {
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
        this._tilemap = new ShaderTilemap();
        this._tilemap.tileWidth = $.gameMap.tileWidth();
        this._tilemap.tileHeight = $.gameMap.tileHeight();
        this._tilemap.setData($.gameMap.width(), $.gameMap.height(), $.gameMap.data());
        this._tilemap.horizontalWrap = $.gameMap.isLoopHorizontal();
        this._tilemap.verticalWrap = $.gameMap.isLoopVertical();
        this.loadTileset();
        this._baseSprite.addChild(this._tilemap);
    };

    loadTileset() {
        this._tileset = $.gameMap.tileset();
        if (this._tileset) {
            const tilesetNames = this._tileset.tilesetNames;
            for (let i = 0; i < tilesetNames.length; i++) {
                this._tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
            }
            const newTilesetFlags = $.gameMap.tilesetFlags();
            this._tilemap.refreshTileset();
            if (!this._tilemap.flags.equals(newTilesetFlags)) {
                this._tilemap.refresh();
            }
            this._tilemap.flags = newTilesetFlags;
        }
    };

    createCharacters() {
        this._characterSprites = [];
        $.gameMap.events().forEach(function (event) {
            this._characterSprites.push(new Sprite_Character(event));
        }, this);
        $.gameMap.vehicles().forEach(function (vehicle) {
            this._characterSprites.push(new Sprite_Character(vehicle));
        }, this);
        $.gamePlayer.followers().reverseEach(function (follower) {
            this._characterSprites.push(new Sprite_Character(follower));
        }, this);
        this._characterSprites.push(new Sprite_Character($.gamePlayer));
        for (const sprite of this._characterSprites) {
            this._tilemap.addChild(sprite);
        }
    };

    createShadow() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        (this._shadowSprite as any).z = 6;
        this._tilemap.addChild(this._shadowSprite);
    };

    createDestination() {
        this._destinationSprite = new Sprite_Destination();
        (this._destinationSprite as any).z = 9;
        this._tilemap.addChild(this._destinationSprite);
    };

    createWeather() {
        this._weather = new Weather();
        this.addChild(this._weather);
    };

    updateTileset() {
        if (this._tileset !== $.gameMap.tileset()) {
            this.loadTileset();
        }
    };

    updateParallax() {
        if (this._parallaxName !== $.gameMap.parallaxName()) {
            this._parallaxName = $.gameMap.parallaxName();

            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        }
        if (this._parallax.bitmap) {
            this._parallax.origin.x = $.gameMap.parallaxOx();
            this._parallax.origin.y = $.gameMap.parallaxOy();
        }
    };

    updateTilemap() {
        this._tilemap.origin.x = $.gameMap.displayX() * $.gameMap.tileWidth();
        this._tilemap.origin.y = $.gameMap.displayY() * $.gameMap.tileHeight();
    };

    updateShadow() {
        const airship = $.gameMap.airship();
        this._shadowSprite.x = airship.shadowX();
        this._shadowSprite.y = airship.shadowY();
        this._shadowSprite.opacity = airship.shadowOpacity();
    };

    updateWeather() {
        this._weather.type = $.gameScreen.weatherType();
        this._weather.power = $.gameScreen.weatherPower();
        this._weather.origin.x = $.gameMap.displayX() * $.gameMap.tileWidth();
        this._weather.origin.y = $.gameMap.displayY() * $.gameMap.tileHeight();
    };

}

