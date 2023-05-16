// this file is added to the bundle as assets/example-config.js and can be used in demos for loader configuration
// ("imports" variable below is automatically computed & replaced during build)

// uses ES5 syntax
(function () {
  var cdnBaseUri = new URL(document.currentScript.getAttribute("data-orig-src") || document.currentScript.src).origin;
  var imports = {}; // this line will be auto-replaced by devkit
  for (var k in imports) imports[k] = new URL(imports[k], cdnBaseUri).toString();

  // for custom imports use this syntax:
  // imports["uu_customlibg01"] = new URL("/uu-customlibg01/1.0.0/uu_customlibg01.min.js", cdnBaseUri).toString();

  window.Uu5Loader.config({ imports: imports });
})();
