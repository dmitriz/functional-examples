const Task = require('data.task')

const Db = {

  // find project by id
  // wrap finding into a Task
  find: id => new Task(
      (rej, res) => setTimeout(
        _ => res( {id: id, title: `Project ${id}`} ),
        100
      )
    )
}


// I am just a pure function!
// I only know how to turn my args into report
// I don't know anything about the database where they come from
const reportHeader = (p1, p2) =>
  `Report: ${p1.title} compared to ${p2.title}`


console.log(
  `Task.of(p1 => p2 => reportHeader(p1, p2)).ap(Db.find(20)).ap(Db.find(8)).fork(..., ...) : `
)

// curried Task to be applied twice
// plain function inside!
Task.of( p1 => p2 => reportHeader(p1, p2) )

  // apply to both values kicked asyncronously
  .ap(Db.find(20))
  .ap(Db.find(8))

  // Task will wait for both async processes to finish
  // before reporting to console!
  .fork( console.error, console.log )
  
// => Report: Project 20 compared to Project 8
