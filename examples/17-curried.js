// divider comes first seen as customiser
const modulo = dvr => dvd => dvd % dvr

// partially apply with divider 2
const isOdd = modulo(2)

console.log("Is 5 odd? ", Boolean(isOdd(5)))


const filter = pred => xs => xs.filter(pred)
const getAllOdds = filter(isOdd)
console.log(
  "The odds from [1,2,3,4] are: ",
  getAllOdds([1,2,3,4])
)


const replace = regex => repl => str =>
  str.replace(regex, repl)

// still accepts data 'str' as argument
const censor = replace(/[aeiou]/g)('*')
console.log(censor('hello world'))


const map = f => xs => xs.map(f)

// partially apply our 'censor' to array
const censorAll = map(censor)
console.log(censorAll(['hello', 'world']))

