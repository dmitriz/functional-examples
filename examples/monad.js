const { Box } = require('../examples/lib')

// uwrapping Box,
// i.e. takes Box(x) and returns x
const join = m =>
  m.chain( x => x )


const m = Box(Box(Box(3)))

console.log('m is: ', m)
console.log('join(m) is: ', join(m))
console.log('join(join(m)) is: ', join(join(m)))
console.log('join(join(join(m))) is: ', join(join(join(m))))

const res1 = join(m.map(join))
const res2 = join(join(m))

console.log(res1, res2)


const m1 = Box('wonder')

const res21 = join(Box(m1))
const res22 = join(m1.map(Box))

console.log(res21, res22)
