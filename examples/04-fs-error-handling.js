const fs = require('fs')

const Right = x => (
  {

    // like map but returns "unboxed" value
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

const getPort = fileName =>

  // this will not "explode" if fileName is not found!
  tryCatch( () => fs.readFileSync(fileName) )
    .map( c => JSON.parse(c) )

    // .map(c => tryCatch(() => JSON.parse(c)))
    .fold(

      // default port in case of error
      e => 3000,
      c => c.port
    )

// no file passed
console.log(`getPort() : `, getPort()) //=> 3000

// file not present
console.log(`getPort('con.json') : `, getPort('con.json')) //=> 3000

// file present
console.log(`getPort('config.json') : `, getPort('config.json')) //=> 8080



// protecting against further errors by wrapping into tryCatch
const getPortSafe = fileName =>
  tryCatch( () => fs.readFileSync(fileName) )
  .chain( c => tryCatch(() => JSON.parse(c)) )
  .fold(
    e => 3000,
    c => c.port
  )


console.log(`getPortSafe() : `, getPortSafe()) //=> 3000
console.log(`getPortSafe('con.json') : `, getPortSafe('con.json')) //=> 3000

// importing badly formatted file
console.log(`getPortSafe('configBad.json') : `, getPortSafe('configBad.json')) //=> 3000
console.log(`getPortSafe('config.json') : `, getPortSafe('config.json')) //=> 8080
