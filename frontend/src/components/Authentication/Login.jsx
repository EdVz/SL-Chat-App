import React, { useContext, useState } from 'react'
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invalidUserOrPassword, setInvalidUserOrPassword] = useState(false)
    const [missingField, setMissingField] = useState(false);

    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    async function handleLogin(ev) {
        ev.preventDefault();

        setInvalidUserOrPassword(false);
        if (!username || !password) {
            setMissingField(true);
            return;
        }

        setMissingField(false);
        try {
            const { data } = await axios.post('/api/user/login', { username, password })
            navigate('/chat');

        } catch (error) {
            console.error(error);
            setInvalidUserOrPassword(true);
            setMissingField(false);
        }
    }

    return (
        <form onSubmit={handleLogin}>
            {missingField ? (
                <h4 className='text-red-400 mt-2'>Please Fill All The Fields</h4>
            ) : null}
            {invalidUserOrPassword ? (
                <h4 className='text-red-400 mt-2'>Invalid Username Or Password</h4>
            ) : null}
            <input
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className='block w-full p-2 mb-3 mt-6 border rounded-sm'
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
            <button className='home text-white w-full p-2 mb-6 mt-3 rounded-sm'>Login</button>
        </form>
    )
}
