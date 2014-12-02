describe('Nerdbox', function() {
  var defaultOptions;

  beforeEach(function() {
    // Set duration to 0 so we don't have to time expectations
    Nerdbox.options.fadeDuration = 0;
    defaultOptions = $.extend({}, Nerdbox.options);
  });

  afterEach(function() {
    Nerdbox.options = defaultOptions;
    $(Nerdbox.options.nerdboxSelector).remove();
  });

  describe('options', function() {
    it('has invisible html by default', function() {
      expect(defaultOptions.container).toMatch(/display:\s*none/);
    });
  });

  describe('constructor', function() {
    beforeEach(function() {
      spyOn(Nerdbox.prototype, 'init');
    });

    it('handles forgotten "new"s', function() {
      Nerdbox('.nerdbox');
      expect(Nerdbox.prototype.init).toHaveBeenCalledWith('.nerdbox', undefined, undefined);
    });

    it('can take no arguments', function() {
      new Nerdbox();
      expect(Nerdbox.prototype.init).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('takes a selector for the elements to bind to as the first argument', function() {
      new Nerdbox('.nerdbox');
      expect(Nerdbox.prototype.init).toHaveBeenCalledWith('.nerdbox', undefined, undefined);
    });

    it('takes a delegate selector to bind to as the second argument', function() {
      new Nerdbox('.nerdbox', 'body');
      expect(Nerdbox.prototype.init).toHaveBeenCalledWith('.nerdbox', 'body', undefined);
    });

    it('takes options as the third argument', function() {
      new Nerdbox('.nerdbox', 'body', {foo: 'bar'});
      expect(Nerdbox.prototype.init).toHaveBeenCalledWith('.nerdbox', 'body', {foo: 'bar'});
    });
  });

  describe('initializing Nerdbox', function() {
    beforeEach(function() {
      Nerdbox.options.fadeDuration = 999;
      Nerdbox.options.nerdboxSelector = '#custombox';
    });

    it('has a defaults selector', function() {
      var nerdbox = new Nerdbox();
      expect(nerdbox.selector).toEqual('.nerdbox');
    });

    it('sets the selector', function() {
      var nerdbox = new Nerdbox('.mynerdbox');
      expect(nerdbox.selector).toEqual('.mynerdbox');
    });

    it('sets the delegate selector', function() {
      var nerdbox = new Nerdbox('.mynerdbox', 'body');
      expect(nerdbox.delegate).toEqual('body')
    });

    it('sets default options', function() {
      var nerdbox = new Nerdbox();
      expect(nerdbox.options.fadeDuration).toEqual(999);
    });

    it('overrides default options for the instance', function() {
      var nerdbox = new Nerdbox('.mynerdbox', 'body', {
        fadeDuration: 888,
        nerdboxSelector: '#differentbox'
      });

      expect(nerdbox.options.fadeDuration).toEqual(888);
      expect(nerdbox.options.nerdboxSelector).toEqual('#differentbox');
    });

    describe('options out of order', function() {
      var options = { fadeDuration: 999 };

      it('allows a selector and options', function() {
        var nerdbox = new Nerdbox('.mynerdbox', options);
        expect(nerdbox.selector).toEqual('.mynerdbox');
        expect(nerdbox.delegate).toEqual(undefined);
        expect(nerdbox.options.fadeDuration).toEqual(999);
      });

      it('allows just options', function() {
        var nerdbox = new Nerdbox(options);
        expect(nerdbox.selector).toEqual('.nerdbox');
        expect(nerdbox.delegate).toEqual(undefined);
        expect(nerdbox.options.fadeDuration).toEqual(999);
      });
    });
  });

  // Testable options
  describe('available options', function() {
    describe('container', function() {
      it('sets the containing element', function() {
        Nerdbox.open('', {container: '<div id="differentbox"></div>'});
        expect($('#differentbox')).toExist();
      });
    });

    describe('classes', function() {
      it('adds classes to the container', function() {
        Nerdbox.open('', {classes: 'differentbox'});
        expect($('.differentbox')).toExist();
      });

      it('splits a string by spaces', function() {
        Nerdbox.open('', {classes: 'different box'});
        expect($('#nerdbox').attr('class')).toMatch('different');
        expect($('#nerdbox').attr('class')).toMatch('box');
      });

      it('accepts an array', function() {
        Nerdbox.open('', {classes: ['different', 'box']});
        expect($('#nerdbox').attr('class')).toMatch('different');
        expect($('#nerdbox').attr('class')).toMatch('box');
      });

      it('can handle multiple nerdboxes on the same page', function() {
        var nerdbox1 = new Nerdbox({classes: 'winner'}),
            nerdbox2 = new Nerdbox({classes: 'dinner'});

        nerdbox1.open('');
        expect($('#nerdbox').attr('class')).toMatch('winner');

        nerdbox2.open('');
        expect($('#nerdbox').attr('class')).toMatch('dinner');
        expect($('#nerdbox').attr('class')).not.toMatch('winner');

        Nerdbox.open('');
        expect($('#nerdbox').attr('class')).not.toMatch('dinner');
        expect($('#nerdbox').attr('class')).not.toMatch('winner');
      });
    });
  });

  describe('using Nerdbox as a jQuery plugin', function() {
    it('returns an instance of Nerdbox', function() {
      expect($('.nerdbox').nerdbox().__proto__).toBe(Nerdbox.prototype);
    });

    it('instantiates Nerdbox with the provided selector', function() {
      var nerdbox = $('.custombox').nerdbox();
      expect(nerdbox.selector).toBe('.custombox');
    });

    it('accepts a delegator as the first argument', function() {
      var nerdbox = $('.custombox').nerdbox('body');
      expect(nerdbox.delegate).toBe('body');
    });

    it('accepts an options object as the first argument', function() {
      var nerdbox = $('.custombox').nerdbox({fadeDuration: 999});
      expect(nerdbox.delegate).toBe(undefined);
      expect(nerdbox.options.fadeDuration).toBe(999);
    });

    it('accepts both a delegator and options', function() {
      var nerdbox = $('.custombox').nerdbox('body', {fadeDuration: 999});
      expect(nerdbox.selector).toBe('.custombox');
      expect(nerdbox.delegate).toBe('body');
      expect(nerdbox.options.fadeDuration).toBe(999);
    });
  });

  describe('setting up Nerdbox', function() {
    it('injects the HTML into the DOM', function() {
      Nerdbox.options.container = '<div id="myprog"></div>';
      new Nerdbox();

      expect($('#myprog')).toExist();
      $('#myprog').remove();
    });
  });

  describe('clicking Nerdbox links', function() {
    afterEach(function() {
      $('.nerdbox').remove();
    });

    it('pops open the lightbox', function() {
      $('body').append($('<a href="#" class="nerdbox">Open Nerdbox</a>'));

      new Nerdbox();
      $('.nerdbox').click();

      expect($(Nerdbox.options.nerdboxSelector)).toBeVisible();
    });

    it('does not delegate events by default', function() {
      new Nerdbox();

      $('body').append($('<a href="#" class="nerdbox">Open Nerdbox</a>'));
      $('.nerdbox').click();

      expect($(Nerdbox.options.nerdboxSelector)).not.toBeVisible();
    });

    it('can pops open the lightbox using delegation', function() {
      new Nerdbox('.nerdbox', 'body');

      $('body').append($('<a href="#" class="nerdbox">Open Nerdbox</a>'));
      $('.nerdbox').click();

      expect($(Nerdbox.options.nerdboxSelector)).toBeVisible();
    });

    it('shows the loading animation', function() {
      $('body').append($('<a href="#" class="nerdbox">Open Nerdbox</a>'));

      new Nerdbox({
        loader: '<div id="loader"></div>'
      });
      $('.nerdbox').click();
      
      expect($('#loader')).toBeVisible();
    });

    it('adds a loading class while content is loading', function() {
      jasmine.Ajax.useMock();
      $('body').append($('<a href="spec/fixtures/ajax.html" class="nerdbox">Load Content</a>'));

      new Nerdbox();
      $('.nerdbox').click();

      expect($(Nerdbox.options.nerdboxSelector)).toHaveClass('loading');

      var request = mostRecentAjaxRequest();
      request.response(MockResponses.ajaxContent.success);

      expect($(Nerdbox.options.nerdboxSelector)).not.toHaveClass('loading');
    });

    describe('loading element content', function () {
      beforeEach(function() {
        $('body').append($('<div id="fragment">Nerdbox Content</div>'));
      });

      afterEach(function() {
        $('#fragment').remove();
      });

      it('loads an elements content if the href refers to a fragment', function() {
        $('body').append($('<a href="#fragment" class="nerdbox">Show Content</a>'));

        new Nerdbox();
        $('.nerdbox').click();

        expect($(Nerdbox.options.contentSelector)).toHaveText('Nerdbox Content');
      });

      it('can handle fragments as a substring', function() {
        $('body').append($('<a href="ignored#fragment" class="nerdbox">Show Content</a>'));

        new Nerdbox();
        $('.nerdbox').click();

        expect($(Nerdbox.options.contentSelector)).toHaveText('Nerdbox Content');
      });
    });

    describe('loading images', function() {
      it('loads the image if href refers to one of the extensions specified in the config', function() {
        $('body').append($('<a href="support/formal_languages.png" class="nerdbox">Show Image</a>'));

        new Nerdbox();
        $('.nerdbox').click();

        expect($(Nerdbox.options.contentSelector)).toHaveHtml('<img src="support/formal_languages.png" />');
      });

      it('accommodates for URLs without an extension', function() {
        $('body').append($('<a href="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=http://localhost/" class="nerdbox">Show Image</a>'));

        // Using the domain as an "extension" is a hack. Consider adding a regex option to the configuration.
        new Nerdbox({imageExts: ['googleapis']});
        $('.nerdbox').click();

        expect($(Nerdbox.options.contentSelector)).toHaveHtml('<img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=http://localhost/" />');
      });
    });

    describe('loading ajax content', function() {
      beforeEach(function() {
        jasmine.Ajax.useMock();
      });

      it('requests a page and populates the lightbox with its content', function() {
        $('body').append($('<a href="spec/fixtures/ajax.html" class="nerdbox">Show Ajax Content</a>'));

        new Nerdbox();
        $('.nerdbox').click();

        var request = mostRecentAjaxRequest();
        request.response(MockResponses.ajaxContent.success);

        expect($(Nerdbox.options.contentSelector)).toHaveHtml('<div class="mycontent">Ajax Content</div>');
      });
    });
  });

  describe('closing the lightbox', function() {
    var nerdbox;

    beforeEach(function() {
      $('body').append($('<a href="support/formal_languages.png" class="nerdbox">Show Image</a>'));
      nerdbox = new Nerdbox();
    });

    it('removes content from the lightbox', function() {
      $('.nerdbox').click();
      $(nerdbox.options.closeSelector).click();

      expect($(nerdbox.options.contentSelector)).toBeEmpty();
    });

    describe('clicking the close link', function() {
      it('closes the lightbox', function() {
        $('.nerdbox').click();
        $(nerdbox.options.closeSelector).click();

        expect($(nerdbox.options.nerdboxSelector)).not.toBeVisible();
      });
    });

    describe('clicking the overlay', function() {
      it('closes the lightbox', function() {
        $('.nerdbox').click();
        $(nerdbox.options.overlaySelector).click();

        expect($(nerdbox.options.nerdboxSelector)).not.toBeVisible();
      });
    });

    describe('pressing escape', function() {
      it('closes the lightbox', function() {
        $('.nerdbox').click();
        $('body').trigger(jQuery.Event('keyup', { keyCode: 27 }));

        expect($(nerdbox.options.nerdboxSelector)).not.toBeVisible();
      });
    });

    describe('pressing a key other than escape', function() {
      it('does not close the lightbox', function() {
        $('.nerdbox').click();
        $('body').trigger(jQuery.Event('keyup', { keyCode: 28 }));

        expect($(nerdbox.options.nerdboxSelector)).toBeVisible();
      });
    });

    describe('when the close link is injected into the lightbox content', function() {
      describe('clicking the close link', function() {
        var options;

        beforeEach(function() { options = Nerdbox.options; });
        afterEach(function() { Nerdbox.options = options; });

        it('closes the lightbox', function() {
          // Container without the close link
          Nerdbox.options.container = '<div id="nerdbox" style="display: none;"><div class="wrapper">\
                                       <div class="inner"><div class="content"></div></div></div></div>';
          Nerdbox.options.closeSelector = '.custom-close';

          Nerdbox.open('<a href="" class="custom-close">X</a>');

          $('.custom-close').click();
          expect($(nerdbox.options.nerdboxSelector)).not.toBeVisible();
        });
      });
    });
  });

  describe('programatically controlling Nerdbox', function() {
    describe('.close', function() {
      it('closes the currently open lightbox', function() {
        $('body').append($('<a href="support/formal_languages.png" class="nerdbox">Show Image</a>'));

        $('.nerdbox').click();
        Nerdbox.close();

        expect($(Nerdbox.options.nerdboxSelector)).not.toBeVisible();
      });

      it('does not error out when no lightbox is present', function() {
        expect(function() { Nerdbox.close(); }).not.toThrow();
      });
    });

    describe('.open', function() {
      beforeEach(function() {
        $('body').append($('<a href="support/formal_languages.png" class="nerdbox">Show Image</a>'));
        $('body').append($('<div id="fragment">Nerdbox Content</div>'));
        $('body').append($('<a href="#fragment" class="mybox">Show Content</a>'));
      });

      afterEach(function() {
        Nerdbox.close();
      });

      it('opens the lightbox', function() {
        Nerdbox.open('');
        expect($(Nerdbox.options.nerdboxSelector)).toBeVisible();
      });

      it('accepts options as the second argument', function() {
        Nerdbox.open('', {container: '<div id="optionsbox"></div>'});
        expect($('#optionsbox')).toExist()
      });

      it('replaces an existing lightbox if called twice', function() {
        Nerdbox.open('');
        Nerdbox.open('');

        expect($(Nerdbox.options.closeSelector)).toExist();
      });

      describe('loading an element', function() {
        it('loads an element into the lightbox', function() {
          var $el = $('<div class="element">Nerdbox Content</div>');
          $('body').append($el);

          Nerdbox.open($el);

          expect($(Nerdbox.options.contentSelector)).toHaveHtml('<div class="element">Nerdbox Content</div>');
          $el.remove();
        });

        it('supports raw DOM elements', function() {
          $('body').append('<div class="element">Nerdbox Content</div>');

          el = document.getElementsByClassName('element')[0];
          Nerdbox.open(el);

          expect($(Nerdbox.options.contentSelector)).toHaveHtml('<div class="element">Nerdbox Content</div>');
          el.parentNode.removeChild(el);
        });

        it('does not remove the original element', function() {
          var $el = $('<div class="element">Nerdbox Content</div>');
          $('body').append($el);

          Nerdbox.open($el);

          expect($('body > .element').length).toEqual(1);
          expect($('body .element').length).toEqual(2);
          $el.remove();
        });
      });

      describe('loading element content', function() {
        it('loads an elements content into the lightbox', function() {
          $('body').append($('<div id="fragment">Nerdbox Content</div>'));

          Nerdbox.open('#fragment');

          expect($(Nerdbox.options.contentSelector)).toHaveText('Nerdbox Content');
          $('#fragment').remove();
        });
      });

      describe('loading images', function() {
        it('loads the image whos href is specified as the argument', function() {
          Nerdbox.open('support/formal_languages.png');

          expect($(Nerdbox.options.contentSelector)).toHaveHtml('<img src="support/formal_languages.png" />');
        });
      });

      describe('loading ajax content', function() {
        beforeEach(function() {
          jasmine.Ajax.useMock();
        });

        it('requests a page and populates the lightbox with its content', function() {
          Nerdbox.open('spec/fixtures/ajax.html');

          var request = mostRecentAjaxRequest();
          request.response(MockResponses.ajaxContent.success);

          expect($(Nerdbox.options.contentSelector)).toHaveHtml('<div class="mycontent">Ajax Content</div>');
        });
      });

      describe('loading text', function() {
        it('loads the provided text/html into the lightbox', function() {
          Nerdbox.open('here is some <span>text</span>');

          expect($(Nerdbox.options.contentSelector)).toHaveHtml('here is some <span>text</span>');
        });
      });

      it('cannot handle URLs with spaces (used to determine plain text)', function() {
        Nerdbox.open('spec/fixtures/invalid url.html');

        expect($(Nerdbox.options.contentSelector)).toHaveHtml('spec/fixtures/invalid url.html');
      });
    });

    describe('#open', function() {
      it('loads the content specified, just like Nerdbox.open', function() {
        new Nerdbox().open('support/formal_languages.png');

        expect($(Nerdbox.options.contentSelector)).toHaveHtml('<img src="support/formal_languages.png" />');
      });

      it('clobers any existing lightbox if one is opened', function() {
        new Nerdbox().open('support/formal_languages.png');
        new Nerdbox().open('here is some <span>text</span>');

        expect($(Nerdbox.options.nerdboxSelector).length).toEqual(1);
        expect($(Nerdbox.options.contentSelector)).not.toHaveHtml('<img src="support/formal_languages.png" />');
        expect($(Nerdbox.options.contentSelector)).toHaveHtml('here is some <span>text</span>');
      });
    });

    describe('#close', function() {
      it('closes the currently open lightbox', function() {
        var nerdbox = new Nerdbox();

        nerdbox.open('support/formal_languages.png');
        nerdbox.close();

        expect($(Nerdbox.options.nerdboxSelector)).not.toBeVisible();
      });

      it('does not error out when the lightbox has not been opened', function() {
        expect(function() { new Nerdbox().close(); }).not.toThrow();
      });
    });
  });

  describe('listening for lifecycle events', function() {
    describe('Nerdbox.on', function() {
      it('listens for events fired on any instance', function() {
        var callback = jasmine.createSpy('nerdbox.initialized callback');
        Nerdbox.on('nerdbox.initialized', callback);

        new Nerdbox();

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('Nerdbox#on', function() {
      it('listens for events fired on that instance', function() {
        var callback = jasmine.createSpy('nerdbox.opened callback'),
            nerdbox = new Nerdbox();

        nerdbox.on('nerdbox.opened', callback);
        nerdbox.open('');

        expect(callback).toHaveBeenCalled();
      });

      it('does not listen on any other instance', function() {
        var callback1 = jasmine.createSpy('nerdbox.opened callback 1'),
            callback2 = jasmine.createSpy('nerdbox.opened callback 2'),
            nerdbox1 = new Nerdbox(),
            nerdbox2 = new Nerdbox();

        nerdbox1.on('nerdbox.opened', callback1);
        nerdbox2.on('nerdbox.opened', callback2);

        nerdbox1.open('');

        expect(callback1).toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
      });

      it('allows the nerdbox namespace to be removed from the event', function() {
        var callback = jasmine.createSpy('opened callback'),
            nerdbox = new Nerdbox();

        nerdbox.on('opened', callback);
        nerdbox.open('');

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('all events', function() {
      it('passes the instance as an argument to the callback', function() {
        var nerdbox = new Nerdbox(),
            instance = null,
            callback = function(e, nerdbox) {
              instance = nerdbox;
            };

        nerdbox.on('opened', callback);
        nerdbox.open('');

        expect(instance).toEqual(nerdbox);
      });
    });

    describe('nerdbox.initialized', function() {
      it('is triggered when a new object gets initialized', function() {
        var callback = jasmine.createSpy('nerdbox.initialized callback');
        Nerdbox.on('nerdbox.initialized', callback);

        new Nerdbox();

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('nerdbox.opened', function() {
      it('is triggered when a lightbox is opened', function() {
        Nerdbox.on('nerdbox.opened', function() {
          expect($(Nerdbox.options.contentSelector)).toHaveHtml(Nerdbox.options.loader);
          expect($(Nerdbox.options.nerdboxSelector)).toBeVisible();
        });

        Nerdbox.open('support/formal_languages.png');
      });
    });

    describe('nerdbox.loaded', function() {
      it('is triggered the lightbox content has been added to the DOM', function() {
        Nerdbox.on('nerdbox.loaded', function() {
          expect($(Nerdbox.options.contentSelector)).toHaveHtml('<img src="support/formal_languages.png" />');
        });

        Nerdbox.open('support/formal_languages.png');
      });
    });

    describe('nerdbox.closed', function() {
      it('triggers the nerdbox.closed event', function() {
        var callback = jasmine.createSpy('nerdbox.closed callback');
        Nerdbox.on('nerdbox.closed', callback);

        Nerdbox.open('support/formal_languages.png');
        Nerdbox.close();

        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
