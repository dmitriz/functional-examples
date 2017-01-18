// https://github.com/DrBoolean/immutable-ext
// Map extends 'concat' method to components:
// https://github.com/DrBoolean/immutable-ext/blob/master/browser_dist/index.js#L51
const {Map} = require('immutable-ext')


const Sum = x =>
({
  x,

  // destructuring value for the key 'x'
  concat: ({x: y}) =>
    Sum(x + y),

  // custom getter used by console.log
  inspect: () => `Sum(${x})`
})


const All = x =>
({
  x,
  concat: ({x: y}) =>
    All(x && y),

  // custom getter used by console.log
  inspect: () => `All(${x})`
})



const First = x =>
({
  x,
  // throw away the arg and keep our First
  concat: _ => First(x),

  // custom getter used by console.log
  inspect: () => `First(${x})`
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

// individual custom 'concat' applies in each component
const res = acct1.concat(acct2)

console.log(res.toJS())
