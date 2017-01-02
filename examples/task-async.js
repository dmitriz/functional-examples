// https://github.com/folktale/data.task
// part of Folktale https://github.com/origamitower/folktale
const Task = require('data.task')

// standard Nodejs library for file access
const fs = require('fs')

// general purpose handlers for errors and success
const showErr = e => console.log('err :', e)
const showSuc = x => console.log('success: ', x)


// general purpose Task for reading file
const readFile = (fileName, encoding) =>
  new Task((rej, res) =>
    fs.readFile(fileName, encoding, (err, contents) =>
      err ? rej(err) : res(contents)
  ))

// general purpose Task for writing file
const writeFile = (fileName, contents) =>
  new Task((rej, res) =>
    fs.writeFile(fileName, contents, (err, success) =>
      err ? rej(err) : res(success)
  ))


const app = () =>

  // read file - returns Task
  readFile('config.json', 'utf-8')

  // modify contents - plain function inside
  .map( contents => contents.replace(/8/g, '6') )

  // write modified content into new file
  // function with lifted target inside
  .chain( contents => writeFile('config1.json', contents) )


// only now launch the task
app().fork( showErr, showSuc )

console.log("Check 'config1.json'!")


// optionally using Futurize
// https://github.com/futurize/futurize
const { futurize } = require('futurize')
const future = futurize(Task)

// wrap Node's native read and write files into Futures
// (i.e. tasks to be run in the future)
const readFuture = future(fs.readFile)
const writeFuture = future(fs.writeFile)

// setup the task
const app1 = () =>
  readFuture('config.json', 'utf-8')
    .map( contents => contents.replace(/8/g, '6') )
    .chain( contents => writeFuture('config2.json', contents) )

// run the task
app1().fork( showErr, showSuc )

console.log("Check 'config2.json'!")

