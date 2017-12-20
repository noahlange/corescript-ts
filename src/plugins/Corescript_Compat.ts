(() => {
  const cs = (window as any).corescript;
  for (const lib in cs) {
    if (lib !== 'default') {
      for (const exp of Object.keys(cs[lib])) {
        (window as any)[exp] = cs[lib][exp];
      }
    } else {
      for (const $ of Object.keys(cs.$)) {
        (window as any)[`${$}`] = cs.$[$];
      }
    }
  }
})();
