// after loading all page elements(including images), hide the preloader
$(window).on('load', function() {
    $("#wrapper").fadeOut('slow');
});
