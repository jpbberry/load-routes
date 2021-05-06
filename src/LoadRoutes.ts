import Path from 'path'
import { Application, Router } from 'express'
import { readdirSync, lstatSync, existsSync } from 'fs'

function createRouter (): Router {
  const router = Router({ mergeParams: true })

  return router
}

function getFile (path: string): (router: Router) => void {
  const file = require(path)
  if (file?.default) return file.default

  return file
}

/**
 * Loads all the routes in a folder and subfolders in themselves
 * @param app The express application/router to bind to
 * @param dir Directory of routes to load
 * @param bind An optional this bind, that would be turned into `this` in every router function
 */
export function LoadRoutes (app: Application|Router, dir: string, bind: any = global): void {
  const loadFolder = (path: string, parent: Application|Router) => {
    let routes = readdirSync(Path.resolve(path))
    if (routes.includes('index.js')) {
      routes = routes.filter(x => x !== 'index.js')
      routes.push('index.js')
    }
    routes.forEach(route => {
      if (route === 'middleware.js') return
      if (lstatSync(Path.resolve(path, route)).isDirectory()) {
        const router = createRouter()

        if (existsSync(Path.resolve(path, route, './middleware.js'))) {
          getFile(Path.resolve(path, route, './middleware.js')).bind(bind)(router)
        }

        loadFolder(path + '/' + route, router)

        return parent.use(`/${route}`, router as unknown as Application)
      }

      if (!route.endsWith('.js')) return

      delete require.cache[require.resolve(Path.resolve(path, route))]

      const routeFile = getFile(Path.resolve(path, route))
      if (!routeFile) return

      const routeName = route.replace(/index/gi, '').split('.')[0]

      const router = createRouter()

      routeFile.bind(bind)(router)

      parent.use(`/${routeName}`, router as unknown as Application)
    })
  }
  const baseRouter = createRouter()

  loadFolder(Path.resolve(dir), baseRouter)

  app.use('/', baseRouter as unknown as Application)
}
