# @rstacruz/scriptjs

> Async JavaScript loader & dependency manager

`scriptjs` is an asynchronous JavaScript loader and dependency manager with an astonishingly impressive lightweight footprint. Like many other script loaders, $script.js allows you to load script resources on-demand from any URL and not block other resources from loading (like CSS and images). Furthermore, it's unique interface allows developers to work easily with even the most complicated dependencies, which can often be the case for large, complex web applications.

## Fork information

:warning: This is a fork by [@rstacruz](https://github.com/rstacruz) of script.js originally by [Dustin Diaz](http://github.com/ded), formerly in [ded/script.js](https://github.com/ded/script.js). This fork adds no functionality, but cleans up the code a bit.

- Removes the smoosh-based build system
- Replaces the browser tests with jsdom-based unit tests
- Ender support is removed
- Documentation is improved
- Renamed from `$script.js` to the less-ambiguous `scriptjs`

## Installation

scriptjs is available via npm as `@rstacruz/scriptjs`.

```
npm install --save @rstacruz/scriptjs
```

Standalone build:

- https://unpkg.com/@rstacruz/scriptjs/script.min.js (latest)
- https://unpkg.com/@rstacruz/scriptjs@3.0.0/script.min.js (specific version)

## Browser Support

  * IE 6+
  * Opera 10+
  * Safari 3+
  * Chrome 1+
  * Firefox 2+

## Examples

old school - blocks CSS, Images, AND JS!

``` html
<script src="jquery.js"></script>
<script src="my-jquery-plugin.js"></script>
<script src="my-app-that-uses-plugin.js"></script>
```

middle school - loads as non-blocking, but has multiple dependents

``` js
$script('jquery.js', function () {
  $script('my-jquery-plugin.js', function () {
    $script('my-app-that-uses-plugin.js')
  })
})
```

new school - loads as non-blocking, and ALL js files load asynchronously

``` js
// load jquery and plugin at the same time. name it 'bundle'
$script(['jquery.js', 'my-jquery-plugin.js'], 'bundle')

// load your usage
$script('my-app-that-uses-plugin.js')


/*--- in my-jquery-plugin.js ---*/
$script.ready('bundle', function() {
  // jquery & plugin (this file) are both ready
  // plugin code...
})


/*--- in my-app-that-uses-plugin.js ---*/
$script.ready('bundle', function() {
  // use your plugin :)
})
```

## Exhaustive list of ways to use $script.js

``` js
$script('foo.js', function() {
  // foo.js is ready
})


$script(['foo.js', 'bar.js'], function() {
  // foo.js & bar.js is ready
})


$script(['foo.js', 'bar.js'], 'bundle')
$script.ready('bundle', function() {
  // foo.js & bar.js is ready
})

// create an id and callback inline
$script(['foo.js', 'bar.js'], 'bundle', function () {
  // foo.js & bar.js is ready
})


$script('foo.js', 'foo')
$script('bar.js', 'bar')
$script
  .ready('foo', function() {
    // foo.js is ready
  })
  .ready('bar', function() {
    // bar.js is ready
  })


var dependencyList = {
    foo: 'foo.js'
  , bar: 'bar.js'
  , thunk: ['thunkor.js', 'thunky.js']
}

$script('foo.js', 'foo')
$script('bar.js', 'bar')

// wait for multiple depdendencies!
$script.ready(['foo', 'bar', 'thunk'], function () {
  // foo.js & bar.js & thunkor.js & thunky.js is ready
}, function(depsNotFound) {
    // foo.js & bar.js may have downloaded
    // but ['thunk'] dependency was never found
    // so lazy load it now
    depsNotFound.forEach(function(dep) {
      $script(dependencyList[dep], dep)
    })
  })


// in my-awesome-plugin.js
$script.ready('jquery', function() {
  //define awesome jquery plugin here
  $script.done('my-awesome-plugin')
})

// in index.html
$script('jquery.js', 'jquery')
$script('my-awesome-plugin.js')
$script.ready('my-awesome-plugin', function() {
  //run code here when jquery and my awesome plugin are both ready
})
```

## API

### $script.path()

Optionally to make working with large projects easier, there is a path variable you can set to set as a base.

``` js
$script.path('/js/modules/')
$script(['dom', 'event'], function () {
  // use dom & event
});
```

Note that this will include all scripts from here on out with the base path. If you wish to circumvent this for any single script, you can simply call <code>$script.get()</code>

``` js
$script.path('/js/modules/')
$script(['dom', 'event'], function () {
  // use dom & event
})

$script.get('http://example.com/base.js', function () {

})
```

### $script.urlArgs()
As of 2.5.5 it's possible to concat URL arguments (i.e. a query string) to the script path.
This is especially useful when you're in need of a cachebuster and works as follows:

```js
$script.urlArgs('key=value&foo=bar');
```

Please note that Squid, a popular proxy, doesn’t cache resources with a querystring. This hurts performance when multiple users behind a proxy cache request the same file – rather than using the cached version everybody would have to send a request to the origin server. So ideally, [as Steve Souders points out](http://www.stevesouders.com/blog/2008/08/23/revving-filenames-dont-use-querystring/), you should rev the filename itself.
