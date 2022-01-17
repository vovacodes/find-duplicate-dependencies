# find-duplicate-dependencies

Finds duplicate dependencies in your node_modules. Useful when use npm as a package manager for front-end.

## Install

for CLI usage

```sh
npm install -g find-duplicate-dependencies
```

for API usage

```sh
npm install find-duplicate-dependencies
```

## Usage

### CLI

```sh
find-duplicate-dependencies
```

This command exits with 1 if there are some duplicates and with 0 if there are not.

### API

```javascript
const findDuplicateDependencies = require('find-duplicate-dependencies');

findDuplicateDependencies().then((duplicates) => {
  /*
  duplicates has the following format:

  {
    "tar": [
      {
        name: 'tar',
        version: '1.0.3',
        from: 'tar@>=1.0.0 <2.0.0',
        path: 'test/npm/node-gyp'
      },
      {
        name: 'tar',
        version: '2.1.1',
        from: 'tar@>=2.1.1 <2.2.0',
        path: 'test/npm'
      }
    ],
    "mime-types": [
      {
        name: 'mime-types',
        version: '2.1.2',
        from: 'mime-types@>=2.1.1 <3.0.0',
        path: 'test/npm/request/form-data'
      },
      {
        name: 'mime-types',
        version: '2.0.14',
        from: 'mime-types@>=2.0.1 <2.1.0',
        path: 'test/npm/request'
      }
    ]
  }
  */

  if (Object.keys(duplicates).length > 0) {
    printFailMessage(duplicates);
    return process.exit(1);
  }

  printSuccessMessage();
}).catch((error) => {
  console.error(error.stack);
  return process.exit(1);
});
```
