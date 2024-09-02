import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const NameQuiz = () => {
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          //Kontrollerar att vi har en giltig token i sessionStorage. 
          //Om token är giltig skickas den med i begäran till serven för att bevisa att vi får göra det vi försöker göra.
          'Authorization': token ? `Bearer ${token}` : '',

        },
        body: JSON.stringify({ name: quizName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const data = await response.json();
      console.log(data);

      navigate('/create-quiz', { state: { quizName } });
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
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
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default NameQuiz;