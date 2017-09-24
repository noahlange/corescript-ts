//-----------------------------------------------------------------------------
// Window_BattleLog
//
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.

class Window_BattleLog extends Window_Selectable {
    protected _lines: any[] = [];
    protected _methods: any[] = [];
    protected _waitCount: number = 0;
    protected _waitMode: string = '';
    protected _baseLineStack: any[] = [];
    protected _spriteset: null | Spriteset_Battle = null;
    protected _backBitmap: Bitmap;
    protected _backSprite: Sprite;

    constructor() {
        super(0, 0);
        this.opacity = 0;
        // this._lines = [];
        // this._methods = [];
        // this._waitCount = 0;
        // this._waitMode = '';
        // this._baseLineStack = [];
        // this._spriteset = null;
        this.createBackBitmap();
        this.createBackSprite();
        this.refresh();
    };
    
    setSpriteset(spriteset: Spriteset_Battle) {
        this._spriteset = spriteset;
    };
    
    windowWidth() {
        return Graphics.boxWidth;
    };
    
    windowHeight() {
        return Window_Base.fittingHeight(this.maxLines());
    };
    
    maxLines() {
        return 10;
    };
    
    createBackBitmap() {
        this._backBitmap = new Bitmap(this.width, this.height);
    };
    
    createBackSprite() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = this._backBitmap;
        this._backSprite.y = this.y;
        this.addChildToBack(this._backSprite);
    };
    
    numLines() {
        return this._lines.length;
    };
    
    messageSpeed() {
        return 16;
    };
    
    isBusy() {
        return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
    };
    
    update() {
        if (!this.updateWait()) {
            this.callNextMethod();
        }
    };
    
    updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    };
    
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount -= this.isFastForward() ? 3 : 1;
            if (this._waitCount < 0) {
                this._waitCount = 0;
            }
            return true;
        }
        return false;
    };
    
    updateWaitMode() {
        var waiting = false;
        switch (this._waitMode) {
        case 'effect':
            waiting = this._spriteset.isEffecting();
            break;
        case 'movement':
            waiting = this._spriteset.isAnyoneMoving();
            break;
        }
        if (!waiting) {
            this._waitMode = '';
        }
        return waiting;
    };
    
    setWaitMode(waitMode: string) {
        this._waitMode = waitMode;
    };
    
    callNextMethod() {
        if (this._methods.length > 0) {
            var method = this._methods.shift();
            if (method.name && (this as any)[method.name]) {
                (this as any)[method.name].apply(this, method.params);
            } else {
                throw new Error('Method not found: ' + method.name);
            }
        }
    };
    
    isFastForward() {
        return (Input.isLongPressed('ok') || Input.isPressed('shift') ||
                TouchInput.isLongPressed());
    };
    
    push(methodName: string, ...methodArgs: any[]) {
        this._methods.push({ name: methodName, params: methodArgs });
    };
    
    clear() {
        this._lines = [];
        this._baseLineStack = [];
        this.refresh();
    };
    
    wait() {
        this._waitCount = this.messageSpeed();
    };
    
    waitForEffect() {
        this.setWaitMode('effect');
    };
    
    waitForMovement() {
        this.setWaitMode('movement');
    };
    
    addText(text: string) {
        this._lines.push(text);
        this.refresh();
        this.wait();
    };
    
    pushBaseLine() {
        this._baseLineStack.push(this._lines.length);
    };
    
    popBaseLine() {
        var baseLine = this._baseLineStack.pop();
        while (this._lines.length > baseLine) {
            this._lines.pop();
        }
    };
    
    waitForNewLine() {
        var baseLine = 0;
        if (this._baseLineStack.length > 0) {
            baseLine = this._baseLineStack[this._baseLineStack.length - 1];
        }
        if (this._lines.length > baseLine) {
            this.wait();
        }
    };
    
    popupDamage(target: Game_Actor | Game_Enemy) {
        target.startDamagePopup();
    };
    
    performActionStart(subject: Game_Actor | Game_Enemy, action: Game_Action) {
        subject.performActionStart(action);
    };
    
    performAction(subject: Game_Actor | Game_Enemy, action: Game_Action) {
        subject.performAction(action);
    };
    
    performActionEnd(subject: Game_Actor | Game_Enemy) {
        subject.performActionEnd();
    };
    
    performDamage(target: Game_Actor | Game_Enemy) {
        target.performDamage();
    };
    
    performMiss(target: Game_Actor | Game_Enemy) {
        target.performMiss();
    };
    
    performRecovery(target: Game_Actor | Game_Enemy) {
        target.performRecovery();
    };
    
    performEvasion(target: Game_Actor | Game_Enemy) {
        target.performEvasion();
    };
    
    performMagicEvasion(target: Game_Actor | Game_Enemy) {
        target.performMagicEvasion();
    };
    
    performCounter(target: Game_Actor | Game_Enemy) {
        target.performCounter();
    };
    
    performReflection(target: Game_Actor | Game_Enemy) {
        target.performReflection();
    };
    
    performSubstitute(substitute: Game_Actor | Game_Enemy, target: Game_Actor | Game_Enemy) {
        substitute.performSubstitute(target);
    };
    
    performCollapse(target: Game_Actor | Game_Enemy) {
        target.performCollapse();
    };
    
    showAnimation(subject: Game_Actor | Game_Enemy, targets: Game_Actor[] | Game_Enemy[], animationId: number) {
        if (animationId < 0) {
            this.showAttackAnimation(subject, targets);
        } else {
            this.showNormalAnimation(targets, animationId);
        }
    };
    
    showAttackAnimation(subject: Game_Actor | Game_Enemy, targets: Game_Battler[]) {
        if (subject.isActor()) {
            this.showActorAttackAnimation(subject, targets);
        } else {
            this.showEnemyAttackAnimation(subject, targets);
        }
    };
    
    showActorAttackAnimation(subject: Game_Actor, targets: Game_Battler[]) {
        this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
    };
    
    showEnemyAttackAnimation(subject: Game_Enemy, targets: Game_Battler[]) {
        SoundManager.playEnemyAttack();
    };
    
    showNormalAnimation(targets: Game_Battler[], animationId: number, mirror?: boolean) {
        var animation = $dataAnimations[animationId];
        if (animation) {
            var delay = this.animationBaseDelay();
            var nextDelay = this.animationNextDelay();
            targets.forEach(function(target) {
                target.startAnimation(animationId, mirror, delay);
                delay += nextDelay;
            });
        }
    };
    
    animationBaseDelay() {
        return 8;
    };
    
    animationNextDelay() {
        return 12;
    };
    
    refresh() {
        this.drawBackground();
        this.contents.clear();
        for (var i = 0; i < this._lines.length; i++) {
            this.drawLineText(i);
        }
    };
    
    drawBackground() {
        var rect = this.backRect();
        var color = this.backColor();
        this._backBitmap.clear();
        this._backBitmap.paintOpacity = this.backPaintOpacity();
        this._backBitmap.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this._backBitmap.paintOpacity = 255;
    };
    
    backRect() {
        return {
            x: 0,
            y: this.padding,
            width: this.width,
            height: this.numLines() * Window_Base.lineHeight()
        };
    };
    
    backColor() {
        return '#000000';
    };
    
    backPaintOpacity() {
        return 64;
    };
    
    drawLineText(index: number) {
        var rect = this.itemRectForText(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        /// NOTE: changed to make it compiled
        // this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
        this.drawTextEx(this._lines[index], rect.x, rect.y);
    };
    
    startTurn() {
        this.push('wait');
    };
    
    startAction(subject: Game_Battler, action: Game_Action, targets: Game_Battler[]) {
        var item = action.item() as DB.Item;
        this.push('performActionStart', subject, action);
        this.push('waitForMovement');
        this.push('performAction', subject, action);
        this.push('showAnimation', subject, targets.clone(), item.animationId);
        this.displayAction(subject, item);
    };
    
    endAction(subject: Game_Battler) {
        this.push('waitForNewLine');
        this.push('clear');
        this.push('performActionEnd', subject);
    };
    
    displayCurrentState(subject: Game_Battler) {
        var stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push('addText', subject.name() + stateText);
            this.push('wait');
            this.push('clear');
        }
    };
    
    displayRegeneration(subject: Game_Battler) {
        this.push('popupDamage', subject);
    };
    
    displayAction(subject: Game_Battler, item: DB.Item) {
        var numMethods = this._methods.length;
        if (DataManager.isSkill(item)) {
            if (item.message1) {
                this.push('addText', subject.name() + item.message1.format(item.name));
            }
            if (item.message2) {
                this.push('addText', item.message2.format(item.name));
            }
        } else {
            this.push('addText', TextManager.useItem.format(subject.name(), item.name));
        }
        if (this._methods.length === numMethods) {
            this.push('wait');
        }
    };
    
    displayCounter(target: Game_Battler) {
        this.push('performCounter', target);
        this.push('addText', TextManager.counterAttack.format(target.name()));
    };
    
    displayReflection(target: Game_Battler) {
        this.push('performReflection', target);
        this.push('addText', TextManager.magicReflection.format(target.name()));
    };
    
    displaySubstitute(substitute: Game_Battler, target: Game_Battler) {
        var substName = substitute.name();
        this.push('performSubstitute', substitute, target);
        this.push('addText', TextManager.substitute.format(substName, target.name()));
    };
    
    displayActionResults(subject: Game_Battler, target: Game_Battler) {
        if (target.result().used) {
            this.push('pushBaseLine');
            this.displayCritical(target);
            this.push('popupDamage', target);
            this.push('popupDamage', subject);
            this.displayDamage(target);
            this.displayAffectedStatus(target);
            this.displayFailure(target);
            this.push('waitForNewLine');
            this.push('popBaseLine');
        }
    };
    
    displayFailure(target: Game_Battler) {
        if (target.result().isHit() && !target.result().success) {
            this.push('addText', TextManager.actionFailure.format(target.name()));
        }
    };
    
    displayCritical(target: Game_Battler) {
        if (target.result().critical) {
            if (target.isActor()) {
                this.push('addText', TextManager.criticalToActor);
            } else {
                this.push('addText', TextManager.criticalToEnemy);
            }
        }
    };
    
    displayDamage(target: Game_Battler) {
        if (target.result().missed) {
            this.displayMiss(target);
        } else if (target.result().evaded) {
            this.displayEvasion(target);
        } else {
            this.displayHpDamage(target);
            this.displayMpDamage(target);
            this.displayTpDamage(target);
        }
    };
    
    displayMiss(target: Game_Battler) {
        var fmt;
        if (target.result().physical) {
            fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
            this.push('performMiss', target);
        } else {
            fmt = TextManager.actionFailure;
        }
        this.push('addText', fmt.format(target.name()));
    };
    
    displayEvasion(target: Game_Battler) {
        var fmt;
        if (target.result().physical) {
            fmt = TextManager.evasion;
            this.push('performEvasion', target);
        } else {
            fmt = TextManager.magicEvasion;
            this.push('performMagicEvasion', target);
        }
        this.push('addText', fmt.format(target.name()));
    };
    
    displayHpDamage(target: Game_Battler) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.push('performDamage', target);
            }
            if (target.result().hpDamage < 0) {
                this.push('performRecovery', target);
            }
            this.push('addText', this.makeHpDamageText(target));
        }
    };
    
    displayMpDamage(target: Game_Battler) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push('performRecovery', target);
            }
            this.push('addText', this.makeMpDamageText(target));
        }
    };
    
    displayTpDamage(target: Game_Battler) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push('performRecovery', target);
            }
            this.push('addText', this.makeTpDamageText(target));
        }
    };
    
    displayAffectedStatus(target: Game_Battler) {
        if (target.result().isStatusAffected()) {
            this.push('pushBaseLine');
            this.displayChangedStates(target);
            this.displayChangedBuffs(target);
            this.push('waitForNewLine');
            this.push('popBaseLine');
        }
    };
    
    displayAutoAffectedStatus(target: Game_Battler) {
        if (target.result().isStatusAffected()) {
            /// NOTE (bungcip): changed to make it compiled
            this.displayAffectedStatus(target);
            this.push('clear');
        }
    };
    
    displayChangedStates(target: Game_Battler) {
        this.displayAddedStates(target);
        this.displayRemovedStates(target);
    };
    
    displayAddedStates(target: Game_Battler) {
        target.result().addedStateObjects().forEach(function(state) {
            var stateMsg = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push('performCollapse', target);
            }
            if (stateMsg) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                this.push('addText', (target as Game_Actor).name()+ stateMsg);
                this.push('waitForEffect');
            }
        }, this);
    };
    
    displayRemovedStates(target: Game_Battler ) {
        target.result().removedStateObjects().forEach(function(state) {
            if (state.message4) {
                this.push('popBaseLine');
                this.push('pushBaseLine');
                this.push('addText', target.name() + state.message4);
            }
        }, this);
    };
    
    displayChangedBuffs(target: Game_Battler) {
        var result = target.result();
        this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
    };
    
    displayBuffs(target: Game_Battler, buffs: number[], fmt: string) {
        buffs.forEach(function(paramId) {
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', fmt.format(target.name(), TextManager.param(paramId)));
        }, this);
    };
    
    makeHpDamageText(target: Game_Battler) {
        var result = target.result();
        var damage = result.hpDamage;
        var isActor = target.isActor();
        var fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.hp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
            return fmt.format(target.name(), damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.hp, -damage);
        } else {
            fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
            return fmt.format(target.name());
        }
    };
    
    makeMpDamageText(target: Game_Battler) {
        var result = target.result();
        var damage = result.mpDamage;
        var isActor = target.isActor();
        var fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.mp, -damage);
        } else {
            return '';
        }
    };
    
    makeTpDamageText(target: Game_Battler) {
        var result = target.result();
        var damage = result.tpDamage;
        var isActor = target.isActor();
        var fmt;
        if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.tp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
            return fmt.format(target.name(), TextManager.tp, -damage);
        } else {
            return '';
        }
    };
    
}

