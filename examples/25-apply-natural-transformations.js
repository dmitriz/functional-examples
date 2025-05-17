const { Box, Either, Right, Left, fromNullable } = require('../examples/lib')

const { List } = require('immutable-ext')

const Task = require('data.task')

// 'chain' (aka 'flatMap') does not exist on the array,
// so we apply natural transformation into the List first
// array -> List(array) is a natural transformation, it changes structure but not content
const res = List(['hello', 'world'])
  .chain( x => List(x.split('')) )

console.log(`
  List(['hello', 'world'])
    .chain( x => List(x.split('')) ) : 
  `,
  res
)


// natural tranformation from array to Either
// safe first element
const first = xs =>
  fromNullable(xs[0])


const largeNumbers = xs =>
  xs.filter( x => x > 100 )

const larger = x =>
  x * 2


// 'first' is a natural transform, so it commutes with 'map'
// 'first' changes structure but not content
// 'map' is functor transform, it changes content but not structure

const app = xs =>
  // map, then first
  first(
    largeNumbers(xs)
      .map(larger)
  )

console.log(`
  app([2, 400, 5, 1000]) : `,
  app([2, 400, 5, 1000])
)

const app1 = xs =>
  // first, then map
  first(largeNumbers(xs))
    .map(larger)

console.log(`
  app1([2, 400, 5, 1000]) : `,
  app1([2, 400, 5, 1000])
)



// --- Database Example --- //

// fake user returned by id for testing purposes
const fake = id => ({
  id: id,
  name: 'user1',
  best_friend_id: id + 1
})

const Db = ({
  find: id => new Task(
    (rej, res) =>
      // simulate error 'not found' for id <= 2
      res( id > 2 ? Right(fake(id)) : Left(fake('not found')) )
  )
})

// natural transform Either to Task
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)


// valid user (id > 2)
// -> Task returns Either
console.log(`
  Db.find(3)
    .chain(eitherToTask)
    .fork(..., ...) : `
)

// -> Task(Either(res))
Db.find(3)
  // -> Task(res)
  .chain(eitherToTask)
  .fork(console.error, console.log)

console.log(`
  Db.find(3)
    .chain(eitherToTask)
    .chain(user => Db.find(user.best_friend_id))
    .chain(eitherToTask)
    .fork(..., ...) : `
)

Db.find(3)

// Task result is 'Either' but we want to chain with plain function,
// so apply natural transformation Either to Task first,
.chain(eitherToTask)

// now we have Task returning plain value,
// errors were already sent to Task.rejected,
// now map the result into another Task
.chain(user => Db.find(user.best_friend_id))

// the new result is again an Either,
// so we map it again from Either to Task
.chain(eitherToTask)
.fork(console.error, console.log)


console.log(`
  Db.find(2)
    .chain(eitherToTask)
    .chain(user => Db.find(user.best_friend_id))
    .chain(eitherToTask)
    .fork(..., ...) : `
)

// invalid user (id = 2)
Db.find(2)
.chain(eitherToTask)
.chain(user => Db.find(user.best_friend_id))
.chain(eitherToTask)
.fork(console.error, console.log)
