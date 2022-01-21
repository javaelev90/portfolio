var currentExpression = "";

function makeExpression() {
    let mathType = $('.mathtype:checked').val();

    let number1 = Math.round(Math.random() * 1000);
    let number2 = Math.round(Math.random() * 100);
    currentExpression = (number1 + " " + mathType + " " + number2);
    document.getElementById("expression").value = currentExpression;
    document.getElementById("answer").value = "";
    resetResponse();
}

function sendAnswer() {
    let answer = document.getElementById("answer").value;
    if(eval(currentExpression) == answer){
        sendReponse(true);
    } else {
        sendReponse(false);
    }
}

function sendReponse(wasCorrect) {
    if(wasCorrect) {
        document.getElementById("response").innerHTML = "That answer is correct";
        document.getElementById("response").style = "color: black; background-color: green;";
    } else {
        document.getElementById("response").innerHTML = "That answer is wrong";
        document.getElementById("response").style = "color: black; background-color: red;";
    }
   
}

function resetResponse() {
    document.getElementById("response").innerHTML = "";
    document.getElementById("response").style = " background-color: transparent;";
}
