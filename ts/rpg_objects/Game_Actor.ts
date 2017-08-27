//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

class Game_Actor extends Game_Battler {
    protected _actorId;
    protected _name;
    protected _nickname;
    protected _classId;
    protected _level;
    protected _characterName;
    protected _characterIndex;
    protected _faceName;
    protected _faceIndex;
    protected _battlerName;
    protected _exp;
    protected _skills;
    protected _equips;
    protected _actionInputIndex;
    protected _lastMenuSkill;
    protected _lastBattleSkill;
    protected _lastCommandSymbol;
    protected _profile;
    protected _stateSteps;

    get level() {
        return this._level;
    }
    
    constructor(actorId) {
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
        this._lastBattleSkill  = new Game_Item();
        this._lastCommandSymbol = '';
    };
    
    setup(actorId) {
        var actor = $dataActors[actorId];
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
    
    actorId() {
        return this._actorId;
    };
    
    actor() {
        return $dataActors[this._actorId];
    };
    
    name() {
        return this._name;
    };
    
    setName(name) {
        this._name = name;
    };
    
    nickname() {
        return this._nickname;
    };
    
    setNickname(nickname) {
        this._nickname = nickname;
    };
    
    profile() {
        return this._profile;
    };
    
    setProfile(profile) {
        this._profile = profile;
    };
    
    characterName() {
        return this._characterName;
    };
    
    characterIndex() {
        return this._characterIndex;
    };
    
    faceName() {
        return this._faceName;
    };
    
    faceIndex() {
        return this._faceIndex;
    };
    
    battlerName() {
        return this._battlerName;
    };
    
    clearStates() {
        Game_Battler.prototype.clearStates.call(this);
        this._stateSteps = {};
    };
    
    eraseState(stateId) {
        Game_Battler.prototype.eraseState.call(this, stateId);
        delete this._stateSteps[stateId];
    };
    
    resetStateCounts(stateId) {
        Game_Battler.prototype.resetStateCounts.call(this, stateId);
        this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
    };
    
    initImages() {
        var actor = this.actor();
        this._characterName = actor.characterName;
        this._characterIndex = actor.characterIndex;
        this._faceName = actor.faceName;
        this._faceIndex = actor.faceIndex;
        this._battlerName = actor.battlerName;
    };
    
    expForLevel(level) {
        var c = this.currentClass();
        var basis = c.expParams[0];
        var extra = c.expParams[1];
        var acc_a = c.expParams[2];
        var acc_b = c.expParams[3];
        return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
                (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
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
        this.currentClass().learnings.forEach(function(learning) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    };
    
    initEquips(equips) {
        var slots = this.equipSlots();
        var maxSlots = slots.length;
        this._equips = [];
        for (var i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (var j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    };
    
    equipSlots() {
        var slots = [];
        for (var i = 1; i < $dataSystem.equipTypes.length; i++) {
            slots.push(i);
        }
        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }
        return slots;
    };
    
    equips() {
        return this._equips.map(function(item) {
            return item.object();
        });
    };
    
    weapons() {
        return this.equips().filter(function(item) {
            return item && DataManager.isWeapon(item);
        });
    };
    
    armors() {
        return this.equips().filter(function(item) {
            return item && DataManager.isArmor(item);
        });
    };
    
    hasWeapon(weapon) {
        return this.weapons().contains(weapon);
    };
    
    hasArmor(armor) {
        return this.armors().contains(armor);
    };
    
    isEquipChangeOk(slotId) {
        return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
                !this.isEquipTypeSealed(this.equipSlots()[slotId]));
    };
    
    changeEquip(slotId, item) {
        if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
                (!item || this.equipSlots()[slotId] === item.etypeId)) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    };
    
    forceChangeEquip(slotId, item) {
        this._equips[slotId].setObject(item);
        this.releaseUnequippableItems(true);
        this.refresh();
    };
    
    tradeItemWithParty(newItem, oldItem) {
        if (newItem && !$gameParty.hasItem(newItem)) {
            return false;
        } else {
            $gameParty.gainItem(oldItem, 1);
            $gameParty.loseItem(newItem, 1);
            return true;
        }
    };
    
    changeEquipById(etypeId, itemId) {
        var slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            this.changeEquip(slotId, $dataWeapons[itemId]);
        } else {
            this.changeEquip(slotId, $dataArmors[itemId]);
        }
    };
    
    isEquipped(item) {
        return this.equips().contains(item);
    };
    
    discardEquip(item) {
        var slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this._equips[slotId].setObject(null);
        }
    };
    
