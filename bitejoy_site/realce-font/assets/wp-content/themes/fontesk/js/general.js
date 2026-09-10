jQuery(document).ready(function ($) {
    "use strict";
    var screenRes = $(window).width(),
        screenHeight = $(window).height(),
        innerScreenRes = window.innerWidth, // Screen size width minus scrollbar width
        html = $('html'),
        $ = jQuery;

    // Disable Empty Links
    $('a[href="#"]').click(function (event) {
        event.preventDefault();
    });

    // Remove outline in IE
    $("a, input, textarea").attr("hideFocus", "true").css("outline", "none");

    if ($('select[class*="select-"]').length > 0) {
        $('select[class*="select-"]').selectize({
            create: true
        });
    }

    // selectize control input
    Selectize.define('selectize_control_input', function(options) {
        var self = this;
        this.showInput = function() {
            this.$control.css({cursor: 'pointer'});
            this.$control_input.css({opacity: 0, position: 'relative', left: self.rtl ? 10000 : -10000 });
            this.isInputHidden = false;
        };

        this.setup_original = this.setup;

        this.setup = function() {
            self.setup_original();
            this.$control_input.prop("disabled","disabled");
        }
    });

    if( screenRes < 1025 ) {
        $('select[name="archive-dropdown"], select[name="cat"], select[name="monster-widget-just-testing"], .wpcf7-select').selectize({
            create: true,
            allowEmptyOption: true,
            plugins: ['selectize_control_input']
        });
    }
    else {
        $('select[name="archive-dropdown"], select[name="cat"], select[name="monster-widget-just-testing"], .wpcf7-select').selectize({
            create: true,
            allowEmptyOption: true
        });
    }


    // prettyPhoto lightbox, check if <a> has atrr data-rel and hide for Mobiles
    if ($('a').is('[data-rel]')) {
        $('a[data-rel]').each(function () {
            $(this).attr('rel', $(this).data('rel'));
        });
        $("a[rel^='prettyPhoto']").prettyPhoto({
            social_tools: false,
            deeplinking: false,
            theme: 'dark_square',
            horizontal_padding: 60,
            show_title: false,
            default_width: 800,
            default_height: 400,
            allow_resize: true,
            overlay_gallery: false,
            markup: '<div class="pp_pic_holder"> \
						<div class="ppt">&nbsp;</div> \
						<div class="pp_top"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
						<div class="pp_content_container"> \
							<div class="pp_left"> \
							<div class="pp_right"> \
								<div class="pp_content"> \
									<div class="pp_loaderIcon"></div> \
									<div class="pp_fade"> \
										<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
										<div class="pp_hoverContainer"> \
											<a class="pp_next" href="#">' + FwPhpVars.next + '</a> \
											<a class="pp_previous" href="#">' + FwPhpVars.previous + '</a> \
										</div> \
										<div id="pp_full_res"></div> \
										<div class="pp_details"> \
											<div class="pp_nav"> \
												<a href="#" class="pp_arrow_previous">' + FwPhpVars.previous + '</a> \
												<p class="currentTextHolder">0/0</p> \
												<a href="#" class="pp_arrow_next">' + FwPhpVars.next + '</a> \
											</div> \
											<p class="pp_description"></p> \
											<div class="pp_social">{pp_social}</div> \
											<a class="pp_close" href="#">Close</a> \
										</div> \
									</div> \
								</div> \
							</div> \
							</div> \
						</div> \
						<div class="pp_bottom"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
					</div> \
					<div class="pp_overlay"></div>',
            changepicturecallback: function () {
                setupSwipe();
                var $holder = jQuery('.pp_nav .currentTextHolder'),
                    $closeButton = jQuery('.pp_close'),
                    splitted = $holder.text().split('/');
                $closeButton.addClass('fa fa-times');

                $holder.html(splitted.join('<span class="pp_text_devider">/</span>'));
                $closeButton.remove();
                $('.pp_pic_holder').prepend($closeButton);

                $closeButton.click(function () {
                    $('.pp_overlay, .pp_pic_holder').fadeOut(300, function () {
                        $(this).remove();
                    });
                    return false
                });
            }
        });
        var setupSwipe = function(){
            $(".pp_pic_holder").swipe({
                swipeLeft: function () {
                    $.prettyPhoto.changePage('next');
                },
                swipeRight: function () {
                    $.prettyPhoto.changePage('previous');
                },
                min_move_x: 20,
                min_move_y: 20,
                preventDefaultEvents: true
            });
        };
    }

    // Set width for divider on pagination type 2
    function widthDividerPostPagination2 (){
        var paginationContainerWidth = jQuery('.paging-navigation-type-2').outerWidth()/2,
            buttonPrevWidth = jQuery('.paging-navigation-type-2 .prev').outerWidth(),
            buttonNextWidth = jQuery('.paging-navigation-type-2 .next').outerWidth(),
            numbersWrap = jQuery('.paging-navigation-type-2 .pagination-numbers-wrap').outerWidth()/2;

        jQuery('.paging-navigation-type-2 .before-hr').css({
            'width': paginationContainerWidth - numbersWrap - buttonPrevWidth,
            'left':  buttonPrevWidth
        });
        jQuery('.paging-navigation-type-2 .after-hr').css({
            'width': paginationContainerWidth - numbersWrap - buttonNextWidth,
            'right': buttonNextWidth
        });
    }
    if(jQuery('.paging-navigation.paging-navigation-type-2').length > 0){
        widthDividerPostPagination2();
        $(window).resize(function(){ widthDividerPostPagination2(); });
    }

    //Iframe Rerponsive
    function adjustIframes() {
        $('iframe').each(function () {
            var $this = $(this),
                proportion = $this.data('proportion'),
                w = $this.attr('width'),
                actual_w = $this.width();

            if (!proportion) {
                proportion = $this.attr('height') / w;
                $this.data('proportion', proportion);
            }

            if (actual_w != w) {
                $this.css('height', Math.round(actual_w * proportion) + 'px');
            }
        });
    }
    $(window).on('resize load', adjustIframes);

    // Detect Click in Iframe
    function detectIframeClick() {
        var overiFrame = -1;
        jQuery('.myCarousel').find('iframe').hover(function () {
            overiFrame = 1;
        }, function () {
            overiFrame = -1
        });
        $(window).on('blur', function () {
            if (overiFrame != -1) {
                jQuery('.myCarousel').carousel('pause');
            }
        });
        jQuery('.carousel-control, .carousel-indicators li').click(function () {
            jQuery('.myCarousel').carousel('cycle');
        });
    }
    detectIframeClick();

    // Smooth Scroling of ID anchors
    function filterPath(string) {
        return string
            .replace(/^\//, '')
            .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
            .replace(/\/$/, '');
    }

    var locationPath = filterPath(location.pathname);
    var scrollElem = scrollableElement('html', 'body');

    function anchorFn(argument) {
        var HeaderHeightNormal = 0,
            HeaderHeightSticky = 0;

        // only if is sticky header calculate the headears height for know the offset, in other case the header height is 0
        if($('.fw-header-sticky').length > 0) {
            HeaderHeightNormal = $('.fw-header').height(); // Normal Header Height
            HeaderHeightSticky = $('.fw-header.fw-sticky-menu').height(); // Sticky Header Height
        }

        $('.anchor a[href*="#"], a[href*="#"].anchor').each(function () {
            $(this).click(function (event) {
                if( $(this).parents('.fw-header').hasClass('fw-sticky-menu') && screenRes > 767 ) {
                    var HeaderHeight = HeaderHeightSticky;
                }
                else {
                    var HeaderHeight = HeaderHeightNormal;
                }

                var thisPath = filterPath(this.pathname) || locationPath;
                if (locationPath == thisPath
                    && (location.hostname == this.hostname || !this.hostname)
                    && this.hash.replace(/#/, '')) {
                    var $target = $(this.hash), target = this.hash;
                    if (target && $target.length != 0) {
                        var targetOffset = $target.offset().top - HeaderHeight;
                        event.preventDefault();
                        $(scrollElem).animate({scrollTop: targetOffset}, 400);
                        setTimeout( function(){
                            location.hash = target;
                        }, 300 );
                    }
                }
            });
        });
    }

    // Scroll To Top Button
    $(window).on('scroll', function() {
        if(jQuery('.scroll-to-top').length > 0){
            if(parseInt($(window).scrollTop(), 10) > 600){
                jQuery('.scroll-to-top').fadeIn(500);
            }
            else {
                jQuery('.scroll-to-top').fadeOut(500);
            }
        }
    });

    // use the first element that is "scrollable"
    function scrollableElement(els) {
        for (var i = 0, argLength = arguments.length; i < argLength; i++) {
            var el = arguments[i],
                $scrollElement = $(el);
            if ($scrollElement.scrollTop() > 0) {
                return el;
            } else {
                $scrollElement.scrollTop(1);
                var isScrollable = $scrollElement.scrollTop() > 0;
                $scrollElement.scrollTop(0);
                if (isScrollable) {
                    return el;
                }
            }
        }
        return [];
    }

    // Responsive Menu (Mobile Menu for header type 1 -> 4)
    var Mobile_Menu = function () {
        var $menu = jQuery('#mobile-menu'),
            mobileMenuOpenPosition = "left";

        $menu.find('.mega-menu-col').each( function(){
            var megaMenuCol = $(this);
            megaMenuCol.find('a[href="#"]').parent().addClass('linkBlank');

            $('.linkBlank').each(function() {
                var linkBlank = $(this);
                if(linkBlank.children().length === 1) {
                    linkBlank.addClass('removeItem');
                    linkBlank.parent().addClass('removeItem')
                }
            });
            $('ul.removeItem').each(function() {
                var removeItem = $(this);
                removeItem.find('li.removeItem').remove();
                removeItem.children().length === 0 ? removeItem.remove() : null;
            });
        });
        $('.linkBlank').removeClass('linkBlank');
        $('.removeItem').removeClass('removeItem');
																		
        // Positioning the Menu
        if(jQuery('.header-1.fw-top-logo-left').length){
            mobileMenuOpenPosition = "right"							
																	 
        }														  

        // Create menu
											
        $menu.mmenu({
            counters: true,
            extensions: [ "theme-dark", "effect-listitems-slide" ],
            navbar: {
                add: true
            },
            offCanvas: {
                position: mobileMenuOpenPosition
            }
        }, {
            classNames: {
                selected: "current-menu-item"
            }
        });
        anchorFn();

        if( $menu.length == 0 ) {
            return;
											 
        }

        // Close menu to click on any item
        var API = $menu.data( "mmenu" );
        $menu.find('li.menu-item a:not(".mm-next")').click(function() {
            API.close();
        });

        /**
         * Add class to tag HTML for events 'Close & Open' because transition: transform for div 'mm-slideout',
         * on iOS creates bug when you click back in browser. The page is not centered.
        */
        API.bind( "open", function() {
            $menu.parents('html').addClass('mm-menu-event-open');
        });
        API.bind( "closed", function() {
            $menu.parents('html').removeClass('mm-menu-event-open');
        });		   
    };
       if (innerScreenRes <= 1199 && $('.header-1, .header-2, .header-3, .header-4').length) {
        Mobile_Menu();
    }

    $(window).on('resize', function(){
        var innerScreenRes = window.innerWidth; // Screen size width minus scrollbar width
       if(innerScreenRes <= 1199 && $('.header-1, .header-2, .header-3, .header-4').length){
            Mobile_Menu();
        }
    });

    // Sticky Menu
    if(jQuery('body.fw-header-sticky').length > 0 && screenRes > 767) {
        jQuery('.fw-header').clone().addClass('fw-sticky-menu').prependTo('div.site');
        var height_original_header = jQuery('header.fw-header').not('header.fw-header.fw-sticky-menu').outerHeight();

        // make anchor form sticky menu with smooth scroll
        anchorFn();

        $(window).on('scroll', function () {
            if(height_original_header > 300){
                var intermediate_height = height_original_header + 250;
            } else {
                var intermediate_height = 400;
            }

            // add or remove class "fw-sticky-menu-open"
            if ($(window).scrollTop() > intermediate_height) {
                // Scroll Down
                $('.fw-header.fw-sticky-menu').addClass('fw-sticky-menu-open');
            } else {
                // Scroll Up
                $('.fw-header.fw-sticky-menu').removeClass('fw-sticky-menu-open');
            }
        });

        // complete search form on keyup
        jQuery('.fw-header .fw-search-form .fw-input-search').on("keyup", function() {
            var search_input = jQuery(this).val();
            jQuery('.fw-header .fw-search-form .fw-input-search').val(search_input);
        });
    }
    else {
        anchorFn();
    }

    // DropDown
    if(screenRes > 1199){
           jQuery(".fw-nav-menu li.menu-item-has-children").not("li.menu-item-has-mega-menu, .header-6 #header-menu.mm-menu .mm-listview li, .header-5 .mm-listview li").hover(function () {
            var $this = $(this);
            if ($this.find('.sub-menu')) {
                var dropdown = $this.children('ul'),
                    dropdownWidth = dropdown.outerWidth(),
                    dropdownOffset = parseInt(dropdown.offset().left, 10);
                if (dropdownWidth + dropdownOffset > screenRes) {
                    dropdown.addClass('left');
                }
                else {
                    dropdown.removeClass('left');
                }
            }
        });
    }
    // Search Icon Button
    var miniSearch = function () {
        var menu_height = jQuery('.fw-header-main').not('.fw-header.fw-sticky-menu .fw-header-main').outerHeight(),
            topBar_height = jQuery('.fw-top-bar').outerHeight(),
            page_width = jQuery('#page').width(),
            container_menu_width = jQuery('.fw-header .fw-container').width();

        var wrap_search_form = jQuery('.fw-wrap-search-form'),
            search_input_height = menu_height / 2;


        // First remove and append the close button for search form. Because to resize window first and only then to remove and to add button.
        jQuery('.fw-close-search-form').remove();
        jQuery('.fw-search-form').append('<a href="#" class="fw-close-search-form"><i class="fa fa-close"></i></a>');

        // No set width/height for search in header type 6
        if(jQuery('.header-6').length < 1) {

            // Set the style for search form
            wrap_search_form.css({
                top: 0,
                width: page_width,
                height: menu_height
            });

            // If topbar is enable
            if (jQuery('.fw-top-bar-on').length > 0) {
                wrap_search_form.css({
                    top: topBar_height
                });
            }

            // Set width for input
            wrap_search_form.children('.fw-search-form').css({
                width: container_menu_width,
                marginTop: -(search_input_height / 2)
            });

            wrap_search_form.children().children('.fw-input-search').css({
                height: search_input_height,
                lineHeight: search_input_height + 'px'
            });

            // If sticky header is enable
            if (jQuery('.fw-header-sticky').length > 0 && screenRes > 767) {
                var sticky_menu_height = jQuery('.fw-header.fw-sticky-menu .fw-header-main').outerHeight();

                var sticky_wrap_search_form = jQuery('.fw-header.fw-sticky-menu .fw-wrap-search-form'),
                    sticky_search_input_height = sticky_menu_height / 2;

                // Set height for search form
                sticky_wrap_search_form.css({
                    height: sticky_menu_height
                });

                // Set position for search form
                sticky_wrap_search_form.children('.fw-search-form').css({
                    marginTop: -(sticky_search_input_height / 2)
                });

                // Set height for input from search form
                sticky_wrap_search_form.children().children('.fw-input-search').css({
                    height: sticky_search_input_height,
                    lineHeight: sticky_search_input_height + 'px'
                });
            }
        }

        // Close the search form
        jQuery('.fw-close-search-form').click(function (event) {
            event.preventDefault();
            jQuery('.fw-wrap-search-form').slideUp(300, function () {
                wrap_search_form.removeClass('opened');
            });
        });

        // Open the search form
        jQuery('.fw-search-icon').click(function (event) {
            event.preventDefault();
            jQuery('.fw-wrap-search-form').slideDown(300, function () {
                wrap_search_form.addClass('opened');
            });

            if(jQuery('.search-in-menu.fw-header-sticky') && jQuery(window).scrollTop() > 400 && screenRes > 767){
                jQuery('.fw-sticky-menu .fw-input-search').on('click').focus();
            }
            else{
                jQuery('.fw-input-search').on('click').focus();
            }
        });

        // Close the search form if click outside
        jQuery(document).mouseup(function (e) {
            var container = jQuery('.fw-wrap-search-form.fw-form-search-full');

            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                jQuery('.fw-wrap-search-form').slideUp(300, function () {
                    wrap_search_form.removeClass('opened');
                });
            }
        });
    };

    if (jQuery('.fw-mini-search').length > 0) {
        miniSearch();

        jQuery(window).on('resize', function(){
            miniSearch();
        });
    }

    // Toggles
    $('.toggle-link').click(function () {
        $(this).parents('.toggle').removeClass('collapsed');

        if (!$(this).hasClass('collapsed')) {
            $(this).parents('.toggle').addClass('collapsed');
        }
    });

    $(".opened").find(".panel-collapse").addClass("in");
    $(".panel-toggle").click(function () {
        $(this).closest(".toggleitem").toggleClass("opened");
    });

    // Icon Box Type 4 set z-index
    if($('.fw-iconbox-4.fw-icon-right').length > 0) {
        var iconDIv = $('.fw-iconbox-4.fw-icon-right');

        iconDIv.each(function(){
            var lengthCol = $(this).parents('.fw-row').children('div[class*="fw-col-"]').length,
                z_index = 10 + lengthCol; // default col z-index & + col length in row

            $(this).parents('.fw-row > div[class*="fw-col-"]').addClass('icon-box-z-index');

            $(this).parents('.fw-row').children('div[class*="icon-box-z-index"]').each(function (col) {
                $(this).css("z-index", z_index - col);
            });
        });
    }

    /**
     * Mega Menu
     */
    jQuery(function ($) {

        function leftSide(elem) {
            return elem.offset().left;
        }

        function rightSide(elem) {
            return elem.offset().left + elem.width();
        }

        function columns(mega) {
            var columns = 0;
            mega.children('.mega-menu-row').each(function () {
                columns = Math.max(columns, $(this).children('.mega-menu-col').length);
            });
            return columns;
        }

        function megaMenu(megaMenuSelector) {
            $(megaMenuSelector).each(function () {
                var a = $(this);
                var nav = a.closest('.fw-container');
                var mega = a.find('.mega-menu');
                var offset = rightSide(nav) - leftSide(a);
                var col_width = 280 + 2; // 2px border left
                var col_width2 = a.closest('.fw-container').width() / columns(mega);


                if (columns(mega) < 4) {
                    mega.width(Math.min(rightSide(nav), columns(mega) * col_width));
                    mega.children('.mega-menu-row').each(function () {
                        $(this).children('.mega-menu-col').css('width', col_width);
                    });
                } else {
                    mega.width(Math.min(rightSide(nav), columns(mega) * col_width2));
                    mega.children('.mega-menu-row').each(function () {
                        $(this).children('.mega-menu-col').css('width', col_width2, 'important');
                    });
                }
                mega.css('left', (Math.min(0, offset - mega.width())) + 15);
            });
        }

        if($('.header-1, .header-2, .header-3, .header-4').length) {
            megaMenu('.fw-site-navigation .menu-item-has-mega-menu');
        }
        $('.fw-header .menu-item-has-mega-menu').hover(function () {
            $(this).find('.mega-menu').css('display', 'block');
        }, function () {
            $(this).find('.mega-menu').css('display', 'none');
        });

        // Add Class for mega menu on ie9+ and Mozilla Firefox on Mac OS X if exist select
        var FFMac = !(window.mozInnerScreenX == null),
            msie10 = window.navigator.userAgent.indexOf("MSIE"),
            msie11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);

        if( (FFMac && navigator.platform.indexOf('Mac') >= 0) || msie10 > 0 || msie11 > 0) {
            var megaMenuSelect = $(".fw-header .menu-item-has-mega-menu .mega-menu select");

            megaMenuSelect.on('click', function(eventAddClassMegaMenu){
                $(this).parents('.mega-menu').addClass('mega-menu-select');

                // Remove class 'mega-menu-select' for mega menu
                $('.site').on('click', function(){
                    $('.mega-menu').removeClass("mega-menu-select");
                });
                eventAddClassMegaMenu.stopPropagation();
            });
        }

        $(window).on('resize', function () {
            if($('.header-1, .header-2, .header-3, .header-4').length) {
                megaMenu('.fw-site-navigation .menu-item-has-mega-menu');
            }
		})
    });
    // Align middle the heading title but header is absolute and if section-main-row-custom it has class: fw-content-overlay-sm, fw-content-overlay-md, fw-content-overlay-lg and fw-content-overlay-custom
    function sectionTopOverlay() {
        $('.fw-main-row-top.fw-content-vertical-align-middle .fw-row').css('display', 'block');

        // Set default padding for elements
        var section_top_inner_elements = $('.fw-main-row-top.fw-content-vertical-align-middle .fw-row:first-child div[class*="fw-col-sm-"]');
        section_top_inner_elements.css('paddingTop', '0');

        // Calculate & identify the elements
        var header_height = $('.fw-header .fw-header-main').outerHeight(),
            theme_content_density = Math.abs(parseInt($('.fw-main-row-top.fw-content-vertical-align-middle div[class*="fw-container-"]').css('paddingTop'))),
            section_top_height = $('.fw-main-row-top.fw-content-vertical-align-middle').outerHeight(),
            section_overlap_margin = Math.abs(parseInt($('.fw-content-overlay-sm, .fw-content-overlay-md, .fw-content-overlay-lg, .fw-content-overlay-custom').css('marginBottom'))),
            section_top_middle_area_center = (section_top_height - header_height - section_overlap_margin)/ 2,
            section_top_height_inner_element = $('.fw-main-row-top.fw-content-vertical-align-middle .fw-container-fluid, .fw-main-row-top.fw-content-vertical-align-middle .fw-container').height()/ 2,
            paddTop = ((header_height + section_top_middle_area_center) - section_top_height_inner_element);

        if($('.fw-main-row-top.fw-content-vertical-align-middle.fw-section-no-padding').length){
            section_top_inner_elements.css('paddingTop', paddTop);
        }
        else {
            section_top_inner_elements.css('paddingTop', (paddTop - theme_content_density));
        }
    }

    // Align middle the heading title but header is absolute
    function sectionTopAlignHeaderIsAbsolut(){
        $('.fw-main-row-top.fw-content-vertical-align-middle .fw-row').css('display', 'block');

        // Set default padding for elements
        var section_top_inner_elements = $('.fw-main-row-top.fw-content-vertical-align-middle .fw-row:first-child div[class*="fw-col-sm-"]');
        section_top_inner_elements.css('paddingTop', '0');

        // Calculate & identify the elements
        var header_height = $('.fw-header .fw-header-main').outerHeight(),
            theme_content_density = Math.abs(parseInt($('.fw-main-row-top.fw-content-vertical-align-middle div[class*="fw-container-"]').css('paddingTop'))),
            section_top_height = $('.fw-main-row-top.fw-content-vertical-align-middle').outerHeight(),
            section_top_middle_area_center = (section_top_height - header_height)/ 2,
            section_top_height_inner_element = $('.fw-main-row-top.fw-content-vertical-align-middle .fw-container-fluid, .fw-main-row-top.fw-content-vertical-align-middle .fw-container').height()/ 2,
            paddTop = ((header_height + section_top_middle_area_center) - section_top_height_inner_element);

        if($('.fw-main-row-top.fw-content-vertical-align-middle.fw-section-no-padding').length){
            section_top_inner_elements.css('paddingTop', paddTop);
        }
        else {
            section_top_inner_elements.css('paddingTop', (paddTop - theme_content_density));
        }
    }

    // Call align middle function
    var allOverlapClass = $('.fw-content-overlay-sm, .fw-content-overlay-md, .fw-content-overlay-lg, .fw-content-overlay-custom');
    if ( $('.fw-absolute-header').length && $('.fw-main-row-custom.fw-main-row-top.fw-content-vertical-align-middle').is(allOverlapClass) && screenRes > 767) {
        sectionTopOverlay();
        $(window).resize(function(){
            sectionTopOverlay();
        });
    }
    else if( ($('.fw-absolute-header').length > 0) && ($('.fw-main-row-custom.fw-main-row-top.fw-content-vertical-align-middle').length > 0 && screenRes > 767) ){
        sectionTopAlignHeaderIsAbsolut();
        $(window).resize(function(){
            sectionTopAlignHeaderIsAbsolut();
        });
    }

    // Animate Things (some online tools for responsive test has 760px)
    if( screenRes > 750 || FwPhpVars.smartphone_animations == 'yes' ){
        jQuery(".fw-animated-element").each(function () {
            var animationElement = $(this),
                delayAnimation = parseInt(animationElement.data('animation-delay')) / 1000,
                typeAnimation = animationElement.data('animation-type');

            if(animationElement.isOnScreen()) {
                if (!animationElement.hasClass("animated")) {
                    animationElement.addClass("animated").addClass(typeAnimation).trigger('animateIn');
                }
                animationElement.css({
                    '-webkit-animation-delay': delayAnimation + 's',
                    'animation-delay': delayAnimation + 's'
                });
            }
            $(window).scroll(function () {
                var top = animationElement.offset().top,
                    bottom = animationElement.outerHeight() + top,
                    scrollTop = $(this).scrollTop(),
                    top = top - screenHeight;

                if ((scrollTop > top) && (scrollTop < bottom)) {
                    if (!animationElement.hasClass("animated")) {
                        animationElement.addClass("animated").addClass(typeAnimation).trigger('animateIn');
                    }
                    animationElement.css({
                        '-webkit-animation-delay': delayAnimation + 's',
                        'animation-delay': delayAnimation + 's'
                    });
                    // Disable animation fill mode the reason that creates problems,
                    // on hover animation some shortcodes and video full screen in Google Chrome
                    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                    jQuery('.animated').one(animationEnd, function() {
                        $(this).addClass('fill-mode-none');
                    });
                }
            });
        });
    }
});

