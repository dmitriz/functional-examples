const { List } = require('immutable-ext')

const Task = require('data.task')
const Either = require('data.either')

const request = require('request')


const argv = new Task( (rej, res) => res(process.argv) )
const names = argv.map( args => args.slice(2) )


const Intersection = xs => ({

  // expose xs assigned to key named 'xs'
  xs,

  // now pick the value 'ys' assigned to key 'xs'
  concat: ({xs: ys}) =>
    Intersection(xs.filter( x => ys.some( y => x === y)))
})


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


// "concat" as Intersection and extract the value
const artistIntersection = rels1 => rels2 =>
  Intersection(rels1).concat(Intersection(rels2)).xs



// find Intersection of artists related to 'name1' and 'name2'
const main = ([name1, name2]) =>

  // new Task of intersection
  Task.of(artistIntersection)

  // applied to the same args
  .ap(related(name1))
  .ap(related(name2))


names
.chain(main)
.fork(console.error, console.log)


console.log("Try to run with args: oasis blur")


const artistIntersection1 = rels =>

  // Task list is mapped through Intersection
  // and folded
  rels.foldMap(Intersection).xs


const main1 = names =>
  List(names)

  // map would give List of Tasks
  // but we want Task of Lists!
  .traverse(Task.of, related)
  .map(artistIntersection1)

names
.chain(main1)
.fork(console.error, console.log)


