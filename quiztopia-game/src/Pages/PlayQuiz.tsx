import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LeafletMap from '../Components/Map/LeafletMap';
import { Quiz } from '../interfaces';
import DeleteQuiz from '../Components/DeleteQuiz/DeleteQuiz';

export default function PlayQuiz() {
  const { userId, quizId } = useParams<{ userId: string; quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Misslyckades att hämta quiz');
        }

        const data = await response.json();
        setQuiz(data.quiz);
      } catch (error) {
        console.error('Error, kunde inte ladda quiz:', error);
      }
    };

    fetchQuiz();
  }, [userId, quizId]);



  return (
    <>
    <article className= "play-quiz" >
    <h1>Quiz: { quiz?.quizId } </h1>
  { <DeleteQuiz quizId={ quiz?.quizId || '' }/> }
  <LeafletMap
        savedMarkers={
    quiz?.questions.map(marker => ({
      lat: parseFloat(marker.location.latitude),
      lng: parseFloat(marker.location.longitude),
      question: marker.question,
      answer: marker.answer,
    })) || []
  }
      
      />
    </article>
    </>
  );
};