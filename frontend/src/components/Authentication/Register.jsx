import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userExists, setUserExists] = useState(false);
    const [missingField, setMissingField] = useState(false);

    const { setUser, setId } = useContext(UserContext);
    const navigate = useNavigate();

    async function handleRegister(ev) {
        ev.preventDefault();

        setUserExists(false);
        if (!email || !username || !password) {
            setMissingField(true);
            return;
        }

        setMissingField(false);
        try {
            const { data } = await axios.post('/api/user/register', { email, username, password });
            setUser(data);
            navigate('/chat');

        } catch (error) {
            console.error(error);
            if (!error.response.data.success) {
                setUserExists(true);
            }
            setMissingField(false);
        }
    }

    return (
        <form onSubmit={handleRegister}>
            {missingField ? (
                <h4 className='text-red-400 mt-2'>Please Fill All The Fields</h4>
            ) : null}
            {userExists ? (
                <h4 className='text-red-400 mt-2'>Username already exists</h4>
            ) : null}
            <input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className='block w-full p-2 mb-3 mt-6 border rounded-sm'
                type="email"
                placeholder='Email'
            />
            <input
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className='block w-full p-2 mb-3 border rounded-sm'
                type="text"
                placeholder='Username'
            />
            <input
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className='block w-full p-2 mb-3 border rounded-sm'
                type="password"
                placeholder='Password'
            />
            <button className='home text-white w-full p-2 mb-6 mt-3 rounded-sm'>Register</button>
        </form>
    )
}
