// https://github.com/folktale/data.task
// part of Folktale https://github.com/origamitower/folktale
const Task = require('data.task')

// for comparison use
// https://github.com/Avaq/Fluture
const Fluture = require('fluture')

// standard Nodejs library for file access
const fs = require('fs')

// general purpose handlers for errors and success
const showErr = e => console.log('err :', e)
const showSuc = x => console.log('success: ', x)


// general purpose Task for reading file
const readFileTask = (fileName, encoding) =>
  new Task((rej, res) =>
    fs.readFile(
      fileName,
      encoding,
      (err, contents) => err ? rej(err) : res(contents)
    )
  )

const readFileFluture = (fileName, encoding) =>
  Fluture.node(done => fs.readFile(fileName, encoding, done))


// general purpose Task for writing file
const writeFileTask = (fileName, contents) =>
  new Task((rej, res) =>
    fs.writeFile(
      fileName,
      contents,
      (err, success) => err ? rej(err) : res(success)
    )
  )

const writeFileFluture = (fileName, contents) =>
  Fluture.node(done => fs.writeFile(fileName, contents, done))



const app =

  // read file - returns Task
  readFileTask('config.json', 'utf-8')

  // modify contents - plain function inside
  .map( contents => contents.replace(/8/g, '6') )

  // write modified content into new file
  // function with lifted target inside
  .chain( contents => writeFileTask('config1.json', contents) )


console.log(
  `readFile('config.json', 'utf-8').map(contents => contents.replace(/8/g, '6')).chain(contents => writeFile('config1.json', contents)).fork(..., ...) : `
)

// only now launch the task
app.fork( showErr, _ => showSuc("Written to 'config1.json'!") )



// optionally using Fluture
// define the application
const appFl = readFileFluture('config.json', 'utf-8')
  .map( contents => contents.replace(/8/g, '7') )
  .chain( contents => writeFileFluture('config1-fl.json', contents))

console.log(
  `readFileFluture('config.json', 'utf-8').map( contents => contents.replace(/8/g, '7')).chain( contents => writeFileFluture('config1-fl.json', contents)).fork(..., ...)`
)

// now call it
appFl.fork( showErr, _ => showSuc("Written to 'config1-fl.json'!"))



// optionally using Futurize
// https://github.com/futurize/futurize
const { futurize } = require('futurize')
const future = futurize(Task)

// wrap Node's native read and write files into Futures
// (i.e. tasks to be run in the future)
const readFuture = future(fs.readFile)
const writeFuture = future(fs.writeFile)

// setup the task
const app1 = readFuture('config.json', 'utf-8')
    .map( contents => contents.replace(/8/g, '6') )
    .chain( contents => writeFuture('config2.json', contents) )

console.log(
  `readFuture('config.json', 'utf-8').map(contents => contents.replace(/8/g, '6')).chain(contents => writeFuture('config2.json', contents)).fork(..., ...)`
)

// run the task
app1.fork( showErr, _ => showSuc("Written to 'config2.json'!") )