    releaseUnequippableItems(forcing) {
        for (;;) {
            var slots = this.equipSlots();
            var equips = this.equips();
            var changed = false;
            for (var i = 0; i < equips.length; i++) {
                var item = equips[i];
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
        var maxSlots = this.equipSlots().length;
        for (var i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    };
    
    optimizeEquipments() {
        var maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (var i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    };
    
    bestEquipItem(slotId) {
        var etypeId = this.equipSlots()[slotId];
        var items = $gameParty.equipItems().filter(function(item) {
            return item.etypeId === etypeId && this.canEquip(item);
        }, this);
        var bestItem = null;
        var bestPerformance = -1000;
        for (var i = 0; i < items.length; i++) {
            var performance = this.calcEquipItemPerformance(items[i]);
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestItem = items[i];
            }
        }
        return bestItem;
    };
    
    calcEquipItemPerformance(item) {
        return item.params.reduce(function(a, b) {
            return a + b;
        });
    };
    
    isSkillWtypeOk(skill) {
        var wtypeId1 = skill.requiredWtypeId1;
        var wtypeId2 = skill.requiredWtypeId2;
        if ((wtypeId1 === 0 && wtypeId2 === 0) ||
                (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
                (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
            return true;
        } else {
            return false;
        }
    };
    
    isWtypeEquipped(wtypeId) {
        return this.weapons().some(function(weapon) {
            return weapon.wtypeId === wtypeId;
        });
    };
    
    refresh() {
        this.releaseUnequippableItems(false);
        Game_Battler.prototype.refresh.call(this);
    };
    
    isActor() {
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
    
    isClass(gameClass) {
        return gameClass && this._classId === gameClass.id;
    };
    
    skills() {
        var list = [];
        this._skills.concat(this.addedSkills()).forEach(function(id) {
            if (!list.contains($dataSkills[id])) {
                list.push($dataSkills[id]);
            }
        });
        return list;
    };
    
    usableSkills() {
        return this.skills().filter(function(skill) {
            return this.canUse(skill);
        }, this);
    };
    
    traitObjects() {
        var objects = Game_Battler.prototype.traitObjects.call(this);
        objects = objects.concat([this.actor(), this.currentClass()]);
        var equips = this.equips();
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item) {
                objects.push(item);
            }
        }
        return objects;
    };
    
    attackElements() {
        var set = Game_Battler.prototype.attackElements.call(this);
        if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
            set.push(this.bareHandsElementId());
        }
        return set;
    };
    
    hasNoWeapons() {
        return this.weapons().length === 0;
    };
    
    bareHandsElementId() {
        return 1;
    };
    
    paramMax(paramId) {
        if (paramId === 0) {
            return 9999;    // MHP
        }
        return Game_Battler.prototype.paramMax.call(this, paramId);
    };
    
    paramBase(paramId) {
        return this.currentClass().params[paramId][this._level];
    };
    
    paramPlus(paramId) {
        var value = Game_Battler.prototype.paramPlus.call(this, paramId);
        var equips = this.equips();
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item) {
                value += item.params[paramId];
            }
        }
        return value;
    };
    
    attackAnimationId1() {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        } else {
            var weapons = this.weapons();
            return weapons[0] ? weapons[0].animationId : 0;
        }
    };
    
    attackAnimationId2() {
        var weapons = this.weapons();
        return weapons[1] ? weapons[1].animationId : 0;
    };
    
    bareHandsAnimationId() {
        return 1;
    };
    
    changeExp(exp, show) {
        this._exp[this._classId] = Math.max(exp, 0);
        var lastLevel = this._level;
        var lastSkills = this.skills();
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
        this.currentClass().learnings.forEach(function(learning) {
            if (learning.level === this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    };
    
    levelDown() {
        this._level--;
    };
    
    findNewSkills(lastSkills) {
        var newSkills = this.skills();
        for (var i = 0; i < lastSkills.length; i++) {
            var index = newSkills.indexOf(lastSkills[i]);
            if (index >= 0) {
                newSkills.splice(index, 1);
            }
        }
        return newSkills;
    };
    
    displayLevelUp(newSkills) {
        var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
        $gameMessage.newPage();
        $gameMessage.add(text);
        newSkills.forEach(function(skill) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        });
    };
    
    gainExp(exp) {
        var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
        this.changeExp(newExp, this.shouldDisplayLevelUp());
    };
    
    finalExpRate() {
        return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
    };
    
    benchMembersExpRate() {
        return $dataSystem.optExtraExp ? 1 : 0;
    };
    
    shouldDisplayLevelUp() {
        return true;
    };
    
    changeLevel(level, show) {
        level = level.clamp(1, this.maxLevel());
        this.changeExp(this.expForLevel(level), show);
    };
    
    learnSkill(skillId) {
        if (!this.isLearnedSkill(skillId)) {
            this._skills.push(skillId);
            this._skills.sort(function(a, b) {
                return a - b;
            });
        }
    };
    
    forgetSkill(skillId) {
        var index = this._skills.indexOf(skillId);
        if (index >= 0) {
            this._skills.splice(index, 1);
        }
    };
    
    isLearnedSkill(skillId) {
        return this._skills.contains(skillId);
    };
    
    hasSkill(skillId) {
        return this.skills().contains($dataSkills[skillId]);
    };
    
    changeClass(classId, keepExp) {
        if (keepExp) {
            this._exp[classId] = this.currentExp();
        }
        this._classId = classId;
        this.changeExp(this._exp[this._classId] || 0, false);
        this.refresh();
    };
    
    setCharacterImage(characterName, characterIndex) {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    };
    
    setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    };
    
    setBattlerImage(battlerName) {
        this._battlerName = battlerName;
    };
    
    isSpriteVisible() {
        return $gameSystem.isSideView();
    };
    
    startAnimation(animationId, mirror, delay) {
        mirror = !mirror;
        Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay);
    };
    
