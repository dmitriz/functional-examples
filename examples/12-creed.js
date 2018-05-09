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



const suspendedLaunchCreed = _ =>
   // return suspended missile inside function,
  CreedPromise.of({then: _ => {
    console.log("Creed missile is launched!!!")
  }})

const suspendedLaunchPromise = _ =>
   // return suspended missile inside function,
  Promise.resolve({then: _ => {
    console.log("Promise missile is launched!!!")
  }})

suspendedLaunchCreed()
  // execute instruction
  .then(instruction => instruction.then())

suspendedLaunchPromise()
// missiled is launched by itself -- danger!
