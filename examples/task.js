const Task = require('data.task')

const showErr = e => console.log('err :', e)
const showSuc = x => console.log('success: ', x)

const formTask = val =>
  Task.of(val)
  .fork( showErr, showSuc  )

formTask(44)
formTask(null)


Task.rejected(81)

  // will be ignored as task already rejected
  .map( x => x + 1 )
  .fork( showErr, showSuc)


Task.of(13)
  .map( x => x + 1 )
  .chain( x => Task.of(x+1) )
  .fork( showErr, showSuc)


const launchMissiles = () =>
  new Task( (rej, res) => {
    console.log("launch missile!")
    res("missile")
  })

launchMissiles()
  .map( x => x + "!" )

  // only this will actually perform the task
  .fork( showErr, showSuc)
