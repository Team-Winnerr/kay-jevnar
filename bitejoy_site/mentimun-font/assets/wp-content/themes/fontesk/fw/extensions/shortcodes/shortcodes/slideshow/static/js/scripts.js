jQuery(document).ready(function ($) {
    jQuery('.fw-slider').each(function () {
        var slider = jQuery(this).find('.fw-slider-container');
        var timeoutDuration = parseInt( slider.attr('data-timeoutDuration') );
        var pause = slider.attr('data-pause');
        var animation = slider.attr('data-animation');
        var duration = parseInt( slider.attr('data-duration') );
        var play = slider.attr('data-play');
        if(play == 'true') {
            play = true;
        }
        else{
            play = false;
        }
 
        slider.imagesLoaded(function () {
            slider.carouFredSel({				
                pagination: {
                    container: function () {
                        return jQuery(this).parents(".fw-slider").find(".fw-slider-pagination");
                    }
                },
                prev: {
                    button: function () {
                        return jQuery(this).parents(".fw-slider").find(".fw-slider-prev");
                    }
                },
                next: {
                    button: function () {
                        return jQuery(this).parents(".fw-slider").find(".fw-slider-next");
                    }
                },
				swipe: {
                onTouch     : true,
                onMouse     : true
                },
                responsive: true,
                infinite: false,
                width: "100%",
                height: 'variable',
                items: {
                    visible: 1,
                    height: 'variable'
                },
                auto: {
                    play: play,
                    timeoutDuration: timeoutDuration,
                    pauseOnHover: pause
                },
                scroll: {
                    fx: animation,
                    duration: duration
                },
                onCreate: function () {
                    slider.parents('.fw-slider').removeClass("hide-elements");
                }
			});			
        });
    });
});