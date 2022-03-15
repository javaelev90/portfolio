<?php
    // Skapare: Anders Lumio
    class QuizRepository {

        public function getQuizQuestionById($questionId) {
            return $this->getQuestion($this->getJsonFile(), $questionId);
        }

        public function getAllQuizQuestions() {
            return $this->getJsonFile();
        }

        private function getQuestion($jsonArray, $questionId) {
            if(is_array($jsonArray) && ($questionId >= 0) && ($questionId < count($jsonArray))) {
                return $jsonArray[$questionId];
            }
        }

        private function getJsonFile(){
            return json_decode(file_get_contents("quiz-questions.json"), true);
        }

    }

?>