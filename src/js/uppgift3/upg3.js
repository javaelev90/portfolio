class Box {
    
    constructor(x, y, width, height, tag) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tag = tag;
        this.enable = true;

        if(this.constructor == Box){
            throw new Error("Object of Abstract Class cannot be created");
        }
    }
    
    draw() {
        throw new Error("Abstract class method");
    }

    setEnable(enable) {
        this.enable = enable;
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
        context.font = this.fontsize + "pt Calibri,Arial";
        context.fillStyle = this.textcolor;
        context.textBaseline = "middle"; 
        context.fillText(this.text, this.x + 10, this.y + (this.height / 2));
    }

    setText(text) {
        this.text = text;
    }
}

class MultiLineTextBox extends TextBox {

    constructor(x, y, width, height, tag, color, text, textcolor, fontsize) {
        super(x, y, width, height, tag, color, text, textcolor, fontsize);
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.font = this.fontsize + "pt Calibri,Arial";
        context.fillStyle = this.textcolor;
        context.textBaseline = this.text.length > 1 ? "bottom" : "middle";
        let rowSpacing = 0;
        for (var line = 0; line < this.text.length; line++) {
            context.fillText(this.text[line], this.x + 10, this.y + (this.height / 2) + rowSpacing);
            rowSpacing += (parseInt(this.fontsize) + 5);
        }
    }
}

class ImageBox extends Box {

