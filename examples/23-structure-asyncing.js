const fs = require('fs')

const Task = require('data.task')

// https://github.com/DrBoolean/immutable-ext
const { List, Map } = require('immutable-ext')


const httpGet = (path, params) =>

  // mocking return result of get
  // immeditate task returning the string
  Task.of(`${path} result`)


// Map of routes
const routes = Map({
  home: '/',
  about: '/about-us',
  blog: '/blog'
})

console.log(
  `Map({home: '/', about: '/about-us', blog: '/blog'}).traverse(Task.of, route => httpGet(route, {})).fork(..., ...) : `
)

// apply the 2nd argument function to each route
// and wrap into Task
routes
.traverse(
  Task.of,
  route => httpGet(route, {})
)

// run the (clone of) the Task
.fork( console.error, console.log )
// -> Map { "home": "/ result", "about": "/about-us result", "blog": "/blog result" }


// Map of route arrays
Map({
  home: ['/', '/home'],
  about: ['/about-us']
})
.traverse(
  Task.of,

  // now routes are arrays,
  // wrap them into List and traverse
  // to return Task
  routes =>

    // need to wrap into 'List' providing 'traverse'
    List(routes).traverse(
      Task.of, route => httpGet(route, {})
    )
)
.fork( console.error, console.log )

