const { Box, Either, Right, Left, fromNullable } = require('../examples/lib')

const Task = require('data.task')


const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

eitherToTask(Right('nightingale'))
.fork(
  e => console.error('Error: ', e),
  res => console.log('Result: ', res)
)
eitherToTask(Left('errrr'))
.fork(
  e => console.error('Error: ', e),
  res => console.log('Result: ', res)
)


// naturally transform Box to Either
const boxToEither = b =>

  // must go to Right
  // to follow the natural transformation law
  b.fold(Right)

// first transform to Either, than map
const res1 = boxToEither(Box(100))
  .map( x => x * 2 )

// or first map, then transform to Either
const res2 = boxToEither(
  Box(100).map( x => x * 2 )
)

// results should be the same!
console.log(res1, res2)



const boxToEitherBad = b =>

  // does not follow the natural transformation law
  // because Left ignores mapped functions
  b.fold(Left)

// first box, then map
const res21 = boxToEitherBad(Box(100))
  .map( x => x * 2 )

// first map, then box
const res22 = boxToEither(
  Box(100).map( x => x * 2 )
)

// natural transformation law is violated!
console.log(res21, res22)


// transform List into Either
const first = xs =>
  fromNullable(xs[0])

// apply first, then map
const res31 = first([1,2,3]).map( x => x + 1 )

// map array, then apply first
const res32 = first( [1,2,3].map( x => x + 1 ) )

// results are equal!
console.log(res31, res32)

