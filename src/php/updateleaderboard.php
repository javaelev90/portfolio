<?php

    require_once "LeaderBoardRepository.php";
    header('Content-Type: application/json');

    $deviceid = $_GET["deviceid"];
    $username = $_GET["username"];
    $score = $_GET["score"];
    $time = $_GET["time"];

    $repository = new LeaderBoardRepository();
    $result = $repository->insertLeaderboardEntry($deviceid, $username, $score, $time);
    // echo json_encode($result["data"]);
?>