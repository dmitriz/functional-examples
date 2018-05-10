// Native
const fs = require('fs')

// Packages
const Task = require('data.task')
const { List } = require('immutable-ext')

// https://github.com/futurize/futurize
const FutureTask = require('futurize').futurize(Task)

// (lazy) task to read file
// FutureTask wraps the callback-based function inside into Task
const readFileTask = FutureTask(fs.readFile)

// need to wrap into List that provides 'traverse'
const files = List(['config.json', 'config1.json'])

console.log(
  `List(['config.json', 'config1.json'])
  	.traverse(Task.of, fn => readFileTask(fn, 'utf-8'))
  	.fork(..., ...) : `
)

/*
	'files' is List of files 'List(a)'
	'map' preserves the List wrapper, so we can get List of Tasks 'List(Task(a))'
	'traverse' applies the function (a -> f b) to each List entry,
		then lifts the List to Task of Lists via Task's 'ap' operator
		running the tasks in parallel
*/

files
  .traverse(
  	// type hint, applicative functor
  	// needed in case of failure or never running the function
  	Task.of, 
  	// traversing function a -> f b
  	fn => readFileTask(fn, 'utf-8') 
  )
  .fork(console.error, console.log)
