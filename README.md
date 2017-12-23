# CoreScript TS
A fork of RPGMaker MV's CoreScript engine, using TypeScript instead of ES5.
Based off [Bungcip's](https://bitbucket.org/bungcip/corescript-ts/) TypeScipt
port.

## Major changes
Instead of stuffing everything into the global namespace, CoreScript TS adds a
single UMD global, "corescript." From this variable, the rest of the library's
exports can be accessed.

Every global `$game*` variable has been added to a `$` export.

Before:

```typescript
class MyScene extends Scene_Base {
  public actors = $gameActors;
}
```

After:

```typescript
import { $, Scenes } from 'corescript';
class MyScene extends Scenes.Scene_Base {
  public actors = $.gameActors;
}
```

## Plugins

### Corescript_Compat
`Corescript_Compat` re-adds all exports to the global namespace, so your
existing plugins *should* continue to work while you port them over, should you
choose to do so.

## License
This content is released under the (http://opensource.org/licenses/MIT) MIT
License.