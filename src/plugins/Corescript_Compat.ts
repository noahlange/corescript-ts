import * as cs from 'corescript';

(() => {
  for (const lib in cs) {
    if (lib !== 'default') {
      for (const exp in (cs as any)[lib]) {
        (window as any)[exp] = (cs as any)[lib][exp];
      }
    } else {
      for (const $ in (cs as any).$) {
        (window as any)[`${$}`] = (cs as any).$[$];
      }
    }
  }
})();
