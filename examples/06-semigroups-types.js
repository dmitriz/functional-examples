// https://github.com/DrBoolean/immutable-ext
// Map extends 'concat' method to components:
// https://github.com/DrBoolean/immutable-ext/blob/master/browser_dist/index.js#L51
const {Map} = require('immutable-ext')


// Sum container adds semigroup structure
// via the 'concat' method
const Sum = x => ({

  //  make x accessible via 'x' prop
  x,

  // destructuring value for the key 'x'
  // equivalent to y = argument.x
  // Usage: Sum(n).concat(Sum(m)) //=> Sum(n+m)
  concat: ({x: y}) => Sum(x + y),

  // custom getter used by console.log
  inspect: _ => `Sum(${x})`
})

console.log(
  'Sum(22).concat(Sum(33)): ',
  Sum(22).concat(Sum(33))
)


// All container add logical (boolean) 'concat'
const All = x => ({
  x,
  concat: ({x: y}) => All(x && y),

  // custom getter used by console.log
  inspect: _ => `All(${x})`
})

console.log(
  'All(true).concat(All(false)): ',
  All(true).concat(All(false))
)



const First = x => ({
  x,

  // throw away the arg and keep our First
  concat: _ => First(x),

  // custom getter used by console.log
  inspect: _ => `First(${x})`
})


const acct1 = Map({
  name: First('Nice guy'),
  isPaid: All(true),
  points: Sum(10),
  friends: ['Franklin']
})

const acct2 = Map({
  name: First('Another guy'),
  isPaid: All(false),
  points: Sum(2),
  friends: ['Gatsby']
})


// The semigroup structure combines both objects componentwise
// individual custom 'concat' applies in each component
const res = acct1.concat(acct2)

console.log(res.toJS())



// from the comments to video
// x must be an Either
const FirstEither = x => ({
  fold: f => x.fold(f, f),
  concat: o => x.isLeft ? o : First(x)
})


const find = (xs, f) => List(xs)
  .foldMap(
    x => FirstEither(f(x) ? Right(x) : Left()),
    First.empty
  )
  .fold(x => x)


