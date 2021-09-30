const { execSync } = require('child_process')

execSync('cp ./package.json ./dist')
execSync('cp ./bin.js ./dist')
execSync('npm publish ./dist --access public')
