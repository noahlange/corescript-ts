//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

class Game_Actor extends Game_Battler {
    protected _actorId: number;
    protected _name: string;
    protected _nickname: string;
    protected _classId: number;
    protected _level: number;
    protected _characterName: string;
    protected _characterIndex: number;
    protected _faceName: string;
    protected _faceIndex: number;
    protected _battlerName: string;
    protected _exp: NumberMap;
    protected _skills: number[];
    protected _equips: any[];
    protected _actionInputIndex: number;
    protected _lastMenuSkill: Game_Item;
    protected _lastBattleSkill: Game_Item;
    protected _lastCommandSymbol: string;
    protected _profile: string;
    protected _stateSteps: NumberMap;

    get level(): number {
        return this._level;
    }

    constructor(actorId: number) {
        super();
        this.setup(actorId);
    };

    initMembers() {
        super.initMembers();
        this._actorId = 0;
        this._name = '';
        this._nickname = '';
        this._classId = 0;
        this._level = 0;
        this._characterName = '';
        this._characterIndex = 0;
        this._faceName = '';
        this._faceIndex = 0;
        this._battlerName = '';
        this._exp = {};
        this._skills = [];
        this._equips = [];
        this._actionInputIndex = 0;
        this._lastMenuSkill = new Game_Item();
        this._lastBattleSkill = new Game_Item();
        this._lastCommandSymbol = '';
    };

