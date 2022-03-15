<?php
    // Skapare: Anders Lumio
    require "LeaderBoardRepository.php"; 

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);

    header("Content-type: text/plain");

    $createLeaderboardTableSQL = 
        "CREATE TABLE IF NOT EXISTS LEADERBOARD
        (   
            DEVICEID VARCHAR(100) NOT NULL PRIMARY KEY,
            USERNAME VARCHAR(255) NOT NULL,
            SCORE DECIMAL(4,1),
            TIME INTEGER
        );";

    $dbm = new LeaderBoardRepository();
    $dbm->openConnection();
    $result = $dbm->executeSql($createLeaderboardTableSQL);
    echo $result["errormsg"];

    
    $dbm->closeConnection();
?>