    constructor(x, y, width, height, tag, image) {
        super(x, y, width, height, tag);
        this.image = image;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class Service {

    getRequest(requestUrl) {
        return fetch(requestUrl)
            .then(res => {
                return res.json();
            });
    }
}

class QuizService extends Service{

    constructor(serviceUrl){
        super();
        this.getQuizUrl         = "https://people.dsv.su.se/~anlu5675/sl22/portfolio/src/php/getquizquestion-service.php";
        this.checkQuizAnswerUrl = "https://people.dsv.su.se/~anlu5675/sl22/portfolio/src/php/checkquizsolution-service.php";
    }

    getQuizQuestions() {
        return this.getRequest(this.getQuizUrl);
    }

    evaluateQuizAnswer(id, answer) {
        let getParameters = "?id=" + id + "&solution=" + answer;
        let url = this.checkQuizAnswerUrl + getParameters;
        return this.getRequest(url);
    }
}

// Quiz main functions
(function() {

    const Tag = Object.freeze(
        {
            "Default": -1,
            "Background" : 1,
            "Option" : 2,
            "Reset" : 3,
            "Question" : 4,
            "NextQuestion" : 5
        }
    );
    const canvasWidth = 450;
    const canvasHeight = 380;
    const quizService = new QuizService();
    
    var nonStaticShapes = new Array();
    var staticShapes = new Array();
    var canvas;
    var context;
    var quizQuestions;
    var currentQuestionId = 0;
    var isPlaying = false;
    var correctAnswerCount = 0;

    function setCanvasExtent(canvasParam) {
        canvasParam.height = canvasHeight;
        canvasParam.width = canvasWidth;
    }
    
    // Main game loop
    function run(time) {
        staticShapes.forEach((shape) => {
            if(shape.enable){
                shape.draw(context);
            }
        });
        nonStaticShapes.forEach((shape) => {
            if(shape.enable){
                shape.draw(context);
            }
        });

        window.requestAnimationFrame(run);               
    }
    
    // Game click handler
    function clickHandler(ev) {
        let mouseY = ev.y - canvas.offsetTop;
        let mouseX = ev.x - canvas.offsetLeft;
        if(ev.y == undefined){
            mouseY = ev.pageY - canvas.offsetTop;
        }
        if (ev.x == undefined){
            mouseX = ev.pageX - canvas.offsetLeft;
        } 
        nonStaticShapes.forEach(async(shape) => {
            if(shape.enable){
                if(shape.positionInBounds(mouseX, mouseY)) {
                    // Evaluate selected option
                    if(shape.tag == Tag.Option && isPlaying){
                        let result = await evaluate(shape);
                        if(result) {
                            correctAnswerCount++;
                        }
                        updateNextQuestionBtn(true);
                        isPlaying = false;
                    }
                    // If clicked next question button
                    else if(shape.tag == Tag.NextQuestion){
                        nextQuestion();
                    }
                    // If clicked reset quiz button
                    else if(shape.tag == Tag.Reset){
                        reset();
                    }
                }
            }
        });
    }

    function nextQuestion(){
        isPlaying = true;
        currentQuestionId++;
        // Changes to the next question until all questions have been answered
        if(currentQuestionId < quizQuestions.length){
            updateTextBoxes(currentQuestionId);
        } else {
            createScoreBoard();
        }
    }

    function reset(){
        isPlaying = true;
        currentQuestionId = 0;
        correctAnswerCount = 0;
        createQuizBoard();    
    }

    function updateTextBoxes(questionId){
        setQuestion(questionId);
        setAnswers(questionId);
        updateNextQuestionBtn(false);
    }

    function setQuestion(questionId) {
        for(var i = 0; i < nonStaticShapes.length; i++){
            let shape = nonStaticShapes[i];
            if(shape.tag == Tag.Question) {
                shape.text = quizQuestions[questionId]["question"];
                break;
            }
        }
    }

    function setAnswers(questionId) {
        let counter = 0;
        for(var i = 0; i < nonStaticShapes.length; i++){
            let shape = nonStaticShapes[i];
            if(shape.tag == Tag.Option) {
                shape.text = quizQuestions[questionId]["answers"][counter];
                shape.color = "#8B6CFA";
                counter++;
            }
        }
    }

    function updateNextQuestionBtn(enable) {
        for(var i = 0; i < nonStaticShapes.length; i++){
            let shape = nonStaticShapes[i];
            if(shape.tag == Tag.NextQuestion) {
                shape.enable = enable;
            }
        }
    }

    async function evaluate(shape) {
        if(shape instanceof TextBox) {
            return await quizService.evaluateQuizAnswer(currentQuestionId, shape.text)
                .then((res) => {
                    if(res["correctSolution"]){
                        shape.color = "#59F07E";
                        return true;
                    } else {
                        shape.color = "red";
                        return false;
                    }
                });
        }
    }

    function createScoreBoard() {

        nonStaticShapes = new Array();

        var resetButton = new Image(40, 40);
        resetButton.src = "resources/images/reset.png";

        let scoreText = "You have finished the Quiz!";
        let answers = [("Number of correct answers: " + correctAnswerCount), ("Number of wrong answers: " + (quizQuestions.length - correctAnswerCount)) ];
        
        let offset = 50;
        let headingText = new TextBox(offset, 40, canvasWidth-offset*2, 80, Tag.Question, "#8B6CFA", scoreText, "#F6EFF8", "16");
        let answersBox = new MultiLineTextBox(offset, 160, canvasWidth-offset*2, 80, Tag.Question, "#8B6CFA", answers, "#F6EFF8", "14");
        let resetButtonBox = new ImageBox(5, 5, 40, 40, Tag.Reset, resetButton);

        nonStaticShapes.push(headingText);
        nonStaticShapes.push(answersBox);
        nonStaticShapes.push(resetButtonBox);
    }

    function createQuizBoard() {

        nonStaticShapes = new Array();

        var nextButton = new Image(60, 60);
        nextButton.src = "resources/images/next.png";
        var resetButton = new Image(40, 40);
        resetButton.src = "resources/images/reset.png";

        let offset = 50;
        let questionBox = new MultiLineTextBox(offset, 40, canvasWidth-offset*2, 80, Tag.Question, "#8B6CFA", quizQuestions[currentQuestionId]["question"], "#F6EFF8", "13");
        let answerBox1 = new TextBox(offset, 140, canvasWidth-offset*2, 50, Tag.Option, "#8B6CFA", quizQuestions[currentQuestionId]["answers"][0], "black", "12");
        let answerBox2 = new TextBox(offset, 200, canvasWidth-offset*2, 50, Tag.Option, "#8B6CFA", quizQuestions[currentQuestionId]["answers"][1], "black", "12");
        let answerBox3 = new TextBox(offset, 260, canvasWidth-offset*2, 50, Tag.Option, "#8B6CFA", quizQuestions[currentQuestionId]["answers"][2], "black", "12");
        let nextButtonBox = new ImageBox(canvasWidth-offset*2, 320, offset, offset, Tag.NextQuestion, nextButton);
        let resetButtonBox = new ImageBox(5, 5, 40, 40, Tag.Reset, resetButton);
        nextButtonBox.enable = false;

        nonStaticShapes.push(questionBox);
        nonStaticShapes.push(answerBox1);
        nonStaticShapes.push(answerBox2);
        nonStaticShapes.push(answerBox3);
        nonStaticShapes.push(nextButtonBox);
        nonStaticShapes.push(resetButtonBox);
    }
    
    window.addEventListener('load', (event) => {
        canvas = document.getElementById('gamecanvas');
        context = canvas.getContext('2d');
        setCanvasExtent(canvas);
        canvas.addEventListener('click', clickHandler, false); 
        
        var background = new Image(canvasWidth, canvasHeight);
        background.src = "resources/images/background.png";

        // Wait for image to be created/loaded before loading other content in canvas,
        // otherwise the image may not be drawn in the background but instead on top of some other shape
        background.onload = async() => {
            
            staticShapes.push(new ImageBox(0, 0, canvasWidth, 380, Tag.Background, background));
            await quizService.getQuizQuestions().then(res => {
                quizQuestions = res["questions"];
            });    
            createQuizBoard();
            isPlaying = true;
            run();

        }
    });
}) ();
