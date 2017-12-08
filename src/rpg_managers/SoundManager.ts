import AudioManager from './AudioManager';

//-----------------------------------------------------------------------------
// SoundManager
//
// The static class that plays sound effects defined in the database.

export default class SoundManager {
    static preloadImportantSounds() {
        this.loadSystemSound(0);
        this.loadSystemSound(1);
        this.loadSystemSound(2);
        this.loadSystemSound(3);
    };
    
    static loadSystemSound(n: number) {
        if ($dataSystem) {
            AudioManager.loadStaticSe($dataSystem.sounds[n]);
        }
    };
    
    static playSystemSound(n: number) {
        if ($dataSystem) {
            AudioManager.playStaticSe($dataSystem.sounds[n]);
        }
    };
    
    static playCursor() {
        this.playSystemSound(0);
    };
    
    static playOk() {
        this.playSystemSound(1);
    };
    
    static playCancel() {
        this.playSystemSound(2);
    };
    
    static playBuzzer() {
        this.playSystemSound(3);
    };
    
    static playEquip() {
        this.playSystemSound(4);
    };
    
    static playSave() {
        this.playSystemSound(5);
    };
    
    static playLoad() {
        this.playSystemSound(6);
    };
    
    static playBattleStart() {
        this.playSystemSound(7);
    };
    
    static playEscape() {
        this.playSystemSound(8);
    };
    
    static playEnemyAttack() {
        this.playSystemSound(9);
    };
    
    static playEnemyDamage() {
        this.playSystemSound(10);
    };
    
    static playEnemyCollapse() {
        this.playSystemSound(11);
    };
    
    static playBossCollapse1() {
        this.playSystemSound(12);
    };
    
    static playBossCollapse2() {
        this.playSystemSound(13);
    };
    
    static playActorDamage() {
        this.playSystemSound(14);
    };
    
    static playActorCollapse() {
        this.playSystemSound(15);
    };
    
    static playRecovery() {
        this.playSystemSound(16);
    };
    
    static playMiss() {
        this.playSystemSound(17);
    };
    
    static playEvasion() {
        this.playSystemSound(18);
    };
    
    static playMagicEvasion() {
        this.playSystemSound(19);
    };
    
    static playReflection() {
        this.playSystemSound(20);
    };
    
    static playShop() {
        this.playSystemSound(21);
    };
    
    static playUseItem() {
        this.playSystemSound(22);
    };
    
    static playUseSkill() {
        this.playSystemSound(23);
    };
        
}

