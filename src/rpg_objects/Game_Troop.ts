import { BattleManager } from 'rpg_managers';

import Game_Unit from './Game_Unit';
import Game_Enemy from './Game_Enemy';
import Game_Interpreter from './Game_Interpreter';

//-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.

interface EventFlags {
    [key: number]: boolean;
}

export default class Game_Troop extends Game_Unit<Game_Enemy> {
    protected _interpreter: Game_Interpreter;
    protected _troopId: number;
    protected _eventFlags: EventFlags;
    protected _enemies: Game_Enemy[];
    protected _turnCount: number;
    protected _namesCount: NumberMap;


    static LETTER_TABLE_HALF = [
        ' A', ' B', ' C', ' D', ' E', ' F', ' G', ' H', ' I', ' J', ' K', ' L', ' M',
        ' N', ' O', ' P', ' Q', ' R', ' S', ' T', ' U', ' V', ' W', ' X', ' Y', ' Z'
    ];
    static LETTER_TABLE_FULL = [
        'Ａ', 'Ｂ', 'Ｃ', 'Ｄ', 'Ｅ', 'Ｆ', 'Ｇ', 'Ｈ', 'Ｉ', 'Ｊ', 'Ｋ', 'Ｌ', 'Ｍ',
        'Ｎ', 'Ｏ', 'Ｐ', 'Ｑ', 'Ｒ', 'Ｓ', 'Ｔ', 'Ｕ', 'Ｖ', 'Ｗ', 'Ｘ', 'Ｙ', 'Ｚ'
    ];

    constructor() {
        super();
        this._interpreter = new Game_Interpreter();
        this.clear();
    };

    isEventRunning() {
        return this._interpreter.isRunning();
    };

    updateInterpreter() {
        this._interpreter.update();
    };

    turnCount() {
        return this._turnCount;
    };

    members() {
        return this._enemies;
    };

    clear() {
        this._interpreter.clear();
        this._troopId = 0;
        this._eventFlags = {};
        this._enemies = [];
        this._turnCount = 0;
        this._namesCount = {};
    };

    troop() {
        return $dataTroops[this._troopId];
    };

    setup(troopId: number) {
        this.clear();
        this._troopId = troopId;
        this._enemies = [];
        this.troop().members.forEach(function (member) {
            if ($dataEnemies[member.enemyId]) {
                const enemyId = member.enemyId;
                const x = member.x;
                const y = member.y;
                const enemy = new Game_Enemy(enemyId, x, y);
                if (member.hidden) {
                    enemy.hide();
                }
                this._enemies.push(enemy);
            }
        }, this);
        this.makeUniqueNames();
    };

    makeUniqueNames() {
        const table = this.letterTable();
        this.members().forEach(function (enemy) {
            if (enemy.isAlive() && enemy.isLetterEmpty()) {
                const name = enemy.originalName();
                const n = this._namesCount[name] || 0;
                enemy.setLetter(table[n % table.length]);
                this._namesCount[name] = n + 1;
            }
        }, this);
        this.members().forEach(function (enemy) {
            const name = enemy.originalName();
            if (this._namesCount[name] >= 2) {
                enemy.setPlural(true);
            }
        }, this);
    };

    letterTable() {
        return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL :
            Game_Troop.LETTER_TABLE_HALF;
    };

    enemyNames(): string[] {
        const names: string[] = [];
        this.members().forEach(function (enemy) {
            const name = enemy.originalName();
            if (enemy.isAlive() && !names.contains(name)) {
                names.push(name);
            }
        });
        return names;
    };

    meetsConditions(page: DB.Page) {
        const c = page.conditions;
        if (!c.turnEnding && !c.turnValid && !c.enemyValid &&
            !c.actorValid && !c.switchValid) {
            return false;  // Conditions not set
        }
        if (c.turnEnding) {
            if (!BattleManager.isTurnEnd()) {
                return false;
            }
        }
        if (c.turnValid) {
            const n = this._turnCount;
            const a = c.turnA;
            const b = c.turnB;
            if ((b === 0 && n !== a)) {
                return false;
            }
            if ((b > 0 && (n < 1 || n < a || n % b !== a % b))) {
                return false;
            }
        }
        if (c.enemyValid) {
            const enemy = $gameTroop.members()[c.enemyIndex];
            if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = $gameActors.actor(c.actorId);
            if (!actor || actor.hpRate() * 100 > c.actorHp) {
                return false;
            }
        }
        if (c.switchValid) {
            if (!$gameSwitches.value(c.switchId)) {
                return false;
            }
        }
        return true;
    };

    setupBattleEvent() {
        if (!this._interpreter.isRunning()) {
            if (this._interpreter.setupReservedCommonEvent()) {
                return;
            }
            const pages = this.troop().pages;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (this.meetsConditions(page) && !this._eventFlags[i]) {
                    this._interpreter.setup(page.list);
                    if (page.span <= 1) {
                        this._eventFlags[i] = true;
                    }
                    break;
                }
            }
        }
    };

    increaseTurn() {
        const pages = this.troop().pages;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page.span === 1) {
                this._eventFlags[i] = false;
            }
        }
        this._turnCount++;
    };

    expTotal() {
        return this.deadMembers().reduce(function (r, enemy) {
            return r + (enemy as Game_Enemy).exp();
        }, 0);
    };

    goldTotal() {
        return this.deadMembers().reduce(function (r, enemy) {
            return r + (enemy as Game_Enemy).gold();
        }, 0) * this.goldRate();
    };

    goldRate() {
        return $gameParty.hasGoldDouble() ? 2 : 1;
    };

    makeDropItems() {
        return this.deadMembers().reduce(function (r, enemy) {
            return r.concat((enemy as Game_Enemy).makeDropItems());
        }, []);
    };

}


