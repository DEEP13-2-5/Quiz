import React, { useState, useEffect } from "react";
import { openDB } from "idb";

const QUESTIONS = [
  { id: 1, type: "mcq", question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], answer: "Mercury" },
  { id: 2, type: "mcq", question: "Which data structure organizes items in a FIFO manner?", options: ["Stack", "Queue", "Tree", "Graph"], answer: "Queue" },
  { id: 3, type: "mcq", question: "Which of the following is primarily used for structuring web pages?", options: ["Python", "Java", "HTML", "C++"], answer: "HTML" },
  { id: 4, type: "mcq", question: "Which chemical symbol stands for Gold?", options: ["Au", "Gd", "Ag", "Pt"], answer: "Au" },
  { id: 5, type: "mcq", question: "Which of these processes is not typically involved in refining petroleum?", options: ["Fractional distillation", "Cracking", "Polymerization", "Filtration"], answer: "Filtration" },
  { id: 6, type: "integer", question: "What is the value of 12 + 28?", answer: "40" },
  { id: 7, type: "integer", question: "How many states are there in the United States?", answer: "50" },
  { id: 8, type: "integer", question: "In which year was the Declaration of Independence signed?", answer: "1776" },
  { id: 9, type: "integer", question: "What is the value of pi rounded to the nearest integer?", answer: "3" },
  { id: 10, type: "integer", question: "If a car travels at 60 mph for 2 hours, how many miles does it travel?", answer: "120" }
];

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const db = await openDB("QuizDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("history")) {
            db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
          }
        },
      });
      const allAttempts = await db.getAll("history");
      setHistory(allAttempts);
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !finished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setFinished(true);
      saveResult();
    }
  }, [timeLeft, finished]);

  const handleAnswer = async (option) => {
    setSelectedAnswer(option);
    if (option === QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
    }
    nextQuestion();
  };

  const handleIntegerAnswer = () => {
    if (userInput === QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
    }
    setUserInput("");
    nextQuestion();
  };

  const nextQuestion = () => {
    setTimeout(() => {
      if (currentQuestion + 1 < QUESTIONS.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setFinished(true);
        saveResult();
      }
    }, 1000);
  };

  const saveResult = async () => {
    const db = await openDB("QuizDB", 1);
    await db.add("history", { timestamp: new Date().toISOString(), score });
    setHistory([...history, { timestamp: new Date().toISOString(), score }]);
  };

  return (
    <div className="quiz-container">
      <style jsx>{`
        .quiz-container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }
        button, input {
          display: block;
          width: 100%;
          margin: 5px 0;
          padding: 10px;
          font-size: 16px;
        }
        .timer {
          font-size: 20px;
          font-weight: bold;
          color: red;
        }
        @media (max-width: 600px) {
          .quiz-container {
            width: 90%;
          }
          button, input {
            font-size: 14px;
          }
        }
      `}</style>
      {!finished ? (
        <div>
          <h2>{QUESTIONS[currentQuestion].question}</h2>
          <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
          {QUESTIONS[currentQuestion].type === "mcq" ? (
            QUESTIONS[currentQuestion].options.map((option) => (
              <button key={option} onClick={() => handleAnswer(option)}>{option}</button>
            ))
          ) : (
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleIntegerAnswer()}
              placeholder="Enter your answer"
            />
          )}
        </div>
      ) : (
        <div>
          <h2>Quiz Finished! Your Score: {score}/{QUESTIONS.length}</h2>
          <h3>Previous Attempts:</h3>
          <ul>
            {history.map((attempt, index) => (
              <li key={index}>Attempt on {new Date(attempt.timestamp).toLocaleString()}: Score {attempt.score}</li>
            ))}
          </ul>
          <button onClick={() => { setFinished(false); setCurrentQuestion(0); setScore(0); setTimeLeft(1800); }}>Retry</button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
