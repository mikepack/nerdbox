# Nerdbox [![Build Status](https://secure.travis-ci.org/mikepack/nerdbox.png)](http://travis-ci.org/mikepack/nerdbox)

## The Programmers Lightbox

Nerdbox is a fully-tested, responsive, simple lightbox designed for programmers.

![Nerdbox](http://i.imgur.com/ygoIP.png)

## Why

- Most center the lightbox using JavaScript. Nerdbox uses CSS.
- Most size the lightbox using JavaScript. Nerdbox uses CSS.
- Too many lightboxes hide their internals within a closure. If you need to accomplish something it wasn't designed to do, you end up with really strange, buggy and dependent code. This makes upgrading hard and is generally ugly.
- Most lightbox libraries are strictly jQuery plugins, degrading the API. jQuery's a secondary concern in Nerdbox.
- Most neglect testing. Nerdbox is test driven.
- Most use images for the close link and content loading. Nerdbox does not rely on any images.

## Installation

**Acquire the source**

Bower is the preferred technique:

```bash
bower install nerdbox
```

But you can also grab the source files from the `/src` directory of the repo.


**Include JS and CSS**

Normal tags work:

```html
<link rel="stylesheet" href="bower_components/src/nerdbox.css" type="text/css" media="screen" charset="utf-8">
<script src="bower_components/src/nerdbox.js" type="text/javascript" charset="utf-8"></script>
```

Or, include the files in your manifests.

JavaScript:

```javascript
//= require nerdbox/src/nerdbox
```

CSS:

```sass
@import "nerdbox/src/nerdbox";
```

## Usage

Nerdbox handles images, element IDs, and Ajax by default. The href of your link determines the type to be loaded.

For a demonstration of how to use Nerdbox, check out [demo.html](https://github.com/mikepack/nerdbox/blob/master/demo.html).

### Defining Links

The easiest way to use Nerdbox is to define some links with a class of `nerdbox` on the page:

Load images:

```html
<a href="myimage.png" class="nerdbox">click me</a>
```

Load element by ID:

```html
<a href="#someid" class="nerdbox">click me</a>
```

Load element by Ajax:

```html
<a href="page.html" class="nerdbox">click me</a>
```

### Initializing Nerdbox

```javascript
new Nerdbox();
```

By default, Nerdbox will add click handlers to all elements with a `nerdbox` class, without event delegation. The default selector is `.nerdbox`. You can specify a different selector as the first argument:

```javascript
new Nerdbox('.customclass');
```

If you want event delegation, specify a second parameter:

```javascript
new Nerdbox('.nerdbox', 'body');
```

The above is equivalent to:

```javascript
$('body').on('click', '.nerdbox', function() {...});
```

You can pass options as the third parameter:

```javascript
new Nerdbox('.nerdbox', 'body', {fadeDuration: 500});
```

You can also just pass a selector and options, without delegation:

```javascript
new Nerdbox('.nerdbox', {fadeDuration: 500});
```

Or use the default selector and pass just options:

```javascript
new Nerdbox({fadeDuration: 500});
```

## Programatically Controlling Nerdbox

One of Nerdbox's goals is to be object oriented, which means you're encouraged to instantiate new instances of Nerdbox. If you want to control those instances differently, no problem. Say you want to assign your own click handlers and open Nerdbox manually, you can use the following API:

### Nerdbox#open

Open the lightbox with the desired content. The content can be any of the values available as an href: images, elements by ID and ajax pages. You can also provide arbitrary content to display in the lightbox.

Load elements with jQuery or raw elements:

```javascript
$el = $('#lightbox-contents');
new Nerdbox().open($el);

el = document.getElementById('lightbox-contents');
new Nerdbox().open(el);
```

Load images:

```javascript
new Nerdbox().open('myimage.png');
```

Load element by ID:

```javascript
new Nerdbox().open('#someid');
```

Load element by Ajax:

```javascript
new Nerdbox().open('page.html');
```

Load arbitrary content:

```javascript
new Nerdbox().open('Load me into the <span>lightbox</span>.');
```

### Nerdbox#close

Close the lightbox instance:

```javascript
var nerdbox = new Nerdbox();

nerdbox.open('myimage.png');
// Lightbox is visible.
nerdbox.close();
// Lightbox is hidden.
```

### Nerdbox.open and Nerdbox.close

Since lightboxes are singleton views (it doesn't really make sense to have multiple lightboxes active at once), Nerdbox provides a singleton-style API. You're encouraged to instantiate your own Nerdbox objects instead, but if you don't have multiple types of lightboxes on a given page, this will provide a simple API for opening and closing the lightbox:

```javascript
Nerdbox.open('myimage.png');
Nerdbox.close();
```

This is equivalent to the following code:

```javascript
var nerdbox = new Nerdbox();
nerdbox.open('myimage.png');
nerdbox.close();
```

If you need to customize the singleton lightbox, `Nerdbox.open` accepts options as a second argument:

```javascript
Nerdbox.open('myimage.png', {fadeDuration: 500});
```

`Nerdbox.close` will close lightboxes whether they are opened with the singleton method or an instance method:

```javascript
new Nerdbox().open('myimage.png');
Nerdbox.close();
```

## Globally Changing Options

Options can be changed globally to affect all Nerdboxes and overridden on a case-by-case basis:

```javascript
Nerdbox.options.fadeDuration = 500;

var nerdbox1 = new Nerdbox();
var nerdbox2 = new Nerdbox({fadeDuration: 300});
```

In the above case, `nerdbox1` has a fadeDuration of `500` while `nerdbox2` has a fadeDuration of `300`.

## Changing Options After Instantiation

Each instance of Nerdbox has its own encapsulated options:

```javascript
var nerdbox = new Nerdbox();
nerdbox.options.fadeDuration = 500;
```

In that regard, you can instantiate multiple Nerdboxes to have different behavior/settings:

```javascript
new Nerdbox('.nofade', {fadeDuration: 0});
new Nerdbox('.yesfade');
```

The above will provide lightboxes with animation fading for links with class `nofade` and lightboxes with default animation fading for links with class `yesfade`.

## Available Options

Here are the default options for Nerdbox:

```javascript
{
  fadeDuration    : 200,
  imageExts       : [ 'png', 'jpg', 'jpeg', 'gif' ],
  classes         : undefined,
  nerdboxSelector : '#nerdbox',
  overlaySelector : '.nb-overlay',
  contentSelector : '.nb-content, .nb-shim',
  closeSelector   : '.nb-close',
  container       : '\
<div id="nerdbox" style="display: none;"> \
  <div class="nb-overlay"></div> \
  <div class="nb-wrapper"> \
    <div class="nb-content"></div> \
    <div class="nb-shim"></div> \
    <a href="#" class="nb-close" title="close"></a> \
  </div> \
</div>',
  loader          : '\
<div id="loader"> \
  <div class="circle one"></div> \
  <div class="circle two"></div> \
  <div class="circle three"></div> \
</div>'
}
```

### fadeDuration

The speed at which the lightbox animates in and out of view.

### imageExts

When displaying images, Nerdbox checks if its extension is amoung the specified `imageExts`. If you have a different image extension other than the defaults, add that extension to the list.

### classes

Additional classes to add to the container element, accessed via `nerdboxSelector`. This is a shortcut for replacing the entire `container` and gives an instance of Nerdbox the ability to have additional classes.

Can be a space-delimited string or an array. These are equivalent:

```javascript
new Nerdbox({classes: 'nerd box'});
new Nerdbox({classes: ['nerd', 'box']});
```

### nerdboxSelector

The selector for the outermost container of the lightbox. This is shown and hidden appropriately.

### overlaySelector

The selector for the overlay around the lightbox itself. Used to register a click handler to close the lightbox. Scoped to the `nerdboxSelector`.

### contentSelector

The selector for the content of the lightbox. This is where Nerdbox injects content. Scoped to the `nerdboxSelector`.

### closeSelector

The selector for the close link within the lightbox. Use to register a click handler to close the lightbox. Scoped to the `nerdboxSelector`.

### container

The HTML used for the lightbox. Change to whatever you want, but be sure to change the selector options to match your markup.

### loader

The HTML used while Nerdbox is loading content into the lightbox.

## Hooks

Nerdbox provides a number of hooks for you to use if you want to add some lifecycle functionality. Notice that the instance of Nerdbox that triggered the event gets passed as an argument to your callback:

```javascript
var nerdbox = new Nerdbox();

nerdbox.on('opened', function(e, nerdbox) {
  // Link clicked and lightbox opened
});
```

Events are also triggered with the `nerdbox` namespace:

```javascript
nerdbox.on('nerdbox.opened', function() {});
```

You can listen globally for events that are happening on all Nerdbox instances:

```javascript
Nerdbox.on('nerdbox.initialized', function() {});
```

And for convenience, events are also triggered on the document:

```javascript
$(document).on('nerdbox.initialized', function() {});
```

Note, events that are listened to globally with `Nerdbox.on` or `$(document).on` must have the `nerdbox` namespace. To prevent conflicts with other global events, the following won't work:

```javascript
Nerdbox.on('opened', function() {
  // Won't execute.
});
```

### nerdbox.initialized

Called after click handlers have been assigned to the links.

### nerdbox.opened

Called after the lightbox is fully visible.

### nerdbox.loaded

Called after the content has been loaded into the lightbox.

### nerdbox.closed

Called after the lightbox is fully hidden.

## Changing Styles

You can style the lightbox however you'd like. Feel free to change nerdbox.css directly or build a new stylesheet, `nerdbox_overrides.css`, which you allow to cascade over the Nerdbox default styles.

## jQuery Support

Nerdbox uses jQuery internally. You can use it as a jQuery plugin if you prefer:

```javascript
$('.nerdbox').nerdbox();
```

You can use a delegator as the first parameter:

```javascript
$('.nerdbox').nerdbox('body');
```

You can pass options as the second parameter:

```javascript
$('.nerdbox').nerdbox('body', {fadeDuration: 500});
```

You can leave out a delegate, and just pass options:

```javascript
$('.nerdbox').nerdbox({fadeDuration: 500});
```

## Running the Specs

You can run the specs two ways, with testem or in your browser.

### Node

Use this if you have a configured node environment.

1. Clone the repository.
2. Run `npm install -g testem`.
3. Run `testem`.

### Browser

Use this if you don't want the dependency on node or are debugging.

1. Clone the repository.
2. Open `spec/spec_runner.html` in your browser.

## Support

Nerdbox functions properly in IE9+.

## Future Improvements

- Improve algorithm to determine Nerdbox.open with text. Currently it only supports URLS without spaces.

## Known Issues

- Nerdbox will load in URLs with image-like extensions when you may expect it to make an Ajax request. So, http://get.pngnow.com will be recognized as an image and loaded into an image tag.

## Credits

Huge thanks to [@ajaswa](https://github.com/ajaswa/) for the CSS.

## License

Nerdbox is Copyright © 2012 Mike Pack. It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.
