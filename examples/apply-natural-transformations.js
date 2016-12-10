const { Box, Either, Right, Left, fromNullable } = require('../examples/lib')

const { List } = require('immutable-ext')

const Task = require('data.task')


const res = List(['hello', 'world'])
  // .chain( x => List(x.split('')) )
  // .map( x => x.split('') )
  .chain( x => x.split('') )

console.log(res)


// safe first element
const first = xs =>
  fromNullable(xs[0])


const largeNumbers = xs =>
  xs.filter( x => x > 100 )

const larger = x =>
  x * 2


const app = xs =>

  // map, then first
  first(
    largeNumbers(xs)
    .map(larger)
  )

console.log(app([2, 400, 5, 1000]))

const app1 = xs =>

  // first, then map
  first(
    largeNumbers(xs)
  )
  .map(larger)

console.log(app1([2, 400, 5, 1000]))




const fake = id =>
  ({
    id: id,
    name: 'user1',
    best_friend_id: id + 1
  })

const Db = ({
  find: id =>
    new Task(
      (rej, res) =>
        res( id > 2 ? Right(fake(id)) : Left(fake('not found')) )
    )
})

const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

Db.find(3)
  .chain(eitherToTask)
  .chain(user => Db.find(user.best_friend_id))
  .chain(eitherToTask)
  .fork(console.error, console.log)

Db.find(2)
  .chain(eitherToTask)
  .chain(user => Db.find(user.best_friend_id))
  .chain(eitherToTask)
  .fork(console.error, console.log)



