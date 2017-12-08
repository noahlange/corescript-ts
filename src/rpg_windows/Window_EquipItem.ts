import { JsonEx } from 'rpg_core';
import { Game_Actor } from 'rpg_objects';

import Window_ItemList from './Window_ItemList';
import Window_EquipStatus from './Window_EquipStatus';

//-----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.

export default class Window_EquipItem extends Window_ItemList {
    protected _actor: Game_Actor | null = null;
    protected _slotId: number = 0;
    protected _statusWindow: Window_EquipStatus;

    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.resetScroll();
        }
    };

    setSlotId(slotId: number) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.resetScroll();
        }
    };

    includes(item: null | DB.Weapon | DB.Armor) {
        if (item === null) {
            return true;
        }
        if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
            return false;
        }
        return this._actor.canEquip(item);
    };

    isEnabled(item: DB.Weapon | DB.Armor): boolean {
        return true;
    };

    selectLast() {
    };

    setStatusWindow(statusWindow: Window_EquipStatus) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };

    updateHelp() {
        super.updateHelp();
        if (this._actor && this._statusWindow) {
            const actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
    };

    playOkSound() {
    };

}
