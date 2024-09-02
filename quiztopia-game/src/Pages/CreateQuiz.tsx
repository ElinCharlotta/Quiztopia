import React, { useState } from 'react';
import LeafletMap from '../Components/Map/LeafletMap';
import { useLocation } from 'react-router-dom';

interface Question {
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
  const [savedMarkers, setSavedMarkers] = useState<Question[]>([]);
  const location = useLocation();
  const quizName = location.state?.quizName || '';

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerLocation({
      longitude: lng.toString(),
      latitude: lat.toString(),
    });

    console.log(`Map clicked at ${lat}, ${lng}`);
  };


  //newMarker = objekt som representerar en ny markör 
  //objektet innehåller all information som krävs enligt interface Question.
  const handleSaveMarker = (newMarker: Question) => {
    // Uppdatera listan av sparade markörer med en ny markör
    setSavedMarkers((currentMarkersList) => {
      // Skapa en ny lista som innehåller alla befintliga markörer och den nya markören
      const updatedMarkersList = [...currentMarkersList, newMarker];


      console.log('Uppdaterade sparade markörer:', updatedMarkersList);

      // Returnera den uppdaterade listan för att uppdatera state
      return updatedMarkersList;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    //kontroll om markerLocation finns. Om ej definerad avslutas funktionen. Innebär att en markerad plats måste finnas innan användaren kan spara en fråga
    if (!markerLocation) return;

    // skapa ett nytt objekt som representerar en fråga/markör. 
    const newMarker: Question = {
      name: quizName,
      question: question,
      answer: answer,
      location: {
        longitude: markerLocation.longitude,
        latitude: markerLocation.latitude,
      },
    };

    //Anropar funktionen handleSaveMarker med det nya marker-objektet. Lägger till den nya markören i listan av sparade markörer.

    handleSaveMarker(newMarker);

    console.log('Quiz question:', newMarker);

  };

  return (
    <>
      <h1>{quizName}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Fråga:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </label>
        <label>
          Svar:
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </label>
        <button type="submit">Spara din fråga</button>
      </form>
      <LeafletMap

        //skickar prop handldeMapClick till komponenten LeafletMap. Körs när användaren klickar på kartan.
        onMapClick={handleMapClick}
        //Skickar en lista med markörer till LeafLetMap.
        savedMarkers={savedMarkers.map(marker => ({

          //parseFloat omvandlar från string till nummer så att leaflet kan läsa av koordinaterna.
          lat: parseFloat(marker.location.latitude),
          lng: parseFloat(marker.location.longitude),
          //Skickar information om frågan och svaret som är kopplade till markören. Används vid popup
          question: marker.question,
          answer: marker.answer
        }))}

      />

    </>
  );
}
