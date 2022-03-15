// Skapare: Anders Lumio
// Removes game iframe overlay and sets the iframe src
function runGame() {
    var iframe = document.getElementById("game-window");
    var iframeOverlay = document.getElementById("iframe-overlay");
    iframe.src = iframe.dataset.src; 
    iframeOverlay.style.display = "none";
    iframe.style.display = "flex";
}

// Sets the game-window iframe to fullscreen if allowed
function iframeFullscreen() {
    // Check if browser allows fullscreen
    if (document.fullscreenEnabled          || 
        document.webkitFullscreenEnabled    || 
        document.mozFullScreenEnabled       ||
        document.msFullscreenEnabled        ) {
        
        // Retrieve game iframe
        var iframe = document.getElementById("game-window");
        
        // Set game screen to full screen
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
        
    }
}