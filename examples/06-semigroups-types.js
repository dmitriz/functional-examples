// https://github.com/DrBoolean/immutable-ext
// Map delegates 'concat' method to its values:
// https://github.com/DrBoolean/immutable-ext/blob/master/browser_dist/index.js#L51
const { Map, List } = require('immutable-ext')

// helper functions
const Right = x => (
  {
    chain: f => f(x),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    inspect: () => `Right(${x})`
  }
)
const Left = x => (
  {
    chain: f => Left(x),
    map: f => Left(x),
    fold: (f, g) => f(x),
    inspect: () => `Left(${x})`
  }
)


// Sum container adds semigroup structure
// via the 'concat' method
const Sum = x => ({

  //  make x accessible via the 'x' prop
  x,

  // destructuring value for the key 'x'
  // equivalent to y = argument.x
  // Usage: Sum(n).concat(Sum(m)) //=> Sum(n+m)
  concat: ({x: val}) => Sum(x + val),

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
  concat: ({x: val}) => All(x && val),

  // custom getter used by console.log
  inspect: _ => `All(${x})`
})

console.log(
  'All(true).concat(All(false)): ',
  All(true).concat(All(false))
)

console.log(
  'All(true).concat(All(true)): ',
  All(true).concat(All(true))
)



const First = x => ({
  x,

  // throw away the arg and keep our First
  concat: _ => First(x),

  // custom getter used by console.log
  inspect: _ => `First(${x})`
})


console.log(
  `First('I am the first').concat(First('I am the second')) : `,
  First('I am the first').concat(First('I am the second'))
)


// use Map to combine the 'concats' for different types
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

// testing
console.log(
  `acct1.concat(acct2) : `,
  res.toJS()
)



// List from 'immutable-ext' implements 'foldMap(f, empty)'
// which runs 'reduce' over the 'concat' of the target type of 'f'
console.log(
  `List([1,2,3]).foldMap(x => [x, 10]) : `,
  List([1,2,3]).foldMap(x => [x, 10])
)
console.log(
  `List([]).foldMap(x => [x, 10], []) : `,
  List([]).foldMap(x => [x, 10], [])
)
console.log(
  `List([1,2,3]).foldMap(x => First(x)) : `,
  List([1,2,3]).foldMap(x => First(x))
)
