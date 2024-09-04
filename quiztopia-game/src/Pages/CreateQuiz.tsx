import React, { useState } from 'react';
import LeafletMap from '../Components/Map/LeafletMap';
import { useLocation, useNavigate } from 'react-router-dom';

interface Marker {
  name: string;
  question: string;
  answer: string;
  location: {
    longitude: string;
    latitude: string;
  };
}

export default function CreateQuiz() {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [markerLocation, setMarkerLocation] = useState<{ longitude: string; latitude: string } | null>(null);
  const [savedMarkers, setSavedMarkers] = useState<Marker[]>([]);
  const location = useLocation();
  const quizName = location.state?.quizName || '';
  const navigate = useNavigate();

  // Hantera klick på kartan och sätt markörer på plats
  const handleMapClick = (lat: number, lng: number) => {
    setMarkerLocation({
      longitude: lng.toString(),
      latitude: lat.toString(),
    });
  };

  // Hantera formulärets submit och skicka data till servern
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Kontrollera att alla inputfält är ifyllda + att man har valt plats på kartan innan formuläret skickas
    if (!markerLocation || !question || !answer) {
      console.error('Fyll i alla fält, tack!');
      return;
    }

    const newMarker = {
      name: quizName,
      question: question,
      answer: answer,
      location: {
        longitude: markerLocation.longitude,
        latitude: markerLocation.latitude,
      },
    };

    try {
      const token = sessionStorage.getItem('token'); // Hämta token från sessionStorage för autentisering
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',  // Om en token finns, lägg till den som en Bearer-token i Authorization-headern
        },
        body: JSON.stringify(newMarker),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Något gick fel med att lägga till fråga:', errorData);
        throw new Error('Misslyckades att lägga till fråga');
      }

      const quizData = await response.json();
      console.log('Quiz uppdaterad:', quizData);
      console.log('Quiz fråga adderad:', newMarker);

      // Lägg till den nya markören i listan över sparade markörer
      setSavedMarkers([...savedMarkers, newMarker]);

    } catch (error: any) {
      console.error('Error:', error.message || 'Något gick fel');
    }
  };

  const handleNavigateToQuizzes = () => {
    navigate('/quizzes');
  };

  return (
    <>
      <h1>{quizName}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Fråga:
          <input
            type='text'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </label>
        <label>
          Svar:
          <input
            type='text'
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </label>
        <button type='submit'>Spara din fråga</button>
        <button type='button' onClick={handleNavigateToQuizzes}>Visa Alla quiz</button>
      </form>
      <LeafletMap
        onMapClick={handleMapClick}
        savedMarkers={savedMarkers.map(marker => ({
          lat: parseFloat(marker.location.latitude),
          lng: parseFloat(marker.location.longitude),
          question: marker.question,
          answer: marker.answer,
        }))}
      />
    </>
  );
}
