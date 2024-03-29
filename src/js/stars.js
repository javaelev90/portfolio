// Skapare: Anders Lumio
( function() {
    class StarMaker {

        initiate = () => {
            this.canvas = document.getElementById('landingpagecanvas');
            this.context = this.canvas.getContext('2d');
            this.setCanvasExtent();

            window.onresize = () => {
              this.setCanvasExtent();
            };
        
            this.stars = this.makeStars(2000);
            window.requestAnimationFrame(this.init);
        }
    
        setCanvasExtent = () => {
            this.canvasHeight = document.body.clientHeight;
            this.canvasWidth = document.body.clientWidth;
            this.canvas.height = this.canvasHeight;
            this.canvas.width = this.canvasWidth;
        }
        
        makeStars = (count) =>{
            const out = [];
            for (let i = 0; i < count; i++) {
                const biasValue = 0; // axis value 0
                const influenceX = 1;
                const influenceY = 0.7;
                const mixX = Math.random() * influenceX;
                const mixY = Math.random() * influenceY;

                const s = {
                    // Bias for where on the x/y axis stars should be positioned
                    x: (Math.random() * 1600 - 800) * (1 - mixX) + biasValue * mixX,
                    y: (Math.random() * 1000 - 500) * (1 - mixY) + biasValue * mixY,
                    z: Math.random() * 1000,
                    color: {
                        red: this.getRandomColorValue(1, 255),
                        green: this.getRandomColorValue(1, 255),
                        blue: this.getRandomColorValue(1, 255)
                    }
                };
                out.push(s);
            }
            return out;
        }

        getRandomColorValue = (min, max) => {
            return Math.floor(Math.random() * (max - min) ) + min;
        }
        
        clear = () => {
            this.context.fillStyle = 'black';
            this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }

        putPixel = (x, y, brightness, color) => {
            // const intensity = brightness * 255;
            // const red = brightness * color.red;
            // const green = brightness * color.green;
            // const blue = brightness * color.blue;
            const red = brightness * 222;
            const green = brightness * 153;
            const blue = brightness * 0;
            const rgb = 'rgb(' + red + ',' + green + ',' + blue + ')';
            this.context.fillStyle = rgb;
            this.context.fillRect(x, y, 2, 5);
   
        }

        moveStars = (distance) => {
            const count = this.stars.length;
            for (let i = 0; i < count; i++) {
                const star = this.stars[i];
                star.z -= distance;
                //Reset star z position
                while (star.z <= 1) {
                    star.z += 1000;
                }
            }
        }
    
        sleep = (time) => {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        init = (time) => {
            this.prevTime = time;
            window.requestAnimationFrame(this.tick);

        }
    
        tick = (time) => {
            const elapsed = time - this.prevTime;
            this.prevTime = time;
    
            this.moveStars(elapsed * 0.02);
    
            this.clear();
            
            // Center x and y of canvas
            const cx = this.canvasWidth / 2;
            const cy = this.canvasHeight / 2;
    
            const count = this.stars.length;
            
            for (let i = 0; i < count; i++) {
                const star = this.stars[i];
                
                // Move stars faster when they have lower z-value, i.e. when they are closer to the screen
                const x = cx + star.x / (star.z * 0.001);
                const y = cy + star.y / (star.z * 0.001);
                
                // Don't move a star if it's outside the canvas bounds
                if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
                    continue;
                }
                
                // Calculate who far the star has moved, starting at z=1000
                const d = star.z / 1000.0;
                // Calculating brithness depending on how close to goal/screen the star is
                const brightness = 1 - d * d;
    
                this.putPixel(x, y, brightness, star.color);
            }
            //60 FPS i.e 16 ms per frame
            this.sleep(16).then(() => {
                window.requestAnimationFrame(this.tick); 
            }); 
        }
    }

    window.addEventListener('load', (event) => {
        new StarMaker().initiate();
    });

})();