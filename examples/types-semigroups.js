const result = [1,3].concat([4,5]).concat([5,6,7])

console.log(result)


const Sum = x =>
({
  // x is our number

  // need to expose x,
  // so we can use o.x below
  x,
  concat: o =>
    Sum(x + o.x),

  // custom getter used by console.log
  inspect: () => `Sum(${x})`
})

const resSum = Sum(1).concat(Sum(2))

console.log(resSum)



const SumD = x =>
({
  // x is our number

  // need to expose x,
  // so we can use key 'x' below
  x,

  // destructuring value for the key 'x'
  concat: ({x: y}) =>
    SumD(x + y),

  // custom getter used by console.log
  inspect: () => `SumD(${x})`
})

const resSumD = SumD(11).concat(SumD(222))

console.log(resSumD)




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

console.log(resFalse)
console.log(resTrue)




const First = x =>
({
  x,

  // throw away the arg and keep our First
  concat: _ => First(x),

  // custom getter used by console.log
  inspect: () => `First(${x})`
})

const resFirst = First("bla").concat(First("last"))

console.log(resFirst)
