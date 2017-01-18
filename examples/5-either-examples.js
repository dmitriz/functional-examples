// imperative
const openSite = () => {
  if(currentUser) {
    return renderPage(currentUser)
  } else {
    return showLogin()
  }
}

// functional
const openSite = () =>

  // Right if currentUser is defined, Left otherwise
  fromNullable(currentUser)

    // Left values passed to the left function, Right values passed to the right
    .fold(showLogin, renderPage)


// imperative
const getPrefs = user => {
  if(user.premium) {
    return loadPrefs(user.preferences)
  } else {
    return defaultPrefs()
  }
}

// functional
const getPrefs = user =>
  (user.premium ? Right(user) : Left('not premium'))

    // acts on Right values and ignores Left values
    .map(u => u.preferences)
    .fold(defaultPrefs, loadPrefs)


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
const streetName = user =>
  fromNullable(user.address)

    // chain expects function from raw value into the wrapped one
    // only applies to Right values
    .chain(ad => fromNullable(ad.street))
    .map(st => st.name)
    .fold(er => 'no street', name => name)


// imperative
const concatUniq = (x, ys) => {
  const found = ys.filter(y => y === x)[0]
  return found ? ys : ys.concat(x)
}

// functional
const concatUniq = (x, ys) =>
  fromNullable(ys.filter(y => y === x)[0])
    .fold(() => ys.concat(x), () => ys)


// imperative
const wrapExamples = example => {
  if(example.previewPath) {
    try {
      example.preview = fs.readFileSync(example.previewPath)
    } catch(e) { }
  }
  return example
}

// functional
const readFile = path => tryCatch(() => fs.readFileSync(path))

const wrapExample = example =>
  fromNullable(example.previewPath)
    .chain(readFile)
    .fold(
      () => example,
      preview => Object.assign({}, example, {preview})
    )


// imperative
const parseDbUrl = cfg =>
  try {
    const c = JSON.parse(cfg)
    if(c.url) {
      return c.url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    } catch (e) {
      return null
    }
  }

// functional
const parseDbUrl = cfg =>
  tryCatch(() => JSON.parse(cfg))
    .chain(c => fromNullable(c.url))
    .fold(
      e => null,
      u => u.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    )

