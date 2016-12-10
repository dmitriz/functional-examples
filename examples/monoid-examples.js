
const Sum = x =>
({
  x,

  // destructuring value for the key 'x'
  concat: ({x: y}) =>
    Sum(x + y),

  // custom getter used by console.log
  inspect: () => `Sum(${x})`
})

Sum.empty = () => Sum(0)



const All = x =>
({
  x,
  concat: ({x: y}) =>
    All(x && y),

  // custom getter used by console.log
  inspect: () => `All(${x})`
})

All.empty = () => All(true)


// First cannot be promoted to Monoid!
const First = x =>
({
  x,
  // throw away the arg and keep our First
  concat: _ => First(x),

  // custom getter used by console.log
  inspect: () => `First(${x})`
})



const res = Sum
  .empty()
  .concat(Sum(1))
  .concat(Sum(44))

console.log(res)


const resAll = All
  .empty()
  .concat(All(true))
  .concat(All(true))
  .concat(All.empty())

console.log(resAll)


const sum = xs =>
  xs.reduce((acc, x) => acc + x, 0)

const all = xs =>
  xs.reduce((acc, x) => acc && x, true)

const first = xs =>
  xs.reduce((acc, x) => acc)

console.log(sum([1,3,4]))
console.log(all([true, false, true]))

// unsafe if empty array is provided,
// because no Monoid structure
console.log(first([1,3,4]))
