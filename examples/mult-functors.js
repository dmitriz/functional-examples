const { Either } = require('../examples/lib')

const $ = selector =>

  // ensure selector has 'height' property for demo purposes
  Either( {selector, height: 10} )



const getScreenSize = screen => head => foot =>
  screen - (head.height + foot.height)


// partially apply to 800 and wrap into Either,
// now apply one-by-one to the wrapped objects via 'ap'
const res = Either( getScreenSize(800) )
  .ap($('header'))
  .ap($('footer'))

console.log(res)



const $1 = selector =>

  // now pass null
  Either(null)


const res1 = Either( getScreenSize(800) )
  .ap($1('header'))
  .ap($1('footer'))

console.log(res1)
