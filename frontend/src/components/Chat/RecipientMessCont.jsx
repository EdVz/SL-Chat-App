import React from 'react'
import Avatar from './Avatar'

export default function RecipientMessCont({ messageId, userId, username, content }) {
    return (
        <div key={messageId} className={'my-1'}>
            <Avatar userId={userId} username={username} />
            <div className={'text-left inline-block py-2 px-3 ml-8 text-sm receiver text-gray-600 rounded-b-xl rounded-tr-xl'}>
                {content}
            </div>
        </div>
    )
}
