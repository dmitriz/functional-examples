const Box = x => ({
  // b2 must be a boxed function Box(f)
  ap: b2 => b2.map(x),

  // f must be from any type a to any type b
  map: f => Box(f(x)),

  // f must be from any type a into the boxed type Box(a)
  chain: f => f(x),
  fold: f => f(x),
  inspect: () => `Box(${x})`
})


// fantasy-land compliant box
const BoxFL = x => ({
  // apply unboxed function inside the box
  ap: Bf => BoxFL(Bf.fold(x => x)(x)),
  map: f => BoxFL(f(x)),
  chain: f => f(x),
  fold: f => f(x),
  inspect: () => `BoxFL(${x})`
})


const res =

  // wrap the function into the Box
  Box( x => x + 1 )

  // apply our wrapped function to the Box'ed value 2
  .ap(Box(2))

// This uses switched order comparing
// to the Fantasy Land applicative spec
// ap :: f a ~> f (a -> b) -> f b
// https://github.com/fantasyland/fantasy-land#ap-method

console.log(
  `Box(x => x + 1).ap(Box(2)) : `,
  res
) //=> Box(3)

console.log(
  `BoxFL(2).ap(BoxFL(x => x + 1)) : `,
  BoxFL(2).ap(BoxFL(x => x + 1))
) //=> Box(3)



// apply Box'ed curried function
// to 1st and then 2nd argument
const res1 = Box( x => y => x + y )
  .ap(Box(2)).ap(Box(3))

console.log(
  `Box(x => y => x + y).ap(Box(2)).ap(Box(3)) : `,
  res1
)

console.log(
  `BoxFL(3).ap(BoxFL(2).ap(BoxFL(x => y => x + y))) : `,
  BoxFL(3).ap(BoxFL(2).ap(BoxFL(x => y => x + y)))
)


// lift f to function on Box'es
// 2nd argument 'fx' is a lifted object (e.g. Box'ed), which has 'map' method
// 'fx.map(f)' is 'f' lifted and partially applied to 'fx'
// which result is lifted and applied to 'fx' with 'ap' method
const liftA2 = (f, fx, fy) =>
  fx.map(f).ap(fy)

const add = x => y => x + y

console.log(
  `liftA2(add, Box(2), Box(4)) : `,
  liftA2(add, Box(2), Box(4))
)
// -> Box(6)

console.log(
  `liftA2(x => y => x - y, Box(2), Box(4)) : `,
  liftA2(x => y => x - y, Box(2), Box(4))
)
// -> Box(-2)


// static syntax
// ap(Fg)(Fx, Fy)
const ap = Fg => (Fx, Fy) => Fg.ap(Fx).ap(Fy)

console.log(
  `ap(Box(x => y => x - y))(Box(2), Box(5)) : `,
  ap(Box(x => y => x - y))(Box(2), Box(5))
)

// liftA2cur(g)(Fx, Fy)
const liftA2cur = g => (Fx, Fy) => liftA2(g, Fx, Fy)

console.log(
  `liftA2cur(x => y => x - y)(Box(1), Box(5)) : `,
  liftA2cur(x => y => x - y)(Box(1), Box(5))
)
