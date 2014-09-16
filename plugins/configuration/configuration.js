/**
 * @file
 * Plugin to load an configuration file.
 */

// Required modules.
var nconf = require('nconf');

/**
 * Load configutation file from disk.
 *
 * @private
 */
function load(file) {
  nconf.argv()
       .env()
       .file({ "file": file, "search": true });
}

/**
 * Define the Configuration object (constructor).
 */
var Configuration = function(file) {
  // Ensure that the configutation is loaded.
  load(file);
}

/**
 * Get configuration value.
 *
 * @param property
 *   Get configutation with the name given.
 *
 * @return
 *   The value of the configuration option.
 */
Configuration.prototype.get = function get(property) {
  return nconf.get(property);
}

module.exports = function (options, imports, register) {
  var conf = new Configuration(options.filename);

  register(null, {
    "configutaion": conf
  });
}
