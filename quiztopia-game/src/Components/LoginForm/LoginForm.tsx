import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
    username: string;
    password: string;
}

export default function LoginForm() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const userData: User = { username, password };
        console.log('här är vi');

        try {
            console.log(userData);
            const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            console.log(response);
            if (!response.ok) {
                throw new Error('Något gick snett med POST-förfrågan')
            }
            const data = await response.json();
            console.log(data);

            // om data.success är true och en token retunerades, sparas token i sessionStorage 
            //användaren navigeras till /name-quiz
            if (data.success && data.token) {

                sessionStorage.setItem('token', data.token);

                navigate('/name-quiz');

            } else {
                alert('Felaktiga inloggningsuppgifter eller användaren finns inte.');
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (

        <form onSubmit={handleSubmit}>
            <label>
                Användarnamn:
                <input
                    type='text'
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }}
                ></input>
            </label>
            <label>
                Lösenord:
                <input
                    type='password'
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                ></input>
            </label>
            <button type='submit'>Logga in</button>

        </form>

    )
};
