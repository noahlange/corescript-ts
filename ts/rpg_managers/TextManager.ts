//-----------------------------------------------------------------------------
// TextManager
//
// The static class that handles terms and messages.

class TextManager {
    static basic(basicId) {
        return $dataSystem.terms.basic[basicId] || '';
    };

    static param(paramId) {
        return $dataSystem.terms.params[paramId] || '';
    };

    static command(commandId) {
        return $dataSystem.terms.commands[commandId] || '';
    };

    static message(messageId) {
        return $dataSystem.terms.messages[messageId] || '';
    };

    // static getter(method, param) {
    //     return {
    //         get: function () {
    //             return this[method](param);
    //         },
    //         configurable: true
    //     };
    // };

    static get currencyUnit() { return $dataSystem.currencyUnit; }


    static get level() { return this.basic( 0); }
    static get levelA() { return this.basic( 1); }
    static get hp() { return this.basic( 2); }
    static get hpA() { return this.basic( 3); }
    static get mp() { return this.basic( 4); }
    static get mpA() { return this.basic( 5); }
    static get tp() { return this.basic( 6); }
    static get tpA() { return this.basic( 7); }
    static get exp() { return this.basic( 8); }
    static get expA() { return this.basic( 9); }
    static get fight() { return this.command( 0); }
    static get escape() { return this.command( 1); }
    static get attack() { return this.command( 2); }
    static get guard() { return this.command( 3); }
    static get item() { return this.command( 4); }
    static get skill() { return this.command( 5); }
    static get equip() { return this.command( 6); }
    static get status() { return this.command( 7); }
    static get formation() { return this.command( 8); }
    static get save() { return this.command( 9); }
    static get gameEnd() { return this.command( 10); }
    static get options() { return this.command( 11); }
    static get weapon() { return this.command( 12); }
    static get armor() { return this.command( 13); }
    static get keyItem() { return this.command( 14); }
    static get equip2() { return this.command( 15); }
    static get optimize() { return this.command( 16); }
    static get clear() { return this.command( 17); }
    static get newGame() { return this.command( 18); }
    static get continue_() { return this.command( 19); }
    static get toTitle() { return this.command( 21); }
    static get cancel() { return this.command( 22); }
    static get buy() { return this.command( 24); }
    static get sell() { return this.command( 25); }
    static get alwaysDash() { return this.message( 'alwaysDash'); }
    static get commandRemember() { return this.message( 'commandRemember'); }
    static get bgmVolume() { return this.message( 'bgmVolume'); }
    static get bgsVolume() { return this.message( 'bgsVolume'); }
    static get meVolume() { return this.message( 'meVolume'); }
    static get seVolume() { return this.message( 'seVolume'); }
    static get possession() { return this.message( 'possession'); }
    static get expTotal() { return this.message( 'expTotal'); }
    static get expNext() { return this.message( 'expNext'); }
    static get saveMessage() { return this.message( 'saveMessage'); }
    static get loadMessage() { return this.message( 'loadMessage'); }
    static get file() { return this.message( 'file'); }
    static get partyName() { return this.message( 'partyName'); }
    static get emerge() { return this.message( 'emerge'); }
    static get preemptive() { return this.message( 'preemptive'); }
    static get surprise() { return this.message( 'surprise'); }
    static get escapeStart() { return this.message( 'escapeStart'); }
    static get escapeFailure() { return this.message( 'escapeFailure'); }
    static get victory() { return this.message( 'victory'); }
    static get defeat() { return this.message( 'defeat'); }
    static get obtainExp() { return this.message( 'obtainExp'); }
    static get obtainGold() { return this.message( 'obtainGold'); }
    static get obtainItem() { return this.message( 'obtainItem'); }
    static get levelUp() { return this.message( 'levelUp'); }
    static get obtainSkill() { return this.message( 'obtainSkill'); }
    static get useItem() { return this.message( 'useItem'); }
    static get criticalToEnemy() { return this.message( 'criticalToEnemy'); }
    static get criticalToActor() { return this.message( 'criticalToActor'); }
    static get actorDamage() { return this.message( 'actorDamage'); }
    static get actorRecovery() { return this.message( 'actorRecovery'); }
    static get actorGain() { return this.message( 'actorGain'); }
    static get actorLoss() { return this.message( 'actorLoss'); }
    static get actorDrain() { return this.message( 'actorDrain'); }
    static get actorNoDamage() { return this.message( 'actorNoDamage'); }
    static get actorNoHit() { return this.message( 'actorNoHit'); }
    static get enemyDamage() { return this.message( 'enemyDamage'); }
    static get enemyRecovery() { return this.message( 'enemyRecovery'); }
    static get enemyGain() { return this.message( 'enemyGain'); }
    static get enemyLoss() { return this.message( 'enemyLoss'); }
    static get enemyDrain() { return this.message( 'enemyDrain'); }
    static get enemyNoDamage() { return this.message( 'enemyNoDamage'); }
    static get enemyNoHit() { return this.message( 'enemyNoHit'); }
    static get evasion() { return this.message( 'evasion'); }
    static get magicEvasion() { return this.message( 'magicEvasion'); }
    static get magicReflection() { return this.message( 'magicReflection'); }
    static get counterAttack() { return this.message( 'counterAttack'); }
    static get substitute() { return this.message( 'substitute'); }
    static get buffAdd() { return this.message( 'buffAdd'); }
    static get debuffAdd() { return this.message( 'debuffAdd'); }
    static get buffRemove() { return this.message( 'buffRemove'); }
    static get actionFailure() { return this.message( 'actionFailure'); }

}

