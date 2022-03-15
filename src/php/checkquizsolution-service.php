<?php
    // Skapare: Anders Lumio
    require_once "classes/QuizRepository.php"; 

    header('Content-Type: application/json');

    function getSet($inputName) {
        return isset($_GET[$inputName]) ? $_GET[$inputName] : "";
    }

    $serviceResponse = [
        "correctSolution" => false,
        "error" => NULL
    ];
    // echo json_encode($_GET);

    if(is_numeric(getSet("id")) && getSet("solution") != "") {
        $questionId = $_GET["id"];
        $questionSolution = $_GET["solution"];

        $quizRepo = new QuizRepository();
        $question = $quizRepo->getQuizQuestionById($questionId);

        if($question != NULL && $question["solution"] == $questionSolution){
            $serviceResponse["correctSolution"] = true;
        }
    } else {
        $serviceResponse["error"] = "GET parameters were incorrect.";
    }
    
    echo json_encode($serviceResponse);
    
?>