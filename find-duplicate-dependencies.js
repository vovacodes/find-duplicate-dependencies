import npm from 'npm';

export default function findDuplicateDependencies(options = {}) {
  const exclude = new Set(options.exclude ?? [])
  return new Promise((resolve, reject) => {
    npm.load({ production: !options.checkDevDependencies, json: true }, (err) => {
      if (err) return reject(err);

      npm.commands.ls([], true, (err, packageInfo, packageObj) => {
        if (err) return reject(err);

        const catalog = catalogDependencies(packageObj.dependencies, packageObj.name);
        const duplicatePairs = Object.entries(catalog).filter(([name, occurrences]) => occurrences.length > 1 && !exclude.has(name));

        resolve(Object.fromEntries(duplicatePairs));
      });
    });
  });
}

function catalogDependencies(dependencies, path) {
  return _catalogDependencies({}, dependencies, path);
}

function _catalogDependencies(result, dependencies, path) {
  return Object.entries(dependencies || {}).reduce((acc, entry) => {
    const [name, moduleObj] = entry;

    if (!acc[name]) {
      acc[name] = [];
    }

    const isAdded = acc[name].some((pack) => pack.version === moduleObj.version);

    if (!isAdded) {
      acc[name].push({
        name,
        version: moduleObj.version,
        from: moduleObj.from,
        path
      });
    }

    if (moduleObj.dependencies) {
      return _catalogDependencies(acc, moduleObj.dependencies, `${path}/${name}`);
    }

    return acc;
  }, result);
}
