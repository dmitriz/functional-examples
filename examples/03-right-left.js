const Right = x => (
  {

    // Right applies f to x
    map: f => Right(f(x)),

    // applies the function on the right and returns raw value
    fold: (f, g) => g(x),

    // custom getter function -- called by console.log
    inspect: () => `Right(${x})`
  }
)

const Left = x => (
  {

    // Left ignores f, simply passes ahead raw value x
    map: f => Left(x),

    // applies the function on the left and returns raw value
    fold: (f, g) => f(x),

    // custom getter function -- called by console.log
    inspect: () => `Left(${x})`
  }
)


// this will apply the functions
const resultRight = Right(3)
  .map(x => x + 1)
  .map(x => x / 2)

// this will ignore all functions and return itself
const resultLeft = Left(3)
  .map(x => x + 1)
  .map(x => x / 2)

console.log(`Right(3) transformed: `, resultRight) //=> Right(2)
console.log(`Left(3) transformed: `,resultLeft) //=> Left(3)


// passing Right value,
// all functions are applied
// and result is returned
const result = Right(2)
  .map(x => x + 1)
  .map(x => x / 2)

  // left function handles error, right function returns the value
  .fold(x => 'error', x => x)

console.log(`Right(2) transformed and unwrapped with (x => 'error', x => x): `, result) //=> 1.5


// passing Left value,
// so all functions are ignored
// and error is returned
const resultError = Left(2)
  .map(x => x + 1)
  .map(x => x / 2)

  // left function handles error, right function returns the value
  .fold(x => 'error', x => x)

console.log(`Left(2) transformed and unwrapped with (x => 'error', x => x): `, resultError) //=> error


const findColor = name =>

  // need to wrap the object in parentheses
  // to avoid confusion with function block
  ({red: '#ff4444', blue: '#00ff00'})[name]

// would generate error if the 'red' key were not defined
const resultColor = findColor('red')
  .slice(1)
  .toUpperCase()

console.log(`findColor('red') transformed is: `, resultColor)


const findColorCases = name => {
  const found = {red: '#ff4444', blue: '#00ff00'}[name]
  return found ? Right(found) : Left(null)
}

console.log(`findColorCases('gray') is: `, findColorCases('gray')) //=> no color


const badColor = findColorCases('gray')

  // map only applies when passed Right,
  // ignored when passed Left
  .map(c => c.slice(1))
  .fold(
    e => 'no color',
    c => c.toUpperCase()
  )

console.log(`findColorCases('gray') transformed and fold with (e => 'no color', c => c.toUpperCase()) is: `, badColor) //=> no color



// ensure null (of any falsey value) will always go to Left
const fromNullable = x =>
  x != null ? Right(x) : Left(null)

// no need anymore to worry about null in our logic
// much simpler function, no more cases
const findColorFromNullable = name =>
  fromNullable({red: '#ff4444', blue: '#00ff00'}[name])


const badColorNew = findColorFromNullable('gray')

  // map only applies when passed Right,
  // ignored when passed Left
  .map(c => c.slice(1))
  .fold(
    e => 'no color',
    c => c.toUpperCase()
  )

console.log(
  `findColorFromNullable('gray') transformed and fold with (e => 'no color', c => c.toUpperCase()) is: `, 
  badColorNew
) //=> no color

