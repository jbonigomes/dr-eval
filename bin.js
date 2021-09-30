#!/usr/bin/env node

const port = process.argv[2] || 8080
const { exec } = require('child_process')
exec(`npx http-server ${__dirname} -p ${port}`)
console.log(`server running at http://localhost:${port}/`)
