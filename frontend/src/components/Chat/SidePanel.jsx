import React, { useContext, useEffect, useState } from 'react';
import { ClipLoader } from "react-spinners";
import Contact from './Contact';
import Logo from './Logo';
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getSender } from '../../config/ChatLogics';


export default function SidePanel() {

    const [toggleSettings, setToggleSettings] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setUserSearch('');
        setSearchResult([]);
    }, [selectedChat]);

    async function fetchChats() {
        try {
            const { data } = await axios.get('/api/chat');
            setChats(data);
        } catch (error) {
            console.log('Failed to Load the Chats: ', error);
        }
    };

    async function accessChat(userId) {
        const { data } = await axios.post('/api/chat', { userId });
        // console.log(data);

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

        setSelectedChat(data);
    };


    async function handleUserSearch(query) {
        setUserSearch(query);

        if (!query) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`/api/user?search=${userSearch}`);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            console.log('User search Failed: ', error);
        }
    }


    function logout() {
        axios.post('/api/user/logout').then(() => {
            setUser(null);
        });
        navigate('/');
    }

    useEffect(() => {
        setChats(null);
        fetchChats();
    }, [])

    return (
        <div className={(selectedChat ? 'hidden' : 'flex') + ' panel w-full pl-4 md:w-1/3 md:flex flex-col'}>
            <div className='flex justify-between items-center py-4 border-b-2 mb-2 sticky'>
                <Logo />
                <div className='mr-4 flex'>
                    <span className='mr-4 text-sm text-white flex items-center'>
                        {user.username}
                    </span>
                    <div className='relative'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white cursor-pointer" onClick={() => setToggleSettings(!toggleSettings)}>
                            <path fillRule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                        </svg>
                        {toggleSettings && (
                            <div className='absolute text-sm right-3 bg-white py-2 px-3 border border-gray-400 rounded-b-md rounded-tl-md cursor-default'>
                                <button
                                    className='text-gray-500 flex items-center gap-1'
                                    onClick={logout}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
                                    </svg>

                                    <p>Logout</p>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            <div className='chats overflow-y-scroll mt-2'>
                <div className='mb-3'>
                    <div className='flex items-center justify-center lg:justify-start gap-2'>
                        <input
                            type="text"
                            placeholder='Search for a Username'
                            value={userSearch}
                            onChange={ev => handleUserSearch(ev.target.value)}
                            className='w-2/3 text-sm py-1 px-3 border rounded-full'
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white cursor-pointer" onClick={handleUserSearch}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                </div>
                {userSearch && loading ? (
                    <div className='text-center mt-3'>
                        <ClipLoader
                            color='#fff'
                        />
                    </div>
                )
                    : (
                        userSearch ? (

                            <div>
                                {searchResult.map((user) => (
                                    <Contact
                                        key={user._id}
                                        id={user._id}
                                        online={false}
                                        username={user.username}
                                        onClick={() => accessChat(user._id)}
                                        selected={user._id === selectedChat}
                                    />
                                ))}

                                <div className='w-1/2 border border-gray-400 mx-auto'></div>
                            </div>
                        ) : null
                    )}
                {chats?.length > 0 && !userSearch ? (
                    chats.map((chat) => (
                        <Contact
                            key={chat._id}
                            id={chat._id}
                            online={false}
                            username={getSender(user, chat.users).username}
                            onClick={() => setSelectedChat(chat)} //userId
                            selected={selectedChat === chat}
                        />
                    ))
                ) : (
                    chats?.length > 0 ? (
                        null
                    ) : (
                        <div className='text-white text-center mt-8'>
                            <p>No Chats Available</p>
                            <p className='text-sm text-gray-300 mt-3'>Search A Username To Start Chatting With Someone!</p>
                        </div>
                    )
                )}

            </div>
        </div>
    )
}