    setup(actorId: number) {
        const actor = $dataActors[actorId];
        this._actorId = actorId;
        this._name = actor.name;
        this._nickname = actor.nickname;
        this._profile = actor.profile;
        this._classId = actor.classId;
        this._level = actor.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor.equips);
        this.clearParamPlus();
        this.recoverAll();
    };

    actorId(): number {
        return this._actorId;
    };

    actor() {
        return $dataActors[this._actorId];
    };

    name() {
        return this._name;
    };

    setName(name: string) {
        this._name = name;
    };

    nickname() {
        return this._nickname;
    };

    setNickname(nickname: string) {
        this._nickname = nickname;
    };

    profile(): string {
        return this._profile;
    };

    setProfile(profile: string) {
        this._profile = profile;
    };

    characterName(): string {
        return this._characterName;
    };

    characterIndex() {
        return this._characterIndex;
    };

    faceName(): string {
        return this._faceName;
    };

    faceIndex() {
        return this._faceIndex;
    };

    battlerName(): string {
        return this._battlerName;
    };

    clearStates() {
        super.clearStates();
        this._stateSteps = {};
    };

    eraseState(stateId: number) {
        super.eraseState(stateId);
        delete this._stateSteps[stateId];
    };

    resetStateCounts(stateId: number) {
        super.resetStateCounts(stateId);
        this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
    };

    initImages() {
        const actor = this.actor();
        this._characterName = actor.characterName;
        this._characterIndex = actor.characterIndex;
        this._faceName = actor.faceName;
        this._faceIndex = actor.faceIndex;
        this._battlerName = actor.battlerName;
    };

    expForLevel(level: number) {
        const c = this.currentClass();
        const basis = c.expParams[0];
        const extra = c.expParams[1];
        const acc_a = c.expParams[2];
        const acc_b = c.expParams[3];
        return Math.round(basis * (Math.pow(level - 1, 0.9 + acc_a / 250)) * level *
            (level + 1) / (6 + Math.pow(level, 2) / 50 / acc_b) + (level - 1) * extra);
    };

    initExp() {
        this._exp[this._classId] = this.currentLevelExp();
    };

    currentExp() {
        return this._exp[this._classId];
    };

    currentLevelExp() {
        return this.expForLevel(this._level);
    };

    nextLevelExp() {
        return this.expForLevel(this._level + 1);
    };

    nextRequiredExp() {
        return this.nextLevelExp() - this.currentExp();
    };

    maxLevel() {
        return this.actor().maxLevel;
    };

    isMaxLevel() {
        return this._level >= this.maxLevel();
    };

    initSkills() {
        this._skills = [];
        this.currentClass().learnings.forEach(function (learning) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    };

    initEquips(equips: any[]) {
        const slots = this.equipSlots();
        const maxSlots = slots.length;
        this._equips = [];
        for (let i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (let j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    };

    equipSlots() {
        const slots = [];
        for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
            slots.push(i);
        }
        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }
        return slots;
    };

    equips() {
        return this._equips.map(function (item) {
            return item.object();
        });
    };

    weapons(): DB.Weapon[] {
        return this.equips().filter(function (item) {
            return item && DataManager.isWeapon(item);
        });
    };

    armors(): DB.Armor[] {
        return this.equips().filter(function (item) {
            return item && DataManager.isArmor(item);
        });
    };

    hasWeapon(weapon: DB.Weapon) {
        return this.weapons().contains(weapon);
    };

    hasArmor(armor: DB.Armor) {
        return this.armors().contains(armor);
    };

    isEquipChangeOk(slotId: number) {
        return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId]));
    };

    changeEquip(slotId: number, item: DB.Weapon | DB.Armor) {
        if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    };

    forceChangeEquip(slotId: number, item: DB.Weapon | DB.Armor) {
        this._equips[slotId].setObject(item);
        this.releaseUnequippableItems(true);
        this.refresh();
    };

    tradeItemWithParty(newItem: DB.Weapon | DB.Armor | DB.Item, oldItem: DB.Weapon | DB.Armor | DB.Item) {
        if (newItem && !$gameParty.hasItem(newItem)) {
            return false;
        } else {
            $gameParty.gainItem(oldItem, 1);
            $gameParty.loseItem(newItem, 1);
            return true;
        }
    };

    changeEquipById(etypeId: number, itemId: number) {
        const slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            this.changeEquip(slotId, $dataWeapons[itemId]);
        } else {
            this.changeEquip(slotId, $dataArmors[itemId]);
        }
    };

    isEquipped(item: DB.Weapon | DB.Armor) {
        return this.equips().contains(item);
    };

    discardEquip(item: DB.Weapon | DB.Item | DB.Armor) {
        const slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this._equips[slotId].setObject(null);
        }
    };

    releaseUnequippableItems(forcing: boolean) {
        for (; ;) {
            const slots = this.equipSlots();
            const equips = this.equips();
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    };

    clearEquipments() {
        const maxSlots = this.equipSlots().length;
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    };

    optimizeEquipments() {
        const maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    };

    bestEquipItem(slotId: number) {
        const etypeId = this.equipSlots()[slotId];
        const items = $gameParty.equipItems().filter(function (item) {
            return item.etypeId === etypeId && this.canEquip(item);
        }, this);
        let bestItem = null;
        let bestPerformance = -1000;
        for (let i = 0; i < items.length; i++) {
            const performance = this.calcEquipItemPerformance(items[i]);
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestItem = items[i];
            }
        }
        return bestItem;
    };

    calcEquipItemPerformance(item: DB.Armor | DB.Weapon) {
        return item.params.reduce(function (a, b) {
            return a + b;
        });
    };

    isSkillWtypeOk(skill: any): skill is DB.Skill {
        const wtypeId1 = skill.requiredWtypeId1;
        const wtypeId2 = skill.requiredWtypeId2;
        if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
            return true;
        } else {
            return false;
        }
    };

    isWtypeEquipped(wtypeId: number) {
        return this.weapons().some(function (weapon) {
            return weapon.wtypeId === wtypeId;
        });
    };

    refresh() {
        this.releaseUnequippableItems(false);
        super.refresh();
    };

    isActor(): this is Game_Actor {
        return true;
    };

    friendsUnit() {
        return $gameParty;
    };

    opponentsUnit() {
        return $gameTroop;
    };

    index() {
        return $gameParty.members().indexOf(this);
    };

    isBattleMember() {
        return $gameParty.battleMembers().contains(this);
    };

    isFormationChangeOk() {
        return true;
    };

    currentClass() {
        return $dataClasses[this._classId];
    };

    isClass(gameClass: DB.Class) {
        return gameClass && this._classId === gameClass.id;
    };

    skills(): DB.Skill[] {
        const list: DB.Skill[] = [];
        this._skills.concat(this.addedSkills()).forEach(function (id) {
            if (!list.contains($dataSkills[id])) {
                list.push($dataSkills[id]);
            }
        });
        return list;
    };

    usableSkills(): DB.Skill[] {
        return this.skills().filter(function (skill) {
            return this.canUse(skill);
        }, this);
    };

    traitObjects() {
        let objects = super.traitObjects();
        objects = objects.concat(
            [this.actor(), this.currentClass()] as any
        );
        const equips = this.equips();
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item) {
                objects.push(item);
            }
        }
        return objects;
    };

    attackElements() {
        const set = super.attackElements();
        if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
            set.push(this.bareHandsElementId());
        }
        return set;
    };

    hasNoWeapons() {
        return this.weapons().length === 0;
    };

    bareHandsElementId(): number {
        return 1;
    };

    paramMax(paramId: number) {
        if (paramId === 0) {
            return 9999;    // MHP
        }
        return super.paramMax(paramId);
    };

    paramBase(paramId: number) {
        return this.currentClass().params[paramId][this._level];
    };

    paramPlus(paramId: number) {
        let value = super.paramPlus(paramId);
        const equips = this.equips();
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item) {
                value += item.params[paramId];
            }
        }
        return value;
    };

    attackAnimationId1(): number {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        } else {
            const weapons = this.weapons();
            return weapons[0] ? weapons[0].animationId : 0;
        }
    };

    attackAnimationId2(): number {
        const weapons = this.weapons();
        return weapons[1] ? weapons[1].animationId : 0;
    };

    bareHandsAnimationId() {
        return 1;
    };

    changeExp(exp: number, show: boolean) {
        this._exp[this._classId] = Math.max(exp, 0);
        const lastLevel = this._level;
        const lastSkills = this.skills();
        while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
            this.levelUp();
        }
        while (this.currentExp() < this.currentLevelExp()) {
            this.levelDown();
        }
        if (show && this._level > lastLevel) {
            this.displayLevelUp(this.findNewSkills(lastSkills));
        }
        this.refresh();
    };

    levelUp() {
        this._level++;
        this.currentClass().learnings.forEach(function (learning) {
            if (learning.level === this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    };

    levelDown() {
        this._level--;
    };

    findNewSkills(lastSkills: DB.Skill[]) {
        const newSkills = this.skills();
        for (let i = 0; i < lastSkills.length; i++) {
            const index = newSkills.indexOf(lastSkills[i]);
            if (index >= 0) {
                newSkills.splice(index, 1);
            }
        }
        return newSkills;
    };

    displayLevelUp(newSkills: DB.Skill[]) {
        const text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
        $gameMessage.newPage();
        $gameMessage.add(text);
        newSkills.forEach(function (skill) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        });
    };

    gainExp(exp: number) {
        const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
        this.changeExp(newExp, this.shouldDisplayLevelUp());
    };

    finalExpRate(): number {
        return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
    };

    benchMembersExpRate(): number {
        return $dataSystem.optExtraExp ? 1 : 0;
    };

    shouldDisplayLevelUp() {
        return true;
    };

    changeLevel(level: number, show: boolean) {
        level = level.clamp(1, this.maxLevel());
        this.changeExp(this.expForLevel(level), show);
    };

    learnSkill(skillId: number) {
        if (!this.isLearnedSkill(skillId)) {
            this._skills.push(skillId);
            this._skills.sort(function (a, b) {
                return a - b;
            });
        }
    };

    forgetSkill(skillId: number) {
        const index = this._skills.indexOf(skillId);
        if (index >= 0) {
            this._skills.splice(index, 1);
        }
    };

    isLearnedSkill(skillId: number) {
        return this._skills.contains(skillId);
    };

    hasSkill(skillId: number) {
        return this.skills().contains($dataSkills[skillId]);
    };

    changeClass(classId: number, keepExp: boolean) {
        if (keepExp) {
            this._exp[classId] = this.currentExp();
        }
        this._classId = classId;
        this.changeExp(this._exp[this._classId] || 0, false);
        this.refresh();
    };

    setCharacterImage(characterName: string, characterIndex: number) {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    };

    setFaceImage(faceName: string, faceIndex: number) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    };

    setBattlerImage(battlerName: string) {
        this._battlerName = battlerName;
    };

    isSpriteVisible() {
        return $gameSystem.isSideView();
    };

    startAnimation(animationId: number, mirror: boolean, delay: number) {
        mirror = !mirror;
        super.startAnimation(animationId, mirror, delay);
    };

    performAction(action: Game_Action) {
        super.performAction(action);
        if (action.isAttack()) {
            this.performAttack();
        } else if (action.isGuard()) {
            this.requestMotion('guard');
        } else if (action.isMagicSkill()) {
            this.requestMotion('spell');
        } else if (action.isSkill()) {
            this.requestMotion('skill');
        } else if (action.isItem()) {
            this.requestMotion('item');
        }
    };

    performAttack() {
        const weapons = this.weapons();
        const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        const attackMotion = $dataSystem.attackMotions[wtypeId];
        if (attackMotion) {
            if (attackMotion.type === 0) {
                this.requestMotion('thrust');
            } else if (attackMotion.type === 1) {
                this.requestMotion('swing');
            } else if (attackMotion.type === 2) {
                this.requestMotion('missile');
            }
            this.startWeaponAnimation(attackMotion.weaponImageId);
        }
    };

    performDamage() {
        super.performDamage();
        if (this.isSpriteVisible()) {
            this.requestMotion('damage');
        } else {
            $gameScreen.startShake(5, 5, 10);
        }
        SoundManager.playActorDamage();
    };

    performEvasion() {
        super.performEvasion();
        this.requestMotion('evade');
    };

    performMagicEvasion() {
        super.performMagicEvasion();
        this.requestMotion('evade');
    };

    performCounter() {
        super.performCounter();
        this.performAttack();
    };

    performCollapse() {
        super.performCollapse();
        if ($gameParty.inBattle()) {
            SoundManager.playActorCollapse();
        }
    };

    performVictory() {
        if (this.canMove()) {
            this.requestMotion('victory');
        }
    };

    performEscape() {
        if (this.canMove()) {
            this.requestMotion('escape');
        }
    };

    makeActionList(): Game_Action[] {
        const list: Game_Action[] = [];
        let action = new Game_Action(this);
        action.setAttack();
        list.push(action);
        this.usableSkills().forEach(function (skill) {
            action = new Game_Action(this);
            action.setSkill(skill.id);
            list.push(action);
        }, this);
        return list;
    };

    makeAutoBattleActions() {
        for (let i = 0; i < this.numActions(); i++) {
            const list = this.makeActionList();
            let maxValue = Number.MIN_VALUE;
            for (let j = 0; j < list.length; j++) {
                const value = list[j].evaluate();
                if (value > maxValue) {
                    maxValue = value;
                    this.setAction(i, list[j]);
                }
            }
        }
        this.setActionState('waiting');
    };

    makeConfusionActions() {
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setConfusion();
        }
        this.setActionState('waiting');
    };

    makeActions() {
        super.makeActions();
        if (this.numActions() > 0) {
            this.setActionState('undecided');
        } else {
            this.setActionState('waiting');
        }
        if (this.isAutoBattle()) {
            this.makeAutoBattleActions();
        } else if (this.isConfused()) {
            this.makeConfusionActions();
        }
    };

    onPlayerWalk() {
        this.clearResult();
        this.checkFloorEffect();
        if ($gamePlayer.isNormal()) {
            this.turnEndOnMap();
            this.states().forEach(function (state) {
                this.updateStateSteps(state);
            }, this);
            this.showAddedStates();
            this.showRemovedStates();
        }
    };

    updateStateSteps(state: DB.State) {
        if (state.removeByWalking) {
            if (this._stateSteps[state.id] > 0) {
                if (--this._stateSteps[state.id] === 0) {
                    this.removeState(state.id);
                }
            }
        }
    };

    showAddedStates() {
        this.result().addedStateObjects().forEach(function (state) {
            if (state.message1) {
                $gameMessage.add(this._name + state.message1);
            }
        }, this);
    };

    showRemovedStates() {
        this.result().removedStateObjects().forEach(function (state) {
            if (state.message4) {
                $gameMessage.add(this._name + state.message4);
            }
        }, this);
    };

    stepsForTurn() {
        return 20;
    };

    turnEndOnMap() {
        if ($gameParty.steps() % this.stepsForTurn() === 0) {
            this.onTurnEnd();
            if (this.result().hpDamage > 0) {
                this.performMapDamage();
            }
        }
    };

    checkFloorEffect() {
        if ($gamePlayer.isOnDamageFloor()) {
            this.executeFloorDamage();
        }
    };

    executeFloorDamage() {
        let damage = Math.floor(this.basicFloorDamage() * this.fdr);
        damage = Math.min(damage, this.maxFloorDamage());
        this.gainHp(-damage);
        if (damage > 0) {
            this.performMapDamage();
        }
    };

    basicFloorDamage() {
        return 10;
    };

    maxFloorDamage() {
        return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
    };

    performMapDamage() {
        if (!$gameParty.inBattle()) {
            $gameScreen.startFlashForDamage();
        }
    };

    clearActions() {
        super.clearActions();
        this._actionInputIndex = 0;
    };

    inputtingAction() {
        return this.action(this._actionInputIndex);
    };

    selectNextCommand() {
        if (this._actionInputIndex < this.numActions() - 1) {
            this._actionInputIndex++;
            return true;
        } else {
            return false;
        }
    };

    selectPreviousCommand() {
        if (this._actionInputIndex > 0) {
            this._actionInputIndex--;
            return true;
        } else {
            return false;
        }
    };

    lastMenuSkill() {
        return this._lastMenuSkill.object() as DB.Skill;
    };

    setLastMenuSkill(skill: DB.Skill) {
        this._lastMenuSkill.setObject(skill);
    };

    lastBattleSkill(): DB.Skill {
        return this._lastBattleSkill.object() as DB.Skill;
    };

    setLastBattleSkill(skill: DB.Skill) {
        this._lastBattleSkill.setObject(skill);
    };

    lastCommandSymbol(): string {
        return this._lastCommandSymbol;
    };

    setLastCommandSymbol(symbol: string) {
        this._lastCommandSymbol = symbol;
    };

    testEscape(item: DB.Item) {
        return item.effects.some(function (effect, index, ar) {
            return effect && effect.code === ActionEffect.SPECIAL;
        });
    };

    meetsUsableItemConditions(item: DB.Item) {
        if ($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)) {
            return false;
        }
        return super.meetsUsableItemConditions(item);
    };

}
