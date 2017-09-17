//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

class Game_Party extends Game_Unit {

    static ABILITY_ENCOUNTER_HALF = 0;
    static ABILITY_ENCOUNTER_NONE = 1;
    static ABILITY_CANCEL_SURPRISE = 2;
    static ABILITY_RAISE_PREEMPTIVE = 3;
    static ABILITY_GOLD_DOUBLE = 4;
    static ABILITY_DROP_ITEM_DOUBLE = 5;

    protected _gold: number;
    protected _steps: number;
    protected _lastItem;
    protected _menuActorId: number;
    protected _targetActorId: number;
    protected _actors;
    protected _items;
    protected _weapons;
    protected _armors;


    constructor() {
        super();

        this._gold = 0;
        this._steps = 0;
        this._lastItem = new Game_Item();
        this._menuActorId = 0;
        this._targetActorId = 0;
        this._actors = [];
        this.initAllItems();
    };

    initAllItems() {
        this._items = {};
        this._weapons = {};
        this._armors = {};
    };

    exists() {
        return this._actors.length > 0;
    };

    size(): number {
        return this.members().length;
    };

    isEmpty() {
        return this.size() === 0;
    };

    members() {
        return this.inBattle() ? this.battleMembers() : this.allMembers();
    };

    allMembers() {
        return this._actors.map(function (id) {
            return $gameActors.actor(id);
        });
    };

    battleMembers() {
        return this.allMembers().slice(0, this.maxBattleMembers()).filter(function (actor) {
            return actor.isAppeared();
        });
    };

    maxBattleMembers(): number {
        return 4;
    };

    leader() {
        return this.battleMembers()[0];
    };

    reviveBattleMembers() {
        this.battleMembers().forEach(function (actor) {
            if (actor.isDead()) {
                actor.setHp(1);
            }
        });
    };

    items() {
        var list = [];
        for (var id in this._items) {
            list.push($dataItems[id]);
        }
        return list;
    };

    weapons() {
        var list = [];
        for (var id in this._weapons) {
            list.push($dataWeapons[id]);
        }
        return list;
    };

    armors() {
        var list = [];
        for (var id in this._armors) {
            list.push($dataArmors[id]);
        }
        return list;
    };

    equipItems() {
        return this.weapons().concat(this.armors());
    };

    allItems() {
        return this.items().concat(this.equipItems());
    };

    itemContainer(item) {
        if (!item) {
            return null;
        } else if (DataManager.isItem(item)) {
            return this._items;
        } else if (DataManager.isWeapon(item)) {
            return this._weapons;
        } else if (DataManager.isArmor(item)) {
            return this._armors;
        } else {
            return null;
        }
    };

