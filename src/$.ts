import {
  Game_Action,
  Game_Actors,
  Game_Map,
  Game_Message,
  Game_Party,
  Game_Player,
  Game_Screen,
  Game_SelfSwitches,
  Game_Switches,
  Game_System,
  Game_Temp,
  Game_Timer,
  Game_Troop,
  Game_Variables
} from 'rpg_objects';

export default class $ {
  public static dataActors: DB.Actor[];
  public static dataClasses: DB.Class[];
  public static dataSkills: DB.Skill[];
  public static dataItems: DB.Item[];
  public static dataWeapons: DB.Weapon[];
  public static dataArmors: DB.Armor[];
  public static dataEnemies: DB.Enemy[];
  public static dataTroops: DB.Troop[];
  public static dataStates: DB.State[];
  public static dataAnimations: DB.Animation[];
  public static dataTilesets: DB.Tileset[];
  public static dataCommonEvents: DB.CommonEvent[];
  public static dataSystem: DB.System;
  public static dataMapInfos: DB.MapInfo[];
  public static dataMap: DB.Map;
  public static gameTemp: Game_Temp;
  public static gameSystem: Game_System;
  public static gameScreen: Game_Screen;
  public static gameTimer: Game_Timer;
  public static gameMessage: Game_Message;
  public static gameSwitches: Game_Switches;
  public static gameVariables: Game_Variables;
  public static gameSelfSwitches: Game_SelfSwitches;
  public static gameActors: Game_Actors;
  public static gameParty: Game_Party;
  public static gameTroop: Game_Troop;
  public static gameMap: Game_Map;
  public static gamePlayer: Game_Player;
  public static testEvent: any;
}
