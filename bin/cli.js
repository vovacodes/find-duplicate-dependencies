#!/usr/bin/env node

import process from 'node:process';
import { inspect } from 'node:util';
import pc from 'picocolors';
import findDuplicateDependencies from '../find-duplicate-dependencies.js';
import minimist from "minimist"

const argv = minimist(process.argv.slice(2));
const exclude = argv.exclude?.split(",") ?? [];

findDuplicateDependencies({ exclude }).then((duplicates) => {
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
  console.log(pc.green('There are no duplicate dependencies in your package. Congratulations!'));
}

function printFailMessage(duplicates) {
  console.log(pc.red('This package has the following duplicate dependencies:\n'));

  for (const key of Object.keys(duplicates)) {
    console.log(`${pc.red(key)}:`);
    console.log(inspect(duplicates[key], { colors: true }), '\n');
  }

  console.log(pc.red('Please run "npm dedupe" to see if that could be fixed. If not, manually resolve version conflicts'));
}
