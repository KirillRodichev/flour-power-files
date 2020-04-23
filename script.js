"use strict";
window.addEventListener("DOMContentLoaded", function () {
  // Global variables
  var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),
    $document = $(document),
    $window = $(window),
    $html = $("html"),
    $body = $("body"),
    isDesktop = $html.hasClass("desktop"),
    isIE =
      userAgent.indexOf("msie") !== -1
        ? parseInt(userAgent.split("msie")[1], 10)
        : userAgent.indexOf("trident") !== -1
        ? 11
        : userAgent.indexOf("edge") !== -1
        ? 12
        : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
    windowReady = false,
    isNoviBuilder = false,
    livedemo = false,
    plugins = {
      bootstrapTooltip: $("[data-toggle='tooltip']"),
      bootstrapModalDialog: $(".modal"),
      bootstrapTabs: $(".tabs-custom"),
      customToggle: $("[data-custom-toggle]"),
      counter: $(".counter"),
      circleProgress: $(".progress-bar-circle"),
      countDown: $("[data-circle-countdown]"),
      captcha: $(".recaptcha"),
      campaignMonitor: $(".campaign-mailform"),
      copyrightYear: $(".copyright-year"),
      checkbox: $("input[type='checkbox']"),
      isotope: $(".isotope-wrap"),
      lightGallery: $("[data-lightgallery='group']"),
      lightGalleryItem: $("[data-lightgallery='item']"),
      lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
      materialParallax: $(".parallax-container"),
      mailchimp: $(".mailchimp-mailform"),
      owl: $(".owl-carousel"),
      popover: $('[data-toggle="popover"]'),
      progressLinear: $(".progress-linear"),
      preloader: $(".preloader"),
      rdNavbar: $(".rd-navbar"),
      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      radio: $("input[type='radio']"),
      swiper: document.querySelectorAll(".swiper-container"),
      search: $(".rd-search"),
      searchResults: $(".rd-search-results"),
      statefulButton: $(".btn-stateful"),
      viewAnimate: $(".view-animate"),
      wow: $(".wow"),
      maps: $(".google-map-container"),
      rdRange: $(".rd-range"),
      selectFilter: $("select"),
      slick: $(".slick-slider"),
      stepper: $("input[type='number']"),
      radioPanel: $(".radio-panel .radio-inline"),
      multitoggle: document.querySelectorAll("[data-multitoggle]"),
    };

  /**
   * @desc Check the element was been scrolled into the view
   * @param {object} elem - jQuery object
   * @return {boolean}
   */
  function isScrolledIntoView(elem) {
    if (isNoviBuilder) return true;
    return (
      elem.offset().top + elem.outerHeight() >= $window.scrollTop() &&
      elem.offset().top <= $window.scrollTop() + $window.height()
    );
  }

  /**
   * @desc Calls a function when element has been scrolled into the view
   * @param {object} element - jQuery object
   * @param {function} func - init function
   */
  function lazyInit(element, func) {
    var scrollHandler = function () {
      if (!element.hasClass("lazy-loaded") && isScrolledIntoView(element)) {
        func.call();
        element.addClass("lazy-loaded");
      }
    };

    scrollHandler();
    $window.on("scroll", scrollHandler);
  }

  // Initialize scripts that require a loaded page
  $window.on("load", function () {
    // Page loader & Page transition
    if (plugins.preloader.length && !isNoviBuilder) {
      pageTransition({
        target: document.querySelector(".page"),
        delay: 0,
        duration: 500,
        classIn: "fadeIn",
        classOut: "fadeOut",
        classActive: "animated",
        conditions: function (event, link) {
          return (
            !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link) &&
            !event.currentTarget.hasAttribute("data-lightgallery")
          );
        },
        onTransitionStart: function (options) {
          setTimeout(function () {
            plugins.preloader.removeClass("loaded");
          }, options.duration * 0.75);
        },
        onReady: function () {
          plugins.preloader.addClass("loaded");
          windowReady = true;
        },
      });
    }

    // jQuery Count To
    if (plugins.counter.length) {
      for (var i = 0; i < plugins.counter.length; i++) {
        var counter = $(plugins.counter[i]),
          initCount = function () {
            var counter = $(this);
            if (
              !counter.hasClass("animated-first") &&
              isScrolledIntoView(counter)
            ) {
              counter.countTo({
                refreshInterval: 40,
                speed: counter.attr("data-speed") || 1000,
                from: 0,
                to: parseInt(counter.text(), 10),
              });
              counter.addClass("animated-first");
            }
          };

        $.proxy(initCount, counter)();
        $window.on("scroll", $.proxy(initCount, counter));
      }
    }

    // Progress bar
    if (plugins.progressLinear.length) {
      for (var i = 0; i < plugins.progressLinear.length; i++) {
        var bar = $(plugins.progressLinear[i]),
          initProgress = function () {
            var bar = $(this),
              end = parseInt($(this).find(".progress-value").text(), 10);

            if (!bar.hasClass("animated-first") && isScrolledIntoView(bar)) {
              bar.find(".progress-bar-linear").css({ width: end + "%" });
              bar.find(".progress-value").countTo({
                refreshInterval: 40,
                from: 0,
                to: end,
                speed: 1000,
              });
              bar.addClass("animated-first");
            }
          };

        $.proxy(initProgress, bar)();
        $window.on("scroll", $.proxy(initProgress, bar));
      }
    }

    // SVG Countdown
    if (plugins.countDown.length) {
      svgCountDown({
        tickInterval: 100,
        counterSelector: ".countdown-counter",
      });
    }

    // Circle Progress
    if (plugins.circleProgress.length) {
      for (var i = 0; i < plugins.circleProgress.length; i++) {
        var circle = $(plugins.circleProgress[i]);

        circle
          .circleProgress({
            value: circle.attr("data-value"),
            size: circle.attr("data-size") ? circle.attr("data-size") : 175,
            fill: {
              gradient: circle.attr("data-gradient").split(","),
              gradientAngle: Math.PI / 4,
            },
            startAngle: (-Math.PI / 4) * 2,
            emptyFill: circle.attr("data-empty-fill")
              ? circle.attr("data-empty-fill")
              : "rgb(245,245,245)",
          })
          .on("circle-animation-progress", function (
            event,
            progress,
            stepValue
          ) {
            $(this)
              .find("span")
              .text(
                String(stepValue.toFixed(2))
                  .replace("0.", "")
                  .replace("1.", "1")
              );
          });

        if (isScrolledIntoView(circle)) circle.addClass("animated-first");

        $window.on(
          "scroll",
          $.proxy(function () {
            var circle = $(this);
            if (
              !circle.hasClass("animated-first") &&
              isScrolledIntoView(circle)
            ) {
              circle.circleProgress("redraw");
              circle.addClass("animated-first");
            }
          }, circle)
        );
      }
    }

    // Isotope
    if (plugins.isotope.length) {
      for (var i = 0; i < plugins.isotope.length; i++) {
        var wrap = plugins.isotope[i],
          filterHandler = function (event) {
            event.preventDefault();
            for (var n = 0; n < this.isoGroup.filters.length; n++)
              this.isoGroup.filters[n].classList.remove("active");
            this.classList.add("active");
            this.isoGroup.isotope.arrange({
              filter:
                this.getAttribute("data-isotope-filter") !== "*"
                  ? '[data-filter*="' +
                    this.getAttribute("data-isotope-filter") +
                    '"]'
                  : "*",
            });
          },
          resizeHandler = function () {
            this.isoGroup.isotope.layout();
          };

        wrap.isoGroup = {};
        wrap.isoGroup.filters = wrap.querySelectorAll("[data-isotope-filter]");
        wrap.isoGroup.node = wrap.querySelector(".isotope");
        wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute(
          "data-isotope-layout"
        )
          ? wrap.isoGroup.node.getAttribute("data-isotope-layout")
          : "masonry";
        wrap.isoGroup.isotope = new Isotope(wrap.isoGroup.node, {
          itemSelector: ".isotope-item",
          layoutMode: wrap.isoGroup.layout,
          filter: "*",
          masonry: {
            columnWidth: ".col-1",
          },
        });

        for (var n = 0; n < wrap.isoGroup.filters.length; n++) {
          var filter = wrap.isoGroup.filters[n];
          filter.isoGroup = wrap.isoGroup;
          filter.addEventListener("click", filterHandler);
        }

        window.addEventListener("resize", resizeHandler.bind(wrap));
      }
    }

    // Material Parallax
    if (plugins.materialParallax.length) {
      if (!isNoviBuilder && !isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else {
        for (var i = 0; i < plugins.materialParallax.length; i++) {
          var $parallax = $(plugins.materialParallax[i]);

          $parallax.addClass("parallax-disabled");
          $parallax.css({
            "background-image": "url(" + $parallax.data("parallax-img") + ")",
          });
        }
      }
    }
  });

  // Initialize scripts that require a finished document
  $(function () {
    isNoviBuilder = window.xMode;

    /**
     * @desc Toggle swiper videos on active slides
     * @param {object} swiper - swiper slider
     */
    function toggleSwiperInnerVideos(swiper) {
      var prevSlide = $(swiper.slides[swiper.previousIndex]),
        nextSlide = $(swiper.slides[swiper.activeIndex]),
        videos,
        videoItems = prevSlide.find("video");

      for (var i = 0; i < videoItems.length; i++) {
        videoItems[i].pause();
      }

      videos = nextSlide.find("video");
      if (videos.length) {
        videos.get(0).play();
      }
    }

    /**
     * @desc Toggle swiper animations on active slides
     * @param {object} swiper - swiper slider
     */
    function toggleSwiperCaptionAnimation(swiper) {
      var prevSlide = $(swiper.container).find("[data-caption-animate]"),
        nextSlide = $(swiper.slides[swiper.activeIndex]).find(
          "[data-caption-animate]"
        ),
        delay,
        duration,
        nextSlideItem,
        prevSlideItem;

      for (var i = 0; i < prevSlide.length; i++) {
        prevSlideItem = $(prevSlide[i]);

        prevSlideItem
          .removeClass("animated")
          .removeClass(prevSlideItem.attr("data-caption-animate"))
          .addClass("not-animated");
      }

      var tempFunction = function (nextSlideItem, duration) {
        return function () {
          nextSlideItem
            .removeClass("not-animated")
            .addClass(nextSlideItem.attr("data-caption-animate"))
            .addClass("animated");
          if (duration) {
            nextSlideItem.css("animation-duration", duration + "ms");
          }
        };
      };

      for (var i = 0; i < nextSlide.length; i++) {
        nextSlideItem = $(nextSlide[i]);
        delay = nextSlideItem.attr("data-caption-delay");
        duration = nextSlideItem.attr("data-caption-duration");
        if (!isNoviBuilder) {
          if (delay) {
            setTimeout(
              tempFunction(nextSlideItem, duration),
              parseInt(delay, 10)
            );
          } else {
            tempFunction(nextSlideItem, duration);
          }
        } else {
          nextSlideItem.removeClass("not-animated");
        }
      }
    }

    /**
     * @desc Initialize Bootstrap tooltip with required placement
     * @param {string} tooltipPlacement
     */
    function initBootstrapTooltip(tooltipPlacement) {
      plugins.bootstrapTooltip.tooltip("dispose");

      if (window.innerWidth < 576) {
        plugins.bootstrapTooltip.tooltip({ placement: "bottom" });
      } else {
        plugins.bootstrapTooltip.tooltip({ placement: tooltipPlacement });
      }
    }

    /**
     * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
     * @param {object} swiper - swiper instance
     */
    function setRealPrevious(swiper) {
      var element = swiper.$wrapperEl[0].children[swiper.activeIndex];
      swiper.realPrevious = Array.prototype.indexOf.call(
        element.parentNode.children,
        element
      );
    }

    function initSwiper(sliderMarkup) {
      var autoplayAttr = sliderMarkup.getAttribute("data-autoplay") || 5000,
        slides = sliderMarkup.querySelectorAll(".swiper-slide"),
        swiper,
        options = {
          loop: sliderMarkup.getAttribute("data-loop") === "true" || false,
          effect: sliderMarkup.getAttribute("data-effect") || "slide",
          direction:
            sliderMarkup.getAttribute("data-direction") || "horizontal",
          speed: sliderMarkup.getAttribute("data-speed")
            ? Number(sliderMarkup.getAttribute("data-speed"))
            : 600,
          simulateTouch:
            (sliderMarkup.getAttribute("data-simulate-touch") === "true" &&
              !isNoviBuilder) ||
            false,
          slidesPerView: sliderMarkup.getAttribute("data-slides") || 1,
          spaceBetween: Number(sliderMarkup.getAttribute("data-margin")) || 0,
        };

      if (Number(autoplayAttr)) {
        options.autoplay = {
          delay: Number(autoplayAttr),
          stopOnLastSlide: false,
          disableOnInteraction: true,
          reverseDirection: false,
        };
      }

      if (sliderMarkup.getAttribute("data-keyboard") === "true") {
        options.keyboard = {
          enabled: sliderMarkup.getAttribute("data-keyboard") === "true",
          onlyInViewport: true,
        };
      }

      if (sliderMarkup.getAttribute("data-mousewheel") === "true") {
        options.mousewheel = {
          sensitivity: 1,
        };
      }

      if (
        sliderMarkup.querySelector(".swiper-button-next, .swiper-button-prev")
      ) {
        options.navigation = {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        };
      }

      if (sliderMarkup.querySelector(".swiper-pagination")) {
        options.pagination = {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        };
      }

      if (sliderMarkup.querySelector(".swiper-scrollbar")) {
        options.scrollbar = {
          el: ".swiper-scrollbar",
          hide: false,
        };
      }

      for (var s = 0; s < slides.length; s++) {
        var slide = slides[s],
          url = slide.getAttribute("data-slide-bg");

        if (url) slide.style.backgroundImage = "url(" + url + ")";
      }

      options.on = {
        init: function () {
          setRealPrevious(this);
          initCaptionAnimate(this);

          // Real Previous Index must be set recent
          this.on("slideChangeTransitionEnd", function () {
            setRealPrevious(this);
          });
        },
      };

      swiper = new Swiper(sliderMarkup, options);
      return swiper;
    }

    // Additional class on html if mac os.
    if (navigator.platform.match(/(Mac)/i)) {
      $html.addClass("mac-os");
    }

    // Adds some loosing functionality to IE browsers (IE Polyfills)
    if (isIE) {
      if (isIE === 12) $html.addClass("ie-edge");
      if (isIE === 11) $html.addClass("ie-11");
      if (isIE < 10) $html.addClass("lt-ie-10");
      if (isIE < 11) $html.addClass("ie-10");
    }

    // Bootstrap Tooltips
    if (plugins.bootstrapTooltip.length) {
      var tooltipPlacement = plugins.bootstrapTooltip.attr("data-placement");
      initBootstrapTooltip(tooltipPlacement);

      $window.on("resize orientationchange", function () {
        initBootstrapTooltip(tooltipPlacement);
      });
    }

    // Stop vioeo in bootstrapModalDialog
    if (plugins.bootstrapModalDialog.length) {
      for (var i = 0; i < plugins.bootstrapModalDialog.length; i++) {
        var modalItem = $(plugins.bootstrapModalDialog[i]);

        modalItem.on(
          "hidden.bs.modal",
          $.proxy(function () {
            var activeModal = $(this),
              rdVideoInside = activeModal.find("video"),
              youTubeVideoInside = activeModal.find("iframe");

            if (rdVideoInside.length) {
              rdVideoInside[0].pause();
            }

            if (youTubeVideoInside.length) {
              var videoUrl = youTubeVideoInside.attr("src");

              youTubeVideoInside.attr("src", "").attr("src", videoUrl);
            }
          }, modalItem)
        );
      }
    }

    // Popovers
    if (plugins.popover.length) {
      if (window.innerWidth < 767) {
        plugins.popover.attr("data-placement", "bottom");
        plugins.popover.popover();
      } else {
        plugins.popover.popover();
      }
    }

    // Bootstrap Buttons
    if (plugins.statefulButton.length) {
      $(plugins.statefulButton).on("click", function () {
        var statefulButtonLoading = $(this).button("loading");

        setTimeout(function () {
          statefulButtonLoading.button("reset");
        }, 2000);
      });
    }

    // Bootstrap tabs
    if (plugins.bootstrapTabs.length) {
      for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
        var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

        //If have slick carousel inside tab - resize slick carousel on click
        if (bootstrapTabsItem.find(".slick-slider").length) {
          bootstrapTabsItem.find(".tabs-custom-list > li > a").on(
            "click",
            $.proxy(function () {
              var $this = $(this);
              var setTimeOutTime = isNoviBuilder ? 1500 : 300;

              setTimeout(function () {
                $this
                  .find(".tab-content .tab-pane.active .slick-slider")
                  .slick("setPosition");
              }, setTimeOutTime);
            }, bootstrapTabsItem)
          );
        }
      }
    }

    // Copyright Year (Evaluates correct copyright year)
    if (plugins.copyrightYear.length) {
      plugins.copyrightYear.text(initialDate.getFullYear());
    }

    // Add custom styling options for input[type="radio"]
    if (plugins.radio.length) {
      for (var i = 0; i < plugins.radio.length; i++) {
        $(plugins.radio[i])
          .addClass("radio-custom")
          .after("<span class='radio-custom-dummy'></span>");
      }
    }

    // Add custom styling options for input[type="checkbox"]
    if (plugins.checkbox.length) {
      for (var i = 0; i < plugins.checkbox.length; i++) {
        $(plugins.checkbox[i])
          .addClass("checkbox-custom")
          .after("<span class='checkbox-custom-dummy'></span>");
      }
    }

    // RD Navbar
    if (plugins.rdNavbar.length) {
      var aliaces, i, j, len, value, values, responsiveNavbar;

      aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
      values = [0, 576, 768, 992, 1200, 1600];
      responsiveNavbar = {};

      for (i = j = 0, len = values.length; j < len; i = ++j) {
        value = values[i];
        if (!responsiveNavbar[values[i]]) {
          responsiveNavbar[values[i]] = {};
        }
        if (plugins.rdNavbar.attr("data" + aliaces[i] + "layout")) {
          responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr(
            "data" + aliaces[i] + "layout"
          );
        }
        if (plugins.rdNavbar.attr("data" + aliaces[i] + "device-layout")) {
          responsiveNavbar[values[i]]["deviceLayout"] = plugins.rdNavbar.attr(
            "data" + aliaces[i] + "device-layout"
          );
        }
        if (plugins.rdNavbar.attr("data" + aliaces[i] + "hover-on")) {
          responsiveNavbar[values[i]]["focusOnHover"] =
            plugins.rdNavbar.attr("data" + aliaces[i] + "hover-on") === "true";
        }
        if (plugins.rdNavbar.attr("data" + aliaces[i] + "auto-height")) {
          responsiveNavbar[values[i]]["autoHeight"] =
            plugins.rdNavbar.attr("data" + aliaces[i] + "auto-height") ===
            "true";
        }

        if (isNoviBuilder) {
          responsiveNavbar[values[i]]["stickUp"] = false;
        } else if (plugins.rdNavbar.attr("data" + aliaces[i] + "stick-up")) {
          responsiveNavbar[values[i]]["stickUp"] =
            plugins.rdNavbar.attr("data" + aliaces[i] + "stick-up") === "true";
        }

        if (plugins.rdNavbar.attr("data" + aliaces[i] + "stick-up-offset")) {
          responsiveNavbar[values[i]]["stickUpOffset"] = plugins.rdNavbar.attr(
            "data" + aliaces[i] + "stick-up-offset"
          );
        }
      }

      plugins.rdNavbar.RDNavbar({
        anchorNav: !isNoviBuilder,
        stickUpClone:
          plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder
            ? plugins.rdNavbar.attr("data-stick-up-clone") === "true"
            : false,
        responsive: responsiveNavbar,
        callbacks: {
          onStuck: function () {
            var navbarSearch = this.$element.find(".rd-search input");

            if (navbarSearch) {
              navbarSearch.val("").trigger("propertychange");
            }
          },
          onDropdownOver: function () {
            return !isNoviBuilder;
          },
          onUnstuck: function () {
            if (this.$clone === null) return;

            var navbarSearch = this.$clone.find(".rd-search input");

            if (navbarSearch) {
              navbarSearch.val("").trigger("propertychange");
              navbarSearch.trigger("blur");
            }
          },
        },
      });

      if (plugins.rdNavbar.attr("data-body-class")) {
        document.body.className +=
          " " + plugins.rdNavbar.attr("data-body-class");
      }
    }

    // Add class in viewport
    if (plugins.viewAnimate.length) {
      for (var i = 0; i < plugins.viewAnimate.length; i++) {
        var $view = $(plugins.viewAnimate[i]).not(".active");
        $document
          .on(
            "scroll",
            $.proxy(function () {
              if (isScrolledIntoView(this)) {
                this.addClass("active");
              }
            }, $view)
          )
          .trigger("scroll");
      }
    }

    // Swiper
    if (plugins.swiper) {
      for (var i = 0; i < plugins.swiper.length; i++) {
        plugins.swiper[i].swiper = initSwiper(plugins.swiper[i]);
      }

      var dynamicSwipers = $(".swiper-slider-custom");
      if (dynamicSwipers.length) {
        $window.on("resize orientationchange", function () {
          for (var i = 0; i < dynamicSwipers.length; i++) {
            if (
              window.innerWidth < 576 &&
              dynamicSwipers[i].swiper.params.direction === "vertical"
            ) {
              dynamicSwipers[i].setAttribute("data-direction", "horizontal");
              dynamicSwipers[i].swiper.destroy();
              initSwiper(dynamicSwipers[i]);
            } else if (
              window.innerWidth >= 576 &&
              dynamicSwipers[i].swiper.params.direction === "horizontal"
            ) {
              dynamicSwipers[i].setAttribute("data-direction", "vertical");
              dynamicSwipers[i].swiper.destroy();
              initSwiper(dynamicSwipers[i]);
            }
          }
        });
      }
    }

    // RD Input Label
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }

    // Regula
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }

    // Custom Toggles
    if (plugins.customToggle.length) {
      for (var i = 0; i < plugins.customToggle.length; i++) {
        var $this = $(plugins.customToggle[i]);

        $this.on(
          "click",
          $.proxy(function (event) {
            event.preventDefault();

            var $ctx = $(this);
            $($ctx.attr("data-custom-toggle")).add(this).toggleClass("active");
          }, $this)
        );

        if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (
              e.target !== e.data[0] &&
              $(e.data.attr("data-custom-toggle")).find($(e.target)).length &&
              e.data.find($(e.target)).length === 0
            ) {
              $(e.data.attr("data-custom-toggle"))
                .add(e.data[0])
                .removeClass("active");
            }
          });
        }

        if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (
              e.target !== e.data[0] &&
              $(e.data.attr("data-custom-toggle")).find($(e.target)).length ===
                0 &&
              e.data.find($(e.target)).length === 0
            ) {
              $(e.data.attr("data-custom-toggle"))
                .add(e.data[0])
                .removeClass("active");
            }
          });
        }
      }
    }

    //RD Range
    if (plugins.rdRange.length && !isNoviBuilder) {
      plugins.rdRange.RDRange({
        callbacks: {
          onChange: function () {
            var $inputs = $(".rd-range-input-value-1, .rd-range-input-value-2");

            for (var z = 0; z < $inputs.length; z++) {
              if (isDesktop) {
                $inputs[z].style.width =
                  ($inputs[z].value.length + 1) * 1.15 + "ch";
              }
            }
          },
        },
      });
    }

    // Select2
    if (plugins.selectFilter.length) {
      var i;
      for (i = 0; i < plugins.selectFilter.length; i++) {
        var select = $(plugins.selectFilter[i]),
          selectStyle = "html-" + select.attr("data-style") + "-select";
        $html.addClass(selectStyle);

        select.select2({
          placeholder: select.attr("data-placeholder")
            ? select.attr("data-placeholder")
            : false,
          minimumResultsForSearch: select.attr("data-minimum-results-search")
            ? select.attr("data-minimum-results-search")
            : -1,
          maximumSelectionSize: 3,
          dropdownCssClass: select.attr("data-dropdown-class")
            ? select.attr("data-dropdown-class")
            : false,
        });
      }
    }

    // Stepper
    if (plugins.stepper.length) {
      plugins.stepper.stepper({
        labels: {
          up: "",
          down: "",
        },
      });
    }

    // Radio Panel
    if (plugins.radioPanel) {
      for (var i = 0; i < plugins.radioPanel.length; i++) {
        var $element = $(plugins.radioPanel[i]);
        $element.on("click", function () {
          plugins.radioPanel.removeClass("active");
          $(this).addClass("active");
        });
      }
    }

    // Multitoggles
    if (plugins.multitoggle.length) {
      multitoggles();
    }
  });
});
