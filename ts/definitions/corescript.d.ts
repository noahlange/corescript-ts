// declare const SceneManager: any;
// declare const SoundManager: any;
// declare const TextManager: any;
// declare const PluginManager: any;
// declare const StorageManager: any;
// declare const ImageManager: any;

// declare const $dataSystem: any;
// declare const $gameTroop: any;
// declare const $gameScreen: any;
// declare const $gameParty: any;
// declare const $gameSystem: any;
// declare const $gameMessage: any;

// declare class Game_BattlerBase {
//     constructor();
//     initMembers();
// }

// declare const Game_Action: any;
// declare const Game_Temp: any;
// declare const Game_System: any;
// declare const Game_Screen: any;
// declare const Game_Timer: any;
// declare const Game_Message: any;
// declare const Game_Switches: any;
// declare const Game_Variables: any;
// declare const Game_SelfSwitches: any;
// declare const Game_Actor: any;
// declare const Game_Party: any;
// declare const Game_Troop: any;
// declare const Game_Map: any;
// declare const Game_Player: any;
// declare const Game_Interpreter: any;
// declare class Game_Battler {
//  constructor();
//  initMembers();   
//  recoverAll();
//  traitObjects(): any[];
//  performActionStart(action);
//  performAction(action);
//  performActionEnd();
//  performDamage();
//  performCollapse();
//  makeActions();
// }

// declare const Scene_Boot: any;
// declare const Scene_Gameover: any;
// declare const Scene_Menu: any;
// declare const Scene_Save: any;
// declare const Scene_Title: any;
// declare const Scene_Shop: any;
// declare const Scene_Name: any;
// declare const Scene_Battle: any;

declare const Window_MenuCommand: any;
declare const Window_BattleLog: any;
declare const Window_BattleStatus: any;
declare const Window_PartyCommand: any;
declare const Window_ActorCommand: any;
declare const Window_ItemCommand: any;
declare const Window_TitleCommand: any;
declare const Window_Help: any;
declare const Window_BattleSkill: any;
declare const Window_BattleItem: any;
declare const Window_BattleActor: any;
declare const Window_BattleEnemy: any;
declare const Window_Message: any;
declare const Window_ScrollText: any;
declare const Window_DebugRange: any;
declare const Window_DebugEdit: any;
declare const Window_Base: any;
declare const Window_EquipStatus: any;
declare const Window_EquipCommand: any;
declare const Window_EquipSlot: any;
declare const Window_EquipItem: any;
declare const Window_SavefileList: any;
declare const Window_GameEnd: any;
declare const Window_ItemCategory: any;
declare const Window_ItemList: any;
declare const Window_MenuActor: any;
declare const Window_MapName: any;
declare const Window_Gold: any;
declare const Window_NameEdit: any;
declare const Window_NameInput: any;
declare const Window_MenuStatus: any;
declare const Window_Options: any;
declare const Window_ShopCommand: any;
declare const Window_ShopBuy: any;
declare const Window_ShopSell: any;
declare const Window_ShopNumber: any;
declare const Window_ShopStatus: any;
declare const Window_SkillStatus: any;
declare const Window_SkillList: any;
declare const Window_SkillType: any;
declare const Window_Status: any;

// declare const Spriteset_Battle: any;
// declare const Spriteset_Map: any;

/// bungcip: from ihpone-inline
declare const makeVideoPlayableInline: (input) => any;

/// bungcip: from FPS meter
declare class FPSMeter {
    constructor(options);

}

declare const LZString: any;

declare class webkitAudioContext {

}

/// new DOM element
interface FontFace {
    family: string;
    style: string;
    weight: string;
    stretch: string;
    unicodeRange: string;
    variant: string;
    featureSettings: string;

    status: string;

    load(): Promise<FontFace>;

    loaded: Promise<FontFace>;
}

interface FontFaceSet extends Set<FontFace> {
    onloading: (ev: Event) => any;
    onloadingdone: (ev: Event) => any;
    onloadingerror: (ev: Event) => any;

    // check and start loads if appropriate
    // and fulfill promise when all loads complete
    load(font: string, text?: string): Promise<ArrayLike<FontFace>>;

    // return whether all fonts in the fontlist are loaded
    // (does not initiate load if not available)
    check(font: string, text?: string): boolean;

    // async notification that font loading and layout operations are done
    ready: Promise<FontFaceSet>;

    // loading state, "loading" while one or more fonts loading, "loaded" otherwise
    status: string;
}

interface Document {
    fonts: FontFaceSet;
}

interface StyleSheet {
    insertRule(rule, index);
}