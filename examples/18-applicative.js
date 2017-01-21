const { Box } = require('../examples/lib')

const res =

  // wrap the function into the Box
  Box( x => x + 1 )

  // apply our wrapped function to the Box'ed value 2
  .ap(Box(2))

// This uses switched order comparing 
// to the Fantasy Land applicative spec
// ap :: f a ~> f (a -> b) -> f b

console.log(res) //=> Box(3)


// apply Box'ed curried function
// to 1st and then 2nd argument
const res1 = Box( x => y => x + y )
  .ap(Box(2)).ap(Box(3))

console.log(res1)


// lift f to function on Box'es
// 2nd argument 'fx' is a lifted object (e.g. Box'ed), which has 'map' method
// 'fx.map(f)' is 'f' lifted and partially applied to 'fx'
// which result is lifted and applied to 'fx' with 'ap' method
const liftA2 = (f, fx, fy) =>
  fx.map(f).ap(fy)

const add = x => y => x + y

console.log(liftA2(add, Box(2), Box(4)))
// -> Box(6)
