$(window).scroll(function() {
    if ($(this).scrollTop() > 150) {
        $( "#headerbackground" ).fadeIn();
    } else {
        console.log('there');
        $( "#headerbackground" ).fadeOut();
    }
});