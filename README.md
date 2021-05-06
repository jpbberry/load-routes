# Load Routes

`@jpbberry/load-routes` is a package dedicated to easily, powerfully, and simply dynamically loading routes over folders and sub-folders. Routes are decides by the folders they're in, and the name of the files.

(This also has support for typescript, just replace all `module.exports = ...` with `exports default ...`)

## Installation

Install via `npm i @jpbberry/load-routes`

## How to

The package exports `LoadRoutes` with the paramaters `LoadRoutes(app, directory, bind?)`

#### Paramaters
- app

The express app or router to load the directory into
- directory

A full path directory to load all routes in
- [bind](#binding-routers)

An optional variable to bind all the routers function by, making it `this`

### How to load a folder

**index.js**
```js
const { LoadRoutes } = require('@jpbberry/load-routes')

const Path = require('path')
const Express = require('express')

const app = Express()

LoadRoutes(app, Path.resolve(__dirname, './routes'))

app.listen(3000)
```

And in your /routes folder, put your routes!

**routes/foo.js**
```js
module.exports = function (r) {
  r.get('/', (req, res) => {
    res.json({
      bar: true
    })
  })

  r.get('/not', (req, res) => {
    res.json({
      bar: false
    })
  })
}
```
When loaded, this will now make ip:3000/foo and /foo/not with these GETs!

### Middlewares and indexes

Sometimes your middlewares and base / files can get pretty big, so you can add an index.js which will let you listen to the inside of the sub-folder, for example:

**routes/hello/index.js**
```js
module.exports = function (r) {
  r.get('/', (req, res) => {
    res.json({
      hello: 'world'
    })
  })
}
```
And then you can have your non-cluttered routes in side of the `hello` folder
**routes/hello/test.js**
```js
module.exports = function (r) {
  r.get('/', (req, res) => {
    res.json({
      test: true
    })
  })
}
```
And this will now listen on ip:3000/hello and /hello/test

## Binding routers

You can pass an object which will be the same everywhere to the third paramater `bind`. This is extremely useful in a client centered program. It will define the `this` in every router. For example

**index.js**
```js
const Client = {
  foo: 'bar'
}

LoadRoutes(app, dir, Client)
```

Now `Client` will be available as `this`

*Also note that () => {} cannot access `this`, you must use `function ()` to get it*
**routes/foo.js**
```js
module.exports = function (r) {
  r.get('/', (req, res) => {
    res.json({
      foo: this.foo // "bar"
    })
  })
}
```

## Links

- [GitHub](https://github.com/jpbberry/load-routes)
- [NPM](https://npmjs.com/packages/@jpbberry/load-routes)