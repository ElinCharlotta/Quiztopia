import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import './DeleteQuiz.scss';

interface DeleteQuizProps {
    quizId: string;
}

export default function DeleteQuiz({ quizId }: DeleteQuizProps) {
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleDeleteQuiz = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setError('Ingen autentiseringstoken hittades');
                return;
            }
            
            const response = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${quizId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Okänt fel');
                return;
            }
            
            console.log('Quiz borttaget');
            navigate('/quizzes'); // Navigera tillbaka till listan med quiz
        } catch (error: any) {
            setError(error.message || 'Något gick fel');
        }
    };

    return (
        <>
            <button className="delete-quiz-button" onClick={handleDeleteQuiz}>Ta bort quiz</button>
            {error && <p className="error-message">Du är inte skaparen av detta Quiz, därför kan du inte ta bort det</p>}
        </>
    );
}