var $ = jQuery;

/**
 * Forms
 */
jQuery(function ($) {
    "use strict";
    var formErrorMessageClass = 'form-error',
        formErrorHideEventNamespace = '.form-error-hide',
        errorTemplate = '<p class="' + formErrorMessageClass + '" style="color: red;">{message}</p>'; // todo: customize this (add class="" instead of style="")

    function showFormError($form, inputName, message) {
        var inputSelector = '[name="' + inputName + '"]',
            $input = $form.find(inputSelector).last(),
            $message = $(errorTemplate.replace('{message}', message));

        if ($input.length) {
            $input.parent().after($message);

            $form.one('focusout' + formErrorHideEventNamespace, inputSelector, function () {
                $message.slideUp(function () {
                    $(this).remove();
                });
            });
        } else {
            // if input not found, show message in form
            $form.prepend($message);
        }
    }

    function themeGenerateFlashMessagesHtml(types) {
        var html = [], typeHtml = [];

        $.each(types, function (type, messages) {
            typeHtml = [];

            $.each(messages, function (messageId, messageData) {
                /*typeHtml.push(messageData.message);*/
                typeHtml.push(messageData);
            });

            if (typeHtml.length) {
                html.push(
                    '<ul class="flash-messages-' + type + '">' +
                    '    <li>' + typeHtml.join('</li><li>') + '</li>' +
                    '</ul>'
                );
            }
        });

        if (html.length) {
            return html.join('');
        } else {
            return '<p>Success</p>';
        }
    }

    /**
     * Display FW_Form errors
     */
    do {
        if (typeof _fw_form_invalid == 'undefined') {
            break;
        }

        var $form = $('form.fw_form_' + _fw_form_invalid.id).first();

        if (!$form.length) {
            console.error('Form not found on the page');
            break;
        }

        $.each(_fw_form_invalid.errors, function (inputName, message) {
            showFormError($form, inputName, message);
        });
    } while (false);

    /**
     * Ajax submit
     */
    {
        $(document.body).on('submit', 'form[data-fw-ext-forms-type="contact-forms"]', function (e) {
            e.preventDefault();

            var $form = $(this);

            // todo: show loading
            jQuery.ajax({
                type: "POST",
                url: FwPhpVars.ajax_url,
                data: $(this).serialize(),
                dataType: 'json'
            }).done(function (r) {
                if (r.success) {
                    // prevent multiple submit
                    $form.on('submit', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });

                    $form.html(
                        themeGenerateFlashMessagesHtml(r.data.flash_messages)
                    );

                    // if form has a redirect page, redirect the form to this URL
                    var redirect_page = $form.parents('.fw-contact-form').data('redirect-page');
                    // if has a success message & a not empty redirect page
                    if( r.data.flash_messages.success.fw_ext_contact_form_process != undefined && redirect_page != '' ) {
                        window.location.href = redirect_page;
                    }
                } else {
                    // hide all current error messages
                    $form.off(formErrorHideEventNamespace)
                        .find('.' + formErrorMessageClass).remove();

                    // add new error messages
                    $.each(r.data.errors, function (inputName, message) {
                        showFormError($form, inputName, message);
                    });
                }
            }).fail(function () {
                // show fail error message
                $form.html(FwPhpVars.fail_form_error);
                // todo: show server error
            });
        });
    }
});

