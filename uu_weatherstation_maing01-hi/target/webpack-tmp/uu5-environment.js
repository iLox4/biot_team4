
var devConfig = require("C:\\Users\\Pavel\\Desktop\\Nová složka (2)\\uu5_tutorial_maing01\\uu5_weatherstation_maing01-hi\\env\\development.json").uu5Environment;
var config = require("C:\\Users\\Pavel\\Desktop\\Nová složka (2)\\uu5_tutorial_maing01\\uu5_weatherstation_maing01-hi\\env\\production.json").uu5Environment || {};
if (devConfig) for (var k in devConfig) config[k] = devConfig[k];
window.UU5 = { Environment: config };
