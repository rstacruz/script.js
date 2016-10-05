require('jsdom-global')()

var script = require('../index')
var tape = require('tape')
var around = require('tape-around')
var $ = require('jquery')

var test = around(tape)
  .before(function (t) {
    script.reset()
    $('script').remove()
    t.next()
  })

test('script()', function (t) {
  t.plan(1)

  script('jquery.js', function () {
    t.equal($('script[src="jquery.js"]').length, 1, 'script is loaded')
    t.end()
  })
})

test('script.ready', function (t) {
  t.plan(2)

  script.ready('jquery', function () {
    t.ok('jquery ok')
    t.end()
  })

  script('jquery.js', 'jquery', function() {
    t.ok('loaded from base callback')
  })
})

test('multiple files', function (t) {
  t.plan(3)

  script(['a.js', 'b.js'], function() {
    t.ok('loaded called')
    t.equal($('script[src="a.js"]').length, 1, 'a.js is loaded')
    t.equal($('script[src="b.js"]').length, 1, 'b.js is loaded')
    t.end()
  })
})
