<?php

    class LeaderBoardRepository {

        private $hostName = "atlas.dsv.su.se:3306";
        private $userName = "usr_21329520";
        private $password = "329520";
        private $databaseName = "db_21329520";
        
        private $db;

        public function __construct() {
        }

        public function openConnection() {
            // Open database connection
            $this->db = new mysqli( $this->hostName,
                                    $this->userName,
                                    $this->password,
                                    $this->databaseName);
            // Exit if there was a connection problem
            if($this->db->connect_error){
                return array(
                    "resultcode" => -1,
                    "errormsg" => $this->db->connect_error,
                    "data" => ""
                );
            }
            return array(
                "resultcode" => 0,
                "errormsg" => "",
                "data" => ""
            );
        }

        public function closeConnection(){
            $this->db->close();
            return array(
                "resultcode" => 0,
                "errormsg" => "",
                "data" => ""
            );
        }

        public function select($sql, $values, $valueTypes) {
            // Make a prepared statment to prevent sql injection
            $preparedStatement = $this->db->prepare($sql);
            
            // Bind params to the prepared statement
            $preparedStatement->bind_param($valueTypes, ...$values);  
            $preparedStatement->execute();

            $result = $preparedStatement->get_result(); 
            // Fetch all data
            $data = $result->fetch_all(MYSQLI_ASSOC);
            // Close the statement if the previous operations went well
            $preparedStatement->close();
            
            return array(
                "resultcode" => $this->db->error == "" ? 0 : -1,
                "errormsg" => $this->db->error,
                "data" => $data
            );
        }

        // Executes update/delete sql
        public function update($sql, $values, $valueTypes){
            $preparedStatement = $this->db->prepare($sql);
            $preparedStatement->bind_param($valueTypes, ...$values);
            $preparedStatement->execute();
            $preparedStatement->close();
            return array(
                "resultcode" => $this->db->error == "" ? 0 : -1,
                "errormsg" => $this->db->error
            );
        }

        // Simple select query executer
        public function executeSql($sql){
            $result = $this->db->query($sql);
            return array(
                "resultcode" => $this->db->error == "" ? 0 : -1,
                "errormsg" => $this->db->error,
                "data" => $result
            );
        }

        public function getLeaderboardInterval($min, $max){
            $this->openConnection();
            $sql = "SELECT * 
                FROM LEADERBOARD 
                ORDER BY SCORE DESC, TIME ASC LIMIT ?, ?";
            $result = $this->select($sql, array($min, $max), "ii");
            $this->closeConnection();
            return $result;
        }

        public function insertLeaderboardEntry($deviceid, $username, $score, $time){

            $this->openConnection();
            $sql = "INSERT INTO LEADERBOARD (DEVICEID, USERNAME,SCORE,TIME) 
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE USERNAME = ?, SCORE = (
                    SELECT 
                        case when l.SCORE <= ? then
                            ?
                        else
                            l.SCORE
                        end
                    FROM LEADERBOARD l
                    WHERE l.DEVICEID = ?
                ), TIME = (
                    SELECT 
                        case when l.SCORE < ? then
                            ?
                        when l.SCORE = ? then 
                            case when l.TIME >= ? then 
                                ?
                            else 
                                l.TIME
                            end
                        else
                            l.TIME
                        end
                    FROM LEADERBOARD l
                    WHERE l.DEVICEID = ?
                );";
            $result = $this->insert($sql, array($deviceid, $username, $score,$time,$username,$score,$score,$deviceid,$score,$time,$score,$time,$time,$deviceid), "ssdisddsdidiis");
            $this->closeConnection();
            return $result;
        }

        public function insert($sql, $values, $valueTypes){
            $preparedStatement = $this->db->prepare($sql);
            $preparedStatement->bind_param($valueTypes, ...$values);
            $preparedStatement->execute();
            $lastId = $this->db->insert_id;
            $preparedStatement->close();
            return array(
                "resultcode" => $this->db->error == "" ? 0 : -1,
                "errormsg" => $this->db->error,
                "lastid" => $lastId
            );
        }
    }

?>