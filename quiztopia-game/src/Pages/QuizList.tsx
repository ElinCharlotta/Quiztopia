import { useEffect, useState } from 'react';
import QuizCard from '../Components/QuizCard/QuizCard';
import './QuizList.scss'
import { Quiz } from '../interfaces';


export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {

    const fetchQuizList = async () => {
      try {
        const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });


        if (!response.ok) {
          throw new Error('Något gick fel vid hämtning av quiz');
        }


        const data = await response.json();
        console.log('API-svar:', data);

        // Uppdatera state med den nya quiz-listan från API-svaret så att QuizList renderas med uppdaterad data
        if (data.quizzes) {
          setQuizzes(data.quizzes);
        }

      } catch (error) {
        console.error('Fel vid hämtning av data:', error);
      }
    };

    fetchQuizList();
  }, []);

  return (
    <>
      <h1>Alla Quiz</h1>

      {/* Kontrollerar om det finns några quiz i listan. */}
      {quizzes.length > 0 ? (
        <div className="quiz-list">
          {quizzes.map((quiz, index) => (
            <QuizCard key={`${quiz.quizId}-${index}`} quiz={quiz} />
          ))}
        </div>
      ) : (
        <p>Inga quiz tillgängliga.</p>
      )}
    </>
  );
};


