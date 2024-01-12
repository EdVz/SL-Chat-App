import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export function UserContextProvider({ children }) {

    const [user, setUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const { data } = await axios.get('/profile');
                setUser(data);

                if (!data.id) {
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching user profile (No cookie with token): ", error);
                navigate('/');
            }
        };

        fetchData();


    }, [navigate]);

    return (
        <UserContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </UserContext.Provider>
    );
}