// Window load function
$(window).on('load', function () {
    "use strict";
    var screenRes = $(window).width();

    // vertical align middle
    function fnResize() {
        $('.fw-content-vertical-align-middle').each(function () {
            var $this = $(this),
                heightContainerParent = $this.find('.fw-container-fluid, .fw-container').outerHeight(),
                heightParent = $this.outerHeight(),
                numberColumn = 0;
            numberColumn = parseInt($this.find('.fw-row').length);
            if (numberColumn < 2) {
                $this.find('[id^="column-"]').each(function () {
                    var $thisColum = $(this);
                    var heightColum = $thisColum.outerHeight(),
                        heightContainer = $this.find('.fw-container-fluid, .fw-container').height();
                    $thisColum.css({
                        marginTop: heightContainer / 2 - heightColum / 2
                    });
                });
                $this.css({
                    paddingTop: heightParent / 2 - heightContainerParent / 2
                }).addClass("fw-middle-align");
            } else {
                $('.fw-content-vertical-align-middle').addClass("fw-middle-align");
            }
        });
    }

    if(screenRes > 767 ){
        fnResize();
    }

    jQuery(window).resize(function () {
        var screenRes = jQuery(window).width();
        if(screenRes > 767 ){
            fnResize();
        }
    });	   
});


$(document).ready(function () {
    //Disable cut copy paste
    $('.post-template-default').bind('cut copy paste', function (e) {
        e.preventDefault();
    });
   
    //Disable mouse right click
    $(".post-template-default").on("contextmenu",function(e){
        return false;
    });
});