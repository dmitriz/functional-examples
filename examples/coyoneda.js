// Video: https://www.youtube.com/watch?v=WH5BrkzGgQY

const daggy = require('daggy')
const compose = (f, g) => x => f(g(x))
const id = x => x


//===============Define Coyoneda=========

// create constructor with props 'x' and 'f'
// 'x' is our value, 'f' is a function
const Coyoneda = daggy.tagged('x', 'f')

// map composes the function
Coyoneda.prototype.map = function(f) {
  return Coyoneda(this.x, compose(f, this.f))
}

Coyoneda.prototype.lower = function() {
  return this.x.map(this.f)
}

// lift starts off Coyoneda with the 'id' function
Coyoneda.lift = x => Coyoneda(x, id)


//===============Map over a non-Functor - Set =========

// Set does not have a 'map' method
const set = new Set([1, 1, 2, 3, 3, 4])

console.log("Set([1, 1, 2, 3, 3, 4]) : ", set)


// Wrap set into Coyoneda with 'id' function
const coyoResult = Coyoneda.lift(set)
  .map(x => x + 1)
  .map(x => `${x}!`)

console.log(
  "Coyoneda.lift(set).map(x => x + 1).map(x => `${x}!`): ",
  coyoResult
)


// equivalent to buildUpFn = coyoResult.f, ourSet = coyoResult.x
const {f: builtUpFn, x: ourSet} = coyoResult

console.log("builtUpFn is: ", builtUpFn, "; ourSet is: ", ourSet)

ourSet
  .forEach(n => console.log(builtUpFn(n)))
// 2!
// 3!
// 4!
// 5!


//===============Lift a functor in (Array) and achieve Loop fusion=========
console.log(
  `Coyoneda.lift([1,2,3]).map(x => x * 2).map(x => x - 1).lower() : `,
  Coyoneda.lift([1,2,3])
    .map(x => x * 2)
    .map(x => x - 1)
    .lower()
)
// [ 1, 3, 5 ]



//===============Make Any Type a Functor=========
// Any object becomes a functor when placed in Coyoneda

const Container = daggy.tagged('x')

const tunacan = Container("tuna")

const res = Coyoneda.lift(tunacan)
  .map(x => x.toUpperCase())
  .map(x => x + '!')


const {f: fn, x: can} = res
console.log(fn(can.x))
// TUNA!
