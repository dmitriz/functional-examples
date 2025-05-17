// identity functor
const Box = x => (

  // container object wrapping x
  {
    // Now x is available in the closure instead of 'this'

    // functor map, sends f:a->b into map(f):Box(a)->Box(b),
    // the same as f(x) but wrapped into the Box container,
    // so we can keep chaining
    map: f => Box(f(x)),

    // not part of functor spec
    // applies f and returns the raw unwrapped value,
    // sends f:a->b into fold(f):Box(a)->b,
    // does not return any Box container, so can't be chained with map
    fold: f => f(x),

    // custom getter function -- called by console.log
    inspect: () => x.inspect ? `Box(${x.inspect()})` : `Box(${x})`
  }
)

// String => Box(String)
const moneyToFloat =  str =>
  Box(str)
    .map(s => s.replace(/\$/g, ''))
    .map(r => parseFloat(r))
    // .fold(r => parseFloat(r))

// String => Box(String)
const percentToFloat = str =>
  Box(str.replace(/\%/g, ''))
    .map(replaced => parseFloat(replaced))
    .map(number => number * 0.01)
    // .fold(number => number * 0.01)


// function of 2 arguments!
// need to .fold twice to get back the value
const applyDiscount = (price, discount) =>

  // already in container Box,
  // otherwise we would need to wrap it as Box(moneyToFloat(price))
  moneyToFloat(price)

    // no further chaining, so get the value
    .fold(cost =>

      // pick the 2nd argument
      percentToFloat(discount)

        // also here get the value
        .fold(savings =>

          // cost is available in the closure
          // as result of previous calculations
          cost - cost * savings
        )
    )


// without fold, result is wrapped into Box twice
const applyDiscountInBox = (price, discount) =>
  moneyToFloat(price).map(cost =>

    // nesting so cost remains in scope
    percentToFloat(discount).map(savings =>
      cost - cost * savings
    )
  )


console.log(`moneyToFloat(' $33 ') : `, moneyToFloat(' $33 ')) //=> Box(33)
console.log(`percentToFloat(' 1.23% ') : `, percentToFloat(' 1.23% ')) //=> Box(0.0123)

const result = applyDiscount('$55', '20%')

console.log(`applyDiscount('$55', '20%') : `, result) //=> 44

console.log(
  `applyDiscountInBox('$55', '20%') : `, 
  applyDiscountInBox('$55', '20%')
) //=> Box(Box(44))

