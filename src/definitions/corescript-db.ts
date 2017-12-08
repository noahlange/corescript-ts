declare module DB {
    export interface Audio {
        name: string;
        volume: number;
        pitch: number;
        pan?: number;
        pos?: number;
    }


    export interface Conditions {
        actorId: number;
        actorValid: boolean;
        itemId: number;
        itemValid: boolean;
        selfSwitchCh: string;
        selfSwitchValid: boolean;
        switch1Id: number;
        switch1Valid: boolean;
        switch2Id: number;
        switch2Valid: boolean;
        variableId: number;
        variableValid: boolean;
        variableValue: number;

        turnEnding?: boolean;
        turnValid?: boolean;
        turnA?: number;
        turnB?: number;

        enemyValid?: boolean;
        enemyIndex?: number;

        actorHp?: number;
        enemyHp?: number;
        switchValid?: boolean;
        switchId?: number;

    }

    export interface Image {
        tileId: number;
        characterName: string;
        direction: number;
        pattern: number;
        characterIndex: number;
    }

    export interface List {
        code: number;
        indent?: number;
        parameters: any[];
    }

    export interface MoveRoute {
        list: List[];
        repeat: boolean;
        skippable: boolean;
        wait: boolean;
    }

    export interface Page {
        conditions: Conditions;
        directionFix: boolean;
        image: Image;
        list: List[];
        moveFrequency: number;
        moveRoute: MoveRoute;
        moveSpeed: number;
        moveType: number;
        priorityType: number;
        stepAnime: boolean;
        through: boolean;
        trigger: number;
        walkAnime: boolean;

        span?: number;
    }

    export interface Event {
        id: number;
        name: string;
        note: string;
        pages: Page[];
        x: number;
        y: number;
    }

    export interface Encounter {
        weight: number;
        troopId: number;
        regionSet: number[];
    }

    export interface Map {
        autoplayBgm: boolean;
        autoplayBgs: boolean;
        battleback1Name: string;
        battleback2Name: string;
        bgm: Audio;
        bgs: Audio;
        disableDashing: boolean;
        displayName: string;
        encounterList: Encounter[];
        encounterStep: number;
        height: number;
        note: string;
        parallaxLoopX: boolean;
        parallaxLoopY: boolean;
        parallaxName: string;
        parallaxShow: boolean;
        parallaxSx: number;
        parallaxSy: number;
        scrollType: number;
        specifyBattleback: boolean;
        tilesetId: number;
        width: number;
        data: number[];
        events: Event[];
    }


    export interface AttackMotion {
        type: number;
        weaponImageId: number;
    }


    export interface Vehicle {
        bgm: Audio;
        characterIndex: number;
        characterName: string;
        startMapId: number;
        startX: number;
        startY: number;
    }

    export interface Messages {
        actionFailure: string;
        actorDamage: string;
        actorDrain: string;
        actorGain: string;
        actorLoss: string;
        actorNoDamage: string;
        actorNoHit: string;
        actorRecovery: string;
        alwaysDash: string;
        bgmVolume: string;
        bgsVolume: string;
        buffAdd: string;
        buffRemove: string;
        commandRemember: string;
        counterAttack: string;
        criticalToActor: string;
        criticalToEnemy: string;
        debuffAdd: string;
        defeat: string;
        emerge: string;
        enemyDamage: string;
        enemyDrain: string;
        enemyGain: string;
        enemyLoss: string;
        enemyNoDamage: string;
        enemyNoHit: string;
        enemyRecovery: string;
        escapeFailure: string;
        escapeStart: string;
        evasion: string;
        expNext: string;
        expTotal: string;
        file: string;
        levelUp: string;
        loadMessage: string;
        magicEvasion: string;
        magicReflection: string;
        meVolume: string;
        obtainExp: string;
        obtainGold: string;
        obtainItem: string;
        obtainSkill: string;
        partyName: string;
        possession: string;
        preemptive: string;
        saveMessage: string;
        seVolume: string;
        substitute: string;
        surprise: string;
        useItem: string;
        victory: string;

        [key: string]: string;
    }

    export interface Terms {
        basic: string[];
        commands: string[];
        params: string[];
        messages: Messages;
    }

    export interface TestBattler {
        actorId: number;
        equips: number[];
        level: number;
    }

    export interface System {
        airship: Vehicle;
        armorTypes: string[];
        attackMotions: AttackMotion[];
        battleBgm: Audio;
        battleback1Name: string;
        battleback2Name: string;
        battlerHue: number;
        battlerName: string;
        boat: Vehicle;
        currencyUnit: string;
        defeatMe: Audio;
        editMapId: number;
        elements: string[];
        equipTypes: string[];
        gameTitle: string;
        gameoverMe: Audio;
        locale: string;
        magicSkills: number[];
        menuCommands: boolean[];
        optDisplayTp: boolean;
        optDrawTitle: boolean;
        optExtraExp: boolean;
        optFloorDeath: boolean;
        optFollowers: boolean;
        optSideView: boolean;
        optSlipDeath: boolean;
        optTransparent: boolean;
        partyMembers: number[];
        ship: Vehicle;
        skillTypes: string[];
        sounds: Audio[];
        startMapId: number;
        startX: number;
        startY: number;
        switches: string[];
        terms: Terms;
        testBattlers: TestBattler[];
        testTroopId: number;
        title1Name: string;
        title2Name: string;
        titleBgm: Audio;
        variables: string[];
        versionId: number;
        victoryMe: Audio;
        weaponTypes: string[];
        windowTone: number[];

        encryptionKey?: string;
        hasEncryptedImages?: boolean;
        hasEncryptedAudio?: boolean;
    }

    export interface Damage {
        critical: boolean;
        elementId: number;
        formula: string;
        type: number;
        variance: number;
    }

    export interface Effect {
        code: number;
        dataId: number;
        value1: number;
        value2: number;
    }

    export interface Item {
        id: number;
        animationId: number;
        consumable: boolean;
        damage: Damage;
        description: string;
        effects: Effect[];
        hitType: HitType;
        iconIndex: number;
        itypeId: number;
        name: string;
        note: string;
        occasion: number;
        price: number;
        repeats: number;
        scope: number;
        speed: number;
        successRate: number;
        tpGain: number;
    }



    export interface Skill {
        id: number;
        animationId: number;
        damage: Damage;
        description: string;
        effects: Effect[];
        hitType: number;
        iconIndex: number;
        message1: string;
        message2: string;
        mpCost: number;
        name: string;
        note: string;
        occasion: number;
        repeats: number;
        requiredWtypeId1: number;
        requiredWtypeId2: number;
        scope: number;
        speed: number;
        stypeId: number;
        successRate: number;
        tpCost: number;
        tpGain: number;
    }

    export interface Trait {
        code: number;
        dataId: number;
        value: number;
    }

    export interface State {
        id: number;
        autoRemovalTiming: number;
        chanceByDamage: number;
        iconIndex: number;
        maxTurns: number;
        message1: string;
        message2: string;
        message3: string;
        message4: string;
        minTurns: number;
        motion: number;
        name: string;
        note: string;
        overlay: number;
        priority: number;
        releaseByDamage: boolean;
        removeAtBattleEnd: boolean;
        removeByDamage: boolean;
        removeByRestriction: boolean;
        removeByWalking: boolean;
        restriction: number;
        stepsToRemove: number;
        traits: Trait[];
    }

    export interface Actor {
        id: number;
        battlerName: string;
        characterIndex: number;
        characterName: string;
        classId: number;
        equips: number[];
        faceIndex: number;
        faceName: string;
        traits: any[];
        initialLevel: number;
        maxLevel: number;
        name: string;
        nickname: string;
        note: string;
        profile: string;
    }

    export interface Timing {
        flashColor: number[];
        flashDuration: number;
        flashScope: number;
        frame: number;
        se: Audio;
    }

    export interface Animation {
        id: number;
        animation1Hue: number;
        animation1Name: string;
        animation2Hue: number;
        animation2Name: string;
        frames: number[][][];
        name: string;
        position: number;
        timings: Timing[];
    }

    export interface Armor {
        id: number;
        atypeId: number;
        description: string;
        etypeId: number;
        traits: Trait[];
        iconIndex: number;
        name: string;
        note: string;
        params: number[];
        price: number;
    }

    export interface Learning {
        level: number;
        note: string;
        skillId: number;
    }

    export interface Class {
        id: number;
        expParams: number[];
        traits: Trait[];
        learnings: Learning[];
        name: string;
        note: string;
        params: number[][];
    }

    export interface CommonEvent {
        id: number;
        list: List[];
        name: string;
        switchId: number;
        trigger: number;
    }

    export interface Action {
        conditionParam1: number;
        conditionParam2: number;
        conditionType: number;
        rating: number;
        skillId: number;
    }

    export interface DropItem {
        dataId: number;
        denominator: number;
        kind: number;
    }

    // export interface Trait {
    //     code: number;
    //     dataId: number;
    //     value: number;
    // }

    export interface Enemy {
        id: number;
        actions: Action[];
        battlerHue: number;
        battlerName: string;
        dropItems: DropItem[];
        exp: number;
        traits: Trait[];
        gold: number;
        name: string;
        note: string;
        params: number[];
    }

    export interface MapInfo {
        id: number;
        expanded: boolean;
        name: string;
        order: number;
        parentId: number;
        scrollX: number;
        scrollY: number;
    }

    export interface Tileset {
        id: number;
        flags: number[];
        mode: number;
        name: string;
        note: string;
        tilesetNames: string[];
    }


    export interface EnemyTroop {
        enemyId: number;
        x: number;
        y: number;
        hidden: boolean;
    }

    export interface Troop {
        id: number;
        members: EnemyTroop[];
        name: string;
        pages: Page[];
    }
 
    export interface Weapon {
        id: number;
        animationId: number;
        description: string;
        etypeId: number;
        traits: Trait[];
        iconIndex: number;
        name: string;
        note: string;
        params: number[];
        price: number;
        wtypeId: number;
    }

}

