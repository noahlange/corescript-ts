const alias = require('rollup-plugin-alias');
const minify = require('rollup-plugin-babel-minify');

export default {
  input: 'build/corescript.js',
  output: {
    file: 'dist/corescript.bundle.js',
    format: 'umd'
  },
  extend: true,
  name: 'corescript',
  plugins: [
    alias({
      $: 'build/$.js',
      rpg_core: "build/rpg_core/index.js",
      rpg_managers: "build/rpg_managers/index.js",
      rpg_windows: "build/rpg_windows/index.js",
      rpg_scenes: "build/rpg_scenes/index.js",
      rpg_sprites: "build/rpg_sprites/index.js",
      rpg_objects: "build/rpg_objects/index.js"
    }),
    // minify({ comments: false })
  ]
};
