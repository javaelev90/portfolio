$(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
        $( "#headerbackground" ).fadeIn();
    } else {
        console.log('there');
        $( "#headerbackground" ).fadeOut();
    }
});