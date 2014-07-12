# Nerdbox [![Build Status](https://secure.travis-ci.org/mikepack/nerdbox.png)](http://travis-ci.org/mikepack/nerdbox) [![Bountysource](https://www.bountysource.com/badge/issue?issue_id=2722695)](https://www.bountysource.com/issues/2722695-overflow-scrolling-without-a-shim?utm_source=2722695&utm_medium=shield&utm_campaign=ISSUE_BADGE)

We currently have an open $100 bounty to [solve overflow scrolling](https://github.com/mikepack/nerdbox/issues/15)!

## The Programmers Lightbox

Nerdbox is a fully-tested, simple lightbox designed for programmers.

![Nerdbox](http://i.imgur.com/ygoIP.png)

## Why

- Too many lightboxes hide their internals within a closure. If you need to accomplish something it wasn't designed to do, you end up with really strange, buggy and dependent code. This makes upgrading hard and is generally ugly.
- Most lightbox libraries are strictly jQuery plugins, degrading the API. jQuery's a secondary concern in Nerdbox.
- Most neglect testing. Nerdbox is test driven.
- Most use images for the close link and content loading. Nerdbox does not rely on any images.
- Most center the lightbox using JavaScript. Nerdbox uses CSS.
- Most size the lightbox using JavaScript. Nerdbox uses CSS.

## Installation

1. Copy `nerdbox.js` and `nerdbox.css` (located in the src/ directory) into your project in the appropriate location. In a Rails app, this would be `vendor/assets/javascripts/nerdbox.js` and `vendor/assets/stylesheets/nerdbox.css`.
2. Require `nerdbox.js` and `nerdbox.css` in your app. Normal script tags work. In Rails, you can add nerdbox to your manifest files to include them in the asset pipeline.

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

If you want to assign your own click handlers and open Nerdbox manually, you can use the following API:

### Nerdbox.open

Open the lightbox with the desired content. The content can be any of the values available as an href: images, elements by ID and ajax pages. You can also provide arbitrary content to display in the lightbox.

Load elements with jQuery or raw elements:

```javascript
$el = $('#lightbox-contents');
Nerdbox.open($el);

el = document.getElementById('lightbox-contents');
Nerdbox.open(el);
```

Load images:

```javascript
Nerdbox.open('myimage.png');
```

Load element by ID:

```javascript
Nerdbox.open('#someid');
```

Load element by Ajax:

```javascript
Nerdbox.open('page.html');
```

Load arbitrary content:

```javascript
Nerdbox.open('Load me into the <span>lightbox</span>.');
```

`Nerdbox.open` accepts options as a second argument:

```javascript
Nerdbox.open('myimage.png', {fadeDuration: 500});
```


### Nerdbox.close

Close the currently visible lightbox, if one exists.

```javascript
Nerdbox.open('myimage.png');
// Lightbox is visible.
Nerdbox.close();
// Lightbox is hidden.
```

It works for lightboxes shown with links, as well:

```html
<a href="myimage.png" class="nerdbox">click me</a>
```

```javascript
new Nerdbox();
```

...someone clicks the link, showing the lightbox...

```javascript
Nerdbox.close();
```

...lightbox is hidden.


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

Nerdbox provides a number of hooks for you to use if you need to add some additional functionality.

From within Nerdbox, all events are triggered on the `document`:

```javascript
$(document).trigger('nerdbox.<event name>');
```

So you'll need to assign handlers like so:

```javascript
$(document).on('nerdbox.<event name>')
```

### nerdbox.initialized

Called after click handles have been assigned to the links.

### nerdbox.loaded

Called after the content has been loaded into the lightbox.

### nerdbox.opened

Called after the lightbox is fully visible.

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

Nerdbox functions properly in IE8+. The default loader uses CSS animations, which are not supported in IE8.

## Future Improvements

- Improve algorithm to determine Nerdbox.open with text. Currently it only supports URLS without spaces.
- Better testing around timing of hooks.
- [Better overflow support](https://github.com/mikepack/nerdbox/pull/11)

## Known Issues

- Nerdbox does not overflow vertically very well. Content that extends beyond the height of the lightbox will not scroll properly.
- Nerdbox will load in URLs with image-like extensions when you may expect it to make an Ajax request. So, http://get.pngnow.com will be recognized as an image and loaded into an image tag.

## Credits

Huge thanks to [@ajaswa](https://github.com/ajaswa/) for the CSS.

## License

Nerdbox is Copyright © 2012 Mike Pack. It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.
