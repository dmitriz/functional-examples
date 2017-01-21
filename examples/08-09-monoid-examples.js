const { List } = require('immutable-ext')
const { fromNullable } = require('./lib')

const Sum = x => ({
  x,

  // destructuring value for the key 'x'
  concat: ({x: y}) => Sum(x + y),

  // custom getter used by console.log
  inspect: _ => `Sum(${x})`
})

Sum.empty = _ => Sum(0)





const res = Sum
  .empty()
  .concat(Sum(1))
  .concat(Sum(44))

console.log(res)




const All = x => ({
  x,
  concat: ({x: y}) => All(x && y),

  // custom getter used by console.log
  inspect: _ => `All(${x})`
})

All.empty = _ => All(true)




const resAll = All
  .empty()
  .concat(All(true))
  .concat(All(true))
  .concat(All.empty())

console.log(resAll)



// First cannot be promoted to Monoid!
const First = x => ({
  x,
  // throw away the arg and keep our First
  concat: _ => First(x),

  // custom getter used by console.log
  inspect: _ => `First(${x})`
})




const Max = x => ({
  x,
  concat: ({x: y}) => Max(x > y ? x : y),
  inspect: _ => `Max(${x})`
})

Max.empty = _ => Max(-Infinity)

console.log(
  'Max(4).concat(Max(5)): ',
  Max(4).concat(Max(5))
)

console.log(
  'Max(4).concat(Max(5)).concat(Max(7)): ',
  Max(4).concat(Max(5)).concat(Max(7))
)

console.log(
  'Max.empty().concat(Max(4)).concat(Max(5)).concat(Max(7)): ',
  Max.empty().concat(Max(4)).concat(Max(5)).concat(Max(7))
)



// Wrap semigroup into Either

const Right = x => ({

  // f has lifted values
  chain: f => f(x),

  // assumes x is a lifted function
  ap: other => other.map(x),
  traverse: (of, f) => f(x).map(Right),
  fold: (f, g) => g(x),
  map: f => Right(f(x)),
  concat: o => o.fold(
    err => Left(err),

    // use the concat for x
    res => Right(x.concat(res))
  ),
  inspect: _ => `Right(${x})`
})

const Left = x => ({
  chain: f => f(x),

  // Left ignores apply
  ap: other => Left(x),
  traverse: (of, f) => of(Left(x)),
  fold: (f, g) => f(x),

  // ignore f when apply to Left
  map: f => Left(x),

  // ignore concat when apply to Left
  concat: o => o.fold(
    _ => Left(x),
    y => o
  ),
  inspect: _ => `Left(${x})`
})

const stats = List.of(
  {page: 'Home', views: 40},
  {page: 'About', views: 10},
  {page: 'Blog', views: 4}
)
const totalStats = stats.foldMap(x =>
  fromNullable(x.views).map(Sum),
  Right(Sum(0))
)
// Right(Sum(54))
// console.log(totalStats)




// Wrap Either into First
const FirstEither = either => ({
  fold: f => f(either),
  concat: o => either.isLeft ? o : FirstEither(either),
  inspect: _ => `FirstEither(${either.inspect()})`
})

FirstEither.empty = _ => FirstEither(Left())

console.log(
  FirstEither(Right(55)),
  FirstEither.empty().concat(FirstEither(Right(55)))
)

const find = (xs, f) => List(xs).foldMap(
  x => FirstEither(f(x) ? Right(x) : Left()),
  FirstEither.empty()
)
.fold(x => x)

console.log(
  find([3,4,5,6,7], x => x > 4)
)
// => Right(5) ???


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
