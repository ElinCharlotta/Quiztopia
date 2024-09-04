import './QuizCard.scss';
import { useNavigate } from 'react-router-dom';
import {Quiz} from '../../interfaces'


interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const navigate = useNavigate();

  const handlePlayQuiz = () => {
    navigate(`/play-quiz/${quiz.userId}/${quiz.quizId}`);}
  
  return (
    <section className='quiz-card'>
      <h3 className='quiz-card__header'>Quiz: {quiz.quizId}</h3>
      <p className='quiz-card__paragraph'>Skapad av: {quiz.username}</p>
      <button onClick={handlePlayQuiz}>Spela Quiz</button>
      </section>   
  )
}
export default QuizCard;
