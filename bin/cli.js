#!/usr/bin/env node

'use strict';

const process = require('process');
const { inspect } = require('util');
const { green, red } = require('picocolors');
const findDuplicateDependencies = require('../find-duplicate-dependencies.js');

findDuplicateDependencies().then((duplicates) => {
  if (Object.keys(duplicates).length > 0) {
    printFailMessage(duplicates);
    return process.exit(1);
  }

  printSuccessMessage();
}).catch((error) => {
  console.error(error.stack);
  return process.exit(1);
});

function printSuccessMessage() {
  console.log(green('There are no duplicate dependencies in your package. Congratulations!'));
}

function printFailMessage(duplicates) {
  console.log(red('This package has the following duplicate dependencies:\n'));

  for (const key of Object.keys(duplicates)) {
    console.log(`${red(key)}:`);
    console.log(inspect(duplicates[key], { colors: true }), '\n');
  }

  console.log(red('Please run "npm dedupe" to see if that could be fixed. If not, manually resolve version conflicts'));
}
