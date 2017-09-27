//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.



enum ActionEffect {
    RECOVER_HP = 11,
    RECOVER_MP = 12,
    GAIN_TP = 13,
    ADD_STATE = 21,
    REMOVE_STATE = 22,
    ADD_BUFF = 31,
    ADD_DEBUFF = 32,
    REMOVE_BUFF = 33,
    REMOVE_DEBUFF = 34,
    SPECIAL = 41,
    GROW = 42,
    LEARN_SKILL = 43,
    COMMON_EVENT = 44,
}

enum HitType {
    CERTAIN = 0,
    PHYSICAL = 1,
    MAGICAL = 2,
}


class Game_Action {
    static SPECIAL_EFFECT_ESCAPE = 0;

    protected _subjectActorId: number = 0;
    protected _subjectEnemyIndex: number = -1;
    protected _forcing: boolean;
    protected _item: Game_Item;
    protected _targetIndex: number;

    /// bungcip: used by battle manager
    public _reflectionTarget: Game_Actor | Game_Enemy | null;

    constructor(subject: Game_Battler, forcing: boolean = false) {
        // this._subjectActorId = 0;
        // this._subjectEnemyIndex = -1;
        this._forcing = forcing;
        this.setSubject(subject);
        this.clear();
    };

    clear() {
        this._item = new Game_Item();
        this._targetIndex = -1;
    };

    setSubject(subject: Game_Battler) {
        if (subject.isActor()) {
            this._subjectActorId = subject.actorId();
            this._subjectEnemyIndex = -1;
        } else if (subject.isEnemy()) {
            this._subjectEnemyIndex = subject.index();
            this._subjectActorId = 0;
        }
    };

    subject(): Game_Actor | Game_Enemy {
        if (this._subjectActorId > 0) {
            return $gameActors.actor(this._subjectActorId);
        } else {
            return $gameTroop.members()[this._subjectEnemyIndex];
        }
    };

    friendsUnit() {
        return this.subject().friendsUnit();
    };

    opponentsUnit() {
        return this.subject().opponentsUnit();
    };

    setEnemyAction(action: DB.Action) {
        if (action) {
            this.setSkill(action.skillId);
        } else {
            this.clear();
        }
    };

    setAttack() {
        this.setSkill(this.subject().attackSkillId());
    };

    setGuard() {
        this.setSkill(this.subject().guardSkillId());
    };

    setSkill(skillId: number) {
        this._item.setObject($dataSkills[skillId]);
    };

    setItem(itemId: number) {
        this._item.setObject($dataItems[itemId]);
    };

    setItemObject(object: DB.Item | DB.Skill | DB.Weapon | DB.Armor) {
        this._item.setObject(object);
    };

    setTarget(targetIndex: number) {
        this._targetIndex = targetIndex;
    };

    item() {
        return this._item.object();
    };

    isSkill() {
        return this._item.isSkill();
    };

    isItem() {
        return this._item.isItem();
    };

    numRepeats(): number {
        var repeats = (this.item() as DB.Item).repeats;
        if (this.isAttack()) {
            repeats += this.subject().attackTimesAdd();
        }
        return Math.floor(repeats);
    };

    checkItemScope(list: number[]) {
        let scope = (this.item() as DB.Item).scope;
        return list.contains(scope);
    };

    isForOpponent() {
        return this.checkItemScope([1, 2, 3, 4, 5, 6]);
    };

    isForFriend() {
        return this.checkItemScope([7, 8, 9, 10, 11]);
    };

    isForDeadFriend() {
        return this.checkItemScope([9, 10]);
    };

    isForUser() {
        return this.checkItemScope([11]);
    };

    isForOne() {
        return this.checkItemScope([1, 3, 7, 9, 11]);
    };

    isForRandom() {
        return this.checkItemScope([3, 4, 5, 6]);
    };

    isForAll() {
        return this.checkItemScope([2, 8, 10]);
    };

    needsSelection() {
        return this.checkItemScope([1, 7, 9]);
    };

    numTargets() {
        return this.isForRandom() ? (this.item() as DB.Item).scope - 2 : 0;
    };

