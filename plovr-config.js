{
    "id": "annotator",
    "paths": ["js", "test/js"],
    "externs":[
        "externs/jquery-1.8.js",
        "externs/rangy.js"
    ],
    "inputs": [
        "annotator.js"
    ],
    "output-wrapper": "(function(){%output%})();",
    "mode": "ADVANCED",
    "level": "VERBOSE",
    "fingerprint": true,
    "treat-warnings-as-errors": true,
    "export-test-functions": true,
    //"pretty-print": true,
    "global-scope-name": "tvsc",
    "checks": {
        "accessControls": "ERROR",
        "ambiguousFunctionDecl": "ERROR",
        "checkRegExp": "ERROR",
        "checkTypes": "ERROR",
        "checkVars": "ERROR",
        "const": "ERROR",
        "constantProperty": "ERROR",
        "deprecated": "ERROR",
        "duplicateMessage": "ERROR",
        "es5Strict": "ERROR",
        "externsValidation": "ERROR",
        "fileoverviewTags": "ERROR",
        "globalThis": "ERROR",
        "internetExplorerChecks": "ERROR",
        "invalidCasts": "ERROR",
        "missingProperties": "ERROR",
        "strictModuleDepCheck": "ERROR",
        "typeInvalidation": "ERROR",
        "undefinedNames": "ERROR",
        "undefinedVars": "ERROR",
        "unknownDefines": "ERROR",
        "uselessCode": "ERROR",
        "visibility": "ERROR"
    },
    "test-template": "test/template.soy",
    "experimental-compiler-options": {
      "generateExports": true
    }
}

