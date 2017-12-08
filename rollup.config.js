const alias = require('rollup-plugin-alias');

export default {
  input: 'lib/corescript.js',
  output: {
    file: 'js/corescript.bundle.js',
    format: 'es'
  },
  plugins: [
    alias({
      rpg_core: "lib/rpg_core/index.js",
      rpg_managers: "lib/rpg_managers/index.js",
      rpg_windows: "lib/rpg_windows/index.js",
      rpg_scenes: "lib/rpg_scenes/index.js",
      rpg_sprites: "lib/rpg_sprites/index.js",
      rpg_objects: "lib/rpg_objects/index.js"
    })
  ]
};
