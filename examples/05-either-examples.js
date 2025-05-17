const fs = require('fs')

// helper functions
const Right = x => (
  {
    chain: f => f(x),
    map: f => Right(f(x)),
    fold: (f, g) => g(x),
    inspect: () => `Right(${x})`
  }
)
const Left = x => (
  {
    chain: f => Left(x),
    map: f => Left(x),
    fold: (f, g) => f(x),
    inspect: () => `Left(${x})`
  }
)
const fromNullable = x =>
  x != null ? Right(x) : Left(null)
const tryCatch = f => {
  try {
    return Right(f())
  } catch (e) {
    return Left(e)
  }
}


// mocked functions
const renderPage = user => `renderPage(${user})`
const showLogin = () => `showLogin()`

// imperative coding style
const openSite = () => {
  if(currentUser) {
    return renderPage(currentUser)
  } else {
    return showLogin()
  }
}

// functional coding style
const openSiteFn = currentUser =>

  // Right if currentUser is defined, Left otherwise
  fromNullable(currentUser)

    // Left values are passed to the left function, Right values are passed to the right
    .fold(showLogin, renderPage)

// testing
console.log(`openSiteFn() : `, openSiteFn())
console.log(`openSiteFn('user') : `, openSiteFn('user'))


// mocked functions
const defaultPrefs = () => `defaultPrefs()`
const loadPrefs = prefs => `loadPrefs(${prefs})`

// imperative
const getPrefs = user => {
  if(user.premium) {
    return loadPrefs(user.preferences)
  } else {
    return defaultPrefs()
  }
}

// functional
const getPrefsFn = user =>
  (user.premium ? Right(user) : Left('not premium'))

    // acts on Right values and ignores Left values
    .map(u => u.preferences)
    .fold(defaultPrefs, loadPrefs)

// testing
console.log(`getPrefsFn({}) : `, getPrefsFn({}))
console.log(`getPrefsFn({premium: true, preferences: 'some_prefs'}) : `, getPrefsFn({premium: true, preferences: 'some_prefs'}))



// imperative
const streetName = user => {
  const address = user.address

  if(address) {
    const street = address.street

    if(street) {
      return street.name
    }
  }
  return 'no street'
}

// functional
const streetNameFn = user =>
  fromNullable(user.address)

    // chain expects function from raw value into the wrapped one
    // only applies to Right values
    .chain(ad => fromNullable(ad.street))
    .map(st => st.name)
    .fold(er => 'no street', name => name)

// testing
console.log(`streetNameFn({}) : `, streetNameFn({}))
console.log(`streetNameFn({address: '1'}) : `, streetNameFn({address: '1'}))
console.log(
  `streetNameFn({address: {street: {name: 'some_street'}}) : `, 
  streetNameFn({address: {street: {name: 'some_street'}}})
)



// imperative
const concatUniq = (x, ys) => {
  const found = ys.filter(y => y === x)[0]
  return found ? ys : ys.concat(x)
}

// functional
const concatUniqFn = (x, ys) =>
  fromNullable(ys.filter(y => y === x)[0])
    .fold(() => ys.concat(x), () => ys)

// testing
console.log(`concatUniqFn(1, [2,3]) : `, concatUniqFn(1, [2,3]))
console.log(`concatUniqFn(2, [2,3]) : `, concatUniqFn(2, [2,3]))



// mocked


// imperative
const wrapExample = example => {
  if(example.previewPath) {
    try {
      example.preview = fs.readFileSync(example.previewPath)
    } catch(e) { }
  }
  return example
}

// functional
const readFileFn = path => tryCatch(() => fs.readFileSync(path))

// functional
const wrapExampleFn = example =>
  fromNullable(example.previewPath)
    .chain(readFileFn)
    .fold(
      () => example,
      preview => Object.assign({}, example, {preview})
    )

// testing
console.log(`wrapExampleFn({previewPath: 'no_file.txt'}) : `, wrapExampleFn({previewPath: 'no_file.txt'}))
console.log(`wrapExampleFn({previewPath: 'preview.txt'}) : `, wrapExampleFn({previewPath: 'preview.txt'}))



// imperative
const parseDbUrl = cfg => {
  try {
    const c = JSON.parse(cfg)
    if(c.url) {
      return c.url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    }
  } catch (e) {
      return null
  }
}

// functional
const parseDbUrlFn = cfg =>
  tryCatch(() => JSON.parse(cfg))
    .chain(c => fromNullable(c.url))
    .fold(
      e => `config is invalid`,
      u => u.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+)/)
    )

// testing
console.log(
  `parseDbUrlFn('{"no_url": "invalid"}') : `,
  parseDbUrlFn('{"no_url": "invalid"}')
)
console.log(
  `parseDbUrlFn('{"url": "postgresql://user:secret@localhost"}') : `,
  parseDbUrlFn('{"url": "postgresql://user:secret@localhost"}')
)
