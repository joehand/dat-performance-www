const http = require('http')
const path = require('path')
const browserify = require('browserify')
const bankai = require('bankai')
const hyperdriveHttp = require('hyperdrive-http')
const level = require('level-party')
const home = require('os-homedir')
const hypercore = require('hypercore')

const client = path.join(__dirname, 'index.js')

const assets = bankai({optimize: true})
const css = assets.css()
const js = assets.js(browserify, client, {transform: ['es2040']})
const html = assets.html()

const db = level(path.join(home(), '.datperformance.db'))
const core = hypercore(db)

db.get('!datperformance!!key!', {valueEncoding: 'binary'}, function (_, key) {
  if (!key) return onerror('No local Dat Performance Db')

  const feed = core.createFeed(key)
  http.createServer((req, res) => {
    switch (req.url) {
      case '/': return html(req, res).pipe(res)
      case '/bundle.js': return js(req, res).pipe(res)
      case '/bundle.css': return css(req, res).pipe(res)
      case '/data': return hyperdriveHttp(feed)(req, res)
      default: return html(req, res).pipe(res)
    }
  }).listen(8080)
})
