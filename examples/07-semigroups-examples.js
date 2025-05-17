const { Map } = require('immutable-ext')

const result = [1,3].concat([4,5]).concat([5,6,7])
console.log(
  `[1,3].concat([4,5]).concat([5,6,7]) : `,
  result
)


const Sum = x =>
({
  // need to expose x,
  // so we can use o.x below
  x,
  concat: o =>
    Sum(x + o.x),

  // custom getter used by console.log
  inspect: () => `Sum(${x})`
})

const resSum = Sum(1).concat(Sum(2))
console.log(`Sum(1).concat(Sum(2)) : `, resSum)



const SumD = x =>
({
  x,
  // destructuring value for the key 'x'
  concat: ({x: y}) =>
    SumD(x + y),

  // custom getter used by console.log
  inspect: () => `SumD(${x})`
})

const resSumD = SumD(11).concat(SumD(222))
console.log(`SumD(11).concat(SumD(222)) : `, resSumD)




const All = x =>
({
  x,
  concat: ({x: y}) =>
    All(x && y),

  // custom getter used by console.log
  inspect: () => `All(${x})`
})

const resFalse = All(true).concat(All(false))
const resTrue = All(true).concat(All(true))

console.log(`All(true).concat(All(false)) : `, resFalse)
console.log(`All(true).concat(All(true)) : `, resTrue)



const First = x =>
({
  x,

  // throw away the arg and keep our First
  concat: _ => First(x),

  // custom getter used by console.log
  inspect: () => `First(${x})`
})

const resFirst = First("bla").concat(First("last"))

console.log(`First("bla").concat(First("last")) : `, resFirst)


// Wrap each prop into corresponding Semigroup!

// User account 1
const acc1 = Map({

  // First takes first when combined
  name: First('Nico'),

  // All applies logical all
  isPaid: All(true),

  // Sum sums the numbers when combined
  points: Sum(10),

  // Array already has 'concat' method
  friends: ['Franklin']
})

const acc2 = Map({
  name: First('Nico'),
  isPaid: All(false),
  points: Sum(2),
  friends: ['Gatsby']
})

const res = acc1.concat(acc2)

console.log(
  'Combine: ', acc1.toJS(),
  '\n with: ', acc2.toJS(),
  '\n yields: ', res.toJS()
)