    setupStartingMembers() {
        this._actors = [];
        $dataSystem.partyMembers.forEach(function (actorId) {
            if ($gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }, this);
    };

    name() {
        var numBattleMembers = this.battleMembers().length;
        if (numBattleMembers === 0) {
            return '';
        } else if (numBattleMembers === 1) {
            return this.leader().name();
        } else {
            return TextManager.partyName.format(this.leader().name());
        }
    };

    setupBattleTest() {
        this.setupBattleTestMembers();
        this.setupBattleTestItems();
    };

    setupBattleTestMembers() {
        $dataSystem.testBattlers.forEach(function (battler) {
            var actor = $gameActors.actor(battler.actorId);
            if (actor) {
                actor.changeLevel(battler.level, false);
                actor.initEquips(battler.equips);
                actor.recoverAll();
                this.addActor(battler.actorId);
            }
        }, this);
    };

    setupBattleTestItems() {
        $dataItems.forEach(function (item) {
            if (item && item.name.length > 0) {
                this.gainItem(item, this.maxItems(item));
            }
        }, this);
    };

    highestLevel() {
        return Math.max.apply(null, this.members().map(function (actor) {
            return actor.level;
        }));
    };

    addActor(actorId: number) {
        if (!this._actors.contains(actorId)) {
            this._actors.push(actorId);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    };

    removeActor(actorId: number) {
        if (this._actors.contains(actorId)) {
            this._actors.splice(this._actors.indexOf(actorId), 1);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    };

    gold(): number {
        return this._gold;
    };

    gainGold(amount: number) {
        this._gold = (this._gold + amount).clamp(0, this.maxGold());
    };

    loseGold(amount: number) {
        this.gainGold(-amount);
    };

    maxGold(): number {
        return 99999999;
    };

    steps(): number {
        return this._steps;
    };

    increaseSteps() {
        this._steps++;
    };

    numItems(item) {
        var container = this.itemContainer(item);
        return container ? container[item.id] || 0 : 0;
    };

    maxItems(item): number {
        return 99;
    };

    hasMaxItems(item) {
        return this.numItems(item) >= this.maxItems(item);
    };

    hasItem(item, includeEquip) {
        if (includeEquip === undefined) {
            includeEquip = false;
        }
        if (this.numItems(item) > 0) {
            return true;
        } else if (includeEquip && this.isAnyMemberEquipped(item)) {
            return true;
        } else {
            return false;
        }
    };

    isAnyMemberEquipped(item) {
        return this.members().some(function (actor) {
            return actor.equips().contains(item);
        });
    };

    gainItem(item, amount: number, includeEquip) {
        var container = this.itemContainer(item);
        if (container) {
            var lastNumber = this.numItems(item);
            var newNumber = lastNumber + amount;
            container[item.id] = newNumber.clamp(0, this.maxItems(item));
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item, -newNumber);
            }
            $gameMap.requestRefresh();
        }
    };

    discardMembersEquip(item, amount: number) {
        var n = amount;
        this.members().forEach(function (actor) {
            while (n > 0 && actor.isEquipped(item)) {
                actor.discardEquip(item);
                n--;
            }
        });
    };

    loseItem(item, amount: number, includeEquip?) {
        this.gainItem(item, -amount, includeEquip);
    };

    consumeItem(item) {
        if (DataManager.isItem(item) && item.consumable) {
            this.loseItem(item, 1);
        }
    };

    canUse(item) {
        return this.members().some(function (actor) {
            return actor.canUse(item);
        });
    };

    canInput() {
        return this.members().some(function (actor) {
            return actor.canInput();
        });
    };

    isAllDead() {
        if (super.isAllDead()) {
            return this.inBattle() || !this.isEmpty();
        } else {
            return false;
        }
    };

    onPlayerWalk() {
        this.members().forEach(function (actor) {
            return actor.onPlayerWalk();
        });
    };

    menuActor() {
        var actor = $gameActors.actor(this._menuActorId);
        if (!this.members().contains(actor)) {
            actor = this.members()[0];
        }
        return actor;
    };

    setMenuActor(actor) {
        this._menuActorId = actor.actorId();
    };

    makeMenuActorNext() {
        var index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    };

    makeMenuActorPrevious() {
        var index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + this.members().length - 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    };

    targetActor() {
        var actor = $gameActors.actor(this._targetActorId);
        if (!this.members().contains(actor)) {
            actor = this.members()[0];
        }
        return actor;
    };

    setTargetActor(actor) {
        this._targetActorId = actor.actorId();
    };

    lastItem() {
        return this._lastItem.object();
    };

    setLastItem(item) {
        this._lastItem.setObject(item);
    };

    swapOrder(index1: number, index2: number) {
        var temp = this._actors[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        $gamePlayer.refresh();
    };

    charactersForSavefile() {
        return this.battleMembers().map(function (actor) {
            return [actor.characterName(), actor.characterIndex()];
        });
    };

    facesForSavefile() {
        return this.battleMembers().map(function (actor) {
            return [actor.faceName(), actor.faceIndex()];
        });
    };

    partyAbility(abilityId: number) {
        return this.battleMembers().some(function (actor) {
            return actor.partyAbility(abilityId);
        });
    };

    hasEncounterHalf() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
    };

    hasEncounterNone() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
    };

    hasCancelSurprise() {
        return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
    };

    hasRaisePreemptive() {
        return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
    };

    hasGoldDouble() {
        return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
    };

    hasDropItemDouble() {
        return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
    };

    ratePreemptive(troopAgi: number) {
        var rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    };

    rateSurprise(troopAgi: number) {
        var rate = this.agility() >= troopAgi ? 0.03 : 0.05;
        if (this.hasCancelSurprise()) {
            rate = 0;
        }
        return rate;
    };

    performVictory() {
        this.members().forEach(function (actor) {
            actor.performVictory();
        });
    };

    performEscape() {
        this.members().forEach(function (actor) {
            actor.performEscape();
        });
    };

    removeBattleStates() {
        this.members().forEach(function (actor) {
            actor.removeBattleStates();
        });
    };

    requestMotionRefresh() {
        this.members().forEach(function (actor) {
            actor.requestMotionRefresh();
        });
    };

}

