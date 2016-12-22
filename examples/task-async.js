// https://github.com/folktale/data.task
// part of Folktale https://github.com/origamitower/folktale
const Task = require('data.task')

// standard Nodejs library for file access
const fs = require('fs')


// general purpose handlers for errors and success
const showErr = e => console.log('err :', e)
const showSuc = x => console.log('success: ', x)


// general purpose Task for reading file
const readFile = (fileName, enc) =>
  new Task( (rej, res) =>
    fs.readFile(fileName, enc, (err, contents) =>
      err ? rej(err) : res(contents)
    ) )


// general purpose Task for writing file
const writeFile = (fileName, contents) =>
  new Task( (rej, res) =>
    fs.writeFile(fileName, contents, (err, success) =>
      err ? rej(err) : res(success)
    ) )


const app = () =>

  // read file
  readFile('config.json', 'utf-8')

  // modify contents
  .map( contents => contents.replace(/8/g, '6') )

  // write modified content into new file
  .chain( contents => writeFile('config1.json', contents) )


// only now launch the task
app().fork( showErr, showSuc )

console.log("Check 'config1.json'!")
