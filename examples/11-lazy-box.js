// leaving old Box for comparison
const Box = x => ({
    map: f => Box(f(x)),
    fold: f => f(x),
    inspect: _ => `Box(${x})`,
})

// wraps a function returning value without executing its call
const LazyBox = g => ({

  // returns function but not evaluate it
  map: f => LazyBox( _ => f(g()) ),

  // compose and evaluate only here!
  fold: f => f(g())
})


const nextCharForNumberString = str =>

  // pass 'str' wrapped into function rather than directly
  LazyBox( _ => str )

  // every 'map' composes with new function from outside without calling it
  .map(s => s.trim())
  .map(r => parseInt(r))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))

  // compose again and call the function
  .fold(s => s.toLowerCase())

console.log(
  `LazyBox(_ => ' 64 ').fold(s => s) : `,
  LazyBox(_ => ' 64 ').fold(s => s)
)

console.log(
  `LazyBox(_ => '       64       ').map(s => s.trim()).fold(s => s) : `,
  LazyBox(_ =>  '       64       ').map(s => s.trim()).fold(s => s)
)

console.log(
  `LazyBox(_ => '       64       ').map(s => s.trim()).map(r => parseInt(r)).map(i => i + 1).fold(s => s) : `,
  LazyBox(_ =>  '       64       ').map(s => s.trim()).map(r => parseInt(r)).map(i => i + 1).fold(s => s)
)

console.log(
  "nextCharForNumberString(' 64 ') : ",
  nextCharForNumberString(' 64 ')
)

