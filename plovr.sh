#!/bin/bash

SOURCES=( $(find ./js -name '*.js') )

gjslint "${SOURCES[@]}"

fixjsstyle "${SOURCES[@]}"

java -jar "../../SVN/iad/branches/closure/v2/compiler/plovr-81ed862.jar" build "plovr-config.js" > "build/annotator.min.js"
