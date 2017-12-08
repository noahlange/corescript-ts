import * as Core from 'rpg_core';
import * as Managers from 'rpg_managers';
import * as Objects from 'rpg_objects';
import * as Scenes from 'rpg_scenes';
import * as Sprites from 'rpg_sprites';
import * as Windows from 'rpg_windows';

Managers.PluginManager.setup($plugins);

window.onload = function() {
  Managers.SceneManager.run(Scenes.Scene_Boot);
};