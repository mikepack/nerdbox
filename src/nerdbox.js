/* Nerdbox
 * v0.4.0
 *
 * Nerdbox is a fully-tested, simple lightbox designed for programmers.
 */

Nerdbox = function(selector, delegate, options) {
  // Allows Nerdbox to be called with or without new
  if(this instanceof Nerdbox) {
    this.init(selector, delegate, options);
  } else {
    new Nerdbox(selector, delegate, options);
  }
};

jQuery.fn.nerdbox = function(delegate, options) {
  return new Nerdbox(this.selector, delegate, options);
};

Nerdbox.options = {
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
};

Nerdbox.open = function(contentRef, options) {
  var nerdbox = new Nerdbox(options);
  nerdbox.open(contentRef);
};

Nerdbox.close = function() {
  Nerdbox._currentNerdbox().close();
  return false;
};

Nerdbox.prototype.init = function(selector, delegate, options) {
  // init('.nerdbox', {...})
  if(selector !== undefined && typeof delegate === 'object') { options = delegate; delegate = undefined; }
  // init({...})
  if(typeof selector === 'object' && delegate === undefined && options === undefined) { options = selector; selector = undefined; }

  this.selector = selector || '.nerdbox';
  this.delegate = delegate;
  this.options  = jQuery.extend({}, Nerdbox.options, options);

  this._setup();
};

Nerdbox._currentNerdbox = function() {
  if( Nerdbox._currentlyOpen ) { return Nerdbox._currentlyOpen; }
  else                         { return Nerdbox._nullBox; }
};

// If there is no current Nerdbox, we use a null object.
Nerdbox._nullBox = { options: Nerdbox.options };

Nerdbox._fadeIn = function(afterFadeIn) {
  jQuery(Nerdbox._currentNerdbox().options.nerdboxSelector).fadeIn(Nerdbox._currentNerdbox().options.fadeDuration, afterFadeIn);
};

Nerdbox.prototype.open = function(href) {
  jQuery(this._contentSelector()).html(this.options.loader);

  Nerdbox._currentlyOpen = this;
  Nerdbox._fadeIn(function() { jQuery(document).trigger('nerdbox.opened'); });

  this._loadContent(href);
};

Nerdbox.prototype.close = function() {
  var that = this,
      afterFadeOut = function() {
    jQuery(document).trigger('nerdbox.closed');
    jQuery(that._contentSelector()).empty();
  };

  jQuery(this.options.nerdboxSelector).fadeOut(this.options.fadeDuration, afterFadeOut);
};

Nerdbox.prototype._openFromLink = function(event) {
  // The target might be an element embedded in the link (eg image)
  var link = jQuery(event.target).closest(this.selector);

  this.open(link.attr('href'));

  return false;
};

Nerdbox.prototype._setup = function() {
  // Add HTML to DOM
  if( jQuery(this.options.nerdboxSelector).length === 0 ) {
    jQuery(this.options.container).appendTo('body')
                                  .addClass(this._classes());
  }

  // Bind click handlers
  var boundOpen = jQuery.proxy(this._openFromLink, this);
  if(this.delegate) {
    jQuery(this.delegate).on('click', this.selector, boundOpen);
  } else {
    jQuery(this.selector).on('click', boundOpen);
  }

  // Close lightbox
  jQuery(this._overlaySelector()).on('click', Nerdbox.close);
  jQuery(this.options.nerdboxSelector).on('click', this.options.closeSelector, Nerdbox.close);
  jQuery('body').on('keyup', function(event) {
    if( event.keyCode == 27 ) { Nerdbox.close(); }
  });

  jQuery(document).trigger('nerdbox.initialized');
};

Nerdbox.prototype._loadContent = function(href) {
  var imageTypesRegexp = new RegExp('\\.(' + this.options.imageExts.join('|') + ')', 'i'),
      urlRegex         = new RegExp('^[^ ]*$');

  // Render an element
  if( typeof href.appendTo == 'function' || typeof href.appendChild == 'function' ) {
    this._loadElement(jQuery(href));

  // Render a div
  } else if( href.match(/#/) ) {
    this._loadFragment(href);

  // Render an image
  } else if( href.match(imageTypesRegexp) ) {
    this._loadImage(href);

  // Render ajax content
  } else if( href.match(urlRegex) ) {
    this._loadAjax(href);

  // Render text content
  } else {
    this._setContent(href);
  }

};

Nerdbox.prototype._loadElement = function($el) {
  this._setElement($el);
};

Nerdbox.prototype._loadFragment = function(fragment) {
  var id = fragment.substring(fragment.indexOf('#'));
  this._setContent(jQuery(id).html());
};

Nerdbox.prototype._loadImage = function(url) {
  this._setContent('<img src="' + url + '" />');
};

Nerdbox.prototype._loadAjax = function(url) {
  var that = this;

  jQuery.ajax(url, {
    dataType: 'html',
    success: function(data) {
      that._setContent(data);
    }
  });
};

Nerdbox.prototype._setContent = function(html) {
  jQuery(this._contentSelector()).html(html);
  jQuery(document).trigger('nerdbox.loaded');
};

Nerdbox.prototype._setElement = function($el) {
  jQuery(this._contentSelector()).empty().append($el.clone());
  jQuery(document).trigger('nerdbox.loaded');
};

Nerdbox.prototype._overlaySelector = function() {
  return this.options.nerdboxSelector + ' ' + this.options.overlaySelector;
};

Nerdbox.prototype._contentSelector = function() {
  return this.options.nerdboxSelector + ' ' + this.options.contentSelector;
};

Nerdbox.prototype._closeSelector = function() {
  return this.options.nerdboxSelector + ' ' + this.options.closeSelector;
};

Nerdbox.prototype._classes = function() {
  var classes = this.options.classes;

  return Array.isArray(classes) ? classes.join(' ') : classes;
};
