const { Box, Either, Right, Left, fromNullable } = require('../examples/lib')
const { List } = require('immutable-ext')
const Task = require('data.task')

// general isomorphism signature
const Iso = (to, from) => ({
  to,
  from
})

// isomorphisms String <-> Array
const chars = Iso(
  s => s.split(''),
  c => c.join('')
)

console.log(
  chars.to('hello world'),
  chars.from(chars.to('hello world'))
)

// switch to arrays, play, and switch back to strings
const truncate = str =>
  chars.from(
    chars
    .to(str)
    .slice(0, 3)
    .concat('...')
  )

console.log(
  'hello world truncated is:',
  truncate('hello world')
)


// [a] ~ Either null a

const singleton = Iso(

  // Either into Array
  // 'fold' is used to extract value
  e => e.fold( _ => [], x => [x] ),

  // Array into Either
  ([x]) => x ? Right(x) : Left()
)

// filtering Either type objects
// transform to Array, filter, than back to Either
const filterEither = (e, pred) =>
  singleton
  .from(
    singleton
    .to(e)
    .filter(pred)
  )

const res = filterEither(
  Right('hello'),
  x => x.match(/h/ig)
)
.map( x => x.toUpperCase() )

const res1 = filterEither(
  Right('ello'),
  x => x.match(/h/ig)
)
.map( x => x.toUpperCase() )

console.log(res, res1)

