<?php
    // Skapare: Anders Lumio
    require_once "classes/QuizRepository.php"; 

    header('Content-Type: application/json');

    $serviceResponse = [
        "questions" => false,
        "error" => NULL
    ];

    $quizRepo = new QuizRepository();
    $questions = $quizRepo->getAllQuizQuestions();
    
    // Don't send solutions to client, make them use the check solution service
    foreach($questions as &$question){
        unset($question["solution"]);
    }
    $serviceResponse["questions"] = $questions;
    echo json_encode($serviceResponse);

?>