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

module.exports = {Sum, All, First}
