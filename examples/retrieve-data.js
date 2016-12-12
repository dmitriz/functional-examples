const Task = require('data.task')
const Either = require('data.either')

const request = require('request')


// general purpose http get wrapped as Task
const httpGet = url =>
  new Task(
    (rej, res) => request(url, (e, response, body) =>
      e ? rej(e) : res(body)
    )
  )


// safe version of JSON.parse
const parse = Either.try(JSON.parse)


// Task formed from Either value
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)


// safe Task parsing get request
const getJSON = url =>
  httpGet(url)
  .map(parse)
  .chain(eitherToTask)


// testing
//
// getJSON(`https://api.spotify.com/v1/search?q=Muse&type=artist`)
// .fork(console.error, console.log)


// safe get first element
const first = xs =>
  Either.fromNullable(xs[0])


// Task to get first artist
const findArtist = name =>
  getJSON(`https://api.spotify.com/v1/search?q=${name}&type=artist`)
  // .map( result => {
  //   console.log(result)
  //   return result
  // })
  .map( result => result.artists.items )
  .map(first)
  .map( artist => artist.value )


// Task to get related arists as Task of array
const relatedArtists = id =>
  getJSON(`https://api.spotify.com/v1/artists/${id}/related-artists`)
  .map( result => result.artists )


// Task to get related artists by name
const related = name =>
  findArtist(name)
  .map(artist => artist.id)
  .chain(relatedArtists)
  .map( artists => artists.map( artist => artist.name ) )



// find artists related to 'name1' and 'name2'
const main = ([name1, name2]) =>

  // collect values into array, wrapped as Task
  Task.of( rels1 => rels2 => [rels1, rels2] )

  // partly apply to 'related' of the 1st arg
  .ap(related(name1))

  // apply to 'related' of the 2nd arg
  .ap(related(name2))


// testing
//
// Now 'main(name1, name2)' is the Task
// collecting into array results of related search for 'name1' and 'name2'
//
// main(['Muse', 'Big'])
// .fork(console.error, console.log)


// Task getting args from command line
const argv = new Task(
  (rej, res) => res(process.argv)
)

// argv
// .fork(console.error, console.log)


// Task getting args starting from the 3rd entry
const names = argv.map( args => args.slice(2) )

names
.fork(console.error, console.log)



names

// send into 'main' and extract values
.chain(main)
.fork(console.error, console.log)


