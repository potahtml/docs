import { render, htmlEffect } from 'pota'
import { bind } from 'pota/plugins/bind'

// test setup

const data = [...Array(1000).keys()]

// tests

const tests = []

tests.push({
  name: 'data.find(x => x == 100)',
  fn: () => {
    data.find(x => x == 100)
  },
})

tests.push({
  name: 'data.find(x => x == 200)',
  fn: () => {
    data.find(x => x == 200)
  },
})

// stuff

function measure(fn) {
  const start = performance.now()
  fn()
  return performance.now() - start
}

const numberOfTests = bind(10)

function doTest(fn) {
  const runCount = numberOfTests()
  return measure(() => {
    for (let i = 0; i < runCount; i++) {
      fn()
    }
  })
}

console.log(tests)

const results = htmlEffect(html => {
  return html` <table cellpadding="4">
    <tr>
      <th>name</th>
      <th>time</th>
    </tr>
    <for each="${tests}"
      >${item => {
        console.log(item, 'what')
        return html`<tr>
          <td>${item.name}</td>
          <td>${doTest(item.fn)}</td>
        </tr>`
      }}</for
    >
  </table>`
})
// ui

render(
  <main>
    Number of Runs? :{' '}
    <input
      bind={numberOfTests}
      style="width:100px"
    />
    <button onClick={results.update}>Run Test</button>
    <p></p>
    <style>{'th, td{padding:5px}'}</style>
    <p></p>
    {results}
    <p></p>
    <p></p>
  </main>,
)
