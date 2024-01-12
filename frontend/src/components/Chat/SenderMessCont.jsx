import React from 'react'

export default function SenderMessCont({ messageId, content }) {
    return (
        <div key={messageId} className={'text-right'}>
            <div className={'text-left inline-block py-2 px-3 my-1 mr-2 text-sm sender text-white rounded-t-xl rounded-bl-xl'}>
                {content}
            </div>
        </div>
    )
}
