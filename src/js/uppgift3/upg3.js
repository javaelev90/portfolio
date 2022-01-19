class Box {
    
    constructor(x, y, width, height, tag) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tag = tag;

        if(this.constructor == Box){
            throw new Error("Object of Abstract Class cannot be created");
        }
    }
    
    draw() {
        throw new Error("Abstract class method");
    }

    positionInBounds(x, y) {
        const bottomRightX = this.x + this.width;
        const bottomRightY = this.y + this.height;

        if (this.x <= x && x <= bottomRightX && this.y <= y && y <= bottomRightY) {
            return true;
        }
        return false;
    }
}

class ColorBox extends Box {
    
    constructor(x, y, width, height, tag, color) {
        super(x, y, width, height, tag);
        this.color = color;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class TextBox extends ColorBox {

    constructor(x, y, width, height, tag, color, text, textcolor, fontsize) {
        super(x, y, width, height, tag, color);
        this.text = text;
        this.textcolor = textcolor;
        this.fontsize = fontsize;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.font = this.fontsize + " Calibri,Arial";
        context.fillStyle = this.textcolor;
        context.textBaseline = "middle"; 
        context.fillText(this.text, this.x + 10, this.y + (this.height / 2));
    }
}

class ImageBox extends Box {

    constructor(x, y, width, height, tag, image) {
        super(x, y, width, height, tag);
        this.image = image;
    }

    draw(context) {
        // var hRatio = canvas.width  / this.image.width;
        // var vRatio = canvas.height / this.image.height;
        // var ratio  = Math.min ( hRatio, vRatio );
        // var centerShift_x = ( canvas.width - this.image.width*ratio ) / 2;
        // var centerShift_y = ( canvas.height - this.image.height*ratio ) / 2; 
        // console.log(this.image.width);
        // console.log(this.image.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

(function() {

    const Tag = Object.freeze(
        {
            "Default": -1,
            "Background" : 1,
            "Option" : 2,
            "Reset" : 3
        }
    );
    var clickableShapes = new Array();
    var shapes = new Array();
    var canvas;
    var context;
    var canvasWidth = 400;
    var canvasHeight = 500;

    function setCanvasExtent(canvasParam) {
        canvasParam.height = canvasHeight;
        canvasParam.width = canvasWidth;
    }
    
    function draw(time) {
        
        shapes.forEach((shape) => {
            shape.draw(context);
        });
        clickableShapes.forEach((shape) => {
            shape.draw(context);
        });

        window.requestAnimationFrame(draw); 
    }
    
    function clickHandler(ev) {
        let mouseY = ev.y - canvas.offsetTop;
        let mouseX = ev.x - canvas.offsetLeft;
        if(ev.y == undefined){
            mouseY = ev.pageY - canvas.offsetTop;
        }
        if (ev.x == undefined){
            mouseX = ev.pageX - canvas.offsetLeft;
        } 

        clickableShapes.forEach((shape) => {
            if(shape.positionInBounds(mouseX, mouseY)) {
                if(shape.tag == Tag.Option){
                    evaluate(shape);
                }
                
            }
        });
    }

    function evaluate(shape) {
        if(shape.color == "#8B6CFA"){
            shape.color = "#59F07E";
        } else {
            shape.color = "#8B6CFA";
        }
    }
    
    window.addEventListener('load', (event) => {
        canvas = document.getElementById('gamecanvas');
        context = canvas.getContext('2d');
        setCanvasExtent(canvas);
        canvas.addEventListener('click', clickHandler, false); 
    
        var background = new Image(canvasWidth, canvasHeight);
        background.src = "resources/images/background.png";

        // Wait for image to be created/loaded before loading other content in canvas
        background.onload = () => {

            let backgroundBox = new ImageBox(0, 0, canvasWidth, 360, Tag.Background, background);

            let offset = 50;
            let textBox = new TextBox(offset, 40, canvasWidth-offset*2, 80, Tag.Default, "#8B6CFA", "Text box", "#F6EFF8", "16pt");
            let textBox2 = new TextBox(offset, 140, canvasWidth-offset*2, 50, Tag.Option, "#8B6CFA", "Text box2", "black", "12pt");
            let textBox3 = new TextBox(offset, 200, canvasWidth-offset*2, 50, Tag.Option, "#8B6CFA", "Text box3", "black", "12pt");
            let textBox4 = new TextBox(offset, 260, canvasWidth-offset*2, 50, Tag.Option, "#8B6CFA", "Text box4", "black", "12pt");

            shapes.push(backgroundBox);
            clickableShapes.push(textBox);
            clickableShapes.push(textBox2);
            clickableShapes.push(textBox3);
            clickableShapes.push(textBox4);
            
            draw();
        }
        
    });

}) ();
