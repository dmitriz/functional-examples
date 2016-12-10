const { Box, Either, Right, Left, fromNullable } = require('../examples/lib')

const Task = require('data.task')


const boxToEither = b =>

  // must go to Right
  // to follow the natural transformation law
  b.fold(Right)

const res1 = boxToEither(Box(100))
  .map( x => x * 2 )

// first map, then transform
const res2 = boxToEither(
  Box(100).map( x => x * 2 )
)

console.log(res1, res2)



const boxToEitherBad = b =>

  // does not follow the natural transformation law
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



const first = xs =>
  fromNullable(xs[0])

// apply first, then map
const res31 = first([1,2,3]).map( x => x + 1 )

// map array, then apply first
const res32 = first( [1,2,3].map( x => x + 1 ) )

// results are equal!
console.log(res31, res32)

