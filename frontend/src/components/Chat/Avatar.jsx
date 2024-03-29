import React from 'react'

export default function Avatar({ userId, username }) {
    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200', 'bg-blue-200',
        'bg-yellow-200', 'gb-teal-200'];
    const userIdbase10 = parseInt(userId, 16);
    const colorIndex = userIdbase10 % colors.length;
    const color = colors[colorIndex];

    return (
        <div className={'w-8 h-8 relative rounded-full flex items-center ' + color}>
            <div className='text-center w-full opacity-70'>{username?.[0]}</div>
        </div>
    )
}