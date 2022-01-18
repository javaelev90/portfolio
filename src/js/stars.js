( function() {
    class StarMaker {

        initiate = () => {
            this.canvas = document.getElementById('landingpagecanvas');
            this.context = this.canvas.getContext('2d');
            this.setCanvasExtent();

            window.onresize = () => {
              this.setCanvasExtent();
            };
        
            this.stars = this.makeStars(1500);
            requestAnimationFrame(this.init);
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
                const influence = 0.95;
                const mix = Math.random() * influence;
                const s = {
                    // Bias for where on the x axis stars should be positioned
                    x: (Math.random() * 1600 - 800) * (1 - mix) + biasValue * mix,
                    y: Math.random() * 1000 - 500,
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
            const intensity = brightness * 255;
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
                const s = this.stars[i];
                s.z -= distance;
                //Reset star z position
                while (s.z <= 1) {
                    s.z += 1000;
                }
            }
        }
    
        sleep = time => {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        init = time => {
            this.prevTime = time;
            requestAnimationFrame(this.tick);
        }
    
        tick = time => {
            const elapsed = time - this.prevTime;
            this.prevTime = time;
    
            this.moveStars(elapsed * 0.02);
    
            this.clear();
    
            const cx = this.canvasWidth / 2;
            const cy = this.canvasHeight / 2;
    
            const count = this.stars.length;
            
            for (let i = 0; i < count; i++) {
                const star = this.stars[i];
    
                const x = cx + star.x / (star.z * 0.001);
                const y = cy + star.y / (star.z * 0.001);
    
                if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) {
                    continue;
                }
    
                const d = star.z / 1000.0;
                const brightness = 1 - d * d;
    
                this.putPixel(x, y, brightness, star.color);
            }
            //60 FPS i.e 16 ms per frame
            this.sleep(16).then(() => {
                requestAnimationFrame(this.tick); 
            }); 
        }
    }

    window.addEventListener('load', (event) => {
        console.log('loading stars');
        new StarMaker().initiate();
    });

})();