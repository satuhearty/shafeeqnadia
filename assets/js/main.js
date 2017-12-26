(function($) {

  skel.breakpoints({
    xlarge:		'(max-width: 1680px)',
    large:		'(max-width: 1280px)',
    medium:		'(max-width: 980px)',
    small:		'(max-width: 736px)',
    xsmall:		'(max-width: 480px)',
    xxsmall:	'(max-width: 360px)'
  });

  $(function() {

    const	$window = $(window),
      $body = $('body'),
      $wrapper = $('#wrapper'),
      $header = $('#header'),
      $footer = $('#footer'),
      $main = $('#main'),
      $main_articles = $main.children('article');

    $window.on('load', function() {
      window.setTimeout(function() {
        $body.removeClass('is-loading');
      }, 100);
    });

    // Fix: Placeholder polyfill.
    $('form').placeholder();

    // Fix: Flexbox min-height bug on IE.
    if (skel.vars.IEVersion < 12) {
      let flexboxFixTimeoutId;
      $window.on('resize.flexbox-fix', function() {
        clearTimeout(flexboxFixTimeoutId);
        flexboxFixTimeoutId = setTimeout(function() {
          if ($wrapper.prop('scrollHeight') > $window.height()) {
            $wrapper.css('height', 'auto');
          } else {
            $wrapper.css('height', '100vh');
          }
        }, 250);
      }).triggerHandler('resize.flexbox-fix');
    }

    const $nav = $header.children('nav'),
      $nav_li = $nav.find('li');

    if ($nav_li.length % 2 === 0) {
      $nav.addClass('use-middle');
      $nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');
    }

    let	delay = 325,
      locked = false;

    $main._show = function(id, initial) {
      const $article = $main_articles.filter('#' + id);

      if ($article.length === 0) {
        return;
      }

      if (locked || (typeof initial !== 'undefined' && initial === true)) {
        $body.addClass('is-switching');
        $body.addClass('is-article-visible');
        $main_articles.removeClass('active');

        $header.hide();
        $footer.hide();

        $main.show();
        $article.show();

        $article.addClass('active');

        locked = false;
        setTimeout(function() {
          $body.removeClass('is-switching');
        }, (initial ? 1000 : 0));

        return;
      }

      locked = true;

      if ($body.hasClass('is-article-visible')) {
        const $currentArticle = $main_articles.filter('.active');
        $currentArticle.removeClass('active');
        setTimeout(function() {
          $currentArticle.hide();
          $article.show();
          setTimeout(function() {
            $article.addClass('active');
            $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
            setTimeout(function() {
              locked = false;
            }, delay);
          }, 25);
        }, delay);
      } else {
        $body.addClass('is-article-visible');
        setTimeout(function() {
          $header.hide();
          $footer.hide();

          $main.show();
          $article.show();

          setTimeout(function() {
            $article.addClass('active');
            $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
            setTimeout(function() {
              locked = false;
            }, delay);
          }, 25);
        }, delay);
      }
    };

    $main._hide = function(addState) {
      const $article = $main_articles.filter('.active');

      if (!$body.hasClass('is-article-visible')) {
        return;
      }

      if (typeof addState !== 'undefined' &&	addState === true) {
        history.pushState(null, null, '#');
      }

      if (locked) {
        $body.addClass('is-switching');
        $article.removeClass('active');

        $article.hide();
        $main.hide();

        $footer.show();
        $header.show();

        $body.removeClass('is-article-visible');
        locked = false;
        $body.removeClass('is-switching');
        $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
        return;
      }

      locked = true;
      $article.removeClass('active');
      setTimeout(function() {
        $article.hide();
        $main.hide();

        $footer.show();
        $header.show();

        setTimeout(function() {
          $body.removeClass('is-article-visible');
          $window.scrollTop(0).triggerHandler('resize.flexbox-fix');
          setTimeout(function() {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    };

    $main_articles.each(function() {
      const $this = $(this);
      $('<div class="close">Close</div>').appendTo($this).on('click', function() {
        location.hash = '';
      });
    });

    $window.on('keyup', function(event) {
      if (event.keyCode === 27 && $body.hasClass('is-article-visible')) {
        $main._hide(true);
      }
    });

    $window.on('hashchange', function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (location.hash === '' ||	location.hash === '#') {
        $main._hide();
      } else if ($main_articles.filter(location.hash).length > 0) {
        $main._show(location.hash.substr(1));
      }
    });

    // This prevents the page from scrolling back to the top on a hashchange.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    } else {
      let	oldScrollPos = 0,
        scrollPos = 0,
        $htmlbody = $('html,body');

      $window.on('scroll', function() {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      }).on('hashchange', function() {
        $window.scrollTop(oldScrollPos);
      });
    }

    // Initialize.
    $main.hide();
    $main_articles.hide();

    if (location.hash !== '' &&	location.hash !== '#')
      $window.on('load', function() {
        $main._show(location.hash.substr(1), true);
      });
  });

  $.fn.timeline = function() {
    const selectors = {
      id: $(this),
      item: $(this).find(".timeline-item"),
      activeClass: "timeline-item--active",
      img: ".timeline__img"
    };
    selectors.item.eq(0).addClass(selectors.activeClass);
    selectors.id.css(
      "background-image",
      "url(" +
      selectors.item
        .first()
        .find(selectors.img)
        .attr("src") +
      ")"
    );
    const itemLength = selectors.item.length;
    $(window).scroll(function() {
      let max, min;
      const pos = $(this).scrollTop();
      selectors.item.each(function(i) {
        min = $(this).offset().top;
        max = $(this).height() + $(this).offset().top;
        if (i === itemLength - 2 && pos > min + $(this).height() / 2) {
          selectors.item.removeClass(selectors.activeClass);
          selectors.id.css(
            "background-image",
            "url(" +
            selectors.item
              .last()
              .find(selectors.img)
              .attr("src") +
            ")"
          );
          selectors.item.last().addClass(selectors.activeClass);
        } else if (pos <= max - 20 && pos >= min) {
          selectors.id.css(
            "background-image",
            "url(" +
            $(this)
              .find(selectors.img)
              .attr("src") +
            ")"
          );
          selectors.item.removeClass(selectors.activeClass);
          $(this).addClass(selectors.activeClass);
        }
      });
    });
  };

})(jQuery);

$("#timeline-1").timeline();
