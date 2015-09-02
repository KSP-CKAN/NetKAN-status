#!/bin/bash

OUTPUT=$1

cp -v src/index.html $OUTPUT/.
cp -Rv node_modules/react/dist $OUTPUT/javascript/react
cp -Rv node_modules/moment/moment.js $OUTPUT/javascript/.
cp -Rv node_modules/moment/min/moment.min.js $OUTPUT/javascript/.
cp -Rv node_modules/fixed-data-table/dist $OUTPUT/javascript/fixed-data-table

babel src/javascript --out-dir $OUTPUT/javascript
