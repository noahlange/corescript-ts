import { Graphics } from 'rpg_core';
import { AudioManager } from 'rpg_managers';
//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

export default class Game_System {
    protected _saveEnabled: boolean = true;
    protected _menuEnabled: boolean = true;
    protected _encounterEnabled: boolean = true;
    protected _formationEnabled: boolean = true;
    protected _battleCount: number = 0;
    protected _winCount: number = 0;
    protected _escapeCount: number = 0;
    protected _saveCount: number = 0;
    protected _versionId: number = 0;
    protected _framesOnSave: number = 0;
    protected _bgmOnSave: null | DB.Audio = null;
    protected _bgsOnSave: null | DB.Audio = null;
    protected _windowTone: null | number[] = null;
    protected _battleBgm: null | DB.Audio = null;
    protected _victoryMe: null | DB.Audio = null;
    protected _defeatMe: null | DB.Audio = null;
    protected _savedBgm: null | DB.Audio = null;
    protected _walkingBgm: null | DB.Audio = null;

    
    isJapanese() {
        return $dataSystem.locale.match(/^ja/);
    };
    
    isChinese() {
        return $dataSystem.locale.match(/^zh/);
    };
    
    isKorean() {
        return $dataSystem.locale.match(/^ko/);
    };
    
    isCJK() {
        return $dataSystem.locale.match(/^(ja|zh|ko)/);
    };
    
    isRussian() {
        return $dataSystem.locale.match(/^ru/);
    };
    
    isSideView() : boolean{
        return $dataSystem.optSideView;
    };
    
    isSaveEnabled(): boolean {
        return this._saveEnabled;
    };
    
    disableSave() {
        this._saveEnabled = false;
    };
    
    enableSave() {
        this._saveEnabled = true;
    };
    
    isMenuEnabled(): boolean {
        return this._menuEnabled;
    };
    
    disableMenu() {
        this._menuEnabled = false;
    };
    
    enableMenu() {
        this._menuEnabled = true;
    };
    
    isEncounterEnabled(): boolean {
        return this._encounterEnabled;
    };
    
    disableEncounter() {
        this._encounterEnabled = false;
    };
    
    enableEncounter() {
        this._encounterEnabled = true;
    };
    
    isFormationEnabled(): boolean {
        return this._formationEnabled;
    };
    
    disableFormation() {
        this._formationEnabled = false;
    };
    
    enableFormation() {
        this._formationEnabled = true;
    };
    
    battleCount(): number {
        return this._battleCount;
    };
    
    winCount(): number {
        return this._winCount;
    };
    
    escapeCount(): number {
        return this._escapeCount;
    };
    
    saveCount() : number{
        return this._saveCount;
    };
    
    versionId() : number{
        return this._versionId;
    };
    
    windowTone() {
        return this._windowTone || $dataSystem.windowTone;
    };
    
    setWindowTone(value: number[]) {
        this._windowTone = value;
    };
    
    battleBgm() {
        return this._battleBgm || $dataSystem.battleBgm;
    };
    
    setBattleBgm(value: DB.Audio) {
        this._battleBgm = value;
    };
    
    victoryMe() {
        return this._victoryMe || $dataSystem.victoryMe;
    };
    
    setVictoryMe(value: DB.Audio) {
        this._victoryMe = value;
    };
    
    defeatMe() {
        return this._defeatMe || $dataSystem.defeatMe;
    };
    
    setDefeatMe(value: DB.Audio) {
        this._defeatMe = value;
    };
    
    onBattleStart() {
        this._battleCount++;
    };
    
    onBattleWin() {
        this._winCount++;
    };
    
    onBattleEscape() {
        this._escapeCount++;
    };
    
    onBeforeSave() {
        this._saveCount++;
        this._versionId = $dataSystem.versionId;
        this._framesOnSave = Graphics.frameCount;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    };
    
    onAfterLoad() {
        Graphics.frameCount = this._framesOnSave;
        AudioManager.playBgm(this._bgmOnSave);
        AudioManager.playBgs(this._bgsOnSave);
    };
    
    playtime() {
        return Math.floor(Graphics.frameCount / 60);
    };
    
    playtimeText() {
        const hour = Math.floor(this.playtime() / 60 / 60);
        const min = Math.floor(this.playtime() / 60) % 60;
        const sec = this.playtime() % 60;
        return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2);
    };
    
    saveBgm() {
        this._savedBgm = AudioManager.saveBgm();
    };
    
    replayBgm() {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    };
    
    saveWalkingBgm() {
        this._walkingBgm = AudioManager.saveBgm();
    };
    
    replayWalkingBgm() {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    };
    
    saveWalkingBgm2() {
        this._walkingBgm = $dataMap.bgm;
    };
    
}

