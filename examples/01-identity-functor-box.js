// Identity functor
const Box = x => (

  // Box returns a container object (implicitly) wrapping x
  // no need to reference x directly in this object,
  // as it is available in the closure
  {

    // functor map, sends f:a->b into map(f):Box(a)->Box(b),
    // the same as f(x) but wrapped into the Box container,
    // so we can keep chaining
    map: f => Box(f(x)),

    // not part of the functor spec
    // applies f and returns the raw unwrapped value,
    // sends f:a->b into fold(f):Box(a)->b,
    // does not return any Box container, so can't be chained with map
    fold: f => f(x),

    // custom getter function -- called by console.log in NodeJS
    // in browser use `toString()` and call `console.log(String(x))`
    inspect: () => `Box(${x})`
  }
)

const nextCharForNumberString = str =>
  Box(str)
    .map(s => s.trim())
    .map(r => parseInt(r))
    .map(i => i + 1)
    .map(i => String.fromCharCode(i))

    // returns raw value
    .fold(s => s.toLowerCase())


const result = nextCharForNumberString(' 64 ')

console.log(`console.log displays nextCharForNumberString('64') as: `, result)



// ==== Experiments

console.log(`Box(22) is displayed as: `, Box(22))

const inspectBox = x => (
  {
    // custom getter function -- called by console.log
    inspect: () => `I am wrapping '${x}'`,

    // this one is ignored by console.log
    ins: () => x
  }
)

console.log(`Custom inspect shows 'inspectBox(4)' as: `, inspectBox(4)) //=> I am wrapping '4'
