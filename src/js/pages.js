// Skapare: Anders Lumio
$(window).scroll(function() {
    if ($(this).scrollTop() > 150) {
        $( "#headerbackground" ).fadeIn();
    } else {
        $( "#headerbackground" ).fadeOut();
    }
});

$('a').click(function(e) {
    e.preventDefault();
    newLocation = this.href;
    $('body').fadeOut('slow', newpage);
});

function newpage() {
    window.location = newLocation;
}

$(document).ready(function(){
    /*! Fades in whole page on load */
    $('body').css('display', 'none');
    $('body').fadeIn(800);

}); 