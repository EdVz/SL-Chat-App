import React from 'react'
import Avatar from './Avatar'

export default function Contact({ id, online, username, onClick, selected }) {
    return (
        <div
            key={id}
            className={'py-1 pl-2 my-2 rounded-l-full flex justify-between items-center gap-2 cursor-pointer ' + (selected ? 'bg-white' : '')}
            onClick={() => onClick(id)}
        >
            <div className='flex gap-2 py-2 pl-4 items-center' >
                <Avatar online={online} username={username} userId={id} />
                <span className={(selected ? 'text-gray-800' : 'text-white') + ' text-md'}>{username}</span>
            </div>
            {selected && (
                <div className='w-6 contact-select h-12 rounded-r-md'></div>
            )}
        </div>
    )
}
