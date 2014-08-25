// This script will modify the package.json file and install any providers listed in the providers.json file 
// Then npm install needs to be run to actually install them
var fs = require('fs'),
  pjson = require('./package.json'),
  providers = require('./providers.json');

for (var provider in providers){
  console.log('Adding', provider +': '+ providers[ provider ], 'to package.json');
  pjson.dependencies[ provider ] = providers[ provider ];
}

fs.writeFile('package.json', JSON.stringify(pjson, null, 4));
