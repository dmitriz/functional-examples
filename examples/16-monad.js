const Box = x => (
  {
    // b2 must be a boxed function Box(f)
    ap: b2 => b2.map(x),

    // f must be from any type a to any type b
    map: f => Box(f(x)),

    // f must be from any type a into the boxed type Box(a)
    chain: f => f(x),
    fold: f => f(x),
    inspect: () => `Box(${x})`
  }
)


// httpGet('/user')
//   .chain(user => httpGet(`/comments/${user.id}`)

//     // chain inside to access both user and comments in the closure
//     .chain(comments => updateDom(user, comments))
//   )

// uwrapping Box,
// i.e. takes Box(x) and returns x
const join = m =>
  m.chain( x => x )


const m = Box(Box(Box(3)))

console.log('join(Box(Box(Box(3)))) : ', join(m))
console.log('join(join(Box(Box(Box(3)))) : ', join(join(m)))
console.log('join(join(join(Box(Box(Box(3))))) : ', join(join(join(m))))

const res1 = join(m.map(join))
const res2 = join(join(m))

console.log(
  `join(Box(Box(Box(3))).map(join)) : `,
  res1
)
console.log(
  `join(join(Box(Box(Box(3))) : `,
  res2
)


const m1 = Box('wonder')

const res21 = join(Box(m1))
const res22 = join(m1.map(Box))

console.log(
  `join(Box(Box('wonder'))) : `,
  res21
)
console.log(
  `join(Box('wonder').map(Box)) : `,
  res22
)