    performActionStart(action) {
        super.performActionStart(action);
    };
    
    performAction(action) {
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
    
    performActionEnd() {
        Game_Battler.prototype.performActionEnd.call(this);
    };
    
    performAttack() {
        var weapons = this.weapons();
        var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        var attackMotion = $dataSystem.attackMotions[wtypeId];
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
        Game_Battler.prototype.performDamage.call(this);
        if (this.isSpriteVisible()) {
            this.requestMotion('damage');
        } else {
            $gameScreen.startShake(5, 5, 10);
        }
        SoundManager.playActorDamage();
    };
    
    performEvasion() {
        Game_Battler.prototype.performEvasion.call(this);
        this.requestMotion('evade');
    };
    
    performMagicEvasion() {
        Game_Battler.prototype.performMagicEvasion.call(this);
        this.requestMotion('evade');
    };
    
    performCounter() {
        Game_Battler.prototype.performCounter.call(this);
        this.performAttack();
    };
    
    performCollapse() {
        Game_Battler.prototype.performCollapse.call(this);
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
    
    makeActionList() {
        var list = [];
        var action = new Game_Action(this);
        action.setAttack();
        list.push(action);
        this.usableSkills().forEach(function(skill) {
            action = new Game_Action(this);
            action.setSkill(skill.id);
            list.push(action);
        }, this);
        return list;
    };
    
    makeAutoBattleActions() {
        for (var i = 0; i < this.numActions(); i++) {
            var list = this.makeActionList();
            var maxValue = Number.MIN_VALUE;
            for (var j = 0; j < list.length; j++) {
                var value = list[j].evaluate();
                if (value > maxValue) {
                    maxValue = value;
                    this.setAction(i, list[j]);
                }
            }
        }
        this.setActionState('waiting');
    };
    
    makeConfusionActions() {
        for (var i = 0; i < this.numActions(); i++) {
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
            this.states().forEach(function(state) {
                this.updateStateSteps(state);
            }, this);
            this.showAddedStates();
            this.showRemovedStates();
        }
    };
    
    updateStateSteps(state) {
        if (state.removeByWalking) {
            if (this._stateSteps[state.id] > 0) {
                if (--this._stateSteps[state.id] === 0) {
                    this.removeState(state.id);
                }
            }
        }
    };
    
    showAddedStates() {
        this.result().addedStateObjects().forEach(function(state) {
            if (state.message1) {
                $gameMessage.add(this._name + state.message1);
            }
        }, this);
    };
    
    showRemovedStates() {
        this.result().removedStateObjects().forEach(function(state) {
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
        var damage = Math.floor(this.basicFloorDamage() * this.fdr);
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
        return this._lastMenuSkill.object();
    };
    
    setLastMenuSkill(skill) {
        this._lastMenuSkill.setObject(skill);
    };
    
    lastBattleSkill() {
        return this._lastBattleSkill.object();
    };
    
    setLastBattleSkill(skill) {
        this._lastBattleSkill.setObject(skill);
    };
    
    lastCommandSymbol() {
        return this._lastCommandSymbol;
    };
    
    setLastCommandSymbol(symbol) {
        this._lastCommandSymbol = symbol;
    };
    
    testEscape(item) {
        return item.effects.some(function(effect, index, ar) {
            return effect && effect.code === Game_Action.EFFECT_SPECIAL;
        });
    };
    
    meetsUsableItemConditions(item) {
        if ($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)) {
            return false;
        }
        return super.meetsUsableItemConditions(item);
    };
        
}


