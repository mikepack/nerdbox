/* Nerdbox
 * v0.2.1
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
  nerdboxSelector : '#nerdbox',
  overlaySelector : '.nb-overlay',
  contentSelector : '.nb-content',
  closeSelector   : '.nb-close',
  container       : '\
<div id="nerdbox" style="display: none;"> \
  <div class="nb-overlay"></div> \
  <div class="nb-wrapper"> \
    <div class="nb-inner"> \
      <div class="nb-content"></div> \
    </div> \
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

Nerdbox.open = function(contentRef) {
  var nerdbox = new Nerdbox();
  nerdbox._open(contentRef);
};

Nerdbox.close = function() {
  Nerdbox._fadeOut(function() { jQuery(document).trigger('nerdbox.closed'); });
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

Nerdbox._fadeOut = function(afterFadeOut) {
  jQuery(Nerdbox._currentNerdbox().options.nerdboxSelector).fadeOut(Nerdbox._currentNerdbox().options.fadeDuration, afterFadeOut);
};

Nerdbox.prototype._openFromLink = function(event) {
  // The target might be an element embedded in the link (eg image)
  var link = jQuery(event.target).closest(this.selector);

  this._open(link.attr('href'));

  return false;
};

Nerdbox.prototype._open = function(href) {
  jQuery(this._contentSelector()).html(this.options.loader);

  Nerdbox._currentlyOpen = this;
  Nerdbox._fadeIn(function() { jQuery(document).trigger('nerdbox.opened'); });

  this._loadContent(href);
};

Nerdbox.prototype._setup = function() {
  // Add HTML to DOM
  jQuery('body').append(Nerdbox.options.container);

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
  var imageTypesRegexp = new RegExp('\\.(' + this.options.imageExts.join('|') + ')(\\?.*)?$', 'i'),
      urlRegex         = new RegExp('^[^ ]*$');

  // Render a div
  if( href.match(/#/) ) {
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

Nerdbox.prototype._overlaySelector = function() {
  return this.options.nerdboxSelector + ' ' + this.options.overlaySelector;
};

Nerdbox.prototype._contentSelector = function() {
  return this.options.nerdboxSelector + ' ' + this.options.contentSelector;
};

Nerdbox.prototype._closeSelector = function() {
  return this.options.nerdboxSelector + ' ' + this.options.closeSelector;
};