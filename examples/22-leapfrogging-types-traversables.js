const fs = require('fs')

const Task = require('data.task')
const { List } = require('immutable-ext')

// https://github.com/futurize/futurize
const FutureTask = require('futurize').futurize(Task)

// (lazy) task to read file
// FutureTask simply applies to the callback-based function inside
const readFileTask = FutureTask(fs.readFile)

// need to wrap into List that provides 'traverse'
const files = List(['config.json', 'config1.json'])

console.log(
  `List(['config.json', 'config1.json']).traverse(Task.of, fn => readFileTask(fn, 'utf-8')).fork(..., ...) : `
)

files

  // we have list of files but want task of lists
  // 1st argument 'Task.of' lifts to Task - applicative functor
  //  (needed as type hint in case of failure or never running the function)
  // 2nd argument is traversing function a -> f b
  .traverse( Task.of, fn => readFileTask(fn, 'utf-8') )
  .fork(console.error, console.log)
