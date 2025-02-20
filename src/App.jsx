import React, { useState } from "react";
import Quiz from "./QuizApp";
import History from "./History";
import './App.css'

const Home = ({ setView, setUserName }) => {
  const [name, setName] = useState("");

  const startQuiz = () => {
    if (name.trim()) {
      setUserName(name);
      setView("quiz");
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Quiz</h1>
      <p>Instructions:</p>
      <ul>
        <li>You have 30 seconds to complete the quiz.</li>
        <li>Answer all questions carefully.</li>
        <li>Your attempt history will be saved.</li>
        <li>You can retake the quiz after completing it.</li>
      </ul>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={startQuiz}>Start Quiz</button>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState("home");
  const [userName, setUserName] = useState("");

  return (
    <div>
      {view === "home" && <Home setView={setView} setUserName={setUserName} />}
      {view === "quiz" && <Quiz setView={setView} userName={userName} />}
      {view === "history" && <History setView={setView} />}
    </div>
  );
};

export default App;