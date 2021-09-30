#!/usr/bin/env node

const { exec } = require('child_process')
exec(`npx http-server ${__dirname}`)
console.log('server running at http://localhost:8080/')
