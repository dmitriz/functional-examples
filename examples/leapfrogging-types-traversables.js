const fs = require('fs')

const Task = require('data.task')
const { List } = require('immutable-ext')

// https://github.com/futurize/futurize
const futurize = require('futurize').futurize(Task)

// lazy task
const readFile = futurize(fs.readFile)

// need to wrap into List that provides 'traverse'
const files = List(['box.js', 'config.json'])

files

  // Task will go outside of the array of files
  // 1st argument 'Task.of' is an applicative functor
  .traverse( Task.of, fn => readFile(fn, 'utf-8') )
  .fork(console.error, console.log)
