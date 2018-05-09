// https://github.com/briancavalier/creed
// runNode converts Node API with errback into creed promise
const { runNode } = require('creed')

// standard Nodejs library for file access
const fs = require('fs')

// readFilePromise :: String -> String -> Promise Error Buffer
const readFilePromise = (encoding, fileName) => runNode(fs.readFile, fileName, {encoding})

// writeFilePromise :: String -> String -> Promise Error Buffer
const writeFilePromise = fileName => contents => runNode(fs.writeFile, fileName, contents)


readFilePromise('utf-8', 'config.json')
  .map( contents => contents.replace(/8/g, '6') )
  .chain( writeFilePromise('config-changed.json') )
  .map( _ => console.log("Written to 'config-changed.json'!") )

// config.json
// {
//   "a": "b",
//   "port": 8080
// }

// config-changed.json
// {
//   "a": "b",
//   "port": 6060
// }
