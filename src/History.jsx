import React, { useState, useEffect } from "react";
import { openDB } from "idb";

const History = ({ setView }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const db = await openDB("QuizDB", 1);
      const allAttempts = await db.getAll("history");
      setHistory(allAttempts);
    };
    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <h2>Attempt History</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((attempt, index) => (
            <li key={index}>
              Attempt on {new Date(attempt.timestamp).toLocaleString()}: Score {attempt.score}
            </li>
          ))}
        </ul>
      ) : (
        <p>No attempts recorded yet.</p>
      )}
      <button onClick={() => setView("home")}>Go to Home</button>
      <button onClick={() => setView("quiz")}>Retake Quiz</button>
    </div>
  );
};

export default History;
