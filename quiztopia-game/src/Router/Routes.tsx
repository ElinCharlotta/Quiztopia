import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import NameQuiz from '../Pages/NameQuiz'
import QuizList from '../Pages/QuizList'
import CreateQuiz from '../Pages/CreateQuiz'
import PlayQuiz from '../Pages/PlayQuiz'



const AppRouter = () => {
    return (

        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/name-quiz' element={<NameQuiz />} />
                <Route path='/create-quiz' element={<CreateQuiz />} />
                <Route path='/quizzes' element={<QuizList />} />
                <Route path="/play-quiz/:userId/:quizId" element={<PlayQuiz />} />
                </Routes>
        </Router>

    );
};

export default AppRouter;
