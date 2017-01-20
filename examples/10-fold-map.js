// folding a type

const { Map, List } = require('immutable-ext')
const { Sum } = require('../examples/monoid')


const res = List.of(Sum(1), Sum(33), Sum(4))

  // raw value from the list via concat
  // provide value to start from
  .fold(Sum.empty())

console.log(res)


const r1 = Map({ brian: 3, sara: 5 })
  .map(Sum)
  .fold(Sum.empty())

const r11 = Map({ brian: 3, sara: 5 })

  // run function Sum on each value, then fold
  .foldMap(Sum, Sum.empty())

console.log(r1, r11)


const r2 = List.of(1,3,45)
  .foldMap(Sum, Sum.empty())

console.log(r2)
