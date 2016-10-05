require('jsdom-global')({
  FetchExternalResources: ['script'],
  ProcessExternalResources: ['script']
})

var script = require('../index')
var tape = require('tape')
var around = require('tape-around')
var $ = require('jquery')
var JQUERY_URL = 'https://code.jquery.com/jquery-3.1.1.min.js'

var test = around(tape)
  .before(function (t) {
    delete window.$
    delete window.jQuery
    script.reset()
    $('script').remove()
    t.next()
  })

test('script()', function (t) {
  t.plan(1)

  script(JQUERY_URL, function () {
    t.equal($('script[src="' + JQUERY_URL + '"]').length, 1, 'script is loaded')
    t.end()
  })
})

test('script.ready', function (t) {
  t.plan(2)

  script.ready('jquery', function () {
    t.equal(typeof window.$, 'function', 'window.$ is available')
    t.end()
  })

  script(JQUERY_URL, 'jquery', function() {
    t.pass('loaded from base callback')
  })
})

test('multiple files', function (t) {
  t.plan(3)

  script(['a.js', 'b.js'], function() {
    t.pass('loaded called')
    t.equal($('script[src="a.js"]').length, 1, 'a.js is loaded')
    t.equal($('script[src="b.js"]').length, 1, 'b.js is loaded')
    t.end()
  })
})

test('urlArgs', function (t) {
  script.urlArgs('key=value')
  script(['c.js'], function () {
    t.equal($('script[src="c.js?key=value"]').length, 1,
      'loaded with urlArgs')
    t.end()
  })
})

test('order', function (t) {
  t.plan(1)
  script.order(['a', 'b', 'c'], 'ordered-id', function () {
    t.pass('loaded in order')
  })
  script.ready('ordered-id', function () {
    t.end()
  })
})

test('script.done', function (t) {
  t.plan(2)
  var count = 0

  script.ready(['a', 'b'], function () {
    t.equal(++count, 2, 'ready([...]) called 2nd')
    t.end()
  })

  script.ready('a', function () {
    t.equal(++count, 1, 'ready(...) called 1st')
  })

  script.done('a')
  script.done('b')
})

test('double callbacks', function (t) {
  var count = 0

  function load () {
    if (++count === 2) {
      t.pass('loaded callbacks twice')
      t.end()
    }
  }

  script('double-load', load)
  script('double-load', load)
})

test('correctly count loaded scripts', function (t) {
  t.plan(2)

  script([
    JQUERY_URL,
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.js'
  ], function () {
    t.equal(typeof window.$, 'function', 'loaded jquery from http')
    t.equal(typeof window.angular, 'object', 'loaded angular.js from http')
    done()
  })
})

test('adding .js', function (t) {
  t.plan(1)

  script.path('js/')
  script('foo', function () {
    t.equal($('script[src="js/foo.js"]').length, 1, 'script is loaded')
    t.end()
  })
})

test('adding .js on multiple files', function (t) {
  t.plan(2)

  script.path('js/')
  script(['foo', 'bar'], function () {
    t.equal($('script[src="js/foo.js"]').length, 1, 'script foo is loaded')
    t.equal($('script[src="js/bar.js"]').length, 1, 'script bar is loaded')
    t.end()
  })
})
