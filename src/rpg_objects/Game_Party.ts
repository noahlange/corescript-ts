import $ from '$';
import { DataManager, TextManager } from 'rpg_managers';

import Game_Actor from './Game_Actor';
import { NumberMap } from './Game_BattlerBase';
import Game_Unit from './Game_Unit';
import Game_Item from './Game_Item';
//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

enum PartyAbility {
    ENCOUNTER_HALF = 0,
    ENCOUNTER_NONE = 1,
    CANCEL_SURPRISE = 2,
    RAISE_PREEMPTIVE = 3,
    GOLD_DOUBLE = 4,
    DROP_ITEM_DOUBLE = 5,
}

export default class Game_Party extends Game_Unit<Game_Actor> {

    protected _gold: number = 0;
    protected _steps: number = 0;
    protected _lastItem: Game_Item = new Game_Item();
    protected _menuActorId: number = 0;
    protected _targetActorId: number = 0;
    protected _actors: number[] = [];
    protected _items: NumberMap = {};
    protected _weapons: NumberMap = {};
    protected _armors: NumberMap = {};


    exists() {
        return this._actors.length > 0;
    };

    size(): number {
        return this.members().length;
    };

    isEmpty() {
        return this.size() === 0;
    };

    members(): Game_Actor[] {
        return this.inBattle() ? 
            this.battleMembers(): 
            this.allMembers();
    };

    allMembers(): Game_Actor[] {
        return this._actors.map(function (id) {
            return $.gameActors.actor(id);
        });
    };

    battleMembers(): Game_Actor[] {
        return this.allMembers().slice(0, this.maxBattleMembers()).filter(function (actor) {
            return actor.isAppeared();
        });
    };

    maxBattleMembers(): number {
        return 4;
    };

    leader(): Game_Actor {
        return this.battleMembers()[0];
    };

    reviveBattleMembers() {
        this.battleMembers().forEach(function (actor) {
            if (actor.isDead()) {
                actor.setHp(1);
            }
        });
    };

    items(): DB.Item[] {
        const list = [];
        for (let id in this._items) {
            list.push($.dataItems[id]);
        }
        return list;
    };

    weapons(): DB.Weapon[] {
        const list = [];
        for (let id in this._weapons) {
            list.push($.dataWeapons[id]);
        }
        return list;
    };

    armors(): DB.Armor[] {
        const list = [];
        for (let id in this._armors) {
            list.push($.dataArmors[id]);
        }
        return list;
    };

    equipItems(): (DB.Weapon | DB.Armor)[] {
        const armors = this.armors() as object[];
        const weapons = this.weapons() as object[];
        return weapons.concat(armors) as (DB.Weapon | DB.Armor)[];
    };

    allItems(): DB.Item[] {
        const equips = this.equipItems() as object[];
        const items = this.items() as object[];
        return items.concat(equips) as DB.Item[];
    };

    itemContainer(item: Object) {
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
        $.dataSystem.partyMembers.forEach(function (actorId) {
            if ($.gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }, this);
    };

    name() {
        const numBattleMembers = this.battleMembers().length;
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
        $.dataSystem.testBattlers.forEach(function (battler) {
            const actor = $.gameActors.actor(battler.actorId);
            if (actor) {
                actor.changeLevel(battler.level, false);
                actor.initEquips(battler.equips);
                actor.recoverAll();
                this.addActor(battler.actorId);
            }
        }, this);
    };

    setupBattleTestItems() {
        $.dataItems.forEach(function (item) {
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
            $.gamePlayer.refresh();
            $.gameMap.requestRefresh();
        }
    };

    removeActor(actorId: number) {
        if (this._actors.contains(actorId)) {
            this._actors.splice(this._actors.indexOf(actorId), 1);
            $.gamePlayer.refresh();
            $.gameMap.requestRefresh();
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

    numItems(item: DB.Item | DB.Weapon | DB.Armor): number {
        const container = this.itemContainer(item);
        return container ? container[item.id] || 0 : 0;
    };

    maxItems(item: DB.Item | DB.Weapon | DB.Armor): number {
        return 99;
    };

    hasMaxItems(item: DB.Item | DB.Weapon | DB.Armor) {
        return this.numItems(item) >= this.maxItems(item);
    };

    hasItem(item: DB.Item | DB.Weapon | DB.Armor, includeEquip: boolean = false) {
        if (this.numItems(item) > 0) {
            return true;
        } else if (includeEquip && this.isAnyMemberEquipped(item as DB.Weapon)) {
            return true;
        } else {
            return false;
        }
    };

    isAnyMemberEquipped(item: DB.Armor | DB.Weapon) {
        return this.members().some(function (actor) {
            return actor.equips().contains(item);
        });
    };

    gainItem(item: DB.Item | DB.Weapon | DB.Armor, amount: number, includeEquip: boolean = false) {
        const container = this.itemContainer(item);
        if (container) {
            const lastNumber = this.numItems(item);
            const newNumber = lastNumber + amount;
            container[item.id] = newNumber.clamp(0, this.maxItems(item));
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item as DB.Armor, -newNumber);
            }
            $.gameMap.requestRefresh();
        }
    };

    discardMembersEquip(item: DB.Armor | DB.Weapon, amount: number) {
        let n = amount;
        this.members().forEach(function (actor) {
            while (n > 0 && actor.isEquipped(item)) {
                actor.discardEquip(item);
                n--;
            }
        });
    };

    loseItem(item: DB.Item | DB.Weapon | DB.Armor, amount: number, includeEquip?: boolean) {
        this.gainItem(item, -amount, includeEquip);
    };

    consumeItem(item: DB.Item | DB.Weapon | DB.Armor) {
        if (DataManager.isItem(item) && item.consumable) {
            this.loseItem(item, 1);
        }
    };

    canUse(item: Object) {
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
        let actor = $.gameActors.actor(this._menuActorId);
        if (!this.members().contains(actor)) {
            actor = this.members()[0];
        }
        return actor;
    };

    setMenuActor(actor: Game_Actor) {
        this._menuActorId = actor.actorId();
    };

    makeMenuActorNext() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    };

    makeMenuActorPrevious() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + this.members().length - 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    };

    targetActor() {
        let actor = $.gameActors.actor(this._targetActorId);
        if (!this.members().contains(actor)) {
            actor = this.members()[0];
        }
        return actor;
    };

    setTargetActor(actor: Game_Actor) {
        this._targetActorId = actor.actorId();
    };

    lastItem() {
        return this._lastItem.object();
    };

    setLastItem(item: DB.Item | DB.Weapon | DB.Armor) {
        this._lastItem.setObject(item);
    };

    swapOrder(index1: number, index2: number) {
        const temp = this._actors[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        $.gamePlayer.refresh();
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
        return this.partyAbility(PartyAbility.ENCOUNTER_HALF);
    };

    hasEncounterNone() {
        return this.partyAbility(PartyAbility.ENCOUNTER_NONE);
    };

    hasCancelSurprise() {
        return this.partyAbility(PartyAbility.CANCEL_SURPRISE);
    };

    hasRaisePreemptive() {
        return this.partyAbility(PartyAbility.RAISE_PREEMPTIVE);
    };

    hasGoldDouble() {
        return this.partyAbility(PartyAbility.GOLD_DOUBLE);
    };

    hasDropItemDouble() {
        return this.partyAbility(PartyAbility.DROP_ITEM_DOUBLE);
    };

    ratePreemptive(troopAgi: number): number {
        let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    };

    rateSurprise(troopAgi: number): number {
        let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
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

