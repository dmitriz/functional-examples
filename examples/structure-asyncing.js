const fs = require('fs')

const Task = require('data.task')
const { List, Map } = require('immutable-ext')


const httpGet = (path, params) =>

  // mocking return result of get
  // immeditate task returning the string
  Task.of(`${path} result`)


// Map of routes
Map({
  home: '/',
  about: '/about-us',
  blog: '/blog'
})
.traverse(
  Task.of,
  route => httpGet(route, {})
)
.fork( console.error, console.log )


// Map of route arrays
Map({
  home: ['/', '/home'],
  about: ['/about-us']
})
.traverse(
  Task.of,

  // now routes are arrays,
  // wrap them into List and traverse
  routes => List(routes).traverse(
    Task.of, route => httpGet(route, {})
  )
)
.fork( console.error, console.log )

