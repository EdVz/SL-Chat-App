import React, { useContext, useEffect, useRef, useState } from 'react';
import SenderMessCont from "./SenderMessCont";
import RecipientMessCont from "./RecipientMessCont";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from '../../Context/UserContext';
import axios from 'axios';
import { getSender } from '../../config/ChatLogics';

import io from "socket.io-client";
import InappropriateMess from './InappropriateMess';

const ENDPOINT = "http://localhost:3000";
let socket, selectedChatCompare;

export default function ChatBox() {

    const [newMessageText, setNewMessageText] = useState();
    const [messages, setMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toxicityModel, setToxicityModel] = useState(null);

    const { user, selectedChat, setSelectedChat } = useContext(UserContext);

    const divUnderMessages = useRef();

    const TOXICITY_THRESHOLD = 0.9;

    //Load text classification model
    useEffect(() => {
        async function loadModel() {
            setLoading(true);
            const model = await toxicity.load(TOXICITY_THRESHOLD);
            // console.log('Model loaded');
            setToxicityModel(model);
            setLoading(false);
        };

        loadModel();
    }, [])

    //Scroll to last message
    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages, selectedChat]);

    //Load chat messages
    const fetchMessages = async (event) => {
        if (!selectedChat) return;

        try {
            // setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`);
            setMessages(data);

            // setLoading(false);

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            console.log('Failed to fetch messages');
        }
    };

    //Classify message as toxic or not and send message if not toxic
    async function sendMessage(ev) {

        if (ev) ev.preventDefault();
        if (newMessageText && toxicityModel) {

            let inappropriateMessage = false;

            try {
                const sentences = [newMessageText];

                const predictions = await toxicityModel.classify(sentences);

                predictions.forEach(category => {
                    if (category.results[0].match === true) {
                        inappropriateMessage = true;
                        setMessages([...messages, { inappropriate: true }]);
                        return;
                    }
                });

                if (!inappropriateMessage) {
                    const { data } = await axios.post('/api/message', {
                        content: newMessageText,
                        chatId: selectedChat,
                    });

                    socket.emit('new message', data);
                    setMessages([...messages, { ...data, inappropriate: false }]);
                }

                setNewMessageText('');
            } catch (error) {
                console.log('Failed to send message');
            }
        }
    };

    useEffect(() => {
        setSelectedChat(null);
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on('connected', () => setSocketConnected(true));
    }, []);

    //Fetch messages when chat is selected
    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            setMessages([...messages, newMessageReceived]);
        });
    });

    function typingHandler(ev) {
        setNewMessageText(ev.target.value);
    };


    return (
        <div className={(selectedChat ? 'flex' : 'hidden') + ' flex-col w-full bg-white md:flex md:w-2/3 p-2'}>
            <div className='flex-grow'>
                {!selectedChat && (
                    <div className='flex h-full items-center justify-center'>
                        <div className='text-gray-400'>No Chat Selected</div>
                    </div>
                )}
                {!!selectedChat && (
                    loading ? (
                        <div className='flex flex-col justify-center items-center gap-2 my-64'>
                            <ClipLoader />
                            <h3>Loading Chat</h3>
                        </div>
                    ) : (
                        <div className='h-full'>
                            <div className="w-full p-2 chat-title text-white flex justify-between items-center rounded-lg">
                                <div className='w-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex md:hidden w-full h-6" onClick={() => setSelectedChat('')}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                </div>
                                <h3>
                                    {getSender(user, selectedChat.users).username}
                                </h3>
                                <div></div>
                            </div>
                            <div className='relative h-full'>
                                <div className='absolute top-0 left-0 right-0 bottom-2 flex flex-col overflow-y-scroll py-2'>
                                    {messages && messages.map((message, idx) => {
                                        if (message.inappropriate) {
                                            return (
                                                <InappropriateMess key={idx} />
                                            )
                                        } else {
                                            if (message.sender._id === user.id) {
                                                return <SenderMessCont
                                                    key={message._id}
                                                    messageId={message._id}
                                                    content={message.content}
                                                />
                                            }
                                            else {
                                                return <RecipientMessCont
                                                    key={message._id}
                                                    messageId={message._id}
                                                    content={message.content}
                                                    userId={selectedChat.users.filter(member => member._id !== user.id)[0]._id}
                                                    username={selectedChat.users.filter(member => member._id !== user.id)[0].username}
                                                />
                                            }
                                        }
                                    })}
                                    <div ref={divUnderMessages}></div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
            {
                !!selectedChat && !loading && (
                    <form className='flex gap-2 mt-8' onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={newMessageText}
                            onChange={typingHandler}
                            placeholder='Type here...'
                            className='bg-white py-2 px-3 flex-grow border border-gray-400 rounded-full'
                        />
                        <button type='submit' className='bg-blue-800 p-2 text-white rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </form>
                )
            }
        </div >
    )
}
