const Task = require('data.task')

const showErr = e => console.log('err :', e)
const showSuc = x => console.log('success: ', x)

const formTask = val =>
  Task.of( val )
    .fork( showErr, showSuc )

console.log(`formTask(44) : `)
formTask(44)

console.log(`Task.rejected(81).map( x => x + 1 ).fork( showErr, showSuc) : `)
Task.rejected(81)

  // will be ignored as task already rejected
  .map( x => x + 1 )
  .fork( showErr, showSuc)


// wraps plain value into a task
console.log(`Task.of(13).map( x => x + 1 ).chain( x => Task.of(x+1) ).fork( showErr, showSuc) : `)
Task.of(13)

  // use plain functions inside 'map'
  .map( x => x + 1 )

  // use functions into lifted types inside 'chain'
  .chain( x => Task.of(x+1) )

  // kick of the task only here
  // allows to defer or prevent the execution
  .fork( showErr, showSuc)


const launchMissiles = _ =>
  new Task( (rej, res) => {
    console.log("launch missile!")
    res("missile")
  })

console.log(`launchMissiles().fork( showErr, showSuc)`)
launchMissiles().fork( showErr, showSuc)

console.log(`launchMissiles().map( x => x + "...FIRE" ).fork( showErr, showSuc)`)

launchMissiles()
  .map( x => x + "...FIRE" )

  // only this will actually perform the task
  .fork( showErr, showSuc)
