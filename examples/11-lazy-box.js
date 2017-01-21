// leaving old Box for comparison
const Box = x => ({
    map: f => Box(f(x)),
    fold: f => f(x),
    inspect: _ => `Box(${x})`,
})

// wraps a function returning value without executing its call
const LazyBox = g => ({

  // compose with f from outside
  map: f => LazyBox( _ => f(g()) ),

  // compose and evaluate
  fold: f => f(g())
})


const nextCharForNumberString = str =>

  // wrap 'str' first into function call
  LazyBox( () => str )

  // every 'map' composes with new function from outside
  // without calling it
  .map(s => s.trim())
  .map(r => parseInt(r))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))

  // compose again and call the function
  .fold(s => s.toLowerCase())

console.log(nextCharForNumberString(' 64 '))


// ==== Experiment

// The bove LazyBox needs a function and ignores its arguments.
// It must be called every time as LazyBox( () => val ),
// which may not be convenient to consume
// It may be more convenient to pass the actual value:


// TODO === not finished yet

const LazyWrapper = x => ({

  wrapper: () => x,

  // compose with f from outside
  map: f => LazyWrapper( f(x) ),

  // compose and evaluate
  fold: f => f(x)
})

const nextCharForNumberString1 = str =>

  // wrap 'str' first into function call
  LazyWrapper( str )

  // every 'map' composes with new function from outside
  // without calling it
  .map(s => s.trim())
  .map(r => parseInt(r))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))

  // compose again and call the function
  .fold(s => s.toLowerCase())

console.log(nextCharForNumberString1(' 64 '))


