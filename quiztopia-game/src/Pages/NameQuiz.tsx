import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NameQuiz() {
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('token'); // Get token for authentication
      console.log('Token:', token);
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token to authenticate
        },
        body: JSON.stringify({ name: quizName }), // Send quizName to the server
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const data = await response.json();
      console.log(data);

      navigate('/create-quiz', { state: { quizName } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Something went wrong');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="create-quiz">
      <h1>Skapa Quiz</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Vad ska ditt quiz heta?
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Nästa</button>
        <button type="button" onClick={() => navigate('/quizzes')}>Visa ALLA quiz</button>
      </form>
      {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
    </div>
  );
};
