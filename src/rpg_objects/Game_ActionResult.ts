import $ from '$';

//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

export default class Game_ActionResult {
    public used: boolean;
    public missed: boolean;
    public evaded: boolean;
    public physical: boolean;
    public drain: boolean;
    public critical: boolean;
    public success: boolean;
    public hpAffected: boolean;
    public hpDamage: number;
    public mpDamage: number;
    public tpDamage: number;
    public addedStates: any[];
    public removedStates: any[];
    public addedBuffs: any[];
    public addedDebuffs: any[];
    public removedBuffs: any[];

    constructor(){
        this.clear();
    }

    clear() {
        this.used = false;
        this.missed = false;
        this.evaded = false;
        this.physical = false;
        this.drain = false;
        this.critical = false;
        this.success = false;
        this.hpAffected = false;
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.tpDamage = 0;
        this.addedStates = [];
        this.removedStates = [];
        this.addedBuffs = [];
        this.addedDebuffs = [];
        this.removedBuffs = [];
    };
    
    addedStateObjects() {
        return this.addedStates.map(function(id) {
            return $.dataStates[id];
        });
    };
    
    removedStateObjects() {
        return this.removedStates.map(function(id) {
            return $.dataStates[id];
        });
    };
    
    isStatusAffected(): boolean {
        return (this.addedStates.length > 0 || this.removedStates.length > 0 ||
                this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
                this.removedBuffs.length > 0);
    };
    
    isHit(): boolean {
        return this.used && !this.missed && !this.evaded;
    };
    
    isStateAdded(stateId: number) {
        return this.addedStates.contains(stateId);
    };
    
    pushAddedState(stateId: number) {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    };
    
    isStateRemoved(stateId: number) {
        return this.removedStates.contains(stateId);
    };
    
    pushRemovedState(stateId: number) {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    };
    
    isBuffAdded(paramId: number) {
        return this.addedBuffs.contains(paramId);
    };
    
    pushAddedBuff(paramId: number) {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    };
    
    isDebuffAdded(paramId: number) {
        return this.addedDebuffs.contains(paramId);
    };
    
    pushAddedDebuff(paramId: number) {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    };
    
    isBuffRemoved(paramId: number) {
        return this.removedBuffs.contains(paramId);
    };
    
    pushRemovedBuff(paramId: number) {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    };
    
}


