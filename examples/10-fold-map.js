// folding a type

const { Map, List } = require('immutable-ext')

const Sum = x =>
({
  x,
  concat: ({x: val}) =>
    Sum(x + val),
  inspect: () => `Sum(${x})`
})
Sum.empty = () => Sum(0)


const res = List.of(Sum(1), Sum(33), Sum(4))

  // raw value from the list via concat
  // provide value to start from
  .fold(Sum.empty())

console.log(
  `List.of(Sum(1), Sum(33), Sum(4)).fold(Sum.empty()) : `,
  res
)


const r1 = Map({ brian: 3, sara: 5 })
  .map(Sum)
  .fold(Sum.empty())

console.log(
  `Map({ brian: 3, sara: 5 }).map(Sum).fold(Sum.empty()) : `,
  r1
)


// run function Sum on each value, then fold
const r11 = Map({ brian: 3, sara: 5 })
  .foldMap(Sum, Sum.empty())

console.log(
  `Map({ brian: 3, sara: 5 }).foldMap(Sum, Sum.empty()) : `,
  r11
)


const r2 = List.of(1,3,45)
  .foldMap(Sum, Sum.empty())

console.log(
  `List.of(1,3,45).foldMap(Sum, Sum.empty()) : `,
  r2
)
