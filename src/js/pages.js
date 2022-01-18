$(window).scroll(function() {
    if ($(this).scrollTop() > 150) {
        $( "#headerbackground" ).fadeIn();
    } else {
        $( "#headerbackground" ).fadeOut();
    }
});