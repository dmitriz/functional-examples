// Native
const fs = require('fs')

// Packages
const { List } = require('immutable-ext')

// https://github.com/briancavalier/creed
// runNode converts Node API with errback into creed promise
const { runNode, Promise: CreedPromise } = require('creed')


// readFilePromise :: String -> String -> Promise Error Buffer
const readFilePromise = (fileName, encoding = 'utf-8') => 
  runNode(fs.readFile, fileName, {encoding})

// wrap into List that provides 'traverse'
const files = List(['file1.txt', 'file2.txt'])

console.log(
  `Running...
  List(['file1.txt', 'file2.txt'])
    .traverse( CreedPromise.of, readFilePromise )
    .then( console.log, console.error ) :
  `
)

/*
  'files' is List of files 'List(a)'
  'map' preserves the List wrapper, so we can get 'List(Promise(a))'
  'traverse' applies the function (a -> f b) to each List entry,
    then lifts the List to Promise of Lists via CreedPromise's 'ap' operator
    running Promises in parallel!
*/

files
  .traverse(
    // type hint, applicative functor
    // needed in case of failure or never running the function
    CreedPromise.of,

    // traversing function a -> f b
    file => readFilePromise(file)
  )
  .then( console.log, console.error )
