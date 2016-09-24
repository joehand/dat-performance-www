const choo = require('choo')
const html = require('choo/html')
const http = require('choo/http')
const css = require('sheetify')

css('dat-design')
css('tachyons')
css('./style', {global: true})

const app = choo()
app.model({
  namespace: 'data',
  state: { results: [] },
  effects: {
    fetch: (data, state, send, done) => {
      http('/data.json', (err, res, body) => {
        send('data:receive', body, done)
      })
    }
  },
  reducers: {
    receive: (data, state) => {
      data = data.split('/')
      data.forEach(function (item) {
        console.log('here', item)
        item = JSON.parse(item)
      })
      console.log(data)
      return { results: data }
    }
  }
})

const mainView = (state, prev, send) => {
  if (!state.data.results.length) send('data:fetch')
  return html`
    <main class="">
      <nav class="dt ph5 pv2 header w-100">
        <span class="dib f3 v-mid dim">
          <img src="http://datproject.github.io/design/downloads/dat-hexagon.svg" class="dib w2 h2 br-100" alt="Dat Performance">
        </span>
        <div class="dib pl2 f2 b">
          <span style="color:#293648;">dat</span>
          <span style="color:#7C8792;">performance</span>
        </div>
      </nav>
      <section class="pa3 pa5-ns bg-white">

      </section>
    </main>
  `
}

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
