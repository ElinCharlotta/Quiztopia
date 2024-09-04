import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupForm.scss';

// Typdefinition för användardata
type User = {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

export default function SignupForm() {
    const navigate = useNavigate(); // Hook för navigering

    // useState hooks: Håller koll på användarens inmatning i formuläret
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');

    // Hanterar formulärets submit
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Stoppar att ladda om sidan 

        // Samlar in användarens data i ett objekt för att skicka det till servern.
        const userData: User = { username, password, firstname, lastname };

        try {
            // Registrerar användaren
            const signUpFormResponse = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData) // Omvandlar userData till JSON-sträng
            });

            // Om registreringen misslyckas, visa felmeddelande
            if (!signUpFormResponse.ok) {
                const errorResponse = await signUpFormResponse.json();
                throw new Error(`Registreringen misslyckades: ${errorResponse.message || 'okänt fel'}`);
            }

            // Hämtar data om registreringen lyckades
            const signUpData = await signUpFormResponse.json();
            console.log(signUpData);

            // Om registreringen lyckas, logga in användaren
            if (signUpData.success) {
                const loginResponse = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password }) // Omvandlar inloggningsdata till JSON-sträng
                });

                if (!loginResponse.ok) {
                    throw new Error('Misslyckades att logga in. Försök igen');
                }

                // Hämtar inloggningsdata och sparar token i sessionStorage. Behövs för att rätt användare ska bli inloggad
                const loginData = await loginResponse.json();
                sessionStorage.setItem('token', loginData.token);
                console.log(loginData);
                console.log('token', loginData.token);
                
                


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