    checkDamageType(list: number[]): boolean {
        return list.contains((this.item() as DB.Item).damage.type);
    };

    isHpEffect() {
        return this.checkDamageType([1, 3, 5]);
    };

    isMpEffect() {
        return this.checkDamageType([2, 4, 6]);
    };

    isDamage() {
        return this.checkDamageType([1, 2]);
    };

    isRecover() {
        return this.checkDamageType([3, 4]);
    };

    isDrain() {
        return this.checkDamageType([5, 6]);
    };

    isHpRecover() {
        return this.checkDamageType([3]);
    };

    isMpRecover() {
        return this.checkDamageType([4]);
    };

    isCertainHit() {
        return (this.item() as DB.Item).hitType === HitType.CERTAIN;
    };

    isPhysical() {
        return (this.item() as DB.Item).hitType === HitType.PHYSICAL;
    };

    isMagical() {
        return (this.item() as DB.Item).hitType === HitType.MAGICAL;
    };

    isAttack() {
        return this.item() === $dataSkills[this.subject().attackSkillId()];
    };

    isGuard() {
        return this.item() === $dataSkills[this.subject().guardSkillId()];
    };

    isMagicSkill() {
        if (this.isSkill()) {
            return $dataSystem.magicSkills.contains((this.item() as DB.Skill).stypeId);
        } else {
            return false;
        }
    };

    decideRandomTarget() {
        var target;
        if (this.isForDeadFriend()) {
            target = this.friendsUnit().randomDeadTarget();
        } else if (this.isForFriend()) {
            target = this.friendsUnit().randomTarget();
        } else {
            target = this.opponentsUnit().randomTarget();
        }
        if (target) {
            this._targetIndex = target.index();
        } else {
            this.clear();
        }
    };

    setConfusion() {
        this.setAttack();
    };

    prepare() {
        if (this.subject().isConfused() && !this._forcing) {
            this.setConfusion();
        }
    };

    isValid() {
        return (this._forcing && this.item() !== null) || this.subject().canUse(this.item());
    };

    speed(): number {
        var agi = this.subject().agi;
        var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
        if (this.item()) {
            speed += (this.item() as DB.Item).speed;
        }
        if (this.isAttack()) {
            speed += this.subject().attackSpeed();
        }
        return speed;
    };

    makeTargets() {
        var targets: Game_Battler[] = [];
        if (!this._forcing && this.subject().isConfused()) {
            targets = [this.confusionTarget()];
        } else if (this.isForOpponent()) {
            targets = this.targetsForOpponents();
        } else if (this.isForFriend()) {
            targets = this.targetsForFriends();
        }
        return this.repeatTargets(targets);
    };

