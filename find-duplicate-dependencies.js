'use strict';

var npm = require('npm');
var pairs = require('lodash.pairs');
var zipObject = require('lodash.zipobject');
var Promise = require('es6-promise').Promise;

function findDuplicateDependencies(options) {

  options || (options = {});

  return new Promise(function(resolve, reject) {

    npm.load({production: !options.checkDevDependencies, json: true}, function(err) {

      if (err) return reject(err);

      npm.commands.ls([], true, function(err, packageInfo, packageObj) {

        if (err) return reject(err);

        var catalog = catalogDependencies(packageObj.dependencies, packageObj.name);
        var duplicatePairs = pairs(catalog).filter(function (entry) {
          return entry[1].length > 1;
        });

        resolve(zipObject(duplicatePairs));

      });

    })
  });

}

function catalogDependencies(dependencies, path) {

  return _catalogDependencies({}, dependencies, path);

  function _catalogDependencies(result, dependencies, path) {

    return pairs(dependencies).reduce(function(acc, entry) {

      var name = entry[0];
      var moduleObj = entry[1];

      if (!acc[name]) {
        acc[name] = [];
      }

      acc[name].push({
        name: name,
        version: moduleObj.version,
        from: moduleObj.from,
        path: path
      });

      if (moduleObj.dependencies) {
        return _catalogDependencies(acc, moduleObj.dependencies, path.concat('/' + name));
      }

      return acc;

    }, result);

  }
}

module.exports = findDuplicateDependencies;

