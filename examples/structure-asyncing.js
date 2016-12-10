const fs = require('fs')

const Task = require('data.task')
const { List, Map } = require('immutable-ext')


const httpGet = (path, params) =>

  // mocking 'result' as result of get
  Task.of(`${path} result`)

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



Map({
  home: ['/', '/home'],
  about: ['/about-us']
})
.traverse(
  Task.of,

  // routes are arrays,
  // wrap into List and traverse
  routes => List(routes).traverse(
    Task.of, route => httpGet(route, {})
  )
)
.fork( console.error, console.log )

