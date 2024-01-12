import React from 'react'

const InappropriateMess = () => {
    return (
        <div className='text-right'>
            <div className={'bg-red-400 text-left inline-block p-2 my-2 rounded-md text-sm '}>
                <div className='flex items-center gap-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    <p>Message could not be sent since it was considered <strong><i>inappropriate</i></strong></p>
                </div>
            </div>
        </div>
    )
}

export default InappropriateMess;