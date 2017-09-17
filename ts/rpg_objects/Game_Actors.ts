//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

class Game_Actors {
    protected _data: Game_Actor[];

    constructor(){
        this._data = [];
        
    }

    actor(actorId: number) {
        if ($dataActors[actorId]) {
            if (!this._data[actorId]) {
                this._data[actorId] = new Game_Actor(actorId);
            }
            return this._data[actorId];
        }
        return null;
    };
    
}