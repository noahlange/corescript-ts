import Game_Actor from './Game_Actor';

//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

export default class Game_Actors {
    protected _data: Game_Actor[] = [];

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