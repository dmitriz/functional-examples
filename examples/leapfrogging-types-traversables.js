const fs = require('fs')

const Task = require('data.task')
const { List } = require('immutable-ext')

// https://github.com/futurize/futurize
const FutureTask = require('futurize').futurize(Task)

// lazy task for readFile
const readFileTask = FutureTask(fs.readFile)

// need to wrap into List that provides 'traverse'
const files = List(['config.json', 'config1.json'])

files

  // we have list of files but want task of lists
  // 1st argument 'Task.of' lifts to Task - applicative functor
  // 2nd argument 
  .traverse( Task.of, fn => readFileTask(fn, 'utf-8') )
  .fork(console.error, console.log)