    repeatTargets(targets: any[]): any[] {
        var repeatedTargets = [];
        var repeats = this.numRepeats();
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            if (target) {
                for (var j = 0; j < repeats; j++) {
                    repeatedTargets.push(target);
                }
            }
        }
        return repeatedTargets;
    };

    confusionTarget() {
        switch (this.subject().confusionLevel()) {
            case 1:
                return this.opponentsUnit().randomTarget();
            case 2:
                if (Math.randomInt(2) === 0) {
                    return this.opponentsUnit().randomTarget();
                }
                return this.friendsUnit().randomTarget();
            default:
                return this.friendsUnit().randomTarget();
        }
    };

    targetsForOpponents(): Game_Battler[] {
        var targets = [];
        var unit = this.opponentsUnit();
        if (this.isForRandom()) {
            for (var i = 0; i < this.numTargets(); i++) {
                targets.push(unit.randomTarget());
            }
        } else if (this.isForOne()) {
            if (this._targetIndex < 0) {
                targets.push(unit.randomTarget());
            } else {
                targets.push(unit.smoothTarget(this._targetIndex));
            }
        } else {
            targets = unit.aliveMembers();
        }
        return targets;
    };

    targetsForFriends(): Game_Battler[] {
        var targets = [];
        var unit = this.friendsUnit();
        if (this.isForUser()) {
            return [this.subject()];
        } else if (this.isForDeadFriend()) {
            if (this.isForOne()) {
                targets.push(unit.smoothDeadTarget(this._targetIndex));
            } else {
                targets = unit.deadMembers();
            }
        } else if (this.isForOne()) {
            if (this._targetIndex < 0) {
                targets.push(unit.randomTarget());
            } else {
                targets.push(unit.smoothTarget(this._targetIndex));
            }
        } else {
            targets = unit.aliveMembers();
        }
        return targets;
    };

    evaluate() {
        var value = 0;
        this.itemTargetCandidates().forEach(function (target) {
            var targetValue = this.evaluateWithTarget(target);
            if (this.isForAll()) {
                value += targetValue;
            } else if (targetValue > value) {
                value = targetValue;
                this._targetIndex = (target as Game_Actor).index();
            }
        }, this);
        value *= this.numRepeats();
        if (value > 0) {
            value += Math.random();
        }
        return value;
    };

    itemTargetCandidates() {
        if (!this.isValid()) {
            return [];
        } else if (this.isForOpponent()) {
            return this.opponentsUnit().aliveMembers();
        } else if (this.isForUser()) {
            return [this.subject()];
        } else if (this.isForDeadFriend()) {
            return this.friendsUnit().deadMembers();
        } else {
            return this.friendsUnit().aliveMembers();
        }
    };

    evaluateWithTarget(target: Game_Battler) {
        if (this.isHpEffect()) {
            var value = this.makeDamageValue(target, false);
            if (this.isForOpponent()) {
                return value / Math.max(target.hp, 1);
            } else {
                var recovery = Math.min(-value, target.mhp - target.hp);
                return recovery / target.mhp;
            }
        }
    };

    testApply(target: Game_Battler) {
        return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
                (this.isHpRecover() && target.hp < target.mhp) ||
                (this.isMpRecover() && target.mp < target.mmp) ||
                (this.hasItemAnyValidEffects(target))));
    };

    hasItemAnyValidEffects(target: Game_Battler) {
        return (this.item() as DB.Item).effects.some(function (effect) {
            return this.testItemEffect(target, effect);
        }, this);
    };

    testItemEffect(target: Game_Battler, effect: DB.Effect) {
        switch (effect.code) {
            case ActionEffect.RECOVER_HP:
                return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
            case ActionEffect.RECOVER_MP:
                return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
            case ActionEffect.ADD_STATE:
                return !target.isStateAffected(effect.dataId);
            case ActionEffect.REMOVE_STATE:
                return target.isStateAffected(effect.dataId);
            case ActionEffect.ADD_BUFF:
                return !target.isMaxBuffAffected(effect.dataId);
            case ActionEffect.ADD_DEBUFF:
                return !target.isMaxDebuffAffected(effect.dataId);
            case ActionEffect.REMOVE_BUFF:
                return target.isBuffAffected(effect.dataId);
            case ActionEffect.REMOVE_DEBUFF:
                return target.isDebuffAffected(effect.dataId);
            case ActionEffect.LEARN_SKILL:
                return target.isActor() && !target.isLearnedSkill(effect.dataId);
            default:
                return true;
        }
    };

    itemCnt(target: Game_Battler) {
        if (this.isPhysical() && target.canMove()) {
            return target.cnt;
        } else {
            return 0;
        }
    };

    itemMrf(target: Game_Battler) {
        if (this.isMagical()) {
            return target.mrf;
        } else {
            return 0;
        }
    };

    itemHit(target: Game_Battler) {
        if (this.isPhysical()) {
            return (this.item() as DB.Item).successRate * 0.01 * this.subject().hit;
        } else {
            return (this.item() as DB.Item).successRate * 0.01;
        }
    };

    itemEva(target: Game_Battler) {
        if (this.isPhysical()) {
            return target.eva;
        } else if (this.isMagical()) {
            return target.mev;
        } else {
            return 0;
        }
    };

    itemCri(target: Game_Battler) {
        return (this.item() as DB.Item).damage.critical ? this.subject().cri * (1 - target.cev) : 0;
    };

    apply(target: Game_Battler) {
        var result = target.result();
        this.subject().clearResult();
        result.clear();
        result.used = this.testApply(target);
        result.missed = (result.used && Math.random() >= this.itemHit(target));
        result.evaded = (!result.missed && Math.random() < this.itemEva(target));
        result.physical = this.isPhysical();
        result.drain = this.isDrain();
        if (result.isHit()) {
            if ((this.item() as DB.Item).damage.type > 0) {
                result.critical = (Math.random() < this.itemCri(target));
                var value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
            }
            (this.item() as DB.Item).effects.forEach(function (effect) {
                this.applyItemEffect(target, effect);
            }, this);
            this.applyItemUserEffect(target);
        }
    };

    makeDamageValue(target: Game_Battler, critical: boolean) {
        var item = this.item() as DB.Item;
        var baseValue = this.evalDamageFormula(target);
        var value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            value *= target.pdr;
        }
        if (this.isMagical()) {
            value *= target.mdr;
        }
        if (baseValue < 0) {
            value *= target.rec;
        }
        if (critical) {
            value = this.applyCritical(value);
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    };

    evalDamageFormula(target: Game_Battler) {
        try {
            var item = this.item() as DB.Item;
            var a = this.subject();
            var b = target;
            var v = $gameVariables._data;
            var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
            var value = Math.max(eval(item.damage.formula), 0) * sign;
            if (isNaN(value)) value = 0;
            return value;
        } catch (e) {
            return 0;
        }
    };

    calcElementRate(target: Game_Battler) {
        if ((this.item() as DB.Item).damage.elementId < 0) {
            return this.elementsMaxRate(target, this.subject().attackElements());
        } else {
            return target.elementRate((this.item() as DB.Item).damage.elementId);
        }
    };

    elementsMaxRate(target: Game_Battler, elements: any[]) {
        if (elements.length > 0) {
            return Math.max.apply(null, elements.map(function (elementId) {
                return target.elementRate(elementId);
            }, this));
        } else {
            return 1;
        }
    };

    applyCritical(damage: number) {
        return damage * 3;
    };

    applyVariance(damage: number, variance: number) {
        var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
        var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
        return damage >= 0 ? damage + v : damage - v;
    };

    applyGuard(damage: number, target: Game_Battler) {
        return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
    };

    executeDamage(target: Game_Battler, value: number) {
        var result = target.result();
        if (value === 0) {
            result.critical = false;
        }
        if (this.isHpEffect()) {
            this.executeHpDamage(target, value);
        }
        if (this.isMpEffect()) {
            this.executeMpDamage(target, value);
        }
    };

    executeHpDamage(target: Game_Battler, value: number) {
        if (this.isDrain()) {
            value = Math.min(target.hp, value);
        }
        this.makeSuccess(target);
        target.gainHp(-value);
        if (value > 0) {
            target.onDamage(value);
        }
        this.gainDrainedHp(value);
    };

    executeMpDamage(target: Game_Battler, value: number) {
        if (!this.isMpRecover()) {
            value = Math.min(target.mp, value);
        }
        if (value !== 0) {
            this.makeSuccess(target);
        }
        target.gainMp(-value);
        this.gainDrainedMp(value);
    };

    gainDrainedHp(value: number) {
        if (this.isDrain()) {
            var gainTarget = this.subject();
            if (this._reflectionTarget !== undefined) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainHp(value);
        }
    };

    gainDrainedMp(value: number) {
        if (this.isDrain()) {
            var gainTarget = this.subject();
            if (this._reflectionTarget !== undefined) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainMp(value);
        }
    };

    applyItemEffect(target: Game_Battler, effect: DB.Effect) {
        switch (effect.code) {
            case ActionEffect.RECOVER_HP:
                this.itemEffectRecoverHp(target, effect);
                break;
            case ActionEffect.RECOVER_MP:
                this.itemEffectRecoverMp(target, effect);
                break;
            case ActionEffect.GAIN_TP:
                this.itemEffectGainTp(target, effect);
                break;
            case ActionEffect.ADD_STATE:
                this.itemEffectAddState(target, effect);
                break;
            case ActionEffect.REMOVE_STATE:
                this.itemEffectRemoveState(target, effect);
                break;
            case ActionEffect.ADD_BUFF:
                this.itemEffectAddBuff(target, effect);
                break;
            case ActionEffect.ADD_DEBUFF:
                this.itemEffectAddDebuff(target, effect);
                break;
            case ActionEffect.REMOVE_BUFF:
                this.itemEffectRemoveBuff(target, effect);
                break;
            case ActionEffect.REMOVE_DEBUFF:
                this.itemEffectRemoveDebuff(target, effect);
                break;
            case ActionEffect.SPECIAL:
                this.itemEffectSpecial(target, effect);
                break;
            case ActionEffect.GROW:
                this.itemEffectGrow(target, effect);
                break;
            case ActionEffect.LEARN_SKILL:
                this.itemEffectLearnSkill(target, effect);
                break;
            case ActionEffect.COMMON_EVENT:
                this.itemEffectCommonEvent(target, effect);
                break;
        }
    };

    itemEffectRecoverHp(target: Game_Battler, effect: DB.Effect) {
        var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainHp(value);
            this.makeSuccess(target);
        }
    };

    itemEffectRecoverMp(target: Game_Battler, effect: DB.Effect) {
        var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainMp(value);
            this.makeSuccess(target);
        }
    };

    itemEffectGainTp(target: Game_Battler, effect: DB.Effect) {
        var value = Math.floor(effect.value1);
        if (value !== 0) {
            target.gainTp(value);
            this.makeSuccess(target);
        }
    };

    itemEffectAddState(target: Game_Battler, effect: DB.Effect) {
        if (effect.dataId === 0) {
            this.itemEffectAddAttackState(target, effect);
        } else {
            this.itemEffectAddNormalState(target, effect);
        }
    };

    itemEffectAddAttackState(target: Game_Battler, effect: DB.Effect) {
        this.subject().attackStates().forEach(function (stateId: number) {
            var chance = effect.value1;
            chance *= target.stateRate(stateId);
            chance *= this.subject().attackStatesRate(stateId);
            chance *= this.lukEffectRate(target);
            if (Math.random() < chance) {
                target.addState(stateId);
                this.makeSuccess(target);
            }
        }.bind(this), target);
    };

    itemEffectAddNormalState(target: Game_Battler, effect: DB.Effect) {
        var chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= target.stateRate(effect.dataId);
            chance *= this.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            target.addState(effect.dataId);
            this.makeSuccess(target);
        }
    };

    itemEffectRemoveState(target: Game_Battler, effect: DB.Effect) {
        var chance = effect.value1;
        if (Math.random() < chance) {
            target.removeState(effect.dataId);
            this.makeSuccess(target);
        }
    };

    itemEffectAddBuff(target: Game_Battler, effect: DB.Effect) {
        target.addBuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    };

    itemEffectAddDebuff(target: Game_Battler, effect: DB.Effect) {
        var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        }
    };

    itemEffectRemoveBuff(target: Game_Battler, effect: DB.Effect) {
        if (target.isBuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    };

    itemEffectRemoveDebuff(target: Game_Battler, effect: DB.Effect) {
        if (target.isDebuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    };

    itemEffectSpecial(target: Game_Battler, effect: DB.Effect) {
        if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
            target.escape();
            this.makeSuccess(target);
        }
    };

    itemEffectGrow(target: Game_Battler, effect: DB.Effect) {
        target.addParam(effect.dataId, Math.floor(effect.value1));
        this.makeSuccess(target);
    };

    itemEffectLearnSkill(target: Game_Battler, effect: DB.Effect) {
        if (target.isActor()) {
            target.learnSkill(effect.dataId);
            this.makeSuccess(target);
        }
    };

    itemEffectCommonEvent(target: Game_Battler, effect: DB.Effect) {
    };

    makeSuccess(target: Game_Battler) {
        target.result().success = true;
    };

    applyItemUserEffect(target: Game_Battler) {
        var value = Math.floor((this.item() as DB.Item).tpGain * this.subject().tcr);
        this.subject().gainSilentTp(value);
    };

    lukEffectRate(target: Game_Battler) {
        return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
    };

    applyGlobal() {
        (this.item() as DB.Item).effects.forEach(function (effect) {
            if (effect.code === ActionEffect.COMMON_EVENT) {
                $gameTemp.reserveCommonEvent(effect.dataId);
            }
        }, this);
    };

}

