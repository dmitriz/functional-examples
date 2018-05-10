const { Promise: CreedPromise } = require('creed')

const launchMissilesCreed = _ =>
  new CreedPromise( res => {
    console.log("launch missile from Creed!")
    res("missile")
  })

const launchMissilesPromise = _ =>
  new Promise( res => {
    console.log("launch missile from Promise!")
    res("missile")
  })

launchMissilesCreed()
  .map( x => x + "...FIRE" )
  .map( console.log )

launchMissilesPromise()
  .then( x => x + "...FIRE" )
  .then( console.log )


const suspendedMissile = name => ({
  first: _ => console.log(`${name} missile is ready...`),
  then: _ => console.log(`${name} missile is launched!!!`)
})

const suspendedLaunchCreed = CreedPromise.of(suspendedMissile('Creed'))

const suspendedLaunchPromise = _ =>
   // return suspended missile inside function,
  Promise.resolve({then: _ => {
    console.log("Promise missile is launched!!!")
  }})

suspendedLaunchCreed
  // execute instruction
  .then(instruction => instruction.then())

suspendedLaunchPromise()
// missiled is launched by itself -- danger!
