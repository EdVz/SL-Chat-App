import React, { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import SidePanel from '../components/Chat/SidePanel';
import ChatBox from '../components/Chat/ChatBox';


export default function ChatPage() {

    const { user } = useContext(UserContext);

    return (
        <div className='flex h-screen'>
            {user && <SidePanel />}
            {user && <ChatBox />}
        </div>
    );
}
