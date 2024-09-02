import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './SignupForm.scss';

type User = {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

export default function SignupForm() {
    const navigate = useNavigate();

    // UseState hooks: Tomma strängar som uppdateras när användaren fyller i formuläret.
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        //stoppa omladdning av sida när formulär skickas in
        event.preventDefault();

        //samlar användarens information i ett objekt som ska skickas till servern.
        const userData: User = { username, password, firstname, lastname };

        try {
            const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup', {
                method: 'POST',
                // deklarerar att vi skickar data i JSON-format
                headers: {
                    'Content-Type': 'application/json'
                },
                //konverterar userData-objektet till JSON-sträng
                body: JSON.stringify(userData)

            });
            //om inte response är ok, skriv ut ett meddelande.
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const data = await response.json();
            console.log(data);

            // Om registrering lyckas navigeras användaren till /name-quiz-sidan.
            if (data.success) {
                navigate('/name-quiz');
            } else {
                alert('Det gick inte att skapa konto. Försök igen');
            }

        } catch (error) {
            console.error(error);
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <span>Användarnamn:</span>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                <span>Lösenord:</span>
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <label>
                <span>Förnamn:</span>
                <input
                    type='text'
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
            </label>
            <label>
                <span>Efternamn:</span>
                <input
                    type='text'
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
            </label>
            <button type='submit'>Skapa konto</button>
        </form>
    )
}
