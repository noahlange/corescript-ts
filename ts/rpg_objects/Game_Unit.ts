//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

abstract class Game_Unit<T extends Game_Battler> {
    protected _inBattle: boolean = false;

    inBattle(): boolean {
        return this._inBattle;
    };
    
    members(): T[] {
        return [];
    };
    
    aliveMembers() {
        return this.members().filter(function(member) {
            return member.isAlive();
        });
    };
    
    deadMembers() {
        return this.members().filter(function(member) {
            return member.isDead();
        });
    };
    
    movableMembers() {
        return this.members().filter(function(member) {
            return member.canMove();
        });
    };
    
    clearActions() {
        return this.members().forEach(function(member) {
            return member.clearActions();
        });
    };
    
    agility() {
        const members = this.members();
        if (members.length === 0) {
            return 1;
        }
        const sum = members.reduce(function(r, member) {
            return r + member.agi;
        }, 0);
        return sum / members.length;
    };
    
    tgrSum() {
        return this.aliveMembers().reduce(function(r, member) {
            return r + member.tgr;
        }, 0);
    };
    
    randomTarget(): T | null {
        let tgrRand = Math.random() * this.tgrSum();
        let target: T | null = null;
        this.aliveMembers().forEach(function(member) {
            tgrRand -= member.tgr;
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        });
        return target;
    };
    
    randomDeadTarget(): T {
        const members = this.deadMembers();
        if (members.length === 0) {
            return null;
        }
        return members[Math.floor(Math.random() * members.length)];
    };
    
    smoothTarget(index: number): Game_Battler {
        if (index < 0) {
            index = 0;
        }
        const member = this.members()[index];
        return (member && member.isAlive()) ? member : this.aliveMembers()[0];
    };
    
    smoothDeadTarget(index: number): Game_Battler {
        if (index < 0) {
            index = 0;
        }
        const member = this.members()[index];
        return (member && member.isDead()) ? member : this.deadMembers()[0];
    };
    
    clearResults() {
        this.members().forEach(function(member) {
            member.clearResult();
        });
    };
    
    onBattleStart() {
        this.members().forEach(function(member) {
            member.onBattleStart();
        });
        this._inBattle = true;
    };
    
    onBattleEnd() {
        this._inBattle = false;
        this.members().forEach(function(member) {
            member.onBattleEnd();
        });
    };
    
    makeActions() {
        this.members().forEach(function(member) {
            member.makeActions();
        });
    };
    
    select(activeMember: T) {
        this.members().forEach(function(member) {
            if (member === activeMember) {
                member.select();
            } else {
                member.deselect();
            }
        });
    };
    
    isAllDead() {
        return this.aliveMembers().length === 0;
    };
    
    substituteBattler() {
        const members = this.members();
        for (let i = 0; i < members.length; i++) {
            if (members[i].isSubstitute()) {
                return members[i];
            }
        }
    };
        
}

