//-----------------------------------------------------------------------------
// Game_Followers
//
// The wrapper class for a follower array.

class Game_Followers {
    protected _visible: boolean;
    protected _gathering: boolean;
    protected _data: Game_Follower[];

    constructor() {
        this._visible = $dataSystem.optFollowers;
        this._gathering = false;
        this._data = [];
        for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
            this._data.push(new Game_Follower(i));
        }
    }

    isVisible(): boolean {
        return this._visible;
    };
    
    show() {
        this._visible = true;
    };
    
    hide() {
        this._visible = false;
    };
    
    follower(index: number) {
        return this._data[index];
    };
    
    forEach(callback, thisObject?) {
        this._data.forEach(callback, thisObject);
    };
    
    reverseEach(callback, thisObject?) {
        this._data.reverse();
        this._data.forEach(callback, thisObject);
        this._data.reverse();
    };
    
    refresh() {
        this.forEach(function(follower) {
            return follower.refresh();
        }, this);
    };
    
    update() {
        if (this.areGathering()) {
            if (!this.areMoving()) {
                this.updateMove();
            }
            if (this.areGathered()) {
                this._gathering = false;
            }
        }
        this.forEach(function(follower) {
            follower.update();
        }, this);
    };
    
    updateMove() {
        for (var i = this._data.length - 1; i >= 0; i--) {
            var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
            this._data[i].chaseCharacter(precedingCharacter);
        }
    };
    
    jumpAll() {
        if ($gamePlayer.isJumping()) {
            for (var i = 0; i < this._data.length; i++) {
                var follower = this._data[i];
                var sx = $gamePlayer.deltaXFrom(follower.x);
                var sy = $gamePlayer.deltaYFrom(follower.y);
                follower.jump(sx, sy);
            }
        }
    };
    
    synchronize(x: number, y: number, d: number) {
        this.forEach(function(follower) {
            follower.locate(x, y);
            follower.setDirection(d);
        }, this);
    };
    
    gather() {
        this._gathering = true;
    };
    
    areGathering(): boolean {
        return this._gathering;
    };
    
    visibleFollowers() {
        return this._data.filter(function(follower) {
            return follower.isVisible();
        }, this);
    };
    
    areMoving(): boolean {
        return this.visibleFollowers().some(function(follower) {
            return follower.isMoving();
        }, this);
    };
    
    areGathered(): boolean {
        return this.visibleFollowers().every(function(follower) {
            return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
        }, this);
    };
    
    isSomeoneCollided(x: number, y: number) {
        return this.visibleFollowers().some(function(follower) {
            return follower.pos(x, y);
        }, this);
    };
    
}


