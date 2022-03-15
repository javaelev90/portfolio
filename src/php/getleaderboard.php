<?php
    // Skapare: Anders Lumio
    require_once "LeaderBoardRepository.php";
    header('Content-Type: application/json');

    $repository = new LeaderBoardRepository();
    $result = $repository->getLeaderboardInterval(0, 20);
    echo json_encode(Array("LEADERBOARD" => $result["data"]));
?>