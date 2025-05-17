const { List, Map } = require('immutable-ext')
const { Box } = require('../examples/lib')

// identity function
const id = x => x


const res1 = Box('squirrels')

  // compose maps between Box'es
  // compose( map(f), map(g) )
  .map( s => s.substr(5) )
  .map( s => s.toUpperCase() )

const res2 = Box('squirrels')
  // compose raw functions first and form map after
  // map( compose( f, g ) )
  .map( s => s.substr(5).toUpperCase() )

console.log(
  `Box('squirrels').map(s => s.substr(5)).map(s => s.toUpperCase()) : `,
  res1
)

console.log(
  `Box('squirrels').map(s => s.substr(5).toUpperCase()) : `,
  res2
)


// identity pre- or post-composed
const res31 = Box('crayons').map(id)
const res32 = id(Box('crayons'))
const res41 = List.of('crayons').map(id)
const res42 = id(List.of('crayons'))

console.log(
  `Box('crayons').map(id) : `,
  res31
)
console.log(
  `id(Box('crayons')) : `,
  res32
)
console.log(
  `List.of('crayons').map(id) : `,
  res41
)
console.log(
  `id(List.of('crayons')) : `,
  res42
)
