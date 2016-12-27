const fs = require('fs')

const Right = x => (
  {
    chain: f => f(x),

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
    chain: f => Left(x),

    // Left ignores f, simply passes x itself
    map: f => Left(x),

    // applies the function on the left and returns raw value
    fold: (f, g) => f(x),

    // custom getter function -- called by console.log
    inspect: () => `Left(${x})`
  }
)


// ensure null will always go Left
const fromNullable = x =>
  x != null ? Right(x) : Left(null)


// encapsulate try/catch only here
const tryCatch = f => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}

const getPort = (fileName) =>
  tryCatch( () => fs.readFileSync(fileName) )
    .map(c => JSON.parse(c))
    
    // .map(c => tryCatch(() => JSON.parse(c)))
    .fold(
      e => 3000,
      c => c.port
    )

console.log(getPort()) //=> 3000
console.log(getPort('con.json')) //=> 3000
console.log(getPort('config.json')) //=> 8080



const getPortNew = (fileName) =>
  tryCatch(() => fs.readFileSync(fileName))
  .chain(c => tryCatch(() => JSON.parse(c)))
  .fold(
    e => 3000,
    c => c.port
  )


console.log(getPortNew()) //=> 3000
console.log(getPortNew('con.json')) //=> 3000

// importing badly formatted file
console.log(getPortNew('configBad.json')) //=> 3000
console.log(getPort('config.json')) //=> 8080

