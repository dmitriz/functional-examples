const { List } = require('immutable-ext')

const res = List.of( x => x )
  .ap(List([1,2,3]))

console.log(res)


const merch = _ =>
  List.of( x => y => `${x}-${y}`)

  // partially apply to list of values 'x'
  .ap(List(['T-shirt', 'sweater']))

  // apply to list of values 'y' and flatten to single list
  .ap(List(['large', 'medium', 'small']))

console.log(merch())
